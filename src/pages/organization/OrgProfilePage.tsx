import React, { useState } from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { Building2, Save } from 'lucide-react';
import { toast } from 'sonner';

export const OrgProfilePage: React.FC = () => {
  const org = demoStore.getOrganizations()[0];
  const [displayName, setDisplayName] = useState(org.display_name);
  const [operatingHours, setOperatingHours] = useState(org.operating_hours);
  const [phone, setPhone] = useState(org.contact_phone);
  const [description, setDescription] = useState(org.description || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Facility public profile updated');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Facility Profile Settings
            </h1>
            <p className="text-sm text-slate-muted mt-1 leading-relaxed">
              Public institutional details displayed in blood bank searches.
            </p>
          </div>

          <form onSubmit={handleSave} className="card-surface p-6 sm:p-8 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-charcoal-900">Facility Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">Emergency Helpline</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">Operating Hours</label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-charcoal-900">Public Facility Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary text-xs gap-2">
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
