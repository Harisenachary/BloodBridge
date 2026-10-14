import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { History, Shield, Terminal } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const AdminAuditLogsPage: React.FC = () => {
  const auditLogs = demoStore.getAuditLogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              System Audit Logs &amp; Security Events
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Cryptographically timestamped audit trail of all state transitions, inventory updates, and identity adjustments.
            </p>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Timestamp</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Action Event</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Actor</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">IP Address</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Payload Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {log.created_at ? format(parseISO(log.created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {log.actor_name} ({log.actor_role})
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {log.ip_address}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {JSON.stringify(log.metadata || {})}
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
