# Architecture — Dev Turning Point (V1)

## Summary

Static-first Astro site. Git is the source of truth for educational content. Interactive learning features run as React islands. Learner state stays in the browser (localStorage + IndexedDB). Deployed to GitHub Pages; portable to any static host.

## Verified stack (research date: 2026-09-14)

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Astro **7.x** (latest stable ~7.3.x) | Node **22.12+** or **24** (even LTS); odd Node versions unsupported |
| Language | TypeScript strict | |
| Interactive UI | React via `@astrojs/react` | Islands only |
| Styling | Tailwind CSS **v4** + `@tailwindcss/vite` | No `@astrojs/tailwind` (v3-era) |
| Content | MDX/Markdown + Astro Content Collections | `src/content.config.ts` |
| Validation | Zod (via Astro schemas) | |
| Search | Pagefind | Post-build static index |
| Icons | Lucide | Lightweight |
| Graphs | `@xyflow/react` (React Flow) | Data-driven edges from skill graph JSON |
| Progress | IndexedDB (idb) | Canonical IDs as keys |
| Preferences | localStorage | Theme, language |
| Package manager | pnpm | Lockfile committed |
| CI/CD | GitHub Actions | PR validation + Pages deploy via `withastro/action@v6` |
| Hosting | GitHub Pages | Project site: `base: /devturningpoint` |

## Hosting & base path

Repository: `emondd4/devturningpoint` → project Pages URL:

`https://emondd4.github.io/devturningpoint/`

```js
site: 'https://emondd4.github.io',
base: '/devturningpoint',
```

If the repo is later renamed to `emondd4.github.io`, remove `base`. Custom domain: set `site` to the domain, remove `base`, add `public/CNAME`.

All internal links must respect `import.meta.env.BASE_URL`.

## Directory layout

```
/
├── public/                 # Static assets, fonts, CNAME (optional)
├── src/
│   ├── components/         # Astro + React islands by domain
│   ├── content/            # Collection entries (MDX/YAML/JSON)
│   ├── data/               # Tracks, skill graphs, assessments, terminology, job-market, sources
│   ├── layouts/
│   ├── pages/en|bn/        # Locale-prefixed routes
│   ├── i18n/               # Dictionaries, helpers
│   ├── stores/             # Client progress/preference helpers
│   ├── utils/              # Graph, assessment, locale, SEO
│   └── styles/             # global.css (Tailwind v4 @theme tokens)
├── scripts/                # validate-content, validate-graph, validate-links
├── docs/
├── tests/
└── .github/workflows/
```

## Content architecture

### Collections (typed)

| Collection | Purpose |
|------------|---------|
| `topics` | Educational MDX articles |
| `careers` | Role pages |
| `companies` | Featured employers |
| `achievements` | Company milestones (~5 years) |
| `interviews` | Interview Q&A bank |
| `issues` | Troubleshooting entries |
| `projects` | Portfolio-style learning projects (Core / Market Alternative / AI) |
| `history` | Computing evolution events |
| `ai-tools` | Typed AI tool/resource catalog (problem → tool) |
| `prompt-recipes` | Verifiable prompt templates with failure modes |

### Stable IDs

- Format: `DOMAIN-AREA-TOPIC` (e.g. `FRONTEND-REACT-HOOKS`, `AI-LLM-FUNDAMENTALS`)
- Projects: legacy `PROJECT-…` or `PBL-{TRACK}-{B|I|A}-{nnn}` (e.g. `PBL-AI-B-001`)
- Milestones: `{projectId}-M{nn}` or short unique ids; prefer `PBL-…-M01` for new work
- URLs and titles may change; IDs must not.
- EN/BN pages share the same ID; translation status is metadata.

### Project roles

| Role | Meaning |
|------|---------|
| `core` | Canonical depth project for the level |
| `market-alternative` | Parallel portfolio option with different market/role angle |

AI track projects use `core` within `ai-framework` (three per level).

### AI content architecture

- Topics under `src/content/topics/ai-framework/`
- Skill graph nodes with `track: ai-framework`
- Static decision guides, verification playbook, and failure issues (no runtime AI)
- Prompt recipes and AI tools as typed collections
- Assessment bank maps to AI skill IDs like other tracks

Development-time research is allowed; **do not** ship crawlers, LLM research agents, scheduled publishers, or site-wide vector search for content.

### Topic frontmatter (future-friendly)

Supports: `id`, `slug`, `title`, `titleBn`, `track`, `category`, `difficulty`, `estimatedMinutes`, prerequisites/unlocks/related, `careers`, `tags`, `status`, `applicableVersions`, dates, `lastVerified`, `sources`, `contributors`.

### Sources

Central registry under `src/data/source-registry/` with authority tiers (S1–S4). Pages display human-readable citations, not raw URL dumps.

## Locale architecture

- Routes: `/en/...` and `/bn/...`
- `<html lang>` matches locale
- `hreflang` + canonical per page
- Missing BN translation → explicit “translation unavailable” state (never silent wrong content)
- Preference persisted in localStorage; first visit may use Accept-Language hint (optional)

## Skill graph

- Nodes and edges live in structured data (`src/data/skill-graphs/`)
- Edge types: `requires`, `recommendedBefore`, `unlocks`, `related`, `belongsToTrack`, `usefulForCareer`
- Utilities: direct prereqs, ancestors, descendants, missing prereqs, suggested order
- CI validates: missing IDs, duplicates, cycles on strict `requires`
- UI: visual graph (React Flow) + accessible list/tree fallback

## Assessment & roadmap

- Questions in static JSON mapped to skill IDs
- Deterministic scoring (no AI)
- Roadmap = graph traversal given demonstrated skills + track goals

## Progress storage

| Store | Data |
|-------|------|
| localStorage | Theme, language, UI prefs, `storageVersion` |
| IndexedDB | Assessments, completed topic IDs, paths, current topic/section, timestamps, bookmarks |

- Export/import JSON with schema version + validation + confirmation
- Migrations via `storageVersion`

## Search

Pagefind indexes built HTML after `astro build`. Client search UI filters by type (topics, careers, companies, interviews, projects, issues).

## Ads & analytics

- Ad slot components render placeholders in dev; load AdSense only when `PUBLIC_ADSENSE_CLIENT` (or equivalent) is set
- Analytics loads only when configured; never blocks core UX

## Security (static site)

- No secrets in frontend
- Validate imported progress; never `eval` JSON
- `rel="noopener noreferrer"` on external links
- Dependency updates documented in SECURITY.md

## Testing strategy

- Unit: graph traversal, assessment scoring, progress migrate/export
- Component: critical React islands
- E2E (Playwright where practical): track → assess → roadmap → topic → complete → reload → continue

## CI pipeline

**PR:** install → typecheck → lint → format → content/graph/link validation → tests → build (+ Pagefind)

**main:** same → deploy Pages (not PR previews as production)
