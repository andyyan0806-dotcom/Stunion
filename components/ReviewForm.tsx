'use client';

import { useState } from 'react';

interface ReviewFormProps {
  bookingId: string;
  tutorId: string;
  tutorName: string;
  parentEmail: string;
  onSubmitted: () => void;
}

export function ReviewForm({ bookingId, tutorId, tutorName, parentEmail, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setLoading(true);
    setError(null);

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, tutorId, parentEmail, rating, comment: comment.trim() || undefined }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed to submit review.'); setLoading(false); return; }
    onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e5e7eb', display: 'grid', gap: '0.75rem' }}>
      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Leave a review for {tutorName}</p>

      {/* Star picker */}
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(n)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', padding: '0 0.1rem', color: n <= (hovered || rating) ? '#f59e0b' : '#d1d5db', lineHeight: 1 }}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span style={{ alignSelf: 'center', marginLeft: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
          </span>
        )}
      </div>

      <textarea
        rows={3}
        placeholder="Share your experience (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        maxLength={600}
        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #d1d5db', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
      />

      {error && <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.85rem' }}>{error}</p>}

      <button type="submit" className="button" disabled={loading} style={{ justifySelf: 'start', padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
        {loading ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
