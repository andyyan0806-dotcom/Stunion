import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabaseClient';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Tutor not found.' }, { status: 404 });
  return NextResponse.json({ tutor: data });
}
