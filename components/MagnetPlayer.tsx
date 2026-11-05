'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  tmdbId: string;
  imdbId?: string;
  magnet?: string;
  title?: string;
}

// Cleaned up server list: prioritizing 2Embed and regional-friendly alternatives
const SERVERS = [
  { id: '2embed', name: 'Server 1 (2Embed)', getUrl: (tmdb: string) => `https://www.2embed.cc/embed/${tmdb}` },
  { id: 'yapgrid', name: 'Server 2 (YapGrid)', getUrl: (tmdb: string) => `https://yapgrid.com/embed/movie/${tmdb}` },
  { id: 'superembed', name: 'Server 3 (SuperEmbed)', getUrl: (tmdb: string) => `https://multiembed.mov/?video_id=${tmdb}&tmdb=1` },
  { id: 'embedsu', name: 'Server 4 (Embed.su)', getUrl: (tmdb: string) => `https://embed.su/embed/movie/${tmdb}` }
];

export default function MagnetPlayer({ tmdbId, imdbId, magnet, title }: Props) {
  // Defaulting to 2Embed
  const [activeServer, setActiveServer] = useState<string>(SERVERS[0].id);
  const [customMagnet, setCustomMagnet] = useState(magnet || '');
  const [status, setStatus] = useState('Ready to stream via WebTorrent.');
  const [stats, setStats] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (magnet) setCustomMagnet(magnet);
  }, [magnet]);

  useEffect(() => {
    const i = setInterval(() => {
      const t = clientRef.current?.torrents?.[0];
      if (t) {
        setStats(
          `Peers: ${t.numPeers} · ${(t.downloadSpeed / 1024).toFixed(0)} KB/s · ${(t.progress * 100).toFixed(1)}%`
        );
      }
    }, 1000);
    return () => clearInterval(i);
  }, []);

  const startTorrent = (mag: string) => {
    if (!mag || !videoRef.current) return;
    const w = window as any;
    if (!w.WebTorrent) {
      setStatus('WebTorrent library still loading...');
      return;
    }

    clientRef.current?.destroy();
    const client = new w.WebTorrent();
    clientRef.current = client;
    setFiles([]);
    setStatus('Connecting to WebRTC peers...');

    client.add(mag, (torrent: any) => {
      const vids = torrent.files.filter((f: any) => /\.(mp4|webm|mkv|mov)$/i.test(f.name));
      setFiles(vids);
      if (vids[0]) {
        setStatus(`Streaming: ${vids[0].name}`);
        vids[0].renderTo(videoRef.current, { autoplay: true });
      } else {
        setStatus('No playable video file found in this torrent.');
      }
    });

    client.on('error', (err: any) => setStatus(`Torrent Error: ${err.message}`));
  };

  useEffect(() => {
    if (activeServer === 'torrent' && customMagnet) {
      startTorrent(customMagnet);
    }
    return () => {
      if (clientRef.current) {
        try {
          clientRef.current.destroy();
        } catch (e) {
          // Ignore already destroyed errors
        }
      }
    };
  }, [activeServer]);

  const currentEmbed = SERVERS.find((s) => s.id === activeServer);
  const encodedTitle = encodeURIComponent(title || 'movie');

  return (
    <div className="w-full bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {SERVERS.map((server) => (
            <button
              key={server.id}
              onClick={() => setActiveServer(server.id)}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeServer === server.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {server.name}
            </button>
          ))}
          <button
            onClick={() => setActiveServer('torrent')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeServer === 'torrent'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            WebTorrent (P2P)
          </button>
        </div>

        {/* Redirect Download Links */}
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://filepursuit.com/search/${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs hover:bg-emerald-600/30 font-semibold flex items-center gap-1"
          >
            📥 Download MP4 (External Mirror)
          </a>
          {customMagnet && (
            <button
              onClick={() => navigator.clipboard.writeText(customMagnet)}
              className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-xs hover:bg-gray-700"
            >
              Copy Magnet
            </button>
          )}
        </div>
      </div>

      {currentEmbed && (
        <div className="space-y-2">
<iframe
  key={currentEmbed.id}
  src={currentEmbed.getUrl(tmdbId)}
  className="absolute inset-0 w-full h-full border-0"
  allowFullScreen
  sandbox="allow-scripts allow-same-origin allow-presentation"
/>          <p className="text-xs text-gray-400">
            Tip: Click <strong>📥 Download MP4 (External Mirror)</strong> above to open a direct file-search indexer where you can grab pre-rendered MP4/MKV downloads.
          </p>
        </div>
      )}

      {activeServer === 'torrent' && (
        <div className="space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startTorrent(customMagnet);
            }}
            className="flex gap-2"
          >
            <input
              value={customMagnet}
              onChange={(e) => setCustomMagnet(e.target.value)}
              placeholder={`Magnet link for "${title}"...`}
              className="flex-grow px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-semibold text-white"
            >
              Load Magnet
            </button>
          </form>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{status}</span>
            <span>{stats}</span>
          </div>
          <video ref={videoRef} controls className="w-full aspect-video bg-black rounded-lg" />
          {files.length > 1 && (
            <div className="space-y-1 pt-2">
              <p className="text-xs text-gray-400 font-semibold">Files in torrent:</p>
              {files.map((f: any, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    setStatus(`Streaming: ${f.name}`);
                    f.renderTo(videoRef.current, { autoplay: true });
                  }}
                  className="block text-left text-xs text-blue-400 hover:underline truncate w-full"
                >
                  ▶ {f.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
