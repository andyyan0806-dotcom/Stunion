import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .in('status', ['verified', 'active'])
    .order('rating', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tutors: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const fields = await request.json();

  const subjects: string[] = Array.isArray(fields.subjects) ? fields.subjects : [];
  if (subjects.length === 0) {
    return NextResponse.json({ error: 'At least one subject is required.' }, { status: 400 });
  }
  if (!fields.email || !fields.phone || !fields.language) {
    return NextResponse.json({ error: 'Email, phone, and language are required.' }, { status: 400 });
  }

  const rate = Number(fields.rate ?? 80000);
  if (rate < 30000 || rate > 200000) {
    return NextResponse.json({ error: 'Rate must be between ₩30,000 and ₩200,000.' }, { status: 400 });
  }

  const tutor = {
    id: crypto.randomUUID(),
    user_id: fields.user_id || null,
    email: fields.email,
    phone: fields.phone || null,
    name: fields.name || fields.email.split('@')[0],
    bio: fields.bio ?? '',
    education: fields.education ?? '',
    scores: fields.scores ?? '',
    subjects,
    rate,
    language: fields.language,
    verified: false,
    status: 'pending',
    intro_call_enabled: fields.intro_call_enabled === true,
    photo_url: fields.photo_url || null,
    transcript_url: fields.transcript_url || null,
    score_url: fields.score_url || null,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('tutors').insert([tutor]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Register promo code if provided
  const promoCode = fields.promo_code?.trim().toUpperCase();
  if (promoCode) {
    await supabase.from('promo_codes').insert([{
      code: promoCode,
      tutor_id: tutor.id,
      free_sessions_remaining: 5,
    }]);
  }

  return NextResponse.json({ success: true, tutor: data });
}
