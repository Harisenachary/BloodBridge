import React, { useState } from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { BloodRequest, RequestStatus } from '@/types';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';
import { ShieldCheck, CheckCircle2, XCircle, Search, Activity } from 'lucide-react';
import { toast } from 'sonner';

export const OrgRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>(demoStore.getRequests());

  const handleUpdateStatus = (
    requestId: string,
    newStatus: RequestStatus,
    notes: string
  ) => {
    demoStore.updateRequestStatus(
      requestId,
      newStatus,
      'Dr. Ramesh (Apollo ER)',
      'HOSPITAL_STAFF',
      notes
    );
    setRequests(demoStore.getRequests());
    toast.success(`Request status transitioned to ${newStatus}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Coordinated Case Queue
            </h1>
            <p className="text-sm text-slate-muted mt-1 leading-relaxed">
              Verify clinical authenticity of emergency requests assigned to your facility and mark fulfillment.
            </p>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="divide-y divide-slate-100">
              {requests.map((r) => (
                <div key={r.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <CompatibilityBadge bloodGroup={r.blood_group} size="sm" />
                      <span className="font-bold text-charcoal-900 text-sm">{r.patient_ref_name}</span>
                      <span className="text-slate-muted">&bull; {r.units_needed} Units ({r.component})</span>
                    </div>
                    <p className="text-slate-muted">
                      Facility: <strong>{r.hospital_name}</strong> &bull; Urgency: <strong>{r.urgency}</strong>
                    </p>
                    <p className="text-[11px] text-charcoal-700 bg-surface-subtle p-2 rounded-lg border border-slate-border/50">
                      Tracking Token: <code className="font-mono font-bold">{r.public_token}</code> &bull; Contact: {r.contact_phone}
                    </p>
                  </div>

                  <div className="space-y-2 shrink-0 md:text-right">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-red-50 text-brand-burgundy border border-red-200">
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Hospital staff action buttons depending on lifecycle */}
                    <div className="flex items-center gap-2">
                      {r.status === 'SUBMITTED' || r.status === 'AWAITING_VERIFICATION' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(r.id, 'VERIFIED', 'Clinically verified by hospital blood bank officer.')}
                          className="btn-primary text-xs px-3 py-1.5 gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verify Case
                        </button>
                      ) : null}

                      {r.status === 'VERIFIED' || r.status === 'MATCHING_IN_PROGRESS' || r.status === 'DONOR_RESPONSES_RECEIVED' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(r.id, 'FULFILLED', 'Blood units successfully secured and transfused.')}
                          className="btn-secondary text-xs px-3 py-1.5 gap-1.5 bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Mark Fulfilled
                        </button>
                      ) : null}
                    </div>
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
