import Link from 'next/link';

const metrics = [
  { label: 'Verified tutors', value: '25' },
  { label: 'Monthly revenue (10% take)', value: '1,120,000 won' },
  { label: 'Pending approvals', value: '6' },
  { label: 'Open disputes', value: '2' },
];

export default function AdminDashboard() {
  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Admin console</p>
          <h1 className="section-title">Platform operations and review queue.</h1>
          <p className="subtitle" style={{ marginTop: '1rem' }}>
            Approve tutors, review transactions, manage disputes, and trigger payouts manually until automation is ready.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {metrics.map((metric) => (
            <div key={metric.label} className="card" style={{ padding: '1.5rem' }}>
              <p style={{ margin: 0, color: '#6b7280' }}>{metric.label}</p>
              <p style={{ margin: '0.75rem 0 0 0', fontSize: '1.75rem', fontWeight: 700 }}>{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>Tutor approval queue</h2>
            <Link href="/tutors" className="button secondary">
              Review tutors
            </Link>
          </div>
          <p style={{ marginTop: '1rem', color: '#4b5563' }}>
            This page represents the admin review workflow for manual verification and approval.
          </p>
        </div>
      </div>
    </main>
  );
}
