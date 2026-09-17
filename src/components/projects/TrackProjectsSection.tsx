import { useEffect, useMemo, useState } from 'react';
import {
  getAllProjectProgress,
  getAllTopicProgress,
  type ProjectProgress,
  type ProjectStatus,
} from '../../stores/progress';
import { localePath, type Locale } from '../../i18n/config';
import { levelLabel, type ProjectCardModel } from '../../data/projects/catalog';
import { learnPathForId } from '../../utils/topic-links';
import { masterGraph } from '../../data/skill-graphs/master-graph';

interface Props {
  locale: Locale;
  trackId: string;
  projects: ProjectCardModel[];
}

function statusLabel(status: ProjectStatus | undefined, isBn: boolean): string {
  if (status === 'COMPLETED') return isBn ? 'সম্পন্ন' : 'Completed';
  if (status === 'IN_PROGRESS') return isBn ? 'চলমান' : 'In progress';
  return isBn ? 'শুরু হয়নি' : 'Not started';
}

function actionLabel(status: ProjectStatus | undefined, isBn: boolean): string {
  if (status === 'COMPLETED') return isBn ? 'রিভিউ' : 'Review';
  if (status === 'IN_PROGRESS') return isBn ? 'চালিয়ে যান' : 'Continue';
  return isBn ? 'শুরু' : 'Start';
}

function roleLabel(role: ProjectCardModel['projectRole'], isBn: boolean): string {
  if (role === 'market-alternative') return isBn ? 'Market Alternative' : 'Market Alternative';
  return isBn ? 'Core' : 'Core';
}

export default function TrackProjectsSection({ locale, trackId, projects }: Props) {
  const isBn = locale === 'bn';
  const [progressMap, setProgressMap] = useState<Record<string, ProjectProgress>>({});
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [anyway, setAnyway] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const [rows, topics] = await Promise.all([getAllProjectProgress(), getAllTopicProgress()]);
        const map: Record<string, ProjectProgress> = {};
        for (const row of rows) map[row.projectId] = row;
        setProgressMap(map);
        setCompletedTopics(new Set(topics.filter((t) => t.completed).map((t) => t.topicId)));
      } catch {
        /* ignore */
      }
    })();
  }, [trackId]);

  const skillTitle = useMemo(() => {
    const map = new Map(masterGraph.nodes.map((n) => [n.id, n.title]));
    return (id: string) => map.get(id) ?? id;
  }, []);

  const levels = useMemo(() => {
    const order = ['beginner', 'intermediate', 'advanced'] as const;
    return order
      .map((level) => {
        const atLevel = projects.filter((p) => p.level === level);
        const core = atLevel.filter((p) => p.projectRole === 'core');
        const market = atLevel.filter((p) => p.projectRole === 'market-alternative');
        // AI track: multiple cores per level — show all
        const cards = trackId === 'ai-framework' ? atLevel : [...core, ...market];
        return { level, cards };
      })
      .filter((row) => row.cards.length > 0);
  }, [projects, trackId]);

  if (levels.length === 0) return null;

  const renderCard = (project: ProjectCardModel) => {
    const status = progressMap[project.id]?.status;
    const needsWarning =
      !anyway[project.id] &&
      status !== 'IN_PROGRESS' &&
      status !== 'COMPLETED' &&
      project.relatedTopicIds.length > 0 &&
      !project.relatedTopicIds.some((id) => completedTopics.has(id));

    return (
      <article key={project.id} className="surface-card">
        <div className="flex flex-wrap gap-2">
          <span className="badge">{levelLabel(project.level, isBn)}</span>
          <span className="badge">{roleLabel(project.projectRole, isBn)}</span>
          <span className="badge">{statusLabel(status, isBn)}</span>
          <span className="badge">{project.estimatedHours}h</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-[var(--color-ink)]">{project.title}</h3>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{project.summary}</p>
        <p className="mt-2 text-xs text-[var(--color-ink-subtle)]">
          {isBn ? 'স্কিল' : 'Skills'}: {project.learningOutcomeSkillIds.map(skillTitle).join(' · ')}
        </p>
        {project.marketRelevance && (
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            <strong>{isBn ? 'মার্কেট প্রাসঙ্গিকতা' : 'Market relevance'}:</strong> {project.marketRelevance}
          </p>
        )}
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          <strong>{isBn ? 'পোর্টফোলিও ভ্যালু' : 'Portfolio value'}:</strong> {project.portfolioPitch}
        </p>

        {needsWarning ? (
          <div className="callout callout-warning mt-4">
            <p className="font-semibold text-[var(--color-ink)]">
              {isBn ? 'পূর্বশর্ত অসম্পূর্ণ হতে পারে' : 'Prerequisites may be incomplete'}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink-muted)]">
              {project.relatedTopicIds.slice(0, 5).map((topicId) => {
                const href = learnPathForId(locale, topicId);
                return <li key={topicId}>{href ? <a href={href}>{topicId}</a> : topicId}</li>;
              })}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn"
                onClick={() => setAnyway((prev) => ({ ...prev, [project.id]: true }))}
              >
                {isBn ? 'তবুও শুরু করুন' : 'Start Anyway'}
              </button>
              <a className="btn btn-primary" href={localePath(locale, `projects/${project.slug}`)}>
                {isBn ? 'পূর্বশর্ত দেখুন' : 'View prerequisites'}
              </a>
            </div>
          </div>
        ) : (
          <a className="btn btn-primary mt-4 inline-flex" href={localePath(locale, `projects/${project.slug}`)}>
            {actionLabel(status, isBn)}
          </a>
        )}
      </article>
    );
  };

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-[var(--color-ink)]">
        {isBn ? 'প্রজেক্ট-ভিত্তিক শেখা' : 'Project-Based Learning'}
      </h2>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        {trackId === 'ai-framework'
          ? isBn
            ? 'প্রতি লেভেলে একাধিক AI প্রজেক্ট। সবগুলো শেষ করতে হবে না।'
            : 'Multiple AI projects per level. You do not need to complete every project.'
          : isBn
            ? 'প্রতি লেভেলে Core এবং Market Alternative। সবগুলো শেষ করতে হবে না।'
            : 'Each level: Core + Market Alternative. You do not need to complete every project.'}
      </p>

      <div className="mt-6 space-y-8">
        {levels.map((row, index) => (
          <div key={row.level}>
            {index > 0 && (
              <div className="mb-4 flex justify-center text-[var(--color-ink-subtle)]" aria-hidden="true">
                ↓
              </div>
            )}
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">{levelLabel(row.level, isBn)}</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">{row.cards.map(renderCard)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
