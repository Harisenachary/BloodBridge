import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { demoStore } from '@/lib/demo/demoStore';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  ArrowLeft,
  Droplet,
  FileText,
  AlertTriangle,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

export const BloodBankDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const org = demoStore.getOrganizationById(id || '');
  const inventory = demoStore.getInventory(id || '');

  if (!org) {
    return (
      <div className="relative min-h-screen">
        <BloodMotionCanvas />
        <div className="relative z-10 max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/30 shadow-lg">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="font-heading font-black text-3xl text-charcoal-900 dark:text-white mb-2">
            Facility Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            No blood bank or hospital transfusion center matches ID <code className="font-mono">{id}</code>.
          </p>
          <Link
            to="/blood-banks"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-md hover:brightness-110 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const totalUnits = inventory.reduce((acc, curr) => acc + curr.units_available, 0);

  return (
    <div className="relative min-h-screen">
      {/* Background Animated Blood Flow */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            to="/blood-banks"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-charcoal-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blood Banks Directory
          </Link>
        </div>

        {/* Cosmic Hero Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] text-white p-6 sm:p-10 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,0,85,0.25)] border border-rose-500/20">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  {org.org_type.replace(/_/g, ' ')}
                </span>
                {org.verification_status === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Audited Transfusion Center
                  </span>
                )}
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
                {org.display_name}
              </h1>

              <p className="text-sm text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                {org.address}, {org.city}, {org.state} &bull; PIN: {org.postal_code || '500001'}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                to="/request-blood"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center gap-2 transition-all"
              >
                <Droplet className="w-4 h-4 fill-white" />
                Request from this Facility
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Facility Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-lg space-y-1">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4" />
              Accreditation &amp; License
            </div>
            <span className="font-mono font-black text-lg text-charcoal-900 dark:text-white block">
              {org.license_number}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              State Drug Control Administration Certified
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-lg space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Phone className="w-4 h-4" />
              24x7 Emergency Transfusion Desk
            </div>
            <span className="font-mono font-black text-lg text-charcoal-900 dark:text-white block">
              {org.contact_phone}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct duty desk &bull; Priority clinical relay
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-lg space-y-1">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              Operational Schedule
            </div>
            <span className="font-black text-lg text-charcoal-900 dark:text-white block">
              {org.operating_hours}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Open 7 days a week for blood dispatch
            </p>
          </div>
        </div>

        {/* Verified Stock Inventory Table */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                Live Laboratory Audit
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-charcoal-900 dark:text-white">
                Verified Stock Inventory ({totalUnits} Units Total)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Refreshed and audited by facility transfusion desk. Subject to hospital reservation workflows.
              </p>
            </div>
          </div>

          {inventory.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400">
              No stock records currently published for this facility.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-black text-[10px] tracking-wider">
                    <th className="py-3 px-4">Blood Group</th>
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Available Units</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Freshness / Tested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex items-center justify-center font-black text-sm shadow-md">
                          {item.blood_group}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-charcoal-900 dark:text-white text-sm">
                        {item.component.replace(/_/g, ' ')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-heading font-black text-xl text-rose-600 dark:text-rose-400">
                          {item.units_available}
                        </span>{' '}
                        <span className="text-xs font-normal text-slate-400">Units</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Ready for Cross-Match
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                        <FreshnessIndicator updatedAt={item.updated_at} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
