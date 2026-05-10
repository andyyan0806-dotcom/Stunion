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
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{tutor.name}</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>{tutor.subjects.join(' · ')}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontWeight: 700 }}>{tutor.rate.toLocaleString()} won</p>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>/hour</p>
        </div>
      </div>
      <p style={{ margin: 0, color: '#374151' }}>{tutor.bio}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span className="tag">{tutor.language === 'both' ? 'Korean & English' : tutor.language}</span>
        <span className="tag">{tutor.rating} ★</span>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link href={`/tutors/${tutor.id}`} className="button secondary" style={{ padding: '0.75rem 1rem' }}>
          View profile
        </Link>
      </div>
    </article>
  );
}
