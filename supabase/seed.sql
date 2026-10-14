-- BloodBridge — Seed Script (STRICTLY DEMO DATA FOR DEVELOPMENT & TESTING)
-- NOTE: All data herein is fictional and used solely for development and system demonstration.

-- Seed Organizations
INSERT INTO public.organizations (
  id, legal_name, display_name, org_type, license_number, registration_id, address, city, state, postal_code, contact_phone, contact_email, operating_hours, description, verification_status
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Apollo Hospitals Enterprise Ltd (DEMO)',
  'Apollo Hospital - Jubilee Hills',
  'HOSPITAL',
  'TS-HYD-HOSP-2024-081',
  'REG-TS-8941',
  'Road No 72, Film Nagar, Jubilee Hills',
  'Hyderabad',
  'Telangana',
  '500033',
  '+91 40 2360 7777',
  'bloodbank.jubilee@apollo-demo.org',
  '24x7 Emergency Blood Transfusion Unit',
  'Tertiary care multi-specialty facility equipped with 24x7 licensed apheresis and blood bank unit.',
  'VERIFIED'
),
(
  '00000000-0000-0000-0000-000000000002',
  'Indian Red Cross Society Central Blood Centre (DEMO)',
  'Red Cross Blood Centre - Hyderabad',
  'BLOOD_BANK',
  'TS-FDA-BB-2022-019',
  'REG-IRCS-4412',
  'Vidyanagar, Near Adikmet Flyover',
  'Hyderabad',
  'Telangana',
  '500044',
  '+91 40 2763 3491',
  'redcross.hyd@ircs-demo.org',
  '24x7 Blood Bank Services',
  'NABH accredited regional voluntary blood centre with high component separation capacity.',
  'VERIFIED'
),
(
  '00000000-0000-0000-0000-000000000003',
  'All India Institute of Medical Sciences (AIIMS) (DEMO)',
  'AIIMS Main Blood Bank',
  'HOSPITAL',
  'DL-DEL-BB-2020-001',
  'REG-AIIMS-1001',
  'Sri Aurobindo Marg, Ansari Nagar',
  'New Delhi',
  'Delhi',
  '110029',
  '+91 11 2658 8500',
  'bloodbank@aiims-demo.ac.in',
  '24x7 Trauma & Transfusion Services',
  'Apex public medical institution providing high-capacity voluntary donations and emergency processing.',
  'VERIFIED'
),
(
  '00000000-0000-0000-0000-000000000004',
  'Rotary TTK Blood Centre (DEMO)',
  'Rotary Blood Bank - Bengaluru',
  'BLOOD_BANK',
  'KA-BLR-BB-2021-042',
  'REG-ROT-2201',
  'New Thippasandra Main Road, HAL 3rd Stage',
  'Bengaluru',
  'Karnataka',
  '560075',
  '+91 80 2528 7903',
  'contact@rotaryttk-demo.org',
  '24x7 Service',
  'State-of-the-art non-profit blood bank specializing in rare blood groups and component apheresis.',
  'VERIFIED'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Inventory for Verified Organizations
INSERT INTO public.blood_inventory (
  organization_id, blood_group, component, units_available, state, expiry_date, internal_notes
) VALUES
('00000000-0000-0000-0000-000000000001', 'O+', 'PACKED_RED_CELLS', 14, 'AVAILABLE', CURRENT_DATE + INTERVAL '28 days', 'Tested negative for TTI'),
('00000000-0000-0000-0000-000000000001', 'O-', 'PACKED_RED_CELLS', 4, 'AVAILABLE', CURRENT_DATE + INTERVAL '21 days', 'Emergency reserve'),
('00000000-0000-0000-0000-000000000001', 'A+', 'PACKED_RED_CELLS', 9, 'AVAILABLE', CURRENT_DATE + INTERVAL '30 days', 'Standard inventory'),
('00000000-0000-0000-0000-000000000001', 'B+', 'PLATELETS', 6, 'AVAILABLE', CURRENT_DATE + INTERVAL '4 days', 'SDP Single donor platelets'),
('00000000-0000-0000-0000-000000000002', 'O+', 'WHOLE_BLOOD', 22, 'AVAILABLE', CURRENT_DATE + INTERVAL '25 days', 'Voluntary drive collections'),
('00000000-0000-0000-0000-000000000002', 'B+', 'PACKED_RED_CELLS', 18, 'AVAILABLE', CURRENT_DATE + INTERVAL '32 days', 'Regular inventory'),
('00000000-0000-0000-0000-000000000002', 'AB+', 'PLASMA', 12, 'AVAILABLE', CURRENT_DATE + INTERVAL '180 days', 'Fresh frozen plasma -40C'),
('00000000-0000-0000-0000-000000000003', 'O-', 'WHOLE_BLOOD', 3, 'AVAILABLE', CURRENT_DATE + INTERVAL '19 days', 'Trauma emergency bay'),
('00000000-0000-0000-0000-000000000003', 'A-', 'PACKED_RED_CELLS', 5, 'AVAILABLE', CURRENT_DATE + INTERVAL '22 days', 'Verified stock')
ON CONFLICT (organization_id, blood_group, component) DO UPDATE 
SET units_available = EXCLUDED.units_available, updated_at = NOW();
