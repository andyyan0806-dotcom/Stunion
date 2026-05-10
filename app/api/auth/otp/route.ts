import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, phone } = body;

  if (!email || !phone) {
    return NextResponse.json({ error: 'Email and phone are required' }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'OTP sent to phone number', email, phone });
}
