import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import { requireAdmin } from '../../../lib/serverAuth';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseClient();

  const [
    { count: verifiedCount },
    { count: pendingCount },
    { data: approvals, error: approvalError },
    { data: disputes, error: disputeError },
    { data: completedBookings },
  ] = await Promise.all([
    supabase.from('tutors').select('*', { count: 'exact', head: true }).in('status', ['verified', 'active']),
    supabase.from('tutors').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('tutors').select('id, name, email, phone, education, scores, rate, language, status, transcript_url, score_url, created_at').eq('status', 'pending').order('created_at', { ascending: true }),
    supabase.from('disputes').select('*').eq('status', 'open').order('created_at', { ascending: true }),
    supabase.from('bookings').select('amount').eq('status', 'completed'),
  ]);

  if (approvalError || disputeError) {
    return NextResponse.json({ error: (approvalError || disputeError)?.message }, { status: 500 });
  }

  const gmv = (completedBookings ?? []).reduce((sum, b) => sum + (b.amount ?? 0), 0);

  return NextResponse.json({
    metrics: {
      verifiedTutors: verifiedCount ?? 0,
      pendingApprovals: pendingCount ?? 0,
      gmv,
      openDisputes: (disputes ?? []).length,
    },
    approvals: approvals ?? [],
    disputes: disputes ?? [],
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseClient();
  const payload = await request.json();

  if (payload.type === 'update-tutor-status') {
    const { tutorId, status } = payload;
    const verified = status === 'verified' || status === 'active';
    const { data, error } = await supabase
      .from('tutors')
      .update({ status, verified })
      .eq('id', tutorId)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, tutor: data });
  }

  if (payload.type === 'resolve-dispute') {
    const { disputeId, resolution } = payload;
    const status = resolution === 'denied' ? 'denied' : 'resolved';
    const { error } = await supabase
      .from('disputes')
      .update({ status, resolution, resolved_at: new Date().toISOString() })
      .eq('id', disputeId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (payload.type === 'create-promo-code') {
    const { code, tutorId, freeSessions } = payload;
    const { error } = await supabase.from('promo_codes').insert([{
      code: code.toUpperCase(),
      tutor_id: tutorId || null,
      free_sessions_remaining: freeSessions ?? 5,
    }]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (payload.type === 'trigger-payout') {
    const { bookingId } = payload;
    const { data: booking } = await supabase.from('bookings').select('*').eq('id', bookingId).maybeSingle();
    if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });

    const { error } = await supabase.from('payouts').insert([{
      tutor_id: booking.tutor_id,
      booking_id: bookingId,
      amount: booking.payout_amount,
      withholding_tax: booking.withholding,
      status: 'paid',
      paid_at: new Date().toISOString(),
    }]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('bookings').update({ status: 'completed' }).eq('id', bookingId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true, action: 'ignored' });
}
