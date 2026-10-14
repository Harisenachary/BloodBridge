import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Activity, TrendingUp, Droplet } from 'lucide-react';

export const OrgAnalyticsPage: React.FC = () => {
  const demandData = [
    { bloodGroup: 'O+', required: 34, fulfilled: 32 },
    { bloodGroup: 'O-', required: 18, fulfilled: 14 },
    { bloodGroup: 'A+', required: 22, fulfilled: 21 },
    { bloodGroup: 'A-', required: 8, fulfilled: 7 },
    { bloodGroup: 'B+', required: 29, fulfilled: 28 },
    { bloodGroup: 'B-', required: 6, fulfilled: 5 },
    { bloodGroup: 'AB+', required: 12, fulfilled: 12 },
    { bloodGroup: 'AB-', required: 4, fulfilled: 3 },
  ];

  const componentDistribution = [
    { name: 'PRBC (Red Cells)', value: 45, color: '#B42332' },
    { name: 'Whole Blood', value: 25, color: '#7F1D2D' },
    { name: 'Platelets (SDP)', value: 18, color: '#D97706' },
    { name: 'Plasma (FFP)', value: 12, color: '#2563EB' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Facility Demand &amp; Transfusion Analytics
            </h1>
            <p className="text-sm text-slate-muted mt-1 leading-relaxed">
              Analyze component utilization rates, fulfillment ratios, and shortage indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="card-surface p-6 space-y-4">
              <h2 className="font-heading font-bold text-sm text-charcoal-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-red" />
                Monthly Demand vs. Fulfillment by Blood Group
              </h2>
              <div className="h-64 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="bloodGroup" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="required" fill="#cbd5e1" name="Units Requested" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fulfilled" fill="#B42332" name="Units Fulfilled" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Component Pie Chart */}
            <div className="card-surface p-6 space-y-4">
              <h2 className="font-heading font-bold text-sm text-charcoal-900 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-brand-burgundy" />
                Transfusion Share by Blood Component
              </h2>
              <div className="h-64 text-xs flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={componentDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name} (${entry.value}%)`}
                    >
                      {componentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
