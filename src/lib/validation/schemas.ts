// Zod validation schemas for client and server validation

import { z } from 'zod';

export const bloodGroupEnum = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

export const bloodComponentEnum = z.enum([
  'WHOLE_BLOOD',
  'PACKED_RED_CELLS',
  'PLATELETS',
  'PLASMA',
  'CRYOPRECIPITATE',
  'OTHER',
]);

export const urgencyEnum = z.enum([
  'CRITICAL_IMMEDIATE',
  'URGENT_WITHIN_12H',
  'PLANNED_WITHIN_24H',
  'ROUTINE',
]);

export const indianPhoneRegex = /^(\+91[\-\s]?)?[6789]\d{4}[\s\-]?\d{5}$|^(\+91[\-\s]?)?[6789]\d{9}$/;

export const bloodRequestSchema = z.object({
  patient_ref_name: z
    .string()
    .min(2, 'Patient reference name or case ID is required')
    .max(50, 'Max 50 characters for privacy protection'),
  blood_group: bloodGroupEnum,
  component: bloodComponentEnum,
  units_needed: z
    .number()
    .int('Units must be a whole number')
    .min(1, 'At least 1 unit is required')
    .max(50, 'Maximum 50 units allowed per single request'),
  urgency: urgencyEnum,
  required_by_date: z.string().min(1, 'Required-by date and time are mandatory'),
  hospital_name: z.string().min(3, 'Hospital or facility name is required'),
  hospital_city: z.string().min(2, 'City is required'),
  hospital_state: z.string().min(2, 'State is required'),
  hospital_locality: z.string().optional(),
  requester_relationship: z.string().min(2, 'Please state relationship or role (e.g. Attendant, Doctor, Relative)'),
  contact_phone: z
    .string()
    .regex(indianPhoneRegex, 'Please enter a valid 10-digit mobile number (e.g., 9876543210 or +91 9876543210)'),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  communication_preference: z.enum(['IN_APP', 'PHONE_CALL', 'WHATSAPP']),
  internal_notes: z.string().max(500, 'Max 500 characters').optional(),
  consent_obtained: z.literal(true, {
    message: 'You must acknowledge coordination limitations and provide consent',
  }),
});

export type BloodRequestFormData = z.infer<typeof bloodRequestSchema>;

export const donorProfileSchema = z.object({
  display_alias: z.string().min(2, 'Display name or alias is required').max(30),
  blood_group: bloodGroupEnum,
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  locality: z.string().optional(),
  postal_code: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN code').optional().or(z.literal('')),
  last_donation_date: z.string().optional(),
  preferred_contact_channel: z.enum(['IN_APP', 'SMS', 'WHATSAPP']),
  max_outreach_frequency: z.number().min(1).max(7),
  emergency_only: z.boolean().default(false),
});

export type DonorProfileFormData = z.infer<typeof donorProfileSchema>;

export const organizationSchema = z.object({
  legal_name: z.string().min(3, 'Legal institution name is required'),
  display_name: z.string().min(2, 'Display name is required'),
  org_type: z.enum(['HOSPITAL', 'BLOOD_BANK', 'MEDICAL_INSTITUTION', 'COMMUNITY_PARTNER']),
  license_number: z.string().min(3, 'Official license or registration number is required'),
  address: z.string().min(5, 'Full street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN code'),
  contact_phone: z.string().regex(indianPhoneRegex, 'Valid phone number required'),
  contact_email: z.string().email('Valid official institutional email required'),
  operating_hours: z.string().default('24x7 Emergency Services'),
  description: z.string().optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

export const inventoryItemSchema = z.object({
  blood_group: bloodGroupEnum,
  component: bloodComponentEnum,
  units_available: z.number().int().min(0, 'Units cannot be negative'),
  state: z.enum(['AVAILABLE', 'RESERVED', 'QUARANTINED']),
  expiry_date: z.string().optional(),
  internal_notes: z.string().max(200).optional(),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
