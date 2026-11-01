import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Sans } from 'next/font/google';
import Link from 'next/link';
import { Suspense } from 'react';
import './globals.css';
import SearchBar from '../components/SearchBar';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OpenTorrent Catalog',
  description: 'Open-source movie catalog with instant & WebTorrent streaming',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js" defer />
      </head>
      <body className="min-h-screen font-body">
        <header className="sticky top-0 z-20 border-b border-line bg-ink">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-ui font-display text-lg font-semibold tracking-tight transition-colors hover:text-leader"
            >
              <span aria-hidden className="size-3 rounded-[2px] bg-leader" />
              opentorrent
            </Link>
            <Suspense fallback={<div className="h-10 w-full max-w-sm" />}>
              <SearchBar />
            </Suspense>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
