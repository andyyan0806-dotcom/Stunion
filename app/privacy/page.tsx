export default function PrivacyPolicyPage() {
  return (
    <main className="container" style={{ padding: '3rem 0 5rem', maxWidth: '720px' }}>
      <h1 className="section-title">Privacy Policy</h1>
      <p style={{ color: '#6b7280', marginTop: '0.5rem', marginBottom: '2.5rem' }}>
        Effective date: May 10, 2026 · 개인정보처리방침 (PIPA-compliant)
      </p>

      <div style={{ display: 'grid', gap: '2rem', lineHeight: 1.8, color: '#374151' }}>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>1. 개인정보 수집 항목 및 목적 (Data Collected and Purpose)</h2>
          <p>Stunion collects the following personal information:</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginTop: '0.75rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#111827' }}>Category</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#111827' }}>Items</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#111827' }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Account', 'Email, password (hashed)', 'Authentication and account management'],
                ['Tutor profile', 'Name, phone, education, bio, photo, transcripts, test scores', 'Profile display and credential verification'],
                ['Booking', 'Parent email, phone, student name, session details', 'Booking processing and communication'],
                ['Payment', 'Transaction amount, payout amount, withholding', 'Payment processing and tax compliance'],
                ['Usage', 'IP address, browser type, pages visited', 'Service improvement and security monitoring'],
              ].map(([cat, items, purpose]) => (
                <tr key={cat}>
                  <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid #f3f4f6', verticalAlign: 'top', fontWeight: 500 }}>{cat}</td>
                  <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid #f3f4f6', verticalAlign: 'top', color: '#6b7280' }}>{items}</td>
                  <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid #f3f4f6', verticalAlign: 'top' }}>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>2. 개인정보 보유 및 이용 기간 (Retention Period)</h2>
          <p>
            Personal data is retained for as long as your account is active. Upon account deletion, data is permanently
            deleted within 30 days, except where retention is required by Korean law:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Transaction records: 5 years (전자상거래 등에서의 소비자보호에 관한 법률)</li>
            <li>Tax withholding records: 5 years (국세기본법)</li>
            <li>User complaint records: 3 years</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>3. 개인정보 제3자 제공 (Third-Party Sharing)</h2>
          <p>
            Stunion does not sell personal data. Data is shared only with:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li><strong>Supabase Inc.</strong> — database and file storage (US, under DPA)</li>
            <li><strong>PortOne / Iamport</strong> — payment processing (Korea)</li>
            <li><strong>Resend / SendGrid</strong> — transactional email</li>
            <li><strong>National Tax Service (국세청)</strong> — withholding tax remittance as required by law</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>4. 정보주체의 권리 (Your Rights)</h2>
          <p>Under the Personal Information Protection Act (개인정보보호법), you have the right to:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Access the personal data Stunion holds about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal retention requirements)</li>
            <li>Withdraw consent for optional data processing</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            To exercise these rights, contact <a href="mailto:andyyan0806@gmail.com" style={{ color: '#4338ca' }}>andyyan0806@gmail.com</a>. We respond within 10 business days.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>5. 파일 업로드 보안 (File Storage Security)</h2>
          <p>
            Tutor credential documents (transcripts, test scores) are stored in a private Supabase Storage bucket with
            no public URL. Access is restricted to Stunion admin only. Profile photos are stored in a public bucket
            solely for display on tutor profile pages.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>6. 쿠키 및 자동 수집 (Cookies)</h2>
          <p>
            Stunion uses session cookies necessary for authentication. No third-party advertising cookies are used.
            Analytics data (if PostHog is enabled) is collected in aggregate and does not identify individual users.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>7. 개인정보 보호책임자 (Privacy Officer)</h2>
          <p>
            Privacy Officer: Gyubin An<br />
            Email: <a href="mailto:andyyan0806@gmail.com" style={{ color: '#4338ca' }}>andyyan0806@gmail.com</a><br />
            You may also file a complaint with the Personal Information Protection Commission (개인정보보호위원회) at{' '}
            <span style={{ color: '#6b7280' }}>www.pipc.go.kr</span>.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', color: '#111827' }}>8. 변경 사항 고지 (Policy Updates)</h2>
          <p>
            Material changes to this policy will be notified by email at least 7 days before taking effect. The
            effective date at the top of this page reflects the most recent update.
          </p>
        </section>

      </div>
    </main>
  );
}
