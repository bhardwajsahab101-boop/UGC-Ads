import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  error?: string;
}

/**
 * Checks whether Supabase environment variables are properly provided on the server.
 */
export function checkSupabaseConfig(): SupabaseConfigStatus {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      isConfigured: false,
      error: 'Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.',
    };
  }

  if (url === 'https://your-project-ref.supabase.co' || key.includes('your-supabase-service-role-key')) {
    return {
      isConfigured: false,
      error: 'Supabase contains placeholder credentials. Please update with your actual project keys.',
    };
  }

  return { isConfigured: true };
}

/**
 * Returns an authenticated Supabase admin client for server-side operations.
 * Safely inserts leads while RLS blocks unauthorized public access.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const status = checkSupabaseConfig();
  if (!status.isConfigured) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!;
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY
  )!;

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
