import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ShieldCheck, PhoneCall, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/80 backdrop-blur-md mt-auto">
      {/* Medical Emergency Subtle Disclaimer Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-rose-50/40 dark:bg-rose-950/20 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-charcoal-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-brand-rose animate-ping shrink-0" />
            <p className="leading-relaxed">
              <strong className="text-charcoal-900 dark:text-white font-bold">24/7 National Emergency Assistance:</strong> BloodBridge coordinates voluntary matches with verified hospitals. For acute trauma &amp; ambulances, dial <strong className="text-brand-red dark:text-rose-400">108</strong> directly.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <a
              href="tel:108"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red text-brand-red dark:text-rose-400 border border-brand-red/30 rounded-full font-bold text-xs transition-all shadow-subtle"
            >
              <PhoneCall className="w-3 h-3" />
              Dial 108 Emergency
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-rose via-brand-red to-brand-burgundy flex items-center justify-center text-white shadow-sm">
                <Droplet className="w-4 h-4 fill-white" />
              </div>
              <span className="font-heading font-extrabold text-lg text-charcoal-900 dark:text-white">
                Blood<span className="text-brand-red">Bridge</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Connecting voluntary donors, patients, and verified healthcare facilities across India with clinical integrity, zero contact exposure, and real-time transparency.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Clinical Network &bull; NABH Standards</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-[11px] uppercase tracking-wider text-charcoal-900 dark:text-white mb-3">
              Coordination
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Command Dashboard</Link></li>
              <li><Link to="/request-blood" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Request Blood</Link></li>
              <li><Link to="/find-donors" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Find Donors</Link></li>
              <li><Link to="/blood-banks" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Blood Bank Stocks</Link></li>
              <li><Link to="/eligibility" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Donor Eligibility</Link></li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div>
            <h3 className="font-heading font-bold text-[11px] uppercase tracking-wider text-charcoal-900 dark:text-white mb-3">
              Trust &amp; Privacy
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/how-it-works" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">How Coordination Works</Link></li>
              <li><Link to="/about" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Mission &amp; Ethics</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Privacy Principles</Link></li>
              <li><Link to="/terms" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Terms of Coordination</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors">Help &amp; Support</Link></li>
            </ul>
          </div>

          {/* Portal Access */}
          <div>
            <h3 className="font-heading font-bold text-[11px] uppercase tracking-wider text-charcoal-900 dark:text-white mb-3">
              Portals
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/donor/dashboard" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors flex items-center gap-1">Donor Portal <ArrowUpRight className="w-3 h-3 text-slate-400" /></Link></li>
              <li><Link to="/requester/dashboard" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors flex items-center gap-1">Requester Desk <ArrowUpRight className="w-3 h-3 text-slate-400" /></Link></li>
              <li><Link to="/organization/dashboard" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors flex items-center gap-1">Hospital Portal <ArrowUpRight className="w-3 h-3 text-slate-400" /></Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-brand-red dark:hover:text-rose-400 transition-colors flex items-center gap-1">Trust Admin <ArrowUpRight className="w-3 h-3 text-slate-400" /></Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 dark:border-slate-800 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>&copy; {new Date().getFullYear()} BloodBridge Platform. Voluntary Public Health Coordination.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-charcoal-800 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-charcoal-800 dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-charcoal-800 dark:hover:text-white transition-colors">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
