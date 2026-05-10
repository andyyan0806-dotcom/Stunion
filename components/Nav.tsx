import Link from 'next/link';

export function Nav() {
  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 0' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '1.15rem', color: '#4338ca', letterSpacing: '-0.02em' }}>
          Stunion
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/tutors" className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
            Browse tutors
          </Link>
          <Link href="/onboard" className="button" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
            Become a tutor
          </Link>
        </div>
      </div>
    </nav>
  );
}
