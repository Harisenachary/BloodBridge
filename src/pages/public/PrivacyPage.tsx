import React from 'react';
import { Lock, ShieldCheck, EyeOff, UserCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
          Data Protection
        </span>
        <h1 className="font-heading font-extrabold text-3xl text-charcoal-900 mt-1">
          Privacy Policy &amp; Zero-Leakage Guarantee
        </h1>
        <p className="text-xs text-slate-muted mt-1">Last Updated: October 2026</p>
      </div>

      <div className="card-surface p-6 sm:p-8 space-y-6 text-xs text-charcoal-800 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-charcoal-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-red" />
            1. Donor Contact Information Protection
          </h2>
          <p>
            Unlike unvetted social media groups or legacy donor directories, BloodBridge never publishes voluntary donor phone numbers, email addresses, or residential street addresses in public query results. Requesters can only discover candidate profiles by broad district/locality and blood compatibility.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-charcoal-900 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-600" />
            2. Masked Patient Identity in Public Tokens
          </h2>
          <p>
            Public tracking URLs use unguessable, cryptographically generated tokens (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">BB-TRK-XXXX</code>). We never publish patient full names, sensitive diagnoses, or medical histories to unauthenticated visitors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-charcoal-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            3. Explicit Consent &amp; Donor Quiet Mode
          </h2>
          <p>
            Donors maintain complete autonomy over their availability status. By activating Quiet Mode, donors can pause incoming alerts for a specified duration or restrict outreach to life-threatening trauma situations only. You may withdraw consent or delete your profile at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-charcoal-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            4. No Commercial Monetization
          </h2>
          <p>
            BloodBridge does not sell, lease, or monetize user health data. User records are utilized solely for voluntary blood donation coordination and institutional stock transparency in compliance with applicable Indian privacy standards.
          </p>
        </section>
      </div>
    </div>
  );
};
