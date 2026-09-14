# Content guide

## Principles

1. **Why before how** — explain the problem a technology solves first.
2. **Prerequisite-first** — never skip foundations.
3. **Source-backed** — cite S1/S2 when possible; show `lastVerified`.
4. **People-first** — depth over SEO page count.
5. **Original synthesis** — do not copy articles.

## Topic IDs

Use stable IDs like `DEVOPS-DOCKER-NETWORKING`. URLs may change; IDs must not.

## Frontmatter

See `src/content/schemas.ts` (`topicFrontmatterSchema`). Required highlights:

- `id`, `title`, `description`, `track`, `difficulty`, `estimatedMinutes`
- `createdAt`, `updatedAt`, `lastVerified` (quote as strings if needed)
- `sources` (IDs from `src/data/source-registry/sources.json`)
- `translationStatus`: `complete` | `partial` | `missing`

## Recommended sections

Use judgment—not every topic needs all 26 sections from the product spec. Prefer:

What / Why / Mental model / How / Example / Real-world usage / Mistakes / Interview / Sources

## Code samples

Must be syntactically valid for the claimed language/version, or clearly labeled as pseudo-code.

## Careers / companies / job market

- No fabricated salaries or “all companies require X”
- Companies are **featured**, not ranked
- Job-market stats must include sample size, period, methodology, limitations
