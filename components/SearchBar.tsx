'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

function SearchForm({ initial }: { initial: string }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(term ? `/?q=${encodeURIComponent(term)}` : '/');
      }}
      className="flex w-full max-w-sm gap-2"
    >
      <label htmlFor="q" className="sr-only">
        Search movies
      </label>
      <input
        id="q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search movies"
        autoComplete="off"
        className="h-10 min-w-0 flex-1 rounded-ui border border-line bg-panel px-3 text-sm text-bone transition-colors placeholder:text-bone/40 hover:border-bone/30 focus:border-leader"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded-ui border border-leader bg-leader px-4 text-sm font-semibold text-ink transition-colors hover:bg-transparent hover:text-leader active:translate-y-px"
      >
        Search
      </button>
    </form>
  );
}

export default function SearchBar() {
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  // key resets the input whenever the URL query changes (e.g. clicking the wordmark)
  return <SearchForm key={initial} initial={initial} />;
}
