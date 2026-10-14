import React from 'react';
import { Link } from 'react-router-dom';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Droplet,
  Heart,
  Building2,
  ShieldCheck,
  Search,
  Activity,
  ArrowRight,
  Lock,
  Moon,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* 1. BACKGROUND MOTION CANVAS */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* 2. HERO COMMAND BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] border-2 border-rose-500/40 p-8 sm:p-10 text-white shadow-[0_25px_60px_-15px_rgba(255,0,85,0.35)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-400 text-rose-300 text-xs font-extrabold tracking-wide shadow-[0_0_15px_rgba(255,0,85,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>End-to-End Transfusion Coordination Protocol</span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight text-white">
                How BloodBridge <br />
                <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent font-black">
                  Saves Precious Seconds.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                A verified clinical network uniting emergency patients, voluntary donors, hospital coordinators, and certified blood banks with zero contact harvesting.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                to="/request-blood"
                className="btn-primary text-xs px-6 py-3.5 rounded-2xl gap-2 font-black shadow-md shadow-rose-900/40 text-center"
              >
                <Droplet className="w-4 h-4 fill-white" />
                <span>🚨 Need Blood Urgently</span>
              </Link>

              <Link
                to="/eligibility"
                className="btn-secondary text-xs px-6 py-3 rounded-2xl gap-2 font-bold text-center border-rose-300 dark:border-rose-700"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Check If I Can Donate</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. THREE OPERATIONAL PILLARS */}
        <div className="space-y-8">
          {/* Pillar 1: For Requesters (Ruby Crimson Theme) */}
          <div className="bg-gradient-to-br from-white via-rose-50/30 to-white dark:from-slate-900 dark:via-[#1c1024] dark:to-slate-900 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border-2 border-rose-300 dark:border-rose-900/80 shadow-[0_8px_30px_rgba(255,0,85,0.1)] space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-rose-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/30">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-400/40 inline-block mb-1">
                  Pillar 01
                </span>
                <h2 className="font-heading font-extrabold text-xl text-charcoal-900 dark:text-white">
                  For Patients &amp; Emergency Requesters
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant intake for trauma surgery, maternal emergencies, and scheduled oncology transfusions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  1
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  Submit Case Details
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Provide required blood component (PRBC, platelets, FFP), hospital, city, and required-by deadline. A non-sequential tracking token is generated instantly.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  2
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  Clinical Verification
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  The hospital coordinator or moderation desk verifies the clinical requirement to eliminate malicious or duplicate broadcasts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  3
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  Track &amp; Fulfill
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Monitor live donor responses on the privacy-safe timeline. When units are secured, the case closes to prevent redundant donor fatigue.
                </p>
              </div>
            </div>
          </div>

          {/* Pillar 2: For Donors (Mint Emerald Theme) */}
          <div className="bg-gradient-to-br from-white via-emerald-50/30 to-white dark:from-slate-900 dark:via-[#081e18] dark:to-slate-900 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 dark:border-emerald-900/80 shadow-[0_8px_30px_rgba(16,185,129,0.1)] space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-emerald-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-400/40 inline-block mb-1">
                  Pillar 02
                </span>
                <h2 className="font-heading font-extrabold text-xl text-charcoal-900 dark:text-white">
                  For Voluntary Donors
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total autonomy over personal contact privacy, quiet hours, and life-saving alerts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  1
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  Register with Privacy
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your phone number is never displayed on public boards. Requesters only view generalized locality and ABO compatibility match index.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  2
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  Quiet Mode Protection
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Traveling or resting? Enable Quiet Mode anytime to pause non-emergency invites or restrict alerts strictly to life-threatening trauma cases.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  3
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  Respond on Your Terms
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Accept or decline requests with one tap without public scrutiny. Verified donations update your voluntary life-saving milestone badges.
                </p>
              </div>
            </div>
          </div>

          {/* Pillar 3: For Hospitals (Sapphire Blue Theme) */}
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-slate-900 dark:via-[#091b29] dark:to-slate-900 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border-2 border-blue-300 dark:border-blue-900/80 shadow-[0_8px_30px_rgba(37,99,235,0.1)] space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-blue-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-400/40 inline-block mb-1">
                  Pillar 03
                </span>
                <h2 className="font-heading font-extrabold text-xl text-charcoal-900 dark:text-white">
                  For Hospitals &amp; Certified Blood Centres
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Licensed institutions, apheresis centres, and accredited storage banks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  1
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  NABH Verification
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Submit State Drug Control licenses to earn verified institutional trust badges and authenticate authorized transfusion desk staff accounts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  2
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  Live Stock Telemetry
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Publish tested component reserve units with live freshness timestamps. Negative stock constraints guarantee tamper-proof ledger accuracy.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  3
                </div>
                <h3 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
                  Predictive Grid Dispatch
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Utilize regional distress radar algorithms to anticipate negative blood group deficits and mobilize nearby standby donors preemptively.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM ACTION CTA */}
        <div className="text-center pt-4 pb-6">
          <Link
            to="/request-blood"
            className="btn-primary text-sm px-8 py-4 rounded-2xl gap-3 font-black shadow-[0_0_25px_rgba(255,0,85,0.6)] hover:scale-105 transition-transform"
          >
            <span>Start an Emergency Blood Request</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
