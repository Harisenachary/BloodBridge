// BloodBridge TypeScript Data Models & Types

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodComponent =
  | 'WHOLE_BLOOD'
  | 'PACKED_RED_CELLS'
  | 'PLATELETS'
  | 'PLASMA'
  | 'CRYOPRECIPITATE'
  | 'OTHER';

export type UrgencyLevel =
  | 'CRITICAL_IMMEDIATE'
  | 'URGENT_WITHIN_12H'
  | 'PLANNED_WITHIN_24H'
  | 'ROUTINE';

export type RequestStatus =
  | 'SUBMITTED'
  | 'AWAITING_VERIFICATION'
  | 'VERIFIED'
  | 'MATCHING_IN_PROGRESS'
  | 'DONOR_RESPONSES_RECEIVED'
  | 'COORDINATION_IN_PROGRESS'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REJECTED';

export type UserRole =
  | 'donor'
  | 'requester'
  | 'hospital_staff'
  | 'blood_bank_staff'
  | 'admin';

export type OrganizationType =
  | 'HOSPITAL'
  | 'BLOOD_BANK'
  | 'MEDICAL_INSTITUTION'
  | 'COMMUNITY_PARTNER';

export type OrgVerificationStatus =
  | 'UNSUBMITTED'
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED';

export type DonorAvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'PAUSED';

export type InventoryState = 'AVAILABLE' | 'RESERVED' | 'QUARANTINED';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  phone_verified?: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface DonorProfile {
  id: string;
  user_id: string;
  display_alias: string;
  blood_group: BloodGroup;
  city: string;
  state: string;
  locality?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  last_donation_date?: string;
  total_donations: number;
  is_verified: boolean;
  preferred_contact_channel: 'IN_APP' | 'SMS' | 'WHATSAPP';
  max_outreach_frequency: number;
  medical_deferral_until?: string;
  created_at: string;
  updated_at: string;
  // Availability attached
  availability?: DonorAvailability;
}

export interface DonorAvailability {
  id: string;
  donor_id: string;
  status: DonorAvailabilityStatus;
  quiet_mode_enabled: boolean;
  paused_until?: string;
  pause_reason?: string;
  emergency_only: boolean;
  updated_at: string;
}

export interface Organization {
  id: string;
  legal_name: string;
  display_name: string;
  org_type: OrganizationType;
  license_number: string;
  registration_id?: string;
  address: string;
  city: string;
  state: string;
  postal_code?: string;
  contact_phone: string;
  contact_email: string;
  operating_hours: string;
  description?: string;
  website_url?: string;
  verification_status: OrgVerificationStatus;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BloodInventoryItem {
  id: string;
  organization_id: string;
  blood_group: BloodGroup;
  component: BloodComponent;
  units_available: number;
  state: InventoryState;
  expiry_date?: string;
  internal_notes?: string;
  updated_at: string;
  organization?: Organization;
}

export interface BloodRequest {
  id: string;
  public_token: string;
  token_hash?: string;
  requester_id?: string;
  patient_ref_name: string;
  blood_group: BloodGroup;
  component: BloodComponent;
  units_needed: number;
  urgency: UrgencyLevel;
  required_by_date: string;
  hospital_id?: string;
  hospital_name: string;
  hospital_city: string;
  hospital_state: string;
  hospital_locality?: string;
  requester_relationship: string;
  contact_phone: string;
  contact_email?: string;
  communication_preference: string;
  status: RequestStatus;
  verification_notes?: string;
  internal_notes?: string;
  consent_obtained: boolean;
  created_at: string;
  updated_at: string;
}

export interface RequestStatusHistory {
  id: string;
  request_id: string;
  old_status?: RequestStatus;
  new_status: RequestStatus;
  actor_id?: string;
  actor_name?: string;
  actor_role?: string;
  notes?: string;
  created_at: string;
}

export interface DonorInvitation {
  id: string;
  request_id: string;
  donor_id: string;
  status: 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  match_score: number;
  invited_at: string;
  responded_at?: string;
  request?: BloodRequest;
  donor?: DonorProfile;
}

export interface DonorResponse {
  id: string;
  invitation_id: string;
  request_id: string;
  donor_id: string;
  response_type: 'CAN_DONATE' | 'CANNOT_DONATE_NOW' | 'NOT_ELIGIBLE';
  eta_time?: string;
  notes?: string;
  created_at: string;
}

export interface InAppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'REQUEST_UPDATE' | 'INVITATION' | 'VERIFICATION' | 'CLOSURE' | 'SYSTEM';
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface AbuseReport {
  id: string;
  reporter_id?: string;
  reported_request_id?: string;
  reported_user_id?: string;
  reason: string;
  details?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_role?: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface MatchScoreBreakdown {
  clinicalCompatibilityScore: number; // 0-40
  proximityScore: number;             // 0-25
  availabilityScore: number;          // 0-20
  frequencyScore: number;             // 0-15
  totalScore: number;                 // 0-100
  isClinicallyCompatible: boolean;
  reasons: string[];
}

export interface BloodReservation {
  id: string;
  reservation_code: string;
  patient_name: string;
  contact_phone: string;
  organization_id: string;
  organization_name: string;
  organization_address: string;
  organization_city: string;
  organization_phone: string;
  blood_group: BloodGroup;
  component: BloodComponent;
  units_reserved: number;
  urgency: UrgencyLevel;
  collection_deadline: string;
  pickup_window: string;
  notes?: string;
  status: 'CONFIRMED' | 'COLLECTED' | 'EXPIRED' | 'CANCELLED';
  created_at: string;
}

