export type TrackPriority = 'P0' | 'P1';

export interface Track {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  summary: string;
  summaryBn: string;
  primaryStack: string[];
  goalSkillIds: string[];
  relatedCareerIds: string[];
  priority: TrackPriority;
}

export const tracks: Track[] = [
  {
    id: 'foundations',
    slug: 'foundations',
    title: 'Foundations',
    titleBn: 'মৌলিক জ্ঞান',
    summary:
      'Core computing, programming, networking, Git, and security fundamentals that every specialized track builds on.',
    summaryBn:
      'কম্পিউটিং, প্রোগ্রামিং, নেটওয়ার্কিং, Git এবং সিকিউরিটির মৌলিক বিষয়—যে কোনো বিশেষায়িত ট্র্যাকের আগে দরকার।',
    primaryStack: ['Computing', 'Programming', 'OS', 'Networking', 'Git', 'Security'],
    goalSkillIds: [
      'FOUNDATIONS-BINARY',
      'FOUNDATIONS-DATA-STRUCTURES',
      'FOUNDATIONS-ALGORITHMS',
      'FOUNDATIONS-GIT',
      'FOUNDATIONS-HTTP',
      'FOUNDATIONS-SECURITY-BASICS',
    ],
    relatedCareerIds: ['software-engineer', 'backend-engineer', 'frontend-engineer'],
    priority: 'P0',
  },
  {
    id: 'mobile-flutter',
    slug: 'mobile-flutter',
    title: 'Mobile Development (Flutter)',
    titleBn: 'মোবাইল ডেভেলপমেন্ট (Flutter)',
    summary:
      'Build cross-platform apps with Dart and Flutter—from widgets and state to networking, testing, and store deployment.',
    summaryBn:
      'Dart ও Flutter দিয়ে ক্রস-প্ল্যাটফর্ম অ্যাপ—widget, state, networking, testing এবং স্টোর ডিপ্লয়মেন্ট পর্যন্ত।',
    primaryStack: ['Dart', 'Flutter'],
    goalSkillIds: [
      'MOBILE-DART-BASICS',
      'MOBILE-FLUTTER-WIDGETS',
      'MOBILE-FLUTTER-STATE',
      'MOBILE-FLUTTER-NETWORKING',
      'MOBILE-FLUTTER-TESTING',
      'MOBILE-FLUTTER-SECURITY',
      'MOBILE-FLUTTER-DEPLOYMENT',
    ],
    relatedCareerIds: ['mobile-engineer', 'flutter-developer'],
    priority: 'P0',
  },
  {
    id: 'frontend',
    slug: 'frontend',
    title: 'Frontend Development',
    titleBn: 'ফ্রন্টএন্ড ডেভেলপমেন্ট',
    summary:
      'HTML, CSS, JavaScript, TypeScript, React, and Next.js—foundations before frameworks, then production UI skills.',
    summaryBn:
      'HTML, CSS, JavaScript, TypeScript, React ও Next.js—ফ্রেমওয়ার্কের আগে ভিত্তি, তারপর প্রোডাকশন UI দক্ষতা।',
    primaryStack: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js'],
    goalSkillIds: [
      'FRONTEND-HTML',
      'FRONTEND-CSS',
      'FRONTEND-JAVASCRIPT',
      'FRONTEND-TYPESCRIPT',
      'FRONTEND-REACT',
      'FRONTEND-NEXTJS',
    ],
    relatedCareerIds: ['frontend-engineer', 'fullstack-engineer'],
    priority: 'P0',
  },
  {
    id: 'backend',
    slug: 'backend',
    title: 'Backend Development',
    titleBn: 'ব্যাকএন্ড ডেভেলপমেন্ট',
    summary:
      'TypeScript on Node.js with NestJS, PostgreSQL, Redis, auth, testing, and production API engineering.',
    summaryBn:
      'Node.js-এ TypeScript, NestJS, PostgreSQL, Redis, auth, testing এবং প্রোডাকশন API ইঞ্জিনিয়ারিং।',
    primaryStack: ['TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Redis'],
    goalSkillIds: [
      'BACKEND-NODE',
      'BACKEND-NESTJS',
      'BACKEND-AUTH',
      'BACKEND-POSTGRES',
      'BACKEND-REDIS',
      'BACKEND-TESTING',
    ],
    relatedCareerIds: ['backend-engineer', 'fullstack-engineer'],
    priority: 'P0',
  },
  {
    id: 'fullstack',
    slug: 'fullstack',
    title: 'Full-Stack Development',
    titleBn: 'ফুল-স্ট্যাক ডেভেলপমেন্ট',
    summary:
      'Integrate React/Next.js with NestJS, PostgreSQL, and Redis—APIs, auth, SSR boundaries, and end-to-end delivery.',
    summaryBn:
      'React/Next.js, NestJS, PostgreSQL ও Redis একসাথে—API, auth, SSR সীমানা এবং এন্ড-টু-এন্ড ডেলিভারি।',
    primaryStack: ['TypeScript', 'React', 'Next.js', 'Node.js', 'NestJS', 'PostgreSQL', 'Redis'],
    goalSkillIds: [
      'FRONTEND-NEXTJS',
      'BACKEND-NESTJS',
      'BACKEND-POSTGRES',
      'BACKEND-AUTH',
      'DEVOPS-DOCKER',
      'FULLSTACK-INTEGRATION',
    ],
    relatedCareerIds: ['fullstack-engineer', 'frontend-engineer', 'backend-engineer'],
    priority: 'P1',
  },
  {
    id: 'devops',
    slug: 'devops',
    title: 'DevOps / Cloud',
    titleBn: 'DevOps / ক্লাউড',
    summary:
      'Linux, bash, Docker/Compose, CI/CD, AWS IAM, IaC, Kubernetes/Helm, and observability/SRE habits—prerequisite-first.',
    summaryBn:
      'Linux, bash, Docker/Compose, CI/CD, AWS IAM, IaC, Kubernetes/Helm ও observability/SRE অভ্যাস—পূর্বশর্ত আগে।',
    primaryStack: ['Linux', 'Docker', 'CI/CD', 'AWS', 'Kubernetes', 'Terraform'],
    goalSkillIds: [
      'DEVOPS-LINUX',
      'DEVOPS-DOCKER',
      'DEVOPS-CICD',
      'DEVOPS-AWS',
      'DEVOPS-KUBERNETES',
      'DEVOPS-OBSERVABILITY',
      'DEVOPS-SLO',
    ],
    relatedCareerIds: ['devops-engineer', 'sre'],
    priority: 'P0',
  },
  {
    id: 'database',
    slug: 'database',
    title: 'Database Engineering',
    titleBn: 'ডেটাবেস ইঞ্জিনিয়ারিং',
    summary:
      'Relational modeling, SQL/CTEs, Postgres indexing/EXPLAIN/transactions, Redis patterns, and document-store decision making.',
    summaryBn:
      'রিলেশনাল মডেলিং, SQL/CTE, Postgres indexing/EXPLAIN/transactions, Redis প্যাটার্ন ও document-store সিদ্ধান্ত।',
    primaryStack: ['SQL', 'PostgreSQL', 'Redis', 'MongoDB'],
    goalSkillIds: [
      'DATABASE-SQL',
      'DATABASE-POSTGRES-INDEXING',
      'DATABASE-TRANSACTIONS',
      'DATABASE-EXPLAIN',
      'DATABASE-REDIS',
      'DATABASE-BACKUP-REPLICATION',
      'DATABASE-CTES',
    ],
    relatedCareerIds: ['database-engineer', 'backend-engineer'],
    priority: 'P0',
  },
  {
    id: 'qa',
    slug: 'qa',
    title: 'QA / Software Testing',
    titleBn: 'QA / সফটওয়্যার টেস্টিং',
    summary:
      'STLC, test design, API testing, Playwright automation, performance basics, and CI-integrated quality gates.',
    summaryBn:
      'STLC, টেস্ট ডিজাইন, API testing, Playwright অটোমেশন, পারফরম্যান্স বেসিক এবং CI কোয়ালিটি গেট।',
    primaryStack: ['Manual Testing', 'API Testing', 'Playwright', 'CI'],
    goalSkillIds: [
      'QA-STLC',
      'QA-TEST-DESIGN',
      'QA-API-TESTING',
      'QA-PLAYWRIGHT',
      'QA-PERFORMANCE',
      'QA-CI-INTEGRATION',
    ],
    relatedCareerIds: ['qa-engineer', 'sdet'],
    priority: 'P1',
  },
  {
    id: 'uiux',
    slug: 'uiux',
    title: 'UI/UX / Product Design',
    titleBn: 'UI/UX / প্রোডাক্ট ডিজাইন',
    summary:
      'Visual and UX fundamentals first; Figma as the practical tool for components, prototyping, and handoff.',
    summaryBn:
      'আগে ভিজ্যুয়াল ও UX ভিত্তি; Figma দিয়ে component, prototyping এবং ডেভেলপার হ্যান্ডঅফ।',
    primaryStack: ['Visual Design', 'UX', 'Figma', 'Design Systems'],
    goalSkillIds: [
      'UIUX-VISUAL-FUNDAMENTALS',
      'UIUX-UX-RESEARCH',
      'UIUX-WIREFRAMING',
      'UIUX-FIGMA',
      'UIUX-DESIGN-SYSTEMS',
      'UIUX-A11Y',
    ],
    relatedCareerIds: ['uiux-designer', 'product-designer'],
    priority: 'P1',
  },
  {
    id: 'project-management',
    slug: 'project-management',
    title: 'Software Project Management',
    titleBn: 'সফটওয়্যার প্রজেক্ট ম্যানেজমেন্ট',
    summary:
      'Software delivery lifecycle, Agile/Scrum/Kanban, estimation, risk, stakeholders, and delivery tooling.',
    summaryBn:
      'সফটওয়্যার ডেলিভারি লাইফসাইকেল, Agile/Scrum/Kanban, estimation, ঝুঁকি, stakeholder এবং ডেলিভারি টুলিং।',
    primaryStack: ['SDLC', 'Agile', 'Scrum', 'Kanban', 'Jira'],
    goalSkillIds: [
      'PM-SDLC',
      'PM-AGILE',
      'PM-SCRUM',
      'PM-ESTIMATION',
      'PM-JIRA',
      'PM-RISK',
    ],
    relatedCareerIds: ['project-manager', 'scrum-master', 'engineering-manager'],
    priority: 'P1',
  },
  {
    id: 'ai-framework',
    slug: 'ai-framework',
    title: 'AI and Framework',
    titleBn: 'AI এবং Framework',
    summary:
      'Learn AI from fundamentals to production: LLMs, prompting, coding agents, RAG, embeddings, tool calling, agents, MCP, open models, frameworks, evaluation, security, and safe AI-assisted engineering.',
    summaryBn:
      'মৌলিক থেকে প্রোডাকশন পর্যন্ত AI: LLM, prompting, coding agent, RAG, embedding, tool calling, agent, MCP, open model, framework, evaluation, security এবং নিরাপদ AI-assisted engineering।',
    primaryStack: ['LLMs', 'Prompting', 'RAG', 'Agents', 'MCP', 'Evaluation'],
    goalSkillIds: [
      'AI-LLM-FUNDAMENTALS',
      'AI-PROMPT-ENGINEERING',
      'AI-CODING-AGENTS',
      'AI-RAG',
      'AI-TOOL-CALLING',
      'AI-EVALUATION',
      'AI-SECURITY',
    ],
    relatedCareerIds: ['software-engineer', 'fullstack-engineer', 'backend-engineer'],
    priority: 'P0',
  },
];

export const tracksById = Object.fromEntries(tracks.map((t) => [t.id, t])) as Record<
  string,
  Track
>;

export const tracksBySlug = Object.fromEntries(tracks.map((t) => [t.slug, t])) as Record<
  string,
  Track
>;

export function getTrack(idOrSlug: string): Track | undefined {
  return tracksById[idOrSlug] ?? tracksBySlug[idOrSlug];
}
