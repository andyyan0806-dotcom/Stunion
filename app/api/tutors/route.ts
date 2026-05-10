import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export async function GET() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .in('status', ['verified', 'active'])
    .order('rating', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tutors: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const contentType = request.headers.get('content-type') ?? '';

  let fields: Record<string, string> = {};
  let photoUrl: string | null = null;
  let transcriptUrl: string | null = null;
  let scoreUrl: string | null = null;

  if (contentType.includes('multipart/form-data')) {
    const fd = await request.formData();

    // Upload helper
    async function uploadFile(file: File, bucket: string): Promise<string | null> {
      if (!file || file.size === 0) return null;
      const ext = file.name.split('.').pop() ?? 'bin';
      const path = `${crypto.randomUUID()}.${ext}`;
      const bytes = await file.arrayBuffer();
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, bytes, { contentType: file.type, upsert: false });
      if (error || !data) return null;
      if (bucket === 'photos') {
        return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
      }
      // Credentials bucket is private — store path only for admin access
      return data.path;
    }

    const photo = fd.get('photo') as File | null;
    const transcript = fd.get('transcript') as File | null;
    const scoreDoc = fd.get('score_doc') as File | null;

    if (photo) photoUrl = await uploadFile(photo, 'photos');
    if (transcript) transcriptUrl = await uploadFile(transcript, 'credentials');
    if (scoreDoc) scoreUrl = await uploadFile(scoreDoc, 'credentials');

    for (const [key, val] of fd.entries()) {
      if (typeof val === 'string') fields[key] = val;
    }
  } else {
    fields = await request.json();
  }

  const subjects = fields.subjects ? JSON.parse(fields.subjects) : [];
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return NextResponse.json({ error: 'At least one subject is required.' }, { status: 400 });
  }
  if (!fields.email || !fields.phone || !fields.language) {
    return NextResponse.json({ error: 'Email, phone, and language are required.' }, { status: 400 });
  }

  const rate = Number(fields.rate ?? 80000);
  if (rate < 30000 || rate > 200000) {
    return NextResponse.json({ error: 'Rate must be between ₩30,000 and ₩200,000.' }, { status: 400 });
  }

  const tutor = {
    id: crypto.randomUUID(),
    name: fields.name || fields.email.split('@')[0],
    bio: fields.bio ?? '',
    education: fields.education ?? '',
    scores: fields.scores ?? '',
    subjects,
    rate,
    language: fields.language,
    verified: false,
    status: 'pending',
    intro_call_enabled: fields.intro_call_enabled === 'true',
    photo_url: photoUrl,
    transcript_url: transcriptUrl,
    score_url: scoreUrl,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('tutors').insert([tutor]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Register promo code if provided
  const promoCode = fields.promo_code?.trim().toUpperCase();
  if (promoCode) {
    await supabase.from('promo_codes').insert([{
      code: promoCode,
      tutor_id: tutor.id,
      free_sessions_remaining: 5,
    }]);
  }

  return NextResponse.json({ success: true, tutor: data });
}
