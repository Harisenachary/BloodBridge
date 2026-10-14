// BloodBridge Clinical Compatibility and Deterministic Donor Matching Engine
// IMPORTANT: This matching service ranks candidate suitability for coordination.
// It is NOT a medical clearance or definitive transfusion recommendation.
// Final cross-matching, antibody screening, and medical clearance MUST be executed
// by licensed transfusion medicine specialists at the treating hospital/blood bank.

import { BloodGroup, BloodComponent, DonorProfile, BloodRequest, MatchScoreBreakdown } from '@/types';

// Standard Clinical Red Blood Cell / Whole Blood Compatibility Matrix
// Key = Recipient Blood Group, Value = Permissible Donor Blood Groups
export const RBC_COMPATIBILITY_MATRIX: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

// Standard Clinical Plasma Compatibility Matrix (Inverse of RBC due to circulating isohemagglutinins)
// Key = Recipient Blood Group, Value = Permissible Plasma Donor Blood Groups
export const PLASMA_COMPATIBILITY_MATRIX: Record<BloodGroup, BloodGroup[]> = {
  'AB+': ['AB+', 'AB-'],
  'AB-': ['AB+', 'AB-'],
  'A+': ['A+', 'A-', 'AB+', 'AB-'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'B+': ['B+', 'B-', 'AB+', 'AB-'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'O+': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
  'O-': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
};

// Standard Platelet Compatibility (ABO match preferred, Rh matching prioritized)
export const PLATELET_COMPATIBILITY_MATRIX: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
};

/**
 * Evaluates whether a donor blood group can provide the specified component to a recipient
 */
export function checkClinicalCompatibility(
  recipientGroup: BloodGroup,
  donorGroup: BloodGroup,
  component: BloodComponent = 'WHOLE_BLOOD'
): boolean {
  if (component === 'PLASMA' || component === 'CRYOPRECIPITATE') {
    return (PLASMA_COMPATIBILITY_MATRIX[recipientGroup] || []).includes(donorGroup);
  }
  if (component === 'PLATELETS') {
    return (PLATELET_COMPATIBILITY_MATRIX[recipientGroup] || []).includes(donorGroup);
  }
  // Default: Whole blood and Packed Red Cells
  return (RBC_COMPATIBILITY_MATRIX[recipientGroup] || []).includes(donorGroup);
}

/**
 * Calculates deterministic match score and explainable breakdown
 */
export function calculateMatchScore(
  request: BloodRequest,
  donor: DonorProfile
): MatchScoreBreakdown {
  const reasons: string[] = [];

  // 1. Clinical Compatibility (Max 40 points)
  const isCompatible = checkClinicalCompatibility(
    request.blood_group,
    donor.blood_group,
    request.component
  );

  let clinicalScore = 0;
  if (isCompatible) {
    if (donor.blood_group === request.blood_group) {
      clinicalScore = 40;
      reasons.push(`Exact ABO/Rh match (${donor.blood_group})`);
    } else {
      clinicalScore = 32;
      reasons.push(`Clinically compatible alternative donor (${donor.blood_group} for ${request.blood_group})`);
    }
  } else {
    reasons.push(`Clinically incompatible blood group (${donor.blood_group} cannot donate ${request.component} to ${request.blood_group})`);
  }

  // 2. Proximity & Geographic Relevance (Max 25 points)
  let proximityScore = 5;
  const sameCity = donor.city.trim().toLowerCase() === request.hospital_city.trim().toLowerCase();
  const sameState = donor.state.trim().toLowerCase() === request.hospital_state.trim().toLowerCase();

  if (sameCity) {
    proximityScore = 25;
    reasons.push(`Located in same city (${donor.city})`);
    if (request.hospital_locality && donor.locality &&
        request.hospital_locality.trim().toLowerCase() === donor.locality.trim().toLowerCase()) {
      reasons.push(`Located in same locality (${donor.locality})`);
    }
  } else if (sameState) {
    proximityScore = 15;
    reasons.push(`Located in same state (${donor.state})`);
  } else {
    reasons.push(`Interstate donor (${donor.city}, ${donor.state})`);
  }

  // 3. Availability & Quiet Mode (Max 20 points)
  let availabilityScore = 0;
  const avail = donor.availability;
  const isQuiet = avail?.quiet_mode_enabled || avail?.status === 'PAUSED';

  if (!avail || avail.status === 'AVAILABLE') {
    availabilityScore = 20;
    reasons.push('Actively available for emergency outreach');
  } else if (avail.status === 'PAUSED' || avail.quiet_mode_enabled) {
    if (avail.emergency_only && request.urgency === 'CRITICAL_IMMEDIATE') {
      availabilityScore = 12;
      reasons.push('Donor in Quiet Mode, but accepts critical life-threatening emergency requests');
    } else {
      availabilityScore = 0;
      reasons.push('Donor currently in Quiet Mode (outreach suppressed)');
    }
  } else {
    availabilityScore = 0;
    reasons.push('Donor marked unavailable');
  }

  // Check voluntary medical deferral interval (e.g., 90 days for whole blood)
  if (donor.medical_deferral_until) {
    const deferralDate = new Date(donor.medical_deferral_until);
    if (deferralDate > new Date()) {
      availabilityScore = 0;
      reasons.push(`Self-reported deferral period active until ${donor.medical_deferral_until}`);
    }
  }

  // 4. Outreach Frequency & Fair Distribution (Max 15 points)
  let frequencyScore = 15;
  if (donor.max_outreach_frequency && donor.max_outreach_frequency <= 1) {
    frequencyScore = 10;
    reasons.push('Low frequency preference requested by donor');
  } else {
    reasons.push('Normal notification threshold');
  }

  if (donor.is_verified) {
    reasons.push('Verified voluntary donor profile');
  }

  const totalScore = isCompatible ? Math.round(clinicalScore + proximityScore + availabilityScore + frequencyScore) : 0;

  return {
    clinicalCompatibilityScore: clinicalScore,
    proximityScore,
    availabilityScore,
    frequencyScore,
    totalScore,
    isClinicallyCompatible: isCompatible,
    reasons,
  };
}

/**
 * Filter and rank donors for a given blood request
 */
export function rankEligibleDonors(
  request: BloodRequest,
  donors: DonorProfile[]
): Array<{ donor: DonorProfile; matchBreakdown: MatchScoreBreakdown }> {
  return donors
    .map((donor) => ({
      donor,
      matchBreakdown: calculateMatchScore(request, donor),
    }))
    .filter((item) => item.matchBreakdown.isClinicallyCompatible)
    .sort((a, b) => b.matchBreakdown.totalScore - a.matchBreakdown.totalScore);
}
