import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, isMasterAdmin } from '@/context/AuthContext';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import { Droplet, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error, role: loggedInRole } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast.error('Sign in failed', { description: error });
    } else {
      toast.success('Signed in successfully');
      if (from && from !== '/') {
        navigate(from, { replace: true });
      } else if (loggedInRole === 'admin' || isMasterAdmin(email)) {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedInRole === 'requester') {
        navigate('/requester/dashboard', { replace: true });
      } else if (loggedInRole === 'hospital_staff' || loggedInRole === 'blood_bank_staff') {
        navigate('/organization/dashboard', { replace: true });
      } else {
        navigate('/donor/dashboard', { replace: true });
      }
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-16">
      {/* Dynamic Blood Particle Flow */}
      <BloodMotionCanvas />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(255,0,85,0.2)] dark:shadow-[0_25px_60px_-15px_rgba(255,0,85,0.4)] rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 flex items-center justify-center text-white mx-auto shadow-[0_8px_25px_rgba(244,63,94,0.45)] ring-4 ring-rose-500/20">
              <Droplet className="w-8 h-8 fill-white" />
            </div>
            <h1 className="font-heading font-black text-3xl text-charcoal-900 dark:text-white">
              Sign In to{' '}
              <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent">
                BloodBridge
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your voluntary donor dashboard, urgent request desk, or secure portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-charcoal-900 dark:text-slate-200">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold text-charcoal-900 dark:text-slate-200">Password</label>
                <Link to="/forgot-password" className="text-rose-600 dark:text-rose-400 hover:underline text-[11px] font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-rose-600 dark:text-rose-400 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
