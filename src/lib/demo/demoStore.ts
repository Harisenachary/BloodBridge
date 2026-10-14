// Stateful in-memory and LocalStorage repository for Demo Mode

import {
  BloodRequest,
  DonorProfile,
  Organization,
  BloodInventoryItem,
  RequestStatusHistory,
  InAppNotification,
  AuditLog,
  RequestStatus,
  UserRole,
  BloodReservation,
  BloodGroup,
  BloodComponent,
  UrgencyLevel,
} from '@/types';
import {
  DEMO_REQUESTS,
  DEMO_DONORS,
  DEMO_ORGANIZATIONS,
  DEMO_INVENTORY,
  DEMO_STATUS_HISTORY,
  DEMO_NOTIFICATIONS,
  DEMO_AUDIT_LOGS,
  DEMO_RESERVATIONS,
} from './demoData';
import { generateTrackingToken, hashTrackingToken } from '../security/tokens';

const STORAGE_KEY_PREFIX = 'bloodbridge_demo_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

class DemoStore {
  private requests: BloodRequest[] = loadFromStorage('requests', DEMO_REQUESTS);
  private donors: DonorProfile[] = loadFromStorage('donors', DEMO_DONORS);
  private organizations: Organization[] = loadFromStorage('orgs', DEMO_ORGANIZATIONS);
  private inventory: BloodInventoryItem[] = loadFromStorage('inventory', DEMO_INVENTORY);
  private reservations: BloodReservation[] = loadFromStorage('reservations', DEMO_RESERVATIONS);
  private statusHistory: Record<string, RequestStatusHistory[]> = loadFromStorage('history', DEMO_STATUS_HISTORY);
  private notifications: InAppNotification[] = loadFromStorage('notifs', DEMO_NOTIFICATIONS);
  private auditLogs: AuditLog[] = loadFromStorage('audit', DEMO_AUDIT_LOGS);

  // Active persona for UI role previewing (defaults to unauthenticated public visitor)
  private activeRole: UserRole | 'public' = loadFromStorage('active_role', 'public');

  public getActiveRole(): UserRole | 'public' {
    return this.activeRole;
  }

  public setActiveRole(role: UserRole | 'public'): void {
    this.activeRole = role;
    saveToStorage('active_role', role);
  }

  // --- Requests ---
  public getRequests(): BloodRequest[] {
    return [...this.requests];
  }

  public getRequestById(id: string): BloodRequest | undefined {
    return this.requests.find((r) => r.id === id);
  }

  public getRequestByToken(token: string): BloodRequest | undefined {
    const cleanToken = token.trim().toUpperCase();
    return this.requests.find((r) => r.public_token.toUpperCase() === cleanToken);
  }

  public async createRequest(
    data: Omit<BloodRequest, 'id' | 'public_token' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<BloodRequest> {
    const id = `req-${Date.now()}`;
    const publicToken = generateTrackingToken();
    const tokenHash = await hashTrackingToken(publicToken);

    const newRequest: BloodRequest = {
      ...data,
      id,
      public_token: publicToken,
      token_hash: tokenHash,
      status: 'SUBMITTED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.requests.unshift(newRequest);
    saveToStorage('requests', this.requests);

    // Initial Status History
    this.statusHistory[id] = [
      {
        id: `h-${Date.now()}`,
        request_id: id,
        new_status: 'SUBMITTED',
        actor_role: 'REQUESTER',
        notes: 'Requirement registered securely via BloodBridge. Awaiting medical verification.',
        created_at: new Date().toISOString(),
      },
    ];
    saveToStorage('history', this.statusHistory);

    // Audit Log
    this.addAuditLog('BLOOD_REQUEST_CREATED', 'blood_requests', id, {
      urgency: newRequest.urgency,
      blood_group: newRequest.blood_group,
      hospital: newRequest.hospital_name,
    });

    return newRequest;
  }

  public updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
    actorName: string,
    actorRole: string,
    notes?: string
  ): BloodRequest | undefined {
    const reqIndex = this.requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return undefined;

    const oldStatus = this.requests[reqIndex].status;
    this.requests[reqIndex] = {
      ...this.requests[reqIndex],
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    saveToStorage('requests', this.requests);

    // Append to status history
    if (!this.statusHistory[requestId]) {
      this.statusHistory[requestId] = [];
    }
    this.statusHistory[requestId].push({
      id: `h-${Date.now()}`,
      request_id: requestId,
      old_status: oldStatus,
      new_status: newStatus,
      actor_name: actorName,
      actor_role: actorRole,
      notes,
      created_at: new Date().toISOString(),
    });
    saveToStorage('history', this.statusHistory);

    // Add Audit Log
    this.addAuditLog('REQUEST_STATUS_TRANSITION', 'blood_requests', requestId, {
      old_status: oldStatus,
      new_status: newStatus,
      actor_role: actorRole,
    });

    // Notify requester if fulfilled or cancelled
    if (newStatus === 'FULFILLED' || newStatus === 'CANCELLED') {
      this.addNotification(
        'user-requester-1',
        `Blood Request #${requestId} ${newStatus}`,
        `Your request status has been updated to ${newStatus}. ${notes || ''}`,
        'CLOSURE',
        `/request-status/${this.requests[reqIndex].public_token}`
      );
    }

    return this.requests[reqIndex];
  }

  public getRequestHistory(requestId: string): RequestStatusHistory[] {
    return this.statusHistory[requestId] || [];
  }

  // --- Donors ---
  public getDonors(): DonorProfile[] {
    return [...this.donors];
  }

  public getDonorById(id: string): DonorProfile | undefined {
    return this.donors.find((d) => d.id === id);
  }

  public updateDonorAvailability(
    donorId: string,
    status: 'AVAILABLE' | 'UNAVAILABLE' | 'PAUSED',
    quietMode: boolean,
    pausedUntil?: string,
    emergencyOnly: boolean = false
  ): DonorProfile | undefined {
    const idx = this.donors.findIndex((d) => d.id === donorId);
    if (idx === -1) return undefined;

    this.donors[idx] = {
      ...this.donors[idx],
      updated_at: new Date().toISOString(),
      availability: {
        id: this.donors[idx].availability?.id || `avail-${donorId}`,
        donor_id: donorId,
        status,
        quiet_mode_enabled: quietMode,
        paused_until: pausedUntil,
        emergency_only: emergencyOnly,
        updated_at: new Date().toISOString(),
      },
    };

    saveToStorage('donors', this.donors);

    this.addAuditLog('DONOR_AVAILABILITY_CHANGED', 'donor_availability', donorId, {
      status,
      quietMode,
      emergencyOnly,
    });

    return this.donors[idx];
  }

  // --- Organizations ---
  public getOrganizations(): Organization[] {
    return [...this.organizations];
  }

  public getOrganizationById(id: string): Organization | undefined {
    return this.organizations.find((o) => o.id === id);
  }

  public updateOrgVerification(orgId: string, status: Organization['verification_status']): void {
    const idx = this.organizations.findIndex((o) => o.id === orgId);
    if (idx !== -1) {
      this.organizations[idx] = {
        ...this.organizations[idx],
        verification_status: status,
        verified_at: status === 'VERIFIED' ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      };
      saveToStorage('orgs', this.organizations);
      this.addAuditLog('ORG_VERIFICATION_STATUS_CHANGED', 'organizations', orgId, { status });
    }
  }

  // --- Inventory ---
  public getInventory(orgId?: string): BloodInventoryItem[] {
    let items = [...this.inventory];
    if (orgId) {
      items = items.filter((i) => i.organization_id === orgId);
    }
    return items.map((i) => ({
      ...i,
      organization: this.getOrganizationById(i.organization_id),
    }));
  }

  public updateInventoryUnits(
    itemId: string,
    newUnits: number,
    state: BloodInventoryItem['state'] = 'AVAILABLE'
  ): void {
    const idx = this.inventory.findIndex((i) => i.id === itemId);
    if (idx !== -1) {
      this.inventory[idx] = {
        ...this.inventory[idx],
        units_available: Math.max(0, newUnits),
        state,
        updated_at: new Date().toISOString(),
      };
      saveToStorage('inventory', this.inventory);
      this.addAuditLog('INVENTORY_STOCK_UPDATED', 'blood_inventory', itemId, {
        newUnits,
        state,
      });
    }
  }

  // --- Notifications ---
  public getNotifications(userId?: string): InAppNotification[] {
    if (userId) {
      return this.notifications.filter((n) => n.user_id === userId);
    }
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string): void {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      this.notifications[idx].is_read = true;
      saveToStorage('notifs', this.notifications);
    }
  }

  public addNotification(
    userId: string,
    title: string,
    message: string,
    type: InAppNotification['type'],
    linkUrl?: string
  ): void {
    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      user_id: userId,
      title,
      message,
      type,
      link_url: linkUrl,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    saveToStorage('notifs', this.notifications);
  }

  // --- Reservations (Reserve & Collect Blood Units) ---
  public getReservations(): BloodReservation[] {
    return [...this.reservations];
  }

  public getReservationByCode(code: string): BloodReservation | undefined {
    return this.reservations.find(
      (r) => r.reservation_code.toUpperCase() === code.trim().toUpperCase()
    );
  }

  public createReservation(data: {
    patient_name: string;
    contact_phone: string;
    organization_id: string;
    blood_group: BloodGroup;
    component: BloodComponent;
    units_reserved: number;
    urgency: UrgencyLevel;
    pickup_window?: string;
    notes?: string;
  }): BloodReservation {
    const org = this.getOrganizationById(data.organization_id);
    const orgName = org ? org.display_name : 'Verified Blood Centre';
    const orgAddress = org ? org.address : 'Hospital Blood Bank Bay';
    const orgCity = org ? org.city : 'Local City';
    const orgPhone = org ? org.contact_phone : '+91 40 2360 7777';

    // Decrement inventory if available
    const invItem = this.inventory.find(
      (i) =>
        i.organization_id === data.organization_id &&
        i.blood_group === data.blood_group &&
        i.component === data.component
    );
    if (invItem) {
      invItem.units_available = Math.max(0, invItem.units_available - data.units_reserved);
      saveToStorage('inventory', this.inventory);
    }

    const cityPrefix = orgCity.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'MED';
    const code = `BB-RES-${cityPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `res-${Date.now()}`;

    const newReservation: BloodReservation = {
      id,
      reservation_code: code,
      patient_name: data.patient_name,
      contact_phone: data.contact_phone,
      organization_id: data.organization_id,
      organization_name: orgName,
      organization_address: orgAddress,
      organization_city: orgCity,
      organization_phone: orgPhone,
      blood_group: data.blood_group,
      component: data.component,
      units_reserved: data.units_reserved,
      urgency: data.urgency,
      collection_deadline: new Date(Date.now() + 3600000 * 12).toISOString(),
      pickup_window: data.pickup_window || 'Within 4 Hours (Reserved in Cold Chain)',
      notes: data.notes,
      status: 'CONFIRMED',
      created_at: new Date().toISOString(),
    };

    this.reservations.unshift(newReservation);
    saveToStorage('reservations', this.reservations);

    this.addAuditLog('BLOOD_UNIT_RESERVED', 'blood_reservations', id, {
      code,
      units: data.units_reserved,
      blood_group: data.blood_group,
      org: orgName,
    });

    return newReservation;
  }

  public cancelReservation(id: string): void {
    const idx = this.reservations.findIndex((r) => r.id === id);
    if (idx !== -1) {
      const res = this.reservations[idx];
      this.reservations[idx].status = 'CANCELLED';
      // Return units back to inventory
      const invItem = this.inventory.find(
        (i) =>
          i.organization_id === res.organization_id &&
          i.blood_group === res.blood_group &&
          i.component === res.component
      );
      if (invItem) {
        invItem.units_available += res.units_reserved;
        saveToStorage('inventory', this.inventory);
      }
      saveToStorage('reservations', this.reservations);
    }
  }

  public collectReservation(id: string): void {
    const idx = this.reservations.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.reservations[idx].status = 'COLLECTED';
      saveToStorage('reservations', this.reservations);
    }
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  private addAuditLog(
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, unknown>
  ): void {
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      actor_id: 'active-session-user',
      actor_role: this.activeRole.toUpperCase(),
      actor_name: `${this.activeRole.charAt(0).toUpperCase() + this.activeRole.slice(1)} User`,
      action,
      entity_type: entityType,
      entity_id: entityId,
      ip_address: '127.0.0.1 (Local Verified Client)',
      metadata,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    saveToStorage('audit', this.auditLogs);
  }

  // Reset to initial demo data
  public resetToDefaultDemo(): void {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'requests');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'donors');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'orgs');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'inventory');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'reservations');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'history');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'notifs');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'audit');
    this.requests = [...DEMO_REQUESTS];
    this.donors = [...DEMO_DONORS];
    this.organizations = [...DEMO_ORGANIZATIONS];
    this.inventory = [...DEMO_INVENTORY];
    this.reservations = [...DEMO_RESERVATIONS];
    this.statusHistory = { ...DEMO_STATUS_HISTORY };
    this.notifications = [...DEMO_NOTIFICATIONS];
    this.auditLogs = [...DEMO_AUDIT_LOGS];
  }
}

export const demoStore = new DemoStore();
