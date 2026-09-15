import { useEffect, useState } from 'react';
import { getPath } from '../../stores/progress';
import { localePath, type Locale } from '../../i18n/config';
import { learnPathForId } from '../../utils/topic-links';

interface Props {
  locale: Locale;
  trackId: string;
  trackSlug: string;
}

export default function ContinueLearningCard({ locale, trackId, trackSlug }: Props) {
  const [path, setPath] = useState<Awaited<ReturnType<typeof getPath>>>();
  const [ready, setReady] = useState(false);
  const isBn = locale === 'bn';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const value = await getPath(trackId);
        if (!cancelled) setPath(value);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [trackId]);

  if (!ready || !path?.currentTopicId) return null;

  const lastDate = path.lastVisitedAt ? new Date(path.lastVisitedAt).toLocaleString(locale === 'bn' ? 'bn-BD' : 'en-US') : '';

  const continueHref = path.currentTopicId ? learnPathForId(locale, path.currentTopicId) : undefined;

  return (
    <div className="surface-card border-[var(--color-accent)]" role="region" aria-label={isBn ? 'শেখা চালিয়ে যান' : 'Continue learning'}>
      <p className="font-semibold text-[var(--color-ink)]">
        {isBn ? 'যেখানে থেমেছিলেন সেখান থেকে চালিয়ে যাবেন?' : 'Continue where you left off?'}
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        {path.currentTopicId}
        {path.currentSection ? ` · ${path.currentSection}` : ''}
        {lastDate ? ` · ${lastDate}` : ''}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {continueHref ? (
          <a className="btn btn-primary" href={continueHref}>
            {isBn ? 'চালিয়ে যান' : 'Continue'}
          </a>
        ) : (
          <a className="btn btn-primary" href={localePath(locale, `tracks/${trackSlug}`)}>
            {isBn ? 'ট্র্যাক দেখুন' : 'View track'}
          </a>
        )}
        <a className="btn btn-secondary" href={localePath(locale, `tracks/${trackSlug}`)}>
          {isBn ? 'রোডম্যাপ' : 'View roadmap'}
        </a>
        <a className="btn btn-ghost" href={localePath(locale, `tracks/${trackSlug}/assessment`)}>
          {isBn ? 'Assessment' : 'Assessment'}
        </a>
      </div>
    </div>
  );
}
