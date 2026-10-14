import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { History, Award, CheckCircle2, Calendar, Building2 } from 'lucide-react';

export const DonorHistoryPage: React.FC = () => {
  const donor = demoStore.getDonors()[0];

  const donationEvents = [
    {
      id: 'd-1',
      date: '2026-06-10',
      facility: 'Apollo Hospital Blood Centre (Hyderabad)',
      component: 'Packed Red Blood Cells (PRBC)',
      units: '1 Unit (350 mL)',
      status: 'VERIFIED',
      reference: 'CERT-APOLLO-9012',
    },
    {
      id: 'd-2',
      date: '2026-02-14',
      facility: 'Indian Red Cross Society (Hyderabad)',
      component: 'Whole Blood',
      units: '1 Unit (350 mL)',
      status: 'VERIFIED',
      reference: 'CERT-IRCS-4410',
    },
    {
      id: 'd-3',
      date: '2025-10-20',
      facility: 'Rotary Blood Bank (Hyderabad)',
      component: 'Single Donor Platelets (Apheresis)',
      units: '1 Apheresis Unit',
      status: 'VERIFIED',
      reference: 'CERT-ROT-1192',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Verified Donation History
            </h1>
            <p className="text-sm text-slate-muted mt-1 leading-relaxed">
              Official records of voluntary donations conducted at accredited healthcare centres.
            </p>
          </div>

          <div className="card-surface p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-border pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="font-heading font-bold text-sm text-charcoal-900">
                  {donationEvents.length} Recorded Transfusion Contributions
                </span>
              </div>
              <span className="badge-verified">NABH &amp; Hospital Audited</span>
            </div>

            <div className="divide-y divide-slate-100">
              {donationEvents.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal-900 text-sm">{item.facility}</span>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-muted">
                      {item.component} &bull; {item.units}
                    </p>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      Certificate Ref: {item.reference}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-semibold text-charcoal-800 text-xs flex items-center gap-1 sm:justify-end">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
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
