import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hospital Management System',
  description: 'Patient and Doctor Management Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 min-h-screen text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}