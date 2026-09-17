#!/usr/bin/env python3
"""Generate market-alternative + remaining AI PBL MDX projects (expansion)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/content/projects"
DATE = "2026-09-16"

banks = {p.stem: json.loads(p.read_text()) for p in (ROOT / "src/data/interviews/bank").glob("*.json")}
sources = {s["id"] for s in json.loads((ROOT / "src/data/source-registry/sources.json").read_text())}
skills = {n["id"] for n in json.loads((ROOT / "src/data/skill-graphs/master-graph.json").read_text())["nodes"]}
topics_by_track: dict[str, list[str]] = {}
all_topics: set[str] = set()
for p in (ROOT / "src/content/topics").rglob("*.mdx"):
    text = p.read_text()
    m = re.search(r"^---([\s\S]*?)---", text)
    if not m:
        continue
    fm = m.group(1)
    idm = re.search(r'^id:\s*["\']?([^"\'\n]+)', fm, re.M)
    tr = re.search(r'^track:\s*["\']?([^"\'\n]+)', fm, re.M)
    if idm and tr:
        tid = idm.group(1).strip()
        track = tr.group(1).strip().strip('"')
        topics_by_track.setdefault(track, []).append(tid)
        all_topics.add(tid)

EV = {
    "code": [
        "GitHub repo with README",
        "Architecture diagram",
        "Screenshots/demo",
        "Tests + CI evidence",
        "ADR/decision notes",
        "Reproducible run instructions",
    ],
    "devops": [
        "IaC repo",
        "CI/CD green run evidence",
        "Monitoring screenshots",
        "Runbook",
        "Architecture diagram",
        "Incident/DR notes",
    ],
    "database": [
        "ERD",
        "Migrations",
        "Queries",
        "EXPLAIN before/after",
        "Benchmarks",
        "Backup/restore evidence",
    ],
    "qa": [
        "Test strategy",
        "Test cases",
        "Automation + CI",
        "Bug reports",
        "Perf/a11y findings",
        "Release quality report",
    ],
    "uiux": [
        "Research plan (learner-run)",
        "Flows/wireframes",
        "Iterations",
        "Prototype",
        "Usability findings",
        "Case study + handoff",
    ],
    "pm": [
        "Charter",
        "Roadmap",
        "Backlog + AC",
        "Risk register",
        "Status reports",
        "Change decisions + retro",
    ],
    "ai": [
        "Dataset/prompt versions",
        "Evaluation results",
        "Traces/logs",
        "Security tests",
        "Cost/latency notes",
        "Architecture + demo",
    ],
}


def pick_topics(track: str, n: int = 5) -> list[str]:
    return (topics_by_track.get(track) or sorted(all_topics))[:n]


def pick_skills(cands: list[str], n: int = 3) -> list[str]:
    out = [s for s in cands if s in skills]
    return out[:n] or sorted(skills)[:n]


def pick_iv(track: str, level: str, n: int = 8) -> list[str]:
    qs = banks.get(track, [])
    prefer = {
        "beginner": {"Fundamentals", "Definition", "Mechanics"},
        "intermediate": {"Compare", "Architecture", "Troubleshooting", "Scenario"},
        "advanced": {"Architecture", "Troubleshooting", "Scenario", "Compare"},
    }[level]
    ranked = sorted(qs, key=lambda q: (0 if q.get("questionType") in prefer else 1, q["id"]))
    return [q["id"] for q in ranked[:n]]


def pick_src(cands: list[str]) -> list[str]:
    out = [s for s in cands if s in sources]
    return out or ["RFC-9110-HTTP"]


def dump_list(key: str, items: list[str], indent: int = 0) -> str:
    pad = " " * indent
    if not items:
        return f"{pad}{key}: []"
    lines = [f"{pad}{key}:"]
    for i in items:
        lines.append(f'{pad}  - "{str(i).replace(chr(34), chr(92)+chr(34))}"')
    return "\n".join(lines)


def make_milestones(pid: str, topics: list[str], specs: list[tuple[str, str, str]]):
    ms = []
    for i, (title, objective, why) in enumerate(specs, 1):
        pr = topics[:2] if i <= 2 else (topics[2:4] or topics[:2])
        ms.append(
            {
                "id": f"{pid}-M{i:02d}",
                "title": title,
                "objective": objective,
                "whyItMatters": why,
                "prerequisiteTopicIds": pr,
                "tasks": [
                    f"Capture scope for '{title}' in PROJECT_PLAN.md",
                    f"Implement the smallest complete slice: {objective}",
                    "Document trade-offs and open questions",
                    "Run this milestone validation checklist",
                ],
                "expectedArtifacts": [
                    f"Deliverable proving: {title}",
                    "Updated README or notes",
                    "Portfolio evidence artifact",
                ],
                "validationChecklist": [
                    "Acceptance criteria met",
                    "At least one failure path exercised",
                    "Artifacts exist and are reviewable",
                ],
                "commonProblems": [
                    "Skipping validation",
                    "Over-engineering early",
                    "No saved evidence",
                ],
                "completionCriteria": [
                    f"{objective} is demonstrable",
                    "Checklist complete",
                    "Evidence saved",
                ],
                "relatedInterviewQuestionIds": [],
            }
        )
    return ms


def dump_milestones(ms: list[dict]) -> str:
    lines = ["milestones:"]
    for m in ms:
        lines.append(f'  - id: "{m["id"]}"')
        lines.append(f'    title: "{m["title"]}"')
        lines.append(f'    objective: "{m["objective"]}"')
        lines.append(f'    whyItMatters: "{m["whyItMatters"]}"')
        lines.append(dump_list("prerequisiteTopicIds", m["prerequisiteTopicIds"], 4))
        for key in [
            "tasks",
            "expectedArtifacts",
            "validationChecklist",
            "commonProblems",
            "completionCriteria",
            "relatedInterviewQuestionIds",
        ]:
            lines.append(dump_list(key, m[key], 4))
    return "\n".join(lines)


def body(kind: str, pitch: str, tools: list[str], level: str) -> str:
    tools_s = ", ".join(tools)
    warn = {
        "uiux": "Do not invent interview quotes or usability findings.",
        "pm": "Label SIMULATED DATA vs REAL PROJECT EVIDENCE. Never fabricate approvals.",
        "ai": "Prefer local/free models first. Warn before paid APIs. Never commit secrets.",
    }.get(kind, "Guide implementation; do not paste a finished solution.")
    return f"""import Callout from '../../components/content/Callout.astro';

<Callout type="warning" title="Integrity">
{warn}
</Callout>

## Why this project matters

{pitch}

## Market / role relevance

See frontmatter `marketRelevance`.

## Architecture / approach

Sketch first. Prefer locally runnable stacks. Record trade-offs in PROJECT_PLAN.md.

Tools: {tools_s}.

## Milestones

Follow ordered milestones (WHAT / WHY / verify / evidence).

## Step-by-step

1. Write PROJECT_PLAN.md
2. Ship milestone 1 as a thin vertical slice
3. Add validation appropriate to {level}
4. Advance only after checklist pass
5. Finish portfolio pack + retrospective

## Validation / security / performance / a11y

Exercise failure paths. Secure defaults. Measure before optimizing. Cover keyboard/semantics when UI exists.

## Deployment / stretch / retro / sources

Document run/deploy. Stretch only after core AC. Answer hardest/failed/debug/trade-off/change/evidence. See frontmatter sources.
"""


def write_project(item: dict) -> None:
    topics = pick_topics(item["track"])
    interviews = pick_iv(item["track"] if item["track"] != "ai-framework" else "fullstack", item["level"])
    if item["track"] == "ai-framework":
        # prefer empty or deep dives only if bank missing
        interviews = interviews[:6]
    src = pick_src(item["sourceCands"])
    ms = make_milestones(item["id"], topics, item["ms"])
    evidence = EV[item["kind"]]
    pre = pick_skills(item["pre"])
    out = pick_skills(item["out"])
    role = item.get("projectRole", "market-alternative")
    parts = [
        "---",
        f'id: "{item["id"]}"',
        f'title: "{item["title"]}"',
        f'slug: "{item["slug"]}"',
        f'track: "{item["track"]}"',
        f'level: "{item["level"]}"',
        f'projectRole: "{role}"',
        f'marketRelevance: "{item["market"]}"',
        f'difficulty: "{item["level"]}"',
        f'summary: "{item["summary"]}"',
        f'portfolioPitch: "{item["pitch"]}"',
        f"estimatedHours: {item['hours']}",
        dump_list("prerequisiteSkillIds", pre),
        dump_list("learningOutcomeSkillIds", out),
        dump_list("recommendedTools", item["tools"]),
        dump_list("portfolioEvidence", evidence),
        dump_list("relatedTopicIds", topics),
        dump_list("relatedInterviewQuestionIds", interviews),
        dump_list("sources", src),
        f'createdAt: "{DATE}"',
        f'updatedAt: "{DATE}"',
        f'lastVerified: "{DATE}"',
        'status: "published"',
        'translationStatus: "partial"',
        dump_milestones(ms),
        "---",
        "",
        body(item["kind"], item["pitch"], item["tools"], item["level"]),
    ]
    path = OUT / f"{item['slug']}.mdx"
    if path.exists() and item["id"] == "PBL-AI-B-002":
        return
    path.write_text("\n".join(parts) + "\n")


def P(**kwargs):
    return kwargs


PROJECTS = [
    # Foundations market
    P(id="PBL-FND-B-002", title="GitHub API + HTTP Diagnostic CLI", slug="github-api-http-diagnostic-cli", track="foundations", level="beginner", hours=20,
      summary="CLI that probes HTTP endpoints and GitHub API metadata with actionable diagnostics.",
      pitch="Proves HTTP literacy and API tooling—practical for debugging integrations.",
      market="Observed in Bangladesh job listings reviewed for junior backend/support-leaning roles: HTTP debugging and API literacy appear frequently as practical expectations.",
      pre=["FOUNDATIONS-HTTP","FOUNDATIONS-GIT","FOUNDATIONS-FUNCTIONS"], out=["FOUNDATIONS-HTTP","FOUNDATIONS-API-CONCEPTS","FOUNDATIONS-DEBUGGING"],
      tools=["Python or Node","Git"], sourceCands=["MDN-CLI-INTRO","RFC-9110-HTTP","GIT-SCM-BOOK"], kind="code",
      ms=[("Scaffold CLI","Entrypoint with help/version.","Clean CLI UX."),("HTTP probe","Status/latency/headers.","Debug without guesswork."),("GitHub API","Read metadata via token env.","Real API constraints."),("Tests + README","Fixtures and docs.","Portfolio clarity.")]),
    P(id="PBL-FND-I-002", title="HTTP Reverse Proxy + Cache", slug="http-reverse-proxy-cache", track="foundations", level="intermediate", hours=28,
      summary="Reverse proxy with caching, cache keys, and invalidation notes.",
      pitch="Shows proxy/cache mental models used behind APIs and CDNs.",
      market="Observed in Bangladesh job listings reviewed for mid-level backend/devops-adjacent roles: caching and proxy concepts appear around APIs and delivery.",
      pre=["FOUNDATIONS-HTTP","FOUNDATIONS-TCP-IP","FOUNDATIONS-DEBUGGING"], out=["FOUNDATIONS-HTTP","FOUNDATIONS-HTTPS-TLS","FOUNDATIONS-DEBUGGING"],
      tools=["Go/Node/Python","Redis optional"], sourceCands=["RFC-9110-HTTP","RFC-9293-TCP"], kind="code",
      ms=[("Proxy basics","Forward requests safely.","Core networking."),("Cache layer","TTL + keys.","Performance lever."),("Invalidation","Purge strategy.","Correctness."),("Observability","Logs/metrics.","Ops readiness.")]),
    P(id="PBL-FND-A-002", title="Persistent Key-Value Store", slug="persistent-key-value-store", track="foundations", level="advanced", hours=40,
      summary="On-disk KV store with durability notes and benchmarks.",
      pitch="Systems depth: storage layout, crash stories, and measurement.",
      market="Observed in Bangladesh job listings reviewed for stronger systems roles: durability and performance reasoning appear in advanced interviews more than CRUD.",
      pre=["FOUNDATIONS-FILESYSTEMS","FOUNDATIONS-PROCESSES","FOUNDATIONS-DEBUGGING"], out=["FOUNDATIONS-FILESYSTEMS","FOUNDATIONS-DEBUGGING","FOUNDATIONS-COMPLEXITY"],
      tools=["Rust/Go/C++","benchmarks"], sourceCands=["LINUX-MAN-PAGES","RFC-9110-HTTP"], kind="code",
      ms=[("Storage format","On-disk layout.","Durability starts here."),("CRUD API","Get/put/delete.","Usable interface."),("Crash notes","fsync/recovery story.","Production depth."),("Benchmarks","Measure before claims.","Evidence.")]),
    # Flutter
    P(id="PBL-FL-B-002", title="E-Commerce Catalog & Cart", slug="flutter-ecommerce-catalog-cart", track="mobile-flutter", level="beginner", hours=24,
      summary="Flutter catalog with cart, local persistence, and polish.",
      pitch="Market-familiar mobile commerce UI with state and storage.",
      market="Observed in Bangladesh job listings reviewed for Flutter/mobile roles: e-commerce and cart flows appear often in product portfolios and take-home themes.",
      pre=["MOBILE-FLUTTER-WIDGETS","MOBILE-FLUTTER-STATE","MOBILE-FLUTTER-FORMS"], out=["MOBILE-FLUTTER-STATE","MOBILE-FLUTTER-STORAGE","MOBILE-FLUTTER-TESTING"],
      tools=["Flutter","local DB"], sourceCands=["FLUTTER-DOCS","FLUTTER-WIDGETS","FLUTTER-SQLITE"], kind="code",
      ms=[("Catalog UI","Product list/detail.","Structure first."),("Cart state","Add/update/remove.","State skill."),("Persistence","Survive restarts.","Offline value."),("Tests","Widget tests + empty states.","Finish well.")]),
    P(id="PBL-FL-I-002", title="Real-Time Support Chat", slug="flutter-realtime-support-chat", track="mobile-flutter", level="intermediate", hours=34,
      summary="Support chat client with presence, retries, and offline queue.",
      pitch="Realtime UX under flaky networks—strong mid-level signal.",
      market="Observed in Bangladesh job listings reviewed for mobile engineers: chat/notification features appear in customer-support and ops app requirements.",
      pre=["MOBILE-FLUTTER-NETWORKING","MOBILE-FLUTTER-STATE","MOBILE-FLUTTER-STORAGE"], out=["MOBILE-FLUTTER-NETWORKING","MOBILE-FLUTTER-STORAGE","MOBILE-FLUTTER-TESTING"],
      tools=["Flutter","WebSocket/mock"], sourceCands=["FLUTTER-NETWORKING","FLUTTER-TESTING"], kind="code",
      ms=[("Chat UI","Threads + messages.","Core UX."),("Realtime link","Connect/reconnect.","Network reality."),("Offline queue","Durable outbound.","Resilience."),("Hardening","Empty/error + tests.","Evidence.")]),
    P(id="PBL-FL-A-002", title="Delivery / Fleet Tracking App", slug="flutter-delivery-fleet-tracking", track="mobile-flutter", level="advanced", hours=46,
      summary="Ops app with live location views, roles, and integration boundaries.",
      pitch="Complex mobile ops: maps/telemetry mental model and architecture.",
      market="Observed in Bangladesh job listings reviewed for senior mobile/product roles: logistics and tracking apps appear as domain examples requiring maps and realtime updates.",
      pre=["MOBILE-FLUTTER-NETWORKING","MOBILE-FLUTTER-TESTING","MOBILE-FLUTTER-DEPLOYMENT"], out=["MOBILE-FLUTTER-DEPLOYMENT","MOBILE-FLUTTER-TESTING","MOBILE-FLUTTER-PLATFORM"],
      tools=["Flutter","maps/mock API"], sourceCands=["FLUTTER-PERF","FLUTTER-DEPLOY","FLUTTER-PLATFORM-CHANNELS"], kind="code",
      ms=[("Roles + jobs","Assignment lifecycle.","Domain clarity."),("Live map views","Loading/error/empty.","Trustworthy ops UX."),("Integration boundary","Isolate providers.","Testable architecture."),("Release readiness","Perf + checklist.","Ship discipline.")]),
    # Frontend
    P(id="PBL-FE-B-002", title="Figma-to-Production SaaS Marketing Site", slug="figma-to-production-saas-marketing-site", track="frontend", level="beginner", hours=22,
      summary="Semantic responsive marketing site with a11y and design fidelity.",
      pitch="Translates design into production HTML/CSS/JS with accessibility.",
      market="Observed in Bangladesh job listings reviewed for frontend roles: marketing/landing implementation from design tools is a common junior/mid expectation.",
      pre=["FRONTEND-HTML","FRONTEND-CSS","FRONTEND-JAVASCRIPT"], out=["FRONTEND-HTML-SEMANTICS","FRONTEND-CSS-RESPONSIVE","FRONTEND-JS-DOM"],
      tools=["Vite","axe DevTools"], sourceCands=["W3C-HTML","W3C-WCAG","MDN-CSS-CASCADE"], kind="code",
      ms=[("Semantic shell","Landmarks/headings.","A11y foundation."),("Responsive sections","Breakpoints.","Real devices."),("Interaction","Nav/forms.","JS craft."),("A11y pass","Fix axe findings.","Evidence.")]),
    P(id="PBL-FE-I-002", title="Production E-Commerce Storefront", slug="production-ecommerce-storefront", track="frontend", level="intermediate", hours=34,
      summary="Storefront with cart, filtering, resilient fetching, and URL state.",
      pitch="Production UI: data fetching, empty/error, and shareable URLs.",
      market="Observed in Bangladesh job listings reviewed for React/frontend roles: storefront and catalog UIs appear frequently in product companies.",
      pre=["FRONTEND-REACT","FRONTEND-TYPESCRIPT","FRONTEND-JS-ASYNC"], out=["FRONTEND-REACT","FRONTEND-TYPESCRIPT","FRONTEND-JS-ASYNC"],
      tools=["React","TypeScript","TanStack Query"], sourceCands=["REACT-DOCS","REACT-HOOKS","W3C-WCAG"], kind="code",
      ms=[("App shell","Routing/layout.","Structure."),("Catalog + cart","Core commerce path.","Product value."),("URL state","Shareable filters.","Senior frontend."),("Hardening","A11y + tests.","Polish.")]),
    P(id="PBL-FE-A-002", title="Visual Document / Report Builder", slug="visual-document-report-builder", track="frontend", level="advanced", hours=44,
      summary="Drag/structure a report canvas with export and accessibility constraints.",
      pitch="Advanced frontend: complex state, layout engines, and export fidelity.",
      market="Observed in Bangladesh job listings reviewed for senior frontend roles: builders/editors and complex canvas UIs appear in SaaS product descriptions.",
      pre=["FRONTEND-REACT","FRONTEND-TYPESCRIPT","FRONTEND-JS-ASYNC"], out=["FRONTEND-REACT","FRONTEND-TYPESCRIPT","FRONTEND-JS-ASYNC"],
      tools=["React","TypeScript"], sourceCands=["REACT-DOCS","W3C-WCAG","REACT-QUEUEING"], kind="code",
      ms=[("Canvas model","Blocks + layout.","Domain model."),("Editing UX","Keyboard + drag.","Power-user UX."),("Export","PDF/HTML export story.","Handoff value."),("Perf + a11y","Profile + notes.","Production depth.")]),
]

# Append remaining tracks in second list merge
PROJECTS += [
    P(id="PBL-BE-B-002", title="Secure Auth + Media API", slug="secure-auth-media-api", track="backend", level="beginner", hours=26,
      summary="Auth API with media upload constraints and validation.",
      pitch="Security-minded REST with file handling and tests.",
      market="Observed in Bangladesh job listings reviewed for backend roles: auth and file/media upload endpoints appear regularly in API job descriptions.",
      pre=["BACKEND-REST","BACKEND-AUTH","BACKEND-VALIDATION"], out=["BACKEND-AUTH","BACKEND-VALIDATION","BACKEND-TESTING"],
      tools=["NestJS/Express","PostgreSQL"], sourceCands=["NESTJS-AUTH","NESTJS-VALIDATION","RFC-9110-HTTP"], kind="code",
      ms=[("Auth skeleton","Register/login.","Security baseline."),("Protected routes","Guards/middleware.","AuthZ basics."),("Media upload","Size/type limits.","Abuse resistance."),("Tests","Integration tests.","Evidence.")]),
    P(id="PBL-BE-I-002", title="Real-Time Notification & Messaging Service", slug="realtime-notification-messaging-service", track="backend", level="intermediate", hours=36,
      summary="Messaging service with websockets/queues and delivery semantics.",
      pitch="Realtime backends need idempotency and failure stories.",
      market="Observed in Bangladesh job listings reviewed for mid backend roles: notifications, websockets, and messaging appear in product API requirements.",
      pre=["BACKEND-NESTJS","BACKEND-REDIS","BACKEND-AUTH"], out=["BACKEND-REDIS","BACKEND-TESTING","BACKEND-NESTJS"],
      tools=["NestJS","Redis","WebSocket"], sourceCands=["NESTJS-WEBSCOCKETS","NESTJS-QUEUES","POSTGRES-TX"], kind="code",
      ms=[("Message model","Persist messages.","Domain first."),("Realtime channel","Push updates.","UX dependency."),("Delivery semantics","At-least-once notes.","Correctness."),("Hardening","Auth + tests.","Production.")]),
    P(id="PBL-BE-A-002", title="Event-Driven Marketplace Platform", slug="event-driven-marketplace-platform", track="backend", level="advanced", hours=50,
      summary="Marketplace workflows with events, outbox, and compensation notes.",
      pitch="Advanced backend: events, consistency, and failure recovery.",
      market="Observed in Bangladesh job listings reviewed for senior backend roles: marketplace/order workflows and event-driven language appear in larger product teams.",
      pre=["BACKEND-REDIS","BACKEND-TESTING","BACKEND-AUTH"], out=["BACKEND-REDIS","BACKEND-TESTING","BACKEND-NESTJS"],
      tools=["NestJS","PostgreSQL","queue"], sourceCands=["NESTJS-QUEUES","POSTGRES-TX","RFC-9110-HTTP"], kind="code",
      ms=[("Domain events","Order/listing events.","Event mindset."),("Outbox","Reliable publish.","Consistency."),("Consumers","Idempotent handlers.","Failure reality."),("Chaos notes","Recovery runbook.","Senior signal.")]),
    P(id="PBL-FS-B-002", title="E-Commerce Store + Admin", slug="ecommerce-store-admin-fullstack", track="fullstack", level="beginner", hours=32,
      summary="Storefront + admin with auth and shared API.",
      pitch="End-to-end commerce slice across UI and API.",
      market="Observed in Bangladesh job listings reviewed for fullstack roles: shop + admin panel combinations are common portfolio and job themes.",
      pre=["FRONTEND-REACT","BACKEND-REST","BACKEND-AUTH"], out=["FULLSTACK-INTEGRATION","FULLSTACK-AUTH-FLOWS","BACKEND-POSTGRES"],
      tools=["Next/React","Nest/Express","Postgres"], sourceCands=["REACT-DOCS","NESTJS-AUTH","POSTGRES-DOCS"], kind="code",
      ms=[("Auth slice","Login + roles.","Boundary first."),("Store + admin CRUD","Shared API.","Fullstack wiring."),("Orders path","Happy path E2E.","Integration."),("Compose/README","Runnable demo.","Reviewability.")]),
    P(id="PBL-FS-I-002", title="POS / ERP Operations System", slug="pos-erp-operations-system", track="fullstack", level="intermediate", hours=42,
      summary="Ops system for inventory/sales with roles and audit-ish logs.",
      pitch="Cross-cutting ops software: permissions and workflows.",
      market="Observed in Bangladesh job listings reviewed for mid fullstack roles: ERP/POS/operations systems appear in local product and agency work.",
      pre=["FULLSTACK-INTEGRATION","FULLSTACK-AUTH-FLOWS","BACKEND-NESTJS"], out=["FULLSTACK-CORS-CSRF","FULLSTACK-AUTH-FLOWS","FULLSTACK-E2E-TESTING"],
      tools=["Next.js","NestJS","Postgres"], sourceCands=["REACT-SERVER-COMPONENTS","NESTJS-GUARDS","RFC-9110-HTTP"], kind="code",
      ms=[("Domain model","Products/sales.","Ops clarity."),("Role UX","Cashier/admin.","AuthZ in UI+API."),("Audit trail","Who changed what.","Accountability."),("E2E path","One critical flow.","Proof.")]),
    P(id="PBL-FS-A-002", title="Omnichannel CRM & Automation Platform", slug="omnichannel-crm-automation-platform", track="fullstack", level="advanced", hours=55,
      summary="CRM with multi-channel touchpoints and automation rules.",
      pitch="Senior fullstack: tenancy-ish boundaries, automation, and ops readiness.",
      market="Observed in Bangladesh job listings reviewed for senior fullstack/product engineers: CRM and automation platforms appear in SaaS-oriented roles.",
      pre=["FULLSTACK-AUTH-FLOWS","FULLSTACK-CORS-CSRF","DEVOPS-DOCKER"], out=["FULLSTACK-INTEGRATION","FULLSTACK-SSR-BOUNDARIES","FULLSTACK-E2E-TESTING"],
      tools=["Next.js","NestJS","Postgres","Docker"], sourceCands=["REACT-SERVER-COMPONENTS","NESTJS-AUTH","DOCKER-GET-STARTED"], kind="code",
      ms=[("Contact model","Channels + timeline.","CRM core."),("Automation rules","Triggered actions.","Product power."),("SSR boundaries","Clear split.","Architecture."),("Ops pack","Compose + E2E.","Ship.")]),
    P(id="PBL-DO-B-002", title="Self-Hosted Production Stack + Backups", slug="self-hosted-production-stack-backups", track="devops", level="beginner", hours=28,
      summary="Compose-based stack with backup/restore drill.",
      pitch="Self-hosting with backups beats toy deploys.",
      market="Observed in Bangladesh job listings reviewed for DevOps/sysadmin-leaning roles: self-hosted stacks and backup responsibility appear in SME environments.",
      pre=["DEVOPS-LINUX","DEVOPS-DOCKER","FOUNDATIONS-GIT"], out=["DEVOPS-DOCKER","DEVOPS-LINUX","DEVOPS-CICD"],
      tools=["Docker Compose","Linux VM"], sourceCands=["DOCKER-COMPOSE","DOCKER-GET-STARTED","LINUX-MAN-PAGES"], kind="devops",
      ms=[("Compose stack","App+db services.","Runnable baseline."),("Hardening","Restart policies.","Basics of prod."),("Backups","Dump + restore drill.","DR lite."),("Runbook","Document failure.","Ops maturity.")]),
    P(id="PBL-DO-I-002", title="Observability Platform", slug="observability-platform-lab", track="devops", level="intermediate", hours=34,
      summary="Metrics/logs/traces lab with an alert and dashboard.",
      pitch="You cannot operate what you cannot see.",
      market="Observed in Bangladesh job listings reviewed for mid DevOps/SRE roles: monitoring, logging, and alerting keywords appear alongside cloud/k8s expectations.",
      pre=["DEVOPS-OBSERVABILITY","DEVOPS-LINUX","DEVOPS-DOCKER"], out=["DEVOPS-OBSERVABILITY","DEVOPS-SLO","DEVOPS-CICD"],
      tools=["Prometheus/Grafana or equivalents"], sourceCands=["DOCKER-GET-STARTED","K8S-DOCS","LINUX-MAN-PAGES"], kind="devops",
      ms=[("Golden signals","Pick SLIs.","Measurement."),("Dashboards","Build views.","Operability."),("Alert","One actionable alert.","Noise control."),("Runbook","Tie alert to action.","SRE habit.")]),
    P(id="PBL-DO-A-002", title="DevSecOps Software-Supply-Chain Platform", slug="devsecops-software-supply-chain-platform", track="devops", level="advanced", hours=48,
      summary="Pipeline with SCA/signing/provenance notes and policy gates.",
      pitch="Advanced delivery: supply chain security as a platform concern.",
      market="Observed in Bangladesh job listings reviewed for senior DevOps/security-adjacent roles: supply-chain, scanning, and secure pipeline language appears in larger orgs.",
      pre=["DEVOPS-CICD","DEVOPS-KUBERNETES","DEVOPS-SECURITY"], out=["DEVOPS-CICD","DEVOPS-OBSERVABILITY","DEVOPS-KUBERNETES"],
      tools=["CI","container scan","policy-as-code"], sourceCands=["DOCKER-SCOUT","DOCKER-GET-STARTED","K8S-DOCS"], kind="devops",
      ms=[("Baseline pipeline","Build/test.","Foundation."),("SCA gate","Fail on critical.","Honest gates."),("Provenance notes","Image signing story.","Trust."),("Policy + retro","Document exceptions.","Governance.")]),
]

PROJECTS += [
    P(id="PBL-DB-B-002", title="SQL Reporting / BI Database", slug="sql-reporting-bi-database", track="database", level="beginner", hours=22,
      summary="Star/snowflake-ish reporting schema with analytical queries.",
      pitch="Reporting models differ from OLTP—show you know both.",
      market="Observed in Bangladesh job listings reviewed for data/backend roles: reporting SQL and BI-oriented schemas appear in analytics-adjacent openings.",
      pre=["DATABASE-SQL","DATABASE-RELATIONAL","FOUNDATIONS-SQL-INTRO"], out=["DATABASE-SQL","DATABASE-JOINS","DATABASE-CTES"],
      tools=["PostgreSQL","psql"], sourceCands=["POSTGRES-DOCS","POSTGRES-QUERIES"], kind="database",
      ms=[("Model","Facts/dims.","Design first."),("Load","Seed analytics data.","Volume lite."),("Queries","Aggregations/windows.","BI skill."),("Docs","Metric definitions.","Trust.")]),
    P(id="PBL-DB-I-002", title="Backup / PITR / Replication Operations Lab", slug="backup-pitr-replication-operations-lab", track="database", level="intermediate", hours=32,
      summary="Backup, PITR drill, and replica lag notes on Postgres.",
      pitch="Ops competence: restore evidence beats theory.",
      market="Observed in Bangladesh job listings reviewed for database/devops roles: backup, replication, and recovery expectations appear in production DB ownership.",
      pre=["DATABASE-BACKUP-REPLICATION","DATABASE-TRANSACTIONS","DATABASE-SQL"], out=["DATABASE-BACKUP-REPLICATION","DATABASE-TRANSACTIONS","DATABASE-EXPLAIN"],
      tools=["PostgreSQL"], sourceCands=["POSTGRES-BACKUP","POSTGRES-REPLICATION","POSTGRES-DOCS"], kind="database",
      ms=[("Backup","Base backup.","Recoverability."),("PITR drill","Restore to time.","Evidence."),("Replica","Lag observations.","HA thinking."),("Runbook","Document steps.","Ops.")]),
    P(id="PBL-DB-A-002", title="PostgreSQL HA / DR Platform", slug="postgresql-ha-dr-platform", track="database", level="advanced", hours=44,
      summary="HA/DR design with failover drill and RPO/RTO notes.",
      pitch="Advanced data platform: failover proof and honest limits.",
      market="Observed in Bangladesh job listings reviewed for senior DB/SRE roles: HA/DR and failover experience is cited for higher-responsibility positions.",
      pre=["DATABASE-BACKUP-REPLICATION","DATABASE-EXPLAIN","DATABASE-TRANSACTIONS"], out=["DATABASE-BACKUP-REPLICATION","DATABASE-EXPLAIN","DATABASE-TRANSACTIONS"],
      tools=["PostgreSQL","orchestration notes"], sourceCands=["POSTGRES-REPLICATION","POSTGRES-BACKUP","POSTGRES-PARTITIONING"], kind="database",
      ms=[("Topology","Primary/standby plan.","Architecture."),("Failover drill","Document outcome.","Proof."),("RPO/RTO","Measure claims.","Honesty."),("Postmortem","What broke.","Learning.")]),
    P(id="PBL-QA-B-002", title="Web + Mobile Release Certification Pack", slug="web-mobile-release-certification-pack", track="qa", level="beginner", hours=20,
      summary="Certification checklist spanning web+mobile release risks.",
      pitch="Structured release QA across surfaces.",
      market="Observed in Bangladesh job listings reviewed for QA roles: release certification and cross-platform smoke coverage appear in product QA expectations.",
      pre=["QA-STLC","QA-TEST-DESIGN","QA-MANUAL-TESTING"], out=["QA-TEST-DESIGN","QA-BUG-REPORTING","QA-STLC"],
      tools=["Docs","browsers/devices"], sourceCands=["PLAYWRIGHT-DOCS","W3C-WCAG"], kind="qa",
      ms=[("Strategy","Risk matrix.","Focus."),("Cases","Web+mobile smoke.","Coverage."),("Execution","Bugs with severity.","Communication."),("Sign-off","Certification report.","Release.")]),
    P(id="PBL-QA-I-002", title="API + Database Automation Framework", slug="api-database-automation-framework", track="qa", level="intermediate", hours=30,
      summary="API tests plus DB assertions in CI.",
      pitch="Automation that validates contracts and data.",
      market="Observed in Bangladesh job listings reviewed for SDET/QA automation roles: API testing and database validation appear together in mid-level openings.",
      pre=["QA-API-TESTING","QA-PLAYWRIGHT","QA-CI-INTEGRATION"], out=["QA-API-TESTING","QA-CI-INTEGRATION","QA-PLAYWRIGHT"],
      tools=["Playwright/REST client","CI"], sourceCands=["PLAYWRIGHT-DOCS","POSTGRES-DOCS"], kind="qa",
      ms=[("Framework","Fixtures/config.","Stability."),("API suite","Contract checks.","Value."),("DB asserts","State verification.","Depth."),("CI gate","Artifacts on fail.","Honesty.")]),
    P(id="PBL-QA-A-002", title="Release Quality & Resilience Platform", slug="release-quality-resilience-platform", track="qa", level="advanced", hours=40,
      summary="Quality platform with gates, flake policy, and resilience drills.",
      pitch="Lead QA: pipeline design and resilience evidence.",
      market="Observed in Bangladesh job listings reviewed for senior QA/SDET roles: quality gates, resilience, and release metrics appear in platform-oriented descriptions.",
      pre=["QA-CI-INTEGRATION","QA-PERFORMANCE","QA-PLAYWRIGHT"], out=["QA-CI-INTEGRATION","QA-PERFORMANCE","QA-PLAYWRIGHT"],
      tools=["CI","perf smoke","chaos notes"], sourceCands=["PLAYWRIGHT-DOCS","W3C-WCAG"], kind="qa",
      ms=[("Pipeline map","Stages/criteria.","Architecture."),("Gates","Fail closed critically.","Integrity."),("Resilience drill","Fault injection notes.","Depth."),("Report","Auto quality report.","Leadership.")]),
    P(id="PBL-UX-B-002", title="Mobile Financial / Utility Service Redesign", slug="mobile-financial-utility-service-redesign", track="uiux", level="beginner", hours=24,
      summary="Redesign a mobile financial/utility critical flow with evidence.",
      pitch="Local-market UX: trust, clarity, and a11y for money/utility tasks.",
      market="Observed in Bangladesh job listings reviewed for UI/UX roles: fintech/utility mobile flows appear frequently in product design openings.",
      pre=["UIUX-UX-RESEARCH","UIUX-WIREFRAMING","UIUX-A11Y"], out=["UIUX-UX-RESEARCH","UIUX-WIREFRAMING","UIUX-A11Y"],
      tools=["Figma"], sourceCands=["FIGMA-HELP","W3C-WCAG"], kind="uiux",
      ms=[("Audit","Heuristic issues.","See problems."),("Research plan","Learner-run sessions.","Integrity."),("Flows","Critical path mid-fi.","Structure."),("Case study","Before/after.","Portfolio.")]),
    P(id="PBL-UX-I-002", title="SaaS ERP / CRM Dashboard", slug="saas-erp-crm-dashboard-ux", track="uiux", level="intermediate", hours=34,
      summary="Dense SaaS dashboard UX with components and usability validation.",
      pitch="B2B density done with systems thinking.",
      market="Observed in Bangladesh job listings reviewed for product designers: ERP/CRM dashboard experience appears in SaaS and enterprise-leaning roles.",
      pre=["UIUX-FIGMA","UIUX-DESIGN-SYSTEMS","UIUX-PROTOTYPING"], out=["UIUX-DESIGN-SYSTEMS","UIUX-PROTOTYPING","UIUX-A11Y"],
      tools=["Figma"], sourceCands=["FIGMA-HELP","W3C-WCAG"], kind="uiux",
      ms=[("IA","Objects/roles.","Complexity."),("Components","Tables/filters.","System."),("Prototype","Core workflow.","Proof."),("Usability","Learner-run test.","Evidence.")]),
    P(id="PBL-UX-A-002", title="Enterprise Multi-Platform Design System", slug="enterprise-multi-platform-design-system", track="uiux", level="advanced", hours=42,
      summary="Cross-platform design system with tokens, governance, and handoff.",
      pitch="Advanced design ops: multi-platform consistency and governance.",
      market="Observed in Bangladesh job listings reviewed for senior design roles: design systems and multi-platform consistency appear in mature product orgs.",
      pre=["UIUX-DESIGN-SYSTEMS","UIUX-A11Y","UIUX-FIGMA"], out=["UIUX-DESIGN-SYSTEMS","UIUX-PROTOTYPING","UIUX-A11Y"],
      tools=["Figma"], sourceCands=["FIGMA-HELP","W3C-WCAG"], kind="uiux",
      ms=[("Foundations","Tokens/type.","System base."),("Components","States/variants.","Scale."),("Governance","Contribution rules.","Sustainability."),("Handoff","Dev specs.","Ship.")]),
    P(id="PBL-PM-B-002", title="Client Requirement to Jira Delivery Simulation", slug="client-requirement-jira-delivery-simulation", track="project-management", level="beginner", hours=16,
      summary="Turn messy client requirements into Jira-ready backlog simulation.",
      pitch="Requirement → delivery artifacts without theater.",
      market="Observed in Bangladesh job listings reviewed for PM/BA roles: client requirement translation into Jira/backlog work appears in agency and product delivery contexts.",
      pre=["PM-REQUIREMENTS","PM-AGILE","PM-JIRA"], out=["PM-REQUIREMENTS","PM-ESTIMATION","PM-JIRA"],
      tools=["Docs","Jira/CSV"], sourceCands=["RFC-9110-HTTP"], kind="pm",
      ms=[("Intake","Clarify goals/non-goals.","Scope."),("Stories","AC writing.","Ready work."),("Jira structure","Importable backlog.","Tooling."),("Risks","Register.","Honesty.")]),
    P(id="PBL-PM-I-002", title="ERP Implementation Rollout", slug="erp-implementation-rollout", track="project-management", level="intermediate", hours=24,
      summary="Plan an ERP rollout with RACI, training, and cutover checklist.",
      pitch="Cross-functional rollout discipline.",
      market="Observed in Bangladesh job listings reviewed for mid PMs: ERP/implementation rollout and change management appear in enterprise delivery roles.",
      pre=["PM-STAKEHOLDERS","PM-RISK","PM-SCRUM"], out=["PM-STAKEHOLDERS","PM-RISK","PM-JIRA"],
      tools=["RAID log","comms templates"], sourceCands=["RFC-9110-HTTP"], kind="pm",
      ms=[("Charter","Success metrics.","Clarity."),("RACI","Ownership.","Coordination."),("Cutover","Checklist.","Risk control."),("Comms","Status cadence.","Visibility.")]),
    P(id="PBL-PM-A-002", title="AI Product Delivery Program", slug="ai-product-delivery-program", track="project-management", level="advanced", hours=28,
      summary="Program plan for an AI feature including eval/security risks—simulated stakeholders labeled.",
      pitch="Senior PM: AI delivery needs risk, eval, and honest status.",
      market="Observed in Bangladesh job listings reviewed for senior PM/EM roles: AI feature delivery and risk language is appearing in newer product job posts, without implying universal requirements.",
      pre=["PM-RISK","PM-STAKEHOLDERS","PM-ESTIMATION"], out=["PM-RISK","PM-STAKEHOLDERS","PM-AGILE"],
      tools=["decision records","eval checklist"], sourceCands=["OWASP-LLM-TOP10-2025","OPENAI-API-DOCS"], kind="pm",
      ms=[("Problem framing","User value + non-goals.","Avoid hype."),("Risks","Security/eval/cost.","AI-specific."),("Delivery plan","Milestones.","Realism."),("Exec pack","Asks labeled simulated.","Integrity.")]),
]

# Remaining AI projects (skip B-002 if exists)
AI = [
    P(id="PBL-AI-B-001", title="Prompt Lab + Evaluation Notebook", slug="prompt-lab-evaluation-notebook", track="ai-framework", level="beginner", hours=14, projectRole="core",
      summary="Design prompts with a tiny eval set and pass/fail rubrics.",
      pitch="Shows evaluation discipline—not vibes-based prompting.",
      market="Observed in Bangladesh job listings reviewed for AI-adjacent software roles: prompt quality and evaluation language appears as an emerging plus, while verification remains essential.",
      pre=["AI-LLM-FUNDAMENTALS","AI-PROMPT-ENGINEERING"], out=["AI-PROMPT-ENGINEERING","AI-EVALUATION","AI-LLM-FUNDAMENTALS"],
      tools=["Notebook or markdown eval sheet","optional local model"], sourceCands=["OPENAI-API-DOCS","OWASP-LLM-TOP10-2025"], kind="ai",
      ms=[("Task set","Define 10 cases.","Eval starts with data."),("Prompt v1","Baseline prompts.","Versioning."),("Rubric","Pass/fail rules.","Objectivity."),("Compare v2","Improve with evidence.","Learning.")]),
    P(id="PBL-AI-B-003", title="Structured Document Extractor", slug="structured-document-extractor", track="ai-framework", level="beginner", hours=16, projectRole="core",
      summary="Extract structured JSON from documents with schema validation.",
      pitch="Structured outputs beat free-form chat for products.",
      market="Observed in Bangladesh job listings reviewed for backend/AI-feature roles: document extraction and structured data tasks appear in automation-oriented openings.",
      pre=["AI-PROMPT-ENGINEERING","AI-LLM-FUNDAMENTALS"], out=["AI-PROMPT-ENGINEERING","AI-TOOL-CALLING","AI-EVALUATION"],
      tools=["Provider SDK or local model","schema validator"], sourceCands=["OPENAI-API-DOCS","OWASP-LLM-TOP10-2025"], kind="ai",
      ms=[("Schema","Define JSON schema.","Contract."),("Extract","Prompt + parse.","Core loop."),("Validate","Reject invalid.","Safety."),("Eval set","Measure accuracy.","Evidence.")]),
    P(id="PBL-AI-I-001", title="Citation-Based RAG Knowledge Assistant", slug="citation-based-rag-knowledge-assistant", track="ai-framework", level="intermediate", hours=30, projectRole="core",
      summary="RAG assistant that cites retrieved chunks and refuses when empty.",
      pitch="Grounding + citations are the difference between demo and product.",
      market="Observed in Bangladesh job listings reviewed for AI/fullstack roles: RAG/chat-over-docs appears increasingly in product feature lists.",
      pre=["AI-LLM-FUNDAMENTALS","AI-RAG","AI-PROMPT-ENGINEERING"], out=["AI-RAG","AI-EVALUATION","AI-SECURITY"],
      tools=["embeddings","pgvector or local store"], sourceCands=["OPENAI-API-DOCS","OWASP-LLM-TOP10-2025","POSTGRES-DOCS"], kind="ai",
      ms=[("Ingest","Chunk + embed.","Retrieval base."),("Retrieve","Top-k + citations.","Grounding."),("Refuse path","Empty retrieval.","Honesty."),("Eval","Faithfulness cases.","Quality.")]),
    P(id="PBL-AI-I-002", title="Tool-Calling Operations Assistant", slug="tool-calling-operations-assistant", track="ai-framework", level="intermediate", hours=28, projectRole="core",
      summary="Assistant with bounded tools, schemas, and permission notes.",
      pitch="Tool calling without least privilege is a liability.",
      market="Observed in Bangladesh job listings reviewed for platform/AI roles: tool-using assistants and automation appear in ops and internal-tool contexts.",
      pre=["AI-TOOL-CALLING","AI-PROMPT-ENGINEERING","AI-SECURITY"], out=["AI-TOOL-CALLING","AI-SECURITY","AI-EVALUATION"],
      tools=["function calling SDK","allowlisted tools"], sourceCands=["OPENAI-API-DOCS","OWASP-LLM-TOP10-2025","MCP-SPEC-2026-07-28"], kind="ai",
      ms=[("Tool schemas","Strict JSON.","Contracts."),("Allowlist","Least privilege.","Security."),("Happy path","One ops task.","Value."),("Abuse tests","Injection attempts.","Hardening.")]),
    P(id="PBL-AI-I-003", title="Multimodal Document Intelligence Pipeline", slug="multimodal-document-intelligence-pipeline", track="ai-framework", level="intermediate", hours=32, projectRole="core",
      summary="Pipeline for text+image documents with evaluation and cost notes.",
      pitch="Multimodal products need pipelines, not one-shot chat.",
      market="Observed in Bangladesh job listings reviewed for AI product roles: document intelligence and OCR/LLM hybrids appear in automation and fintech-adjacent themes.",
      pre=["AI-LLM-FUNDAMENTALS","AI-RAG","AI-EVALUATION"], out=["AI-EVALUATION","AI-RAG","AI-SECURITY"],
      tools=["vision-capable model or local alternative","storage"], sourceCands=["OPENAI-API-DOCS","OWASP-LLM-TOP10-2025"], kind="ai",
      ms=[("Ingest","Files + metadata.","Pipeline."),("Extract","Text/vision path.","Capability."),("Normalize","Structured output.","Integration."),("Cost/latency","Measure.","Production.")]),
    P(id="PBL-AI-A-001", title="Stateful Agent with LangGraph + MCP", slug="stateful-agent-langgraph-mcp", track="ai-framework", level="advanced", hours=40, projectRole="core",
      summary="Stateful agent workflow with MCP tools and human-in-the-loop.",
      pitch="Advanced agents: state, tools, and stop conditions.",
      market="Observed in Bangladesh job listings reviewed for senior AI/platform roles: agentic workflows and tool integrations appear in newer advanced openings, still niche.",
      pre=["AI-TOOL-CALLING","AI-CODING-AGENTS","AI-SECURITY"], out=["AI-TOOL-CALLING","AI-SECURITY","AI-EVALUATION"],
      tools=["LangGraph","MCP server","local/dev tools"], sourceCands=["MCP-SPEC-2026-07-28","CURSOR-DOCS-MCP","OWASP-LLM-TOP10-2025"], kind="ai",
      ms=[("State machine","Graph states.","Control."),("MCP tools","Least privilege.","Protocol."),("HITL","Approval step.","Safety."),("Evals","Failure cases.","Evidence.")]),
    P(id="PBL-AI-A-002", title="Open-Model Inference & Evaluation Platform", slug="open-model-inference-evaluation-platform", track="ai-framework", level="advanced", hours=42, projectRole="core",
      summary="Serve/evaluate an open model locally with metrics and harness.",
      pitch="Open-model ops: serving, eval, and cost/latency trade-offs.",
      market="Observed in Bangladesh job listings reviewed for ML/AI engineering roles: open models and evaluation platforms appear in research-leaning and cost-sensitive teams.",
      pre=["AI-LLM-FUNDAMENTALS","AI-EVALUATION","AI-SECURITY"], out=["AI-EVALUATION","AI-LLM-FUNDAMENTALS","AI-SECURITY"],
      tools=["Ollama or vLLM","eval harness"], sourceCands=["OPENAI-API-DOCS","OWASP-LLM-TOP10-2025"], kind="ai",
      ms=[("Serve local","Run model locally.","Control."),("Harness","Batch prompts.","Eval."),("Metrics","Quality/latency.","Trade-offs."),("Security notes","Data handling.","Governance.")]),
    P(id="PBL-AI-A-003", title="Multi-Tenant AI Copilot SaaS", slug="multi-tenant-ai-copilot-saas", track="ai-framework", level="advanced", hours=50, projectRole="core",
      summary="Multi-tenant copilot with isolation, auth, and observability.",
      pitch="Production AI SaaS: tenancy, security, cost, and traces.",
      market="Observed in Bangladesh job listings reviewed for senior fullstack/AI product roles: multi-tenant AI assistants appear in SaaS roadmaps, with strong emphasis on security.",
      pre=["AI-RAG","AI-SECURITY","AI-EVALUATION"], out=["AI-SECURITY","AI-EVALUATION","AI-RAG"],
      tools=["web app","vector store","tracing"], sourceCands=["OWASP-LLM-TOP10-2025","OPENAI-API-DOCS","MCP-SPEC-2026-07-28"], kind="ai",
      ms=[("Tenancy","Isolate data.","Safety."),("Copilot UX","Grounded answers.","Product."),("Observability","Traces/cost.","Ops."),("Security eval","Injection + leak tests.","Hardening.")]),
]

def main() -> None:
    written = []
    for item in PROJECTS + AI:
        if item["id"] == "PBL-AI-B-002":
            continue
        existing = OUT / f"{item['slug']}.mdx"
        # skip if another file already has this id
        skip = False
        for p in OUT.glob("*.mdx"):
            if f'id: "{item["id"]}"' in p.read_text()[:400]:
                skip = True
                break
        if skip:
            continue
        write_project(item)
        written.append(item["id"])
    print(f"Wrote {len(written)} projects")
    for w in written:
        print(" -", w)


if __name__ == "__main__":
    main()
