'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserClient } from '../../../lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) { router.replace('/login'); return; }

    const supabase = getBrowserClient();
    supabase.auth.exchangeCodeForSession(code).then(() => {
      router.replace('/tutors');
    });
  }, [router]);

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#6b7280' }}>Confirming your account…</p>
    </main>
  );
}
