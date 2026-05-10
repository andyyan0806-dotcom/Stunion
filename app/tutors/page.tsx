'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { subjects } from '../../lib/mockData';
import { Tutor } from '../../types';
import { TutorCard } from '../../components/TutorCard';

export default function TutorsPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [language, setLanguage] = useState<'all' | 'korean' | 'english' | 'both'>('all');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTutors() {
      const response = await fetch('/api/tutors');
      const data = await response.json();
      setTutors(data.tutors ?? []);
      setLoading(false);
    }

    loadTutors();
  }, []);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchesSubject =
        selectedSubjects.length === 0 || selectedSubjects.some((subject) => tutor.subjects.includes(subject));
      const matchesLanguage =
        language === 'all' || tutor.language === language || tutor.language === 'both';
      return matchesSubject && matchesLanguage;
    });
  }, [tutors, selectedSubjects, language]);

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Tutor discovery</p>
          <h1 className="section-title">Find a verified tutor for SAT, IB, or AP support.</h1>
          <p className="subtitle" style={{ marginTop: '1rem' }}>
            Filter by subject, hourly rate, and language support to match your child’s needs.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem', alignItems: 'start' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Filters</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Subject</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      className="button secondary"
                      style={{ padding: '0.65rem 0.9rem', borderRadius: '9999px' }}
                      onClick={() =>
                        setSelectedSubjects((current) =>
                          current.includes(subject)
                            ? current.filter((item) => item !== subject)
                            : [...current, subject]
                        )
                      }
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Language</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {['all', 'korean', 'english', 'both'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="button secondary"
                      style={{ padding: '0.65rem 0.9rem', borderRadius: '9999px' }}
                      onClick={() => setLanguage(option as typeof language)}
                    >
                      {option === 'all' ? 'All' : option === 'both' ? 'Both' : option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p style={{ margin: '0 0 0.75rem 0', color: '#6b7280' }}>
              {loading ? 'Loading tutors...' : `${filteredTutors.length} tutors matched.`}
            </p>
            {loading ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>Loading tutors…</div>
            ) : (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {filteredTutors.length === 0 ? (
                  <div className="card" style={{ padding: '2rem' }}>
                    <p style={{ margin: 0 }}>No tutors match the selected filters yet.</p>
                  </div>
                ) : (
                  filteredTutors.map((tutor) => (
                    <div key={tutor.id}>
                      <TutorCard tutor={tutor} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
