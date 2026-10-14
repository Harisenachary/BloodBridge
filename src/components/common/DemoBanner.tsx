import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldCheck, ChevronUp, ChevronDown, User, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, role, setDemoPersona } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isDemoMode) return null;

  const personas: { role: UserRole | 'public'; label: string; icon: string }[] = [
    { role: 'donor', label: 'Voluntary Donor', icon: '❤️' },
    { role: 'requester', label: 'Blood Requester', icon: '🩸' },
    { role: 'hospital_staff', label: 'Hospital Staff', icon: '🏥' },
    { role: 'blood_bank_staff', label: 'Blood Bank', icon: '💉' },
    { role: 'admin', label: 'Trust Admin', icon: '🛡️' },
    { role: 'public', label: 'Public Visitor', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Pill Trigger */}
      <div className="bg-charcoal-900/95 backdrop-blur-md text-white rounded-full shadow-2xl border border-white/10 p-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-xs font-semibold"
          aria-label="Toggle Demo Persona Switcher"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">Demo Role:</span>
          <span className="capitalize text-white font-bold">{role.replace('_', ' ')}</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>

      {/* Expandable Persona Selector Popup */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-3.5 animate-in fade-in slide-in-from-bottom-2 duration-150 text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="font-heading font-bold text-charcoal-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-red" />
              Switch Demo Persona
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              Evaluator
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2 leading-tight">
            Preview role-specific portals instantly with realistic demonstration records:
          </p>

          <div className="space-y-1">
            {personas.map((p) => {
              const isActive = role === p.role;
              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => {
                    setDemoPersona(p.role);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-brand-red text-white font-bold shadow-sm'
                      : 'hover:bg-slate-50 text-charcoal-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </span>
                  {isActive && <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">ACTIVE</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
