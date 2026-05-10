import { NextResponse } from 'next/server';
import { getBrowserClient } from '../../../lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = getBrowserClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/tutors`);
}
