import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { demoStore } from '@/lib/demo/demoStore';
import { BloodRequest, RequestStatusHistory } from '@/types';
import { StatusTimeline } from '@/components/common/StatusTimeline';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Droplet,
  ShieldCheck,
  Building2,
  Calendar,
  AlertTriangle,
  Copy,
  Check,
  ArrowLeft,
  Share2,
  Lock,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export const RequestTrackingPage: React.FC = () => {
  const { publicToken } = useParams<{ publicToken: string }>();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [history, setHistory] = useState<RequestStatusHistory[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (publicToken) {
      const found = demoStore.getRequestByToken(publicToken);
      if (found) {
        setRequest(found);
        setHistory(demoStore.getRequestHistory(found.id));
      }
    }
  }, [publicToken]);

  const copyToken = () => {
    if (publicToken) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Tracking link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!request) {
    return (
      <div className="relative min-h-screen">
        <BloodMotionCanvas />
        <div className="relative z-10 max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/30 shadow-lg">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="font-heading font-black text-3xl text-charcoal-900 dark:text-white mb-2">
            Tracking Token Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            No active blood requirement matches token{' '}
            <code className="bg-slate-200 dark:bg-slate-800 text-charcoal-900 dark:text-white px-2.5 py-1 rounded-xl font-mono text-xs font-bold">
              {publicToken}
            </code>
            . Please verify the link or check with your hospital coordinator.
          </p>
          <Link
            to="/request-blood"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-md hover:brightness-110 inline-flex items-center gap-2"
          >
            Submit New Request
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Erythrocyte Particle Simulation */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Cosmic Hero Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] text-white p-6 sm:p-10 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,0,85,0.25)] border border-rose-500/20">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <Lock className="w-3.5 h-3.5" />
                  Privacy-Protected Live Tracking
                </span>
                <div className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs">
                  <FreshnessIndicator updatedAt={request.updated_at} />
                </div>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white">
                {request.patient_ref_name}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Public Tracking Token:</span>
                <span className="font-mono font-black text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30">
                  {request.public_token}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={copyToken}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all shadow-md"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Share Tracking Link'}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Jewel Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Group */}
          <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-red-500/30 shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
              <span className="text-xl">{request.blood_group}</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Target ABO
              </span>
              <p className="font-heading font-black text-lg text-charcoal-900 dark:text-white leading-tight">
                {request.units_needed} Units
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {request.component.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {/* Urgency */}
          <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-amber-500/30 shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Triage Urgency
              </span>
              <p className="font-heading font-black text-sm text-charcoal-900 dark:text-white leading-tight">
                {request.urgency.replace(/_/g, ' ')}
              </p>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                Clinical Priority
              </span>
            </div>
          </div>

          {/* Required By */}
          <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-cyan-500/30 shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Deadline
              </span>
              <p className="font-heading font-bold text-xs text-charcoal-900 dark:text-white leading-snug">
                {format(parseISO(request.required_by_date), 'MMM d, h:mm a')}
              </p>
              <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                Scheduled Target
              </span>
            </div>
          </div>

          {/* Treating Facility */}
          <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-emerald-500/30 shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Facility
              </span>
              <p className="font-heading font-bold text-xs text-charcoal-900 dark:text-white leading-snug truncate">
                {request.hospital_name}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block truncate">
                {request.hospital_city}
              </span>
            </div>
          </div>
        </div>

        {/* Status Journey Visualizer Container */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-charcoal-900 dark:text-white">
                Live Status Progression
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time updates as blood banks cross-match and voluntary donors confirm attendance.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              {request.status.replace(/_/g, ' ')}
            </div>
          </div>

          <StatusTimeline currentStatus={request.status} history={history} />
        </div>

        {/* Safety & Protocol Notice */}
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-extrabold text-charcoal-900 dark:text-white block text-sm">
              Clinical Transfusion Safety &amp; Privacy Protocol
            </span>
            <p className="leading-relaxed">
              Donor personal contacts remain masked until explicit voluntary acceptance. All blood component cross-matching, ABO verification, and serological testing take place strictly inside hospital laboratories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
