'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { getBrowserClient } from '../../lib/supabaseClient';
import { subjectCategories } from '../../lib/mockData';

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

export default function SettingsPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  // Account fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Tutor-only fields
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState(80000);
  const [language, setLanguage] = useState('both');
  const [introCall, setIntroCall] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [tutorId, setTutorId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = getBrowserClient();

    supabase.from('users').select('name, phone').eq('id', user.id).maybeSingle().then(({ data }: { data: { name: string; phone: string } | null }) => {
      if (data) { setName(data.name ?? ''); setPhone(data.phone ?? ''); }
    });

    if (role === 'tutor') {
      type TutorRow = { id: string; bio: string; rate: number; language: string; intro_call_enabled: boolean; subjects: string[] };
      supabase.from('tutors').select('*').eq('user_id', user.id).maybeSingle().then(({ data }: { data: TutorRow | null }) => {
        if (!data) return;
        setTutorId(data.id);
        setBio(data.bio ?? '');
        setRate(data.rate ?? 80000);
        setLanguage(data.language ?? 'both');
        setIntroCall(data.intro_call_enabled ?? false);
        setSelectedSubjects(data.subjects ?? []);
      });
    }
  }, [user, role]);

  function toggleSubject(s: string) {
    setSelectedSubjects(cur => cur.includes(s) ? cur.filter(x => x !== s) : cur.length < 5 ? [...cur, s] : cur);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    setMsg(null);
    const supabase = getBrowserClient();

    await supabase.from('users').update({ name, phone }).eq('id', user.id);

    if (role === 'tutor' && tutorId) {
      await supabase.from('tutors').update({ bio, rate, language, intro_call_enabled: introCall, subjects: selectedSubjects }).eq('id', tutorId);
    }

    setMsg({ type: 'success', text: 'Profile saved.' });
    setSaving(false);
  }

  async function updateEmail() {
    if (!newEmail) return;
    setSaving(true);
    const { error } = await getBrowserClient().auth.updateUser({ email: newEmail });
    setMsg(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Confirmation sent to new email.' });
    setNewEmail('');
    setSaving(false);
  }

  async function updatePassword() {
    if (!newPassword) return;
    setSaving(true);
    const { error } = await getBrowserClient().auth.updateUser({ password: newPassword });
    setMsg(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Password updated.' });
    setNewPassword('');
    setSaving(false);
  }

  async function deleteAccount() {
    if (!user) return;
    const supabase = getBrowserClient();
    if (role === 'tutor' && tutorId) {
      await supabase.from('tutors').delete().eq('id', tutorId);
    }
    await supabase.from('users').delete().eq('id', user.id);
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) return null;
  if (!user) return null;

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ maxWidth: '640px', display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Account</p>
          <h1 className="section-title">Settings</h1>
        </div>

        {msg && (
          <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: msg.type === 'success' ? '#166534' : '#b91c1c' }}>{msg.text}</p>
          </div>
        )}

        {/* Profile info */}
        <div className="card" style={{ padding: '1.75rem', display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Profile information</h2>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
            Full name
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
            Phone number
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
          </label>

          {role === 'tutor' && (
            <>
              <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
                Bio <span style={{ fontWeight: 400, color: '#9ca3af' }}>— max 500 characters</span>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <span style={{ fontSize: '0.8rem', color: bio.length >= 450 ? '#dc2626' : '#9ca3af', textAlign: 'right' }}>{bio.length} / 500</span>
              </label>

              <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
                Hourly rate
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="range" min={30000} max={200000} step={5000} value={rate} onChange={e => setRate(Number(e.target.value))} style={{ flex: 1 }} />
                  <span style={{ fontWeight: 700, minWidth: '100px', textAlign: 'right' }}>₩{rate.toLocaleString()}</span>
                </div>
              </label>

              <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
                Teaching language
                <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle}>
                  <option value="korean">Korean</option>
                  <option value="english">English</option>
                  <option value="both">Both (Korean & English)</option>
                </select>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={introCall} onChange={e => setIntroCall(e.target.checked)} style={{ width: '1.1rem', height: '1.1rem' }} />
                Open to 15-minute intro calls
              </label>

              {/* Subjects */}
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>
                  Subjects <span style={{ fontWeight: 400, color: '#9ca3af' }}>— up to 5 · {selectedSubjects.length} / 5 selected</span>
                </p>
                {selectedSubjects.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {selectedSubjects.map(s => (
                      <button key={s} type="button" onClick={() => toggleSubject(s)} style={{ padding: '0.35rem 0.7rem', borderRadius: '9999px', border: 'none', background: '#4338ca', color: 'white', fontSize: '0.82rem', cursor: 'pointer' }}>
                        {s} ✕
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {subjectCategories.map(cat => {
                    const catSubjects = cat.groups.flatMap(g => g.subjects);
                    const hasSelected = selectedSubjects.some(s => catSubjects.includes(s));
                    return (
                      <details key={cat.category} open={hasSelected}>
                        <summary style={{ cursor: 'pointer', fontWeight: 600, padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: '#f8fafc', border: '1px solid #e5e7eb', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{cat.category}{hasSelected && <span style={{ marginLeft: '0.4rem', background: '#4338ca', color: 'white', borderRadius: '9999px', padding: '0.05rem 0.4rem', fontSize: '0.72rem' }}>{selectedSubjects.filter(s => catSubjects.includes(s)).length}</span>}</span>
                          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>▾</span>
                        </summary>
                        <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.6rem', paddingLeft: '0.25rem' }}>
                          {cat.groups.map(group => (
                            <div key={group.label}>
                              {cat.groups.length > 1 && <p style={{ margin: '0 0 0.3rem', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.label}</p>}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                {group.subjects.map(s => {
                                  const active = selectedSubjects.includes(s);
                                  const disabled = !active && selectedSubjects.length >= 5;
                                  return (
                                    <button key={s} type="button" onClick={() => toggleSubject(s)} disabled={disabled}
                                      style={{ padding: '0.35rem 0.7rem', borderRadius: '9999px', border: '1px solid', borderColor: active ? '#4338ca' : '#d1d5db', background: active ? '#4338ca' : 'white', color: active ? 'white' : disabled ? '#9ca3af' : '#374151', fontSize: '0.82rem', cursor: disabled ? 'not-allowed' : 'pointer' }}>
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
              </div>
            </>
          )}

          <button type="button" className="button" onClick={saveProfile} disabled={saving} style={{ justifySelf: 'start' }}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        {/* Email */}
        <div className="card" style={{ padding: '1.75rem', display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Change email</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Current: <strong>{user.email}</strong></p>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
            New email
            <input type="email" placeholder="new@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={inputStyle} />
          </label>
          <button type="button" className="button" onClick={updateEmail} disabled={!newEmail || saving} style={{ justifySelf: 'start' }}>
            Update email
          </button>
        </div>

        {/* Password */}
        <div className="card" style={{ padding: '1.75rem', display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Change password</h2>
          <label style={{ display: 'grid', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>
            New password <span style={{ fontWeight: 400, color: '#9ca3af' }}>— min 8 characters</span>
            <input type="password" minLength={8} placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} />
          </label>
          <button type="button" className="button" onClick={updatePassword} disabled={!newPassword || saving} style={{ justifySelf: 'start' }}>
            Update password
          </button>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ padding: '1.75rem', display: 'grid', gap: '1rem', borderColor: '#fecaca' }}>
          <h2 style={{ margin: 0, fontSize: '1.05rem', color: '#b91c1c' }}>Danger zone</h2>
          {role === 'tutor' && (
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151' }}>
              Deleting your account will permanently remove your tutor profile and all associated data.
            </p>
          )}
          {!showDelete ? (
            <button type="button" onClick={() => setShowDelete(true)} style={{ justifySelf: 'start', padding: '0.6rem 1rem', borderRadius: '0.75rem', border: '1px solid #fecaca', background: 'white', color: '#b91c1c', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              Delete account
            </button>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#b91c1c', fontSize: '0.9rem' }}>Are you sure? This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={deleteAccount} style={{ padding: '0.6rem 1rem', borderRadius: '0.75rem', border: 'none', background: '#b91c1c', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                  Yes, delete my account
                </button>
                <button type="button" onClick={() => setShowDelete(false)} className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
