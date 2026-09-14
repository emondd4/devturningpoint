import { useEffect, useState } from 'react';
import {
  exportProgress,
  getAllPaths,
  getAllTopicProgress,
  getBookmarks,
  importProgress,
  validateProgressImport,
  type LearningPathState,
  type TopicProgress,
} from '../../stores/progress';
import { localePath, type Locale } from '../../i18n/config';
import { tracks } from '../../data/tracks/tracks';

interface Props {
  locale: Locale;
}

export default function MyLearningDashboard({ locale }: Props) {
  const isBn = locale === 'bn';
  const [paths, setPaths] = useState<LearningPathState[]>([]);
  const [topics, setTopics] = useState<TopicProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const reload = async () => {
    setPaths(await getAllPaths());
    setTopics(await getAllTopicProgress());
    setBookmarks(await getBookmarks());
  };

  useEffect(() => {
    reload().catch(() => setMessage(isBn ? 'IndexedDB লোড করা যায়নি।' : 'Could not load IndexedDB progress.'));
  }, [isBn]);

  const onExport = async () => {
    const data = await exportProgress();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devturningpoint-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const validated = validateProgressImport(parsed);
      if (!validated.ok) {
        setMessage(validated.error);
        return;
      }
      const confirmed = window.confirm(
        isBn
          ? 'ইমপোর্ট নিশ্চিত করবেন? বর্তমান প্রগ্রেসের সাথে মার্জ হবে।'
          : 'Confirm import? Data will merge with current progress.',
      );
      if (!confirmed) return;
      await importProgress(validated.data, 'merge');
      await reload();
      setMessage(isBn ? 'ইমপোর্ট সফল।' : 'Import successful.');
    } catch {
      setMessage(isBn ? 'অবৈধ JSON।' : 'Invalid JSON.');
    }
  };

  const completed = topics.filter((t) => t.completed);

  return (
    <div className="space-y-8">
      {message && <p className="text-sm text-[var(--color-ink-muted)]">{message}</p>}

      <section className="surface-card">
        <h2 className="font-semibold text-[var(--color-ink)]">{isBn ? 'সক্রিয় ট্র্যাক' : 'Active tracks'}</h2>
        {paths.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {isBn ? 'এখনো কোনো লার্নিং পাথ নেই। একটি ট্র্যাক assessment দিন।' : 'No learning path yet. Take a track assessment.'}{' '}
            <a href={localePath(locale, 'tracks')}>{isBn ? 'ট্র্যাক দেখুন' : 'Browse tracks'}</a>
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {paths.map((path) => {
              const track = tracks.find((t) => t.id === path.trackId);
              return (
                <li key={path.trackId} className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
                  <p className="font-medium text-[var(--color-ink)]">{track ? (isBn ? track.titleBn : track.title) : path.trackId}</p>
                  <p className="text-sm text-[var(--color-ink-muted)]">
                    {isBn ? 'বর্তমান' : 'Current'}: {path.currentTopicId ?? '—'}
                  </p>
                  {track && (
                    <a className="text-sm" href={localePath(locale, `tracks/${track.slug}`)}>
                      {isBn ? 'ট্র্যাক খুলুন' : 'Open track'}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="surface-card">
        <h2 className="font-semibold text-[var(--color-ink)]">{isBn ? 'সম্পন্ন টপিক' : 'Completed topics'}</h2>
        {completed.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{isBn ? 'এখনো কিছু সম্পন্ন হয়নি।' : 'Nothing completed yet.'}</p>
        ) : (
          <ul className="mt-2 list-disc pl-5 text-sm text-[var(--color-ink-muted)]">
            {completed.map((t) => (
              <li key={t.topicId}>{t.topicId}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card">
        <h2 className="font-semibold text-[var(--color-ink)]">{isBn ? 'বুকমার্ক' : 'Bookmarks'}</h2>
        {bookmarks.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{isBn ? 'কোনো বুকমার্ক নেই।' : 'No bookmarks yet.'}</p>
        ) : (
          <ul className="mt-2 list-disc pl-5 text-sm text-[var(--color-ink-muted)]">
            {bookmarks.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card">
        <h2 className="font-semibold text-[var(--color-ink)]">{isBn ? 'এক্সপোর্ট / ইমপোর্ট' : 'Export / Import'}</h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          {isBn ? 'ডিভাইস বদলালে JSON নিয়ে যান। ইমপোর্ট করা JSON কখনো execute হয় না।' : 'Move progress between devices with JSON. Imported JSON is never executed.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn btn-secondary" onClick={onExport}>
            {isBn ? 'এক্সপোর্ট' : 'Export'}
          </button>
          <label className="btn btn-ghost cursor-pointer">
            {isBn ? 'ইমপোর্ট' : 'Import'}
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => onImport(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
