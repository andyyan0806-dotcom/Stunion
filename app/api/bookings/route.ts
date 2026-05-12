import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import { getRequestUser } from '../../../lib/serverAuth';
import { sendBookingNotificationToTutor, sendBookingConfirmationToParent } from '../../../lib/email';

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*, tutors(name, photo_url, subjects)')
    .eq('parent_email', user.email)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const payload = await request.json();

  const { tutorId, parentEmail, parentPhone, bookingDate, durationMinutes, locationPreference, studentName, subjectFocus, amount: rawAmount, promoCode } = payload;

  if (!parentEmail || !parentPhone || !bookingDate || !tutorId) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const amount = Number(rawAmount ?? 0);
  if (amount <= 0) return NextResponse.json({ error: 'Invalid session amount.' }, { status: 400 });

  let feeWaived = false;
  let promoCodeUsed: string | null = null;

  // Validate promo code if provided
  if (promoCode) {
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode.toUpperCase())
      .gt('free_sessions_remaining', 0)
      .maybeSingle();

    if (promo) {
      feeWaived = true;
      promoCodeUsed = promo.code;
      // Decrement remaining sessions
      await supabase
        .from('promo_codes')
        .update({ free_sessions_remaining: promo.free_sessions_remaining - 1 })
        .eq('code', promo.code);
    }
  }

  const fee = feeWaived ? 0 : Math.round(amount * 0.1);
  const tutorGross = amount - fee;
  const withholding = Math.round(tutorGross * 0.033);
  const payoutAmount = tutorGross - withholding;

  const booking = {
    tutor_id: tutorId,
    parent_email: parentEmail,
    parent_phone: parentPhone,
    student_name: studentName ?? null,
    booking_date: bookingDate,
    duration_minutes: Number(durationMinutes),
    location_preference: locationPreference ?? 'online',
    subject_focus: subjectFocus ?? null,
    amount,
    fee,
    withholding,
    payout_amount: payoutAmount,
    promo_code_used: promoCodeUsed,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email notifications — fire-and-forget (don't block the response)
  if (process.env.RESEND_API_KEY) {
    const { data: tutorRow } = await supabase
      .from('tutors')
      .select('email, name')
      .eq('id', tutorId)
      .maybeSingle();

    if (tutorRow?.email) {
      sendBookingNotificationToTutor({
        tutorEmail: tutorRow.email,
        tutorName: tutorRow.name,
        parentEmail,
        studentName: studentName ?? '',
        bookingDate,
        durationMinutes: Number(durationMinutes),
        subjectFocus,
        grossAmount: amount,
      }).catch(() => {});
    }

    sendBookingConfirmationToParent({
      parentEmail,
      studentName: studentName ?? '',
      tutorName: tutorRow?.name ?? 'your tutor',
      bookingDate,
      durationMinutes: Number(durationMinutes),
      grossAmount: amount,
      feeWaived: feeWaived,
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, booking: data });
}
