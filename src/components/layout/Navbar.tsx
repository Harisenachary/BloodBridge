import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Droplet,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, role, isAuthenticated, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getDashboardRoute = () => {
    switch (role) {
      case 'donor':
        return '/donor/dashboard';
      case 'requester':
        return '/requester/dashboard';
      case 'hospital_staff':
      case 'blood_bank_staff':
        return '/organization/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  const baseNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Donors', path: '/find-donors' },
    { name: 'Blood Banks', path: '/blood-banks' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Eligibility', path: '/eligibility' },
  ];

  const portalName = role === 'admin' 
    ? 'Admin Panel' 
    : role === 'donor' 
      ? 'Donor Portal' 
      : role === 'requester' 
        ? 'Requester Desk' 
        : 'Hospital Portal';

  const navLinks = isAuthenticated && role !== 'public'
    ? [
        baseNavLinks[0],
        { name: portalName, path: getDashboardRoute() },
        ...baseNavLinks.slice(1),
      ]
    : baseNavLinks;

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-2">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-rose via-brand-red to-brand-burgundy flex items-center justify-center text-white shadow-sm shadow-brand-red/20 group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-brand-red transition-colors">
                Blood<span className="text-brand-red">Bridge</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-red dark:text-rose-400 -mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Bio-Grid
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Animated Sliding Active Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-800">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors z-10 ${
                    isActive
                      ? 'text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbarActivePill"
                      className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none border border-slate-200 dark:border-slate-800"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Toggle notifications menu"
                  className="relative p-2 rounded-full text-charcoal-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none border border-slate-200 dark:border-slate-800"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-brand-red text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-charcoal-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-brand-red dark:text-rose-400 hover:underline font-semibold"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">No alerts right now.</div>
                      ) : (
                        notifications.slice(0, 4).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-xs"
                          >
                            <p className="font-semibold text-charcoal-900 dark:text-white">{notif.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Request Blood Button */}
            <Link
              to="/request-blood"
              className="btn-primary text-xs px-4 py-2 rounded-full gap-1.5 shadow-sm hover:shadow"
            >
              <Droplet className="w-3.5 h-3.5 fill-white text-white" />
              <span>Request Blood</span>
            </Link>

            {/* Auth / Account Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs"
                >
                  <span className="font-bold text-charcoal-800 dark:text-slate-200 max-w-[100px] truncate hidden lg:inline">
                    {user?.full_name?.split(' ')[0] || 'Portal'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user?.full_name ? user.full_name[0] : 'U'}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-charcoal-900 dark:text-white truncate">{user?.full_name}</p>
                      <span className="text-[10px] font-bold text-brand-red dark:text-rose-400 uppercase tracking-wider">
                        {role.replace('_', ' ')}
                      </span>
                    </div>
                    <Link
                      to={getDashboardRoute()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-charcoal-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-105 px-3.5 py-1.5 rounded-full shadow-xs transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/request-blood"
              className="bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded-full"
            >
              Request
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-charcoal-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2 text-xs">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-charcoal-800 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to={getDashboardRoute()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-secondary text-xs text-center py-2"
              >
                Go to {role.toUpperCase().replace('_', ' ')} Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-xs text-center py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-xs text-center py-2"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
