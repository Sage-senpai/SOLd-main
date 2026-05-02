import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SOLd. — Driver Hub, Campaigns & Admin',
  description: 'The operational app for the SOLd. decentralized sales guild on Solana.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Unbounded:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-sold-gray-900 text-sold-gray-100">{children}</body>
    </html>
  );
}
