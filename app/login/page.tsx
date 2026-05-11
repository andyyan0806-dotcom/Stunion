'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBrowserClient } from '../../lib/supabaseClient';

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.85rem',
  borderRadius: '0.75rem',
  border: '1px solid #d1d5db',
  background: 'white',
  boxSizing: 'border-box',
  fontSize: '1rem',
};

type Tab = 'login' | 'signup';
type Role = 'parent' | 'tutor';

function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [role, setRole] = useState<Role>('parent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getBrowserClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/tutors');
    router.refresh();
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getBrowserClient();

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (err) { setError(err.message); setLoading(false); return; }

    if (data.user) {
      await supabase.from('users').insert([{ id: data.user.id, email, phone, name, role }]);
    }

    if (role === 'tutor') {
      router.push('/onboard');
      return;
    }

    if (data.session) {
      router.push('/tutors');
    } else {
      setConfirm(true);
      setLoading(false);
    }
  }

  if (confirm) {
    return (
      <main className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ padding: '2rem', maxWidth: '420px', width: '100%' }}>
          <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Check your email</h1>
          <p style={{ marginTop: '0.75rem', color: '#374151', lineHeight: 1.7 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back to log in.
          </p>
          <button
            type="button"
            className="button secondary"
            style={{ marginTop: '1rem' }}
            onClick={() => { setConfirm(false); setTab('login'); }}
          >
            Back to log in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '420px', width: '100%', display: 'grid', gap: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>Welcome to Stunion</h1>

        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f3f4f6', borderRadius: '0.75rem', padding: '0.25rem', gap: '0.25rem' }}>
          {(['login', 'signup'] as Tab[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(null); }}
              style={{
                padding: '0.6rem',
                borderRadius: '0.55rem',
                border: 'none',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#111827' : '#6b7280',
                fontWeight: tab === t ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }} onSubmit={handleLogin}>
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Email
              <input type="email" required placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Password
              <input type="password" required placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </label>
            {error && <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="button" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
          </form>
        ) : (
          <form className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }} onSubmit={handleSignup}>

            {/* Role toggle */}
            <div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>I am a…</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {(['parent', 'tutor'] as Role[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      padding: '0.65rem',
                      borderRadius: '0.75rem',
                      border: '2px solid',
                      borderColor: role === r ? '#4338ca' : '#e5e7eb',
                      background: role === r ? '#eef2ff' : 'white',
                      color: role === r ? '#4338ca' : '#374151',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {r === 'parent' ? 'Parent / Student' : 'Tutor'}
                  </button>
                ))}
              </div>
              {role === 'tutor' && (
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
                  After signing up you'll be taken to the tutor application form to upload your credentials.
                </p>
              )}
            </div>

            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Full name
              <input type="text" required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Email
              <input type="email" required placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Korean phone number
              <input type="tel" required placeholder="010-1234-5678" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Password <span style={{ fontWeight: 400, color: '#9ca3af' }}>— min 8 characters</span>
              <input type="password" required minLength={8} placeholder="Choose a password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </label>

            {error && <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Creating account…' : role === 'tutor' ? 'Create account & apply' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}
