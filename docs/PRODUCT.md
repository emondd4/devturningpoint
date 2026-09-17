# Product Specification — Dev Turning Point (V1)

## Vision

Dev Turning Point is an open-source, bilingual (English/Bangla) educational platform for students, junior engineers, career switchers, self-taught developers, and technology professionals—initially focused on Bangladesh.

It helps learners answer foundational and practical questions about computing, careers, skills, prerequisites, personalized learning paths, interviews, projects, and employment-relevant technologies.

## Positioning

The product combines ideas from technical documentation, career roadmaps, interactive skill graphs, learning platforms, engineering handbooks, and interview prep—while maintaining its own clean identity. It is **not** a clone of any existing site.

## Core principles

1. **Static-first, Git-native** — Educational content lives in the repository. No runtime content database in V1.
2. **Prerequisite-first** — Never recommend advanced topics without clarifying required foundations.
3. **Why before how** — Mental models before command memorization.
4. **Source-backed** — Factual claims cite sources; time-sensitive data shows `lastVerified`.
5. **People-first content** — Depth over page count; no thin SEO filler.
6. **Local progress** — No accounts; preferences in localStorage; structured progress in IndexedDB.
7. **Bilingual parity** — EN and BN share the same canonical content IDs.

## Out of scope (V1)

- Runtime databases / CMS / auth servers
- **Runtime** LLM APIs, AI research bots, automated content pipelines, crawlers, or scheduled research jobs for the website itself
- Scrapers or scheduled research jobs that publish content
- User accounts / cloud sync (export/import JSON only)

Development-time internet research by contributors is allowed. Published educational content remains **static Git content**. The website must not require AI API keys for ordinary browsing.

## Primary audiences

| Audience | Needs |
|----------|--------|
| Students | Computing blueprint, foundations, career orientation |
| Juniors | Skill graphs, assessments, interview prep, projects |
| Career switchers | Role explanations, personalized roadmaps |
| Self-taught developers | Structured tracks, troubleshooting, real-world usage |
| BD tech professionals | Local market notes, company context, relevant stacks |

## Languages

- English: `/en/...`
- Bangla: `/bn/...`
- Shared canonical IDs (e.g. `DEVOPS-DOCKER-NETWORKING`)
- Language switcher, `hreflang`, persistent preference, translation status
- Bangla keeps widely understood technical terms (API, Docker, React, etc.)

## Major product surfaces

1. **Landing** — Clear education-focused hero and CTAs
2. **Computing blueprint** — Visual map of hardware → software → careers
3. **History / evolution** — Timeline of computing transitions with sources
4. **Career directory** — Roles relevant to Bangladesh, normalized titles
5. **Company directory** — Featured BD tech employers + sourced achievements
6. **Job-market summary** — Static aggregated sample with methodology/limitations
7. **Learning tracks** — Foundations, Mobile (Flutter), Frontend, Backend, Full-Stack, DevOps/Cloud, Database, QA, UI/UX, Project Management, **AI and Framework**
8. **Skill graph** — Structured prerequisites / unlocks (data-driven)
9. **Assessment** — Deterministic mapping to skill IDs → personalized roadmap
10. **Topic pages** — Deep MDX articles with TOC, sources, progress
11. **Interviews & projects** — Quality over quantity; Core + Market Alternative projects per level
12. **AI tooling literacy** — Tool catalog, prompt recipes, Cursor labs, verification playbook (static)
13. **Search** — Pagefind static search
14. **My Learning** — Local dashboard, continue learning, export/import
15. **Policies & contribute** — Privacy, methodology, AI disclosure, contribution guides

## Learning tracks (V1)

| Track | Primary stack / focus | Priority |
|-------|----------------------|----------|
| Foundations | Computing, programming, OS, networking, Git, security basics | P0 |
| Mobile | Dart + Flutter | P0 |
| Frontend | HTML → CSS → JS → TS → React → Next.js | P0 |
| Backend | TS → Node → NestJS → PostgreSQL → Redis | P0 |
| DevOps / Cloud | Linux → Docker → CI/CD → AWS → K8s (prereq-first) | P0 |
| Database | PostgreSQL primary; Redis; MongoDB when appropriate | P0 |
| Full-Stack | Integrated React/Next + Nest + Postgres + Redis | P1 |
| QA | Manual → API → Playwright → performance / CI | P1 |
| UI/UX | Visual + UX fundamentals; Figma as tool | P1 |
| Project Management | Software delivery, Agile/Scrum, tooling | P1 |
| **AI and Framework** | LLMs, prompting, coding agents, RAG, tools/MCP, evaluation, security | P0 |

## Project-Based Learning

Each specialized track (except AI) targets:

- **Beginner / Intermediate / Advanced** levels
- At each level: **one Core project** + **one Market Alternative project**
- Learners are **not** required to complete every project

AI and Framework targets **3 projects per level** (9 total) covering prompt labs, Cursor workflows, RAG, agents/MCP, and production copilots.

Progress uses stable project/milestone IDs in IndexedDB (no login).

## AI product principles

1. Teach **problem → tool**, never popularity rankings.
2. Prefer official docs/specs; show `lastVerified`.
3. Verify AI-generated code with evidence—never trust “tests passed” claims alone.
4. Role workflows must not fabricate research findings, stakeholder approvals, or project outcomes.
5. Optional learner-side API/local models for AI *projects* only; site browsing stays static.

## Personalization model

1. Learner selects a track.
2. Completes assessment (confidence, MCQ, conceptual, scenario, code-reading).
3. System maps answers → demonstrated / uncertain / missing skills.
4. Graph utilities compute missing prerequisites and ordered roadmap.
5. Progress persists locally by canonical ID.
6. Return visits offer “Continue where you left off?”

## Monetization (future-ready, non-blocking)

- AdSense slot components exist but do not load without config.
- Ads must not interrupt learning, assessments, or navigation.

## Success criteria (Definition of Done)

A real user can open the site, explore blueprint/history/careers/companies, pick a track, take an assessment, get a roadmap, study a real topic, mark complete, leave and continue later, switch theme and language, search, see sources/freshness, and contribute via GitHub—all without a backend or AI runtime.

## Licensing intent

- **Code**: permissive open-source license (MIT).
- **Educational content**: Creative Commons (CC BY 4.0) unless otherwise noted.
- Distinction documented in README and LICENSE files.

## Owner steps (cannot be automated)

1. GitHub Pages: Settings → Pages → Source = GitHub Actions.
2. Branch protection on `main` (recommended settings in DEPLOYMENT.md).
3. Optional: AdSense publisher ID, analytics ID, custom domain / CNAME.
4. Legal review of Privacy/Terms before treating them as formal advice.
