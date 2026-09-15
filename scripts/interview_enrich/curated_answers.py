from __future__ import annotations

import re

from .lib import curated


def numbered(*steps: str) -> str:
    return " ".join(f"{i}) {step.rstrip('.')}" for i, step in enumerate(steps, 1)) + "."


def clean_question(question: str, limit: int = 96) -> str:
    text = re.sub(r"\s+", " ", question.strip().rstrip("?"))
    compare = re.match(r"^compare\s+(.+)$", text, flags=re.I)
    if compare:
        text = "Comparing " + compare.group(1)
    text = re.sub(r"^(what|how|why|when|where|explain|describe|design)\s+", "", text, flags=re.I)
    text = re.sub(r"^(is|are|would|do|does|should|can|could)\s+", "", text, flags=re.I)
    text = re.sub(r"^you\s+", "", text, flags=re.I)
    text = re.sub(r"^a (.+?) call (.+)$", r"\1 calling \2", text, flags=re.I)
    text = text.replace(" versus ", " vs ")
    text = text[:limit].strip(" ,.")
    return text[:1].upper() + text[1:] if text else "This answer"


def sentence(text: str) -> str:
    text = text.strip().rstrip(".?!")
    text = text[:1].upper() + text[1:] if text else text
    return text + "."


def compare_short(focus: str, domain: str) -> str:
    return sentence(f"{focus} differ by purpose, risk, evidence, and the decision they support in {domain}")


def definition_short(focus: str, domain: str) -> str:
    return sentence(f"{focus} is a core {domain} concept with a concrete artifact, owner, and verification signal")


def action_short(focus: str, domain: str) -> str:
    return sentence(f"{focus} requires a clear goal, constraints, execution steps, evidence, and follow-up in {domain}")


def qa_answer(q: dict) -> dict:
    qid = q["id"]
    question = q["question"]
    lower = question.lower()
    focus = clean_question(question)
    if qid == "QA-B-0034":
        return curated(
            "Functional testing checks features against requirements; non-functional testing checks qualities like performance, security, usability, reliability, and accessibility.",
            "Functional testing asks whether the product does the right thing for a user scenario or business rule. Non-functional testing asks how well the product behaves under constraints such as speed, load, resilience, security, and accessibility. A checkout test that verifies an order is created is functional; a k6 test that confirms p95 checkout latency stays under 800 ms is non-functional. Good QA strategies include both because a correct feature can still be unusable, insecure, or too slow.",
            numbered("Map requirements into functional cases", "Map quality attributes into measurable thresholds", "Automate stable checks at the cheapest layer", "Report residual risk before release"),
            "Example: Playwright verifies order confirmation text; k6 verifies checkout p95 latency and error-rate thresholds.",
        )
    if qid == "QA-B-0050":
        return curated(
            "Severity describes defect impact, while priority describes how urgently the business wants the fix scheduled.",
            "Severity is about technical or user impact: data loss, crash, blocked checkout, or cosmetic defect. Priority is about ordering work given release timing, customer commitments, and business value. QA usually proposes severity from evidence, while product, engineering, and support influence priority. Keeping the fields separate prevents a low-impact demo issue or a high-impact rare bug from being discussed with the wrong vocabulary.",
            numbered("Assess user and system impact", "Assign severity with examples", "Agree priority with stakeholders", "Record rationale in the bug"),
            "Bug example: S1 data corruption can be P1 immediately; an S3 typo can become P1 only if it blocks a scheduled launch demo.",
        )
    if qid == "QA-B-0075":
        return curated(
            "Severity should be influenced by user/system impact; priority should be influenced by business urgency, release risk, and stakeholder commitments.",
            "Severity answers how bad the defect is if it occurs, using evidence such as data loss, security exposure, task blockage, or visual annoyance. Priority answers when to fix it relative to other work, using context such as launch dates, affected customers, revenue, and workaround quality. QA, engineering, and support should inform severity because they see impact and reproducibility. Product, business owners, and engineering leadership should help set priority because it is a tradeoff against other delivery goals.",
            numbered("Document impact evidence", "Separate severity from scheduling urgency", "Bring the right stakeholders into priority decisions", "Revisit priority if exposure changes"),
            "Triage ritual: QA proposes S-level, PM sets P-level with engineering input, and the release owner records accepted risk.",
        )
    if qid == "QA-A-0050":
        return curated(
            "Payment idempotency testing proves that retries with the same key create one charge, one order record, and a stable response.",
            "A payment API must assume clients, gateways, and networks can retry after timeouts. Test the same Idempotency-Key with the same payload, a reused key with a different payload, concurrent duplicate submissions, and a retry after a simulated mid-flight failure. Assert both the API response and the database or ledger state so duplicate side effects cannot hide behind a 200. Also verify key TTL, audit logs, and reconciliation behavior for gateway webhooks.",
            numbered("Choose mutating payment endpoints", "Send duplicate and concurrent requests with controlled keys", "Assert ledger, order, and response stability", "Test TTL, mismatch, and recovery cases"),
            "Payment replay pack: POST /payments key=abc twice returns the same paymentId; concurrent key=abc inserts one ledger row; key=abc with different amount returns 409.",
        )
    if any(x in lower for x in ("smoke", "sanity", "regression", "retesting")):
        short = sentence(f"{focus} separate build confidence, focused fix confidence, broad change safety, and defect verification")
        answer = f"{focus} should be described by scope and timing. Smoke testing is broad and shallow, sanity is narrow around a change, regression protects existing behavior, and retesting verifies a specific bug fix. Keep each suite tagged so CI or release managers can choose the right signal quickly. The risk is letting a smoke pack grow into a slow regression pack that nobody trusts."
        example = f"Playwright tags for {focus}: @smoke login and checkout, @sanity refund hotfix, @regression nightly account and payment paths."
    elif any(x in lower for x in ("api", "http", "contract", "idempot", "pagination", "authorization")):
        short = sentence(f"{focus} checks the API contract, authorization, payload shape, side effects, and retry behavior")
        answer = f"{focus} should go beyond checking for HTTP 200. Assert status codes, schema, error body, authn/authz matrix, idempotency or retry behavior, pagination boundaries, and database-visible side effects when appropriate. Use Postman/Newman or Playwright API tests with deterministic data and environment variables. A passing response is only useful when the contract and business state are correct."
        example = f"Postman/Newman for {focus}: assert schema, 403 for another user, duplicate Idempotency-Key returns same paymentId, and JUnit output in CI."
    elif any(x in lower for x in ("playwright", "locator", "fixture", "trace", "retry", "sharding", "parallel", "sleep", "flaky", "browser")):
        short = sentence(f"{focus} depends on isolated data, resilient locators, web-first assertions, and useful failure artifacts")
        answer = f"{focus} should focus on determinism before speed. Use role or label locators, per-test fixtures, unique worker data, trace retention on failure, and limited CI retries that are reported. Classify failures as product race, test isolation, timing, or infrastructure before increasing timeouts. Fixed sleeps usually hide the race while making the suite slower."
        example = f"Playwright for {focus}: getByRole locators, expect(locator).toHaveText(), trace: 'retain-on-failure', and retries: CI ? 1 : 0."
    elif any(x in lower for x in ("load", "stress", "spike", "soak", "performance", "scalability", "virtual users", "k6")):
        short = sentence(f"{focus} requires realistic workload modeling, thresholds, and bottleneck evidence")
        answer = f"{focus} starts with the journey, arrival rate or VUs, think time, data mix, p95 or p99 latency, and acceptable error rate. Run k6 or JMeter while watching app, database, cache, queue, dependency, and load-generator metrics. Distinguish load, stress, spike, soak, and scalability goals because each answers a different release question. The report should say whether to ship, tune, scale, or accept documented risk."
        example = f"k6 for {focus}: constant-arrival-rate checkout, p95<800ms, http_req_failed<1%, and tagged steps for payment, inventory, and confirmation."
    elif any(x in lower for x in ("accessibility", "keyboard", "screen", "wcag")):
        short = sentence(f"{focus} combines automated accessibility scans with keyboard and screen-reader evidence")
        answer = f"{focus} should include automated checks and manual assistive-technology passes. Verify focus order, visible focus, names, roles, states, error announcements, contrast, and escape behavior in overlays. Automated tools catch many code issues but cannot prove that the journey is understandable. File defects with user impact, reproduction steps, and the relevant criterion."
        example = f"Accessibility charter for {focus}: Tab through checkout, submit invalid form, confirm focus and NVDA announcement for the first error."
    else:
        short = action_short(focus, "QA")
        answer = f"{focus} should name the quality risk, expected behavior, test data, oracle, and environment. Choose the cheapest reliable layer: unit for pure logic, API for service rules, browser E2E for cross-layer journeys, and exploratory testing for discovery. Capture evidence such as logs, screenshots, traces, SQL checks, or CI reports so failures are reproducible. Turn repeated defects into prevention work such as checklists, contract tests, or better fixtures."
        example = f"QA evidence for {focus}: test matrix, setup data, expected oracle, build/environment, failure artifact, owner, and regression candidate."
    return curated(short, answer, numbered(f"Define the risk for {focus}", "Choose the lowest reliable test layer", "Run with deterministic data and captured evidence", "Feed findings into defects and regression coverage"), example)


def uiux_answer(q: dict) -> dict:
    focus = clean_question(q["question"])
    lower = q["question"].lower()
    if q["id"] == "UX-A-0019":
        return curated(
            "A dark-pattern request should be challenged by showing user harm, trust risk, legal exposure, and cleaner conversion alternatives.",
            "Start by restating the business goal so the stakeholder feels heard. Then show why the proposed pattern manipulates consent or comprehension and how that can increase refunds, complaints, churn, regulatory risk, or brand damage. Offer an ethical alternative such as clearer value framing, better defaults, reminder timing, or a transparent comparison. Validate the alternative with an A/B test that includes guardrails like cancellations, support contacts, and complaint rate.",
            numbered("Clarify the conversion goal", "Name the user harm and business risk", "Propose an ethical alternative", "Measure conversion with trust guardrails"),
            "Design critique card: goal, dark-pattern risk, user harm, legal/trust risk, ethical variant, primary metric, guardrails.",
        )
    if q["id"] == "UX-A-0069":
        return curated(
            "A stakeholder dark-pattern challenge should convert the disagreement into an evidence-based decision about trust, consent, and long-term value.",
            "Do not frame the conversation as designer taste versus business goals. Identify the mechanism that is deceptive, such as hidden opt-outs, forced continuity, confusing cancellation, or misleading urgency. Show comparable compliant patterns and explain how they can preserve conversion without violating user intent. Ask for a decision rule that includes retention, complaints, refunds, accessibility, and legal review rather than click-through rate alone.",
            numbered("Identify the deceptive mechanism", "Show ethical replacement patterns", "Agree on guardrail metrics", "Document the decision and follow-up test"),
            "Workshop flow: map the pressured user path, mark consent breakpoints, sketch transparent alternatives, and choose metrics beyond conversion.",
        )
    if any(x in lower for x in ("component", "variant", "figma", "auto layout", "design system")):
        short = sentence(f"{focus} defines reusable interface structure, states, constraints, tokens, and guidance for consistent implementation")
        answer = f"{focus} is about reusable behavior, not just a polished frame. Define variants, properties, constraints, tokens, responsive behavior, content limits, accessibility labels, and all interactive states. Handoff should say what engineers build, what designers reuse, and when the pattern should not be used. Governance prevents each product area from inventing a nearly identical component."
        example = f"Component checklist for {focus}: variants, states, token names, min target, long text, empty/error/loading, do/don't guidance."
    elif any(x in lower for x in ("accessibility", "contrast", "keyboard", "wcag")):
        short = sentence(f"{focus} protects readability and operability for users with different vision, motor, and assistive-technology needs")
        answer = f"{focus} should tie visual and interaction choices to inclusive task completion. Check contrast, focus order, target size, labels, error association, and screen-reader names before signoff. Fix repeated failures in tokens or source components so the improvement scales. Explain the user harm and test method rather than only citing a guideline."
        example = f"Accessibility checklist for {focus}: 4.5:1 text contrast, visible focus, 44px target, label, and error association."
    elif any(x in lower for x in ("research", "interview", "usability", "persona", "journey", "flow", "wireframe", "prototype")):
        short = sentence(f"{focus} uses a chosen artifact or research method to reduce uncertainty about a user task")
        answer = f"{focus} starts with the decision the team needs to make and the behavior to observe. Use interviews for motivations, usability tests for task friction, card sorting for information architecture, and analytics for scale. Reduce bias with representative participants, neutral prompts, and clear task-success criteria. Translate findings into design changes and follow-up questions."
        example = f"Research or flow plan for {focus}: objective, participants, task, script, success criteria, synthesis format, and design action."
    elif any(x in lower for x in ("portfolio", "case study", "project", "proud", "feedback")):
        short = sentence(f"{focus} should show problem framing, role, constraints, design decisions, evidence, and outcome")
        answer = f"{focus} needs a narrative with context, audience, constraint, role, options, decision, and measurable result. Show artifacts only when they explain a decision, such as journey maps, wireframes, prototypes, component specs, or usability notes. Name feedback you accepted, rejected, or tested further so critique does not sound personal. The strongest case studies prove judgment under constraints."
        example = f"Case-study board for {focus}: problem, audience, constraint, iterations, evidence, final design, metric, and lesson."
    else:
        short = sentence(f"{focus} connects visual priority, interaction states, content, accessibility, and validation to task completion")
        answer = f"{focus} should explain how users understand the screen, choose an action, recover from errors, and know whether the system responded. Cover hierarchy, copy, spacing, state design, responsive behavior, and accessibility as parts of one flow. Validate the riskiest assumption with critique, prototype testing, heuristics, or analytics. Include empty, loading, error, and success states rather than only the ideal screen."
        example = f"Design review card for {focus}: user job, primary action, hierarchy, states, accessibility, metric, and open risk."
    return curated(short, answer, numbered(f"Frame the design decision for {focus}", "Create the artifact with core and edge states", "Validate the riskiest assumption", "Document rationale and handoff details"), example)


def pm_answer(q: dict) -> dict:
    focus = clean_question(q["question"])
    lower = q["question"].lower()
    if any(x in lower for x in ("status", "delayed", "communicate", "stakeholder", "expectation", "conflict")):
        short = sentence(f"{focus} requires early facts, impact, options, owner, revised forecast, and a clear decision request")
        answer = f"{focus} should communicate the variance before it becomes a surprise. State the original baseline, current forecast, cause, impact, mitigation, owner, and decision needed. RAG status is only a headline; stakeholders need the evidence and options behind it. Close the loop in writing so the new baseline is shared."
        example = f"Status ritual for {focus}: RAG, forecast date, variance, blocker, mitigation, owner, and decision requested."
    elif any(x in lower for x in ("scope", "risk", "raid", "change", "dependency", "creep", "quality")):
        short = sentence(f"{focus} turns uncertainty or scope movement into an owned decision with impact and mitigation")
        answer = f"{focus} should capture the effect on scope, schedule, cost, quality, and benefits before a change or risk is accepted. RAID fields should include owner, probability, impact, trigger, mitigation, due date, contingency, and status. Escalate only when the current owner cannot resolve the issue inside tolerance. The best PM answer presents options rather than panic."
        example = f"RAID entry for {focus}: type, description, probability/impact, trigger, mitigation, owner, due date, and decision."
    elif any(x in lower for x in ("scrum", "agile", "sprint", "backlog", "story", "acceptance", "refinement")):
        short = sentence(f"{focus} should improve product flow through clear goals, ready work, feedback, and adaptation")
        answer = f"{focus} is useful only when it helps the team deliver a valuable increment. Backlog items need user value, acceptance criteria, dependencies, size, and testability. Scrum events inspect progress and adapt plans; they are not status meetings for managers. Watch WIP, carryover, blockers, and retro actions to judge process health."
        example = f"Delivery board for {focus}: Sprint Goal, ready stories, blockers, acceptance status, demo scope, and retro action."
    elif any(x in lower for x in ("metric", "velocity", "lead", "cycle", "dora", "throughput", "estimate", "story points")):
        short = sentence(f"{focus} should be used as a planning signal, not as a productivity scorecard")
        answer = f"{focus} should define what the metric measures, what it excludes, and which decision it supports. Velocity forecasts one team's future Sprints, while lead time, cycle time, throughput, and DORA-style metrics reveal delivery flow. Comparing teams by points creates gaming and weakens trust. Pair numbers with blockers, defect trends, dependency waits, and customer outcomes."
        example = f"Metric review for {focus}: trend, target, blocker hypothesis, action owner, and next review date."
    else:
        short = sentence(f"{focus} coordinates scope, schedule, cost, quality, people, risk, and governance around a delivery outcome")
        answer = f"{focus} should clarify objective, in/out scope, success criteria, assumptions, stakeholders, dependencies, and decision rights. Use artifacts such as a project brief, roadmap, WBS, RAID log, decision log, and status report only when they improve decisions. A senior PM changes the plan when evidence changes instead of defending outdated commitments. The answer should name owners and cadence."
        example = f"Project artifact for {focus}: objective, scope, milestone, owner, dependency, risk, quality gate, and decision log."
    return curated(short, answer, numbered(f"Write the current baseline for {focus}", "Assign owners and dates", "Review evidence on cadence", "Escalate tradeoffs with options and impact"), example)


def fullstack_answer(q: dict) -> dict:
    qid = q["id"]
    question = q["question"]
    focus = clean_question(question)
    lower = question.lower()
    if qid == "FS-B-0026":
        return curated(
            "CORS is a browser-enforced protection that requires the API to explicitly allow the frontend origin, methods, headers, and credential mode.",
            "CORS is checked by the browser, not by Postman or the server by itself. A frontend request can be blocked when the API omits Access-Control-Allow-Origin, uses '*' with credentials, rejects the preflight method or headers, or sets cookies for the wrong origin policy. The backend should allowlist known frontend origins and decide whether cookies or bearer tokens are used. Debug it in the browser Network tab by comparing the OPTIONS preflight and the actual request headers.",
            numbered("List allowed frontend origins", "Configure CORS methods, headers, and credentials explicitly", "Test preflight and actual requests in a browser", "Keep auth cookie and CSRF rules aligned"),
            "FE+BE sketch: fetch('https://api.example.com/orders', { credentials: 'include' }); API returns Access-Control-Allow-Origin: https://app.example.com and Allow-Credentials: true.",
        )
    if any(x in lower for x in ("cors", "cookie", "session", "auth", "csrf", "login", "storage")):
        short = sentence(f"{focus} follows identity, browser security, cookies or tokens, backend authorization, and safe client feedback")
        answer = f"{focus} should trace the identity path from UI event to HTTP headers, backend guard, session or token validation, authorization, persistence, and response handling. The frontend can guide users but the backend must enforce identity, permission, and tenant boundaries. Check origin, credentials mode, cookie attributes, CSRF token, token refresh, and error shape. Debug with browser Network, Set-Cookie, server logs, and correlation ids."
        example = f"FE+BE sketch for {focus}: login form -> POST /session -> auth guard -> Set-Cookie HttpOnly/SameSite -> user-safe JSON error or profile response."
    elif any(x in lower for x in ("docker", "readme", "environment", "staging", "production", "monorepo")):
        short = sentence(f"{focus} depends on reproducible services, environment variables, migrations, seed data, and clear secret boundaries")
        answer = f"{focus} should let another developer run the frontend, API, database, cache, and workers predictably. Document ports, commands, env vars, secrets, migrations, seed data, health checks, tests, and troubleshooting. Docker Compose helps local parity, while staging validates managed services, permissions, and production-like limits. Browser-exposed variables must be separated from server-only secrets."
        example = f"README sketch for {focus}: install, copy .env.example, compose up, migrate, seed, run FE/API, test, and troubleshoot ports."
    elif any(x in lower for x in ("transaction", "migration", "database", "queue", "webhook", "payment", "consistency")):
        short = sentence(f"{focus} needs explicit consistency, idempotency, rollback, status, and reconciliation rules")
        answer = f"{focus} should explain which changes must be atomic and which can run asynchronously. Use transactions for local invariants, idempotency keys for retries, queues or workers for long-running work, and status models for the UI. Rolling migrations should expand, backfill, read or write both when needed, and contract only after old code is gone. Reconcile with audit rows, webhook receipts, and correlation ids."
        example = f"FE+BE sketch for {focus}: POST command -> transaction row -> enqueue job -> UI polls status -> reconcile webhook by idempotency key."
    elif any(x in lower for x in ("react", "next", "ssr", "api", "validation", "frontend", "backend", "bff")):
        short = sentence(f"{focus} separates rendering and interaction from backend validation, authorization, persistence, and side effects")
        answer = f"{focus} should distinguish UI responsibility from backend authority. React or Next.js handles state, routes, rendering mode, and user feedback; backend services own validation, authorization, domain rules, persistence, and side effects. Shared types reduce drift but runtime validation is still required at trust boundaries. Choose SSR, RSC, CSR, or BFF based on latency, SEO, security, and ownership."
        example = f"FE+BE sketch for {focus}: form hints in UI -> typed request -> validation pipe -> service -> repository -> response mapper."
    else:
        short = sentence(f"{focus} should be traced as one request path across UI, API, data, cache, deployment, and observability")
        answer = f"{focus} should not be answered as isolated frontend or backend trivia. Trace browser event, request construction, controller, service rule, persistence or dependency, response mapping, cache update, and user feedback. Name where validation, authorization, caching, retries, flags, logs, metrics, and rollback belong. Test at the layer where each risk is cheapest to catch."
        example = f"FE+BE sketch for {focus}: click -> typed API call -> auth/validation -> DB/cache/queue -> response -> UI state and trace id."
    return curated(short, answer, numbered(f"Draw the layer-by-layer path for {focus}", "Define contract, auth, validation, state, and errors", "Test with unit, contract, and E2E coverage", "Instrument correlation ids and rollback"), example)


def curated_by_id(track: str, questions: list[dict]) -> dict:
    makers = {
        "qa": qa_answer,
        "uiux": uiux_answer,
        "project-management": pm_answer,
        "fullstack": fullstack_answer,
    }
    maker = makers[track]
    return {q["id"]: maker(q) for q in questions if not (q.get("topic") or "").strip()}
