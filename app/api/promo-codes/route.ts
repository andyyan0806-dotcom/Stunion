import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export async function GET(request: Request) {
  const supabase = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'code is required.' }, { status: 400 });

  const { data, error } = await supabase
    .from('promo_codes')
    .select('code, free_sessions_remaining')
    .eq('code', code.toUpperCase())
    .gt('free_sessions_remaining', 0)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 404 });
  return NextResponse.json({ valid: true, sessionsRemaining: data.free_sessions_remaining });
}
