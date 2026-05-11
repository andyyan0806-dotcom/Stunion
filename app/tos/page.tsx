export default function TermsOfServicePage() {
  return (
    <main className="container" style={{ padding: '3rem 0 5rem', maxWidth: '720px' }}>
      <h1 className="section-title">Terms of Service</h1>
      <p style={{ color: '#6b7280', marginTop: '0.5rem', marginBottom: '2.5rem' }}>
        Effective date: May 10, 2026 · Stunion (operated under parent's 사업자등록)
      </p>

      <div style={{ display: 'grid', gap: '2rem', lineHeight: 1.8, color: '#374151' }}>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>1. Platform Description</h2>
          <p>
            Stunion is an online marketplace that connects parents at international schools in Korea with verified tutors
            for SAT, IB, and AP exam preparation. Stunion is not a tutoring service; it is a platform that facilitates
            introductions and payments between independent tutor contractors and parent clients.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>2. Independent Contractor Relationship</h2>
          <p>
            Tutors listed on Stunion are independent contractors, not employees or agents of Stunion. Stunion does not
            supervise, direct, or control the content of tutoring sessions. Parents contract directly with tutors for
            educational services. Stunion bears no liability for the outcome of any tutoring session.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>3. Platform Fee</h2>
          <p>
            Stunion charges a 10% transaction fee on each completed session, deducted from the tutor's gross payment.
            Parents pay the tutor's listed rate in full. The fee structure is disclosed on every tutor profile and at
            checkout. Tutors holding a valid FOUNDER15 promo code have the platform fee waived on their first 5 sessions.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>4. Tax Withholding</h2>
          <p>
            In accordance with Korean tax law (소득세법), Stunion withholds 3.3% of each tutor's gross payout as income
            withholding tax (원천징수) and remits it to the National Tax Service on the tutor's behalf. A withholding
            receipt (원천징수영수증) is issued for tutor tax filing purposes.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>5. Payment Escrow</h2>
          <p>
            Parent payments are held in escrow until the parent confirms the session was completed. Tutor payout is
            released within 48 hours of confirmation. If no confirmation is received within 7 days of the scheduled
            session date, payout is released automatically.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>6. Refunds and Disputes</h2>
          <p>
            Parents may raise a dispute within 24 hours of a completed session. Stunion reviews disputes manually and
            may issue a full or partial refund at its sole discretion. Refunds are not guaranteed. Sessions cancelled
            more than 24 hours before the scheduled time are fully refunded. Cancellations within 24 hours are
            non-refundable unless both parties agree.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>7. Tutor Credential Verification</h2>
          <p>
            Stunion manually reviews university transcripts and test score documents submitted during tutor onboarding.
            A "Verified" badge indicates that Stunion has reviewed the submitted documents and found them consistent
            with the tutor's stated credentials. Stunion does not guarantee the authenticity of any document and is not
            liable for fraudulent submissions.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>8. Prohibited Conduct</h2>
          <p>Users may not:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Exchange personal contact information (phone, KakaoTalk, email) through the platform to circumvent the booking system.</li>
            <li>Submit fraudulent credentials during onboarding.</li>
            <li>Harass, threaten, or defame other users.</li>
            <li>Use the platform for any purpose other than legitimate tutoring arrangements.</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            Violations may result in immediate account suspension and forfeiture of pending payouts.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by Korean law, Stunion's total liability to any user for any claim arising
            out of or relating to these terms or the platform shall not exceed the total platform fees paid by that user
            in the three months preceding the claim.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Republic of Korea. Disputes shall be submitted to the
            jurisdiction of the Seoul Central District Court as the court of first instance.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>11. Changes to These Terms</h2>
          <p>
            Stunion may update these Terms at any time. Users will be notified by email at least 7 days before material
            changes take effect. Continued use of the platform after the effective date constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>12. Contact</h2>
          <p>
            For questions about these Terms, contact: <a href="mailto:andyyan0806@gmail.com" style={{ color: '#4338ca' }}>andyyan0806@gmail.com</a>
          </p>
        </section>

      </div>
    </main>
  );
}
