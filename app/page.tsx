import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

const LANGUAGES = [
  { code: 'all', label: 'Global' },
  { code: 'te', label: 'Telugu' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'kn', label: 'Kannada' },
  { code: 'en', label: 'English' }
];

async function getMovies(query?: string, lang?: string, page: number = 1): Promise<{ results: Movie[], total_pages: number }> {
  const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) throw new Error('Missing TMDB_API_KEY in .env.local');

  let url = '';
  
  if (query) {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
  } else if (lang && lang !== 'all') {
    // strictly filters to movies originally produced in the selected language
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=${lang}&sort_by=popularity.desc&page=${page}`;
  } else {
    url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
  }

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`TMDB HTTP error: ${res.status}`);
  return res.json();
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; lang?: string; page?: string }> }) {
  const { q, lang, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentLang = lang || 'all';
  
  let movies: Movie[] = [];
  let totalPages = 1;
  let errorMsg = '';

  try {
    const data = await getMovies(q, currentLang, currentPage);
    movies = data.results ?? [];
    totalPages = data.total_pages ?? 1;
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : 'Failed to reach TMDB';
  }

  const heading = q ? `Results for \u201C${q}\u201D` : 'Discover Movies';

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (currentLang !== 'all') params.set('lang', currentLang);
    params.set('page', newPage.toString());
    return `/?${params.toString()}`;
  };

  const maxPages = totalPages > 500 ? 500 : totalPages;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-line pb-6">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h1>
          {!errorMsg && (
            <p className="shrink-0 text-sm tabular-nums text-bone/60">{movies.length} titles</p>
          )}
        </div>
        
        {/* Embedded Language Selector Tabs */}
        {!q && (
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Link
                key={l.code}
                href={l.code === 'all' ? '/' : `/?lang=${l.code}`}
                className={`rounded-ui border px-4 py-1.5 text-sm font-medium transition-colors ${
                  currentLang === l.code 
                    ? 'border-leader bg-leader text-ink' 
                    : 'border-line bg-surface text-leader hover:bg-line/20'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {errorMsg ? (
        <div role="alert" className="rounded-ui border border-line bg-panel p-6">
          <p className="font-medium">Could not load titles from TMDB.</p>
          <p className="mt-1 text-sm text-bone/60">
            {errorMsg}. Run <code className="rounded-ui border border-line px-1.5 py-0.5">warp-cli connect</code> in
            your terminal, then refresh the page.
          </p>
        </div>
      ) : movies.length === 0 ? (
        <div className="rounded-ui border border-line bg-panel p-6">
          <p className="font-medium">No titles match your search.</p>
          <p className="mt-1 text-sm text-bone/60">Check the spelling or try a different filter.</p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
              <li key={movie.id}>
                <Link href={`/movie/${movie.id}`} className="group block rounded-ui">
                  <div className="overflow-hidden rounded-ui border border-line bg-panel transition-colors group-hover:border-leader group-active:translate-y-px">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={500}
                        height={750}
                        sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="aspect-[2/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] w-full items-center justify-center p-4 text-center text-sm text-bone/50">
                        No poster
                      </div>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm font-medium transition-colors group-hover:text-leader">
                    {movie.title}
                  </p>
                  <div className="mt-0.5 flex items-center justify-between text-xs tabular-nums text-bone/60">
                    <span>{movie.release_date?.slice(0, 4) || 'TBA'}</span>
                    {movie.vote_average ? <span>{movie.vote_average.toFixed(1)}</span> : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {maxPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              {currentPage > 1 ? (
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  className="rounded-ui border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-line/20 text-leader"
                >
                  Previous
                </Link>
              ) : (
                <div className="rounded-ui border border-line/40 bg-surface/50 px-4 py-2 text-sm font-medium text-bone/30 cursor-not-allowed">
                  Previous
                </div>
              )}
              
              <span className="text-sm font-medium text-bone/60">
                Page {currentPage} of {maxPages}
              </span>
              
              {currentPage < maxPages ? (
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  className="rounded-ui border border-leader bg-leader px-4 py-2 text-sm font-medium text-ink transition-colors hover:opacity-90"
                >
                  Next Page ➔
                </Link>
              ) : (
                <div className="rounded-ui border border-line/40 bg-surface/50 px-4 py-2 text-sm font-medium text-bone/30 cursor-not-allowed">
                  Next Page ➔
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
