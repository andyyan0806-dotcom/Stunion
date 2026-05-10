import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const payload = await request.json();
  const { tutorId, parentEmail, parentPhone, preferredTimes, subjectFocus, discussionNotes } = payload;

  if (!tutorId || !parentEmail || !parentPhone) {
    return NextResponse.json({ error: 'Tutor ID, email, and phone are required.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('intro_calls')
    .insert([{
      tutor_id: tutorId,
      parent_email: parentEmail,
      parent_phone: parentPhone,
      preferred_times: preferredTimes ?? null,
      subject_focus: subjectFocus ?? null,
      discussion_notes: discussionNotes ?? null,
      status: 'pending',
      requested_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, introCall: data });
}

export async function GET(request: Request) {
  const supabase = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const tutorId = searchParams.get('tutorId');

  const query = supabase.from('intro_calls').select('*').order('requested_at', { ascending: false });
  if (tutorId) query.eq('tutor_id', tutorId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ introCalls: data ?? [] });
}
