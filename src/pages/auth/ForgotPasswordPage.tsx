import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Password reset link dispatched', {
      description: `Instructions sent to ${email} if registered.`,
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card-surface p-8 space-y-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-charcoal-900">
            Reset Your Password
          </h1>
          <p className="text-xs text-slate-muted mt-1">
            Enter your registered email to receive a recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <p className="font-bold">Email Dispatched</p>
            <p className="leading-relaxed text-emerald-800">
              Please check your inbox. Follow the link inside to set a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-charcoal-900">Registered Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
              />
            </div>

            <button type="submit" className="w-full btn-primary text-xs py-2.5">
              Send Password Reset Email
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-muted hover:text-charcoal-900">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
