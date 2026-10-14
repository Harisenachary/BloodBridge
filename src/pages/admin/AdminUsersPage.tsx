import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { ShieldCheck, Moon, Users } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const donors = demoStore.getDonors();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Registered Voluntary Donors Roster
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Overview of active voluntary donors, ABO blood groups, and availability states.
            </p>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Donor Alias</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Blood Group</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Region / Locality</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Status</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Donations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {donors.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{d.display_alias}</span>
                          {d.is_verified && (
                            <span className="badge-verified text-[10px] py-0 px-1.5">Verified</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <CompatibilityBadge bloodGroup={d.blood_group} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {d.locality ? `${d.locality}, ` : ''}{d.city}, {d.state}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            d.availability?.status === 'AVAILABLE'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/60'
                              : d.availability?.status === 'PAUSED'
                              ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300/40 dark:border-indigo-700/60'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {d.availability?.status || 'AVAILABLE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {d.total_donations} times
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
