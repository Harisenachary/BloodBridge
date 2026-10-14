import React from 'react';
import { Link } from 'react-router-dom';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import {
  Users,
  Building2,
  FileText,
  ShieldCheck,
  AlertTriangle,
  History,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const AdminDashboardPage: React.FC = () => {
  const donors = demoStore.getDonors();
  const requests = demoStore.getRequests();
  const orgs = demoStore.getOrganizations();
  const auditLogs = demoStore.getAuditLogs();

  const pendingOrgs = orgs.filter((o) => o.verification_status === 'PENDING');
  const awaitingReqs = requests.filter((r) => r.status === 'SUBMITTED' || r.status === 'AWAITING_VERIFICATION');
  const fulfilledReqs = requests.filter((r) => r.status === 'FULFILLED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/60">
              Platform Administration
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-2">
              Moderation &amp; Trust Command Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Real-time oversight of voluntary donor pools, hospital verification queues, and request authenticity.
            </p>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-surface p-5">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Registered Donors</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">{donors.length}</p>
              <Link to="/admin/users" className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-semibold block mt-1">
                View Roster &rarr;
              </Link>
            </div>

            <div className="card-surface p-5">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Pending Org Reviews</span>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-heading mt-1">{pendingOrgs.length}</p>
              <Link to="/admin/verification" className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold block mt-1">
                Review Queue &rarr;
              </Link>
            </div>

            <div className="card-surface p-5">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Active Cases</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">{requests.length}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">{awaitingReqs.length} awaiting review</span>
            </div>

            <div className="card-surface p-5">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Fulfilled Transfusions</span>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading mt-1">{fulfilledReqs.length}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">100% auditable closure</span>
            </div>
          </div>

          {/* Pending Organization Verification Queue Preview */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <h2 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Institutional Verification Queue ({pendingOrgs.length})
              </h2>
              <Link to="/admin/verification" className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline">
                Open Full Queue &rarr;
              </Link>
            </div>

            {pendingOrgs.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4">No organizations currently awaiting review.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingOrgs.map((org) => (
                  <div key={org.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{org.display_name}</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        License: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">{org.license_number}</code> &bull; {org.city}, {org.state}
                      </p>
                    </div>
                    <Link
                      to="/admin/verification"
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Audit &amp; Approve
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Audit Log Stream */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <h2 className="font-heading font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                Recent System Audit Trail
              </h2>
              <Link to="/admin/audit-logs" className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline">
                View All Logs &rarr;
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      By <span className="font-medium text-slate-700 dark:text-slate-300">{log.actor_name}</span> ({log.actor_role}) &bull; IP: {log.ip_address}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {formatDistanceToNow(parseISO(log.created_at), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
