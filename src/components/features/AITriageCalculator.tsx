import React, { useState } from 'react';
import { Sparkles, Activity, Clock, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BloodComponent, UrgencyLevel } from '@/types';

interface ClinicalScenario {
  id: string;
  name: string;
  icon: string;
  component: BloodComponent;
  componentLabel: string;
  defaultUnits: number;
  urgency: UrgencyLevel;
  urgencyLabel: string;
  dispatchWindow: string;
  advisory: string;
}

const scenarios: ClinicalScenario[] = [
  {
    id: 'trauma',
    name: 'Acute Trauma & Hemorrhagic Shock',
    icon: '🚑',
    component: 'WHOLE_BLOOD',
    componentLabel: 'Whole Blood / Massive Transfusion Protocol',
    defaultUnits: 4,
    urgency: 'CRITICAL_IMMEDIATE',
    urgencyLabel: 'Critical Immediate (< 30 Mins)',
    dispatchWindow: 'Immediate dispatch required. Activate universal O- standby relay.',
    advisory: 'Prioritize uncrossed O- PRBC if typing takes > 15 mins. Monitor calcium levels in massive transfusion.',
  },
  {
    id: 'dengue',
    name: 'Dengue Thrombocytopenia (Low Platelets)',
    icon: '🦟',
    component: 'PLATELETS',
    componentLabel: 'Single Donor Platelets (SDP) / RDP Pool',
    defaultUnits: 1,
    urgency: 'URGENT_WITHIN_12H',
    urgencyLabel: 'Priority Tier (Within 4-12 Hours)',
    dispatchWindow: 'Platelet count < 20,000 / µL with mucosal bleeding indicators.',
    advisory: 'Verify platelet count within 2h of transfusion. Maintain constant gentle agitation prior to infusion.',
  },
  {
    id: 'surgery',
    name: 'Open Heart & Major Vascular Surgery',
    icon: '🫀',
    component: 'PACKED_RED_CELLS',
    componentLabel: 'Packed Red Blood Cells (PRBC)',
    defaultUnits: 2,
    urgency: 'PLANNED_WITHIN_24H',
    urgencyLabel: 'Scheduled / Elective Procedure (12h - 24h)',
    dispatchWindow: 'Cross-match reserved 4 hours prior to operating incision.',
    advisory: 'Ensure fresh units (< 14 days storage) to optimize tissue oxygenation and reduce potassium leakage.',
  },
  {
    id: 'maternal',
    name: 'Postpartum Hemorrhage (PPH / C-Section)',
    icon: '👶',
    component: 'PLASMA',
    componentLabel: 'Plasma (FFP) + Packed Cells',
    defaultUnits: 2,
    urgency: 'CRITICAL_IMMEDIATE',
    urgencyLabel: 'Critical Immediate Emergency',
    dispatchWindow: 'Rapid bedside delivery within 20 mins.',
    advisory: 'Administer 1:1 PRBC to FFP ratio if blood loss exceeds 1,500 mL. Keep patient warm.',
  },
  {
    id: 'thalassemia',
    name: 'Thalassemia Major / Chronic Transfusion',
    icon: '🧬',
    component: 'PACKED_RED_CELLS',
    componentLabel: 'Leukoreduced Packed Red Cells',
    defaultUnits: 1,
    urgency: 'ROUTINE',
    urgencyLabel: 'Routine Maintenance (24h - 48h)',
    dispatchWindow: 'Scheduled recurring transfusion cycle.',
    advisory: 'Leukocyte-filtered units mandatory to minimize alloimmunization and febrile non-hemolytic reactions.',
  },
];

export const AITriageCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<ClinicalScenario>(scenarios[0]);

  const handleApplyToRequest = () => {
    navigate('/request-blood');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Clinical Decision Support Engine</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white tracking-tight">
            Urgency Triage &amp; Component Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Select a medical condition to calculate calibrated component requirements, urgency classifications, and optimal clinical dispatch windows.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full self-start md:self-center">
          NABH &amp; WHO Guidelines
        </span>
      </div>

      {/* Scenario Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
          Select Clinical Medical Scenario:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {scenarios.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenario(sc)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex items-center gap-3 ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs shrink-0">
                  {sc.icon}
                </span>
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-xs text-charcoal-900 dark:text-white truncate">
                    {sc.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {sc.componentLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculated Output Card */}
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-rose-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl p-5 sm:p-6 border border-indigo-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400">
                Recommended Prescription
              </span>
              <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">
                {selectedScenario.componentLabel}
              </h3>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-center ${
              selectedScenario.urgency === 'CRITICAL_IMMEDIATE'
                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {selectedScenario.urgencyLabel}
          </span>
        </div>

        {/* Breakdown Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Standard Dosage</span>
            <span className="font-bold text-charcoal-900 dark:text-white text-sm mt-0.5 block">
              {selectedScenario.defaultUnits} Units Required
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Dispatch Window</span>
            <span className="font-semibold text-charcoal-800 dark:text-slate-200 mt-0.5 block">
              {selectedScenario.dispatchWindow}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Clinical Standard</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Protocol
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <strong>Advisory:</strong> {selectedScenario.advisory}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleApplyToRequest}
            className="w-full sm:w-auto btn-primary text-xs px-6 py-2.5 rounded-xl gap-2 font-bold shadow-card"
          >
            <span>Proceed with Recommended Case &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
