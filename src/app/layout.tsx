import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ScheduleProvider } from "@/context/scheduleContext";

const inter = Inter({subsets:["latin"]});

export const metadata: Metadata = {
    title: "Clockhub",
    description: "plataforma de gestion de horarios y calendarios"
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ScheduleProvider>
            {children}
          </ScheduleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}