import { useEffect, useState } from 'react';
import { withBase, type Locale } from '../../i18n/config';

interface Props {
  locale: Locale;
}

interface SearchResult {
  url: string;
  excerpt: string;
  meta?: { title?: string };
}

export default function SearchUI({ locale }: Props) {
  const isBn = locale === 'bn';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'missing' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Pagefind is generated at build time into dist; in preview/prod it is available under base.
        const pagefindUrl = withBase('/pagefind/pagefind.js');
        // @ts-expect-error pagefind is injected at runtime after build
        const pagefind = await import(/* @vite-ignore */ pagefindUrl);
        await pagefind.init();
        if (!cancelled) {
          (window as unknown as { __pagefind?: unknown }).__pagefind = pagefind;
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('missing');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      const pagefind = (window as unknown as { __pagefind?: { search: (q: string) => Promise<{ results: { data: () => Promise<SearchResult> }[] }> } }).__pagefind;
      if (!pagefind) return;
      setStatus('loading');
      try {
        const response = await pagefind.search(query);
        const data = await Promise.all(response.results.slice(0, 20).map((r) => r.data()));
        setResults(data);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    }, 200);
    return () => window.clearTimeout(handle);
  }, [query]);

  return (
    <div>
      <label htmlFor="site-search" className="sr-only">
        {isBn ? 'সার্চ' : 'Search'}
      </label>
      <input
        id="site-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={isBn ? 'টপিক, ক্যারিয়ার, কোম্পানি…' : 'Topics, careers, companies…'}
        className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
      />
      {status === 'missing' && (
        <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
          {isBn
            ? 'Search index এখনো তৈরি হয়নি। `pnpm build` এর পর preview করুন।'
            : 'Search index not available yet. Run `pnpm build` then preview.'}
        </p>
      )}
      {status === 'loading' && <p className="mt-3 text-sm text-[var(--color-ink-subtle)]">{isBn ? 'খোঁজা হচ্ছে…' : 'Searching…'}</p>}
      {query && results.length === 0 && status === 'ready' && (
        <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{isBn ? 'কোনো ফলাফল নেই।' : 'No results found.'}</p>
      )}
      <ul className="mt-4 space-y-3">
        {results.map((result) => (
          <li key={result.url} className="surface-card">
            <a href={result.url} className="font-medium text-[var(--color-ink)] no-underline">
              {result.meta?.title ?? result.url}
            </a>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]" dangerouslySetInnerHTML={{ __html: result.excerpt }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
