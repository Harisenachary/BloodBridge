import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { StatusTimeline } from '@/components/common/StatusTimeline';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { ArrowLeft, XCircle, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export const RequesterRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const request = demoStore.getRequestById(id || '') || demoStore.getRequests()[0];
  const history = demoStore.getRequestHistory(request?.id || '');

  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleCancelRequest = () => {
    demoStore.updateRequestStatus(
      request.id,
      'CANCELLED',
      'Priya Sharma (Requester)',
      'REQUESTER',
      'Cancelled directly by the requester from the coordination desk.'
    );
    toast.success('Request marked as Cancelled');
    setConfirmCancel(false);
  };

  if (!request) {
    return (
      <div className="p-12 text-center text-xs text-slate-muted">
        Request not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <Link
              to="/requester/requests"
              className="inline-flex items-center gap-1.5 text-xs text-slate-muted hover:text-charcoal-900 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Requests
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-4">
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-charcoal-900">
                  {request.patient_ref_name}
                </h1>
                <p className="text-xs text-slate-muted">
                  Tracking Secret: <span className="font-mono font-bold text-charcoal-900">{request.public_token}</span>
                </p>
              </div>

              {request.status !== 'CANCELLED' && request.status !== 'FULFILLED' && (
                <div>
                  {confirmCancel ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-700 font-bold">Confirm cancel?</span>
                      <button
                        onClick={handleCancelRequest}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold"
                      >
                        Yes, Cancel
                      </button>
                      <button
                        onClick={() => setConfirmCancel(false)}
                        className="px-2 py-1 text-xs text-slate-muted"
                      >
                        Abort
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className="btn-outline-danger text-xs gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel This Request
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card-surface p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-border">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-muted block">Blood Group</span>
                <div className="mt-1">
                  <CompatibilityBadge bloodGroup={request.blood_group} size="md" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-muted block">Component</span>
                <span className="font-bold text-charcoal-900 text-xs block mt-1">{request.component.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-muted block">Units</span>
                <span className="font-bold text-charcoal-900 text-xs block mt-1">{request.units_needed} Units</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-muted block">Facility</span>
                <span className="font-semibold text-charcoal-900 text-xs block mt-1">{request.hospital_name}</span>
              </div>
            </div>

            <StatusTimeline currentStatus={request.status} history={history} />
          </div>
        </div>
      </div>
    </div>
  );
};
