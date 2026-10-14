import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { demoStore } from '@/lib/demo/demoStore';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import {
  Moon,
  Clock,
  Bell,
  ShieldCheck,
  AlertTriangle,
  Save,
  Calendar,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export const DonorAvailabilityPage: React.FC = () => {
  const donor = demoStore.getDonors()[0];
  const avail = donor.availability;

  const [status, setStatus] = useState<'AVAILABLE' | 'UNAVAILABLE' | 'PAUSED'>(avail?.status || 'AVAILABLE');
  const [quietModeEnabled, setQuietModeEnabled] = useState(avail?.quiet_mode_enabled || false);
  const [pauseDurationDays, setPauseDurationDays] = useState<number>(14);
  const [emergencyOnly, setEmergencyOnly] = useState(avail?.emergency_only || false);
  const [maxFrequency, setMaxFrequency] = useState<number>(donor.max_outreach_frequency || 2);
  const [lastDonationDate, setLastDonationDate] = useState<string>(donor.last_donation_date || '2026-06-10');
  const [contactChannel, setContactChannel] = useState(donor.preferred_contact_channel || 'IN_APP');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const pausedUntil =
      status === 'PAUSED' || quietModeEnabled
        ? new Date(Date.now() + pauseDurationDays * 86400000).toISOString()
        : undefined;

    demoStore.updateDonorAvailability(
      donor.id,
      status,
      quietModeEnabled,
      pausedUntil,
      emergencyOnly
    );

    toast.success('Donor Quiet Mode & Availability settings saved!', {
      description: 'Your outreach threshold and notification caps are actively applied.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Moon className="w-3.5 h-3.5" />
              Distinctive Feature
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Donor Quiet Mode &amp; Availability Controls
            </h1>
            <p className="text-sm text-slate-muted mt-1 leading-relaxed max-w-2xl">
              Prevent notification fatigue and protect your peace of mind. Pause invitations, limit emergency outreach, or update donation deferrals anytime.
            </p>
          </div>

          <form onSubmit={handleSave} className="card-surface p-6 sm:p-8 space-y-6">
            {/* Status Selector */}
            <div className="space-y-2 border-b border-slate-border pb-6">
              <label className="text-xs font-bold text-charcoal-900 block">
                Primary Coordination State
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStatus('AVAILABLE');
                    setQuietModeEnabled(false);
                  }}
                  className={`p-4 rounded-xl border text-left text-xs transition-all ${
                    status === 'AVAILABLE'
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                      : 'border-slate-border bg-white text-charcoal-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-extrabold font-heading text-emerald-800 mb-0.5">
                    Actively Available
                  </span>
                  <span className="text-[11px] text-slate-muted block font-normal leading-relaxed">
                    Open to compatible blood requirement alerts up to your frequency cap.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatus('PAUSED');
                    setQuietModeEnabled(true);
                  }}
                  className={`p-4 rounded-xl border text-left text-xs transition-all ${
                    status === 'PAUSED'
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-600/30'
                      : 'border-slate-border bg-white text-charcoal-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-extrabold font-heading text-indigo-800 mb-0.5 flex items-center gap-1.5">
                    <Moon className="w-4 h-4" /> Quiet Mode
                  </span>
                  <span className="text-[11px] text-slate-muted block font-normal leading-relaxed">
                    Temporarily pause outreach for work, exams, recovery, or travel.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatus('UNAVAILABLE');
                    setQuietModeEnabled(false);
                  }}
                  className={`p-4 rounded-xl border text-left text-xs transition-all ${
                    status === 'UNAVAILABLE'
                      ? 'border-charcoal-900 bg-stone-100 text-charcoal-900 font-bold ring-2 ring-charcoal-900/30'
                      : 'border-slate-border bg-white text-charcoal-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-extrabold font-heading text-charcoal-900 mb-0.5">
                    Unavailable
                  </span>
                  <span className="text-[11px] text-slate-muted block font-normal leading-relaxed">
                    Opt-out from all notifications until manually re-enabled.
                  </span>
                </button>
              </div>
            </div>

            {/* Quiet Mode Configuration */}
            {(status === 'PAUSED' || quietModeEnabled) && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4 animate-in fade-in duration-150 text-xs">
                <div className="flex items-center gap-2 text-indigo-950 font-bold font-heading text-sm">
                  <Moon className="w-4 h-4 text-indigo-700" />
                  Quiet Mode Parameters
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-indigo-950">Pause Duration</label>
                    <select
                      value={pauseDurationDays}
                      onChange={(e) => setPauseDurationDays(Number(e.target.value))}
                      className="form-input bg-white text-xs"
                    >
                      <option value={7}>Pause for 7 Days</option>
                      <option value={14}>Pause for 14 Days (2 Weeks)</option>
                      <option value={30}>Pause for 30 Days (1 Month)</option>
                      <option value={90}>Pause for 90 Days (Quarterly Deferral)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-indigo-950">Emergency Override Exception</label>
                    <div className="pt-2">
                      <label className="flex items-start gap-2 cursor-pointer font-semibold text-indigo-900">
                        <input
                          type="checkbox"
                          checked={emergencyOnly}
                          onChange={(e) => setEmergencyOnly(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600"
                        />
                        <span>
                          Break through Quiet Mode only for <strong>Critical Immediate Trauma Emergencies</strong>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Outreach Frequency Throttling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-border pb-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-charcoal-900">
                  Maximum Outreach Frequency Cap
                </label>
                <select
                  value={maxFrequency}
                  onChange={(e) => setMaxFrequency(Number(e.target.value))}
                  className="form-input"
                >
                  <option value={1}>At most 1 invitation per week</option>
                  <option value={2}>At most 2 invitations per week (Recommended)</option>
                  <option value={3}>At most 3 invitations per week</option>
                </select>
                <p className="text-[11px] text-slate-muted">
                  System algorithm automatically rejects repeated inquiries beyond your declared limit.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-charcoal-900">
                  Voluntary Last Donation Date
                </label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="form-input font-mono"
                />
                <p className="text-[11px] text-slate-muted">
                  Self-reported for reminder intervals. Actual medical clearance is verified at collection centres.
                </p>
              </div>
            </div>

            {/* Notification Delivery Channel */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-charcoal-900">
                Preferred Notification Channel
              </label>
              <select
                value={contactChannel}
                onChange={(e) => setContactChannel(e.target.value as any)}
                className="form-input"
              >
                <option value="IN_APP">In-App Notification Center Only (Highest Privacy)</option>
                <option value="SMS">Encrypted SMS Gateway Alerts</option>
                <option value="WHATSAPP">WhatsApp Official Coordination Bot</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary text-xs gap-2 px-6 py-2.5">
                <Save className="w-4 h-4" />
                Save Availability Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
