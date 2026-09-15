import { useDeferredValue, useMemo, useState } from 'react';
import type { BankQuestion, InterviewLevel } from '../../data/interviews/types';

interface Props {
  locale: 'en' | 'bn';
  trackLabel: string;
  questions: BankQuestion[];
  categories: string[];
}

const LEVELS: Array<InterviewLevel | 'All'> = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function InterviewBankBrowser({ locale, trackLabel, questions, categories }: Props) {
  const isBn = locale === 'bn';
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('All');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const questionTypes = useMemo(
    () => ['All', ...Array.from(new Set(questions.map((q) => q.questionType))).sort()],
    [questions],
  );

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (level !== 'All' && q.level !== level) return false;
      if (category !== 'All' && q.category !== category) return false;
      if (type !== 'All' && q.questionType !== type) return false;
      if (!deferredQuery) return true;
      const hay = `${q.question} ${q.topic} ${q.category} ${q.id}`.toLowerCase();
      return hay.includes(deferredQuery);
    });
  }, [questions, level, category, type, deferredQuery]);

  const byCategory = useMemo(() => {
    const map = new Map<string, BankQuestion[]>();
    for (const q of filtered) {
      const list = map.get(q.category) ?? [];
      list.push(q);
      map.set(q.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="surface-card space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-subtle)]">
              {isBn ? 'ট্র্যাক' : 'Track'}
            </p>
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">{trackLabel}</h2>
          </div>
          <p className="text-sm text-[var(--color-ink-muted)]">
            {isBn ? `${filtered.length} / ${questions.length} প্রশ্ন` : `${filtered.length} / ${questions.length} questions`}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-ink-muted)]">{isBn ? 'লেভেল' : 'Level'}</span>
            <select
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
              value={level}
              onChange={(e) => setLevel(e.target.value as (typeof LEVELS)[number])}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l === 'All' ? (isBn ? 'সব' : 'All') : l}
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
            <span className="mb-1 block text-[var(--color-ink-muted)]">{isBn ? 'প্রশ্নের ধরন' : 'Question type'}</span>
            <select
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {questionTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? (isBn ? 'সব' : 'All') : t}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm md:col-span-2 xl:col-span-1">
            <span className="mb-1 block text-[var(--color-ink-muted)]">{isBn ? 'খুঁজুন' : 'Search'}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isBn ? 'প্রশ্ন, টপিক, বা আইডি…' : 'Question, topic, or id…'}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
            />
          </label>
        </div>
      </div>

      {byCategory.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">
          {isBn ? 'কোনো প্রশ্ন মেলেনি—ফিল্টার শিথিল করুন।' : 'No questions match—loosen the filters.'}
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
              {items.map((q, index) => (
                <li key={q.id} className="surface-card">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-ink-subtle)]">
                    <span className="badge">{q.level}</span>
                    <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5">{q.questionType}</span>
                    <span>{q.topic}</span>
                    <span className="font-mono">{q.id}</span>
                  </div>
                  <p className="mt-2 text-[var(--color-ink)]">
                    <span className="mr-2 text-[var(--color-ink-subtle)]">{index + 1}.</span>
                    {q.question}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}
