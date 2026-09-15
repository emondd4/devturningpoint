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
  const [answeredOnly, setAnsweredOnly] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const questionTypes = useMemo(
    () => ['All', ...Array.from(new Set(questions.map((q) => q.questionType))).sort()],
    [questions],
  );

  const answeredCount = useMemo(() => questions.filter((q) => q.shortAnswer || q.answer).length, [questions]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (level !== 'All' && q.level !== level) return false;
      if (category !== 'All' && q.category !== category) return false;
      if (type !== 'All' && q.questionType !== type) return false;
      if (answeredOnly && !(q.shortAnswer || q.answer)) return false;
      if (!deferredQuery) return true;
      const hay = `${q.question} ${q.topic} ${q.category} ${q.id} ${q.shortAnswer ?? ''} ${q.answer ?? ''}`.toLowerCase();
      return hay.includes(deferredQuery);
    });
  }, [questions, level, category, type, answeredOnly, deferredQuery]);

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
            {isBn
              ? `${filtered.length} / ${questions.length} প্রশ্ন · ${answeredCount} উত্তরসহ`
              : `${filtered.length} / ${questions.length} questions · ${answeredCount} with answers`}
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
              placeholder={isBn ? 'প্রশ্ন, উত্তর, টপিক…' : 'Question, answer, topic…'}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-[var(--color-ink)]"
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
          <input
            type="checkbox"
            checked={answeredOnly}
            onChange={(e) => setAnsweredOnly(e.target.checked)}
            className="rounded border-[var(--color-border)]"
          />
          {isBn ? 'শুধু উত্তরসহ প্রশ্ন' : 'Only questions with answers'}
        </label>
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
                    {q.topic ? <span>{q.topic}</span> : null}
                    <span className="font-mono">{q.id}</span>
                    {(q.shortAnswer || q.answer) && (
                      <span className="rounded-full bg-[var(--color-success-soft)] px-2 py-0.5 text-[var(--color-success)]">
                        {isBn ? 'উত্তর আছে' : 'Answered'}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[var(--color-ink)]">
                    <span className="mr-2 text-[var(--color-ink-subtle)]">{index + 1}.</span>
                    {q.question}
                  </p>
                  {(q.shortAnswer || q.answer || q.example || q.integrationProcedure) && (
                    <details className="mt-3 text-sm text-[var(--color-ink-muted)]">
                      <summary className="cursor-pointer font-medium text-[var(--color-ink)]">
                        {isBn ? 'উত্তর, উদাহরণ ও ইন্টিগ্রেশন' : 'Answer, example & integration'}
                      </summary>
                      <div className="mt-3 space-y-3">
                        {q.shortAnswer && (
                          <p>
                            <strong className="text-[var(--color-ink)]">{isBn ? 'সংক্ষিপ্ত:' : 'Short:'}</strong>{' '}
                            {q.shortAnswer}
                          </p>
                        )}
                        {q.answer && (
                          <p>
                            <strong className="text-[var(--color-ink)]">{isBn ? 'পূর্ণ উত্তর:' : 'Full answer:'}</strong>{' '}
                            {q.answer}
                          </p>
                        )}
                        {q.example && (
                          <div>
                            <p className="font-medium text-[var(--color-ink)]">{isBn ? 'উদাহরণ' : 'Example'}</p>
                            <pre className="mt-1 overflow-x-auto rounded-[var(--radius-md)] bg-[var(--color-surface-2)] p-3 font-mono text-xs text-[var(--color-ink)] whitespace-pre-wrap">
                              {q.example}
                            </pre>
                          </div>
                        )}
                        {q.integrationProcedure && (
                          <p>
                            <strong className="text-[var(--color-ink)]">
                              {isBn ? 'ইন্টিগ্রেশন:' : 'Integration:'}
                            </strong>{' '}
                            {q.integrationProcedure}
                          </p>
                        )}
                      </div>
                    </details>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}
