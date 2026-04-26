import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ScheduleProvider } from '@/context/scheduleContext';
import './globals.css';

export const metadata = {
  title: 'ClockHub',
  description: 'Panel de control de horarios',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='es'>
      <body>
        <AuthProvider>
          <ScheduleProvider>{children}</ScheduleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
