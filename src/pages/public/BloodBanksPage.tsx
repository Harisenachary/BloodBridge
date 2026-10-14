import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { demoStore } from '@/lib/demo/demoStore';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  Search,
  ExternalLink,
  Droplet,
  Sparkles,
  Award,
  PhoneCall,
  Activity,
} from 'lucide-react';

export const BloodBanksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const organizations = demoStore.getOrganizations();
  const inventory = demoStore.getInventory();

  const cities = ['All', 'Hyderabad', 'Bengaluru', 'New Delhi', 'Pune'];

  const filteredOrgs = organizations.filter((org) => {
    if (selectedCity !== 'All' && org.city !== selectedCity) return false;
    if (selectedType !== 'All' && org.org_type !== selectedType) return false;
    if (
      searchQuery &&
      !org.display_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !org.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalTestedUnitsAcrossNetwork = inventory.reduce((acc, curr) => acc + curr.units_available, 0);

  return (
    <div className="relative min-h-screen">
      {/* 1. BACKGROUND ERYTHROCYTE CANVAS */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 2. HERO COMMAND BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-rose-50/25 to-slate-50 dark:from-[#0c0f1d] dark:via-[#1c0f2f] dark:to-[#0a1128] border border-slate-200/90 dark:border-rose-500/40 p-8 sm:p-10 text-slate-900 dark:text-white shadow-[0_4px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(255,0,85,0.35)] transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 dark:bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/90 border border-rose-200/80 dark:border-rose-400 text-rose-700 dark:text-rose-300 text-xs font-extrabold tracking-wide shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span>NABH &amp; State Drug Control Verified Transfusion Facilities</span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight text-slate-900 dark:text-white">
                Verified Blood Banks &amp; <br />
                <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 bg-clip-text text-transparent font-black">
                  Hospital Centres.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Inspect real-time inventory levels, component availability, and direct trauma contact channels across certified clinical blood banks nationwide.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-md text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 block">
                  Verified Centres
                </span>
                <span className="font-heading font-black text-2xl text-emerald-600 dark:text-emerald-400">
                  {organizations.length} Active
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-md text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 block">
                  Tested Stock
                </span>
                <span className="font-heading font-black text-2xl text-cyan-600 dark:text-cyan-400">
                  {totalTestedUnitsAcrossNetwork} Units
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-md text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 block">
                  Quality Audit
                </span>
                <span className="font-heading font-black text-2xl text-amber-600 dark:text-amber-400">
                  100% NABH
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FILTER TOOLBAR */}
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital name, city, locality, or license..."
              className="w-full text-xs rounded-xl border border-rose-200 dark:border-slate-700 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-bold"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-44 text-xs rounded-xl border border-rose-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-bold"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Cities' : c}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-48 text-xs rounded-xl border border-rose-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-charcoal-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-bold"
            >
              <option value="All">All Facility Types</option>
              <option value="HOSPITAL">Hospitals Only</option>
              <option value="BLOOD_BANK">Blood Banks Only</option>
            </select>
          </div>
        </div>

        {/* 4. DIRECTORY CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-extrabold text-charcoal-900 dark:text-white text-sm">
              Showing {filteredOrgs.length} Accredited Facilities
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              State Drug Control Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrgs.map((org) => {
              const orgInventory = inventory.filter((i) => i.organization_id === org.id);
              const totalUnits = orgInventory.reduce((acc, curr) => acc + curr.units_available, 0);

              return (
                <div
                  key={org.id}
                  className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border-2 border-blue-200/60 dark:border-blue-900/40 hover:border-blue-500/80 dark:hover:border-blue-500/80 shadow-[0_4px_24px_rgba(37,99,235,0.06)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.18)] transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 inline-block mb-1">
                            {org.org_type.replace(/_/g, ' ')}
                          </span>
                          <h3 className="font-heading font-extrabold text-base sm:text-lg text-charcoal-900 dark:text-white">
                            {org.display_name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            {org.address}, {org.city}, {org.state}
                          </p>
                        </div>
                      </div>

                      <span className="badge-verified shrink-0 text-[10px]">
                        <ShieldCheck className="w-3 h-3" />
                        {org.verification_status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {org.description || 'Licensed transfusion medicine department facilitating verified blood component distribution and donor testing.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{org.operating_hours}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-mono font-bold truncate">{org.contact_phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-xs">
                        <Droplet className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <span className="font-heading font-black text-rose-600 dark:text-rose-400 text-sm block leading-none">
                          {totalUnits} Units
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Tested Stock</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${org.contact_phone}`}
                        className="btn-secondary text-xs px-3.5 py-2 rounded-xl gap-1.5 font-bold"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Call Desk</span>
                      </a>

                      <Link
                        to={`/blood-banks/${org.id}`}
                        className="btn-primary text-xs px-4 py-2 rounded-xl font-bold shadow-[0_4px_16px_rgba(255,0,85,0.35)]"
                      >
                        Inspect Stock &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
