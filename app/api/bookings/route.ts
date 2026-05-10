import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const payload = await request.json();
  const amount = Number(payload.amount ?? 0);
  const fee = Math.round(amount * 0.1);
  const withholding = Math.round((amount - fee) * 0.033);

  if (!payload.parentEmail || !payload.parentPhone || !payload.bookingDate || !amount) {
    return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
  }

  const booking = {
    tutor_id: payload.tutorId || null,
    parent_email: payload.parentEmail,
    parent_phone: payload.parentPhone,
    student_name: payload.studentName,
    booking_date: payload.bookingDate,
    duration_minutes: payload.durationMinutes,
    location_preference: payload.locationPreference,
    subject_focus: payload.subjectFocus,
    amount,
    fee,
    withholding,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('bookings').insert([booking]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, booking: data });
}
