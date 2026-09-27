import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, getMissingSupabaseEnv } from './supabaseClient';

export type SupabaseConnectionStatus =
  | 'checking'
  | 'connected'
  | 'connected_tables_pending'
  | 'unconfigured'
  | 'auth_error'
  | 'network_error'
  | 'error';

export interface SupabaseTestResult {
  success: boolean;
  status: SupabaseConnectionStatus;
  message: string;
  details?: string;
  missingEnv: string[];
  latency: number | null;
  testedAt: string;
}

/**
 * Safely tests whether the client can communicate with the remote Supabase project.
 * Does NOT expose any keys, credentials, or secrets in return values.
 */
export async function testSupabaseConnection(): Promise<SupabaseTestResult> {
  const testedAt = new Date().toLocaleTimeString();
  const missingEnv = getMissingSupabaseEnv();

  if (!isSupabaseConfigured || missingEnv.length > 0) {
    return {
      success: false,
      status: 'unconfigured',
      message: 'Supabase environment variables are missing.',
      details: `Please set ${missingEnv.join(' and ')} in your .env.local file.`,
      missingEnv,
      latency: null,
      testedAt,
    };
  }

  const startTime = performance.now();

  try {
    // 1. Auth check - does not require custom tables to exist
    const authPromise = supabase.auth.getSession();

    // 2. REST ping to a primary table (e.g. team_settings)
    const restPromise = supabase
      .from('team_settings')
      .select('id')
      .limit(1);

    const [authRes, restRes] = await Promise.allSettled([authPromise, restPromise]);
    const latency = Math.round(performance.now() - startTime);

    // Analyze REST result
    if (restRes.status === 'fulfilled') {
      const { error } = restRes.value;

      if (!error) {
        return {
          success: true,
          status: 'connected',
          message: 'Connected to Supabase successfully.',
          details: `Database response received in ${latency}ms. All configured tables are reachable.`,
          missingEnv: [],
          latency,
          testedAt,
        };
      }

      // Check if the error indicates successful connection to Postgres, but table not yet created
      const errMessage = (error.message || '').toLowerCase();
      const errCode = error.code || '';

      if (
        errCode === '42P01' || // relation does not exist in postgres
        errMessage.includes('relation') ||
        errMessage.includes('does not exist') ||
        errMessage.includes('not found') ||
        error.hint?.includes('table')
      ) {
        return {
          success: true,
          status: 'connected_tables_pending',
          message: 'Connected to Supabase project, but tables are pending.',
          details: `Supabase responded in ${latency}ms. The public tables have not been created yet. Run supabase-schema.sql in your Supabase SQL Editor.`,
          missingEnv: [],
          latency,
          testedAt,
        };
      }

      // Check for invalid credentials
      if (
        error.code === 'PGRST301' ||
        error.message?.includes('JWT') ||
        error.message?.includes('apikey') ||
        error.message?.includes('unauthorized') ||
        error.message?.includes('Invalid')
      ) {
        return {
          success: false,
          status: 'auth_error',
          message: 'Invalid Supabase publishable key.',
          details: 'Authentication rejected by Supabase. Verify VITE_SUPABASE_PUBLISHABLE_KEY in your Supabase dashboard API settings.',
          missingEnv: [],
          latency,
          testedAt,
        };
      }

      return {
        success: false,
        status: 'error',
        message: 'Supabase returned an unexpected error.',
        details: error.message || 'Unknown database response.',
        missingEnv: [],
        latency,
        testedAt,
      };
    } else {
      // Promise rejected (usually network failure / bad URL)
      const reason = restRes.reason?.message || 'Network connection failed';
      return {
        success: false,
        status: 'network_error',
        message: 'Could not connect to Supabase URL.',
        details: reason.includes('Failed to fetch')
          ? 'Network fetch failed. Verify VITE_SUPABASE_URL is correct and Supabase project is active.'
          : reason,
        missingEnv: [],
        latency,
        testedAt,
      };
    }
  } catch (err: any) {
    const latency = Math.round(performance.now() - startTime);
    return {
      success: false,
      status: 'error',
      message: 'Connection check encountered an error.',
      details: err?.message || 'Unable to execute connection check.',
      missingEnv: [],
      latency,
      testedAt,
    };
  }
}

/**
 * React hook for consuming Supabase connection status across components and pages.
 */
export function useSupabaseConnection(autoCheck: boolean = true) {
  const [loading, setLoading] = useState<boolean>(autoCheck);
  const [result, setResult] = useState<SupabaseTestResult | null>(null);

  const runCheck = useCallback(async () => {
    setLoading(true);
    try {
      const res = await testSupabaseConnection();
      setResult(res);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoCheck) {
      runCheck();
    }
  }, [autoCheck, runCheck]);

  return {
    isLoading: loading,
    result,
    status: result ? result.status : (loading ? 'checking' : 'unconfigured'),
    isConnected: result?.success ?? false,
    missingEnv: result ? result.missingEnv : getMissingSupabaseEnv(),
    testConnection: runCheck,
  };
}

/**
 * Generic safe helper to execute queries against Supabase without exposing credentials.
 */
export async function executeSafeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase is not configured' };
  }
  try {
    const { data, error } = await queryFn();
    if (error) {
      return { data: null, error: error.message || 'Database query error' };
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to execute database query' };
  }
}
