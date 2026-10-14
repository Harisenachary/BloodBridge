import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { demoStore } from '@/lib/demo/demoStore';

// Dedicated Master Admin Credentials
export const MASTER_ADMIN_EMAIL = 'harisenacharypuppala@gmail.com';
export const MASTER_ADMIN_PASSWORD = '1234567890';

export const isMasterAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return clean === MASTER_ADMIN_EMAIL || clean === 'harisenacharypuppala@gmail';
};

const MASTER_ADMIN_USER: UserProfile = {
  id: 'admin-harisenachary-master',
  email: MASTER_ADMIN_EMAIL,
  full_name: 'Harisenachary Puppala',
  role: 'admin',
  phone: '+91 98765 00000',
  phone_verified: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: new Date().toISOString(),
};

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | 'public';
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  setDemoPersona: (role: UserRole | 'public') => void;
  signIn: (email: string, password: string) => Promise<{ error?: string; role?: UserRole }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PERSONAS: Record<UserRole, UserProfile> = {
  donor: {
    id: 'user-donor-1',
    email: 'kiran.donor@demo.bloodbridge.in',
    full_name: 'Kiran R. (Voluntary Donor)',
    role: 'donor',
    phone: '+91 98765 43210',
    phone_verified: true,
    created_at: '2025-08-10T10:00:00Z',
    updated_at: '2026-10-01T10:00:00Z',
  },
  requester: {
    id: 'user-requester-1',
    email: 'priya.requester@demo.bloodbridge.in',
    full_name: 'Priya Sharma (Requester)',
    role: 'requester',
    phone: '+91 98765 00112',
    phone_verified: true,
    created_at: '2026-01-15T09:00:00Z',
    updated_at: '2026-10-02T11:00:00Z',
  },
  hospital_staff: {
    id: 'user-hospital-1',
    email: 'dr.ramesh@apollo-demo.org',
    full_name: 'Dr. Ramesh Kumar (Apollo Staff)',
    role: 'hospital_staff',
    phone: '+91 40 2360 7777',
    phone_verified: true,
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-09-01T14:00:00Z',
  },
  blood_bank_staff: {
    id: 'user-bloodbank-1',
    email: 'staff@rotaryttk-demo.org',
    full_name: 'Sunita Menon (Rotary Blood Centre)',
    role: 'blood_bank_staff',
    phone: '+91 80 2528 7903',
    phone_verified: true,
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-09-15T16:00:00Z',
  },
  admin: MASTER_ADMIN_USER,
};

const STORAGE_AUTH_KEY = 'bloodbridge_active_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | 'public'>('public');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);

      // 1. Check local session persistence first (e.g. Master Admin or active user)
      const cached = localStorage.getItem(STORAGE_AUTH_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as UserProfile;
          if (parsed && parsed.email) {
            if (isMasterAdmin(parsed.email)) {
              setUser(MASTER_ADMIN_USER);
              setRole('admin');
              setIsLoading(false);
              return;
            } else {
              setUser(parsed);
              setRole(parsed.role || 'donor');
              setIsLoading(false);
              return;
            }
          }
        } catch {
          localStorage.removeItem(STORAGE_AUTH_KEY);
        }
      }

      // 2. Check Supabase session if configured
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const userEmail = session.user.email || '';
            const isAdmin = isMasterAdmin(userEmail);

            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const determinedRole: UserRole = isAdmin
              ? 'admin'
              : (profile?.role || (session.user.user_metadata?.role as UserRole) || 'donor');

            const activeUserProfile: UserProfile = {
              id: session.user.id,
              email: userEmail,
              full_name: profile?.full_name || session.user.user_metadata?.full_name || (isAdmin ? 'Harisenachary Puppala' : 'Verified User'),
              role: determinedRole,
              phone: profile?.phone || '',
              phone_verified: profile?.phone_verified || false,
              created_at: profile?.created_at || session.user.created_at,
              updated_at: new Date().toISOString(),
            };

            setUser(activeUserProfile);
            setRole(determinedRole);
            localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(activeUserProfile));
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase auth session check failed:', err);
        }
      }

      // 3. Fresh visitor: start unauthenticated
      setUser(null);
      setRole('public');
      setIsDemoMode(false);
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const setDemoPersona = (newRole: UserRole | 'public') => {
    setRole(newRole);
    demoStore.setActiveRole(newRole);
    if (newRole === 'public') {
      setUser(null);
      localStorage.removeItem(STORAGE_AUTH_KEY);
    } else {
      const persona = DEMO_PERSONAS[newRole];
      setUser(persona);
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(persona));
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string; role?: UserRole }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check for Master Admin credentials
    if (isMasterAdmin(cleanEmail)) {
      if (password === MASTER_ADMIN_PASSWORD) {
        setUser(MASTER_ADMIN_USER);
        setRole('admin');
        demoStore.setActiveRole('admin');
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(MASTER_ADMIN_USER));

        // Sync with Supabase Auth in background if connected
        if (isSupabaseConfigured) {
          try {
            const { error: sbErr } = await supabase.auth.signInWithPassword({
              email: MASTER_ADMIN_EMAIL,
              password: MASTER_ADMIN_PASSWORD,
            });
            if (sbErr && sbErr.message.toLowerCase().includes('invalid login credentials')) {
              await supabase.auth.signUp({
                email: MASTER_ADMIN_EMAIL,
                password: MASTER_ADMIN_PASSWORD,
                options: { data: { full_name: 'Harisenachary Puppala', role: 'admin' } },
              });
            }
          } catch (e) {
            console.warn('Admin Supabase background sync:', e);
          }
        }

        return { role: 'admin' };
      } else {
        return { error: 'Incorrect administrator password. Please try again.' };
      }
    }

    // 2. Standard User Sign In via Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) return { error: error.message };

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userRole: UserRole = (profile?.role as UserRole) || (data.user.user_metadata?.role as UserRole) || 'donor';

          const authenticatedProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: profile?.full_name || data.user.user_metadata?.full_name || 'Verified User',
            role: userRole === 'admin' ? 'donor' : userRole, // Only Harisenachary can be admin
            phone: profile?.phone || '',
            phone_verified: profile?.phone_verified || false,
            created_at: profile?.created_at || data.user.created_at,
            updated_at: new Date().toISOString(),
          };

          setUser(authenticatedProfile);
          setRole(authenticatedProfile.role);
          demoStore.setActiveRole(authenticatedProfile.role);
          localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(authenticatedProfile));
          return { role: authenticatedProfile.role };
        }
        return { role: 'donor' };
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : 'Authentication failed' };
      }
    }

    // 3. Fallback for demo testing when Supabase is not reachable
    const matchedPersona = Object.values(DEMO_PERSONAS).find(
      (p) => p.email.toLowerCase() === cleanEmail
    );
    if (matchedPersona) {
      setUser(matchedPersona);
      setRole(matchedPersona.role);
      demoStore.setActiveRole(matchedPersona.role);
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(matchedPersona));
      return { role: matchedPersona.role };
    }

    return { error: 'Account not found. Please register your account first.' };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    requestedRole: UserRole
  ): Promise<{ error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Prevent anyone from claiming the admin email via registration
    if (isMasterAdmin(cleanEmail)) {
      return {
        error: 'This email address is reserved for the Platform Administrator. Please sign in directly.',
      };
    }

    // Enforce that self-registration can only be 'donor' or 'requester'
    const safeRole: UserRole = requestedRole === 'admin' ? 'donor' : requestedRole;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              role: safeRole,
            },
          },
        });

        if (error) return { error: error.message };

        if (data.user) {
          // Create or update profile record in database
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: cleanEmail,
              full_name: fullName,
              role: safeRole,
            });
          } catch (profileErr) {
            console.warn('Profile upsert note:', profileErr);
          }

          const newProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: fullName,
            role: safeRole,
            phone_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setUser(newProfile);
          setRole(safeRole);
          demoStore.setActiveRole(safeRole);
          localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(newProfile));
        }

        return {};
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : 'Registration failed' };
      }
    }

    // Offline / Demo registration fallback
    const newDemoUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      full_name: fullName,
      role: safeRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newDemoUser);
    setRole(safeRole);
    demoStore.setActiveRole(safeRole);
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(newDemoUser));
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('SignOut error:', e);
      }
    }
    localStorage.removeItem(STORAGE_AUTH_KEY);
    setUser(null);
    setRole('public');
    demoStore.setActiveRole('public');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: user !== null && role !== 'public',
        isDemoMode,
        isLoading,
        setDemoPersona,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
