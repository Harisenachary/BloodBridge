import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleAuth() {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth callback error', error);
          navigate('/login');
          return;
        }
      }
      navigate('/donor/dashboard');
    }
    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-muted">Finalizing authentication session...</p>
      </div>
    </div>
  );
};
