import React, { useState } from 'react';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import { Mail, Phone, MapPin, AlertTriangle, Send, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { toast } from 'sonner';

export const ContactPage: React.FC = () => {
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reportType: 'COMMERCIAL_DEMAND',
    caseToken: '',
    details: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    toast.success('Report submitted to moderation queue', {
      description: 'Our trust and safety officers will inspect this case within 4 hours.',
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Animated Blood Flow */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Cosmic Hero Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] text-white p-6 sm:p-12 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,0,85,0.25)] border border-rose-500/20">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Trust &amp; Community Integrity Desk
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
              Contact &amp;{' '}
              <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent">
                Integrity Reporting
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Report suspicious blood requests, report policy violations, or connect with our clinical verification team.
            </p>
          </div>
        </div>

        {/* 3 Jewel Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-red-500/30 rounded-3xl p-6 space-y-3 shadow-lg">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">Email Support</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">General inquiries &amp; verification questions</p>
            <a href="mailto:support@bloodbridge.in" className="text-xs text-rose-600 dark:text-rose-400 font-extrabold hover:underline block pt-1">
              support@bloodbridge.in
            </a>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-emerald-500/30 rounded-3xl p-6 space-y-3 shadow-lg">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">Emergency Relays</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">National Ambulance &amp; Police Dispatch</p>
            <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 pt-1 space-x-3">
              <span>Ambulance: 108</span>
              <span>Emergency: 112</span>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-amber-500/30 rounded-3xl p-6 space-y-3 shadow-lg">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">Moderation Desk</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fake requests &amp; commercial blood solicitation</p>
            <a href="mailto:safety@bloodbridge.in" className="text-xs text-amber-600 dark:text-amber-400 font-extrabold hover:underline block pt-1">
              safety@bloodbridge.in
            </a>
          </div>
        </div>

        {/* Abuse & Integrity Reporting Form */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="font-heading font-extrabold text-2xl text-charcoal-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
              Report a Suspicious Request or Policy Violation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Commercial sale of blood is illegal under Indian law. Report any paid donor solicitation or fraudulent requests immediately.
            </p>
          </div>

          {reportSubmitted ? (
            <div className="p-8 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-extrabold text-lg text-emerald-950 dark:text-emerald-300">
                Report Logged to Safety Desk
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 max-w-md mx-auto leading-relaxed">
                Our safety review officers will inspect this case within 4 hours. Thank you for protecting the voluntary blood ecosystem.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-charcoal-900 dark:text-slate-200">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Anonymous or your name"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-charcoal-900 dark:text-slate-200">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-charcoal-900 dark:text-slate-200">Issue Category</label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
                  >
                    <option value="COMMERCIAL_DEMAND">Commercial Blood Sale / Middleman Solicitation</option>
                    <option value="FAKE_REQUEST">Suspected Fake or Inactive Request</option>
                    <option value="HARASSMENT">Unwanted Contact / Harassment</option>
                    <option value="MISLEADING_STOCK">Incorrect Blood Bank Inventory Claim</option>
                    <option value="OTHER">Other Compliance Concern</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-charcoal-900 dark:text-slate-200">Tracking Token or Hospital Name</label>
                  <input
                    type="text"
                    value={formData.caseToken}
                    onChange={(e) => setFormData({ ...formData, caseToken: e.target.value })}
                    placeholder="e.g. BB-TRK-7A9F-****"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-mono font-bold focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-charcoal-900 dark:text-slate-200">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Please describe what occurred..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Submit Moderation Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
