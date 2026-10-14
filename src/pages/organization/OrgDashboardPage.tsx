import React from 'react';
import { Link } from 'react-router-dom';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Building2,
  Package,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';

export const OrgDashboardPage: React.FC = () => {
  const org = demoStore.getOrganizations()[0]; // Default Apollo Hospital
  const inventory = demoStore.getInventory(org.id);
  const requests = demoStore.getRequests().filter((r) => r.hospital_name.includes(org.display_name.split('—')[0].trim()));

  const totalUnits = inventory.reduce((acc, curr) => acc + curr.units_available, 0);

  return (
    <div className="relative min-h-screen">
      {/* Background Animated Blood Flow */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <RoleSidebar />

          <div className="flex-1 space-y-8">
            {/* Cosmic Hero Header */}
            <div className="rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] text-white p-6 sm:p-10 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,0,85,0.25)] border border-rose-500/20">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      {org.org_type.replace(/_/g, ' ')}
                    </span>
                    {org.verification_status === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        NABH Verified Partner
                      </span>
                    )}
                  </div>

                  <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                    {org.display_name}
                  </h1>

                  <p className="text-xs text-slate-300">
                    License: <strong className="font-mono text-cyan-300">{org.license_number}</strong> &bull; {org.city}, {org.state} &bull; 24x7 Helpline: {org.contact_phone}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to="/organization/inventory"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center gap-2 transition-all"
                  >
                    <Package className="w-4 h-4" />
                    Manage Inventory
                  </Link>
                </div>
              </div>
            </div>

            {/* 3 Jewel Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-red-500/30 rounded-3xl p-6 shadow-lg space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Total Blood Stock
                </span>
                <p className="text-3xl font-black text-charcoal-900 dark:text-white font-heading">
                  {totalUnits}{' '}
                  <span className="text-xs font-normal text-slate-400">Units</span>
                </p>
                <span className="text-xs text-rose-600 dark:text-rose-400 font-bold block pt-1">
                  Across {inventory.length} audited components
                </span>
              </div>

              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-amber-500/30 rounded-3xl p-6 shadow-lg space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Assigned Case Queue
                </span>
                <p className="text-3xl font-black text-amber-600 dark:text-amber-400 font-heading">
                  {requests.length}{' '}
                  <span className="text-xs font-normal text-slate-400">Cases</span>
                </p>
                <Link
                  to="/organization/requests"
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline block pt-1"
                >
                  Review Case Triage &rarr;
                </Link>
              </div>

              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-emerald-500/30 rounded-3xl p-6 shadow-lg space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Validation Status
                </span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 pt-1">
                  <ShieldCheck className="w-5 h-5" />
                  NABH Validated
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Annual drug license inspection verified
                </span>
              </div>
            </div>

            {/* Quick Inventory Stock Overview */}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-rose-500" />
                  Current Laboratory Stock Summary
                </h2>
                <Link
                  to="/organization/inventory"
                  className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
                >
                  Full Inventory Audit &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {inventory.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-center space-y-2 hover:border-rose-500/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex items-center justify-center font-black text-sm mx-auto shadow-md">
                      {item.blood_group}
                    </div>
                    <p className="font-heading font-black text-xl text-charcoal-900 dark:text-white">
                      {item.units_available}{' '}
                      <span className="text-xs font-normal text-slate-400">Units</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.component.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
