import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../../lib/supabaseClient';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('bookings')
    .update({ payment_notified: true })
    .eq('id', id)
    .eq('status', 'pending');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
