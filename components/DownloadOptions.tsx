'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DownloadOptions({ movieTitle }: { movieTitle: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('audio') || 'Original';

  const languages = ['Original', 'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'English'];

  const handleLanguageChange = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (lang === 'Original') {
      params.delete('audio'); // Clear param for original language
    } else {
      params.set('audio', lang); // Add ?audio=Telugu
    }
    // Update the URL without scrolling to the top
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const gatewayUrl = `https://shadowmov-reviews.blogspot.com/search?q=${encodeURIComponent(`${movieTitle} ${currentLang !== 'Original' ? currentLang : ''} download`)}`;

  return (
    <div className="mt-8 rounded-xl border border-gray-800 bg-gray-800/50 p-6">
      <h3 className="mb-4 text-sm font-medium text-gray-400">1. Select Audio Language</h3>
      <div className="mb-6 flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              currentLang === lang
                ? 'border-indigo-500 bg-indigo-500 text-white'
                : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <h3 className="mb-4 text-sm font-medium text-gray-400">2. Get Direct File</h3>
      <a
        href={gatewayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition-opacity hover:bg-indigo-500"
      >
        Download / Stream in {currentLang} ➔
      </a>
    </div>
  );
}
