import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import { Droplet, Heart, User, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialIntent = (searchParams.get('intent') as UserRole) || 'donor';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialIntent === 'hospital_staff' ? 'requester' : initialIntent);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password, fullName, role);
    setIsLoading(false);

    if (error) {
      toast.error('Registration failed', { description: error });
    } else {
      toast.success('Registration successful!', {
        description: `Welcome to BloodBridge, ${fullName}.`,
      });
      navigate(role === 'donor' ? '/donor/dashboard' : '/requester/dashboard');
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-14">
      {/* Dynamic Blood Particle Flow */}
      <BloodMotionCanvas />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(255,0,85,0.2)] dark:shadow-[0_25px_60px_-15px_rgba(255,0,85,0.4)] rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 flex items-center justify-center text-white mx-auto shadow-[0_8px_25px_rgba(244,63,94,0.45)] ring-4 ring-rose-500/20">
              <Droplet className="w-8 h-8 fill-white" />
            </div>
            <h1 className="font-heading font-black text-3xl text-charcoal-900 dark:text-white">
              Create an{' '}
              <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent">
                Account
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join the verified clinical blood coordination network.
            </p>
          </div>

          {/* Role Intent Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200 block">
              I am joining as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`p-4 rounded-2xl text-left border-2 transition-all ${
                  role === 'donor'
                    ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 ring-4 ring-rose-500/10 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Heart className={`w-5 h-5 mb-2 ${role === 'donor' ? 'text-rose-600 dark:text-rose-400 fill-rose-500/20' : 'text-slate-400'}`} />
                <span className="font-extrabold text-sm text-charcoal-900 dark:text-white block">
                  Voluntary Donor
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                  Notify me when blood is needed
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('requester')}
                className={`p-4 rounded-2xl text-left border-2 transition-all ${
                  role === 'requester'
                    ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 ring-4 ring-rose-500/10 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <User className={`w-5 h-5 mb-2 ${role === 'requester' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
                <span className="font-extrabold text-sm text-charcoal-900 dark:text-white block">
                  Requester / Family
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                  Post urgent transfusion needs
                </span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
              *Hospital &amp; blood bank staff accounts require verified institutional application under{' '}
              <Link to="/organization/verification" className="text-rose-600 dark:text-rose-400 font-bold hover:underline">
                Institutional Onboarding
              </Link>.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-charcoal-900 dark:text-slate-200">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Varma"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-charcoal-900 dark:text-slate-200">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-charcoal-900 dark:text-slate-200">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-rose-600 dark:text-rose-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
