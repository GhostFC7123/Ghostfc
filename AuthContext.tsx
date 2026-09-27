import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, AUTHORIZED_ADMIN_EMAILS } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isDemoAdmin: boolean;
  isSupabaseLive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(false);

  useEffect(() => {
    // If Supabase is NOT configured, check local dev session
    if (!isSupabaseConfigured) {
      const storedDemo = sessionStorage.getItem('ghost_dev_admin_auth');
      if (storedDemo === 'true') {
        setIsDemoAdmin(true);
        setIsAdmin(true);
      }
      setLoading(false);
      return;
    }

    // Supabase IS live: clear any mock demo flags to prevent unauthorized escalation
    sessionStorage.removeItem('ghost_dev_admin_auth');
    sessionStorage.removeItem('ghost_demo_admin');

    // Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkIsAdmin(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.warn('Initial session check failed:', err);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkIsAdmin(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIsAdmin = (u: User | null) => {
    if (!u || !u.email) {
      setIsAdmin(false);
      return;
    }

    const email = u.email.toLowerCase();
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(email) || u.app_metadata?.role === 'admin';
    setIsAdmin(isAuthorized);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const lowerEmail = email.trim().toLowerCase();
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(lowerEmail);

    if (!isAuthorized) {
      return {
        success: false,
        error: 'Access Denied: Email address is not in the designated GHOST FC administrative registry.'
      };
    }

    if (!password || password.trim().length < 6) {
      return {
        success: false,
        error: 'Authentication failed: Password must be at least 6 characters.'
      };
    }

    // In local development mode when Supabase is not configured
    if (!isSupabaseConfigured) {
      setIsDemoAdmin(true);
      setIsAdmin(true);
      sessionStorage.setItem('ghost_dev_admin_auth', 'true');
      return { success: true };
    }

    // Live Supabase production authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: lowerEmail,
        password: password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        checkIsAdmin(data.user);
        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication error' };
    }
  };

  const logout = async () => {
    setIsDemoAdmin(false);
    setIsAdmin(false);
    sessionStorage.removeItem('ghost_dev_admin_auth');
    sessionStorage.removeItem('ghost_demo_admin');

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        login,
        logout,
        isDemoAdmin,
        isSupabaseLive: isSupabaseConfigured,
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
