import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Turnova — Smart Queue Management',
  description:
    'Skip the line. Save your time. Discover nearby clinics, salons, and businesses, join virtual queues, receive digital tokens, and track your turn in real-time.',
  icons: {
    icon: [
      { url: '/turnova-icon.png' },
      { url: '/favicon.png' },
    ],
    apple: '/turnova-icon.png',
  },
  openGraph: {
    title: 'Turnova — Skip the Line. Save Your Time.',
    description: 'Smart Real-Time Queue & Appointment Management Platform',
    siteName: 'Turnova',
    images: ['/turnova-logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f8fbff] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
