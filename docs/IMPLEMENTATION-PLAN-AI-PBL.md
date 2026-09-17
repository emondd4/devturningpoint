# Implementation Plan — AI and Framework + PBL Expansion

**Branch:** `cursor/ai-framework-pbl-expansion`  
**Research baseline:** 2026-09-16  
**Constraint:** Static-first. No runtime AI for the website. Preserve all existing tracks and Core PBL projects.

Primary sources consulted for seed phase:

- Cursor docs: Rules, Skills, MCP ([cursor.com/docs/rules](https://cursor.com/docs/rules), [cursor.com/docs/skills](https://cursor.com/docs/skills), [cursor.com/docs/mcp](https://cursor.com/docs/mcp))
- MCP specification 2026-07-28 ([modelcontextprotocol.io](https://modelcontextprotocol.io/specification/2026-07-28))
- OWASP GenAI LLM Top 10 ([genai.owasp.org](https://genai.owasp.org/llm-top-10/))

---

## Owner-only steps (external)

- [ ] GitHub Pages + branch protection (unchanged)
- [ ] Optional: paid API keys for learners completing AI *projects* locally (never committed)
- [ ] Legal review if expanding Privacy/AI disclosure for AI tooling advice

---

## PHASE 0 — Inspect (done when this file lands)

- [x] Confirm existing 10 tracks + 30 Core PBL MDX projects
- [x] Confirm project schema, IndexedDB progress, EN/BN routes, Pagefind
- [x] Confirm out-of-scope: no crawlers / research bots / runtime LLM site features

## PHASE 1 — Docs + schema + seed (this iteration)

- [x] Update `PRODUCT.md` / `ARCHITECTURE.md` (AI track, Core/Market, static AI literacy)
- [x] This implementation plan
- [x] Extend `projectSchema` (`projectRole`, ID patterns, milestone interview refs)
- [x] Add `aiToolSchema` + `promptRecipeSchema` collections
- [x] Register `ai-framework` track + seed skill nodes
- [x] Add source registry entries (Cursor, MCP, OWASP GenAI, OpenAI)
- [x] Seed **3** AI topics, **1** AI tool, **2** prompt recipes, **1** AI project
- [x] UI: Core/Market grouping on track PBL; AI track four-path landing (with real seed content)
- [x] Validation + tests + production build for seed

## PHASE 2 — Systematic expansion

- [x] 30 Market Alternative projects (B/I/A × 10 tracks)
- [x] Remaining 8 AI projects (9 total) — library **69**
- [ ] AI roadmap topics (split AI-00…AI-54 into publishable units; depth over spam) — **3 seed topics live**
- [x] AI assessment bank (starter scenarios wired)
- [x] AI skill graph seed nodes/edges (expand further as topics grow)
- [ ] AI tool catalog population — **1 tool (Cursor) live**
- [ ] Framework decision guides — **verify playbook live; comparisons pending**
- [ ] Prompt recipe library (≥ listed task types) — **2 recipes live**
- [ ] Cursor training section + guided lab — **topic + PBL-AI-B-002 live**
- [x] Verify-AI playbook page (`/ai/verify`)
- [ ] AI failure/security library (OWASP-aligned) — **3 issues live**
- [ ] Cross-track “Using AI Safely in This Role”
- [ ] AI interview bank (canonical IDs)
- [x] Search/My Learning/progress wiring for projects (collections indexed via pagefind body)
- [x] CI path: validate-projects + tests + production build + Pagefind (seed+expansion)

## PHASE 3 — Definition of Done check

| Criterion | Target |
|-----------|--------|
| Core projects preserved | 30 |
| Market alternatives | 30 |
| AI projects | 9 |
| Project library | ≥ 69 |
| AI first-class track | yes |
| Static site (no API keys for browse) | yes |
| EN/BN shared IDs | yes |
| Tests + build | pass |

---

## Editorial rules for expansion

1. Prefer official docs/specs; record `lastVerified`.
2. Job-market notes: “Observed in the Bangladesh job listings reviewed…” only.
3. Do not mass-generate empty stubs—each page must be usable.
4. Advanced ≠ more CRUD; require production concerns (security, eval, ops, failure).
5. Never fabricate research quotes, approvals, or green CI claims.
