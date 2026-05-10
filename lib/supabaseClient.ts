import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const serverSupabaseKey = supabaseServiceRoleKey || supabaseAnonKey;

export function getSupabaseClient() {
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in environment');
  }

  const key = typeof window === 'undefined' ? serverSupabaseKey : supabaseAnonKey;
  return createClient(supabaseUrl, key);
}
