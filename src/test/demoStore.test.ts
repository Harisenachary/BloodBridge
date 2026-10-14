import { describe, it, expect, beforeEach } from 'vitest';
import { demoStore } from '@/lib/demo/demoStore';

describe('DemoStore State & Repository Management', () => {
  beforeEach(() => {
    demoStore.resetToDefaultDemo();
  });

  it('initializes with seed organizations, donors, and requests', () => {
    expect(demoStore.getOrganizations().length).toBeGreaterThan(0);
    expect(demoStore.getDonors().length).toBeGreaterThan(0);
    expect(demoStore.getRequests().length).toBeGreaterThan(0);
  });

  it('creates new request and generates non-empty public tracking token and audit log', async () => {
    const initialRequests = demoStore.getRequests().length;
    const initialLogs = demoStore.getAuditLogs().length;

    const newReq = await demoStore.createRequest({
      patient_ref_name: 'Test Emergency',
      blood_group: 'O-',
      component: 'PACKED_RED_CELLS',
      units_needed: 2,
      urgency: 'CRITICAL_IMMEDIATE',
      required_by_date: new Date().toISOString(),
      hospital_name: 'AIIMS Delhi',
      hospital_city: 'New Delhi',
      hospital_state: 'Delhi',
      requester_relationship: 'Physician',
      contact_phone: '+91 98765 43210',
      communication_preference: 'IN_APP',
      consent_obtained: true,
    });

    expect(newReq.public_token).toMatch(/^BB-/);
    expect(demoStore.getRequests().length).toBe(initialRequests + 1);
    expect(demoStore.getAuditLogs().length).toBe(initialLogs + 1);

    // Retrieve by token
    const fetched = demoStore.getRequestByToken(newReq.public_token);
    expect(fetched).toBeDefined();
    expect(fetched?.patient_ref_name).toBe('Test Emergency');
  });

  it('transitions request status with audit tracking', () => {
    const req = demoStore.getRequests()[0];
    demoStore.updateRequestStatus(req.id, 'VERIFIED', 'Dr. Test Officer', 'HOSPITAL_STAFF', 'Verified bed chart');

    const updated = demoStore.getRequestById(req.id);
    expect(updated?.status).toBe('VERIFIED');

    const history = demoStore.getRequestHistory(req.id);
    expect(history.some((h) => h.new_status === 'VERIFIED')).toBe(true);
  });

  it('prevents negative stock updates in inventory', () => {
    const item = demoStore.getInventory()[0];
    demoStore.updateInventoryUnits(item.id, -5);

    const updated = demoStore.getInventory().find((i) => i.id === item.id);
    expect(updated?.units_available).toBe(0); // Clamped to non-negative 0
  });
});
