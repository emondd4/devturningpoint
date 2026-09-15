import { useEffect, useMemo, useState } from 'react';
import {
  getProjectProgress,
  markProjectComplete,
  startProject,
  toggleMilestoneComplete,
  touchProject,
  type ProjectProgress,
  type ProjectStatus,
} from '../../stores/progress';
import type { Locale } from '../../i18n/config';

interface MilestoneView {
  id: string;
  title: string;
  objective: string;
  whyItMatters: string;
  tasks: string[];
  validationChecklist: string[];
  commonProblems: string[];
  expectedArtifacts: string[];
  completionCriteria: string[];
}

interface Props {
  locale: Locale;
  projectId: string;
  milestones: MilestoneView[];
  interviewQuestions: { id: string; question: string }[];
}

function statusLabel(status: ProjectStatus, isBn: boolean): string {
  if (status === 'COMPLETED') return isBn ? 'সম্পন্ন' : 'Completed';
  if (status === 'IN_PROGRESS') return isBn ? 'চলমান' : 'In progress';
  return isBn ? 'শুরু হয়নি' : 'Not started';
}

export default function ProjectProgressPanel({
  locale,
  projectId,
  milestones,
  interviewQuestions,
}: Props) {
  const isBn = locale === 'bn';
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const completed = useMemo(
    () => new Set(progress?.milestoneCompletion.map((m) => m.milestoneId) ?? []),
    [progress],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await touchProject(projectId);
        const value = await getProjectProgress(projectId);
        if (!cancelled) setProgress(value ?? null);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const refresh = async () => {
    setProgress((await getProjectProgress(projectId)) ?? null);
  };

  const onStart = async () => {
    setProgress(await startProject(projectId));
  };

  const onToggle = async (milestoneId: string) => {
    setProgress(await toggleMilestoneComplete(projectId, milestoneId, milestones.length));
  };

  const onCompleteProject = async () => {
    setProgress(await markProjectComplete(projectId, milestones.map((m) => m.id)));
  };

  const status: ProjectStatus = progress?.status ?? 'NOT_STARTED';

  return (
    <div className="space-y-6">
      <section className="surface-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-ink-subtle)]">
              {isBn ? 'প্রজেক্ট প্রগ্রেস' : 'Project progress'}
            </p>
            <p className="mt-1 font-medium text-[var(--color-ink)]">{statusLabel(status, isBn)}</p>
            <p className="text-sm text-[var(--color-ink-muted)]">
              {completed.size}/{milestones.length} {isBn ? 'মাইলস্টোন' : 'milestones'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {status === 'NOT_STARTED' && (
              <button type="button" className="btn btn-primary" onClick={onStart}>
                {isBn ? 'প্রজেক্ট শুরু' : 'Start Project'}
              </button>
            )}
            {status === 'IN_PROGRESS' && (
              <button type="button" className="btn btn-primary" onClick={refresh}>
                {isBn ? 'চালিয়ে যান' : 'Continue Project'}
              </button>
            )}
            {status === 'COMPLETED' && (
              <button type="button" className="btn" onClick={refresh}>
                {isBn ? 'রিভিউ' : 'Review Project'}
              </button>
            )}
            {status !== 'COMPLETED' && (
              <button type="button" className="btn" onClick={onCompleteProject}>
                {isBn ? 'প্রজেক্ট সম্পন্ন চিহ্নিত' : 'Mark project complete'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">
          {isBn ? 'মাইলস্টোন' : 'Milestones'}
        </h2>
        {milestones.map((m, index) => {
          const done = completed.has(m.id);
          return (
            <article key={m.id} className="surface-card" id={m.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-[var(--color-ink-subtle)]">
                    {isBn ? 'মাইলস্টোন' : 'Milestone'} {index + 1}
                  </p>
                  <h3 className="text-lg font-semibold text-[var(--color-ink)]">{m.title}</h3>
                </div>
                <button type="button" className="btn" onClick={() => onToggle(m.id)}>
                  {done
                    ? isBn
                      ? 'সম্পন্ন ✓'
                      : 'Completed ✓'
                    : isBn
                      ? 'সম্পন্ন চিহ্নিত'
                      : 'Mark complete'}
                </button>
              </div>
              <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
                <strong>{isBn ? 'কী বানাবেন' : 'WHAT'}:</strong> {m.objective}
              </p>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                <strong>{isBn ? 'কেন' : 'WHY'}:</strong> {m.whyItMatters}
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {isBn ? 'কাজ' : 'Implement yourself'}
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink-muted)]">
                    {m.tasks.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {isBn ? 'যাচাই' : 'Verify'}
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink-muted)]">
                    {m.validationChecklist.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {isBn ? 'যা প্রায়ই ভাঙে' : 'Frequently fails'}
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink-muted)]">
                    {m.commonProblems.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {isBn ? 'প্রমাণ রাখুন' : 'Evidence to save'}
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--color-ink-muted)]">
                    {m.expectedArtifacts.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {status === 'COMPLETED' && interviewQuestions.length > 0 && (
        <section className="surface-card">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">
            {isBn ? 'ব্যাখ্যা করতে প্রস্তুত থাকুন' : 'Be ready to explain'}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {isBn
              ? 'সম্পন্ন প্রজেক্টের সাথে সম্পর্কিত ইন্টারভিউ প্রশ্ন।'
              : 'Highly relevant interview prompts for this completed project.'}
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--color-ink)]">
            {interviewQuestions.map((q) => (
              <li key={q.id}>
                <span className="text-xs text-[var(--color-ink-subtle)]">{q.id}</span>
                <span className="block">{q.question}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
