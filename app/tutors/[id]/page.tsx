import Link from 'next/link';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import { Tutor } from '../../../types';
import { IntroCallForm } from '../../../components/IntroCallForm';
import { ReviewsSection } from '../../../components/ReviewsSection';

interface TutorProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function TutorProfilePage({ params }: TutorProfilePageProps) {
  const { id } = await params;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return (
      <main className="container" style={{ padding: '3rem 0' }}>
        <p style={{ color: '#6b7280' }}>Tutor not found.</p>
        <Link href="/tutors" className="button secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Back to tutors</Link>
      </main>
    );
  }

  const tutor = data as Tutor;
  const langLabel = tutor.language === 'both' ? 'Korean & English' : tutor.language === 'korean' ? 'Korean' : 'English';

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <Link href="/tutors" style={{ color: '#4338ca', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>
        ← Back to tutors
      </Link>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0,1fr)', maxWidth: '720px' }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'start', flexWrap: 'wrap' }}>
          {tutor.photo_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={tutor.photo_url} alt={tutor.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e0e7ff', display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: '1.75rem', color: '#4338ca' }}>
              {tutor.name.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.6rem' }}>{tutor.name}</h1>
              {tutor.verified && (
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.3rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #bbf7d0' }}>
                  ✔ Verified
                </span>
              )}
              {tutor.intro_call_enabled && (
                <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.3rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #bfdbfe' }}>
                  Intro call
                </span>
              )}
              {tutor.rating >= 4.7 && tutor.review_count >= 10 && (
                <span style={{ background: '#fefce8', color: '#b45309', padding: '0.3rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #fde68a' }}>
                  Top Rated
                </span>
              )}
            </div>
            <p style={{ margin: '0.5rem 0 0', color: '#6b7280' }}>
              {tutor.education} · {langLabel}
            </p>
          </div>
        </div>

        {/* Credentials */}
        <div className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.75rem' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Verified credentials</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#16a34a' }}>✔</span>
              <span style={{ fontSize: '0.9rem' }}>University transcript</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#16a34a' }}>✔</span>
              <span style={{ fontSize: '0.9rem' }}>Test scores — {tutor.scores}</span>
            </div>
          </div>
        </div>

        {/* Bio + subjects */}
        <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{tutor.bio}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {tutor.subjects.map(s => <span key={s} className="tag">{s}</span>)}
          </div>
        </div>

        {/* Rate + stats */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="card" style={{ padding: '1rem 1.5rem', flex: 1, minWidth: '130px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Hourly rate</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '1.4rem', fontWeight: 700 }}>₩{tutor.rate.toLocaleString()}</p>
          </div>
          <div className="card" style={{ padding: '1rem 1.5rem', flex: 1, minWidth: '130px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Rating</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '1.4rem', fontWeight: 700 }}>{tutor.rating} ★</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>{tutor.review_count} reviews</p>
          </div>
          <div className="card" style={{ padding: '1rem 1.5rem', flex: 1, minWidth: '130px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Language</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 600 }}>{langLabel}</p>
          </div>
        </div>

        {/* Booking + intro call CTAs */}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Booking terms</p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.8 }}>
              <li>Payment held in escrow until you confirm the session completed</li>
              <li>10% platform fee + 3.3% withholding applied at checkout</li>
              <li>Refund available within 24h of session if you raise a dispute</li>
            </ul>
          </div>

          <Link href={`/bookings?tutorId=${encodeURIComponent(tutor.id)}`} className="button" style={{ textAlign: 'center' }}>
            Request booking
          </Link>

          {tutor.intro_call_enabled && (
            <IntroCallForm tutorId={tutor.id} tutorName={tutor.name} />
          )}
        </div>

        {/* Reviews */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <ReviewsSection tutorId={tutor.id} rating={tutor.rating} reviewCount={tutor.review_count} />
        </div>

      </div>
    </main>
  );
}
