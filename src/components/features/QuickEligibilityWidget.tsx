import React, { useState } from 'react';
import { CheckCircle2, XCircle, Heart, Award, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

export const QuickEligibilityWidget: React.FC = () => {
  const [ageValid, setAgeValid] = useState<boolean | null>(true);
  const [weightValid, setWeightValid] = useState<boolean | null>(true);
  const [intervalValid, setIntervalValid] = useState<boolean | null>(true);
  const [healthValid, setHealthValid] = useState<boolean | null>(true);

  const allAnswered = ageValid !== null && weightValid !== null && intervalValid !== null && healthValid !== null;
  const isEligible = ageValid && weightValid && intervalValid && healthValid;

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#F43F5E', '#FFFFFF'],
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>30-Second Fast Self-Screening</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white tracking-tight">
            Can You Donate Blood Today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Quickly check your eligibility under National Blood Transfusion Council (NBTC) guidelines to see if you can donate blood or platelets.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full self-start md:self-center border border-emerald-200 dark:border-emerald-800">
          Zero Contact Required
        </span>
      </div>

      {/* 4 Interactive Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Check 1: Age */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-xs text-charcoal-900 dark:text-white">
              1. Age Requirement
            </span>
            <span className="text-[11px] font-semibold text-slate-400">18 &ndash; 65 Years</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Are you between 18 and 65 years old?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAgeValid(true)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                ageValid === true
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-charcoal-700 dark:text-slate-300'
              }`}
            >
              Yes (18-65)
            </button>
            <button
              type="button"
              onClick={() => setAgeValid(false)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                ageValid === false
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-charcoal-700 dark:text-slate-300'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Check 2: Weight */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-xs text-charcoal-900 dark:text-white">
              2. Minimum Body Weight
            </span>
            <span className="text-[11px] font-semibold text-slate-400">&ge; 45 &ndash; 50 kg</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Do you weigh at least 50 kg (110 lbs)?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWeightValid(true)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                weightValid === true
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-charcoal-700 dark:text-slate-300'
              }`}
            >
              Yes (&ge; 50 kg)
            </button>
            <button
              type="button"
              onClick={() => setWeightValid(false)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                weightValid === false
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-charcoal-700 dark:text-slate-300'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Check 3: Interval */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-xs text-charcoal-900 dark:text-white">
              3. Donation Interval
            </span>
            <span className="text-[11px] font-semibold text-slate-400">90 Days Gap</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Has it been &gt;90 days since your last donation (or first time)?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIntervalValid(true)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                intervalValid === true
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-charcoal-700 dark:text-slate-300'
              }`}
            >
              Yes / First Time
            </button>
            <button
              type="button"
              onClick={() => setIntervalValid(false)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                intervalValid === false
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-charcoal-700 dark:text-slate-300'
              }`}
            >
              &lt; 90 Days
            </button>
          </div>
        </div>

        {/* Check 4: General Health */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-xs text-charcoal-900 dark:text-white">
              4. General Health Status
            </span>
            <span className="text-[11px] font-semibold text-slate-400">No Acute Illness</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Free of fever, recent surgery, tattoo in past 6 months, or antibiotics?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHealthValid(true)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                healthValid === true
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-charcoal-700 dark:text-slate-300'
              }`}
            >
              Healthy &amp; Clear
            </button>
            <button
              type="button"
              onClick={() => setHealthValid(false)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                healthValid === false
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-charcoal-700 dark:text-slate-300'
              }`}
            >
              Deferred Currently
            </button>
          </div>
        </div>
      </div>

      {/* Result Status Banner */}
      {allAnswered && (
        <div
          className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isEligible
              ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800'
          }`}
        >
          <div className="flex items-center gap-3.5">
            {isEligible ? (
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/30">
                <Award className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-900/30">
                <Heart className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">
                {isEligible
                  ? 'You Are Fully Eligible To Save A Life!'
                  : 'Temporary Medical Deferral'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {isEligible
                  ? 'You satisfy the clinical prerequisites to donate whole blood or single donor platelets.'
                  : 'One or more NBTC safety criteria are not met today. You can re-check once your recovery interval is complete.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isEligible ? (
              <Link
                to="/find-donors"
                onClick={handleCelebrate}
                className="btn-primary text-xs px-5 py-2.5 rounded-xl font-bold gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span>Join Standby Donor Grid</span>
              </Link>
            ) : (
              <Link
                to="/eligibility"
                className="btn-secondary text-xs px-4 py-2 rounded-xl"
              >
                Read Detailed Rules &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
