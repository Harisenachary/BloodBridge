import React from 'react';
import { RequestStatus, RequestStatusHistory } from '@/types';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Users,
  Activity,
  Award,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface StatusTimelineProps {
  currentStatus: RequestStatus;
  history: RequestStatusHistory[];
}

const LIFECYCLE_STEPS: { status: RequestStatus; label: string; icon: React.ElementType }[] = [
  { status: 'SUBMITTED', label: 'Submitted', icon: Clock },
  { status: 'AWAITING_VERIFICATION', label: 'Verification', icon: ShieldCheck },
  { status: 'VERIFIED', label: 'Verified', icon: CheckCircle2 },
  { status: 'MATCHING_IN_PROGRESS', label: 'Donor Matching', icon: Search },
  { status: 'DONOR_RESPONSES_RECEIVED', label: 'Responses In', icon: Users },
  { status: 'COORDINATION_IN_PROGRESS', label: 'Coordination', icon: Activity },
  { status: 'FULFILLED', label: 'Fulfilled', icon: Award },
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, history }) => {
  const isTerminalNegative = currentStatus === 'CANCELLED' || currentStatus === 'EXPIRED' || currentStatus === 'REJECTED';

  const getStepIndex = (s: RequestStatus) => {
    return LIFECYCLE_STEPS.findIndex((step) => step.status === s);
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Step Progress Bar */}
      <div className="relative">
        <div className="hidden sm:flex items-center justify-between relative z-10">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentIndex >= idx && !isTerminalNegative;
            const isCurrent = currentStatus === step.status;

            return (
              <div key={step.status} className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-brand-red text-white ring-4 ring-red-100 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] font-medium mt-2 text-center max-w-[80px] ${
                    isCurrent
                      ? 'text-brand-red font-bold'
                      : isCompleted
                      ? 'text-charcoal-900 font-medium'
                      : 'text-slate-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Connector Line behind steps (desktop) */}
        <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

        {/* Terminal state warning banner if cancelled / rejected */}
        {isTerminalNegative && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-800">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>
              Request status is <strong>{currentStatus}</strong>. Public coordination for this case has ceased.
            </span>
          </div>
        )}
      </div>

      {/* Audit Event History Timeline */}
      <div className="bg-surface rounded-xl border border-slate-border p-5">
        <h4 className="font-heading font-bold text-sm text-charcoal-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-red" />
          Audited Transition History
        </h4>

        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-xs text-slate-muted">No transition events recorded yet.</p>
          ) : (
            history.map((item, idx) => (
              <div key={item.id || idx} className="flex items-start gap-3 relative pb-4 last:pb-0">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-red mt-1.5 flex-shrink-0" />
                <div className="flex-1 bg-surface-subtle/50 rounded-lg p-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-charcoal-900">
                      Status transitioned to {item.new_status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-muted">
                      {item.created_at ? formatDistanceToNow(parseISO(item.created_at), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-charcoal-700 mt-1 leading-relaxed">{item.notes}</p>
                  )}
                  {item.actor_role && (
                    <span className="inline-block mt-2 text-[10px] font-semibold bg-white border border-slate-border px-2 py-0.5 rounded text-slate-muted">
                      Actor: {item.actor_name ? `${item.actor_name} (${item.actor_role})` : item.actor_role}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
