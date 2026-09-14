# Security Policy

## Supported versions

Security fixes are applied to the `main` branch of this static site.

## Reporting a vulnerability

Please **do not** open a public issue for sensitive security reports.

Use GitHub’s private vulnerability reporting for this repository when enabled, or email the repository owners listed on the GitHub profile.

Include:

- description of the issue
- steps to reproduce
- impact assessment
- suggested fix if known

## Scope notes for a static site

- Never commit secrets, tokens, or private keys
- Imported learner progress JSON must be validated and never executed
- External links should use `rel="noopener noreferrer"`
- AdSense/analytics IDs must come from environment configuration, not hard-coded secrets

## Dependency updates

Maintainers should periodically run `pnpm outdated` / Dependabot alerts and keep Astro, React, and Pagefind on supported releases.
