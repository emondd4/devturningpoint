import { useDeferredValue, useMemo, useState } from 'react';
import type { Problem, ProblemDifficulty } from '../../data/problem-solving/types';

interface Props {
  locale: 'en' | 'bn';
  problems: Problem[];
  categories: string[];
}

const DIFFICULTIES: Array<ProblemDifficulty | 'All'> = ['All', 'Easy', 'Medium', 'Hard'];

const DIFFICULTY_CLASS: Record<ProblemDifficulty, string> = {
  Easy: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  Medium: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  Hard: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
};

export default function ProblemBankBrowser({ locale, problems, categories }: Props) {
  const isBn = locale === 'bn';
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>('All');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
      if (category !== 'All' && p.category !== category) return false;
      if (!deferredQuery) return true;
      const hay = `${p.title} ${p.category} ${p.pattern} ${p.id} ${p.problemStatement} ${p.tags.join(' ')}`.toLowerCase();
      return hay.includes(deferredQuery);
    });
  }, [problems, difficulty, category, deferredQuery]);

  const byCategory = useMemo(() => {
    const map = new Map<string, Problem[]>();
    for (const p of filtered) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="surface-card space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-subtle)]">
              {isBn ? 'সমস্যা সমাধান' : 'Problem Solving'}
            </p>
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">
              {isBn ? 'কোডিং ইন্টারভিউ সমস্যা ব্যাংক' : 'Coding Interview Problem Bank'}
            </h2>
          </div>
          <p className="text-sm text-[var(--color-ink-muted)]">
            {isBn
              ? `${filtered.length} / ${problems.length} সমস্যা`
              : `${filtered.length} / ${problems.length} problems`}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-ink-muted)]">{isBn ? 'কঠিনতা' : 'Difficulty'}</span>
            <select
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as (typeof DIFFICULTIES)[number])}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? (isBn ? 'সব' : 'All') : d}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-ink-muted)]">{isBn ? 'ক্যাটাগরি' : 'Category'}</span>
            <select
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">{isBn ? 'সব' : 'All'}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-ink-muted)]">{isBn ? 'খুঁজুন' : 'Search'}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isBn ? 'শিরোনাম, প্যাটার্ন, ট্যাগ…' : 'Title, pattern, tag…'}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
            />
          </label>
        </div>
      </div>

      {byCategory.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">
          {isBn ? 'কোনো সমস্যা মেলেনি—ফিল্টার শিথিল করুন।' : 'No problems match—loosen the filters.'}
        </p>
      ) : (
        byCategory.map(([cat, items]) => (
          <section key={cat} className="space-y-3">
            <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-border)] pb-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
                {cat}
              </h3>
              <span className="text-xs text-[var(--color-ink-subtle)]">{items.length}</span>
            </div>
            <ol className="space-y-3">
              {items.map((p, index) => (
                <li key={p.id} className="surface-card">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-ink-subtle)]">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${DIFFICULTY_CLASS[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                    <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5">{p.pattern}</span>
                    <span className="font-mono">{p.id}</span>
                    {p.reportedAt && p.reportedAt.length > 0 && (
                      <span
                        className="rounded-full bg-[var(--color-accent-ai)]/15 px-2 py-0.5 text-[var(--color-accent-ai)]"
                        title={isBn ? 'বাংলাদেশি ইন্টারভিউতে রিপোর্ট করা হয়েছে' : 'Reported in Bangladeshi interviews'}
                      >
                        {isBn ? 'BD:' : 'Reported at:'} {p.reportedAt.join(', ')}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-medium text-[var(--color-ink)]">
                    <span className="mr-2 text-[var(--color-ink-subtle)]">{index + 1}.</span>
                    {p.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{p.problemStatement}</p>

                  <details className="mt-3 text-sm text-[var(--color-ink-muted)]">
                    <summary className="cursor-pointer font-medium text-[var(--color-ink)]">
                      {isBn ? 'পদ্ধতি, সমাধান ও জটিলতা' : 'Approach, solution & complexity'}
                    </summary>
                    <div className="mt-3 space-y-4">
                      {p.examples.length > 0 && (
                        <div>
                          <p className="font-medium text-[var(--color-ink)]">{isBn ? 'উদাহরণ' : 'Examples'}</p>
                          <ul className="mt-1 space-y-1">
                            {p.examples.map((ex, i) => (
                              <li key={i} className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] p-2 font-mono text-xs">
                                <div>Input: {ex.input}</div>
                                <div>Output: {ex.output}</div>
                                {ex.explanation && <div className="font-sans text-[var(--color-ink-muted)]">{ex.explanation}</div>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-[var(--color-ink)]">
                          {isBn ? 'কীভাবে চিন্তা করবেন (ধাপে ধাপে)' : 'How to think about it (step by step)'}
                        </p>
                        <ol className="mt-1 list-decimal space-y-1 pl-5">
                          {p.approachSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {p.bruteForce && (
                        <p>
                          <strong className="text-[var(--color-ink)]">{isBn ? 'ব্রুট ফোর্স:' : 'Brute force:'}</strong>{' '}
                          {p.bruteForce.approach}{' '}
                          <span className="font-mono text-xs">
                            (Time: {p.bruteForce.timeComplexity}, Space: {p.bruteForce.spaceComplexity})
                          </span>
                        </p>
                      )}

                      <p>
                        <strong className="text-[var(--color-ink)]">{isBn ? 'অপ্টিমাল পদ্ধতি:' : 'Optimal approach:'}</strong>{' '}
                        {p.optimalApproach}
                      </p>

                      <div>
                        <p className="font-medium text-[var(--color-ink)]">{isBn ? 'সমাধান (Python)' : 'Solution (Python)'}</p>
                        <pre className="mt-1 overflow-x-auto rounded-[var(--radius-md)] bg-[var(--color-surface-2)] p-3 font-mono text-xs text-[var(--color-ink)]">
                          {p.solutionCode}
                        </pre>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 font-mono text-xs text-[var(--color-accent)]">
                          {isBn ? 'সময়:' : 'Time:'} {p.timeComplexity}
                        </span>
                        <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 font-mono text-xs text-[var(--color-accent)]">
                          {isBn ? 'স্পেস:' : 'Space:'} {p.spaceComplexity}
                        </span>
                      </div>

                      {p.followUps.length > 0 && (
                        <div>
                          <p className="font-medium text-[var(--color-ink)]">{isBn ? 'ফলো-আপ প্রশ্ন' : 'Follow-ups'}</p>
                          <ul className="mt-1 list-disc space-y-1 pl-5">
                            {p.followUps.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}
