'use client';

import { useState, useEffect } from 'react';
import { subjectCategories } from '../../lib/mockData';
import { getBrowserClient } from '../../lib/supabaseClient';

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.85rem',
  borderRadius: '0.75rem',
  border: '1px solid #d1d5db',
  background: 'white',
  boxSizing: 'border-box',
  fontSize: '1rem',
};

export default function TutorOnboardPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState(80000);
  const [introCall, setIntroCall] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getBrowserClient().auth.getSession().then(({ data }: { data: { session: { user: { id: string } } | null } }) => {
      if (data.session?.user?.id) setUserId(data.session.user.id);
    });
  }, []);

  function toggleSubject(s: string) {
    setSelectedSubjects(cur =>
      cur.includes(s) ? cur.filter(x => x !== s) : cur.length < 5 ? [...cur, s] : cur
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) { setError('You must agree to the contractor agreement to continue.'); return; }
    if (selectedSubjects.length === 0) { setError('Select at least one subject.'); return; }
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set('subjects', JSON.stringify(selectedSubjects));
    fd.set('bio', bio);
    fd.set('rate', String(rate));
    fd.set('intro_call_enabled', String(introCall));
    if (userId) fd.set('user_id', userId);

    const res = await fetch('/api/tutors', { method: 'POST', body: fd });
    const json = await res.json();
    if (!res.ok) { setError(json.error || 'Submission failed. Please try again.'); setLoading(false); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="container" style={{ padding: '3rem 0 4rem' }}>
        <div className="card" style={{ padding: '2rem', maxWidth: '520px' }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Application submitted</h1>
          <p style={{ marginTop: '0.75rem', color: '#374151', lineHeight: 1.7 }}>
            Your profile is under review. We manually verify every transcript and test score within 48 hours. You will receive an email once your profile is approved and live.
          </p>
          <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #bbf7d0' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#166534' }}>
              Status: <strong>Pending → Under Review → Verified → Active</strong>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ maxWidth: '640px', display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Tutor onboarding</p>
          <h1 className="section-title">Create your verified tutor profile.</h1>
          <p className="subtitle" style={{ marginTop: '1rem' }}>
            Upload your transcript and test scores. Every profile is manually reviewed before going live. Platform fee is 10% per session; 3.3% withholding disclosed at payment.
          </p>
        </div>

        <form className="card" style={{ padding: '2rem', display: 'grid', gap: '2rem' }} onSubmit={handleSubmit}>

          {/* Contact */}
          <section style={{ display: 'grid', gap: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Contact information</h2>
            <label style={{ display: 'grid', gap: '0.4rem' }}>
              Email
              <input name="email" type="email" required placeholder="you@university.edu" style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.4rem' }}>
              Korean phone number
              <input name="phone" type="tel" required placeholder="010-1234-5678" style={inputStyle} />
            </label>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Photo */}
          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Profile photo</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Head-and-shoulders, clear face. Required for profile activation.</p>
            <input name="photo" type="file" accept="image/*" required style={{ fontSize: '0.9rem' }} />
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Credentials */}
          <section style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Verified credentials</h2>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>Reviewed within 48h. PDF or clear photo of the official document.</p>
            </div>
            <label style={{ display: 'grid', gap: '0.4rem' }}>
              University transcript
              <input name="transcript" type="file" accept=".pdf,image/*" required style={{ fontSize: '0.9rem' }} />
            </label>
            <label style={{ display: 'grid', gap: '0.4rem' }}>
              Official test scores (SAT score report / IB results / AP score report)
              <input name="score_doc" type="file" accept=".pdf,image/*" required style={{ fontSize: '0.9rem' }} />
            </label>
            <label style={{ display: 'grid', gap: '0.4rem' }}>
              University / school (as shown on transcript)
              <input name="education" type="text" required placeholder="e.g. Yonsei University, Applied Mathematics" style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.4rem' }}>
              Score summary (shown on profile)
              <input name="scores" type="text" placeholder="e.g. IB 45, SAT 1570" style={inputStyle} />
            </label>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Bio */}
          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Bio <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.9rem' }}>— max 500 characters</span></h2>
            <div>
              <textarea
                rows={4}
                maxLength={500}
                required
                placeholder="Describe your teaching approach and relevant experience."
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: bio.length >= 450 ? '#dc2626' : '#9ca3af', textAlign: 'right' }}>
                {bio.length} / 500
              </p>
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Subjects */}
          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Subjects <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.9rem' }}>— up to 5</span></h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>{selectedSubjects.length} / 5 selected</p>
            </div>

            {selectedSubjects.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {selectedSubjects.map(s => (
                  <button key={s} type="button" onClick={() => toggleSubject(s)} style={{ padding: '0.35rem 0.7rem', borderRadius: '9999px', border: 'none', background: '#4338ca', color: 'white', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {s} ✕
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
              {subjectCategories.map(cat => {
                const catSubjects = cat.groups.flatMap(g => g.subjects);
                const hasSelected = selectedSubjects.some(s => catSubjects.includes(s));
                return (
                  <details key={cat.category} open={hasSelected}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600, padding: '0.6rem 0.75rem', borderRadius: '0.5rem', background: '#f8fafc', border: '1px solid #e5e7eb', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        {cat.category}
                        {hasSelected && <span style={{ marginLeft: '0.5rem', background: '#4338ca', color: 'white', borderRadius: '9999px', padding: '0.05rem 0.45rem', fontSize: '0.72rem' }}>{selectedSubjects.filter(s => catSubjects.includes(s)).length}</span>}
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>▾</span>
                    </summary>
                    <div style={{ marginTop: '0.6rem', display: 'grid', gap: '0.75rem', paddingLeft: '0.25rem' }}>
                      {cat.groups.map(group => (
                        <div key={group.label}>
                          {cat.groups.length > 1 && (
                            <p style={{ margin: '0 0 0.35rem', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {group.label}
                            </p>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {group.subjects.map(s => {
                              const active = selectedSubjects.includes(s);
                              const disabled = !active && selectedSubjects.length >= 5;
                              return (
                                <button key={s} type="button" onClick={() => toggleSubject(s)} disabled={disabled} style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', border: '1px solid', borderColor: active ? '#4338ca' : '#d1d5db', background: active ? '#4338ca' : 'white', color: active ? 'white' : disabled ? '#9ca3af' : '#374151', fontSize: '0.82rem', cursor: disabled ? 'not-allowed' : 'pointer' }}>
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Rate */}
          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Hourly rate</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range"
                min={30000}
                max={200000}
                step={5000}
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontWeight: 700, fontSize: '1.15rem', minWidth: '110px', textAlign: 'right' }}>
                ₩{rate.toLocaleString()}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
              After 10% platform fee and 3.3% withholding, you receive ₩{Math.round(rate * 0.9 * 0.967).toLocaleString()} net per hour.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Language */}
          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Teaching language</h2>
            <select name="language" required style={inputStyle}>
              <option value="">Select…</option>
              <option value="korean">Korean</option>
              <option value="english">English</option>
              <option value="both">Both (Korean & English)</option>
            </select>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Intro call */}
          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>15-minute intro call</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>
              Offer parents a free 15-min call before their first booking. You get an "Intro call" badge on your profile which increases booking rate. You provide the Zoom / Google Meet link.
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={introCall}
                onChange={e => setIntroCall(e.target.checked)}
                style={{ width: '1.1rem', height: '1.1rem' }}
              />
              <span>I'm open to 15-minute intro calls before a first booking</span>
            </label>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Promo code */}
          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Promo code <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.9rem' }}>(optional)</span></h2>
            <input name="promo_code" type="text" placeholder="e.g. FOUNDER15" style={inputStyle} />
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
              Founder tutors receive code FOUNDER15 — waives the 10% platform fee on your first 5 sessions.
            </p>
          </section>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: 0 }} />

          {/* Agreement */}
          <section style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e5e7eb', display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1rem' }}>Independent Contractor Agreement</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: 1.75 }}>
              By checking the box below, I agree to operate as an independent contractor on Stunion. I understand that Stunion charges a 10% transaction fee per session and that 3.3% withholding tax (원천징수) will be deducted from my gross payout on the platform's behalf per Korean tax law. Payout is released within 48 hours of parent session confirmation. Stunion issues a withholding receipt for my tax filing.
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: '0.2rem', width: '1.1rem', height: '1.1rem', flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.9rem' }}>I agree to the independent contractor terms above.</span>
            </label>
          </section>

          {error && <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p>}

          <button type="submit" className="button" disabled={loading} style={{ justifySelf: 'start' }}>
            {loading ? 'Submitting…' : 'Submit application'}
          </button>
        </form>
      </div>
    </main>
  );
}
