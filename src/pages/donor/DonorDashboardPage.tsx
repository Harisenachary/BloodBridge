import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { demoStore } from '@/lib/demo/demoStore';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Heart,
  Droplet,
  Moon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Bell,
  ArrowRight,
  Send,
  Calendar,
  Sparkles,
  Activity,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export const DonorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const donor = demoStore.getDonors()[0]; // Default active demo donor
  const [availabilityStatus, setAvailabilityStatus] = useState(donor.availability?.status || 'AVAILABLE');
  const [emergencyOnly, setEmergencyOnly] = useState(donor.availability?.emergency_only || false);

  const requests = demoStore.getRequests().filter((r) => r.status === 'MATCHING_IN_PROGRESS');
  const notifications = demoStore.getNotifications(user?.id);

  const handleToggleStatus = (newStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'PAUSED') => {
    setAvailabilityStatus(newStatus);
    demoStore.updateDonorAvailability(
      donor.id,
      newStatus,
      newStatus === 'PAUSED',
      undefined,
      emergencyOnly
    );
    toast.success(`Availability updated to ${newStatus}`);
  };

  const handleRespond = (requestId: string, type: 'ACCEPT' | 'DECLINE') => {
    if (type === 'ACCEPT') {
      toast.success('Response confirmed!', {
        description: 'Thank you! The hospital coordinator has been notified of your availability.',
      });
    } else {
      toast.info('Request politely declined.', {
        description: 'No reason is publicly required. Your quiet mode settings remain intact.',
      });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Animated Blood Flow */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <RoleSidebar />

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Cosmic Hero Header */}
            <div className="rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] text-white p-6 sm:p-10 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,0,85,0.25)] border border-rose-500/20">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      Voluntary Lifesaver Console
                    </span>
                    {donor.is_verified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Donor
                      </span>
                    )}
                  </div>

                  <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                    Welcome back,{' '}
                    <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent">
                      {user?.full_name?.split(' ')[0] || donor.display_alias}
                    </span>
                  </h1>

                  <p className="text-xs text-slate-300">
                    Location: {donor.city}, {donor.state} &bull; Blood Group: <strong>{donor.blood_group}</strong> &bull; Status:{' '}
                    <span className="font-bold text-emerald-400">{availabilityStatus}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex flex-col items-center justify-center font-black shadow-[0_8px_20px_rgba(244,63,94,0.35)]">
                    <span className="text-xl">{donor.blood_group}</span>
                  </div>
                  <Link
                    to="/donor/availability"
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all shadow-md"
                  >
                    <Moon className="w-4 h-4 text-indigo-300" />
                    Quiet Mode
                  </Link>
                </div>
              </div>
            </div>

            {/* Availability Control Bar */}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-lg rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold text-charcoal-900 dark:text-white block">
                    Current Availability Status
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Controls whether hospital coordinators can dispatch voluntary invitations to your device.
                  </p>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus('AVAILABLE')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      availabilityStatus === 'AVAILABLE'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-charcoal-900'
                    }`}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus('PAUSED')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      availabilityStatus === 'PAUSED'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-charcoal-900'
                    }`}
                  >
                    Quiet Mode (Paused)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus('UNAVAILABLE')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      availabilityStatus === 'UNAVAILABLE'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-charcoal-900'
                    }`}
                  >
                    Unavailable
                  </button>
                </div>
              </div>

              {availabilityStatus === 'PAUSED' && (
                <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-2xl text-xs text-violet-900 dark:text-violet-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-violet-500 shrink-0" />
                    <span>
                      Quiet Mode is active. You will receive <strong>zero routine notifications</strong>.
                    </span>
                  </div>
                  <label className="flex items-center gap-2 font-bold cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={emergencyOnly}
                      onChange={(e) => {
                        setEmergencyOnly(e.target.checked);
                        demoStore.updateDonorAvailability(
                          donor.id,
                          'PAUSED',
                          true,
                          undefined,
                          e.target.checked
                        );
                      }}
                      className="rounded text-violet-600"
                    />
                    Allow Critical Trauma Alerts Only
                  </label>
                </div>
              )}
            </div>

            {/* 3 Jewel Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-red-500/30 rounded-3xl p-6 shadow-lg space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Total Voluntary Donations
                </span>
                <p className="text-3xl font-black text-charcoal-900 dark:text-white font-heading">
                  {donor.total_donations}{' '}
                  <span className="text-xs font-normal text-slate-400">Times</span>
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 pt-1">
                  <Award className="w-4 h-4" />
                  Silver Tier Lifesaver
                </span>
              </div>

              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-emerald-500/30 rounded-3xl p-6 shadow-lg space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Last Donation Date
                </span>
                <p className="text-lg font-black text-charcoal-900 dark:text-white font-mono">
                  {donor.last_donation_date || 'None on record'}
                </p>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block pt-1">
                  90-day interval satisfied &bull; Ready to donate
                </span>
              </div>

              <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-3xl p-6 shadow-lg space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Notification Threshold
                </span>
                <p className="text-3xl font-black text-charcoal-900 dark:text-white font-heading">
                  {donor.max_outreach_frequency}{' '}
                  <span className="text-xs font-normal text-slate-400">/ Week Max</span>
                </p>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold block pt-1">
                  In-app alerts protected against spam
                </span>
              </div>
            </div>

            {/* Active Coordination Requirements */}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-rose-500" />
                  Pending Emergency Requirements in Your Area
                </h2>
                <span className="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  {requests.length} Active Alerts
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  No active requirements matching your blood group in {donor.city} right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md">
                          {req.blood_group}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-charcoal-900 dark:text-white">
                              {req.patient_ref_name}
                            </span>
                            <span className="text-rose-600 dark:text-rose-400 font-bold">
                              &bull; {req.units_needed} Units ({req.component.replace(/_/g, ' ')})
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Facility: <strong className="text-charcoal-800 dark:text-slate-200">{req.hospital_name}</strong> &bull; {req.hospital_city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRespond(req.id, 'DECLINE')}
                          className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespond(req.id, 'ACCEPT')}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          I Can Donate
                        </button>
                        <Link
                          to={`/request-status/${req.public_token}`}
                          className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold px-2"
                        >
                          Details &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
