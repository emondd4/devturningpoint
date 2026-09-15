import { useMemo, useState } from 'react';
import type { AssessmentBank } from '../../data/assessments/types';
import { scoreAssessment } from '../../data/assessments/score';
import { saveAssessment, savePath } from '../../stores/progress';
import { buildRoadmap } from '../../utils/graph';
import { masterGraph } from '../../data/skill-graphs/master-graph';
import { localePath, type Locale } from '../../i18n/config';
import { learnPathForId, resolveTopicId } from '../../utils/topic-links';
import { getTrackCurriculum } from '../../utils/topic-links';

interface Props {
  locale: Locale;
  bank: AssessmentBank;
  trackSlug: string;
  goalSkillIds: string[];
}

export default function AssessmentWizard({ locale, bank, trackSlug, goalSkillIds }: Props) {
  const isBn = locale === 'bn';
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allAnswered = bank.questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

  const result = useMemo(() => {
    if (!done) return null;
    return scoreAssessment({
      bank,
      answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value })),
      graph: masterGraph,
      goalSkillIds,
    });
  }, [done, bank, answers, goalSkillIds]);

  const roadmap = useMemo(() => {
    if (!result) return null;
    // Prefer published curriculum topics for actionable links; fall back to graph order.
    const curriculum = getTrackCurriculum(bank.trackId);
    if (curriculum.length > 0) {
      const knownTopics = new Set(
        result.demonstrated
          .map((id) => resolveTopicId(id))
          .filter((id): id is string => Boolean(id)),
      );
      const ordered = curriculum.filter((id) => !knownTopics.has(id));
      const reasons: Record<string, string> = {};
      for (const id of ordered) {
        reasons[id] = 'Next published topic in this track curriculum';
      }
      return {
        known: [...knownTopics],
        missing: ordered,
        ordered: ordered.length > 0 ? ordered : curriculum,
        reasons,
      };
    }
    return buildRoadmap({
      graph: masterGraph,
      knownSkillIds: result.demonstrated,
      goalSkillIds,
    });
  }, [result, goalSkillIds, bank.trackId]);

  const onSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const score = scoreAssessment({
        bank,
        answers: Object.entries(answers).map(([questionId, value]) => ({ questionId, value })),
        graph: masterGraph,
        goalSkillIds,
      });
      await saveAssessment({
        trackId: bank.trackId,
        completedAt: new Date().toISOString(),
        demonstrated: score.demonstrated,
        uncertain: score.uncertain,
        missing: score.missing,
        recommendedStartId: score.recommendedStartId ?? undefined,
        answers,
      });
      const path = (() => {
        const curriculum = getTrackCurriculum(bank.trackId);
        if (curriculum.length > 0) {
          const knownTopics = new Set(
            score.demonstrated
              .map((id) => resolveTopicId(id))
              .filter((id): id is string => Boolean(id)),
          );
          const ordered = curriculum.filter((id) => !knownTopics.has(id));
          return {
            ordered: ordered.length > 0 ? ordered : curriculum,
          };
        }
        return buildRoadmap({
          graph: masterGraph,
          knownSkillIds: score.demonstrated,
          goalSkillIds,
        });
      })();
      await savePath({
        trackId: bank.trackId,
        orderedSkillIds: path.ordered,
        currentTopicId: path.ordered[0] ?? score.recommendedStartId ?? undefined,
        lastVisitedAt: new Date().toISOString(),
        assessmentCompletedAt: new Date().toISOString(),
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save assessment');
    } finally {
      setSaving(false);
    }
  };

  if (done && result && roadmap) {
    return (
      <div className="space-y-6">
        <div className="surface-card">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">
            {isBn ? 'আপনার রোডম্যাপ' : 'Your personalized roadmap'}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {isBn ? 'ফলাফল এই ব্রাউজারে সংরক্ষিত।' : 'Results are stored in this browser.'}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-[var(--color-ink-subtle)]">{isBn ? 'জানা' : 'Known'}</p>
              <p className="text-sm text-[var(--color-ink)]">{result.demonstrated.join(', ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-[var(--color-ink-subtle)]">{isBn ? 'অনিশ্চিত' : 'Uncertain'}</p>
              <p className="text-sm text-[var(--color-ink)]">{result.uncertain.join(', ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-[var(--color-ink-subtle)]">{isBn ? 'বাদ' : 'Missing'}</p>
              <p className="text-sm text-[var(--color-ink)]">{result.missing.join(', ') || '—'}</p>
            </div>
          </div>
        </div>
        <ol className="space-y-3">
          {roadmap.ordered.map((id, index) => {
            const href = learnPathForId(locale, id);
            return (
            <li key={id} className="surface-card">
              <p className="font-medium text-[var(--color-ink)]">
                {index + 1}. {id}
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{roadmap.reasons[id]}</p>
              {href ? (
                <a className="mt-2 inline-block text-sm" href={href}>
                  {isBn ? 'টপিক খুলুন' : 'Open topic'}
                </a>
              ) : (
                <p className="mt-2 text-sm text-[var(--color-ink-subtle)]">
                  {isBn ? 'প্রকাশিত টপিক নেই' : 'No published topic yet'}
                </p>
              )}
            </li>
            );
          })}
        </ol>
        <a className="btn btn-secondary" href={localePath(locale, `tracks/${trackSlug}`)}>
          {isBn ? 'ট্র্যাকে ফিরে যান' : 'Back to track'}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bank.questions.map((q, index) => (
        <fieldset key={q.id} className="surface-card">
          <legend className="font-medium text-[var(--color-ink)]">
            {index + 1}. {isBn && q.promptBn ? q.promptBn : q.prompt}
          </legend>
          <p className="mt-1 text-xs text-[var(--color-ink-subtle)]">{q.skillIds.join(', ')}</p>

          {q.type === 'self-confidence' ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <label
                  key={n}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={n}
                    checked={answers[q.id] === n}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: n }))}
                  />
                  {n}
                </label>
              ))}
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {(q.options ?? []).map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink-muted)]"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                  />
                  <span>{isBn && opt.labelBn ? opt.labelBn : opt.label}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      ))}

      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

      <button type="button" className="btn btn-primary" disabled={!allAnswered || saving} onClick={onSubmit}>
        {saving ? (isBn ? 'সংরক্ষণ…' : 'Saving…') : isBn ? 'রোডম্যাপ তৈরি করুন' : 'Generate roadmap'}
      </button>
    </div>
  );
}
