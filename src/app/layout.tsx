import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ScheduleProvider } from '@/context/scheduleContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: 'ClockHub',
  description: 'Panel de control de horarios',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='es' className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <ScheduleProvider>{children}</ScheduleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
