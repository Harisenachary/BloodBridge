import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { demoStore } from '@/lib/demo/demoStore';
import { DonorProfile, BloodGroup, BloodComponent } from '@/types';
import { checkClinicalCompatibility } from '@/lib/matching/engine';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Search,
  MapPin,
  Send,
  ShieldCheck,
  Moon,
  CheckCircle2,
  Lock,
  Heart,
  SlidersHorizontal,
  X,
  Droplet,
  Sparkles,
  Users,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

export const FindDonorsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlGroup = searchParams.get('group');

  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>(urlGroup || 'All');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('PACKED_RED_CELLS');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [inviteModalDonor, setInviteModalDonor] = useState<DonorProfile | null>(null);
  const [inviteMessage, setInviteMessage] = useState<string>('');

  useEffect(() => {
    if (urlGroup) {
      setSelectedBloodGroup(urlGroup);
    }
  }, [urlGroup]);

  const allDonors = demoStore.getDonors();
  const requests = demoStore.getRequests();

  const bloodGroups: (BloodGroup | 'All')[] = ['All', 'O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const cities = ['All', 'Hyderabad', 'Bengaluru', 'New Delhi'];

  const filteredDonors = allDonors.filter((donor) => {
    if (selectedCity !== 'All' && donor.city !== selectedCity) return false;
    if (onlyAvailable && donor.availability?.status !== 'AVAILABLE') return false;

    if (selectedBloodGroup !== 'All') {
      const isCompat = checkClinicalCompatibility(
        selectedBloodGroup as BloodGroup,
        donor.blood_group,
        selectedComponent
      );
      if (!isCompat) return false;
    }

    return true;
  });

  const handleSendInvite = () => {
    if (!inviteModalDonor) return;
    toast.success('Private invitation sent!', {
      description: `Donor ${inviteModalDonor.display_alias} has received your invitation.`,
    });
    setInviteModalDonor(null);
    setInviteMessage('');
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. BACKGROUND ERYTHROCYTE CANVAS */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 2. HERO COMMAND BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-rose-50/25 to-slate-50 dark:from-[#0c0f1d] dark:via-[#1c0f2f] dark:to-[#0a1128] border border-slate-200/90 dark:border-rose-500/40 p-8 sm:p-10 text-slate-900 dark:text-white shadow-[0_4px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(255,0,85,0.35)] transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 dark:bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/90 border border-rose-200/80 dark:border-rose-400 text-rose-700 dark:text-rose-300 text-xs font-extrabold tracking-wide shadow-xs">
                <Lock className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span>Zero Contact Harvesting &bull; Anonymous Clinical Matching</span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight text-slate-900 dark:text-white">
                Find Compatible <br />
                <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 bg-clip-text text-transparent font-black">
                  Voluntary Donors.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Connect directly with certified voluntary donors ranked by ABO compatibility algorithms. Personal phone numbers remain shielded until mutual verification.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-md text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 block">
                  Standby Donors
                </span>
                <span className="font-heading font-black text-2xl text-emerald-600 dark:text-emerald-400">
                  {allDonors.length} Verified
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-md text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 block">
                  Match Velocity
                </span>
                <span className="font-heading font-black text-2xl text-cyan-600 dark:text-cyan-400">
                  &lt; 14 Min
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-md text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 block">
                  Active Cities
                </span>
                <span className="font-heading font-black text-2xl text-amber-600 dark:text-amber-400">
                  4 Metros
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. UNIFIED FILTER BAR */}
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-5">
          {/* Blood Group Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Filter by Recipient Blood Group
              </label>
              {selectedBloodGroup !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedBloodGroup('All')}
                  className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline"
                >
                  Reset Blood Group
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-black transition-all ${
                    selectedBloodGroup === bg
                      ? bg === 'All'
                        ? 'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-950 shadow-md scale-105'
                        : 'bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/40 scale-110 border-transparent'
                      : 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-2 border-rose-300/80 dark:border-rose-900/70 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 hover:border-transparent hover:scale-105'
                  }`}
                >
                  {bg === 'All' ? 'All Blood Groups' : bg}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-extrabold text-charcoal-800 dark:text-slate-200 block mb-1.5">
                Blood Component Required
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value as BloodComponent)}
                className="w-full text-xs rounded-xl border border-rose-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-bold"
              >
                <option value="PACKED_RED_CELLS">Packed Red Blood Cells (PRBC)</option>
                <option value="WHOLE_BLOOD">Whole Blood</option>
                <option value="PLATELETS">Platelets (SDP / RDP)</option>
                <option value="PLASMA">Fresh Frozen Plasma (FFP)</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-charcoal-800 dark:text-slate-200 block mb-1.5">
                Target Metro / City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs rounded-xl border border-rose-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-bold"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Cities (National Grid)' : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2.5 cursor-pointer pb-2 font-bold text-charcoal-900 dark:text-white">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                />
                <span>Available Standby Donors Only</span>
              </label>
            </div>
          </div>

          {selectedBloodGroup !== 'All' && (
            <div className="text-xs text-blue-900 dark:text-blue-300 bg-blue-500/10 border border-blue-400/40 p-3 rounded-2xl flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  Filtering verified donors compatible to supply <strong>{selectedComponent.replace(/_/g, ' ')}</strong> to recipient <strong>{selectedBloodGroup}</strong>.
                </span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedBloodGroup('All')}
                className="font-extrabold text-blue-700 dark:text-blue-300 hover:underline ml-2"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* 4. RESULTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-extrabold text-charcoal-900 dark:text-white text-sm">
              {filteredDonors.length} Verified Donors Available
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Shielded Contacts Active
            </span>
          </div>

          {filteredDonors.length === 0 ? (
            <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl p-12 text-center border-2 border-slate-200/80 dark:border-slate-800 space-y-3">
              <Heart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">
                No matching voluntary donors found with current filters
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try setting City to "All Cities" or check registered blood banks for tested reserve stock.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedBloodGroup('All');
                  setSelectedCity('All');
                  setOnlyAvailable(false);
                }}
                className="btn-secondary text-xs px-4 py-2 rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor) => {
                const isAvailable = donor.availability?.status === 'AVAILABLE';
                const isQuiet = donor.availability?.quiet_mode_enabled || donor.availability?.status === 'PAUSED';

                return (
                  <div
                    key={donor.id}
                    className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-rose-200/60 dark:border-rose-900/40 hover:border-rose-500/80 dark:hover:border-rose-500/80 shadow-[0_4px_24px_rgba(255,0,85,0.06)] hover:shadow-[0_12px_36px_rgba(255,0,85,0.18)] transition-all flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-4">
                      {/* Top Row: Blood Group + Name */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#FF0055] via-[#E11D48] to-[#9F1239] text-white font-mono font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-rose-500/30">
                            {donor.blood_group}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">
                                {donor.display_alias}
                              </h3>
                              {donor.is_verified && (
                                <span title="Verified voluntary donor">
                                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              {donor.locality ? `${donor.locality}, ` : ''}{donor.city}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        {isAvailable ? (
                          <span className="badge-verified text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available Standby
                          </span>
                        ) : isQuiet ? (
                          <span className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
                            <Moon className="w-3 h-3" />
                            Quiet Mode
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-bold">Temporarily Deferred</span>
                        )}

                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {donor.total_donations} Lifetime Donations
                        </span>
                      </div>
                    </div>

                    {/* Primary CTA */}
                    <button
                      type="button"
                      onClick={() => setInviteModalDonor(donor)}
                      className="w-full btn-primary text-xs py-3 rounded-2xl gap-2 font-black shadow-[0_4px_16px_rgba(255,0,85,0.35)]"
                    >
                      <Send className="w-3.5 h-3.5 fill-white" />
                      <span>Send SOS Match Invitation</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. INVITE MODAL DIALOG */}
        {inviteModalDonor && (
          <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white font-mono font-black flex items-center justify-center text-sm shadow-md">
                    {inviteModalDonor.blood_group}
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">
                      Invite {inviteModalDonor.display_alias}
                    </h3>
                    <p className="text-[11px] text-slate-400">{inviteModalDonor.city} &bull; Verified Donor</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInviteModalDonor(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-charcoal-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This triggers a secure in-app alert to the donor without exposing their personal phone number. If they confirm availability, mutual contact will be opened.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-white block">
                  Link to Active Emergency Request (Optional)
                </label>
                <select className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-charcoal-900 dark:text-white font-medium">
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.patient_ref_name} &bull; {r.hospital_name} ({r.blood_group})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-white block">
                  Hospital Coordination Note
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="e.g. Urgent PRBC requirement at Apollo Trauma ER. Please let us know if you can assist."
                  rows={3}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-charcoal-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalDonor(null)}
                  className="btn-secondary text-xs px-4 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInvite}
                  className="btn-primary text-xs px-6 py-2.5 rounded-xl gap-2 font-black shadow-card"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch SOS Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
