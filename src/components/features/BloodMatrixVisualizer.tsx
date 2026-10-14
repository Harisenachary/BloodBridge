import React, { useState } from 'react';
import { Droplet, Heart, ShieldAlert, Award, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BloodGroup } from '@/types';

interface BloodMatrixVisualizerProps {
  onSelectGroupForCases?: (group: BloodGroup) => void;
}

export const BloodMatrixVisualizer: React.FC<BloodMatrixVisualizerProps> = ({ onSelectGroupForCases }) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const [componentMode, setComponentMode] = useState<'RED_CELLS' | 'PLASMA'>('RED_CELLS');

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // Compatibility rules for Red Cells
  const redCellDonateTo: Record<BloodGroup, BloodGroup[]> = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'],
  };

  const redCellReceiveFrom: Record<BloodGroup, BloodGroup[]> = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  };

  // Compatibility rules for Plasma (opposite of red cells!)
  const plasmaDonateTo: Record<BloodGroup, BloodGroup[]> = {
    'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    'AB-': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A+', 'A-', 'O+', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B+', 'B-', 'O+', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O+', 'O-'],
  };

  const populationStats: Record<BloodGroup, { percent: string; demand: string; rarity: string }> = {
    'O-': { percent: '~2.5% in India (7% Global)', demand: 'Extremely High (Emergency Universal)', rarity: 'Rare Universal' },
    'O+': { percent: '~38% in India', demand: 'Very High (Most Common)', rarity: 'Common Vital' },
    'A+': { percent: '~21% in India', demand: 'High', rarity: 'Standard' },
    'A-': { percent: '~1.5% in India', demand: 'High', rarity: 'Very Rare' },
    'B+': { percent: '~32% in India', demand: 'Very High', rarity: 'Common Vital' },
    'B-': { percent: '~2.0% in India', demand: 'High', rarity: 'Rare' },
    'AB+': { percent: '~8.5% in India', demand: 'Moderate (Universal Recipient)', rarity: 'Universal Plasma' },
    'AB-': { percent: '~0.5% in India', demand: 'High (Extremely Scarce)', rarity: 'Ultra Rare' },
  };

  const canDonateTo = componentMode === 'RED_CELLS' ? redCellDonateTo[selectedGroup] : plasmaDonateTo[selectedGroup];
  const canReceiveFrom = componentMode === 'RED_CELLS' ? redCellReceiveFrom[selectedGroup] : ['AB+', 'AB-']; // Simplified for quick display

  const isUniversalDonor = selectedGroup === 'O-';
  const isUniversalRecipient = selectedGroup === 'AB+';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-brand-red text-xs font-bold mb-2">
            <Droplet className="w-3.5 h-3.5 fill-brand-red" />
            <span>Clinical Transfusion Matrix</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white tracking-tight">
            Interactive Blood Compatibility Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Select your blood group to instantly inspect certified clinical transfusion compatibility, liquid volume metrics, and universal biological profiles.
          </p>
        </div>

        {/* Component Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl self-start md:self-center">
          <button
            type="button"
            onClick={() => setComponentMode('RED_CELLS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              componentMode === 'RED_CELLS'
                ? 'bg-brand-red text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-charcoal-900'
            }`}
          >
            Packed Red Cells (PRBC)
          </button>
          <button
            type="button"
            onClick={() => setComponentMode('PLASMA')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              componentMode === 'PLASMA'
                ? 'bg-brand-red text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-charcoal-900'
            }`}
          >
            Fresh Frozen Plasma (FFP)
          </button>
        </div>
      </div>

      {/* Blood Group Selector Grid */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
          Select Your Blood Group:
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {bloodGroups.map((bg) => {
            const isSelected = selectedGroup === bg;
            return (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={`relative py-3 rounded-2xl font-mono text-base font-extrabold transition-all flex flex-col items-center justify-center gap-1 border ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white border-transparent shadow-lg shadow-rose-900/30 scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/50 text-charcoal-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-brand-red/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
                }`}
              >
                <span>{bg}</span>
                {bg === 'O-' && (
                  <span className="text-[9px] font-sans font-bold bg-white/20 px-1.5 rounded-full">
                    Univ.
                  </span>
                )}
                {bg === 'AB+' && (
                  <span className="text-[9px] font-sans font-bold bg-white/20 px-1.5 rounded-full">
                    Recip.
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Visual Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
        {/* Visual Blood Bag Illustration with Animated Wave (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/60 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <div className="relative w-44 h-60 flex items-center justify-center">
            {/* SVG Blood Bag */}
            <svg
              className="w-full h-full drop-shadow-xl"
              viewBox="0 0 160 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bag top hanger clip */}
              <rect x="65" y="4" width="30" height="12" rx="4" fill="#94A3B8" />
              <circle cx="80" cy="10" r="3" fill="#0F172A" />

              {/* Bag tube connector */}
              <rect x="74" y="16" width="12" height="14" fill="#CBD5E1" />

              {/* Bag body transparent container */}
              <rect
                x="20"
                y="30"
                width="120"
                height="170"
                rx="24"
                fill="#1E293B"
                fillOpacity="0.1"
                stroke="#E2E8F0"
                strokeWidth="2.5"
                className="dark:stroke-slate-700"
              />

              {/* Liquid fill mask */}
              <clipPath id="liquidClip">
                <rect x="22" y="32" width="116" height="166" rx="22" />
              </clipPath>

              <g clipPath="url(#liquidClip)">
                {/* Red liquid wave fill */}
                <rect
                  x="20"
                  y="70"
                  width="120"
                  height="130"
                  fill="url(#liquidGrad)"
                  className="transition-all duration-700"
                />
                {/* Liquid top reflection wave */}
                <ellipse cx="80" cy="72" rx="60" ry="8" fill="#F43F5E" fillOpacity="0.8" />
              </g>

              {/* Medical markings */}
              <line x1="120" y1="80" x2="132" y2="80" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="120" y1="110" x2="132" y2="110" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="120" y1="140" x2="132" y2="140" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="120" y1="170" x2="132" y2="170" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Tube coming out bottom */}
              <path
                d="M80,200 L80,218"
                stroke="#F43F5E"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" />
                  <stop offset="40%" stopColor="#E11D48" />
                  <stop offset="100%" stopColor="#881337" />
                </linearGradient>
              </defs>
            </svg>

            {/* Blood Type Overlay Badge on Bag */}
            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="font-mono font-black text-3xl text-white drop-shadow-md">
                {selectedGroup}
              </span>
              <span className="block text-[10px] font-bold text-white/90 uppercase tracking-widest">
                450 mL
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
              Group {selectedGroup} Telemetry
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              {populationStats[selectedGroup].rarity} &bull; {populationStats[selectedGroup].percent}
            </p>
          </div>
        </div>

        {/* Compatibility Flows & Explanations (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Universal Profile Callout */}
          {isUniversalDonor && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3">
              <Award className="w-5 h-5 text-brand-red shrink-0" />
              <div className="text-xs">
                <strong className="text-brand-burgundy dark:text-rose-300 block font-bold">
                  Universal Red Blood Cell Donor (O Negative)
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Your red cells have zero A, B, or Rh antigens. Emergency trauma rooms rely on O- blood when a patient&apos;s blood type is unknown!
                </span>
              </div>
            </div>
          )}

          {isUniversalRecipient && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs">
                <strong className="text-blue-900 dark:text-blue-300 block font-bold">
                  Universal Red Blood Cell Recipient (AB Positive)
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  You possess all antigens and can safely receive red blood cells from every donor type (A, B, AB, O)!
                </span>
              </div>
            </div>
          )}

          {/* Dual Flow Cards: Can Donate To & Can Receive From */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Can Donate To */}
            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal-900 dark:text-white flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  Can Donate Red Cells To:
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {canDonateTo.length} Recipient Groups
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {bloodGroups.map((bg) => {
                  const isCompatible = canDonateTo.includes(bg);
                  return (
                    <span
                      key={bg}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                        isCompatible
                          ? 'bg-emerald-500 text-white shadow-sm font-extrabold scale-102'
                          : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400 line-through opacity-40'
                      }`}
                    >
                      {bg}
                    </span>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Transfusing outside these groups can trigger acute hemolytic reactions. Clinical cross-matching verified before release.
              </p>
            </div>

            {/* Can Receive From */}
            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal-900 dark:text-white flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-rose-500 fill-rose-500" />
                  Can Receive Red Cells From:
                </span>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                  {canReceiveFrom.length} Donor Groups
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {bloodGroups.map((bg) => {
                  const isCompatible = canReceiveFrom.includes(bg);
                  return (
                    <span
                      key={bg}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                        isCompatible
                          ? 'bg-brand-red text-white shadow-sm font-extrabold scale-102'
                          : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400 line-through opacity-40'
                      }`}
                    >
                      {bg}
                    </span>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                O- donors can give to all, but can only receive from another O- donor. Keep standby reserves replenished!
              </p>
            </div>
          </div>

          {/* Action to Filter Active Cases */}
          {onSelectGroupForCases && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectGroupForCases(selectedGroup)}
                className="w-full btn-secondary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>Filter Active Cases Seeking {selectedGroup} Blood &rarr;</span>
                <ArrowRight className="w-4 h-4 text-brand-red" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
