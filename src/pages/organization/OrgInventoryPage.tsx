import React, { useState } from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { BloodInventoryItem, BloodGroup, BloodComponent } from '@/types';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export const OrgInventoryPage: React.FC = () => {
  const org = demoStore.getOrganizations()[0];
  const [inventory, setInventory] = useState<BloodInventoryItem[]>(demoStore.getInventory(org.id));
  const [editingItem, setEditingItem] = useState<BloodInventoryItem | null>(null);

  const [editUnits, setEditUnits] = useState<number>(0);
  const [editState, setEditState] = useState<'AVAILABLE' | 'RESERVED' | 'QUARANTINED'>('AVAILABLE');

  const handleStartEdit = (item: BloodInventoryItem) => {
    setEditingItem(item);
    setEditUnits(item.units_available);
    setEditState(item.state);
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (editUnits < 0) {
      toast.error('Stock count cannot be negative');
      return;
    }

    demoStore.updateInventoryUnits(editingItem.id, editUnits, editState);
    setInventory(demoStore.getInventory(org.id));
    setEditingItem(null);
    toast.success('Inventory stock level updated', {
      description: `${editingItem.blood_group} ${editingItem.component} now set to ${editUnits} units.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
                Blood Inventory Management
              </h1>
              <p className="text-sm text-slate-muted mt-1 leading-relaxed">
                Maintain auditable records of available components with automated negative-stock guards.
              </p>
            </div>
          </div>

          {/* Stock Table */}
          <div className="card-surface p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle text-slate-muted border-b border-slate-border">
                  <tr>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Blood Group</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Component</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Units Available</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">State</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Freshness</th>
                    <th className="py-3 px-4 uppercase font-bold text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <CompatibilityBadge bloodGroup={item.blood_group} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                        {item.component.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-heading font-extrabold text-sm text-charcoal-900">
                          {item.units_available}
                        </span>{' '}
                        <span className="text-slate-muted text-[11px]">Units</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.state === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.state === 'RESERVED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.state}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <FreshnessIndicator updatedAt={item.updated_at} showIcon={false} />
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="btn-secondary text-[11px] px-2.5 py-1 gap-1"
                        >
                          <Edit2 className="w-3 h-3 text-slate-500" />
                          Adjust
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Stock Modal */}
          {editingItem && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-slate-border space-y-4 animate-in zoom-in-95 duration-150 text-xs">
                <div className="flex items-center justify-between border-b border-slate-border pb-3">
                  <h3 className="font-heading font-bold text-base text-charcoal-900">
                    Adjust Stock: {editingItem.blood_group} {editingItem.component.replace(/_/g, ' ')}
                  </h3>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="text-slate-muted hover:text-charcoal-900 font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveStock} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-charcoal-900">Available Units</label>
                    <input
                      type="number"
                      min={0}
                      value={editUnits}
                      onChange={(e) => setEditUnits(Number(e.target.value))}
                      className="form-input font-bold font-mono text-sm"
                    />
                    <p className="text-[10px] text-slate-muted">Negative values are strictly rejected.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-charcoal-900">Inventory Status State</label>
                    <select
                      value={editState}
                      onChange={(e) => setEditState(e.target.value as any)}
                      className="form-input"
                    >
                      <option value="AVAILABLE">Available for Transfusion Matching</option>
                      <option value="RESERVED">Reserved for Active Surgical Patient</option>
                      <option value="QUARANTINED">Quarantined (Under TTI Testing)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-border">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="btn-secondary text-xs px-3 py-2"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary text-xs px-4 py-2 gap-1.5">
                      <Save className="w-3.5 h-3.5" />
                      Save Stock
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
