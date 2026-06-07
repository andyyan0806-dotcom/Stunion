'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { getBrowserClient } from '../../lib/supabaseClient';
import { Booking, IntroCall, Tutor } from '../../types';

export default function DashboardPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [tutorProfile, setTutorProfile] = useState<Tutor | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [introCalls, setIntroCalls] = useState<IntroCall[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || role !== 'tutor') { setDataLoading(false); return; }

    async function load() {
      const supabase = getBrowserClient();

      const tutorRes = await supabase.from('tutors').select('*').eq('user_id', user!.id).maybeSingle();
      const tutor = tutorRes.data as Tutor | null;
      if (tutor) {
        setTutorProfile(tutor);
        const [bookingsRes, introRes] = await Promise.all([
          supabase.from('bookings').select('*').eq('tutor_id', tutor.id).order('created_at', { ascending: false }).limit(20),
          supabase.from('intro_calls').select('*').eq('tutor_id', tutor.id).order('requested_at', { ascending: false }).limit(20),
        ]);
        if (bookingsRes.data) setBookings(bookingsRes.data as Booking[]);
        if (introRes.data) setIntroCalls(introRes.data as IntroCall[]);
      }
      setDataLoading(false);
    }

    load();
  }, [user, role]);

  if (loading || dataLoading) {
    return (
      <main className="container" style={{ padding: '3rem 0' }}>
        <div className="card" style={{ padding: '2rem', color: '#6b7280' }}>Loading…</div>
      </main>
    );
  }

  if (!user) return null;

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const upcomingBookings = bookings.filter(b => b.status === 'accepted');
  const pendingCalls = introCalls.filter(c => c.status === 'pending');
  const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.payout_amount ?? 0), 0);

  async function updateBookingStatus(id: string, status: string) {
    if (!tutorProfile) return;
    await getBrowserClient().from('bookings').update({ status }).eq('id', id).eq('tutor_id', tutorProfile.id);
    setBookings(prev => prev.map(x => x.id === id ? { ...x, status: status as Booking['status'] } : x));
  }

  async function acceptIntroCall(id: string) {
    if (!tutorProfile) return;
    await getBrowserClient().from('intro_calls').update({ status: 'accepted' }).eq('id', id).eq('tutor_id', tutorProfile.id);
    setIntroCalls(prev => prev.map(x => x.id === id ? { ...x, status: 'accepted' as IntroCall['status'] } : x));
  }

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Tutor dashboard</p>
          <h1 className="section-title">
            {tutorProfile ? `${tutorProfile.name}'s dashboard` : 'Your dashboard'}
          </h1>
        </div>

        {/* Status banner if not active */}
        {tutorProfile && tutorProfile.status !== 'active' && (
          <div style={{ padding: '1rem 1.25rem', background: '#fefce8', border: '1px solid #fde68a', borderRadius: '0.75rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e' }}>
              <strong>Profile status: {tutorProfile.status}</strong> — your profile will go live once manually verified (within 48h).
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Pending bookings', value: pendingBookings.length },
            { label: 'Upcoming sessions', value: upcomingBookings.length },
            { label: 'Intro call requests', value: pendingCalls.length },
            { label: 'Total earnings', value: `₩${totalEarnings.toLocaleString()}` },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ padding: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Pending bookings */}
        <section>
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem' }}>Pending bookings</h2>
          {pendingBookings.length === 0 ? (
            <div className="card" style={{ padding: '1.25rem', color: '#6b7280', fontSize: '0.9rem' }}>No pending bookings.</div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {pendingBookings.map(b => (
                <div key={b.id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{b.parent_email}</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
                      {b.subject_focus} · {b.duration_minutes} min · ₩{b.amount.toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="button" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => updateBookingStatus(b.id, 'accepted')}>
                      Accept
                    </button>
                    <button type="button" className="button secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Intro call requests */}
        {tutorProfile?.intro_call_enabled && (
          <section>
            <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem' }}>Intro call requests</h2>
            {pendingCalls.length === 0 ? (
              <div className="card" style={{ padding: '1.25rem', color: '#6b7280', fontSize: '0.9rem' }}>No pending intro call requests.</div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {pendingCalls.map(c => (
                  <div key={c.id} className="card" style={{ padding: '1.25rem' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{c.parent_email}</p>
                    <p style={{ margin: '0.2rem 0 0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
                      {c.subject_focus && `${c.subject_focus} · `}{c.preferred_times}
                    </p>
                    <button type="button" className="button" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                      onClick={() => acceptIntroCall(c.id)}>
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/settings" className="button secondary">Manage profile & settings</Link>
          {tutorProfile && <Link href={`/tutors/${tutorProfile.id}`} className="button secondary">View my public profile</Link>}
        </div>
      </div>
    </main>
  );
}
