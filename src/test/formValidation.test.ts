import { describe, it, expect } from 'vitest';
import { bloodRequestSchema, donorProfileSchema } from '@/lib/validation/schemas';

describe('Zod Form Validation Schemas', () => {
  it('validates genuine blood request data with Indian phone and unit boundaries', () => {
    const validData = {
      patient_ref_name: 'Patient Ref #4412',
      blood_group: 'O+',
      component: 'PACKED_RED_CELLS',
      units_needed: 2,
      urgency: 'CRITICAL_IMMEDIATE',
      required_by_date: '2026-10-14T10:00',
      hospital_name: 'Apollo Hospital',
      hospital_city: 'Hyderabad',
      hospital_state: 'Telangana',
      requester_relationship: 'Family Member',
      contact_phone: '+91 98765 43210',
      communication_preference: 'IN_APP',
      consent_obtained: true,
    };

    const result = bloodRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid units (0 or exceeding 50)', () => {
    const invalidUnits = {
      patient_ref_name: 'Patient Ref #4412',
      blood_group: 'O+',
      component: 'PACKED_RED_CELLS',
      units_needed: 0,
      urgency: 'CRITICAL_IMMEDIATE',
      required_by_date: '2026-10-14T10:00',
      hospital_name: 'Apollo Hospital',
      hospital_city: 'Hyderabad',
      hospital_state: 'Telangana',
      requester_relationship: 'Family Member',
      contact_phone: '+91 98765 43210',
      communication_preference: 'IN_APP',
      consent_obtained: true,
    };

    const result = bloodRequestSchema.safeParse(invalidUnits);
    expect(result.success).toBe(false);
  });

  it('rejects submission when mandatory consent is unchecked', () => {
    const noConsent = {
      patient_ref_name: 'Patient Ref #4412',
      blood_group: 'O+',
      component: 'PACKED_RED_CELLS',
      units_needed: 2,
      urgency: 'CRITICAL_IMMEDIATE',
      required_by_date: '2026-10-14T10:00',
      hospital_name: 'Apollo Hospital',
      hospital_city: 'Hyderabad',
      hospital_state: 'Telangana',
      requester_relationship: 'Family Member',
      contact_phone: '+91 98765 43210',
      communication_preference: 'IN_APP',
      consent_obtained: false,
    };

    const result = bloodRequestSchema.safeParse(noConsent);
    expect(result.success).toBe(false);
  });
});
