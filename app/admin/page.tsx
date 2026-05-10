'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { getBrowserClient } from '../../lib/supabaseClient';

interface PendingTutor {
  id: string;
  name: string;
  education: string;
  rate: number;
  language: string;
  status: string;
  created_at: string;
}

interface Dispute {
  id: string;
  booking_id: string;
  raised_by: string;
  parent_statement: string;
  status: string;
  created_at: string;
}

interface Metrics {
  verifiedTutors: number;
  pendingApprovals: number;
  gmv: number;
  openDisputes: number;
}

export default function AdminDashboard() {
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [pending, setPending] = useState<PendingTutor[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && role !== 'admin') router.push('/');
  }, [authLoading, role, router]);

  async function authHeaders() {
    const { data: { session } } = await getBrowserClient().auth.getSession();
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token ?? ''}` };
  }

  async function load() {
    const headers = await authHeaders();
    const res = await fetch('/api/admin', { headers });
    const data = await res.json();
    setMetrics(data.metrics ?? null);
    setPending(data.approvals ?? []);
    setDisputes(data.disputes ?? []);
    setLoading(false);
  }

  useEffect(() => { if (role === 'admin') load(); }, [role]);

  async function updateTutorStatus(tutorId: string, status: string) {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ type: 'update-tutor-status', tutorId, status }),
    });
    if (res.ok) {
      setActionMsg(`Tutor ${status === 'verified' ? 'approved' : 'rejected'}.`);
      setPending(cur => cur.filter(t => t.id !== tutorId));
      setTimeout(() => setActionMsg(null), 3000);
    }
  }

  async function resolveDispute(disputeId: string, resolution: string) {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ type: 'resolve-dispute', disputeId, resolution }),
    });
    if (res.ok) {
      setDisputes(cur => cur.filter(d => d.id !== disputeId));
      setActionMsg('Dispute resolved.');
      setTimeout(() => setActionMsg(null), 3000);
    }
  }

  async function createPromoCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({
        type: 'create-promo-code',
        code: fd.get('code'),
        tutorId: fd.get('tutorId') || null,
        freeSessions: Number(fd.get('freeSessions') ?? 5),
      }),
    });
    if (res.ok) {
      setActionMsg(`Promo code created.`);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setActionMsg(null), 3000);
    }
  }

  const metricCards = metrics ? [
    { label: 'Verified tutors', value: metrics.verifiedTutors },
    { label: 'Pending approvals', value: metrics.pendingApprovals },
    { label: 'Platform GMV (completed)', value: `₩${metrics.gmv.toLocaleString()}` },
    { label: 'Open disputes', value: metrics.openDisputes },
  ] : [];

  if (authLoading || role !== 'admin') return null;

  return (
    <main className="container" style={{ padding: '3rem 0 4rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div>
          <p className="tag">Admin console</p>
          <h1 className="section-title">Platform operations</h1>
          <p className="subtitle" style={{ marginTop: '0.75rem' }}>
            Approve tutors, manage promo codes, review disputes, and monitor platform metrics.
          </p>
        </div>

        {actionMsg && (
          <div style={{ padding: '0.85rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', color: '#166534' }}>
            {actionMsg}
          </div>
        )}

        {/* Metrics */}
        {loading ? (
          <p style={{ color: '#6b7280' }}>Loading…</p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {metricCards.map(m => (
              <div key={m.label} className="card" style={{ padding: '1.5rem' }}>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>{m.label}</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '1.75rem', fontWeight: 700 }}>{m.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Approval queue */}
        <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Tutor approval queue</h2>
          {pending.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>No pending applications.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {pending.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{t.name}</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>{t.education} · ₩{t.rate?.toLocaleString()}/hr · {t.language}</p>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>Applied {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => updateTutorStatus(t.id, 'rejected')}
                      style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTutorStatus(t.id, 'verified')}
                      style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promo code creation */}
        <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Create promo code</h2>
          <form onSubmit={createPromoCode} style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', alignItems: 'end' }}>
            <label style={{ display: 'grid', gap: '0.3rem', fontSize: '0.9rem' }}>
              Code
              <input name="code" required placeholder="FOUNDER15" style={formInputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.3rem', fontSize: '0.9rem' }}>
              Tutor ID (optional)
              <input name="tutorId" placeholder="tutor-mina" style={formInputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.3rem', fontSize: '0.9rem' }}>
              Free sessions
              <input name="freeSessions" type="number" defaultValue={5} min={1} max={20} style={formInputStyle} />
            </label>
            <button type="submit" className="button" style={{ alignSelf: 'end' }}>Create</button>
          </form>
        </div>

        {/* Disputes */}
        <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Open disputes</h2>
          {disputes.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>No open disputes.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {disputes.map(d => (
                <div key={d.id} style={{ padding: '1rem', background: '#fff7ed', borderRadius: '0.75rem', border: '1px solid #fed7aa', display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Booking {d.booking_id.slice(0, 8)}…</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#6b7280' }}>Raised by: {d.raised_by}</p>
                    {d.parent_statement && <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#374151' }}>{d.parent_statement}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => resolveDispute(d.id, 'refund_issued')} style={{ padding: '0.45rem 0.85rem', borderRadius: '9999px', border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Issue refund</button>
                    <button type="button" onClick={() => resolveDispute(d.id, 'denied')} style={{ padding: '0.45rem 0.85rem', borderRadius: '9999px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Deny</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const formInputStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '0.6rem',
  border: '1px solid #d1d5db',
  background: 'white',
  width: '100%',
  boxSizing: 'border-box',
};
