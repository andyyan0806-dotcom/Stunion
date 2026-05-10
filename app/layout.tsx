import type { Metadata } from 'next';
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
        </AuthProvider>
      </body>
    </html>
  );
}
