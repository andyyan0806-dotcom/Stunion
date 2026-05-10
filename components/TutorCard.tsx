import Link from 'next/link';
import { Tutor } from '../types';

interface TutorCardProps {
  tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <article className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>{tutor.name}</h3>
            {tutor.verified && (
              <span title="Verified tutor" style={{ color: '#16a34a', fontSize: '1rem' }}>✔</span>
            )}
          </div>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>{tutor.subjects.join(' · ')}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>₩{tutor.rate.toLocaleString()}</p>
          <p style={{ margin: '0.2rem 0 0', color: '#6b7280', fontSize: '0.85rem' }}>/hour</p>
        </div>
      </div>

      <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: 1.6 }}>{tutor.bio}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        <span className="tag">{tutor.language === 'both' ? 'Korean & English' : tutor.language === 'korean' ? 'Korean' : 'English'}</span>
        <span className="tag">{tutor.rating} ★ ({tutor.review_count})</span>
        {tutor.intro_call_enabled && (
          <span className="tag" style={{ background: '#eff6ff', color: '#1d4ed8' }}>Intro call</span>
        )}
      </div>

      <Link href={`/tutors/${tutor.id}`} className="button secondary" style={{ padding: '0.7rem 1rem', textAlign: 'center' }}>
        View profile
      </Link>
    </article>
  );
}
