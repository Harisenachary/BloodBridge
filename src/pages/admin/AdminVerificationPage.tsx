import React, { useState } from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { Organization } from '@/types';
import { ShieldCheck, XCircle, CheckCircle2, Building2, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

export const AdminVerificationPage: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>(demoStore.getOrganizations());

  const handleAction = (orgId: string, status: 'VERIFIED' | 'REJECTED') => {
    demoStore.updateOrgVerification(orgId, status);
    setOrgs(demoStore.getOrganizations());
    if (status === 'VERIFIED') {
      toast.success('Organization verified successfully', {
        description: 'Verification badge granted and inventory published to directory.',
      });
    } else {
      toast.error('Organization application rejected');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Institutional Verification Review Queue
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Carefully validate state medical registration and drug control credentials before authorizing facility publishing.
            </p>
          </div>

          <div className="card-surface p-6 space-y-6">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orgs.map((org) => (
                <div key={org.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{org.display_name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {org.org_type}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {org.address}, {org.city}, {org.state}
                    </p>
                    <p className="font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                      License No: <strong className="text-slate-900 dark:text-white">{org.license_number}</strong> &bull; Contact: {org.contact_phone} ({org.contact_email})
                    </p>
                  </div>

                  <div className="space-y-2 shrink-0 md:text-right">
                    <div>
                      {org.verification_status === 'VERIFIED' ? (
                        <span className="badge-verified">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="badge-pending">
                          {org.verification_status}
                        </span>
                      )}
                    </div>

                    {org.verification_status !== 'VERIFIED' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAction(org.id, 'VERIFIED')}
                          className="btn-primary text-xs py-1.5 px-3 gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(org.id, 'REJECTED')}
                          className="btn-outline-danger text-xs py-1.5 px-3 gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
