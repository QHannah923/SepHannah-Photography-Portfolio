import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SepHannah Studio | Photography Portfolio',
  description: 'Brisbane wedding photography portfolio and social links.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-ink-50 text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
