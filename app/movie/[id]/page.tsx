import Link from 'next/link';
import MagnetPlayer from '../../../components/MagnetPlayer';

export const dynamic = 'force-dynamic';

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tmdbId } = await params;
  const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_KEY;

  let movie: any = null;
  let magnet = '';
  let errorMsg = '';

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&append_to_response=external_ids`,
      { cache: 'no-store' }
    );
    movie = await res.json();
    if (movie.success === false) {
      errorMsg = movie.status_message || 'Invalid TMDB API Key';
    }
  } catch (err: any) {
    errorMsg = `TMDB fetch failed (${err.message}). Make sure warp-cli is connected.`;
  }

  const imdbId = movie?.external_ids?.imdb_id;

  if (imdbId) {
    try {
      const torRes = await fetch(`https://torrentio.strem.fun/stream/movie/${imdbId}.json`, {
        cache: 'no-store',
      });
      const torData = await torRes.json();
      const best =
        torData.streams?.find((s: any) => /1080p/i.test(s.name || s.title)) ||
        torData.streams?.[0];

      if (best?.infoHash) {
        const trackers = [
          'wss://tracker.openwebtorrent.com',
          'wss://tracker.btorrent.xyz',
          'udp://tracker.opentrackr.org:1337/announce',
          'udp://open.stealth.si:80/announce',
        ]
          .map((t) => `&tr=${encodeURIComponent(t)}`)
          .join('');
        magnet = `magnet:?xt=urn:btih:${best.infoHash}&dn=${encodeURIComponent(movie?.title || 'movie')}${trackers}`;
      }
    } catch {
      // Fallback to iframe streaming if Torrentio is unreachable
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-gray-400 hover:text-white mb-6 inline-block font-semibold">
        ← Back to Catalog
      </Link>

      {errorMsg ? (
        <div className="p-6 bg-red-900/30 border border-red-700 rounded-xl text-red-300 mb-6">
          <strong>Error:</strong> {errorMsg}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {movie?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-56 rounded-xl shadow-lg self-start"
            />
          )}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">{movie?.title}</h1>
            <p className="text-gray-400 text-sm">
              {movie?.release_date} {movie?.vote_average ? `· ⭐ ${movie.vote_average.toFixed(1)}` : ''}
            </p>
            <p className="text-gray-400 italic">{movie?.tagline}</p>
            <p className="text-gray-300 max-w-2xl leading-relaxed">{movie?.overview}</p>
          </div>
        </div>
      )}

      <MagnetPlayer tmdbId={tmdbId} imdbId={imdbId} magnet={magnet} title={movie?.title || 'Movie'} />
    </div>
  );
}
