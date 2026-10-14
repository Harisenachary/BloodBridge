import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const AdminReportsPage: React.FC = () => {
  const reports = [
    {
      id: 'rep-1',
      type: 'COMMERCIAL_SOLICITATION',
      target: 'Requirement #REQ-HYD-9912',
      details: 'Third party agent allegedly requesting convenience payment for replacement donor arrangement.',
      status: 'RESOLVED',
      timestamp: '2026-10-08 14:22',
      resolution: 'Account permanently suspended and referral IP blacklisted per National Blood Policy.',
    },
    {
      id: 'rep-2',
      type: 'SUSPECTED_FAKE_REQUEST',
      target: 'Case Ref #DL-5102',
      details: 'Discrepancy in hospital bed number reported during nurse verification.',
      status: 'DISMISSED',
      timestamp: '2026-10-09 11:05',
      resolution: 'Patient transferred wards. Verified genuine upon clinical review.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Abuse &amp; Policy Violation Moderation
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Enforce strict anti-commercial blood sale prohibitions and fraud countermeasures.
            </p>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {reports.map((r) => (
                <div key={r.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      {r.type.replace(/_/g, ' ')} &mdash; {r.target}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{r.details}</p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <strong>Resolution:</strong> {r.resolution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
