import { writeTopic, commonFooter } from './topic-helpers.mjs';

const C = {
  fe: 'CAREER-FRONTEND-ENGINEER',
  fs: 'CAREER-FULLSTACK-ENGINEER',
  se: 'CAREER-SOFTWARE-ENGINEER',
};

export function generateFrontend() {
  const topics = [
    {
      slug: 'html-semantics-a11y',
      meta: {
        id: 'FRONTEND-HTML-SEMANTICS-A11Y',
        title: 'HTML Semantics and Accessibility',
        titleBn: 'HTML সেমantics ও অ্যাক্সেসিবিলিটি',
        description:
          'Meaningful markup and WCAG-minded UI so assistive tech and SEO share the same structure.',
        descriptionBn:
          'অর্থবহ মার্কআপ ও WCAG-সচেতন UI—অ্যাসিস্টিভ টেক ও SEO একই কাঠামো ভাগ করে।',
        difficulty: 'beginner',
        estimatedMinutes: 34,
        prerequisites: [],
        unlocks: ['FRONTEND-CSS-CASCADE-BOX-MODEL', 'FRONTEND-FORMS-VALIDATION'],
        related: ['UIUX-USABILITY-HEURISTICS', 'W3C-WCAG'],
        careers: [C.fe, C.fs],
        tags: ['html', 'a11y', 'semantics'],
        sources: ['W3C-HTML', 'W3C-WCAG'],
      },
      body: `
## Why semantics beat \`div\` soup

Screen readers, keyboards, and search engines infer structure from elements and names. Pretty CSS cannot replace a missing heading hierarchy or unlabeled button.

## Mental model

<Callout type="mental-model">
  HTML is the document’s outline and interaction contract. CSS is presentation. JS is behavior. Accessibility is mostly good semantics + focus + names + contrast.
</Callout>

\`\`\`html
<header>
  <nav aria-label="Primary">
    <a href="/en/topics">Topics</a>
  </nav>
</header>
<main>
  <article>
    <h1>HTML Semantics</h1>
    <p>Lead with meaning.</p>
    <button type="button">Save</button>
  </article>
</main>
\`\`\`

Prefer native controls (\`button\`, \`a\`, \`input\`) before ARIA. If you use ARIA, you own keyboard behavior.

${commonFooter({
  mistakes: [
    { title: 'Clickable divs', detail: 'No keyboard semantics; use button/link.' },
    { title: 'Empty buttons/icons without names', detail: 'Provide accessible names.' },
    { title: 'Skipping heading levels', detail: 'Do not jump h1→h4 for style.' },
  ],
  interview:
    'How do you make a custom dropdown accessible? What native element would you start from?',
  practice: [
    'Navigate a page with keyboard only.',
    'Fix a missing label on a form control.',
    'Check color contrast on text.',
  ],
  sourceIds: ['W3C-HTML', 'W3C-WCAG'],
})}
`,
    },
    {
      slug: 'css-cascade-box-model',
      meta: {
        id: 'FRONTEND-CSS-CASCADE-BOX-MODEL',
        title: 'CSS Cascade and Box Model',
        titleBn: 'CSS ক্যাসকেড ও বক্স মডেল',
        description:
          'Origin, specificity, inheritance, and box sizing—the rules behind “why is my margin weird?”',
        descriptionBn:
          'Origin, specificity, inheritance ও box sizing—“মার্জিন অদ্ভুত কেন?” এর নিয়ম।',
        difficulty: 'beginner',
        estimatedMinutes: 36,
        prerequisites: ['FRONTEND-HTML-SEMANTICS-A11Y'],
        unlocks: ['FRONTEND-CSS-FLEXBOX-GRID'],
        related: ['FRONTEND-JAVASCRIPT-FUNDAMENTALS'],
        careers: [C.fe],
        tags: ['css', 'cascade', 'box-model'],
        sources: ['MDN-CSS-CASCADE', 'MDN-CSS-BOX'],
      },
      body: `
## Why cascade literacy beats \`!important\`

When styles fight, the cascade decides. Guessing leads to specificity wars.

## Mental model

<Callout type="mental-model">
  Cascade sorts competing declarations by origin/importance, then specificity, then order. Inheritance passes certain properties to children. The box model is content + padding + border (+ margin outside).
</Callout>

\`\`\`css
*,
*::before,
*::after {
  box-sizing: border-box;
}

.card {
  width: 20rem;
  padding: 1rem;
  border: 1px solid #d8dee8;
  margin-block: 1rem;
}
\`\`\`

With \`border-box\`, width includes padding and border—layouts become predictable.

${commonFooter({
  mistakes: [
    { title: 'Overusing !important', detail: 'Fixes one fight; creates ten.' },
    { title: 'Confusing margin collapse', detail: 'Vertical margins can collapse between blocks.' },
    { title: 'Inline styles for everything', detail: 'Loses cascade reuse and theming.' },
  ],
  interview:
    'Explain specificity for an ID vs class vs element selector and how cascade layers change the story.',
  practice: [
    'Predict which rule wins in a small conflict demo.',
    'Set border-box globally in a project.',
    'Inspect computed styles in DevTools.',
  ],
  sourceIds: ['MDN-CSS-CASCADE', 'MDN-CSS-BOX'],
})}
`,
    },
    {
      slug: 'css-flexbox-grid',
      meta: {
        id: 'FRONTEND-CSS-FLEXBOX-GRID',
        title: 'CSS Flexbox and Grid',
        titleBn: 'CSS Flexbox ও Grid',
        description:
          'One-dimensional Flex vs two-dimensional Grid—choose layout tools by content shape.',
        descriptionBn:
          'এক-মাত্রিক Flex বনাম দুই-মাত্রিক Grid—কনটেন্টের আকার অনুযায়ী লেআউট টুল।',
        difficulty: 'beginner',
        estimatedMinutes: 38,
        prerequisites: ['FRONTEND-CSS-CASCADE-BOX-MODEL'],
        unlocks: ['FRONTEND-REACT-COMPONENTS-STATE', 'FRONTEND-FORMS-VALIDATION'],
        related: ['UIUX-VISUAL-HIERARCHY'],
        careers: [C.fe, C.fs],
        tags: ['css', 'flexbox', 'grid'],
        sources: ['MDN-FLEXBOX', 'MDN-GRID'],
      },
      body: `
## Why two layout systems

Flex aligns along a single main axis (nav bars, toolbars). Grid places items in rows **and** columns (page shells, card galleries).

## Mental model

<Callout type="mental-model">
  Flex: distribute space among siblings in a row or column. Grid: define tracks, then place items into cells/areas.
</Callout>

\`\`\`css
.row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.page {
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: 1.5rem;
}
\`\`\`

Prefer \`gap\` over margin hacks between siblings.

${commonFooter({
  mistakes: [
    { title: 'Using Grid for every toolbar', detail: 'Flex is simpler for 1D alignment.' },
    { title: 'Fixed pixel-only grids', detail: 'Use fr, minmax, and media queries.' },
    { title: 'Absolute positioning as layout system', detail: 'Breaks flow and responsiveness.' },
  ],
  interview:
    'When would you combine Grid for page layout with Flex inside components?',
  practice: [
    'Build a responsive two-column layout.',
    'Center an item with Flex.',
    'Create a card grid with auto-fit/minmax.',
  ],
  sourceIds: ['MDN-FLEXBOX', 'MDN-GRID'],
})}
`,
    },
    {
      slug: 'javascript-fundamentals',
      meta: {
        id: 'FRONTEND-JAVASCRIPT-FUNDAMENTALS',
        title: 'JavaScript Fundamentals',
        titleBn: 'JavaScript এর মৌলিক বিষয়',
        description:
          'Values, functions, objects, modules—the language of the browser and much of the backend.',
        descriptionBn:
          'ভ্যালু, ফাংশন, অবজেক্ট, মডিউল—ব্রাউজার ও অনেক ব্যাকএন্ডের ভাষা।',
        difficulty: 'beginner',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-PROGRAMMING-VARIABLES'],
        unlocks: ['FRONTEND-JAVASCRIPT-ASYNC-EVENT-LOOP', 'FRONTEND-TYPESCRIPT-FUNDAMENTALS'],
        related: ['FOUNDATIONS-DATA-STRUCTURES-INTRO'],
        careers: [C.fe, C.fs, C.se],
        tags: ['javascript', 'fundamentals'],
        sources: ['TC39-ECMASCRIPT', 'MDN-JS-EVENT-LOOP'],
      },
      body: `
## Why JS fluency transfers everywhere

Syntax quirks matter less than values, references, closures, and modules—skills that transfer to Node, Deno, and tooling.

## Mental model

<Callout type="mental-model">
  Primitives are copied by value; objects are referenced. Closures capture bindings. Modules create scoped boundaries with explicit exports.
</Callout>

\`\`\`js
export function titleCase(s) {
  return s
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

const user = { id: 1, roles: ['learner'] };
const copy = { ...user, roles: [...user.roles, 'mentor'] };
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Mutating props/state-like objects casually', detail: 'Shared refs cause spooky action.' },
    { title: 'var and accidental globals', detail: 'Prefer const/let and modules.' },
    { title: 'Callback pyramids', detail: 'Use functions and later async/await.' },
  ],
  interview:
    'Explain closures with a practical example (e.g., making a function with private counters).',
  practice: [
    'Rewrite a script into ES modules.',
    'Implement deep-ish clone carefully for a small object.',
    'Practice array methods map/filter/reduce.',
  ],
  sourceIds: ['TC39-ECMASCRIPT', 'MDN-JS-EVENT-LOOP'],
})}
`,
    },
    {
      slug: 'javascript-async-event-loop',
      meta: {
        id: 'FRONTEND-JAVASCRIPT-ASYNC-EVENT-LOOP',
        title: 'JavaScript Async and the Event Loop',
        titleBn: 'JavaScript অ্যাসিঙ্ক ও ইভেন্ট লুপ',
        description:
          'Tasks, microtasks, and promises—why UI stays responsive and race conditions appear.',
        descriptionBn:
          'টাস্ক, মাইক্রোটাস্ক ও প্রমিস—UI কেন রেসপন্সিভ থাকে এবং রেস কন্ডিশন কেন আসে।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FRONTEND-JAVASCRIPT-FUNDAMENTALS'],
        unlocks: ['FRONTEND-REACT-HOOKS', 'BACKEND-NODE-RUNTIME-EVENT-LOOP'],
        related: ['FLUTTER-DART-ASYNC-FUTURES-STREAMS'],
        careers: [C.fe, C.fs, C.se],
        tags: ['javascript', 'async', 'event-loop'],
        sources: ['MDN-JS-EVENT-LOOP', 'NODE-EVENT-LOOP'],
      },
      body: `
## Why single-threaded ≠ blocking forever

JS runs one turn at a time on a main thread (in browsers). Async I/O and timers queue work so rendering can continue.

## Mental model

<Callout type="mental-model">
  The event loop pulls tasks (timers, I/O callbacks) and also drains microtasks (promise reactions) between them. \`await\` schedules continuations as microtasks.
</Callout>

\`\`\`js
console.log('A');
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');
// Typical order: A D B C
\`\`\`

\`\`\`js
async function load() {
  const res = await fetch('/api/topics');
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Assuming setTimeout(0) runs “immediately”', detail: 'It waits for the next task turn.' },
    { title: 'Unhandled promise rejections', detail: 'Always catch or return promises to handlers.' },
    { title: 'Race conditions on rapid input', detail: 'AbortController / sequence numbers help.' },
  ],
  interview:
    'Explain microtasks vs tasks and predict log order in a short snippet.',
  practice: [
    'Predict then verify console order demos.',
    'Add AbortController to a fetch.',
    'Convert promise chains to async/await.',
  ],
  sourceIds: ['MDN-JS-EVENT-LOOP', 'NODE-EVENT-LOOP'],
})}
`,
    },
    {
      slug: 'typescript-fundamentals',
      meta: {
        id: 'FRONTEND-TYPESCRIPT-FUNDAMENTALS',
        title: 'TypeScript Fundamentals',
        titleBn: 'TypeScript এর মৌলিক বিষয়',
        description:
          'Types as proofreading for programs—interfaces, unions, and gradual adoption.',
        descriptionBn:
          'প্রোগ্রামের প্রুফরিডিং হিসেবে টাইপ—ইন্টারফেস, ইউনিয়ন ও ধাপে ধাপে গ্রহণ।',
        difficulty: 'intermediate',
        estimatedMinutes: 38,
        prerequisites: ['FRONTEND-JAVASCRIPT-FUNDAMENTALS'],
        unlocks: ['FRONTEND-REACT-COMPONENTS-STATE', 'BACKEND-TYPESCRIPT-FOR-BACKEND'],
        related: ['FRONTEND-JAVASCRIPT-ASYNC-EVENT-LOOP'],
        careers: [C.fe, C.fs, C.se],
        tags: ['typescript', 'types'],
        sources: ['TS-HANDBOOK'],
      },
      body: `
## Why types pay rent in UI apps

Props, API responses, and state transitions are where silent \`undefined\` bugs breed. TypeScript moves many failures to compile time.

## Mental model

<Callout type="mental-model">
  Start with domain unions (\`loading | success | error\`) instead of booleans that allow impossible combinations.
</Callout>

\`\`\`ts
type Topic = { id: string; title: string };

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Topic }
  | { status: 'error'; message: string };

function titleOf(state: LoadState): string {
  return state.status === 'success' ? state.data.title : '…';
}
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Abusing any', detail: 'Turns the typechecker off locally.' },
    { title: 'Boolean soup flags', detail: 'Impossible states become runtime bugs.' },
    { title: 'Over-modeling early', detail: 'Type the boundaries first (props/API).' },
  ],
  interview:
    'Show how a discriminated union improves a component’s loading UI compared to multiple booleans.',
  practice: [
    'Type a fetch wrapper’s return union.',
    'Enable strict flags in tsconfig.',
    'Replace an any with unknown + narrowing.',
  ],
  sourceIds: ['TS-HANDBOOK'],
})}
`,
    },
    {
      slug: 'react-components-state',
      meta: {
        id: 'FRONTEND-REACT-COMPONENTS-STATE',
        title: 'React Components and State',
        titleBn: 'React কম্পোনেন্ট ও স্টেট',
        description:
          'UI as a function of state and props—composition, one-way data, and rendering.',
        descriptionBn:
          'স্টেট ও প্রপসের ফাংশন হিসেবে UI—কম্পোজিশন, একমুখী ডেটা ও রেন্ডার।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FRONTEND-JAVASCRIPT-FUNDAMENTALS', 'FRONTEND-TYPESCRIPT-FUNDAMENTALS'],
        unlocks: ['FRONTEND-REACT-HOOKS', 'FRONTEND-NEXTJS-APP-ROUTER-BASICS'],
        related: ['FRONTEND-CSS-FLEXBOX-GRID'],
        careers: [C.fe, C.fs],
        tags: ['react', 'components', 'state'],
        sources: ['REACT-DOCS'],
      },
      body: `
## Why React’s model stuck

Declarative UI: describe the view for current state; React updates the DOM. Composition beats inheritance for UI trees.

## Mental model

<Callout type="mental-model">
  Props flow down. Events flow up. State lives where it can change, as low as reasonable but high enough to share.
</Callout>

\`\`\`tsx
import { useState } from 'react';

export function Counter() {
  const [n, setN] = useState(0);
  return (
    <button type="button" onClick={() => setN((x) => x + 1)}>
      Count {n}
    </button>
  );
}
\`\`\`

Treat state updates as requests; use functional updates when next value depends on previous.

${commonFooter({
  mistakes: [
    { title: 'Mutating state in place', detail: 'React may skip renders; copy instead.' },
    { title: 'Derived state duplication', detail: 'Compute during render when possible.' },
    { title: 'Prop drilling panic', detail: 'Compose first; context later with care.' },
  ],
  interview:
    'Explain one-way data flow and how you would lift state for two sibling components.',
  practice: [
    'Build a controlled input.',
    'Split a component into presentational pieces.',
    'Fix a mutation bug deliberately then correct it.',
  ],
  sourceIds: ['REACT-DOCS'],
})}
`,
    },
    {
      slug: 'react-hooks',
      meta: {
        id: 'FRONTEND-REACT-HOOKS',
        title: 'React Hooks',
        titleBn: 'React হুকস',
        description:
          'useState, useEffect, and friends—rules of hooks and effect mental models.',
        descriptionBn:
          'useState, useEffect ও অন্যান্য—হুকের নিয়ম এবং ইফেক্টের মানসিক মডেল।',
        difficulty: 'intermediate',
        estimatedMinutes: 42,
        prerequisites: ['FRONTEND-REACT-COMPONENTS-STATE', 'FRONTEND-JAVASCRIPT-ASYNC-EVENT-LOOP'],
        unlocks: ['FRONTEND-NEXTJS-APP-ROUTER-BASICS', 'FRONTEND-FORMS-VALIDATION'],
        related: ['FRONTEND-TYPESCRIPT-FUNDAMENTALS'],
        careers: [C.fe, C.fs],
        tags: ['react', 'hooks', 'useEffect'],
        sources: ['REACT-HOOKS', 'REACT-DOCS'],
      },
      body: `
## Why hooks replaced class lifecycles for most UI

Hooks colocate related logic (state + effects) without HOCs/render-prop pyramids—when used with the Rules of Hooks.

## Mental model

<Callout type="mental-model">
  Effects synchronize React with external systems (network, DOM, subscriptions). If there is no external system, you may not need an effect.
</Callout>

\`\`\`tsx
import { useEffect, useState } from 'react';

export function TopicTitle({ id }: { id: string }) {
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(\`/api/topics/\${id}\`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setTitle(data.title);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return <h1>{title ?? 'Loading…'}</h1>;
}
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Effects for pure calculations', detail: 'Derive in render instead.' },
    { title: 'Missing cleanup', detail: 'Leaks listeners and races.' },
    { title: 'Conditional hooks', detail: 'Breaks hook ordering; always call hooks at top level.' },
  ],
  interview:
    'When is useEffect the wrong tool? Give an example of deriving state during render instead.',
  practice: [
    'Add cleanup to a subscription effect.',
    'Replace an unnecessary effect with derived state.',
    'Read React docs on synchronizing with effects.',
  ],
  sourceIds: ['REACT-HOOKS', 'REACT-DOCS'],
})}
`,
    },
    {
      slug: 'nextjs-app-router-basics',
      meta: {
        id: 'FRONTEND-NEXTJS-APP-ROUTER-BASICS',
        title: 'Next.js App Router Basics',
        titleBn: 'Next.js App Router বেসিক',
        description:
          'Server Components, file-system routing, and data fetching patterns in the App Router.',
        descriptionBn:
          'App Router-এ Server Components, ফাইল-সিস্টেম রাউটিং ও ডেটা ফেচিং প্যাটার্ন।',
        difficulty: 'intermediate',
        estimatedMinutes: 42,
        prerequisites: ['FRONTEND-REACT-HOOKS'],
        unlocks: ['FULLSTACK-ARCHITECTURE-OVERVIEW', 'FRONTEND-FORMS-VALIDATION'],
        related: ['NEXTJS-AUTH', 'BACKEND-HTTP-REST-API-DESIGN'],
        careers: [C.fe, C.fs],
        tags: ['nextjs', 'app-router', 'react'],
        sources: ['NEXTJS-APP-ROUTER', 'NEXTJS-AUTH'],
      },
      body: `
## Why App Router changes defaults

The \`app/\` directory defaults toward **Server Components**: less client JS by default, colocated data fetching, nested layouts.

## Mental model

<Callout type="mental-model">
  Server Components render on the server and ship HTML/payload with minimal client bundle. Add \`'use client'\` only for interactivity (state, effects, browser APIs).
</Callout>

\`\`\`tsx
// app/topics/[slug]/page.tsx (Server Component by default)
export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await getTopic(slug); // server-side
  return <article><h1>{topic.title}</h1></article>;
}
\`\`\`

Layouts nest and preserve state across sibling navigations—design chrome (nav) as layouts.

${commonFooter({
  mistakes: [
    { title: 'Making everything client', detail: 'Loses SSR benefits and ships more JS.' },
    { title: 'Fetching secrets in client components', detail: 'Keep secrets server-only.' },
    { title: 'Ignoring caching semantics', detail: 'Learn fetch cache options for your Next version.' },
  ],
  interview:
    'How do you decide Server vs Client Components for a dashboard widget that polls every 10s?',
  practice: [
    'Create a nested layout with a shared header.',
    'Fetch data in a Server Component.',
    'Add one small Client Component for a toggle.',
  ],
  sourceIds: ['NEXTJS-APP-ROUTER', 'NEXTJS-AUTH'],
})}
`,
    },
    {
      slug: 'frontend-forms-validation',
      meta: {
        id: 'FRONTEND-FORMS-VALIDATION',
        title: 'Frontend Forms and Validation',
        titleBn: 'ফ্রন্টএন্ড ফর্ম ও ভ্যালিডেশন',
        description:
          'Accessible forms, client validation UX, and never trusting the browser alone.',
        descriptionBn:
          'অ্যাক্সেসিবল ফর্ম, ক্লায়েন্ট ভ্যালিডেশন UX, এবং শুধু ব্রাউজারকে বিশ্বাস না করা।',
        difficulty: 'intermediate',
        estimatedMinutes: 36,
        prerequisites: ['FRONTEND-HTML-SEMANTICS-A11Y', 'FRONTEND-REACT-HOOKS'],
        unlocks: ['FULLSTACK-AUTH-ACROSS-STACK'],
        related: ['FOUNDATIONS-SECURITY-FUNDAMENTALS', 'BACKEND-SECURITY-BASICS'],
        careers: [C.fe, C.fs],
        tags: ['forms', 'validation', 'a11y'],
        sources: ['W3C-HTML', 'W3C-WCAG'],
      },
      body: `
## Why forms are product-critical

Signup, checkout, and admin tools all fail through forms. Validation UX and accessibility decide conversion and inclusion.

## Mental model

<Callout type="mental-model">
  Browser checks help humans. Server checks protect the system. Client validation is a courtesy and performance optimization—not a security boundary.
</Callout>

\`\`\`tsx
<label htmlFor="email">Email</label>
<input id="email" name="email" type="email" autoComplete="email" required />
\`\`\`

Associate errors with \`aria-describedby\`. Don’t rely only on color to signal invalid fields.

${commonFooter({
  mistakes: [
    { title: 'Validating only on the client', detail: 'Attackers bypass UI easily.' },
    { title: 'Missing labels', detail: 'Placeholder is not a label.' },
    { title: 'Blocking paste on password fields', detail: 'Hurts password managers and security.' },
  ],
  interview:
    'Describe a secure, accessible login form strategy spanning client UX and server verification.',
  practice: [
    'Build a form with visible labels and error text.',
    'Add server-side validation mirror rules.',
    'Test with keyboard only.',
  ],
  sourceIds: ['W3C-HTML', 'W3C-WCAG'],
})}
`,
    },
  ];

  // Fix accidental related entries that aren't topic ids
  for (const t of topics) {
    t.meta.related = t.meta.related.filter((id) => !['W3C-WCAG', 'NEXTJS-AUTH'].includes(id));
  }

  return topics.map((t) => writeTopic('frontend', t.slug, t.meta, t.body));
}
