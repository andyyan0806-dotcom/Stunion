import Link from 'next/link';
import { TutorCard } from '../components/TutorCard';
import { getSupabaseClient } from '../lib/supabaseClient';
import { Tutor } from '../types';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('tutors')
    .select('*')
    .in('status', ['verified', 'active'])
    .order('rating', { ascending: false })
    .limit(3);

  const featured = (data ?? []) as Tutor[];

  return (
    <main>
      <section className="container" style={{ padding: '4rem 0 2rem' }}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div>
            <p style={{ color: '#4338ca', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.15em', margin: '0 0 1rem' }}>
              Stunion
            </p>
            <h1 className="section-title">Verified SAT, IB, and AP tutors for international school families in Korea.</h1>
            <p className="subtitle" style={{ marginTop: '1rem' }}>
              Every tutor has a manually verified university transcript on file. Browse profiles, request a free 15-min intro call, and book with full payment protection.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link href="/tutors" className="button">Browse tutors</Link>
            <Link href="/onboard" className="button secondary">Become a tutor</Link>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Verified transcripts', desc: 'Every credential reviewed manually before activation.' },
              { label: 'Payment escrow', desc: 'Funds held until you confirm the session went well.' },
              { label: '10% platform fee', desc: 'Transparent pricing. No hidden charges.' },
            ].map(item => (
              <div key={item.label} style={{ minWidth: '180px' }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>{item.label}</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '2rem 0 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <h2 className="section-title">Featured verified tutors</h2>
            <p className="subtitle" style={{ marginTop: '0.5rem' }}>
              {featured.length > 0 ? 'Active tutors from the Stunion network.' : 'Tutors coming soon — check back shortly.'}
            </p>
          </div>
          <Link href="/tutors" className="button secondary">View all</Link>
        </div>

        {featured.length > 0 && (
          <div className="grid grid-3">
            {featured.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
