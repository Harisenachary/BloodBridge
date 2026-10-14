import React, { useState } from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { Settings, RefreshCw, Save, Database, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSettingsPage: React.FC = () => {
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [autoVerifyHospitals, setAutoVerifyHospitals] = useState(false);

  const handleResetData = () => {
    if (confirm('Reset demo repository to original seed fixtures? Any custom requests created will be cleared.')) {
      demoStore.resetToDefaultDemo();
      toast.success('Demo environment restored to baseline seed data');
      window.location.reload();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System configuration saved');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Platform Configuration &amp; Operations
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Global rate limits, database seed resets, and operational toggles.
            </p>
          </div>

          <form onSubmit={handleSave} className="card-surface p-6 sm:p-8 space-y-6 text-xs">
            <div className="space-y-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
              <h2 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                Security &amp; Spam Throttles
              </h2>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rateLimitEnabled}
                  onChange={(e) => setRateLimitEnabled(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Global In-App Rate Limiting (Max 3 submissions per IP per hour)
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                    Mitigates accidental automated duplicate emergency submissions.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoVerifyHospitals}
                  onChange={(e) => setAutoVerifyHospitals(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Require Two-Factor Manual Review for Hospital License Verification
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                    Prohibits self-service activation of institutional badges without manual staff audit.
                  </span>
                </div>
              </label>
            </div>

            <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 space-y-2">
              <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                Demo Evaluation Repository Tools
              </span>
              <p className="text-amber-800 dark:text-amber-300/80 leading-relaxed">
                You can reset all local storage mutations (new requests, stock edits) back to the official fictional seed data.
              </p>
              <button
                type="button"
                onClick={handleResetData}
                className="btn-secondary text-xs py-1.5 px-3 gap-1.5 mt-1 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/60"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                Reset Store Data to Default
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="btn-primary text-xs py-2 px-5 gap-1.5">
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
