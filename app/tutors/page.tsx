'use client';

import { useEffect, useMemo, useState } from 'react';
import { subjectCategories } from '../../lib/mockData';
import { Tutor } from '../../types';
import { TutorCard } from '../../components/TutorCard';

type LangFilter = 'all' | 'korean' | 'english' | 'both';

export default function TutorsPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [language, setLanguage] = useState<LangFilter>('all');
  const [introCallOnly, setIntroCallOnly] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tutors')
      .then(r => r.json())
      .then(d => { setTutors(d.tutors ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredTutors = useMemo(() => {
    return tutors.filter(t => {
      const matchSubject = selectedSubjects.length === 0 || selectedSubjects.some(s => t.subjects.includes(s));
      const matchLang = language === 'all' || t.language === language || t.language === 'both';
      const matchIntro = !introCallOnly || t.intro_call_enabled;
      return matchSubject && matchLang && matchIntro;
    });
  }, [tutors, selectedSubjects, language, introCallOnly]);

  function toggleSubject(s: string) {
    setSelectedSubjects(cur => cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]);
  }

  function clearAll() {
    setSelectedSubjects([]);
    setLanguage('all');
    setIntroCallOnly(false);
    setOpenCategory(null);
  }

  const hasFilters = selectedSubjects.length > 0 || language !== 'all' || introCallOnly;

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 0.75rem',
    borderRadius: '9999px',
    border: '1px solid',
    borderColor: active ? '#4338ca' : '#d1d5db',
    background: active ? '#4338ca' : 'white',
    color: active ? 'white' : '#374151',
    cursor: 'pointer',
    fontSize: '0.82rem',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Tutor discovery</p>
          <h1 className="section-title">Find a verified tutor for IB, MYP, AP, or college counseling.</h1>
          <p className="subtitle" style={{ marginTop: '0.75rem' }}>
            Every tutor has a manually verified transcript. Filter by subject, language, or intro call availability.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>

          {/* Subject filter — grouped by category */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>
                Subject
                {selectedSubjects.length > 0 && (
                  <span style={{ marginLeft: '0.5rem', background: '#4338ca', color: 'white', borderRadius: '9999px', padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}>
                    {selectedSubjects.length}
                  </span>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {subjectCategories.map(cat => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setOpenCategory(openCategory === cat.category ? null : cat.category)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: openCategory === cat.category ? '#4338ca' : '#d1d5db',
                    background: openCategory === cat.category ? '#eef2ff' : 'white',
                    color: openCategory === cat.category ? '#4338ca' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {cat.category}
                  {selectedSubjects.some(s => cat.groups.flatMap(g => g.subjects).includes(s)) && (
                    <span style={{ marginLeft: '0.4rem', color: '#4338ca' }}>●</span>
                  )}
                </button>
              ))}
            </div>

            {openCategory && (() => {
              const cat = subjectCategories.find(c => c.category === openCategory);
              if (!cat) return null;
              return (
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', display: 'grid', gap: '1rem' }}>
                  {cat.groups.map(group => (
                    <div key={group.label}>
                      {cat.groups.length > 1 && (
                        <p style={{ margin: '0 0 0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {group.label}
                        </p>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {group.subjects.map(s => (
                          <button
                            key={s}
                            type="button"
                            style={chipStyle(selectedSubjects.includes(s))}
                            onClick={() => toggleSubject(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {selectedSubjects.length > 0 && (
              <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {selectedSubjects.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubject(s)}
                    style={{ ...chipStyle(true), display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {s} ✕
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language */}
          <div>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Language</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(['all', 'korean', 'english', 'both'] as LangFilter[]).map(opt => (
                <button key={opt} type="button" style={chipStyle(language === opt)} onClick={() => setLanguage(opt)}>
                  {opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Intro call */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={introCallOnly} onChange={e => setIntroCallOnly(e.target.checked)} style={{ width: '1rem', height: '1rem' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Open to intro call only</span>
            <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>— free 15-min call before first booking</span>
          </label>

          {hasFilters && (
            <button type="button" onClick={clearAll} style={{ background: 'none', border: 'none', color: '#4338ca', cursor: 'pointer', padding: 0, fontSize: '0.9rem', justifySelf: 'start' }}>
              Clear all filters
            </button>
          )}
        </div>

        {/* Results */}
        <div>
          <p style={{ margin: '0 0 0.75rem', color: '#6b7280', fontSize: '0.9rem' }}>
            {loading ? 'Loading tutors…' : `${filteredTutors.length} tutor${filteredTutors.length !== 1 ? 's' : ''} matched`}
          </p>
          {loading ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading…</div>
          ) : filteredTutors.length === 0 ? (
            <div className="card" style={{ padding: '2rem' }}>
              <p style={{ margin: 0, color: '#6b7280' }}>No tutors match the selected filters.</p>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {filteredTutors.map(t => <TutorCard key={t.id} tutor={t} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
