import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  Building2,
  Heart,
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Ticket,
  Copy,
  Check,
  Hospital,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { demoStore } from '@/lib/demo/demoStore';
import {
  BloodGroup,
  BloodComponent,
  BloodInventoryItem,
  BloodReservation,
  Organization,
} from '@/types';
import { BloodReservationModal } from './BloodReservationModal';

export const BloodAvailabilityDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Filter States
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'inventory' | 'hospitals' | 'reservations'>('inventory');

  // Modal State
  const [reservingItem, setReservingItem] = useState<BloodInventoryItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live store data
  const inventory = demoStore.getInventory();
  const organizations = demoStore.getOrganizations();
  const donors = demoStore.getDonors();
  const requests = demoStore.getRequests();
  const reservations = demoStore.getReservations();

  // Metrics
  const totalBloodBanks = organizations.length;
  const verifiedBloodBanks = organizations.filter((o) => o.verification_status === 'VERIFIED').length;
  const totalUnitsAvailable = inventory.reduce((acc, curr) => acc + curr.units_available, 0);
  const availableDonorsCount = donors.filter((d) => d.availability?.status === 'AVAILABLE').length;
  const activeEmergencyCases = requests.filter((r) => r.status !== 'FULFILLED' && r.status !== 'CANCELLED').length;

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  // Calculate stock count per blood group
  const bloodGroupStats = useMemo(() => {
    const stats: Record<BloodGroup, number> = {
      'O-': 0,
      'O+': 0,
      'A+': 0,
      'A-': 0,
      'B+': 0,
      'B-': 0,
      'AB+': 0,
      'AB-': 0,
    };
    inventory.forEach((item) => {
      if (stats[item.blood_group] !== undefined) {
        stats[item.blood_group] += item.units_available;
      }
    });
    return stats;
  }, [inventory]);

  // Unique cities list
  const availableCities = useMemo(() => {
    const citiesSet = new Set<string>();
    organizations.forEach((org) => {
      if (org.city) citiesSet.add(org.city);
    });
    return Array.from(citiesSet).sort();
  }, [organizations]);

  // Filtered inventory items
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const org = item.organization || demoStore.getOrganizationById(item.organization_id);
      const matchesGroup = selectedBloodGroup === 'ALL' || item.blood_group === selectedBloodGroup;
      const matchesCity = selectedCity === 'ALL' || org?.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesComp = selectedComponent === 'ALL' || item.component === selectedComponent;
      const matchesQuery =
        !searchQuery.trim() ||
        org?.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org?.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org?.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.blood_group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.component.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGroup && matchesCity && matchesComp && matchesQuery && item.units_available > 0;
    });
  }, [inventory, selectedBloodGroup, selectedCity, selectedComponent, searchQuery]);

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesCity = selectedCity === 'ALL' || org.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesQuery =
        !searchQuery.trim() ||
        org.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.org_type.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCity && matchesQuery;
    });
  }, [organizations, selectedCity, searchQuery]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Reservation Code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8" id="blood-availability-engine">
      {/* 1. TOP LIVE STATISTICS DASHBOARD */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Live Healthcare Network Statistics
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1.5">
              Real-Time Blood &amp; Hospital Registry
            </h2>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
            Updated just now &bull; Cold-chain verified
          </span>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Blood Banks & Hospitals */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Hospitals &amp; Blood Banks
              </span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-4xl text-slate-900 dark:text-white">
                  {totalBloodBanks}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Centers</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {verifiedBloodBanks} Verified &amp; Licensed
              </p>
            </div>
          </div>

          {/* Card 2: Blood Units Available */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Blood Units Available
              </span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md">
                <Droplet className="w-6 h-6 fill-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-4xl text-slate-900 dark:text-white">
                  {totalUnitsAvailable}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tested Bags</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Ready for instant reservation
              </p>
            </div>
          </div>

          {/* Card 3: Standby Donors Available */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Standby Donors
              </span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 fill-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-4xl text-slate-900 dark:text-white">
                  {availableDonorsCount}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Active</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-4 h-4 text-cyan-500" />
                Average match velocity &lt; 14 mins
              </p>
            </div>
          </div>

          {/* Card 4: Active Emergency Requests */}
          <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Active Emergency Cases
              </span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                <PackageCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-4xl text-slate-900 dark:text-white">
                  {activeEmergencyCases}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Cases</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Live coordination in progress
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BLOOD GROUP STOCK GRID AT A GLANCE */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Blood Group Inventory at a Glance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any blood group to immediately filter available hospitals and units
            </p>
          </div>

          {selectedBloodGroup !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedBloodGroup('ALL')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Reset to All Blood Groups
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodGroups.map((group) => {
            const count = bloodGroupStats[group];
            const isSelected = selectedBloodGroup === group;
            const isCritical = count < 8;

            return (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedBloodGroup(isSelected ? 'ALL' : group)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-2 group ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/30 scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-xl font-heading font-black text-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {group}
                </span>

                <div>
                  <span className={`block font-black text-xl ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {count}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isSelected ? 'text-rose-100' : isCritical ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {count === 1 ? '1 Unit' : `${count} Units`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FIND AVAILABLE BLOOD, HOSPITALS, & RESERVATION SECTION */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        {/* Navigation Tabs between Inventory, Hospitals, and Reservations */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveView('inventory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeView === 'inventory'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>Available Blood Units ({filteredInventory.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('hospitals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeView === 'hospitals'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>All Hospitals &amp; Blood Banks ({filteredOrganizations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('reservations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeView === 'reservations'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Active Reservations ({reservations.length})</span>
            </button>
          </div>

          <Link
            to="/request-blood"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-extrabold hover:shadow-md transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <AlertCircle className="w-4 h-4" />
            Can&apos;t Find Blood? Post Emergency Request
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Blood Group Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Blood Group
            </label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value as BloodGroup | 'ALL')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="ALL">All Blood Groups (Any)</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg} ({bloodGroupStats[bg]} units available)
                </option>
              ))}
            </select>
          </div>

          {/* City / Location Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              City / Location
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="ALL">All Cities Across India</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Component Type Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Blood Component
            </label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value as BloodComponent | 'ALL')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="ALL">All Components</option>
              <option value="PACKED_RED_CELLS">Packed Red Blood Cells (PRBC)</option>
              <option value="WHOLE_BLOOD">Whole Blood</option>
              <option value="PLATELETS">Platelets (SDP / RDP)</option>
              <option value="PLASMA">Fresh Frozen Plasma (FFP)</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Search Facility / Locality
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital name..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. VIEW CONTENT */}
        {activeView === 'inventory' && (
          /* Available Blood Units Listing */
          <div className="space-y-4">
            {filteredInventory.length === 0 ? (
              <div className="p-10 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                  <Droplet className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h4 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
                    No matching blood units in stock right now
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No hospital currently has {selectedBloodGroup !== 'ALL' ? selectedBloodGroup : ''} blood in {selectedCity !== 'ALL' ? selectedCity : 'the selected area'}. You can immediately broadcast an emergency request to voluntary donors!
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBloodGroup('ALL');
                      setSelectedCity('ALL');
                      setSelectedComponent('ALL');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Clear Filters
                  </button>
                  <Link
                    to="/request-blood"
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Post Emergency Blood Request
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map((item) => {
                  const org = item.organization || demoStore.getOrganizationById(item.organization_id);

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-50/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-lg hover:border-rose-400 dark:hover:border-rose-600 transition-all flex flex-col justify-between gap-4 group"
                    >
                      {/* Top Bar: Blood Group Badge + Units */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex flex-col items-center justify-center font-black text-xl shadow-md shrink-0">
                            {item.blood_group}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                              {item.component.replace(/_/g, ' ')}
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="font-heading font-black text-2xl text-emerald-600 dark:text-emerald-400">
                                {item.units_available}
                              </span>
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                Units in Stock
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          Screened
                        </span>
                      </div>

                      {/* Hospital & Location Details */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                        <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                          {org?.display_name || 'Hospital Blood Centre'}
                        </h4>

                        <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 text-xs line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{org?.address}, {org?.city}</span>
                        </p>

                        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{org?.operating_hours || '24x7 Emergency Services'}</span>
                        </p>

                        {org?.contact_phone && (
                          <p className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 text-xs pt-0.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <a href={`tel:${org.contact_phone}`} className="hover:underline">
                              {org.contact_phone}
                            </a>
                          </p>
                        )}
                      </div>

                      {/* Action Button: Reserve & Collect */}
                      <button
                        type="button"
                        onClick={() => setReservingItem(item)}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-101"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Reserve &amp; Collect Units</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeView === 'hospitals' && (
          /* All Hospitals & Blood Banks Directory */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrganizations.map((org) => {
                const orgInventory = inventory.filter((i) => i.organization_id === org.id);
                const totalUnits = orgInventory.reduce((acc, curr) => acc + curr.units_available, 0);

                return (
                  <div
                    key={org.id}
                    className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                          <Hospital className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                              {org.display_name}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {org.org_type.replace(/_/g, ' ')} &bull; License: {org.license_number}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        Verified Facility
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{org.address}, {org.city}, {org.state}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                        <a href={`tel:${org.contact_phone}`} className="font-bold hover:underline">
                          {org.contact_phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{org.operating_hours}</span>
                      </p>
                    </div>

                    {/* Available Stock Summary in this hospital */}
                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Total Tested Stock:
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          {totalUnits} Units Available
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {orgInventory.map((inv) => (
                          <button
                            key={inv.id}
                            type="button"
                            onClick={() => setReservingItem(inv)}
                            className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:border-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
                          >
                            <span className="text-rose-600 dark:text-rose-400 font-black">{inv.blood_group}</span>
                            <span>({inv.units_available})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'reservations' && (
          /* My Active Reservations */
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <div className="p-10 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
                <Ticket className="w-12 h-12 text-slate-400 mx-auto" />
                <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                  No active reservations yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Find an available blood bag in the inventory and click &quot;Reserve &amp; Collect&quot; to generate an official hospital pickup voucher.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('inventory')}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-sm"
                >
                  Browse Available Blood
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-rose-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center font-black text-xl shrink-0 shadow-md">
                        {res.blood_group}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-lg text-white">
                            {res.reservation_code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(res.reservation_code)}
                            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-rose-300"
                            title="Copy code"
                          >
                            {copiedCode === res.reservation_code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {res.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">
                          {res.units_reserved} Unit(s) reserved for <strong>{res.patient_name}</strong> at{' '}
                          <strong>{res.organization_name}</strong>
                        </p>

                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {res.organization_address}, {res.organization_city} &bull; Call: {res.organization_phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          window.print();
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                      >
                        Print Pass
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          demoStore.collectReservation(res.id);
                          toast.success('Reservation marked as Collected!');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        Mark Collected
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. RESERVATION POPUP MODAL */}
      <BloodReservationModal
        isOpen={!!reservingItem}
        onClose={() => setReservingItem(null)}
        inventoryItem={reservingItem}
        onReservationComplete={() => {
          // forces component re-render with updated stock
          setReservingItem(null);
          setActiveView('reservations');
        }}
      />
    </div>
  );
};
