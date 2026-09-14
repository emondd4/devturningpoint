# Dev Turning Point

Bilingual (English / Bangla) open-source educational platform for computer engineering careers and prerequisite-first learning—focused initially on students, juniors, career switchers, and technology professionals in Bangladesh.

**Live intent:** static site on GitHub Pages (`https://emondd4.github.io/devturningpoint/`).

## What you can do

- Explore a computing blueprint and evolution timeline
- Browse Bangladesh-relevant careers and featured employers (sourced, not ranked)
- Pick a learning track, take a skills assessment, get a personalized roadmap
- Read technical topics with sources and “last verified” dates
- Keep progress in the browser (IndexedDB) with export/import—no accounts

## Stack

- Astro 7 (static)
- TypeScript (strict)
- React islands (assessment, graph, progress, theme/language)
- Tailwind CSS v4
- MDX content collections + Zod schemas
- Pagefind static search
- pnpm + GitHub Actions

## Local development

Requires Node.js **22.12+** or **24** (even LTS). Odd Node versions are unsupported by Astro.

```bash
pnpm install
pnpm dev
```

### Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build + Pagefind index |
| `pnpm preview` | Preview `dist/` |
| `pnpm test` | Vitest (graph + assessment) |
| `pnpm validate:graph` | Fail on invalid skill graph |
| `pnpm validate:content` | Duplicate/missing content IDs |
| `pnpm ci` | Validation + tests + build |

## Licensing

- **Code:** MIT (`LICENSE`)
- **Educational content** under `src/content/`: Creative Commons Attribution 4.0 (`LICENSE-CONTENT`)

Do not copy copyrighted articles into the repo. Synthesize and cite sources.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md), [docs/CONTENT-GUIDE.md](./docs/CONTENT-GUIDE.md), and [docs/TRANSLATION-GUIDE.md](./docs/TRANSLATION-GUIDE.md).

## Documentation

- [docs/PRODUCT.md](./docs/PRODUCT.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/IMPLEMENTATION-PLAN.md](./docs/IMPLEMENTATION-PLAN.md)
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Owner setup (GitHub Pages)

1. Settings → Pages → Source: **GitHub Actions**
2. Push to `main` to deploy via `.github/workflows/deploy.yml`
3. Optional: custom domain via `public/CNAME` (see DEPLOYMENT.md)
