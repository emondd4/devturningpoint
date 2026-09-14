# Implementation Plan — Dev Turning Point V1

Track progress with checkboxes. Repository + this plan are source of truth.

**Research baseline:** 2026-09-14  
**Stack:** Astro 7.3 + React 19 islands + Tailwind v4 + pnpm + Pagefind + GitHub Pages (`base: /devturningpoint`)

---

## Owner-only steps (external)

- [ ] GitHub → Settings → Pages → Source: **GitHub Actions**
- [ ] Enable branch protection on `main` (see DEPLOYMENT.md)
- [ ] Optional: custom domain + `public/CNAME`
- [ ] Optional: AdSense / analytics env vars
- [ ] Legal review of Privacy/Terms before treating them as formal advice

---

## PHASE A — Foundation

- [x] Inspect empty repository (`emondd4/devturningpoint`)
- [x] Research Astro 7 / Tailwind v4 / GitHub Pages guidance
- [x] `docs/PRODUCT.md`, `ARCHITECTURE.md`, `IMPLEMENTATION-PLAN.md`
- [x] Scaffold Astro + React + Tailwind v4 + MDX + sitemap
- [x] Design tokens, light/dark/system theme, Bangla-capable fonts
- [x] Locale architecture (`/en`, `/bn`), dictionaries, switchers
- [x] Navigation, skip link, base layouts, root locale redirect
- [x] Smoke: install / test / build

## PHASE B — Content System

- [x] Zod schemas + collections (topics, careers, companies, achievements, interviews, issues, projects, history)
- [x] Source registry
- [x] Stable IDs + renderers + Edit on GitHub
- [x] `validate:content`

## PHASE C — Graph

- [x] Master skill graph (154 nodes / 344 edges)
- [x] Graph utilities + cycle/missing validation
- [x] Visual React Flow graph + accessible list
- [x] Vitest coverage

## PHASE D — Learning

- [x] Assessment banks (foundations, flutter, frontend, backend, devops + starters)
- [x] Deterministic scoring + personalized roadmap
- [x] IndexedDB progress + localStorage prefs + export/import
- [x] Continue-learning card + My Learning

## PHASE E — Knowledge Experience

- [x] Topic reading UI (TOC, sources, mark complete, ads placeholders)
- [x] Interviews + projects listings
- [x] Pagefind search UI
- [x] Issues collection present (expand UI linking as follow-up)

## PHASE F — Editorial

- [x] Landing + computing blueprint page
- [x] History timeline (sourced events)
- [x] Career directory (12 roles) + company directory (12 featured) + achievements
- [x] Job-market static sample with methodology/limitations

## PHASE G — Content expansion

- [x] Foundations topics (10)
- [x] Flutter topics (10)
- [x] Frontend topics (10)
- [x] Backend topics (10)
- [x] DevOps topics (10)
- [x] Database topics (6)
- [x] Fullstack / QA / UIUX / PM starters (4 each)
- [ ] Optional deeper Flutter internals / interview expansion (P2)

## PHASE H — Production

- [x] SEO basics (title/description/canonical/hreflang/OG/sitemap/robots)
- [x] Policy pages + AI disclosure
- [x] Open-source docs (README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, licenses, issue/PR templates)
- [x] CI + GitHub Pages deploy workflows
- [x] Local production build + Pagefind (272 pages indexed)
- [ ] Owner enables Pages + branch protection
- [ ] Broader a11y/responsive audit in browser (ongoing polish)
- [ ] Optional Playwright e2e for assess→roadmap→complete flow

---

## Current metrics (2026-09-14)

| Area | Count |
|------|-------|
| Topics (MDX) | 72 |
| Careers | 12 |
| Companies | 12 |
| Skill graph nodes | 154 |
| Built HTML pages | 272 |
| Vitest tests | 15 passing |

## Known P2 follow-ups

- Richer Bangla body translations (many topics `translationStatus: partial`)
- Pagefind filters by content type
- Stronger internal-link validator
- Issue detail pages wired from topics
- Self-hosted fonts instead of Google Fonts CSS

## Status

**V1 core product path is implemented and buildable.** Remaining blockers are primarily **owner GitHub Pages settings** and continued editorial depth/polish—not missing architecture.
