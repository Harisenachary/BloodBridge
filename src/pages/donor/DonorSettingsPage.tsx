import React, { useState } from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { Lock, ShieldCheck, Trash2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const DonorSettingsPage: React.FC = () => {
  const [dataConsent, setDataConsent] = useState(true);
  const [allowEmergencyDirectCall, setAllowEmergencyDirectCall] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Privacy & security preferences updated');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you wish to withdraw consent and delete your voluntary donor profile?')) {
      toast.info('Account marked for deletion. Data anonymized.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Donor Privacy &amp; Security Settings
            </h1>
            <p className="text-sm text-slate-muted mt-1 leading-relaxed">
              Configure communication security, explicit consent boundaries, and data deletion rights.
            </p>
          </div>

          <form onSubmit={handleSave} className="card-surface p-6 sm:p-8 space-y-6 text-xs">
            <div className="space-y-4 border-b border-slate-border pb-6">
              <h2 className="font-heading font-bold text-sm text-charcoal-900">
                Data Consent &amp; Visibility Controls
              </h2>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataConsent}
                  onChange={(e) => setDataConsent(e.target.checked)}
                  className="mt-0.5 rounded text-brand-red focus:ring-brand-red"
                />
                <div>
                  <span className="font-bold text-charcoal-900 block">
                    Allow BloodBridge Matching Engine to Query My Blood Group
                  </span>
                  <span className="text-slate-muted leading-relaxed block mt-0.5">
                    When unchecked, your profile is completely hidden from all emergency matching algorithms.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowEmergencyDirectCall}
                  onChange={(e) => setAllowEmergencyDirectCall(e.target.checked)}
                  className="mt-0.5 rounded text-brand-red focus:ring-brand-red"
                />
                <div>
                  <span className="font-bold text-charcoal-900 block">
                    Disclose Encrypted Phone to Hospital ER Desk for Critical Code Red Cases Only
                  </span>
                  <span className="text-slate-muted leading-relaxed block mt-0.5">
                    Permits the verified hospital transfusion officer to dial your number directly in life-or-death trauma resuscitations.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="btn-outline-danger text-xs gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Withdraw Consent &amp; Delete Profile
              </button>

              <button type="submit" className="btn-primary text-xs gap-1.5">
                <Save className="w-3.5 h-3.5" />
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
