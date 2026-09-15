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
  if (status === 'COMPLETED') return isBn ? 'রিভিউ প্রজেক্ট' : 'Review Project';
  if (status === 'IN_PROGRESS') return isBn ? 'চালিয়ে যান' : 'Continue Project';
  return isBn ? 'প্রজেক্ট শুরু' : 'Start Project';
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

  const ordered = useMemo(
    () =>
      (['beginner', 'intermediate', 'advanced'] as const)
        .map((level) => projects.find((p) => p.level === level))
        .filter((p): p is ProjectCardModel => Boolean(p)),
    [projects],
  );

  if (ordered.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-[var(--color-ink)]">
        {isBn ? 'প্রজেক্ট-ভিত্তিক শেখা' : 'Project-Based Learning'}
      </h2>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        {isBn
          ? 'বিগিনার → ইন্টারমিডিয়েট → অ্যাডভান্সড। প্রতিটি প্রজেক্ট পোর্টফোলিও প্রমাণ তৈরি করে।'
          : 'Beginner → Intermediate → Advanced. Each project produces portfolio evidence.'}
      </p>

      <div className="mt-6 space-y-4">
        {ordered.map((project, index) => {
          const status = progressMap[project.id]?.status;
          const needsWarning =
            !anyway[project.id] &&
            status !== 'IN_PROGRESS' &&
            status !== 'COMPLETED' &&
            project.relatedTopicIds.length > 0 &&
            !project.relatedTopicIds.some((id) => completedTopics.has(id));

          return (
            <div key={project.id}>
              {index > 0 && (
                <div className="my-2 flex justify-center text-[var(--color-ink-subtle)]" aria-hidden="true">
                  ↓
                </div>
              )}
              <article className="surface-card">
                <div className="flex flex-wrap gap-2">
                  <span className="badge">{levelLabel(project.level, isBn)}</span>
                  <span className="badge">{statusLabel(status, isBn)}</span>
                  <span className="badge">{project.estimatedHours}h</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[var(--color-ink)]">{project.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{project.summary}</p>
                <p className="mt-2 text-xs text-[var(--color-ink-subtle)]">
                  {isBn ? 'স্কিল' : 'Skills'}: {project.learningOutcomeSkillIds.map(skillTitle).join(' · ')}
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                  <strong>{isBn ? 'পোর্টফোলিও ভ্যালু' : 'Portfolio value'}:</strong> {project.portfolioPitch}
                </p>
                <p className="mt-2 text-xs text-[var(--color-ink-subtle)]">
                  {isBn ? 'পূর্বশর্ত প্রস্তুতি' : 'Prerequisite readiness'}:{' '}
                  {needsWarning
                    ? isBn
                      ? 'টপিক অসম্পূর্ণ'
                      : 'Topics incomplete'
                    : isBn
                      ? 'প্রস্তুত / সতর্কতা স্বীকৃত'
                      : 'Ready / warning acknowledged'}
                </p>

                {needsWarning ? (
                  <div className="callout callout-warning mt-4">
                    <p className="font-semibold text-[var(--color-ink)]">
                      {isBn ? 'পূর্বশর্ত অসম্পূর্ণ হতে পারে' : 'Prerequisites may be incomplete'}
                    </p>
                    <p className="text-sm text-[var(--color-ink-muted)]">
                      {isBn
                        ? 'সম্পর্কিত টপিক এখনো সম্পন্ন দেখাচ্ছে না। আপনি চাইলে সতর্কবার্তা মেনে শুরু করতে পারেন।'
                        : 'Related learning topics do not show as completed yet. You can start anyway after this warning.'}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink-muted)]">
                      {project.relatedTopicIds.slice(0, 5).map((topicId) => {
                        const href = learnPathForId(locale, topicId);
                        return (
                          <li key={topicId}>
                            {href ? <a href={href}>{topicId}</a> : topicId}
                          </li>
                        );
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
                        {isBn ? 'প্রজেক্ট দেখুন' : 'View project'}
                      </a>
                    </div>
                  </div>
                ) : (
                  <a className="btn btn-primary mt-4 inline-flex" href={localePath(locale, `projects/${project.slug}`)}>
                    {actionLabel(status, isBn)}
                  </a>
                )}
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
