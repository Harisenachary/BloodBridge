import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-red-100 text-brand-red flex items-center justify-center mx-auto">
        <Droplet className="w-8 h-8 fill-brand-red" />
      </div>
      <h1 className="font-heading font-extrabold text-3xl text-charcoal-900">
        404 &mdash; Page Not Found
      </h1>
      <p className="text-xs text-slate-muted leading-relaxed">
        The requested coordination URL or record does not exist or has expired.
      </p>
      <div className="pt-4">
        <Link to="/" className="btn-primary text-xs gap-2">
          <ArrowLeft className="w-4 h-4" />
          Return to BloodBridge Home
        </Link>
      </div>
    </div>
  );
};
