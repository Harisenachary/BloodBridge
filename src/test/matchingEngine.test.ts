import { describe, it, expect } from 'vitest';
import {
  checkClinicalCompatibility,
  calculateMatchScore,
  RBC_COMPATIBILITY_MATRIX,
  PLASMA_COMPATIBILITY_MATRIX,
} from '@/lib/matching/engine';
import { BloodRequest, DonorProfile } from '@/types';

describe('BloodBridge Clinical Matching Engine', () => {
  describe('Red Blood Cell / Whole Blood Compatibility', () => {
    it('O- recipient should only receive O- red cells', () => {
      expect(checkClinicalCompatibility('O-', 'O-', 'WHOLE_BLOOD')).toBe(true);
      expect(checkClinicalCompatibility('O-', 'O+', 'WHOLE_BLOOD')).toBe(false);
      expect(checkClinicalCompatibility('O-', 'A-', 'WHOLE_BLOOD')).toBe(false);
    });

    it('O- donor should be universal donor for all red cell recipients', () => {
      const recipientGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as const;
      recipientGroups.forEach((group) => {
        expect(checkClinicalCompatibility(group, 'O-', 'PACKED_RED_CELLS')).toBe(true);
      });
    });

    it('AB+ recipient should be universal recipient for red cells', () => {
      const donorGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as const;
      donorGroups.forEach((group) => {
        expect(checkClinicalCompatibility('AB+', group, 'PACKED_RED_CELLS')).toBe(true);
      });
    });

    it('A+ recipient can receive A+, A-, O+, O- but NOT B or AB', () => {
      expect(checkClinicalCompatibility('A+', 'A+', 'PACKED_RED_CELLS')).toBe(true);
      expect(checkClinicalCompatibility('A+', 'A-', 'PACKED_RED_CELLS')).toBe(true);
      expect(checkClinicalCompatibility('A+', 'O+', 'PACKED_RED_CELLS')).toBe(true);
      expect(checkClinicalCompatibility('A+', 'O-', 'PACKED_RED_CELLS')).toBe(true);
      expect(checkClinicalCompatibility('A+', 'B+', 'PACKED_RED_CELLS')).toBe(false);
      expect(checkClinicalCompatibility('A+', 'AB+', 'PACKED_RED_CELLS')).toBe(false);
    });
  });

  describe('Plasma Compatibility (Inverse Rule)', () => {
    it('AB recipient can receive only AB plasma (universal red cell recipient is restrictive plasma recipient)', () => {
      expect(checkClinicalCompatibility('AB+', 'AB+', 'PLASMA')).toBe(true);
      expect(checkClinicalCompatibility('AB+', 'AB-', 'PLASMA')).toBe(true);
      expect(checkClinicalCompatibility('AB+', 'O+', 'PLASMA')).toBe(false);
      expect(checkClinicalCompatibility('AB+', 'A+', 'PLASMA')).toBe(false);
    });

    it('O recipient can receive plasma from O, A, B, and AB donors', () => {
      expect(checkClinicalCompatibility('O+', 'AB+', 'PLASMA')).toBe(true);
      expect(checkClinicalCompatibility('O+', 'A+', 'PLASMA')).toBe(true);
      expect(checkClinicalCompatibility('O+', 'B+', 'PLASMA')).toBe(true);
      expect(checkClinicalCompatibility('O+', 'O+', 'PLASMA')).toBe(true);
    });
  });

  describe('Scoring Breakdown and Quiet Mode Penalty', () => {
    const mockRequest: BloodRequest = {
      id: 'req-test',
      public_token: 'BB-TRK-TEST-1234-5678',
      patient_ref_name: 'Patient Ref Test',
      blood_group: 'O-',
      component: 'PACKED_RED_CELLS',
      units_needed: 2,
      urgency: 'CRITICAL_IMMEDIATE',
      required_by_date: '2026-10-15T12:00:00Z',
      hospital_name: 'Apollo Hospital',
      hospital_city: 'Hyderabad',
      hospital_state: 'Telangana',
      requester_relationship: 'Family',
      contact_phone: '+91 98765 43210',
      communication_preference: 'IN_APP',
      status: 'MATCHING_IN_PROGRESS',
      consent_obtained: true,
      created_at: '2026-10-12T00:00:00Z',
      updated_at: '2026-10-12T00:00:00Z',
    };

    const mockDonor: DonorProfile = {
      id: 'donor-test',
      user_id: 'user-1',
      display_alias: 'Test Donor',
      blood_group: 'O-',
      city: 'Hyderabad',
      state: 'Telangana',
      locality: 'Jubilee Hills',
      total_donations: 5,
      is_verified: true,
      preferred_contact_channel: 'IN_APP',
      max_outreach_frequency: 2,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
      availability: {
        id: 'avail-1',
        donor_id: 'donor-test',
        status: 'AVAILABLE',
        quiet_mode_enabled: false,
        emergency_only: false,
        updated_at: '2026-10-01T00:00:00Z',
      },
    };

    it('Calculates high score for exact ABO match in same city when available', () => {
      const breakdown = calculateMatchScore(mockRequest, mockDonor);
      expect(breakdown.isClinicallyCompatible).toBe(true);
      expect(breakdown.clinicalCompatibilityScore).toBe(40);
      expect(breakdown.proximityScore).toBe(25);
      expect(breakdown.availabilityScore).toBe(20);
      expect(breakdown.totalScore).toBeGreaterThanOrEqual(90);
    });

    it('Reduces score to 0 when blood groups are incompatible', () => {
      const incompatibleDonor = { ...mockDonor, blood_group: 'A+' as const };
      const breakdown = calculateMatchScore(mockRequest, incompatibleDonor);
      expect(breakdown.isClinicallyCompatible).toBe(false);
      expect(breakdown.totalScore).toBe(0);
    });

    it('Respects donor Quiet Mode and deducts availability score unless trauma emergency exemption', () => {
      const quietDonor: DonorProfile = {
        ...mockDonor,
        availability: {
          id: 'avail-2',
          donor_id: 'donor-test',
          status: 'PAUSED',
          quiet_mode_enabled: true,
          emergency_only: false,
          updated_at: '2026-10-01T00:00:00Z',
        },
      };

      const breakdown = calculateMatchScore(mockRequest, quietDonor);
      expect(breakdown.availabilityScore).toBe(0);
      expect(breakdown.reasons.some((r) => r.includes('Quiet Mode'))).toBe(true);
    });
  });
});
