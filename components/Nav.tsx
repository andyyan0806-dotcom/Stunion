'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { getBrowserClient } from '../lib/supabaseClient';

export function Nav() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await getBrowserClient().auth.signOut();
    setOpen(false);
    router.push('/login');
    router.refresh();
  }

  const authLinks = !loading && (
    <>
      {user ? (
        <>
          {(role === 'tutor' || role === 'admin') && (
            <Link href="/dashboard" className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }} onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          )}
          {role === 'admin' && (
            <Link href="/admin" className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }} onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}
          {role === 'parent' && (
            <Link href="/my-bookings" className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }} onClick={() => setOpen(false)}>
              My bookings
            </Link>
          )}
          <Link href="/settings" className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }} onClick={() => setOpen(false)}>
            Settings
          </Link>
          <button type="button" onClick={handleLogout} className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
            Log out
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }} onClick={() => setOpen(false)}>
            Log in
          </Link>
          <Link href="/login?tab=signup" className="button" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }} onClick={() => setOpen(false)}>
            Sign up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 0' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.15rem', color: '#4338ca', letterSpacing: '-0.02em' }}>
            Stunion
          </Link>

          {/* Desktop nav */}
          <div className="nav-links">
            <Link href="/tutors" className="button secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
              Browse tutors
            </Link>
            {authLinks}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span style={{ transform: open ? 'rotate(45deg) translate(5px, 5px)' : undefined }} />
            <span style={{ opacity: open ? 0 : 1 }} />
            <span style={{ transform: open ? 'rotate(-45deg) translate(5px, -5px)' : undefined }} />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`nav-drawer ${open ? 'open' : ''}`}>
          <Link href="/tutors" className="button secondary" style={{ padding: '0.75rem 1rem' }} onClick={() => setOpen(false)}>
            Browse tutors
          </Link>
          {authLinks}
        </div>
      </div>
    </nav>
  );
}
