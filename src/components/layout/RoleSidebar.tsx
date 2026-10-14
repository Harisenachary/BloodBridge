import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  User,
  Bell,
  Clock,
  Settings,
  ShieldCheck,
  Building2,
  Package,
  Users,
  BarChart3,
  FileText,
  AlertTriangle,
  History,
  Moon,
} from 'lucide-react';

export const RoleSidebar: React.FC = () => {
  const { role, user } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'donor':
        return [
          { name: 'Overview', path: '/donor/dashboard', icon: LayoutDashboard },
          { name: 'Donor Profile', path: '/donor/profile', icon: User },
          { name: 'Quiet Mode & Availability', path: '/donor/availability', icon: Moon },
          { name: 'Donation History', path: '/donor/donation-history', icon: History },
          { name: 'Notifications', path: '/donor/notifications', icon: Bell },
          { name: 'Settings & Privacy', path: '/donor/settings', icon: Settings },
        ];
      case 'requester':
        return [
          { name: 'Overview', path: '/requester/dashboard', icon: LayoutDashboard },
          { name: 'Active Blood Requests', path: '/requester/requests', icon: FileText },
          { name: 'Profile & Contacts', path: '/requester/profile', icon: User },
          { name: 'Notifications', path: '/requester/notifications', icon: Bell },
        ];
      case 'hospital_staff':
      case 'blood_bank_staff':
        return [
          { name: 'Overview', path: '/organization/dashboard', icon: LayoutDashboard },
          { name: 'Inventory Management', path: '/organization/inventory', icon: Package },
          { name: 'Coordinated Requests', path: '/organization/requests', icon: FileText },
          { name: 'Institutional Verification', path: '/organization/verification', icon: ShieldCheck },
          { name: 'Staff Roster', path: '/organization/staff', icon: Users },
          { name: 'Analytics & Demand', path: '/organization/analytics', icon: BarChart3 },
          { name: 'Organization Profile', path: '/organization/profile', icon: Building2 },
        ];
      case 'admin':
        return [
          { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Organizations', path: '/admin/organizations', icon: Building2 },
          { name: 'Verification Queue', path: '/admin/verification', icon: ShieldCheck },
          { name: 'Blood Requests', path: '/admin/requests', icon: FileText },
          { name: 'Abuse Reports', path: '/admin/reports', icon: AlertTriangle },
          { name: 'System Audit Logs', path: '/admin/audit-logs', icon: History },
          { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm shrink-0 backdrop-blur-xl">
      <div className="pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Current Portal
        </span>
        <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mt-0.5 capitalize">
          {role.replace('_', ' ')} Portal
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">{user?.full_name}</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path.endsWith('/dashboard')}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
