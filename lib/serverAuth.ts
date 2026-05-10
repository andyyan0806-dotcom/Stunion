import { getSupabaseClient } from './supabaseClient';

export async function getRequestUser(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

export async function requireAdmin(request: Request): Promise<{ ok: true } | { ok: false; response: Response }> {
  const user = await getRequestUser(request);
  if (!user) return { ok: false, response: new Response(JSON.stringify({ error: 'Unauthorized.' }), { status: 401, headers: { 'Content-Type': 'application/json' } }) };

  const supabase = getSupabaseClient();
  const { data } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle();
  if (data?.role !== 'admin') return { ok: false, response: new Response(JSON.stringify({ error: 'Forbidden.' }), { status: 403, headers: { 'Content-Type': 'application/json' } }) };

  return { ok: true };
}
