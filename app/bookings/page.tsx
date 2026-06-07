'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Tutor } from '../../types';

const DURATION_OPTIONS = [
  { label: '60 min', value: 60 },
  { label: '90 min', value: 90 },
  { label: '120 min', value: 120 },
];

export default function BookingPage() {
  const [tutorId, setTutorId] = useState('');
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [duration, setDuration] = useState(60);
  const [promoCode, setPromoCode] = useState('');
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState('');
  const [submittedStudentName, setSubmittedStudentName] = useState('');
  const [submittedSenderName, setSubmittedSenderName] = useState('');
  const [notified, setNotified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('tutorId') ?? '';
    setTutorId(id);
    if (id) {
      fetch(`/api/tutors/${encodeURIComponent(id)}`)
        .then(r => r.json())
        .then(d => { if (d.tutor) setTutor(d.tutor); })
        .catch(() => {});
    }
  }, []);

  const grossAmount = tutor ? Math.round(tutor.rate * (duration / 60)) : 0;
  const fee = promoValid ? 0 : Math.round(grossAmount * 0.07);
  const tutorGross = grossAmount - fee;
  const withholding = Math.round(tutorGross * 0.033);
  const tutorNet = tutorGross - withholding;

  async function checkPromo() {
    if (!promoCode.trim()) return;
    const res = await fetch(`/api/promo-codes?code=${encodeURIComponent(promoCode.trim())}`);
    setPromoValid(res.ok);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tutorId) { setError('No tutor selected.'); return; }
    if (!tosAccepted) { setError('You must accept the Terms of Service to continue.'); return; }
    setLoading(true);
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      tutorId,
      parentEmail: data.get('parentEmail'),
      parentPhone: data.get('parentPhone'),
      studentName: data.get('studentName'),
      senderName: data.get('senderName'),
      bookingDate: data.get('bookingDate'),
      durationMinutes: duration,
      locationPreference: data.get('location'),
      subjectFocus: data.get('subjectFocus'),
      amount: grossAmount,
      promoCode: promoValid ? promoCode.trim() : undefined,
    };

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) { setError(result.error || 'Unable to create booking.'); setLoading(false); return; }
    setSubmittedBookingId(result.booking?.id ?? '');
    setSubmittedStudentName(String(data.get('studentName') ?? ''));
    setSubmittedSenderName(String(data.get('senderName') ?? ''));
    setSubmitted(true);
  }

  async function notifySent() {
    if (!submittedBookingId) return;
    await fetch(`/api/bookings/${submittedBookingId}/notify`, { method: 'POST' });
    setNotified(true);
  }

  if (submitted && tutor) {
    const bankName    = process.env.NEXT_PUBLIC_BANK_NAME    ?? '';
    const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? '';
    const bankHolder  = process.env.NEXT_PUBLIC_BANK_HOLDER  ?? '';

    const bankRows = [
      { label: '은행', value: bankName },
      { label: '계좌번호', value: bankAccount },
      { label: '예금주', value: bankHolder },
      { label: '송금 금액', value: `₩${grossAmount.toLocaleString()}` },
      { label: '송금자 이름', value: submittedSenderName },
      { label: '송금 메모', value: `${submittedStudentName} / ${tutor.name}` },
    ];

    return (
      <main className="container" style={{ padding: '3rem 0 4rem' }}>
        <div style={{ maxWidth: '520px', display: 'grid', gap: '1.5rem' }}>
          <div>
            <p className="tag">Payment required</p>
            <h1 className="section-title">Complete your payment</h1>
            <p className="subtitle" style={{ marginTop: '0.5rem' }}>
              Booking request sent to <strong>{tutor.name}</strong>. Transfer the session fee to confirm your spot.
            </p>
          </div>

          {/* Warning */}
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#b91c1c', fontSize: '0.9rem' }}>⚠️ 주의 / Important</p>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.875rem', color: '#991b1b', lineHeight: 1.6 }}>
              아래 계좌로만 송금해 주세요. 다른 계좌로 보낸 경우 예약이 확정되지 않으며, 리뷰 및 별점을 남기실 수 없습니다.<br />
              <span style={{ color: '#6b7280' }}>Payment must go to the account below only. Payments to any other account will not be recognized — your booking will not be confirmed and you will not be able to leave a review or rating (리뷰/별점).</span>
            </p>
          </div>

          {/* Bank transfer details */}
          <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>토스 송금</p>
            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
              {bankRows.map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.4rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280', flexShrink: 0 }}>{row.label}</span>
                  <strong style={{ textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</strong>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.6rem', padding: '0.75rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#c2410c', fontWeight: 600 }}>
                송금 시 &apos;보내는 분 이름(송금자명)&apos;을 본인의 실명(계좌명)으로 설정해 주세요.
              </p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#9a3412' }}>
                Set the sender name to your real name (실명) so we can match your payment.
              </p>
            </div>
          </div>


          {/* Review warning — repeated at action point */}
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '0.85rem 1rem' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#b91c1c', fontWeight: 700 }}>
              ⚠️ 위 계좌로 송금하지 않으면 리뷰 및 별점(⭐)을 남기실 수 없습니다.
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#991b1b' }}>
              Reviews and ratings are only unlocked after your payment is verified.
            </p>
          </div>

          {/* Sent button */}
          {notified ? (
            <div style={{ padding: '1rem 1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#16a34a' }}>✔ 송금 완료 알림이 전송되었습니다</p>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#15803d' }}>
                입금 확인 후 예약이 확정됩니다. 확정 시 이메일로 안내드립니다.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={notifySent}
              className="button"
              style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
            >
              송금 완료 / Sent! →
            </button>
          )}

          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
            문의: andyyan0806@gmail.com
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem', maxWidth: '560px' }}>
        <div>
          <p className="tag">Booking request</p>
          <h1 className="section-title">Request a tutoring session</h1>
          {tutor && (
            <p className="subtitle" style={{ marginTop: '0.75rem' }}>
              Booking with <strong>{tutor.name}</strong> · ₩{tutor.rate.toLocaleString()}/hr
            </p>
          )}
        </div>

        <form className="card" style={{ padding: '2rem', display: 'grid', gap: '1.5rem' }} onSubmit={handleSubmit}>
          <label style={labelStyle}>
            Parent email
            <input type="email" name="parentEmail" required placeholder="you@example.com" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Parent phone
            <input type="tel" name="parentPhone" required placeholder="010-1234-5678" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Child&apos;s name
            <input name="studentName" type="text" required placeholder="Student name" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            송금자 이름 <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85rem' }}>(이체 시 표시되는 본인 실명)</span>
            <input name="senderName" type="text" required placeholder="홍길동" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Desired date and time
            <input name="bookingDate" type="datetime-local" required style={inputStyle} />
          </label>

          <div>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Duration</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid',
                    borderColor: duration === opt.value ? '#4338ca' : '#d1d5db',
                    background: duration === opt.value ? '#eef2ff' : 'white',
                    color: duration === opt.value ? '#4338ca' : '#374151',
                    fontWeight: duration === opt.value ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label style={labelStyle}>
            Location preference
            <select name="location" required style={inputStyle}>
              <option value="online">Online (Zoom / Google Meet)</option>
              <option value="offline">Offline (in person)</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label style={labelStyle}>
            Subject focus and notes
            <textarea name="subjectFocus" rows={3} placeholder="e.g. IB HL Math AA Paper 2 — integration by parts" style={{ ...inputStyle, resize: 'vertical' }} />
          </label>

          {/* Promo code */}
          <div>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Promo code <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.85rem' }}>(optional)</span></p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="e.g. FOUNDER15"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); setPromoValid(null); }}
                style={{ ...inputStyle, flex: 1, marginTop: 0 }}
              />
              <button type="button" className="button secondary" onClick={checkPromo} style={{ padding: '0 1rem', whiteSpace: 'nowrap' }}>
                Apply
              </button>
            </div>
            {promoValid === true && <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#16a34a' }}>✔ Promo applied — platform fee waived</p>}
            {promoValid === false && <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#b91c1c' }}>Invalid or expired promo code</p>}
          </div>

          {/* Fee breakdown */}
          {grossAmount > 0 && (
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 0.6rem', fontWeight: 600, fontSize: '0.9rem' }}>Fee breakdown</p>
              <div style={{ display: 'grid', gap: '0.3rem', fontSize: '0.9rem' }}>
                {[
                  { label: 'Session amount', value: `₩${grossAmount.toLocaleString()}` },
                  { label: promoValid ? 'Platform fee (waived)' : 'Platform fee (7%)', value: promoValid ? '₩0' : `−₩${fee.toLocaleString()}` },
                  { label: 'Withholding tax (3.3%)', value: `−₩${withholding.toLocaleString()}` },
                  { label: 'Tutor net payout', value: `₩${tutorNet.toLocaleString()}`, bold: true },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <span style={{ color: '#6b7280' }}>{row.label}</span>
                    <span style={{ fontWeight: row.bold ? 700 : 400 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: '0.6rem 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>
                You pay ₩{grossAmount.toLocaleString()} upfront. Held in escrow until you confirm the session completed.
              </p>
            </div>
          )}

          {/* ToS acceptance */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
            <input
              type="checkbox"
              checked={tosAccepted}
              onChange={e => setTosAccepted(e.target.checked)}
              style={{ marginTop: '0.15rem', width: '1rem', height: '1rem', flexShrink: 0 }}
            />
            <span>
              I have read and agree to the{' '}
              <a href="/tos" target="_blank" rel="noopener noreferrer" style={{ color: '#4338ca' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#4338ca' }}>Privacy Policy</a>.
            </span>
          </label>

          {error && <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>}

          <button type="submit" className="button" disabled={loading || grossAmount === 0 || !tosAccepted}>
            {loading ? 'Submitting…' : `Submit request${grossAmount > 0 ? ` — ₩${grossAmount.toLocaleString()}` : ''}`}
          </button>
        </form>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = { display: 'grid', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '0.25rem',
  padding: '0.85rem',
  borderRadius: '0.75rem',
  border: '1px solid #d1d5db',
  background: 'white',
  boxSizing: 'border-box',
  fontSize: '1rem',
};
