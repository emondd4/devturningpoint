import { writeTopic, commonFooter } from './topic-helpers.mjs';

const C = {
  qa: 'CAREER-QA-ENGINEER',
  fe: 'CAREER-FRONTEND-ENGINEER',
  be: 'CAREER-BACKEND-ENGINEER',
  ui: 'CAREER-UIUX-DESIGNER',
  pm: 'CAREER-PROJECT-MANAGER',
  fs: 'CAREER-FULLSTACK-ENGINEER',
  se: 'CAREER-SOFTWARE-ENGINEER',
  devops: 'CAREER-DEVOPS-ENGINEER',
};

export function generateSecondaryTracks() {
  const files = [];

  // QA (4)
  files.push(
    ...[
      {
        track: 'qa',
        slug: 'qa-testing-pyramid',
        meta: {
          id: 'QA-TESTING-PYRAMID',
          title: 'The Testing Pyramid',
          titleBn: 'টেস্টিং পিরামিড',
          description:
            'Balance unit, integration, and end-to-end tests for fast feedback and confidence.',
          descriptionBn:
            'দ্রুত ফিডব্যাক ও আত্মবিশ্বাসের জন্য ইউনিট, ইন্টিগ্রেশন ও এন্ড-টু-এন্ড টেস্টের ভারসাম্য।',
          difficulty: 'beginner',
          estimatedMinutes: 30,
          prerequisites: ['FOUNDATIONS-PROGRAMMING-VARIABLES'],
          unlocks: ['QA-MANUAL-TEST-DESIGN', 'QA-API-TESTING'],
          related: ['BACKEND-TESTING', 'FLUTTER-TESTING'],
          careers: [C.qa, C.se],
          tags: ['qa', 'testing-pyramid'],
          sources: ['PLAYWRIGHT-DOCS'],
        },
        body: `
## Why the pyramid exists

All E2E suites become slow, flaky, and expensive. Push most checks down to faster layers; reserve E2E for critical user journeys.

## Mental model

<Callout type="mental-model">
  Many unit tests, fewer integration tests, few E2E tests. Each layer catches different failure modes.
</Callout>

Map pyramid layers to your stack (Jest/Vitest, API tests, Playwright). Optimize for signal-to-noise.

${commonFooter({
  mistakes: [
    { title: 'E2E-only strategy', detail: 'Slow CI and flaky failures.' },
    { title: 'No clear ownership', detail: 'Tests rot; delete or fix deliberately.' },
    { title: 'Testing implementation details', detail: 'Brittle suites.' },
  ],
  interview:
    'How would you structure tests for a Nest + Next feature that saves a form?',
  practice: [
    'Classify 10 existing tests into pyramid layers.',
    'Identify one E2E that should be a unit test.',
    'Sketch CI time budgets per layer.',
  ],
  sourceIds: ['PLAYWRIGHT-DOCS'],
})}
`,
      },
      {
        track: 'qa',
        slug: 'qa-manual-test-design',
        meta: {
          id: 'QA-MANUAL-TEST-DESIGN',
          title: 'Manual Test Design',
          titleBn: 'ম্যানুয়াল টেস্ট ডিজাইন',
          description:
            'Charters, boundary cases, and exploratory testing that find real bugs.',
          descriptionBn:
            'চার্টার, বাউন্ডারি কেস ও এক্সপ্লোরেটরি টেস্টিং যা আসল বাগ খুঁজে পায়।',
          difficulty: 'beginner',
          estimatedMinutes: 32,
          prerequisites: ['QA-TESTING-PYRAMID'],
          unlocks: ['QA-API-TESTING', 'QA-PLAYWRIGHT-E2E'],
          related: ['FRONTEND-FORMS-VALIDATION'],
          careers: [C.qa],
          tags: ['qa', 'manual-testing', 'exploratory'],
          sources: ['W3C-WCAG'],
        },
        body: `
## Why manual skill still matters

Automation cannot invent product sense. Exploratory testing finds weird states, unclear copy, and accessibility gaps.

## Mental model

<Callout type="mental-model">
  Design tests from risks: money loss, data loss, auth bypass, corruption, embarrassment. Use boundaries, empty states, and permission matrices.
</Callout>

Write charters: “Explore password reset as a user with 2FA enabled for 60 minutes; note security and UX risks.”

${commonFooter({
  mistakes: [
    { title: 'Only happy-path scripts', detail: 'Bugs live on edges.' },
    { title: 'No bug report structure', detail: 'Steps/expected/actual/env missing.' },
    { title: 'Ignoring accessibility', detail: 'Keyboard and SR issues are defects.' },
  ],
  interview:
    'How do you prioritize what to test when a release window is four hours?',
  practice: [
    'Write a test charter for login.',
    'Build a boundary table for age/quantity fields.',
    'Log a bug with clear reproduction.',
  ],
  sourceIds: ['W3C-WCAG'],
})}
`,
      },
      {
        track: 'qa',
        slug: 'qa-api-testing',
        meta: {
          id: 'QA-API-TESTING',
          title: 'API Testing',
          titleBn: 'API টেস্টিং',
          description:
            'Status codes, schemas, auth, and idempotency checks for backend contracts.',
          descriptionBn:
            'ব্যাকএন্ড কন্ট্রাক্টের জন্য স্ট্যাটাস কোড, স্কিমা, অথ ও আইডেমপোটেন্সি চেক।',
          difficulty: 'intermediate',
          estimatedMinutes: 34,
          prerequisites: ['QA-TESTING-PYRAMID', 'FOUNDATIONS-NETWORKING-TCP-IP-HTTP'],
          unlocks: ['QA-PLAYWRIGHT-E2E'],
          related: ['BACKEND-HTTP-REST-API-DESIGN', 'BACKEND-TESTING'],
          careers: [C.qa, C.be],
          tags: ['qa', 'api', 'http'],
          sources: ['RFC-9110-HTTP'],
        },
        body: `
## Why API tests scale

UI tests are costly. Contract tests against HTTP APIs catch regressions early across web and mobile clients.

## Mental model

<Callout type="mental-model">
  Arrange auth and fixtures → act with HTTP → assert status, headers, body schema, and side effects.
</Callout>

\`\`\`bash
curl -sS -o body.json -w "%{http_code}" \\
  -H "Authorization: Bearer $TOKEN" \\
  https://api.example.com/topics
\`\`\`

Assert negative cases: 401 without token, 403 wrong role, 400 invalid body.

${commonFooter({
  mistakes: [
    { title: 'Only testing 200s', detail: 'Security bugs hide in 401/403.' },
    { title: 'Order-dependent fixtures', detail: 'Tests flake in parallel.' },
    { title: 'Ignoring response schema drift', detail: 'Clients break silently.' },
  ],
  interview:
    'Design API tests for create-topic including authz and validation failures.',
  practice: [
    'Write 5 API cases for one endpoint.',
    'Add JSON schema assertions.',
    'Run them in CI.',
  ],
  sourceIds: ['RFC-9110-HTTP'],
})}
`,
      },
      {
        track: 'qa',
        slug: 'qa-playwright-e2e',
        meta: {
          id: 'QA-PLAYWRIGHT-E2E',
          title: 'Playwright End-to-End Testing',
          titleBn: 'Playwright এন্ড-টু-এন্ড টেস্টিং',
          description:
            'Reliable browser automation with Playwright: locators, traces, and CI.',
          descriptionBn:
            'Playwright দিয়ে নির্ভরযোগ্য ব্রাউজার অটোমেশন: লোকেটর, ট্রেস ও CI।',
          difficulty: 'intermediate',
          estimatedMinutes: 38,
          prerequisites: ['QA-MANUAL-TEST-DESIGN', 'FRONTEND-HTML-SEMANTICS-A11Y'],
          unlocks: [],
          related: ['QA-TESTING-PYRAMID', 'DEVOPS-GITHUB-ACTIONS-CI'],
          careers: [C.qa, C.fe],
          tags: ['playwright', 'e2e', 'qa'],
          sources: ['PLAYWRIGHT-DOCS'],
        },
        body: `
## Why Playwright

Modern web apps need auto-waiting locators, traces for debugging, and multi-browser coverage. Playwright is a strong default for many teams.

## Mental model

<Callout type="mental-model">
  Prefer user-facing locators (role/text/label) over CSS/XPath. Keep E2E flows few and critical. Use traces on failure.
</Callout>

\`\`\`ts
import { test, expect } from '@playwright/test';

test('topics page shows heading', async ({ page }) => {
  await page.goto('/en/topics');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Sleeping instead of waiting for conditions', detail: 'Use Playwright assertions/auto-wait.' },
    { title: 'Selectors tied to styling classes', detail: 'Prefer roles and test ids sparingly.' },
    { title: 'Huge end-to-end coverage goals', detail: 'Keep the top of the pyramid small.' },
  ],
  interview:
    'How do you keep Playwright tests stable in CI?',
  practice: [
    'Install Playwright and write one smoke test.',
    'Capture a trace on failure.',
    'Run headed vs headless locally.',
  ],
  sourceIds: ['PLAYWRIGHT-DOCS'],
})}
`,
      },
    ].map((t) => {
      writeTopic(t.track, t.slug, t.meta, t.body);
      return t;
    }),
  );

  // UI/UX (4)
  const uiux = [
    {
      slug: 'uiux-design-fundamentals',
      meta: {
        id: 'UIUX-DESIGN-FUNDAMENTALS',
        title: 'UI/UX Design Fundamentals',
        titleBn: 'UI/UX ডিজাইন মৌলিক',
        description:
          'User goals, flows, and interface clarity—design as problem solving.',
        descriptionBn:
          'ইউজার গোল, ফ্লো ও ইন্টারফেস স্পষ্টতা—সমস্যা সমাধান হিসেবে ডিজাইন।',
        difficulty: 'beginner',
        estimatedMinutes: 32,
        prerequisites: [],
        unlocks: ['UIUX-VISUAL-HIERARCHY', 'UIUX-USABILITY-HEURISTICS'],
        related: ['FRONTEND-HTML-SEMANTICS-A11Y'],
        careers: [C.ui, C.fe, C.pm],
        tags: ['uiux', 'fundamentals'],
        sources: ['NN-G-HEURISTICS'],
      },
      body: `
## Why pretty ≠ usable

Pixels without user goals become decoration. UX starts with jobs-to-be-done and friction removal.

## Mental model

<Callout type="mental-model">
  Discover intent → map flow → design interface → validate with real users. Visual design supports hierarchy and trust.
</Callout>

${commonFooter({
  mistakes: [
    { title: 'Designing screens before flows', detail: 'Users get lost between pages.' },
    { title: 'Copying trendy UI blindly', detail: 'Context and audience differ.' },
    { title: 'Skipping empty/error states', detail: 'Real usage lives there.' },
  ],
  interview:
    'Walk through how you would redesign a confusing signup flow.',
  practice: [
    'Write user goals for a learning app home.',
    'Sketch a 5-step task flow.',
    'List friction points in an app you use.',
  ],
  sourceIds: ['NN-G-HEURISTICS'],
})}
`,
    },
    {
      slug: 'uiux-visual-hierarchy',
      meta: {
        id: 'UIUX-VISUAL-HIERARCHY',
        title: 'Visual Hierarchy',
        titleBn: 'ভিজ্যুয়াল হায়ারার্কি',
        description:
          'Type, spacing, contrast, and alignment that guide attention without clutter.',
        descriptionBn:
          'টাইপ, স্পেসিং, কনট্রাস্ট ও অ্যালাইনমেন্ট যা বিশৃঙ্খলা ছাড়া মনোযোগ চালায়।',
        difficulty: 'beginner',
        estimatedMinutes: 30,
        prerequisites: ['UIUX-DESIGN-FUNDAMENTALS'],
        unlocks: ['UIUX-FIGMA-BASICS'],
        related: ['FRONTEND-CSS-FLEXBOX-GRID'],
        careers: [C.ui, C.fe],
        tags: ['uiux', 'visual-design'],
        sources: ['NN-G-HEURISTICS'],
      },
      body: `
## Why hierarchy is a UX feature

Users scan. Hierarchy tells them what matters in under a second—especially on mobile.

## Mental model

<Callout type="mental-model">
  One primary action per view. Size/weight/contrast create order. Spacing groups related items (proximity).
</Callout>

${commonFooter({
  mistakes: [
    { title: 'Multiple competing CTAs', detail: 'Decision paralysis.' },
    { title: 'Low contrast text', detail: 'Fails accessibility and skim reading.' },
    { title: 'Inconsistent alignment', detail: 'Looks unfinished; harder to parse.' },
  ],
  interview:
    'How would you improve hierarchy on a dense dashboard screenshot?',
  practice: [
    'Redline spacing on a screenshot.',
    'Reduce a page to one primary CTA.',
    'Check contrast ratios.',
  ],
  sourceIds: ['NN-G-HEURISTICS'],
})}
`,
    },
    {
      slug: 'uiux-figma-basics',
      meta: {
        id: 'UIUX-FIGMA-BASICS',
        title: 'Figma Basics',
        titleBn: 'Figma বেসিক',
        description:
          'Frames, components, auto-layout, and handoff habits for engineering partners.',
        descriptionBn:
          'ফ্রেম, কম্পোনেন্ট, অটো-লেআউট ও ইঞ্জিনিয়ারিং হ্যান্ডঅফ অভ্যাস।',
        difficulty: 'beginner',
        estimatedMinutes: 34,
        prerequisites: ['UIUX-VISUAL-HIERARCHY'],
        unlocks: ['UIUX-USABILITY-HEURISTICS'],
        related: ['FRONTEND-CSS-FLEXBOX-GRID'],
        careers: [C.ui, C.fe],
        tags: ['figma', 'uiux', 'tools'],
        sources: ['FIGMA-HELP'],
      },
      body: `
## Why Figma is a collaboration surface

Design files are contracts: spacing, states, and components. Poor structure creates implementation guesswork.

## Mental model

<Callout type="mental-model">
  Frames ≈ screens. Components ≈ reusable UI. Auto-layout ≈ flexbox constraints. Variants encode states.
</Callout>

Name layers; include empty/loading/error; provide redlines or tokens for engineers.

${commonFooter({
  mistakes: [
    { title: 'Detached components everywhere', detail: 'Inconsistent UI debt.' },
    { title: 'No spacing system', detail: 'Magic numbers in code.' },
    { title: 'Missing interactive states', detail: 'Hover/focus/disabled forgotten.' },
  ],
  interview:
    'How do you structure a Figma file for a multi-page product?',
  practice: [
    'Build a button component with variants.',
    'Use auto-layout for a nav bar.',
    'Prepare a simple handoff frame.',
  ],
  sourceIds: ['FIGMA-HELP'],
})}
`,
    },
    {
      slug: 'uiux-usability-heuristics',
      meta: {
        id: 'UIUX-USABILITY-HEURISTICS',
        title: 'Usability Heuristics',
        titleBn: 'ইউজেবিলিটি হিউরিস্টিকস',
        description:
          'Nielsen’s heuristics as a practical review checklist for interfaces.',
        descriptionBn:
          'ইন্টারফেস রিভিউয়ের ব্যবহারিক চেকলিস্ট হিসেবে Nielsen-এর হিউরিস্টিকস।',
        difficulty: 'intermediate',
        estimatedMinutes: 32,
        prerequisites: ['UIUX-DESIGN-FUNDAMENTALS'],
        unlocks: [],
        related: ['FRONTEND-HTML-SEMANTICS-A11Y', 'QA-MANUAL-TEST-DESIGN'],
        careers: [C.ui, C.qa, C.fe],
        tags: ['usability', 'heuristics', 'uiux'],
        sources: ['NN-G-HEURISTICS'],
      },
      body: `
## Why heuristics accelerate reviews

You cannot always run a full study. Heuristics catch recurring usability failures early.

## Mental model

<Callout type="mental-model">
  Visibility of system status, match to the real world, user control, consistency, error prevention, recognition over recall, flexibility, aesthetic minimalism, help recover from errors, help/docs.
</Callout>

Use them as structured critique—not dogma. Cite specific screens and severity.

${commonFooter({
  mistakes: [
    { title: 'Treating heuristics as taste opinions', detail: 'Tie to user impact.' },
    { title: 'Ignoring error recovery', detail: 'Dead ends create support load.' },
    { title: 'Inconsistent patterns across pages', detail: 'Raises cognitive load.' },
  ],
  interview:
    'Pick three heuristics and audit a checkout page aloud.',
  practice: [
    'Heuristic-evaluate a public website.',
    'File findings with severity.',
    'Propose one fix per critical issue.',
  ],
  sourceIds: ['NN-G-HEURISTICS'],
})}
`,
    },
  ];
  for (const t of uiux) {
    writeTopic('uiux', t.slug, t.meta, t.body);
    files.push(t);
  }

  // Project management (4)
  const pm = [
    {
      slug: 'pm-software-delivery',
      meta: {
        id: 'PM-SOFTWARE-DELIVERY',
        title: 'Software Delivery Basics',
        titleBn: 'সফটওয়্যার ডেলিভারি বেসিক',
        description:
          'From problem statement to shipped increment—delivery as a learning loop.',
        descriptionBn:
          'সমস্যার বিবৃতি থেকে শিপড ইনক্রিমেন্ট—শেখার লুপ হিসেবে ডেলিভারি।',
        difficulty: 'beginner',
        estimatedMinutes: 30,
        prerequisites: [],
        unlocks: ['PM-AGILE-SCRUM', 'PM-ESTIMATION-RISK'],
        related: ['FOUNDATIONS-GIT-FUNDAMENTALS'],
        careers: [C.pm, C.se, C.fs],
        tags: ['project-management', 'delivery'],
        sources: ['SCRUM-GUIDE'],
      },
      body: `
## Why delivery is not “write all the code”

Software projects fail from unclear outcomes, invisible risk, and giant batches. Small shipped increments create feedback.

## Mental model

<Callout type="mental-model">
  Outcome → bets/options → build thin slice → measure → adapt. Prefer reducing batch size over heroic deadlines.
</Callout>

${commonFooter({
  mistakes: [
    { title: 'Outputs over outcomes', detail: 'Features shipped ≠ problem solved.' },
    { title: 'Big-bang releases', detail: 'Risk concentrates at the end.' },
    { title: 'No definition of done', detail: '“Almost finished” forever.' },
  ],
  interview:
    'How do you define done for a user-facing feature including QA and docs?',
  practice: [
    'Write an outcome statement for a learning feature.',
    'Slice a project into vertical increments.',
    'List risks for a release.',
  ],
  sourceIds: ['SCRUM-GUIDE'],
})}
`,
    },
    {
      slug: 'pm-agile-scrum',
      meta: {
        id: 'PM-AGILE-SCRUM',
        title: 'Agile and Scrum Essentials',
        titleBn: 'Agile ও Scrum এর প্রয়োজনীয় বিষয়',
        description:
          'Roles, events, and artifacts—what Scrum optimizes for (and what it is not).',
        descriptionBn:
          'রোল, ইভেন্ট ও আর্টিফ্যাক্ট—Scrum কী অপটিমাইজ করে (এবং কী নয়)।',
        difficulty: 'beginner',
        estimatedMinutes: 34,
        prerequisites: ['PM-SOFTWARE-DELIVERY'],
        unlocks: ['PM-TOOLING-JIRA-GITHUB'],
        related: ['PM-ESTIMATION-RISK'],
        careers: [C.pm, C.se],
        tags: ['scrum', 'agile', 'pm'],
        sources: ['SCRUM-GUIDE'],
      },
      body: `
## Why Scrum exists

Complex product work needs empirical control: inspect and adapt frequently with a potentially releasable Increment.

## Mental model

<Callout type="mental-model">
  Product Owner maximizes value. Developers deliver the Increment. Scrum Master fosters the framework. Sprint is a fixed container for learning.
</Callout>

Read the official Scrum Guide; beware cargo-cult ceremonies without empiricism.

${commonFooter({
  mistakes: [
    { title: 'Scrum as status meeting theater', detail: 'No adaptation follows.' },
    { title: 'Skipping Definition of Done', detail: 'Undone work piles up.' },
    { title: 'Changing sprint scope constantly', detail: 'Destroys focus—manage via Product Backlog.' },
  ],
  interview:
    'Explain Scrum accountabilities and how a Sprint Review differs from a status update.',
  practice: [
    'Map your team’s events to Scrum purposes.',
    'Draft a Definition of Done.',
    'Write three backlog items as outcomes.',
  ],
  sourceIds: ['SCRUM-GUIDE'],
})}
`,
    },
    {
      slug: 'pm-estimation-risk',
      meta: {
        id: 'PM-ESTIMATION-RISK',
        title: 'Estimation and Risk',
        titleBn: 'এস্টিমেশন ও রিস্ক',
        description:
          'Uncertainty, ranges, and risk registers—planning without false precision.',
        descriptionBn:
          'অনিশ্চয়তা, রেঞ্জ ও রিস্ক রেজিস্টার—মিথ্যা নির্ভুলতা ছাড়া পরিকল্পনা।',
        difficulty: 'intermediate',
        estimatedMinutes: 32,
        prerequisites: ['PM-SOFTWARE-DELIVERY'],
        unlocks: ['PM-TOOLING-JIRA-GITHUB'],
        related: ['PM-AGILE-SCRUM'],
        careers: [C.pm, C.se],
        tags: ['estimation', 'risk', 'pm'],
        sources: ['SCRUM-GUIDE'],
      },
      body: `
## Why point estimates lie

Unknowns dominate early work. Communicate ranges, assumptions, and risks—not fake certainty.

## Mental model

<Callout type="mental-model">
  Estimate size/uncertainty separately from commitments. Track risks by likelihood × impact and mitigation owners.
</Callout>

${commonFooter({
  mistakes: [
    { title: 'Commitment = wishful date', detail: 'Separate forecasts from promises.' },
    { title: 'Ignoring integration risk', detail: 'Last-mile surprises.' },
    { title: 'No buffer for learning spikes', detail: 'Unknown tech needs discovery time.' },
  ],
  interview:
    'A stakeholder wants a fixed date for an ambiguous feature—how do you respond?',
  practice: [
    'Estimate with a range and assumptions list.',
    'Create a mini risk register.',
    'Time-box a spike.',
  ],
  sourceIds: ['SCRUM-GUIDE'],
})}
`,
    },
    {
      slug: 'pm-tooling-jira-github',
      meta: {
        id: 'PM-TOOLING-JIRA-GITHUB',
        title: 'Delivery Tooling: Jira and GitHub',
        titleBn: 'ডেলিভারি টুলিং: Jira ও GitHub',
        description:
          'Issues, PRs, and boards—tooling that supports flow instead of bureaucracy.',
        descriptionBn:
          'ইস্যু, PR ও বোর্ড—আমলাতন্ত্র নয়, ফ্লো সাপোর্ট করে এমন টুলিং।',
        difficulty: 'beginner',
        estimatedMinutes: 28,
        prerequisites: ['PM-AGILE-SCRUM', 'FOUNDATIONS-GIT-FUNDAMENTALS'],
        unlocks: [],
        related: ['DEVOPS-GITHUB-ACTIONS-CI'],
        careers: [C.pm, C.se, C.devops],
        tags: ['jira', 'github', 'tooling'],
        sources: ['GIT-SCM-BOOK', 'GHA-WORKFLOWS'],
      },
      body: `
## Why tools should reduce WIP mystery

Boards and PRs make work visible. Over-customized workflows hide flow problems behind fields.

## Mental model

<Callout type="mental-model">
  One work item ≈ one reviewable change when possible. Link PR ↔ issue. CI status is part of “done.”
</Callout>

Prefer simple columns (To do / Doing / In review / Done). Measure cycle time lightly.

${commonFooter({
  mistakes: [
    { title: 'Ticket sprawl without outcomes', detail: 'Busywork masquerades as progress.' },
    { title: 'PRs without context', detail: 'Reviewers guess intent.' },
    { title: 'Bypassing CI to “save time”', detail: 'Pays later in incidents.' },
  ],
  interview:
    'How do you keep Jira and GitHub linked without creating admin overhead?',
  practice: [
    'Write a PR description template.',
    'Map board columns to real states.',
    'Close the loop: issue → PR → deploy note.',
  ],
  sourceIds: ['GIT-SCM-BOOK', 'GHA-WORKFLOWS'],
})}
`,
    },
  ];
  for (const t of pm) {
    writeTopic('project-management', t.slug, t.meta, t.body);
    files.push(t);
  }

  // Fullstack (4)
  const fullstack = [
    {
      slug: 'fullstack-architecture-overview',
      meta: {
        id: 'FULLSTACK-ARCHITECTURE-OVERVIEW',
        title: 'Full-Stack Architecture Overview',
        titleBn: 'ফুলস্ট্যাক আর্কিটেকচার ওভারভিউ',
        description:
          'How Next.js, NestJS, Postgres, and Redis fit into one coherent system.',
        descriptionBn:
          'Next.js, NestJS, Postgres ও Redis একটা সুসংগত সিস্টেমে কীভাবে বসে।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: [
          'FRONTEND-NEXTJS-APP-ROUTER-BASICS',
          'BACKEND-NESTJS-ARCHITECTURE',
          'BACKEND-POSTGRESQL-WITH-BACKEND',
        ],
        unlocks: ['FULLSTACK-AUTH-ACROSS-STACK', 'FULLSTACK-DATA-FLOW'],
        related: ['BACKEND-REDIS-CACHING'],
        careers: [C.fs, C.se],
        tags: ['fullstack', 'architecture'],
        sources: ['NEXTJS-APP-ROUTER', 'NESTJS-ARCHITECTURE', 'POSTGRES-DOCS'],
      },
      body: `
## Why full-stack is integration skill

Knowing React *and* Nest is not enough—you must define boundaries: who owns auth, who owns source of truth, how failures surface.

## Mental model

<Callout type="mental-model">
  Browser → Next (UI + BFF) → Nest (domain API) → Postgres (system of record) → Redis (acceleration). Arrows are contracts with latency and failure modes.
</Callout>

Prefer clear module ownership over “everyone writes everywhere.”

${commonFooter({
  mistakes: [
    { title: 'Business logic only in the UI', detail: 'Mobile/other clients diverge.' },
    { title: 'Two sources of truth', detail: 'Cache/UI state fights DB.' },
    { title: 'Chatty UI→DB coupling', detail: 'Keep persistence behind API.' },
  ],
  interview:
    'Draw a sequence diagram for loading a topic page in this stack.',
  practice: [
    'Sketch component diagram for Dev Turning Point.',
    'List contracts between Next and Nest.',
    'Identify one cacheable read.',
  ],
  sourceIds: ['NEXTJS-APP-ROUTER', 'NESTJS-ARCHITECTURE', 'POSTGRES-DOCS'],
})}
`,
    },
    {
      slug: 'fullstack-auth-across-stack',
      meta: {
        id: 'FULLSTACK-AUTH-ACROSS-STACK',
        title: 'Auth Across the Stack',
        titleBn: 'স্ট্যাক জুড়ে অথেন্টিকেশন',
        description:
          'Sessions/JWT, BFF cookies, and server-side verification spanning Next and Nest.',
        descriptionBn:
          'Session/JWT, BFF কুকি, এবং Next ও Nest জুড়ে সার্ভার-সাইড ভেরিফিকেশন।',
        difficulty: 'advanced',
        estimatedMinutes: 42,
        prerequisites: [
          'FULLSTACK-ARCHITECTURE-OVERVIEW',
          'BACKEND-NESTJS-AUTH-JWT',
          'FOUNDATIONS-SECURITY-FUNDAMENTALS',
        ],
        unlocks: ['FULLSTACK-DEPLOYMENT-PIPELINE'],
        related: ['NEXTJS-AUTH', 'FRONTEND-FORMS-VALIDATION'],
        careers: [C.fs, C.be, C.fe],
        tags: ['auth', 'fullstack', 'security'],
        sources: ['NEXTJS-AUTH', 'NESTJS-AUTH', 'OWASP-TOP10'],
      },
      body: `
## Why auth spans every layer

A token in the browser is not security. Verification and authorization must happen on trusted servers—repeatedly.

## Mental model

<Callout type="mental-model">
  Common web pattern: browser talks to Next route handlers; tokens live in httpOnly cookies; Nest verifies JWTs on API calls; authorization checks resource ownership.
</Callout>

Follow Next.js authentication guidance for server-side session checks; follow Nest auth docs for guards/strategies. Prefer short-lived access tokens.

${commonFooter({
  mistakes: [
    { title: 'Trusting middleware alone', detail: 'Re-verify in data access paths.' },
    { title: 'Storing long-lived tokens in localStorage', detail: 'XSS amplification.' },
    { title: 'Authz only on UI routes', detail: 'APIs must enforce too.' },
  ],
  interview:
    'Design login for Next + Nest with refresh tokens and CSRF considerations.',
  practice: [
    'Map where verification occurs in your app.',
    'List cookie flags you need (HttpOnly, Secure, SameSite).',
    'Write an IDOR test case.',
  ],
  sourceIds: ['NEXTJS-AUTH', 'NESTJS-AUTH', 'OWASP-TOP10'],
})}
`,
    },
    {
      slug: 'fullstack-data-flow',
      meta: {
        id: 'FULLSTACK-DATA-FLOW',
        title: 'Full-Stack Data Flow',
        titleBn: 'ফুলস্ট্যাক ডেটা ফ্লো',
        description:
          'Reads/writes from UI to DB—caching, invalidation, and consistency UX.',
        descriptionBn:
          'UI থেকে DB পর্যন্ত রিড/রাইট—ক্যাশিং, ইনভ্যালিডেশন ও কনসিস্টেন্সি UX।',
        difficulty: 'intermediate',
        estimatedMinutes: 38,
        prerequisites: ['FULLSTACK-ARCHITECTURE-OVERVIEW', 'BACKEND-REDIS-CACHING'],
        unlocks: ['FULLSTACK-DEPLOYMENT-PIPELINE'],
        related: ['DATABASE-POSTGRESQL-TRANSACTIONS'],
        careers: [C.fs, C.be, C.fe],
        tags: ['data-flow', 'caching', 'fullstack'],
        sources: ['REDIS-DATA-TYPES', 'POSTGRES-DOCS', 'NEXTJS-APP-ROUTER'],
      },
      body: `
## Why data flow diagrams prevent bugs

Most production bugs are stale reads, double writes, or optimistic UI that never reconciles.

## Mental model

<Callout type="mental-model">
  Write path: validate → persist transactionally → invalidate caches → return DTO → update client state. Read path: try cache → DB → optionally populate cache.
</Callout>

Show pending/success/error states; reconcile with server truth after mutations.

${commonFooter({
  mistakes: [
    { title: 'Optimistic UI without rollback', detail: 'Users see lies forever.' },
    { title: 'Cache invalidation as afterthought', detail: 'Editors see old content.' },
    { title: 'Duplicate writes from double submits', detail: 'Idempotency keys help.' },
  ],
  interview:
    'Describe cache invalidation after an editor updates a topic title.',
  practice: [
    'Sequence-diagram a create-topic flow.',
    'Add idempotency to a POST.',
    'List client states for a mutation.',
  ],
  sourceIds: ['REDIS-DATA-TYPES', 'POSTGRES-DOCS', 'NEXTJS-APP-ROUTER'],
})}
`,
    },
    {
      slug: 'fullstack-deployment-pipeline',
      meta: {
        id: 'FULLSTACK-DEPLOYMENT-PIPELINE',
        title: 'Full-Stack Deployment Pipeline',
        titleBn: 'ফুলস্ট্যাক ডিপ্লয়মেন্ট পাইপলাইন',
        description:
          'CI checks, migrations, frontend/backend deploys, and rollback thinking.',
        descriptionBn:
          'CI চেক, মাইগ্রেশন, ফ্রন্ট/ব্যাক ডিপ্লয়, এবং রোলব্যাক চিন্তা।',
        difficulty: 'advanced',
        estimatedMinutes: 40,
        prerequisites: [
          'DEVOPS-GITHUB-ACTIONS-CI',
          'BACKEND-DOCKER-DEPLOY',
          'FULLSTACK-AUTH-ACROSS-STACK',
        ],
        unlocks: [],
        related: ['DEVOPS-OBSERVABILITY-PROMETHEUS-GRAFANA', 'PM-SOFTWARE-DELIVERY'],
        careers: [C.fs, C.devops, C.be],
        tags: ['deployment', 'ci-cd', 'fullstack'],
        sources: ['GHA-WORKFLOWS', 'DOCKER-GET-STARTED'],
      },
      body: `
## Why pipelines are part of architecture

If deploys are manual folklore, quality gates evaporate. Automate build/test/migrate/release with clear rollback.

## Mental model

<Callout type="mental-model">
  PR CI (fast checks) → main CI (build images) → migrate carefully → deploy backend → deploy frontend → verify smoke → watch metrics.
</Callout>

Expand/contract migrations when frontend and backend versions briefly coexist.

${commonFooter({
  mistakes: [
    { title: 'Migrating in ways that break old servers immediately', detail: 'Use expand/contract.' },
    { title: 'No smoke tests post-deploy', detail: 'Discover outages via users.' },
    { title: 'Deploying secrets via chat', detail: 'Use secret stores/CI secrets.' },
  ],
  interview:
    'How do you deploy a breaking API change safely with a web client?',
  practice: [
    'Draft a GitHub Actions deploy workflow outline.',
    'Write a migration expand/contract plan.',
    'Define smoke checks after release.',
  ],
  sourceIds: ['GHA-WORKFLOWS', 'DOCKER-GET-STARTED'],
})}
`,
    },
  ];
  for (const t of fullstack) {
    t.meta.related = (t.meta.related || []).filter((id) => id !== 'NEXTJS-AUTH');
    writeTopic('fullstack', t.slug, t.meta, t.body);
    files.push(t);
  }

  return files.length;
}
