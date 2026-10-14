import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Heart,
  Scale,
  Calendar,
  Activity,
  ShieldCheck,
  ArrowRight,
  Droplet,
  Sparkles,
  PhoneCall,
  Check,
  Clock,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';

export const EligibilityPage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({
    age: true,
    weight: true,
    interval: true,
    health: true,
    surgery: false,
    tattoo: false,
    medication: false,
  });

  const criteria = [
    {
      id: 'age',
      title: 'Are you between 18 and 65 years of age?',
      description: 'Standard voluntary blood donor age criteria per Ministry of Health & Family Welfare guidelines.',
      passWhen: true,
      icon: Calendar,
      accentColor: 'text-rose-500',
    },
    {
      id: 'weight',
      title: 'Do you weigh at least 45 kg (100 lbs)?',
      description: 'Necessary to safely donate 350 mL or 450 mL of whole blood without hypovolemic fatigue.',
      passWhen: true,
      icon: Scale,
      accentColor: 'text-amber-500',
    },
    {
      id: 'interval',
      title: 'Has it been at least 90 days since your last whole blood donation?',
      description: 'Mandatory interval allows full biological replenishment of red blood cells and iron stores.',
      passWhen: true,
      icon: Clock,
      accentColor: 'text-cyan-500',
    },
    {
      id: 'health',
      title: 'Are you feeling fit and healthy today with no active cold or fever?',
      description: 'You should feel energetic, well-hydrated, and well-rested before entering transfusion collection.',
      passWhen: true,
      icon: Activity,
      accentColor: 'text-emerald-500',
    },
    {
      id: 'surgery',
      title: 'Have you had major surgery or blood transfusion in the past 6 months?',
      description: 'Requires a clinical deferral period to ensure complete physical tissue recovery.',
      passWhen: false,
      icon: ShieldCheck,
      accentColor: 'text-purple-500',
    },
    {
      id: 'tattoo',
      title: 'Have you gotten a tattoo, piercing, or acupuncture in the past 6 months?',
      description: 'Window period protocol for transfusion safety against bloodborne viral pathogens.',
      passWhen: false,
      icon: AlertTriangle,
      accentColor: 'text-orange-500',
    },
    {
      id: 'medication',
      title: 'Are you currently taking antibiotics or anti-coagulant medications?',
      description: 'Certain prescriptions require temporary deferral until the course is fully metabolized.',
      passWhen: false,
      icon: Heart,
      accentColor: 'text-pink-500',
    },
  ];

  const toggleAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const passingCount = criteria.filter((c) => answers[c.id] === c.passWhen).length;
  const isEligible = passingCount === criteria.length;

  const triggerCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. BACKGROUND MOTION GRAPHICS */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 2. COSMIC BIO-TECH HERO HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] border-2 border-rose-500/40 p-8 sm:p-10 text-white shadow-[0_25px_60px_-15px_rgba(255,0,85,0.35)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-400 text-rose-300 text-xs font-extrabold tracking-wide shadow-[0_0_15px_rgba(255,0,85,0.3)]">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                <span>Voluntary Donor Medical Screening Protocol</span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight text-white">
                Preliminary Donor <br />
                <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent font-black">
                  Eligibility Evaluation.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Take this certified self-assessment checklist before stepping forward. Instant, private, and mapped to Ministry of Health clinical criteria.
              </p>
            </div>

            {/* Scorecard Pill */}
            <div className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shrink-0 text-center space-y-1 sm:w-48">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Criteria Passed
              </span>
              <div className="font-heading font-black text-4xl text-white">
                <span className={isEligible ? 'text-emerald-400' : 'text-amber-400'}>
                  {passingCount}
                </span>
                <span className="text-xl text-slate-400">/{criteria.length}</span>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block ${
                isEligible
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
              }`}>
                {isEligible ? 'Eligible to Donate' : 'Pending Clearance'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. QUESTIONNAIRE CHECKLIST CARD */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-charcoal-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                Clinical Pre-Screening Questionnaire
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Answer each medical inquiry below to review immediate eligibility status.
              </p>
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              7 Vital Inquiries
            </span>
          </div>

          <div className="space-y-4">
            {criteria.map((c, index) => {
              const currentVal = answers[c.id];
              const isPassing = currentVal === c.passWhen;
              const IconComp = c.icon;

              return (
                <div
                  key={c.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isPassing
                      ? 'bg-slate-50/80 dark:bg-slate-950/50 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50'
                      : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                      <IconComp className={`w-5 h-5 ${c.accentColor}`} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                          0{index + 1}
                        </span>
                        <h3 className="font-heading font-extrabold text-sm sm:text-base text-charcoal-900 dark:text-white">
                          {c.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                        {c.description}
                      </p>
                    </div>
                  </div>

                  {/* Yes / No Toggle Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => toggleAnswer(c.id, true)}
                      className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                        currentVal === true
                          ? c.passWhen === true
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 scale-105'
                            : 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-900/40 scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAnswer(c.id, false)}
                      className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                        currentVal === false
                          ? c.passWhen === false
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40 scale-105'
                            : 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-900/40 scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. RESULTS BANNER */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border-2 transition-all ${
              isEligible
                ? 'bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/20 border-emerald-400 dark:border-emerald-500 shadow-[0_12px_36px_rgba(16,185,129,0.2)]'
                : 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/20 border-amber-400 dark:border-amber-500 shadow-[0_12px_36px_rgba(245,158,11,0.2)]'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md ${
                  isEligible
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30'
                }`}>
                  {isEligible ? (
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white">
                    {isEligible
                      ? 'Preliminary Self-Check Passed with Distinction!'
                      : 'Temporary Clinical Deferral Suggested'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {isEligible
                      ? 'Based on certified MoHFW protocols, you appear fully eligible to donate blood. Step forward to become a verified emergency standby donor.'
                      : 'One or more responses indicate you may be temporarily deferred to safeguard your personal health or transfusion recipient safety.'}
                  </p>
                </div>
              </div>

              {isEligible && (
                <div className="shrink-0 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={triggerCelebrate}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-600 hover:scale-105 transition-transform"
                    title="Celebrate Eligibility"
                  >
                    🎉
                  </button>
                  <Link
                    to="/register?intent=donor"
                    className="btn-primary text-xs px-6 py-3 rounded-2xl gap-2 font-black shadow-md shadow-rose-900/40"
                  >
                    <span>Register as Donor</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. MANDATORY CLINICAL SCREENING NOTICE */}
        <div className="bg-gradient-to-br from-white via-blue-50/40 to-white dark:from-slate-900 dark:via-[#091b29] dark:to-slate-900 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border-2 border-blue-300/80 dark:border-blue-900/80 shadow-[0_8px_30px_rgba(6,182,212,0.1)] space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-heading font-extrabold text-sm text-charcoal-900 dark:text-white">
              Mandatory On-Site Clinical Screening Notice
            </h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            This self-assessment questionnaire is solely an informational guideline. At every blood donation camp or licensed blood centre, a qualified medical officer will check your pulse, blood pressure, temperature, and perform a fingerstick hemoglobin test (&ge; 12.5 g/dL) before approving collection.
          </p>
        </div>
      </div>
    </div>
  );
};
