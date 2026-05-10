'use client';

import { useEffect, useState } from 'react';
import { Review } from '../types';

interface ReviewsSectionProps {
  tutorId: string;
  rating: number;
  reviewCount: number;
}

export function ReviewsSection({ tutorId, rating, reviewCount }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews?tutorId=${encodeURIComponent(tutorId)}`)
      .then(r => r.json())
      .then(d => { setReviews(d.reviews ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tutorId]);

  function stars(n: number) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Reviews</h2>
        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{rating} ★</span>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>({reviewCount} reviews)</span>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280', margin: 0 }}>Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>No reviews yet. Reviews appear after completed sessions.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {reviews.map(review => (
            <div key={review.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.5rem' }}>
                <span style={{ color: '#f59e0b', fontSize: '1rem' }}>{stars(review.rating)}</span>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                  {new Date(review.created_at).toLocaleDateString('en-KR', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              {review.comment && (
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#374151', lineHeight: 1.6 }}>{review.comment}</p>
              )}
              {review.response && (
                <div style={{ marginTop: '0.75rem', paddingLeft: '0.75rem', borderLeft: '2px solid #4338ca' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#4338ca', fontWeight: 600 }}>Tutor response</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#374151' }}>{review.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
