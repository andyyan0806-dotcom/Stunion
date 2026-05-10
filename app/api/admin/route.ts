import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export async function GET() {
  const supabase = getSupabaseClient();
  const [{ data: approvals, error: approvalError }, { data: disputes, error: disputeError }] = await Promise.all([
    supabase.from('tutors').select('id, name, rate, language, status').eq('status', 'pending'),
    supabase.from('disputes').select('*').eq('status', 'open'),
  ]);

  if (approvalError || disputeError) {
    return NextResponse.json({ error: (approvalError || disputeError)?.message }, { status: 500 });
  }

  return NextResponse.json({ approvals: approvals ?? [], disputes: disputes ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const payload = await request.json();

  if (payload.type === 'update-tutor-status') {
    const { tutorId, status } = payload;
    const { data, error } = await supabase.from('tutors').update({ status }).eq('id', tutorId).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, tutor: data });
  }

  return NextResponse.json({ success: true, action: 'ignored', payload });
}
