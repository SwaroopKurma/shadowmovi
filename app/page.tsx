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

async function getMovies(query?: string): Promise<{ results: Movie[] }> {
  const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) throw new Error('Missing TMDB_API_KEY in .env.local');

  const url = query
    ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    : `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`TMDB HTTP error: ${res.status}`);
  return res.json();
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  let movies: Movie[] = [];
  let errorMsg = '';

  try {
    const data = await getMovies(q);
    movies = data.results ?? [];
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : 'Failed to reach TMDB';
  }

  const heading = q ? `Results for \u201C${q}\u201D` : 'Trending today';

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h1>
        {!errorMsg && (
          <p className="shrink-0 text-sm tabular-nums text-bone/60">{movies.length} titles</p>
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
          <p className="mt-1 text-sm text-bone/60">Check the spelling or try a shorter title.</p>
        </div>
      ) : (
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
      )}
    </main>
  );
}
