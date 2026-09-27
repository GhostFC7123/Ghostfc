import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Read client-side public environment variables
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseUrl: string =
  typeof rawSupabaseUrl === 'string' ? rawSupabaseUrl.trim() : '';

export const supabasePublishableKey: string =
  typeof rawSupabasePublishableKey === 'string'
    ? rawSupabasePublishableKey.trim()
    : '';

/**
 * Validates whether both Supabase URL and Publishable/Anon key are configured.
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

/**
 * Returns a list of any missing Supabase environment variables for diagnostic purposes.
 */
export function getMissingSupabaseEnv(): string[] {
  const missing: string[] = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabasePublishableKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');
  return missing;
}

// Fallback dummy endpoint prevents runtime crashes on page load when env vars are not yet populated
const activeUrl = isSupabaseConfigured
  ? supabaseUrl
  : 'https://placeholder-ghost-fc.supabase.co';

const activeKey = isSupabaseConfigured
  ? supabasePublishableKey
  : 'placeholder-publishable-key';

/**
 * Singleton typed Supabase client for GHOST FC.
 * Uses only client-safe public keys. Never uses service_role or server secrets.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  activeUrl,
  activeKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
