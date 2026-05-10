import Link from 'next/link';
import { TutorCard } from '../components/TutorCard';
import { tutors } from '../lib/mockData';

export default function HomePage() {
  return (
    <main>
      <section className="container" style={{ padding: '4rem 0 2rem' }}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div>
            <p style={{ color: '#4338ca', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.15em' }}>
              Stunion MVP
            </p>
            <h1 className="section-title">Discover verified SAT, IB, and AP tutors for international school families in Korea.</h1>
            <p className="subtitle" style={{ marginTop: '1rem' }}>
              Browse verified tutor profiles, watch teaching demos, and book sessions with secure payment and platform protection.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link href="/tutors" className="button">
              Browse tutors
            </Link>
            <Link href="/onboard" className="button secondary">
              Become a tutor
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '2rem 0 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="section-title">Featured verified tutors</h2>
            <p className="subtitle" style={{ marginTop: '0.75rem' }}>
              Quick access to carefully reviewed tutors with sample ratings, hourly rates, and areas of expertise.
            </p>
          </div>
          <Link href="/tutors" className="button secondary">
            View all tutors
          </Link>
        </div>

        <div className="grid grid-3">
          {tutors.slice(0, 3).map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </section>
    </main>
  );
}
