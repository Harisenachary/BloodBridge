import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { Building2, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOrganizationsPage: React.FC = () => {
  const orgs = demoStore.getOrganizations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Institutional Partners Directory
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Complete catalog of registered hospitals, blood banks, and clinical apheresis centres.
            </p>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Organization Name</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Type</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">License Number</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Location</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orgs.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {org.display_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {org.org_type.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">
                        {org.license_number}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {org.city}, {org.state}
                      </td>
                      <td className="py-3.5 px-4">
                        {org.verification_status === 'VERIFIED' ? (
                          <span className="badge-verified">Verified</span>
                        ) : (
                          <span className="badge-pending">{org.verification_status}</span>
                        )}
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
