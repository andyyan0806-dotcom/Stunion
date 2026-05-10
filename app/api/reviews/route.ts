import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export async function GET(request: Request) {
  const supabase = getSupabaseClient();
  const { searchParams } = new URL(request.url);
  const tutorId = searchParams.get('tutorId');

  if (!tutorId) return NextResponse.json({ error: 'tutorId is required.' }, { status: 400 });

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const payload = await request.json();
  const { bookingId, tutorId, parentEmail, rating, comment } = payload;

  if (!bookingId || !tutorId || !rating) {
    return NextResponse.json({ error: 'bookingId, tutorId, and rating are required.' }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert([{ booking_id: bookingId, tutor_id: tutorId, parent_email: parentEmail ?? null, rating, comment: comment ?? null }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update tutor's aggregated rating
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('tutor_id', tutorId);

  if (allReviews && allReviews.length > 0) {
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await supabase
      .from('tutors')
      .update({ rating: Math.round(avg * 10) / 10, review_count: allReviews.length })
      .eq('id', tutorId);
  }

  return NextResponse.json({ success: true, review: data });
}
