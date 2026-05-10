'use client';

import { useState } from 'react';

interface IntroCallFormProps {
  tutorId: string;
  tutorName: string;
}

export function IntroCallForm({ tutorId, tutorName }: IntroCallFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      tutorId,
      parentEmail: data.get('parentEmail'),
      parentPhone: data.get('parentPhone'),
      preferredTimes: data.get('preferredTimes'),
      subjectFocus: data.get('subjectFocus'),
      discussionNotes: data.get('discussionNotes'),
    };

    const res = await fetch('/api/intro-calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error || 'Request failed.'); setLoading(false); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ padding: '1.25rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #bbf7d0' }}>
        <p style={{ margin: 0, fontWeight: 600, color: '#166534' }}>Intro call requested</p>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: '#166534' }}>
          {tutorName} will respond with a Zoom/Meet link within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          type="button"
          className="button secondary"
          onClick={() => setOpen(true)}
          style={{ width: '100%' }}
        >
          Request 15-min intro call (free)
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'grid', gap: '1rem', padding: '1.25rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Request a free 15-min intro call</p>
            <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.1rem' }}>✕</button>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
            Free, no commitment. {tutorName} will accept and share a Zoom or Google Meet link within 48 hours.
          </p>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem' }}>
            Your email
            <input name="parentEmail" type="email" required placeholder="you@example.com" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem' }}>
            Your phone (Korean number)
            <input name="parentPhone" type="tel" required placeholder="010-1234-5678" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem' }}>
            Preferred times (e.g. weekday evenings, Saturday morning)
            <input name="preferredTimes" type="text" required placeholder="Weekday evenings KST" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem' }}>
            Subject focus
            <input name="subjectFocus" type="text" placeholder="e.g. IB HL Math AA, Paper 2" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem' }}>
            What do you want to discuss?
            <textarea name="discussionNotes" rows={3} placeholder="e.g. My child is scoring 5 and needs to reach 7 before May exams" style={{ ...inputStyle, resize: 'vertical' }} />
          </label>
          {error && <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Sending…' : 'Send request'}
          </button>
        </form>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '0.6rem',
  border: '1px solid #d1d5db',
  background: 'white',
  width: '100%',
  boxSizing: 'border-box',
};
