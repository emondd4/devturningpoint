# Contributing

Thanks for helping improve Dev Turning Point.

## Ground rules

1. Prefer official documentation and primary sources for technical claims.
2. Never fabricate job-market statistics, salaries, or company achievements.
3. Keep EN/BN content tied to the same canonical IDs.
4. Do not add runtime databases, auth, or LLM APIs in V1.
5. Run `pnpm validate:graph`, `pnpm validate:content`, `pnpm test`, and `pnpm build` before opening a PR.

## Content PRs

- Follow `docs/CONTENT-GUIDE.md`
- Bangla: follow `docs/TRANSLATION-GUIDE.md`
- Use issue templates for content errors, outdated pages, and topic suggestions

## Code PRs

- Prefer Astro/static HTML over React unless interactivity is required
- Keep learner progress keyed by stable IDs, never URLs
- Avoid new dependencies unless necessary and maintained

## Pull request checklist

- [ ] Tests/validation pass locally
- [ ] Sources and `lastVerified` updated for factual changes
- [ ] No secrets committed
- [ ] Screenshots for UI changes when helpful
