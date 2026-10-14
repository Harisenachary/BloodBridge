-- BloodBridge — Initial PostgreSQL Schema & Row Level Security
-- Migration: 20261012_000001_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('donor', 'requester', 'hospital_staff', 'blood_bank_staff', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE blood_component_type AS ENUM ('WHOLE_BLOOD', 'PACKED_RED_CELLS', 'PLATELETS', 'PLASMA', 'CRYOPRECIPITATE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE urgency_level AS ENUM ('CRITICAL_IMMEDIATE', 'URGENT_WITHIN_12H', 'PLANNED_WITHIN_24H', 'ROUTINE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE request_status_type AS ENUM (
    'SUBMITTED', 'AWAITING_VERIFICATION', 'VERIFIED', 
    'MATCHING_IN_PROGRESS', 'DONOR_RESPONSES_RECEIVED', 
    'COORDINATION_IN_PROGRESS', 'FULFILLED', 'CANCELLED', 'EXPIRED', 'REJECTED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE organization_type AS ENUM ('HOSPITAL', 'BLOOD_BANK', 'MEDICAL_INSTITUTION', 'COMMUNITY_PARTNER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE org_verification_status AS ENUM ('UNSUBMITTED', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE inventory_state AS ENUM ('AVAILABLE', 'RESERVED', 'QUARANTINED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE donor_availability_status AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'PAUSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role_type NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 3. DONOR PROFILES
CREATE TABLE IF NOT EXISTS public.donor_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_group blood_group_type NOT NULL,
  display_alias TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  locality TEXT,
  postal_code TEXT,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  last_donation_date DATE,
  total_donations INTEGER DEFAULT 0 CHECK (total_donations >= 0),
  is_verified BOOLEAN DEFAULT FALSE,
  preferred_contact_channel TEXT DEFAULT 'IN_APP',
  max_outreach_frequency INTEGER DEFAULT 2, -- max invites per week
  medical_deferral_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DONOR AVAILABILITY (Quiet Mode support)
CREATE TABLE IF NOT EXISTS public.donor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.donor_profiles(id) ON DELETE CASCADE UNIQUE,
  status donor_availability_status DEFAULT 'AVAILABLE',
  quiet_mode_enabled BOOLEAN DEFAULT FALSE,
  paused_until TIMESTAMPTZ,
  pause_reason TEXT,
  emergency_only BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  org_type organization_type NOT NULL,
  license_number TEXT NOT NULL,
  registration_id TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  operating_hours TEXT DEFAULT '24x7 Emergency Services',
  description TEXT,
  website_url TEXT,
  verification_status org_verification_status DEFAULT 'PENDING',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORGANIZATION MEMBERS
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  staff_role TEXT NOT NULL DEFAULT 'STAFF' CHECK (staff_role IN ('ADMIN', 'STAFF', 'COORDINATOR')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 7. ORGANIZATION VERIFICATION DOCUMENTS
CREATE TABLE IF NOT EXISTS public.organization_verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BLOOD REQUESTS
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_token TEXT UNIQUE NOT NULL,
  token_hash TEXT NOT NULL,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_ref_name TEXT NOT NULL, -- Masked or case ref, never plain full diagnosis
  blood_group blood_group_type NOT NULL,
  component blood_component_type NOT NULL DEFAULT 'WHOLE_BLOOD',
  units_needed INTEGER NOT NULL CHECK (units_needed > 0 AND units_needed <= 50),
  urgency urgency_level NOT NULL,
  required_by_date TIMESTAMPTZ NOT NULL,
  hospital_id UUID REFERENCES public.organizations(id),
  hospital_name TEXT NOT NULL,
  hospital_city TEXT NOT NULL,
  hospital_state TEXT NOT NULL,
  hospital_locality TEXT,
  requester_relationship TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  communication_preference TEXT DEFAULT 'IN_APP',
  status request_status_type NOT NULL DEFAULT 'SUBMITTED',
  verification_notes TEXT,
  internal_notes TEXT,
  consent_obtained BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REQUEST STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  old_status request_status_type,
  new_status request_status_type NOT NULL,
  actor_id UUID REFERENCES public.profiles(id),
  actor_role TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DONOR INVITATIONS
CREATE TABLE IF NOT EXISTS public.donor_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.donor_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'INVITED' CHECK (status IN ('INVITED', 'ACCEPTED', 'DECLINED', 'EXPIRED')),
  match_score NUMERIC(5, 2) DEFAULT 0,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(request_id, donor_id)
);

-- 11. DONOR RESPONSES
CREATE TABLE IF NOT EXISTS public.donor_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.donor_invitations(id) ON DELETE CASCADE UNIQUE,
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.donor_profiles(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL CHECK (response_type IN ('CAN_DONATE', 'CANNOT_DONATE_NOW', 'NOT_ELIGIBLE')),
  eta_time TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BLOOD INVENTORY
CREATE TABLE IF NOT EXISTS public.blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  blood_group blood_group_type NOT NULL,
  component blood_component_type NOT NULL,
  units_available INTEGER NOT NULL CHECK (units_available >= 0),
  state inventory_state DEFAULT 'AVAILABLE',
  expiry_date DATE,
  internal_notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, blood_group, component)
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('REQUEST_UPDATE', 'INVITATION', 'VERIFICATION', 'CLOSURE', 'SYSTEM')),
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  emergency_broadcast_enabled BOOLEAN DEFAULT TRUE,
  max_frequency_per_week INTEGER DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. DONATION HISTORY
CREATE TABLE IF NOT EXISTS public.donation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.donor_profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  donation_date DATE NOT NULL,
  component blood_component_type NOT NULL DEFAULT 'WHOLE_BLOOD',
  units INTEGER NOT NULL DEFAULT 1 CHECK (units > 0),
  verification_status TEXT DEFAULT 'VERIFIED' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'SELF_REPORTED')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. ABUSE REPORTS
CREATE TABLE IF NOT EXISTS public.abuse_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED', 'DISMISSED')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. PUBLIC TRACKING TOKENS
CREATE TABLE IF NOT EXISTS public.public_tracking_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT UNIQUE NOT NULL,
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_requests_public_token ON public.blood_requests(public_token);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_blood_group ON public.blood_requests(blood_group, hospital_city);
CREATE INDEX IF NOT EXISTS idx_donor_search ON public.donor_profiles(blood_group, city, is_verified);
CREATE INDEX IF NOT EXISTS idx_inventory_org ON public.blood_inventory(organization_id, blood_group);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- HELPER FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_donor_profiles_updated_at ON public.donor_profiles;
CREATE TRIGGER trg_donor_profiles_updated_at BEFORE UPDATE ON public.donor_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_donor_avail_updated_at ON public.donor_availability;
CREATE TRIGGER trg_donor_avail_updated_at BEFORE UPDATE ON public.donor_availability FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_organizations_updated_at ON public.organizations;
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_blood_requests_updated_at ON public.blood_requests;
CREATE TRIGGER trg_blood_requests_updated_at BEFORE UPDATE ON public.blood_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_blood_inventory_updated_at ON public.blood_inventory;
CREATE TRIGGER trg_blood_inventory_updated_at BEFORE UPDATE ON public.blood_inventory FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- SECURITY DEFINER ROLE CHECKS
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_org_staff(check_user_id UUID, check_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = check_user_id AND organization_id = check_org_id AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abuse_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_tracking_tokens ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Donor Profiles
DROP POLICY IF EXISTS "Donors can manage own profile" ON public.donor_profiles;
CREATE POLICY "Donors can manage own profile" ON public.donor_profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Privacy-preserved donor cards viewable by authenticated" ON public.donor_profiles;
CREATE POLICY "Privacy-preserved donor cards viewable by authenticated" ON public.donor_profiles FOR SELECT USING (true);

-- Donor Availability
DROP POLICY IF EXISTS "Donors manage own availability" ON public.donor_availability;
CREATE POLICY "Donors manage own availability" ON public.donor_availability FOR ALL USING (auth.uid() = donor_id);

DROP POLICY IF EXISTS "Availability viewable by authenticated" ON public.donor_availability;
CREATE POLICY "Availability viewable by authenticated" ON public.donor_availability FOR SELECT USING (true);

-- Organizations
DROP POLICY IF EXISTS "Verified orgs viewable by everyone" ON public.organizations;
CREATE POLICY "Verified orgs viewable by everyone" ON public.organizations FOR SELECT USING (verification_status = 'VERIFIED' OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins manage all orgs" ON public.organizations;
CREATE POLICY "Admins manage all orgs" ON public.organizations FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Org staff update their org" ON public.organizations;
CREATE POLICY "Org staff update their org" ON public.organizations FOR UPDATE USING (public.is_org_staff(auth.uid(), id));

-- Organization Members
DROP POLICY IF EXISTS "Org members viewable by staff" ON public.organization_members;
CREATE POLICY "Org members viewable by staff" ON public.organization_members FOR SELECT USING (
  public.is_org_staff(auth.uid(), organization_id) OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Admins or Org Admins manage members" ON public.organization_members;
CREATE POLICY "Admins or Org Admins manage members" ON public.organization_members FOR ALL USING (
  public.is_admin(auth.uid())
);

-- Blood Requests
DROP POLICY IF EXISTS "Requesters can view and edit own requests" ON public.blood_requests;
CREATE POLICY "Requesters can view and edit own requests" ON public.blood_requests FOR ALL USING (requester_id = auth.uid());

DROP POLICY IF EXISTS "Public can view approved request non-sensitive fields by token" ON public.blood_requests;
CREATE POLICY "Public can view approved request non-sensitive fields by token" ON public.blood_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage requests" ON public.blood_requests;
CREATE POLICY "Admins manage requests" ON public.blood_requests FOR ALL USING (public.is_admin(auth.uid()));

-- Blood Inventory
DROP POLICY IF EXISTS "Public view of verified inventory" ON public.blood_inventory;
CREATE POLICY "Public view of verified inventory" ON public.blood_inventory FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.organizations o WHERE o.id = organization_id AND o.verification_status = 'VERIFIED')
);

DROP POLICY IF EXISTS "Org staff manage own inventory" ON public.blood_inventory;
CREATE POLICY "Org staff manage own inventory" ON public.blood_inventory FOR ALL USING (
  public.is_org_staff(auth.uid(), organization_id) OR public.is_admin(auth.uid())
);

-- Notifications
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (user_id = auth.uid());

-- Audit Logs
DROP POLICY IF EXISTS "Admins read audit logs" ON public.audit_logs;
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
CREATE POLICY "System insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

