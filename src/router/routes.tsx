import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage';
import { RequestBloodPage } from '@/pages/public/RequestBloodPage';
import { FindDonorsPage } from '@/pages/public/FindDonorsPage';
import { BloodBanksPage } from '@/pages/public/BloodBanksPage';
import { BloodBankDetailsPage } from '@/pages/public/BloodBankDetailsPage';
import { RequestTrackingPage } from '@/pages/public/RequestTrackingPage';
import { EligibilityPage } from '@/pages/public/EligibilityPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { PrivacyPage } from '@/pages/public/PrivacyPage';
import { TermsPage } from '@/pages/public/TermsPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { AuthCallbackPage } from '@/pages/auth/AuthCallbackPage';

// Donor Pages
import { DonorDashboardPage } from '@/pages/donor/DonorDashboardPage';
import { DonorProfilePage } from '@/pages/donor/DonorProfilePage';
import { DonorAvailabilityPage } from '@/pages/donor/DonorAvailabilityPage';
import { DonorNotificationsPage } from '@/pages/donor/DonorNotificationsPage';
import { DonorHistoryPage } from '@/pages/donor/DonorHistoryPage';
import { DonorSettingsPage } from '@/pages/donor/DonorSettingsPage';

// Requester Pages
import { RequesterDashboardPage } from '@/pages/requester/RequesterDashboardPage';
import { RequesterRequestsPage } from '@/pages/requester/RequesterRequestsPage';
import { RequesterRequestDetailsPage } from '@/pages/requester/RequesterRequestDetailsPage';
import { RequesterProfilePage } from '@/pages/requester/RequesterProfilePage';
import { RequesterNotificationsPage } from '@/pages/requester/RequesterNotificationsPage';

// Organization Pages
import { OrgDashboardPage } from '@/pages/organization/OrgDashboardPage';
import { OrgProfilePage } from '@/pages/organization/OrgProfilePage';
import { OrgVerificationPage } from '@/pages/organization/OrgVerificationPage';
import { OrgRequestsPage } from '@/pages/organization/OrgRequestsPage';
import { OrgInventoryPage } from '@/pages/organization/OrgInventoryPage';
import { OrgStaffPage } from '@/pages/organization/OrgStaffPage';
import { OrgAnalyticsPage } from '@/pages/organization/OrgAnalyticsPage';

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminOrganizationsPage } from '@/pages/admin/AdminOrganizationsPage';
import { AdminVerificationPage } from '@/pages/admin/AdminVerificationPage';
import { AdminRequestsPage } from '@/pages/admin/AdminRequestsPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

// 404
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Public routes
      { index: true, element: <LandingPage /> },
      { path: 'request-blood', element: <RequestBloodPage /> },
      { path: 'find-donors', element: <FindDonorsPage /> },
      { path: 'blood-banks', element: <BloodBanksPage /> },
      { path: 'blood-banks/:id', element: <BloodBankDetailsPage /> },
      { path: 'request-status/:publicToken', element: <RequestTrackingPage /> },
      { path: 'eligibility', element: <EligibilityPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },

      // Auth routes
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'auth/callback', element: <AuthCallbackPage /> },

      // Donor routes
      {
        path: 'donor',
        children: [
          { path: 'dashboard', element: <ProtectedRoute allowedRoles={['donor']}><DonorDashboardPage /></ProtectedRoute> },
          { path: 'profile', element: <ProtectedRoute allowedRoles={['donor']}><DonorProfilePage /></ProtectedRoute> },
          { path: 'availability', element: <ProtectedRoute allowedRoles={['donor']}><DonorAvailabilityPage /></ProtectedRoute> },
          { path: 'notifications', element: <ProtectedRoute allowedRoles={['donor']}><DonorNotificationsPage /></ProtectedRoute> },
          { path: 'donation-history', element: <ProtectedRoute allowedRoles={['donor']}><DonorHistoryPage /></ProtectedRoute> },
          { path: 'settings', element: <ProtectedRoute allowedRoles={['donor']}><DonorSettingsPage /></ProtectedRoute> },
        ],
      },

      // Requester routes
      {
        path: 'requester',
        children: [
          { path: 'dashboard', element: <ProtectedRoute allowedRoles={['requester']}><RequesterDashboardPage /></ProtectedRoute> },
          { path: 'requests', element: <ProtectedRoute allowedRoles={['requester']}><RequesterRequestsPage /></ProtectedRoute> },
          { path: 'requests/:id', element: <ProtectedRoute allowedRoles={['requester']}><RequesterRequestDetailsPage /></ProtectedRoute> },
          { path: 'profile', element: <ProtectedRoute allowedRoles={['requester']}><RequesterProfilePage /></ProtectedRoute> },
          { path: 'notifications', element: <ProtectedRoute allowedRoles={['requester']}><RequesterNotificationsPage /></ProtectedRoute> },
        ],
      },

      // Organization routes
      {
        path: 'organization',
        children: [
          { path: 'dashboard', element: <ProtectedRoute allowedRoles={['hospital_staff', 'blood_bank_staff']}><OrgDashboardPage /></ProtectedRoute> },
          { path: 'profile', element: <ProtectedRoute allowedRoles={['hospital_staff', 'blood_bank_staff']}><OrgProfilePage /></ProtectedRoute> },
          { path: 'verification', element: <ProtectedRoute allowedRoles={['hospital_staff', 'blood_bank_staff']}><OrgVerificationPage /></ProtectedRoute> },
          { path: 'requests', element: <ProtectedRoute allowedRoles={['hospital_staff', 'blood_bank_staff']}><OrgRequestsPage /></ProtectedRoute> },
          { path: 'inventory', element: <ProtectedRoute allowedRoles={['hospital_staff', 'blood_bank_staff']}><OrgInventoryPage /></ProtectedRoute> },
          { path: 'staff', element: <ProtectedRoute allowedRoles={['hospital_staff', 'blood_bank_staff']}><OrgStaffPage /></ProtectedRoute> },
          { path: 'analytics', element: <ProtectedRoute allowedRoles={['hospital_staff', 'blood_bank_staff']}><OrgAnalyticsPage /></ProtectedRoute> },
        ],
      },

      // Admin routes
      {
        path: 'admin',
        children: [
          { path: 'dashboard', element: <ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute> },
          { path: 'users', element: <ProtectedRoute allowedRoles={['admin']}><AdminUsersPage /></ProtectedRoute> },
          { path: 'organizations', element: <ProtectedRoute allowedRoles={['admin']}><AdminOrganizationsPage /></ProtectedRoute> },
          { path: 'verification', element: <ProtectedRoute allowedRoles={['admin']}><AdminVerificationPage /></ProtectedRoute> },
          { path: 'requests', element: <ProtectedRoute allowedRoles={['admin']}><AdminRequestsPage /></ProtectedRoute> },
          { path: 'reports', element: <ProtectedRoute allowedRoles={['admin']}><AdminReportsPage /></ProtectedRoute> },
          { path: 'audit-logs', element: <ProtectedRoute allowedRoles={['admin']}><AdminAuditLogsPage /></ProtectedRoute> },
          { path: 'settings', element: <ProtectedRoute allowedRoles={['admin']}><AdminSettingsPage /></ProtectedRoute> },
        ],
      },

      // 404 Fallback
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
