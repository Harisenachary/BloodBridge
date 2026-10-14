import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { demoStore } from '@/lib/demo/demoStore';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Droplet,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  Building2,
  Lock,
  Activity,
  Sparkles,
} from 'lucide-react';

export const RequesterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const requests = demoStore.getRequests();

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
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    Requester Coordination Console
                  </div>

                  <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                    Emergency Blood{' '}
                    <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent">
                      Intake Desk
                    </span>
                  </h1>

                  <p className="text-xs text-slate-300 max-w-xl">
                    Manage active clinical requirements, inspect automated donor dispatch progress, and track token security.
                  </p>
                </div>

                <Link
                  to="/request-blood"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center gap-2 shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  New Blood Request
                </Link>
              </div>
            </div>

            {/* Active Requirements List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white">
                  Your Active Blood Requests ({requests.length})
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Encrypted &bull; Masked donor relay
                </span>
              </div>

              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-lg rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-rose-500/40 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex flex-col items-center justify-center font-black text-xl shadow-[0_8px_20px_rgba(244,63,94,0.35)] shrink-0">
                        {req.blood_group}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white">
                            {req.patient_ref_name}
                          </h3>
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                            {req.units_needed} Units &bull; {req.component.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {req.hospital_name}, {req.hospital_city}
                          </span>
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg text-xs font-bold text-charcoal-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            Token: {req.public_token}
                          </span>
                          <FreshnessIndicator updatedAt={req.updated_at} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="inline-block px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <Link
                        to={`/request-status/${req.public_token}`}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md"
                      >
                        Track Journey
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
