import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { Users, UserPlus, Shield, Mail } from 'lucide-react';

export const OrgStaffPage: React.FC = () => {
  const staffMembers = [
    {
      id: 's-1',
      name: 'Dr. Ramesh Kumar',
      email: 'dr.ramesh@apollo-demo.org',
      role: 'Blood Bank Medical Officer (Admin)',
      status: 'Active',
    },
    {
      id: 's-2',
      name: 'Sister Mary Varghese',
      email: 'm.varghese@apollo-demo.org',
      role: 'Transfusion Unit Coordinator',
      status: 'Active',
    },
    {
      id: 's-3',
      name: 'K. Rajesh (Tech)',
      email: 'k.rajesh@apollo-demo.org',
      role: 'Apheresis Technician',
      status: 'Active',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
                Authorized Facility Staff Roster
              </h1>
              <p className="text-sm text-slate-muted mt-1 leading-relaxed">
                Hospital staff members authorized to adjust inventory and verify case requirements.
              </p>
            </div>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="divide-y divide-slate-100">
              {staffMembers.map((member) => (
                <div key={member.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal-900">{member.name}</span>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {member.status}
                      </span>
                    </div>
                    <p className="text-slate-muted flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {member.email}
                    </p>
                    <span className="text-[11px] font-semibold text-charcoal-700 block">
                      Role: {member.role}
                    </span>
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
