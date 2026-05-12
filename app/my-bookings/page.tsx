'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBrowserClient } from '../../lib/supabaseClient';
import { Booking } from '../../types';
import { ReviewForm } from '../../components/ReviewForm';

type BookingWithTutor = Booking & {
  tutors?: { name: string; photo_url?: string; subjects: string[] };
};

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending:   { bg: '#fefce8', color: '#b45309', border: '#fde68a' },
  accepted:  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  completed: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  refunded:  { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  cancelled: { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    getBrowserClient().auth.getSession().then(({ data }: { data: { session: { user: { email?: string }; access_token: string } | null } }) => {
      const session = data.session;
      const userEmail = session?.user?.email ?? null;
      setEmail(userEmail);
      if (!session || !userEmail) { setLoading(false); return; }

      fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then(r => r.json())
        .then(d => setBookings(d.bookings ?? []))
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) {
    return (
      <main className="container" style={{ padding: '3rem 0' }}>
        <p style={{ color: '#6b7280' }}>Loading…</p>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="container" style={{ padding: '3rem 0', maxWidth: '480px' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, marginBottom: '1rem' }}>Sign in to view your bookings</p>
          <Link href="/login" className="button">Sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ maxWidth: '720px', display: 'grid', gap: '1.5rem' }}>
        <div>
          <h1 className="section-title">My bookings</h1>
          <p className="subtitle" style={{ marginTop: '0.5rem' }}>All sessions booked under {email}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No bookings yet.</p>
            <Link href="/tutors" className="button">Browse tutors</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {bookings.map(b => {
              const statusStyle = STATUS_COLORS[b.status] ?? STATUS_COLORS.pending;
              return (
                <div key={b.id} className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>
                        {b.tutors?.name ?? 'Tutor'}
                      </p>
                      {b.subject_focus && (
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>{b.subject_focus}</p>
                      )}
                    </div>
                    <span style={{ padding: '0.3rem 0.7rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, whiteSpace: 'nowrap' }}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#374151' }}>
                    <span>📅 {formatDate(b.booking_date)}</span>
                    <span>⏱ {b.duration_minutes} min</span>
                    <span>📍 {b.location_preference}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                    <span style={{ color: '#111827' }}>
                      Total paid: <strong>₩{b.amount.toLocaleString()}</strong>
                    </span>
                    {b.promo_code_used && (
                      <span style={{ color: '#16a34a' }}>Promo: {b.promo_code_used} (fee waived)</span>
                    )}
                  </div>

                  {b.status === 'completed' && (
                    reviewed.has(b.id) ? (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#16a34a' }}>✔ Review submitted — thank you!</p>
                    ) : (
                      <ReviewForm
                        bookingId={b.id}
                        tutorId={b.tutor_id}
                        tutorName={b.tutors?.name ?? 'your tutor'}
                        parentEmail={email!}
                        onSubmitted={() => setReviewed(prev => new Set(prev).add(b.id))}
                      />
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
