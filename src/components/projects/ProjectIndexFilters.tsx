import { useEffect, useMemo, useState } from 'react';
import { getAllProjectProgress, type ProjectProgress, type ProjectStatus } from '../../stores/progress';
import { localePath, type Locale } from '../../i18n/config';
import { levelLabel, type ProjectCardModel } from '../../data/projects/catalog';
import { tracks } from '../../data/tracks/tracks';

interface Props {
  locale: Locale;
  projects: ProjectCardModel[];
}

function statusLabel(status: ProjectStatus | undefined, isBn: boolean): string {
  if (status === 'COMPLETED') return isBn ? 'সম্পন্ন' : 'Completed';
  if (status === 'IN_PROGRESS') return isBn ? 'চলমান' : 'In progress';
  return isBn ? 'শুরু হয়নি' : 'Not started';
}

function actionLabel(status: ProjectStatus | undefined, isBn: boolean): string {
  if (status === 'COMPLETED') return isBn ? 'রিভিউ' : 'Review Project';
  if (status === 'IN_PROGRESS') return isBn ? 'চালিয়ে যান' : 'Continue Project';
  return isBn ? 'শুরু করুন' : 'Start Project';
}

export default function ProjectIndexFilters({ locale, projects }: Props) {
  const isBn = locale === 'bn';
  const [track, setTrack] = useState('all');
  const [level, setLevel] = useState('all');
  const [technology, setTechnology] = useState('all');
  const [progressFilter, setProgressFilter] = useState('all');
  const [progressMap, setProgressMap] = useState<Record<string, ProjectProgress>>({});

  useEffect(() => {
    getAllProjectProgress()
      .then((rows) => {
        const map: Record<string, ProjectProgress> = {};
        for (const row of rows) map[row.projectId] = row;
        setProgressMap(map);
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  const technologies = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const t of p.recommendedTools) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (track !== 'all' && p.track !== track) return false;
      if (level !== 'all' && p.level !== level) return false;
      if (technology !== 'all' && !p.recommendedTools.includes(technology)) return false;
      const status = progressMap[p.id]?.status ?? 'NOT_STARTED';
      if (progressFilter !== 'all' && status !== progressFilter) return false;
      return true;
    });
  }, [projects, track, level, technology, progressFilter, progressMap]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm text-[var(--color-ink-muted)]">
          {isBn ? 'ট্র্যাক' : 'Track'}
          <select
            className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
          >
            <option value="all">{isBn ? 'সব' : 'All'}</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {isBn ? t.titleBn : t.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[var(--color-ink-muted)]">
          {isBn ? 'লেভেল' : 'Level'}
          <select
            className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="all">{isBn ? 'সব' : 'All'}</option>
            <option value="beginner">{levelLabel('beginner', isBn)}</option>
            <option value="intermediate">{levelLabel('intermediate', isBn)}</option>
            <option value="advanced">{levelLabel('advanced', isBn)}</option>
          </select>
        </label>
        <label className="text-sm text-[var(--color-ink-muted)]">
          {isBn ? 'টেকনোলজি' : 'Technology'}
          <select
            className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
          >
            <option value="all">{isBn ? 'সব' : 'All'}</option>
            {technologies.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[var(--color-ink-muted)]">
          {isBn ? 'প্রগ্রেস' : 'Progress'}
          <select
            className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
            value={progressFilter}
            onChange={(e) => setProgressFilter(e.target.value)}
          >
            <option value="all">{isBn ? 'সব' : 'All'}</option>
            <option value="NOT_STARTED">{statusLabel('NOT_STARTED', isBn)}</option>
            <option value="IN_PROGRESS">{statusLabel('IN_PROGRESS', isBn)}</option>
            <option value="COMPLETED">{statusLabel('COMPLETED', isBn)}</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-[var(--color-ink-subtle)]">
        {filtered.length} {isBn ? 'প্রজেক্ট' : 'projects'}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((project) => {
          const status = progressMap[project.id]?.status;
          return (
            <article key={project.id} className="surface-card flex flex-col">
              <div className="flex flex-wrap gap-2">
                <span className="badge">{levelLabel(project.level, isBn)}</span>
                <span className="badge">{project.trackTitle}</span>
                <span className="badge">{statusLabel(status, isBn)}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-[var(--color-ink)]">{project.title}</h2>
              <p className="mt-2 flex-1 text-sm text-[var(--color-ink-muted)]">{project.summary}</p>
              <p className="mt-3 text-xs text-[var(--color-ink-subtle)]">
                {project.estimatedHours}h · {project.learningOutcomeSkillIds.slice(0, 3).join(', ')}
              </p>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                <strong>{isBn ? 'পোর্টফোলিও ভ্যালু' : 'Portfolio value'}:</strong> {project.portfolioPitch}
              </p>
              <a className="btn btn-primary mt-4 self-start" href={localePath(locale, `projects/${project.slug}`)}>
                {actionLabel(status, isBn)}
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
