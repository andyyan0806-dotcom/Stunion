import type { Metadata } from 'next';
import Link from 'next/link';
import '../styles/globals.css';
import { Nav } from '../components/Nav';
import { AuthProvider } from '../components/AuthProvider';

export const metadata: Metadata = {
  title: 'Stunion',
  description: 'Verified SAT, IB, and AP tutors for international school families in Korea.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <Nav />
          {children}
          <footer style={{ borderTop: '1px solid #e5e7eb', marginTop: '4rem', padding: '1.5rem 0' }}>
            <div className="container" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>© 2026 Stunion</span>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <Link href="/tos" style={{ fontSize: '0.85rem', color: '#6b7280' }}>Terms of Service</Link>
                <Link href="/privacy" style={{ fontSize: '0.85rem', color: '#6b7280' }}>Privacy Policy</Link>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
