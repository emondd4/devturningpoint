# Translation guide (EN ↔ BN)

## Canonical identity

English and Bangla pages share the same content ID.

Example:

- `/en/learn/devops-docker/`
- `/bn/learn/devops-docker/`

Both represent `DEVOPS-DOCKER`.

## Missing translations

Never silently show unrelated Bangla. Use the translation unavailable / partial callout and offer the English version + GitHub edit link.

## Terminology

Keep widely understood technical terms in English when translation harms clarity:

API, Docker, React, Flutter, Kubernetes, database, framework, component, deployment, Git, CI/CD, NestJS, PostgreSQL, Redis, etc.

See `src/data/terminology/glossary.ts` when present; extend it when introducing contested terms.

## Style

Write natural Bangladeshi technical Bangla—not forced literal translation. Mix is OK when it matches how engineers speak.

## Typography

Bangla uses Noto Sans Bengali / Noto Serif Bengali with comfortable line-height. Do not treat BN as a secondary afterthought in layout spacing.
