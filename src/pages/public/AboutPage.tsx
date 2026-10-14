import React from 'react';
import { Link } from 'react-router-dom';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  ShieldAlert,
  Heart,
  Droplet,
  Lock,
  Activity,
  Award,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Dynamic Blood Particle Flow */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Cosmic Hero Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] text-white p-6 sm:p-12 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,0,85,0.25)] border border-rose-500/20">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              National Mission &bull; Safety Principles
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
              About{' '}
              <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent">
                BloodBridge
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              BloodBridge is a high-trust healthcare technology platform built to address critical blood shortages and disorganized donor outreach across India.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <Link
                to="/request-blood"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Droplet className="w-3.5 h-3.5 fill-white" />
                Request Blood
              </Link>
              <Link
                to="/find-donors"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold backdrop-blur-sm transition-all"
              >
                Search Donors
              </Link>
            </div>
          </div>
        </div>

        {/* Core Operating Pillars Grid */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="font-heading font-extrabold text-2xl text-charcoal-900 dark:text-white">
              Core Operating Pillars
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Engineered from the ground up for donor privacy, clinical accuracy, and zero spam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1: Ruby */}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg hover:shadow-[0_12px_35px_rgba(255,0,85,0.15)] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex items-center justify-center shadow-md">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white">
                  Zero Unwanted Contact Disclosure
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Voluntary donors in India often report spam calls and unsolicited harassment after posting on public forums. BloodBridge never indexes donor phone numbers or exact residences in search results.
                </p>
              </div>
            </div>

            {/* Pillar 2: Mint Emerald */}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg hover:shadow-[0_12px_35px_rgba(16,185,129,0.15)] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white">
                  Clinical Transfusion Compatibility
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  We do not treat all blood components as identical. Our matching engine distinguishes between Red Blood Cells, Fresh Frozen Plasma, and Platelet compatibility according to standard clinical transfusion protocols.
                </p>
              </div>
            </div>

            {/* Pillar 3: Electric Cyan */}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg hover:shadow-[0_12px_35px_rgba(6,182,212,0.15)] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white flex items-center justify-center shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white">
                  Notification Fatigue Protection
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Through Donor Quiet Mode and outreach throttling, donors can pause notifications, take voluntary deferrals, or limit requests to life-threatening trauma emergencies only.
                </p>
              </div>
            </div>

            {/* Pillar 4: Royal Violet */}
            <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-violet-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg hover:shadow-[0_12px_35px_rgba(139,92,246,0.15)] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white flex items-center justify-center shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white">
                  Audited Request Closure Loop
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Once an emergency requirement is met, the system transitions to Fulfilled immediately, broadcasting closure notifications so donors are not disrupted after the need has passed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Limitations Disclaimer */}
        <div className="bg-amber-500/10 dark:bg-amber-950/20 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold font-heading text-base">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            Platform Boundaries &amp; Medical Disclaimer
          </div>
          <p className="text-xs text-charcoal-800 dark:text-slate-200 leading-relaxed">
            BloodBridge coordinates communication between consenting voluntary donors, patients, and licensed healthcare organizations. <strong>BloodBridge is not a medical provider, blood bank, or emergency dispatch service.</strong>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We do not collect, test, cross-match, transport, or transfuse blood. All biological testing, infectious disease screening, ABO confirmation, and cross-matching must be performed exclusively by qualified medical personnel at licensed facilities in accordance with Drugs &amp; Cosmetics Rules.
          </p>
        </div>
      </div>
    </div>
  );
};
