import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
          Legal Agreement
        </span>
        <h1 className="font-heading font-extrabold text-3xl text-charcoal-900 mt-1">
          Terms of Service &amp; Responsible Coordination Code
        </h1>
        <p className="text-xs text-slate-muted mt-1">Last Updated: October 2026</p>
      </div>

      <div className="card-surface p-6 sm:p-8 space-y-6 text-xs text-charcoal-800 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-charcoal-900">
            1. Nature of the Service
          </h2>
          <p>
            BloodBridge operates strictly as an information exchange and voluntary coordination facilitator. BloodBridge is neither a blood bank nor a hospital. We do not provide clinical diagnostic services, cross-matching, blood processing, or transfusion services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-charcoal-900">
            2. Prohibition of Commercial Blood Transactions
          </h2>
          <p>
            In accordance with the Supreme Court of India ruling (1996) and the National Blood Policy, commercial buying or selling of blood, paying voluntary donors, or receiving monetary consideration for blood donations is strictly illegal. Any user soliciting or offering payment will face immediate account termination and reporting to state authorities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-charcoal-900">
            3. Accuracy of Information
          </h2>
          <p>
            Requesters must only submit genuine clinical requirements confirmed by a treating physician. Submitting fabricated requirements or repeated nuisance requests is a violation of these terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-charcoal-900">
            4. Limitation of Liability
          </h2>
          <p>
            BloodBridge makes reasonable efforts to present verified inventory and active voluntary donors. However, we cannot guarantee donor response rates, travel timeliness, physical eligibility at the donation site, or hospital blood-bank availability during regional crises. In critical emergencies, users must coordinate directly with hospital authorities.
          </p>
        </section>
      </div>
    </div>
  );
};
