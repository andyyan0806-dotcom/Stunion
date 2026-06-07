import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import { getRequestUser } from '../../../lib/serverAuth';

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const supabase = getSupabaseClient();
  const { data: fromTutor } = await supabase
    .from('tutors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!fromTutor) return NextResponse.json({ hasVouched: false, vouch: null });

  const { data: vouch } = await supabase
    .from('vouches')
    .select('id, to_tutor_id, created_at, tutors!vouches_to_tutor_id_fkey(name)')
    .eq('from_tutor_id', fromTutor.id)
    .maybeSingle();

  return NextResponse.json({ hasVouched: !!vouch, vouch });
}

export async function POST(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const supabase = getSupabaseClient();
  const { toTutorId } = await request.json();
  if (!toTutorId) return NextResponse.json({ error: 'Missing toTutorId.' }, { status: 400 });

  const { data: fromTutor } = await supabase
    .from('tutors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!fromTutor) return NextResponse.json({ error: 'No tutor profile found.' }, { status: 404 });
  if (fromTutor.id === toTutorId) return NextResponse.json({ error: 'You cannot vouch for yourself.' }, { status: 400 });

  const { data: existing } = await supabase
    .from('vouches')
    .select('id')
    .eq('from_tutor_id', fromTutor.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: 'You have already used your vouch.' }, { status: 409 });

  const { data: recipient } = await supabase
    .from('tutors')
    .select('id, vouch_count')
    .eq('id', toTutorId)
    .maybeSingle();

  if (!recipient) return NextResponse.json({ error: 'Tutor not found.' }, { status: 404 });

  const { error: insertError } = await supabase
    .from('vouches')
    .insert([{ from_tutor_id: fromTutor.id, to_tutor_id: toTutorId }]);

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  await supabase
    .from('tutors')
    .update({ vouch_count: (recipient.vouch_count ?? 0) + 1 })
    .eq('id', toTutorId);

  return NextResponse.json({ success: true });
}
