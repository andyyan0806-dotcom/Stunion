import Link from 'next/link';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import { Tutor } from '../../../types';

interface TutorProfilePageProps {
  params: {
    id: string;
  };
}

export default async function TutorProfilePage({ params }: TutorProfilePageProps) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tutors')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (error || !data) {
    return (
      <main className="container" style={{ padding: '3rem 0' }}>
        <p>Tutor not found.</p>
      </main>
    );
  }

  const tutor = data as Tutor;

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p className="tag">Tutor profile</p>
              <h1 className="section-title">{tutor.name}</h1>
              <p className="subtitle" style={{ marginTop: '0.75rem' }}>
                Verified tutor for {tutor.subjects.join(', ')} with {tutor.language === 'both' ? 'Korean and English support' : `${tutor.language} support`}.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <span className="tag">Verified tutor</span>
              <span className="tag">Top-rated</span>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>Teaching demo</strong>
                <div style={{ marginTop: '0.75rem', background: '#e5e7eb', minHeight: '240px', borderRadius: '1rem', display: 'grid', placeItems: 'center' }}>
                  <span>Video placeholder</span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <p>{tutor.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {tutor.subjects.map((subject) => (
                    <span key={subject} className="tag">{subject}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div>
                    <strong>Rate</strong>
                    <p>{tutor.rate.toLocaleString()} won / hour</p>
                  </div>
                  <div>
                    <strong>Education</strong>
                    <p>{tutor.education}</p>
                  </div>
                  <div>
                    <strong>Scores</strong>
                    <p>{tutor.scores}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: '0.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '1rem' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>Booking requirements</p>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151', lineHeight: 1.8 }}>
                    <li>Sign-up required before request</li>
                    <li>Submit date, duration, and location preference</li>
                    <li>Pay full amount upfront via secure payment</li>
                  </ul>
                </div>
              </div>

              <Link href={`/bookings?tutorId=${encodeURIComponent(tutor.id)}`} className="button">
                Request booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
