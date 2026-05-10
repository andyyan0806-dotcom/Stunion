import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .eq('status', 'verified')
    .order('rating', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tutors: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const payload = await request.json();
  const tutor = {
    id: payload.id || crypto.randomUUID(),
    ...payload,
    status: 'pending',
    verified: false,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('tutors').insert([tutor]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, tutor: data });
}
