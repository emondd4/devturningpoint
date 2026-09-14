# Deployment (GitHub Pages)

Research baseline: Astro official GitHub Pages guide (2026) using `withastro/action@v6`.

## Repository URL model

This project is `emondd4/devturningpoint`, so Pages serves:

`https://emondd4.github.io/devturningpoint/`

Configured in `astro.config.mjs`:

- `site: https://emondd4.github.io`
- `base: /devturningpoint`

Override with env vars if needed:

- `PUBLIC_SITE_URL`
- `PUBLIC_BASE_PATH`

## Enable Pages

1. GitHub → Settings → Pages
2. Build and deployment → Source: **GitHub Actions**
3. Ensure Actions can read/write Pages (`pages: write`, `id-token: write` in workflow)

## Workflows

- `.github/workflows/ci.yml` — PR/main validation + build
- `.github/workflows/deploy.yml` — deploy on push to `main`

## Custom domain (future)

1. Buy a domain and configure DNS (A/AAAA or CNAME per GitHub docs)
2. Add `public/CNAME` containing the domain
3. Set `site` to `https://your.domain` and **remove** `base`
4. Update internal links that assumed the project base path
5. Enforce HTTPS in Pages settings

## Recommended branch protection

Documented for owners (UI-only):

- Protect `main`
- Require pull requests
- Require status checks (`validate` job)
- Disallow force pushes
- Enable Dependabot / security alerts
- Require review when the maintainer team grows

## Ads / analytics

Optional:

- `PUBLIC_ADSENSE_CLIENT` — enables ad slot loading
- analytics ID env (when implemented) — load only if set

Absence of these variables must not break the site.
