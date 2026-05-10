'use client';

'use client';

import { FormEvent, useEffect, useState } from 'react';

export default function BookingPage() {
  const [tutorId, setTutorId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTutorId(new URLSearchParams(window.location.search).get('tutorId') ?? '');
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      tutorId,
      parentEmail: formData.get('parentEmail')?.toString() ?? '',
      parentPhone: formData.get('parentPhone')?.toString() ?? '',
      studentName: formData.get('studentName')?.toString() ?? '',
      bookingDate: formData.get('bookingDate')?.toString() ?? '',
      durationMinutes: Number(formData.get('duration')),
      locationPreference: formData.get('location')?.toString() ?? '',
      subjectFocus: formData.get('subjectFocus')?.toString() ?? '',
      amount: Number(formData.get('amount')),
    };

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || 'Unable to create booking.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Booking request</p>
          <h1 className="section-title">Request a tutoring session</h1>
          <p className="subtitle" style={{ marginTop: '1rem' }}>
            Submit a booking request with date, duration, subject focus, and location preference. Payment is held in escrow until session completion.
          </p>
        </div>

        {submitted ? (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ margin: 0 }}>Booking submitted</h2>
            <p style={{ marginTop: '0.75rem', color: '#374151' }}>
              Your request is sent to the tutor for approval. You will receive an email and SMS when they respond.
            </p>
          </div>
        ) : (
          <form className="card" style={{ padding: '2rem', display: 'grid', gap: '1.5rem' }} onSubmit={handleSubmit}>
            {tutorId && (
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem' }}>
                <p style={{ margin: 0 }}>
                  Booking request for tutor ID: <strong>{tutorId}</strong>
                </p>
              </div>
            )}
            <label>
              Parent email
              <input type="email" name="parentEmail" placeholder="you@example.com" required style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
            </label>
            <label>
              Parent phone
              <input type="tel" name="parentPhone" placeholder="010-1234-5678" required style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
            </label>
            <label>
              Child’s name
              <input name="studentName" type="text" placeholder="Student name" required style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
            </label>
            <label>
              Amount (won)
              <input name="amount" type="number" placeholder="100000" required style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
            </label>
            <label>
              Desired date and time
              <input name="bookingDate" type="datetime-local" required style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
            </label>
            <label>
              Duration (minutes)
              <select name="duration" required style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}>
                <option value="">Select duration</option>
                <option value="60">60</option>
                <option value="90">90</option>
                <option value="120">120</option>
              </select>
            </label>
            <label>
              Location preference
              <select name="location" required style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label>
              Focus notes
              <textarea name="subjectFocus" required rows={4} placeholder="Explain the lesson focus or problem areas" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} />
            </label>
            {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="button">
                Submit booking request
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
