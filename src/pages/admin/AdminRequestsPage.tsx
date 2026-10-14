import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { Link } from 'react-router-dom';

export const AdminRequestsPage: React.FC = () => {
  const requests = demoStore.getRequests();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Platform-Wide Blood Requirements
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Global oversight of all emergency and planned blood coordination cases.
            </p>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Case ID / Blood Group</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Component</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Hospital</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Urgency</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Status</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Tracking Secret</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <CompatibilityBadge bloodGroup={r.blood_group} size="sm" />
                          <span className="font-bold text-slate-900 dark:text-white">{r.patient_ref_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {r.units_needed} Units &bull; {r.component.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {r.hospital_name} ({r.hospital_city})
                      </td>
                      <td className="py-3.5 px-4 font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px]">
                        {r.urgency.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {r.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <Link to={`/request-status/${r.public_token}`} className="hover:underline text-rose-600 dark:text-rose-400 font-semibold">
                          {r.public_token}
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
