import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const serverSupabaseKey = supabaseServiceRoleKey || supabaseAnonKey;

export function getSupabaseClient() {
  if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in environment');
  const key = typeof window === 'undefined' ? serverSupabaseKey : supabaseAnonKey;
  return createClient(supabaseUrl, key);
}

// Singleton browser client — never create more than one instance per page
let _browserClient: ReturnType<typeof createClient> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBrowserClient(): any {
  if (!supabaseUrl) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in environment');
  if (!_browserClient) _browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return _browserClient;
}
