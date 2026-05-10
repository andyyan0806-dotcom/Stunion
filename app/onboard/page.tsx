import Link from 'next/link';

export default function TutorOnboardPage() {
  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Tutor onboarding</p>
          <h1 className="section-title">Create your verified tutor profile and start receiving bookings.</h1>
          <p className="subtitle" style={{ marginTop: '1rem' }}>
            Submit your transcript, official test scores, and teaching demo. We manually review every profile for trust and verification.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', display: 'grid', gap: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Onboarding steps</h2>
            <ol style={{ marginTop: '1rem', paddingLeft: '1.2rem', color: '#374151', lineHeight: 1.8 }}>
              <li>Sign up with email and Korean phone number</li>
              <li>Upload university transcript and official test scores</li>
              <li>Record a 60–90 second teaching demo video</li>
              <li>Set your hourly rate and select supported subjects</li>
              <li>Sign the independent contractor agreement</li>
            </ol>
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>MVP policies</h2>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.2rem', color: '#374151', lineHeight: 1.8 }}>
              <li>Hourly rate capped at 200,000 won</li>
              <li>Profile goes live after manual review</li>
              <li>Verification status: Pending → Under Review → Verified</li>
              <li>10% platform fee and 3.3% withholding tax disclosure</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/tutors" className="button secondary">
              Browse tutor marketplace
            </Link>
            <button className="button">Start onboarding</button>
          </div>
        </div>
      </div>
    </main>
  );
}
