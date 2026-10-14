import React from 'react';
import { Link } from 'react-router-dom';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';
import { Plus, Building2, Calendar, FileText } from 'lucide-react';

export const RequesterRequestsPage: React.FC = () => {
  const requests = demoStore.getRequests();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
                All Blood Requests
              </h1>
              <p className="text-sm text-slate-muted mt-1">
                Full history of requirements registered under your account.
              </p>
            </div>

            <Link to="/request-blood" className="btn-primary text-xs gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              New Blood Request
            </Link>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle text-slate-muted border-b border-slate-border">
                  <tr>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Reference / Group</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Component &amp; Units</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Facility</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Current Status</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <CompatibilityBadge bloodGroup={r.blood_group} size="sm" />
                          <div>
                            <span className="font-bold text-charcoal-900 block">{r.patient_ref_name}</span>
                            <span className="font-mono text-[10px] text-slate-muted">{r.public_token}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-charcoal-900">{r.units_needed} Units</span>
                        <span className="block text-[11px] text-slate-muted">{r.component.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="py-3.5 px-4 text-charcoal-800">
                        {r.hospital_name}
                        <span className="block text-[10px] text-slate-muted">{r.hospital_city}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-brand-burgundy border border-red-200">
                          {r.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/request-status/${r.public_token}`}
                          className="text-brand-red font-bold hover:underline"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
