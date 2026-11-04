import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Sans } from 'next/font/google';
import Link from 'next/link';
import { Suspense } from 'react';
import './globals.css';
import Script from 'next/script';
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
  title: 'Shadow-Movi',
  description: 'Open-source movie streaming platform with instant & WebTorrent playback',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
	<head>
  <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='12188543',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
  <Script src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js" strategy="afterInteractive" />
</head>
    <body className="min-h-screen font-body">
        <header className="sticky top-0 z-20 border-b border-line bg-ink">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-ui font-display text-lg font-semibold tracking-tight transition-colors hover:text-leader"
            >
              <span aria-hidden className="size-3 rounded-[2px] bg-leader" />
              Shadow-Movi
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
