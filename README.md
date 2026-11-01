# OpenTorrent Catalog (Fixed for Next.js 16)

An open-source, TMDB-powered movie catalog with automatic multi-server streaming and in-browser WebTorrent playback.

## Quick start

```bash
unzip -o ~/Downloads/opentorrent-nextjs-v2.zip -d /tmp/otx
cp -r /tmp/otx/opentorrent/* ~/opentorrent/
cd ~/opentorrent
npm run dev
```

Make sure `.env.local` contains your TMDB API key:
```env
TMDB_API_KEY="your_tmdb_key_here"
NEXT_PUBLIC_TMDB_KEY="your_tmdb_key_here"
```
And ensure Cloudflare WARP (`warp-cli connect`) is active if your ISP blocks `api.themoviedb.org`.
