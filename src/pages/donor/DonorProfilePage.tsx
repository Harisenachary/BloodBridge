import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { demoStore } from '@/lib/demo/demoStore';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { User, ShieldCheck, MapPin, Mail, Phone, Save, Award } from 'lucide-react';
import { toast } from 'sonner';

export const DonorProfilePage: React.FC = () => {
  const { user } = useAuth();
  const donor = demoStore.getDonors()[0];

  const [alias, setAlias] = useState(user?.full_name || donor.display_alias);
  const [city, setCity] = useState(donor.city);
  const [state, setState] = useState(donor.state);
  const [locality, setLocality] = useState(donor.locality || '');
  const [postalCode, setPostalCode] = useState(donor.postal_code || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Donor profile updated successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Donor Profile &amp; Identity
            </h1>
            <p className="text-sm text-slate-muted mt-1 leading-relaxed">
              Manage your public display alias and geographic matching region.
            </p>
          </div>

          <form onSubmit={handleSave} className="card-surface p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-border pb-6">
              <div className="w-16 h-16 rounded-2xl bg-charcoal-900 text-white flex items-center justify-center font-heading font-extrabold text-2xl uppercase">
                {alias ? alias[0] : 'D'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-extrabold text-lg text-charcoal-900">{alias}</h2>
                  {donor.is_verified && <span className="badge-verified">Verified</span>}
                </div>
                <div className="mt-1">
                  <CompatibilityBadge bloodGroup={donor.blood_group} size="sm" showSpecialNotice />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">Public Display Alias</label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="form-input"
                />
                <p className="text-[10px] text-slate-muted">This alias is shown on candidate cards instead of your full legal name.</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'kiran.donor@demo.bloodbridge.in'}
                  className="form-input bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">PIN Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="form-input font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-charcoal-900">Locality / Sector</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Jubilee Hills, Road No 36"
                className="form-input"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-border">
              <button type="submit" className="btn-primary text-xs gap-2">
                <Save className="w-4 h-4" />
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
