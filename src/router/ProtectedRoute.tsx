import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, role, isAuthenticated, isLoading, setDemoPersona, isDemoMode } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-muted font-medium">Verifying access credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(role as UserRole)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-charcoal-900 mb-2">
          Restricted Portal Access
        </h2>
        <p className="text-sm text-slate-muted max-w-md mx-auto mb-6 leading-relaxed">
          Your current session role (<strong className="capitalize">{role.replace('_', ' ')}</strong>) does not have authorization to view this clinical or administrative dashboard.
        </p>

        {isDemoMode && allowedRoles[0] && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-left max-w-md mx-auto mb-6 text-xs">
            <p className="font-bold text-amber-900 mb-1">Demo Mode Evaluation Shortcut:</p>
            <p className="text-amber-800 mb-3">
              You can instantly switch your active demo persona to evaluate this restricted route:
            </p>
            <button
              onClick={() => setDemoPersona(allowedRoles[0])}
              className="w-full btn-primary text-xs py-2"
            >
              Switch Persona to {allowedRoles[0].toUpperCase().replace('_', ' ')}
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn-secondary text-xs gap-2">
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
          <Link to="/login" className="btn-secondary text-xs gap-2">
            <LogIn className="w-4 h-4" />
            Switch Account
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
