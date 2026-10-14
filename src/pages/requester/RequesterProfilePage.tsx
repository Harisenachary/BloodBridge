import React, { useState } from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { useAuth } from '@/context/AuthContext';
import { User, Phone, Mail, Save } from 'lucide-react';
import { toast } from 'sonner';

export const RequesterProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || 'Priya Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 00112');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Requester profile details saved');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Requester Profile
            </h1>
            <p className="text-sm text-slate-muted mt-1">
              Personal contact details used exclusively for emergency coordination handshakes.
            </p>
          </div>

          <form onSubmit={handleSave} className="card-surface p-6 sm:p-8 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-charcoal-900">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">Registered Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal-900">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'priya.requester@demo.bloodbridge.in'}
                  className="form-input bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary text-xs gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
