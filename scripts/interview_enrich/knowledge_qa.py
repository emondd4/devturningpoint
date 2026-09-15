"""Concrete QA / SDET interview knowledge."""

from .lib import K, curated

QA_TOPICS = {
    "AI-assisted test generation": K(
        "AI-assisted test generation uses LLMs or codegen to propose cases, data, or scripts from requirements, APIs, or UI—then humans review and harden them.",
        "It speeds coverage of obvious paths but invents flaky locators, misses risk, and can invent assertions that never fail.",
        [
            "Prompt + context quality beats model brand",
            "Generated tests need human risk review",
            "Treat output as draft automation, not oracle",
            "Track false confidence / invented behavior",
        ],
        "Feed specs/OpenAPI/user flows → generate candidates → triage by risk → rewrite locators/assertions → run in CI → keep only stable suites.",
        "Faster drafting vs hallucinated coverage; good for boilerplate, weak for security/concurrency without expert prompts.",
        "When suites fail oddly: compare generated vs intended behavior, delete tests that assert implementation quirks, and require review gates before merge.",
        """# Review checklist for AI-drafted Playwright
# - role/name locators (not nth-child)
# - asserts business outcome, not CSS
# - no fixed sleep; use expect auto-wait
# - owns its test data""",
        "1) Pilot on one API/UI area. 2) Require PR review for generated tests. 3) Quarantine flaky output. 4) Measure bugs found vs maintenance cost.",
    ),
    "API contract": K(
        "An API contract is the agreed shape of requests/responses (schemas, status codes, auth, errors)—often OpenAPI/JSON Schema—independent of one implementation.",
        "Without a contract, consumers and providers drift and break silently; testers cannot distinguish product bugs from undocumented change.",
        [
            "Schema + status + error model",
            "Backward compatibility rules",
            "Consumer-driven vs provider-driven contracts",
            "Versioning / deprecation policy",
        ],
        "Publish/schema → generate or write consumer tests → CI fails on incompatible diffs → providers evolve with additive changes first.",
        "Strict contracts catch breakages early but slow exploratory change; loose contracts speed ship and hide breakage.",
        "On 4xx/5xx surprises: diff OpenAPI vs payload, check content-type, auth headers, and whether staging runs an older provider.",
        """# Pact-style idea (consumer expectation)
# GET /orders/123 → 200 { id, status, total }
# Provider verification replays against real API""",
        "1) Store OpenAPI in repo. 2) Add contract tests in CI. 3) Block breaking PRs unless versioned. 4) Document error codes for QA.",
    ),
    "idempotency testing": K(
        "Idempotency testing verifies repeating the same request (same key/payload) does not create duplicate side effects—critical for payments and retries.",
        "Networks retry; without idempotent APIs, duplicate charges/orders appear only under load or flaky CI.",
        [
            "Idempotency-Key / natural key",
            "Safe retries vs unsafe POST",
            "Exactly-once illusion vs at-least-once + dedupe",
            "Replay windows and key TTL",
        ],
        "Send request twice with same key → assert one resource and same response → vary key → assert two resources → kill mid-flight and replay.",
        "Strong dedupe needs storage and TTL design; skipping it is simpler until the first double-charge incident.",
        "If duplicates appear: check key not forwarded, race without unique constraint, or client generating new keys on retry.",
        """# Example cases
# 1) POST /payments Idempotency-Key=abc → 201
# 2) replay same → 200/201 same paymentId
# 3) different key → new payment
# 4) concurrent dual send → still one row""",
        "1) List mutating endpoints. 2) Add replay tests in API suite. 3) Assert DB uniqueness. 4) Document client retry rules.",
    ),
    "positive testing": K(
        "Positive testing checks valid inputs and authorized happy paths to confirm the system delivers the intended outcome.",
        "Teams that only test negatives miss broken core journeys; positive coverage is the backbone of smoke and acceptance.",
        [
            "Valid equivalence classes",
            "Authorized actor assumptions",
            "Observable success criteria",
            "Not a substitute for negative/security tests",
        ],
        "Pick valid data → exercise primary flow → assert business state (DB/UI/API) not only HTTP 200.",
        "Positive-only suites ship false confidence; negative-only suites miss product value regressions.",
        "When happy path fails intermittently: check data preconditions, auth tokens, and environment config before blaming the assertion.",
        """test('create order happy path', async ({ request }) => {
  const res = await request.post('/api/orders', { data: validOrder });
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.status).toBe('PENDING');
});""",
        "1) Map critical journeys. 2) Automate positive smoke. 3) Pair each with at least one negative. 4) Gate releases on smoke green.",
    ),
    "keyboard testing": K(
        "Keyboard testing verifies all interactive flows work with Tab/Shift+Tab, Enter/Space, Esc, and arrows—without requiring a mouse.",
        "Keyboard-only and power users (and many a11y users) cannot complete tasks if focus traps or custom widgets ignore keys.",
        [
            "Focus order ≈ visual order",
            "Visible focus indicator",
            "No keyboard trap",
            "Activation keys per control type",
        ],
        "Unplug mouse mindset → Tab through page → operate controls → Esc closes overlays → assert focus return.",
        "Automated tab-order checks help but miss modality issues; manual keyboard passes catch custom widgets.",
        "If focus disappears: look for tabindex=-1 mismanagement, aria-hidden on focused nodes, or CSS outline:none without replacement.",
        """# Manual charter
# 1) Tab to primary CTA without mouse
# 2) Open modal, Tab within, Esc closes, focus restores
# 3) Menu: arrows + Enter""",
        "1) Add keyboard charter to DoD. 2) Test new components in Storybook. 3) Ban outline:none without :focus-visible. 4) Track a11y bugs as P1 when blocking.",
    ),
    "screen reader testing": K(
        "Screen reader testing checks that name, role, state, and announcements make the UI usable with VoiceOver/NVDA/TalkBack—not only that axe is green.",
        "Automated a11y scanners miss unlabeled live regions, wrong roles, and broken reading order.",
        [
            "Accessible name computation",
            "Role/state via semantics or ARIA",
            "Reading order vs visual order",
            "Live regions for async updates",
        ],
        "Navigate by headings/landmarks/forms → operate controls → confirm announcements for errors/success → fix semantics before more ARIA.",
        "Scanner-only is fast but incomplete; SR sessions are slower and find real blockers.",
        "If SR is silent: missing label, role presentation on interactive, or update not in aria-live.",
        """# Charter: checkout error
# - NVDA forms mode on email
# - Submit empty → error announced
# - Focus moves to first invalid field""",
        "1) Pick 3 critical journeys. 2) Run quarterly SR on each platform. 3) Fix name/role issues first. 4) Keep axe in CI as a floor, not a ceiling.",
    ),
    "shift-left": K(
        "Shift-left means moving quality activities earlier—reviews, unit/contract tests, a11y in design—so defects are cheaper to fix.",
        "Late-only QA finds issues after code is expensive to change and compresses release risk into the end.",
        [
            "Early test design from stories",
            "Dev-owned unit/contract tests",
            "QA as coach + risk analyst",
            "Prevention over late inspection",
        ],
        "During refinement write acceptance + risks → add tests with the PR → CI gates → exploratory on residual risk.",
        "Too much shift-left without env realism misses integration bugs; too little creates fire drills.",
        "If bugs still escape: check whether ‘early tests’ assert implementation trivia instead of risks, or staging != prod config.",
        """# Story DoD snippet
# - acceptance criteria testable
# - API contract updated
# - unit + one integration path
# - a11y notes for new UI""",
        "1) Add QA to refinement. 2) Require tests in PR template. 3) Publish risk checklist. 4) Measure escaped defects by phase found.",
    ),
    "shift-right": K(
        "Shift-right extends quality into production via monitoring, synthetic checks, feature flags, and controlled experiments.",
        "Pre-release tests cannot cover all real traffic shapes; production signals catch what labs miss.",
        [
            "Synthetics + real-user monitoring",
            "Feature flags / canaries",
            "Observability as a test oracle",
            "Incident learning loops",
        ],
        "Ship behind flag → watch SLOs/error budget → synthetic journey → ramp traffic → rollback on signal.",
        "Production testing without guardrails is chaos; ignoring production signals is flying blind.",
        "Alert noise: tighten SLOs, fix flaky synthetics, and correlate with deploys before paging humans.",
        """# Synthetic every 5m
# login → list orders → open detail
# fail if p95>2s or HTTP>=500""",
        "1) Define critical journeys. 2) Add synthetics. 3) Tie alerts to owners. 4) Review production bugs in retro.",
    ),
    "Appium server": K(
        "The Appium server is the hub that receives WebDriver BiDi/W3C commands and routes them to platform drivers (UiAutomator2, XCUITest, etc.).",
        "Without understanding server vs driver, engineers misconfigure sessions and chase ‘Appium bugs’ that are capability/driver issues.",
        [
            "Client → Appium server → driver → device",
            "Capabilities/options start the session",
            "Server logs ≠ device logs",
            "One server can host many sessions",
        ],
        "Start server → create session with caps → commands execute on device → quit session → inspect server + device logs on failure.",
        "Local server is simple; device farms need stable routing, versions, and isolation.",
        "Session fails to start: check platformVersion/udid, driver install, WDA for iOS, and Appium major version vs client.",
        """# appium server; then
desired_caps = {
  'platformName': 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Pixel_7',
  'appium:app': '/apps/app.apk',
}""",
        "1) Pin Appium + driver versions. 2) Centralize caps. 3) Capture server+device logs in CI artifacts. 4) Health-check devices before suite.",
    ),
    "UiAutomator2": K(
        "UiAutomator2 is Appium’s Android automation driver that instruments the device to find elements and perform gestures via the UiAutomator2 server APK.",
        "Wrong automationName or mismatched driver versions cause flaky finds and gesture failures on Android.",
        [
            "Android-only driver",
            "resource-id / accessibility id locators",
            "Context native vs webview",
            "Permissions and reset strategies",
        ],
        "Install driver → set automationName=UiAutomator2 → locate by stable ids → handle webview context switches → reset app between tests if needed.",
        "Fast on emulators; real devices differ on OEM skins and permissions dialogs.",
        "Element not found: dump UI XML, check activity, wait for idle, confirm not in webview without context switch.",
        """options = UiAutomator2Options()
options.app = 'app-debug.apk'
options.appPackage = 'com.example'
options.appActivity = '.MainActivity'""",
        "1) Standardize UiAutomator2Options. 2) Prefer content-desc/resource-id. 3) Seed permissions. 4) Record page source on failure.",
    ),
    "capabilities/options": K(
        "Capabilities/options are the session configuration that tell Appium/WebDriver which device, app, browser, and driver behavior to use.",
        "Bad caps waste hours on ‘flaky tests’ that never had a valid session or pointed at the wrong app build.",
        [
            "W3C capabilities vs vendor options",
            "Device identity (udid/avd)",
            "App path vs package/activity",
            "noReset/fullReset trade-offs",
        ],
        "Build options object → create session → verify session details → run tests → quit; keep caps in one factory per project.",
        "Permissive resets speed tests but leak state; hard resets isolate but slow CI.",
        "Session errors: print resolved caps, confirm app exists, and align client/server capability names (appium: prefix).",
        """# Playwright projects analogous idea: per-browser config
# Appium: one Options factory per platform""",
        "1) Centralize options factories. 2) Validate required keys in CI. 3) Version apps under test. 4) Document reset policy.",
    ),
    "contract testing": K(
        "Contract testing verifies that a provider still satisfies consumer expectations without running a full E2E stack every time.",
        "E2E-only feedback is slow and flaky; undocumented APIs break mobile/web clients after independent deploys.",
        [
            "Consumer expectations as executable specs",
            "Provider verification in CI",
            "Not a substitute for business E2E",
            "Versioned contracts / brokering",
        ],
        "Consumer writes expectation → publishes contract → provider verifies against real API → breakages fail provider pipeline.",
        "Contracts scale multi-team APIs; over-contracting freezes evolution. Prefer E2E for few critical journeys.",
        "Verification fails: check env data, auth, and whether consumer assumed fields provider never promised.",
        """# Consumer: expect GET /users/me → { id, email }
# Provider CI: verify against staging with test user""",
        "1) Pick highest-churn APIs. 2) Add consumer tests. 3) Verify in provider CI. 4) Keep 1–3 E2E journeys.",
    ),
    "testability": K(
        "Testability is how easily a system can be observed, controlled, and isolated for tests—hooks, IDs, seams, clocks, and deterministic data.",
        "Untestable UIs force brittle selectors and sleeps; untestable backends hide state behind side effects.",
        [
            "Controllability (seed, time, feature flags)",
            "Observability (ids, logs, test hooks)",
            "Isolatability (fakes/seams)",
            "Design for test during storying",
        ],
        "Ask for test IDs/API seed endpoints → inject clocks → isolate third parties → assert via APIs when UI is noisy.",
        "More seams improve tests but can tempt testing doubles instead of reality; balance with a few true E2E.",
        "If automation is chronically brittle: inventory missing hooks, then file testability stories with eng—not only more waits.",
        """# Ask eng for:
# data-testid on critical controls
# POST /test/seed-user (non-prod)
# injectable clock for expiry tests""",
        "1) Add testability to refinement checklist. 2) Budget eng tasks for hooks. 3) Prefer API setup over UI setup. 4) Review flakiness weekly.",
    ),
    "Page Object Model": K(
        "Page Object Model wraps page structure and user actions behind methods so tests read as behaviors, not CSS.",
        "Raw selectors duplicated across tests make UI refactors destroy the suite.",
        [
            "Pages/components encapsulate locators",
            "Tests call actions + assertions",
            "Avoid dumping all assertions only inside pages",
            "Prefer small component objects over god pages",
        ],
        "Identify screens → encapsulate locators → expose login()/addToCart() → tests orchestrate flows.",
        "POM reduces duplication; over-abstracted layers hide failures and slow onboarding.",
        "Flakes after redesign: update one page object; if many objects break, locators were too layout-coupled.",
        """class LoginPage {
  constructor(private page: Page) {}
  email = () => this.page.getByLabel('Email');
  async login(email: string, password: string) {
    await this.email().fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }
}""",
        "1) Introduce POM for top 5 flows. 2) Ban selectors in spec files. 3) Keep methods intent-named. 4) Refactor when pages >~300 lines.",
    ),
    "fixture": K(
        "Fixtures provide isolated setup/teardown (users, pages, API clients) so each test starts from a known state.",
        "Global mutable state and shared users cause order-dependent flakes in parallel CI.",
        [
            "Per-test scope vs worker scope",
            "Composable fixtures",
            "Cleanup / idempotent seed",
            "No hidden shared DB rows",
        ],
        "Declare fixture → Playwright/Jest injects it → test runs → teardown deletes or rolls back data.",
        "Heavy fixtures slow suites; too little setup creates duplication and drift.",
        "Parallel failures: ensure unique emails/ids per worker and no shared cart user.",
        """import { test as base } from '@playwright/test';
const test = base.extend({
  apiUser: async ({ request }, use) => {
    const user = await createUser(request);
    await use(user);
    await deleteUser(request, user.id);
  },
});""",
        "1) Replace globals with fixtures. 2) Unique data per worker. 3) Cleanup best-effort in finally. 4) Document fixture catalog.",
    ),
    "test automation pyramid": K(
        "The automation pyramid favors many fast unit/contract tests, fewer integration tests, and a thin E2E layer for critical journeys.",
        "E2E-only suites are slow, flaky, and expensive; they become the bottleneck and still miss edge logic.",
        [
            "Unit/contract base",
            "Service integration middle",
            "Few browser E2E",
            "Push tests down when possible",
        ],
        "Classify each risk → pick cheapest layer that can catch it → reserve E2E for cross-layer journeys → monitor runtime.",
        "Pyramids need discipline; ‘ice cream cones’ invert cost. Micro-frontends may need more contract tests.",
        "CI too slow: move assertions down, shard E2E, delete duplicate coverage.",
        """# Target mix example
# 70% unit/API  20% integration  10% E2E journeys""",
        "1) Inventory suite runtime. 2) Delete redundant E2E. 3) Add contract tests for APIs. 4) Cap E2E count with review.",
    ),
    "quality gate": K(
        "A quality gate is an automated go/no-go check (tests, lint, coverage, security scan) that must pass before merge or release.",
        "Post-deploy-only manual testing finds issues after customers can; gates shift prevention left without heroics.",
        [
            "Merge gates vs release gates",
            "Fast feedback vs deep suites",
            "Quarantine vs hard fail",
            "Owners for red builds",
        ],
        "PR runs fast suites → main runs deeper → release requires smoke + risk checks → override only with documented risk acceptance.",
        "Strict gates protect quality but need flake control; weak gates are theater.",
        "Gate always red: separate product fails from flakes, quarantine with tickets, fix within SLA.",
        """# GitHub Actions idea
# pr: unit + contract
# main: + integration
# release: + E2E smoke + k6 threshold""",
        "1) Define PR vs release gates. 2) Publish flake SLA. 3) Require owner on failures. 4) Review gate skip logs monthly.",
    ),
    "test sharding": K(
        "Test sharding splits a suite across parallel workers/machines so total wall-clock time drops.",
        "Sequential suites block CI and encourage skipping tests under schedule pressure.",
        [
            "Even shard by timing, not file count alone",
            "Isolation required for parallel safety",
            "Aggregate reports/artifacts",
            "Balance vs flake amplification",
        ],
        "Collect timings → partition tests → run N shards → merge JUnit/HTML → fail if any shard fails.",
        "More shards reduce time until coordination/data contention dominates.",
        "Uneven shards: enable duration-based sharding; data collisions: unique fixtures per shard.",
        """# Playwright
npx playwright test --shard=1/4
npx playwright test --shard=2/4""",
        "1) Enable duration sharding. 2) Fix shared-state flakes. 3) Upload artifacts per shard. 4) Cap shard count by runners.",
    ),
    "SQL validation": K(
        "SQL validation uses queries to assert database state after API/UI actions—source of truth for persistence bugs.",
        "UI-only checks miss wrong writes, partial commits, and silent data corruption.",
        [
            "Assert business rows/columns",
            "Transactions and isolation",
            "Read replicas lag awareness",
            "Never use prod credentials in CI casually",
        ],
        "Act via API → SELECT expected row → assert fields → cleanup; prefer API oracles when DB access is restricted.",
        "Direct DB asserts are powerful but couple tests to schema; prefer stable views or API reads when possible.",
        "Mismatch UI vs DB: check caching, async jobs, and replica lag before failing the product.",
        """-- After POST /orders
SELECT status, total_cents FROM orders WHERE id = $1;
-- expect status='PENDING'""",
        "1) Identify critical writes. 2) Add SQL/API dual assert for them. 3) Cleanup data. 4) Guard credentials via secrets.",
    ),
    "database transaction testing": K(
        "Database transaction testing verifies atomic commit/rollback behavior across multi-step writes.",
        "Partial writes create corrupt domain state that UI tests rarely notice.",
        [
            "All-or-nothing commits",
            "Rollback on mid-flight errors",
            "Isolation phenomena (dirty read, etc.)",
            "App-level transaction boundaries",
        ],
        "Start multi-write use case → inject failure after first write → assert no partial rows → success path asserts all rows.",
        "Deep isolation tests are costly; focus on money/inventory paths.",
        "Partial rows found: missing transaction boundary or catching errors after flush without rollback.",
        """# Case: place order + decrement stock
# Kill after order insert → stock unchanged, no order""",
        "1) List multi-write use cases. 2) Add failure-injection tests in staging. 3) Monitor orphan rows. 4) Document tx boundaries.",
    ),
    "defect lifecycle": K(
        "The defect lifecycle is the workflow from discovery → triage → fix → verify → close (and sometimes reopen).",
        "Without lifecycle discipline, bugs bounce, reopen, or sit unprioritized while releases slip.",
        [
            "States: new/triaged/in progress/fixed/verified/closed",
            "Severity vs priority",
            "Repro + environment evidence",
            "Verification owner (often QA)",
        ],
        "File with repro → triage severity/priority → fix → QA verifies on build → close or reopen with new evidence.",
        "Heavy workflows slow teams; zero workflow loses traceability. Fit process to team size.",
        "Reopen loops: weak acceptance criteria or verifying on wrong build/config.",
        """# Bug fields minimum
# steps, expected/actual, build, env, logs/screenshot, severity""",
        "1) Standardize bug template. 2) Define triage SLA. 3) QA owns verification. 4) Report reopen rate.",
    ),
    "severity": K(
        "Severity is the impact of a defect on the system/users (crash, data loss, minor UI); priority is business urgency to fix.",
        "Conflating them causes cosmetic bugs to block releases or critical bugs to languish.",
        [
            "Severity = impact",
            "Priority = urgency/order",
            "QA proposes severity; stakeholders set priority",
            "Examples: S1 data loss vs P3 low-traffic typo",
        ],
        "Assess user/system impact → assign severity → stakeholders set priority given release/risk → communicate clearly.",
        "Rigid matrices help new teams; context still matters for priority.",
        "Arguments: separate meetings for impact vs schedule; attach evidence.",
        """# S1: payments incorrect
# S3: misaligned icon
# P1 may still apply to S3 before a press demo""",
        "1) Publish severity guide with examples. 2) Train triage. 3) Audit mismatches monthly. 4) Keep fields separate in tracker.",
    ),
    "decision table testing": K(
        "Decision table testing models combinations of conditions → actions so complex business rules are covered systematically.",
        "Ad-hoc cases miss rule combinations that only appear in production configs.",
        [
            "Conditions vs actions",
            "Collapsed vs full tables",
            "Pair with equivalence classes",
            "Good for pricing/permissions/eligibility",
        ],
        "List conditions → build table of variants → derive cases → automate high-value rows → maintain with rule changes.",
        "Full tables explode combinatorially; collapse impossible/irrelevant rows and use pairwise when needed.",
        "Prod bug outside table: update conditions, don’t only add a one-off test.",
        """# Conditions: member?, coupon?, stock?
# Actions: discount%, allow checkout?
# Each row → one API test""",
        "1) Pick one rules-heavy feature. 2) Build table with BA/dev. 3) Automate critical rows. 4) Attach table to story.",
    ),
    "equivalence partitioning": K(
        "Equivalence partitioning groups inputs that should behave the same so you test representatives instead of endless values.",
        "Exhaustive input testing is impossible; random values miss whole classes (empty, max, unauthorized).",
        [
            "Valid vs invalid partitions",
            "Representative values",
            "Complements boundary-value analysis",
            "Applies to APIs, forms, configs",
        ],
        "Identify partitions → pick 1–2 values each → add boundaries between partitions → automate.",
        "Too-coarse partitions hide bugs; too-fine recreates exhaustive testing.",
        "Bug in ‘untested’ value: split the partition—behavior wasn’t equivalent.",
        """# Age field: <0 | 0-17 | 18-64 | 65+ | non-numeric
# Test one from each + boundaries 17/18""",
        "1) Teach EP/BVA in team workshop. 2) Require partitions in test design notes. 3) Review gaps after escaped defects.",
    ),
    "pairwise testing": K(
        "Pairwise (all-pairs) testing covers every pair of parameter values, catching most interaction bugs without full combinatorial explosion.",
        "Exhaustive multi-factor matrices don’t finish; pairwise is a pragmatic middle ground.",
        [
            "Factors and levels",
            "Interaction faults often pairwise",
            "Tools generate compact suites",
            "Not proof against 3-way bugs",
        ],
        "List factors/levels → generate pairwise set → review impossible combos → automate → add risk-based extra rows.",
        "Pairwise under-covers rare 3-way interactions; add risk rows for money/security.",
        "If 3-way bug escapes: add explicit case; don’t abandon pairwise for that domain.",
        """# Factors: browser × locale × role × paymentMethod
# Pairwise tool → ~dozens of cases not thousands""",
        "1) Identify multi-config surfaces. 2) Generate pairwise pack. 3) Add critical 3-way rows. 4) Regenerate when factors change.",
    ),
    "risk-based testing": K(
        "Risk-based testing prioritizes effort by likelihood × impact (money, auth, PII, change surface) instead of equal coverage of everything.",
        "Equal-priority testing wastes time on low-impact areas while under-testing catastrophic paths under schedule pressure.",
        [
            "Likelihood × impact scoring",
            "Change & defect history signals",
            "Time-boxed residual risk communication",
            "Guides automation investment",
        ],
        "Score features → allocate time → automate high risk → exploratory on medium → explicitly skip low with stakeholder OK.",
        "Risk models are subjective; refresh with incidents and usage analytics.",
        "Escape in ‘low risk’: raise score, check blind spots (compliance, rare locales).",
        """# Risk matrix columns
# feature | impact | likelihood | score | test approach | residual""",
        "1) Build matrix for next release. 2) Align with PM/eng. 3) Drive gate scope from scores. 4) Update after incidents.",
    ),
    "quality assurance": K(
        "Quality assurance is the preventive process system (standards, reviews, coaching) that improves how quality is built—not only finding bugs.",
        "Quality control/testing inspect products; QA improves the process so fewer defects are born.",
        [
            "Prevention vs detection",
            "Standards, DoD, reviews",
            "QA ≠ only manual testing",
            "Metrics on process health",
        ],
        "Define quality standards → embed in refinement/PR → coach teams → measure escaped defects and flake rates.",
        "Heavyweight QA process slows delivery; absent QA process creates chaos. Fit ceremony to risk.",
        "If testing finds the same class repeatedly: fix process (lint, templates, training), not only the instance.",
        """# QA vs QC
# QA: DoD includes a11y + contract update
# QC: execute tests / report defects""",
        "1) Clarify QA vs testing roles. 2) Put prevention items in DoD. 3) Review escaped defects for process gaps. 4) Publish quality goals.",
    ),
    "verification": K(
        "Verification checks whether the product was built right against specifications (reviews, tests vs requirements).",
        "Validation checks whether the right product was built for user needs; teams confuse the two and ship ‘correctly wrong’ features.",
        [
            "Verification = conformance to spec",
            "Validation = fitness for use",
            "Both needed",
            "Traceability helps verification",
        ],
        "Map tests to requirements (verification) → run usability/beta/feedback (validation) → adjust backlog.",
        "Only verification misses user value; only validation misses spec regressions.",
        "Disputes ‘works as designed’: separate spec bug vs implementation bug; update requirements if needed.",
        """# Verify: password rules match spec table
# Validate: users can reset password successfully in study""",
        "1) Trace critical requirements to tests. 2) Schedule validation touchpoints. 3) Label bugs spec vs code. 4) Keep RTM lightweight.",
    ),
    "HTTP methods": K(
        "HTTP methods (GET/POST/PUT/PATCH/DELETE…) define intent; testers must know safe/idempotent semantics and status-code families.",
        "Wrong method assumptions cause flaky clients, cache bugs, and incomplete API tests.",
        [
            "Safe vs unsafe methods",
            "Idempotent methods",
            "2xx/3xx/4xx/5xx families",
            "GET should not mutate",
        ],
        "For each endpoint assert method semantics → check caching headers on GET → ensure DELETE/PUT replay behavior → cover error codes.",
        "Strict REST purity vs pragmatic RPC-over-POST—test the documented contract either way.",
        "Unexpected 405/411: check allow headers, body requirements, and gateway method filters.",
        """# Cases
# GET /items → 200, no DB write
# DELETE /items/1 twice → second 404/204 per contract""",
        "1) Document method matrix. 2) Automate semantic checks. 3) Include negative methods. 4) Align gateway with API.",
    ),
    "thread group": K(
        "In JMeter, a thread group defines virtual users, ramp-up, and iteration count that drive samplers under load.",
        "Misconfigured thread groups produce meaningless perf numbers (too short, no ramp, unrealistic concurrency).",
        [
            "Users × ramp-up × loops",
            "Samplers = requests",
            "Timers = think time",
            "Listeners for results (careful in scale)",
        ],
        "Model arrival pattern → configure thread group → add timers → run → analyze latency/error% → tune.",
        "Huge thread counts on one generator lie; distributed generators cost ops effort.",
        "Sawtooth or errors at start: increase ramp-up; check connection pools before blaming app.",
        """# Example
# 50 users, ramp 60s, loop 10, 1s think time""",
        "1) Define realistic workload model. 2) Separate smoke vs stress thread groups. 3) Version test plans. 4) Track p95/error budget.",
    ),
    "exploratory testing": K(
        "Exploratory testing is simultaneous learning, test design, and execution—often time-boxed with a charter—rather than only scripted cases.",
        "Script-only testing misses surprising interactions; pure ad-hoc lacks accountability.",
        [
            "Charter + time box",
            "Session notes/bugs/questions",
            "Complements automation",
            "Skill of the tester matters",
        ],
        "Write charter → explore → note findings → debrief → feed bugs and new automation ideas.",
        "Unstructured wandering is not exploratory; over-scripting kills discovery.",
        "Low bug yield: sharpen charters toward risks/changes, not ‘click around’.",
        """# Charter (90m)
# Explore checkout with slow 3DS and coupon stacking
# Look for price mismatches and error recovery""",
        "1) Schedule ET for each release. 2) Use charters. 3) Convert findings to automation when stable. 4) Keep session notes.",
    ),
    "sanity testing": K(
        "Sanity testing is a narrow, deep check that a particular fix or area works after a small change—faster than full regression.",
        "Re-running huge suites for a one-line fix delays feedback; skipping checks ships broken hotfixes.",
        [
            "Narrow scope around a fix",
            "Not a substitute for full regression",
            "Often manual or small automated pack",
            "Differs from broad smoke",
        ],
        "Identify changed surface → run focused cases → if fail, block; if pass, proceed to wider regression as planned.",
        "Sanity that grows unbounded becomes regression; keep it curated.",
        "Escape after ‘sanity pass’: scope was too narrow—expand checklist for that component.",
        """# Hotfix sanity
# refund endpoint + admin UI refund + ledger row""",
        "1) Define sanity packs per service. 2) Keep under ~15 minutes. 3) Automate stable parts. 4) Still schedule regression cadence.",
    ),
    "smoke testing": K(
        "Smoke testing is a broad, shallow check that the build is testable—critical journeys basically work—before deeper testing.",
        "Deep testing on a broken deploy wastes time; no smoke lets catastrophic breaks hide until late.",
        [
            "Build verification",
            "Critical path only",
            "Fast automated preferred",
            "Gate for further QA",
        ],
        "Deploy → run smoke → stop if red → else continue regression/exploratory.",
        "Smoke too large becomes slow regression; too small misses ‘cannot login’ disasters.",
        "Intermittent smoke: quarantine flakes aggressively—smoke must be trustworthy.",
        """test.describe('smoke', () => {
  test('login and home', async ({ page }) => { /* ... */ });
  test('create entity API', async ({ request }) => { /* ... */ });
});""",
        "1) Automate smoke in CI post-deploy. 2) Cap runtime (~5–10m). 3) Own failures immediately. 4) Separate from full nightly.",
    ),
    "hybrid app testing": K(
        "Hybrid app testing covers apps that mix native shells with WebViews—requiring both native and web automation contexts.",
        "Treating hybrids as pure native or pure web misses context switches, bridge bugs, and auth cookie issues.",
        [
            "Native ↔ webview context",
            "Bridge/JS interface risks",
            "Different locators per context",
            "Offline/cache quirks",
        ],
        "Identify screens in webview → switch context → use web locators → return to native → assert across bridge.",
        "Real devices catch OEM WebView differences emulators miss.",
        "Element not found: wrong context; dump contexts and page source.",
        """# Appium
contexts = driver.contexts
driver.switch_to.context('WEBVIEW_chrome')
# ... web asserts ...
driver.switch_to.context('NATIVE_APP')""",
        "1) Map which screens are webview. 2) Helper for context switch. 3) Test on target WebView versions. 4) Log context on failure.",
    ),
    "native app testing": K(
        "Native app testing validates platform-specific apps (Swift/Kotlin UI) including permissions, lifecycle, gestures, and store constraints.",
        "Mobile web checks miss OS permissions, backgrounding, deep links, and push behavior.",
        [
            "Lifecycle (background/kill)",
            "Permissions & biometrics",
            "Device fragmentation",
            "App install/upgrade paths",
        ],
        "Install build → exercise permissions → background/foreground → deep link → upgrade from prior version → collect device logs.",
        "Device farm breadth vs depth on critical devices—budget both.",
        "Fails only on OEM: capture vendor, OS, and logcat/syslog; reproduce on same API level.",
        """# Upgrade test
# install v1 → create data → install v2 → data intact""",
        "1) Define device matrix. 2) Automate critical native flows. 3) Manual for push/biometrics. 4) Keep upgrade scenarios.",
    ),
    "performance testing": K(
        "Performance testing checks latency, throughput, and resource use under expected (and stressful) load—not just functional correctness.",
        "Functionally correct systems still fail users when p95 explodes or errors spike under concurrency.",
        [
            "Latency percentiles vs averages",
            "Load/stress/spike/soak",
            "Workloads with think time",
            "Bottleneck isolation",
        ],
        "Define SLOs → script journeys → ramp load → watch app/DB/deps → compare to budget → tune or fail gate.",
        "Lab perf ≠ prod traffic shape; use production-like data and dependency behavior.",
        "Bad numbers: check generator limits, cold start, and noisy neighbors before rewriting app code.",
        """# k6 threshold example
thresholds: { http_req_duration: ['p(95)<500'], http_req_failed: ['rate<0.01'] }""",
        "1) Write perf SLOs. 2) Automate smoke load in CI. 3) Deep tests pre-release. 4) Correlate with APM.",
    ),
    "security testing": K(
        "Security testing probes for authz gaps, injection, XSS, secrets exposure, and other abuse cases beyond happy functional paths.",
        "Functional QA green can still mean anyone can read another user’s data.",
        [
            "Authn vs authz tests",
            "OWASP-inspired cases",
            "Least privilege checks",
            "Secrets & headers",
        ],
        "Threat-model critical flows → attempt IDOR/horizontal privilege → inject payloads → check headers/cookies → report with impact.",
        "Full pentests are periodic; lightweight security QA should be continuous on changes.",
        "Finding disputed: demonstrate exploit path with least privilege account and impact evidence.",
        """# IDOR case
# login as userA, GET /orders/{userB_order} → expect 403""",
        "1) Add authz cases to API suite. 2) Scan deps in CI. 3) Checklist for new endpoints. 4) Partner with security for deep tests.",
    ),
    "logs": K(
        "Logs are append-only event records; testers use them to prove what the system did—requests, decisions, errors—during investigations.",
        "Without usable logs, flakes and prod bugs become he-said-she-said; traces add causality across services.",
        [
            "Structured logs + correlation ids",
            "Logs vs metrics vs traces",
            "PII redaction",
            "Level discipline (error vs debug)",
        ],
        "Reproduce → grab correlation id → trace across services → confirm code path → fix + assert log/metric in regression when useful.",
        "Too much logging is costly/noisy; too little blinds you. Prefer structured fields over prose.",
        "Missing logs: check sampling, wrong level, or correlation id not propagated from gateway/UI.",
        """# Assert in staging test
# response header x-request-id present
# search logs for that id + expected event""",
        "1) Require request ids on APIs. 2) Document how QA fetches logs. 3) Add log assertions for critical audits. 4) Redact secrets.",
    ),
    "latency": K(
        "Latency is the time to complete a request/operation; testers care about percentiles (p50/p95/p99), not only averages.",
        "Throughput can look fine while tail latency destroys UX; averages hide outliers.",
        [
            "Percentiles over averages",
            "Client vs server vs network time",
            "Cold start / GC / locks",
            "Budgets per journey",
        ],
        "Measure end-to-end and per-hop → compare budget → isolate slow span → retest after fix.",
        "Optimizing average while ignoring p99 fails real users; chasing p99 everywhere is expensive.",
        "High latency only in CI: check shared runners and noisy neighbors; validate on dedicated perf env.",
        """# Playwright timing
const start = Date.now();
await page.goto('/dashboard');
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
expect(Date.now() - start).toBeLessThan(3000);""",
        "1) Set journey budgets. 2) Track p95 in APM. 3) Add perf smoke. 4) Investigate regressions per deploy.",
    ),
    "load testing": K(
        "Load testing applies expected concurrent usage to validate SLOs under normal-to-peak traffic.",
        "Stress testing pushes beyond limits; load testing asks ‘can we serve planned traffic?’",
        [
            "Arrival rate + think time",
            "Steady vs ramp patterns",
            "Error rate + latency SLOs",
            "Data realism",
        ],
        "Model peak → script → ramp to target → hold → observe → report pass/fail vs thresholds.",
        "Synthetic perfect users under-stress cache; include variety and heavy paths.",
        "Errors at target load: identify saturation point; distinguish app vs DB vs dependency.",
        """# k6
export const options = { stages: [
  { duration: '2m', target: 50 },
  { duration: '5m', target: 50 },
  { duration: '2m', target: 0 },
]};""",
        "1) Agree peak model with PM. 2) Automate load script. 3) Gate on thresholds. 4) Archive reports per release.",
    ),
    "spike testing": K(
        "Spike testing suddenly jumps concurrency to see if the system sheds load, recovers, or collapses.",
        "Soak testing holds load long for leaks; spikes catch autoscaling and queue meltdown issues.",
        [
            "Abrupt ramp",
            "Recovery behavior",
            "Queue backlog handling",
            "Autoscaling lag",
        ],
        "Baseline → abrupt spike → hold briefly → drop → watch errors/latency/recovery time.",
        "Spikes without production-like limits give false confidence; include dependency timeouts.",
        "Hang after spike: check thread pools, connection pools, and retry storms.",
        """# Spike: 0→200 VUs in 10s, hold 1m, down to 0""",
        "1) Identify bursty events (sales). 2) Script spike. 3) Define recovery SLO. 4) Tune limiters/retries.",
    ),
    "test plan": K(
        "A test plan states scope, objectives, approach, environments, entry/exit criteria, risks, and schedule for a testing effort.",
        "A test strategy is the enduring approach; a plan is the time-bound instance for a release/project.",
        [
            "Scope in/out",
            "Entry/exit criteria",
            "Environments & data",
            "Risks & staffing",
        ],
        "Draft plan → review with stakeholders → execute → update residual risk at exit.",
        "Giant plans nobody reads fail; zero planning fails audits and onboarding.",
        "Scope fights: point to written in/out and change control.",
        """# One-pager sections
# goal, in/out, approach, envs, gates, risks, owners""",
        "1) Template the one-pager. 2) Fill per release. 3) Review in kickoff. 4) Attach to release ticket.",
    ),
    "API testing": K(
        "API testing validates endpoints directly—status, payload, auth, side effects—without driving the UI.",
        "Browser UI tests are slower and noisier for backend rule verification.",
        [
            "Contract + examples",
            "Authn/authz matrix",
            "Schema & business asserts",
            "Useful setup for UI tests",
        ],
        "Obtain token → call endpoints → assert JSON/DB → cover negatives → publish collection/suite in CI.",
        "API-only misses UI integration; UI-only misses fine-grained rules. Use both.",
        "Intermittent 401: clock skew, token reuse, or env secret drift.",
        """test('forbids other user order', async ({ request }) => {
  const res = await request.get('/api/orders/other', { headers: authA });
  expect(res.status()).toBe(403);
});""",
        "1) Automate critical APIs in CI. 2) Share collections. 3) Use for test data setup. 4) Keep a few UI E2E.",
    ),
    "auto-waiting": K(
        "Playwright auto-waiting retries actions/assertions until conditions are met or timeout—replacing brittle fixed sleeps.",
        "Fixed sleeps flake under load and slow suites when oversized.",
        [
            "Actionability checks",
            "Expect auto-retry",
            "Timeouts as policy",
            "Avoid waitForTimeout",
        ],
        "Use locator.click/fill and expect() → let Playwright wait → on failure use trace → fix conditionality not sleep.",
        "Ultra-long timeouts hide perf bugs; too-short timeouts flake on slow CI.",
        "Still flaky: race in app (detached nodes), bad locators, or network not mocked when needed.",
        """await expect(page.getByRole('alert')).toContainText('Saved');
// not: await page.waitForTimeout(5000)""",
        "1) Ban waitForTimeout in lint. 2) Standardize timeouts. 3) Use traces. 4) Fix app races when exposed.",
    ),
    "browser context": K(
        "A Playwright browser context is an isolated profile (cookies/storage)—like a clean user session—within a browser instance.",
        "Sharing one browser state across tests causes cross-test contamination; new browser per test is slower.",
        [
            "Context ≈ incognito profile",
            "Page lives in a context",
            "Storage state for auth reuse",
            "Permissions/geolocation per context",
        ],
        "Create context → new page → test → close context; optionally save storageState for authenticated setups.",
        "Reuse storageState carefully—don’t leak admin into member tests.",
        "Auth leaks: ensure context isolation and unique storage files per role.",
        """const context = await browser.newContext();
const page = await context.newPage();
// ...
await context.close();""",
        "1) Default isolated context per test. 2) Use storageState for speed. 3) Separate states per role. 4) Clear on role tests.",
    ),
    "locator": K(
        "A Playwright locator is a lazy, retrying handle to elements—prefer getByRole/Label/Text over brittle CSS/XPath strings.",
        "CSS/XPath coupled to structure breaks on restyle and races with rendering.",
        [
            "User-facing selectors first",
            "Locator strict mode",
            "Filtering / chaining",
            "data-testid as escape hatch",
        ],
        "Choose role/name → locate → act/assert with auto-wait → if ambiguous, filter by text or test id.",
        "test ids everywhere reduce a11y pressure to name controls; prefer roles when possible.",
        "Strict mode violation: narrow locator; don’t disable strict casually.",
        """await page.getByRole('button', { name: 'Add to cart' }).click();
await expect(page.getByTestId('cart-count')).toHaveText('1');""",
        "1) Adopt locator guidelines. 2) Review selectors in PR. 3) Add test ids where roles fail. 4) Delete CSS-heavy locators.",
    ),
    "parallelism": K(
        "Parallelism runs tests concurrently across workers to cut wall-clock time—requires isolation.",
        "Serial suites are simple but don’t scale; naive parallelization creates flakes via shared data.",
        [
            "Workers vs shards",
            "Isolation prerequisites",
            "FullyParallel mode",
            "Order independence",
        ],
        "Enable workers → remove shared state → unique data → fix order-dependent tests → scale shards if needed.",
        "Max workers on tiny runners thrash; measure to find sweet spot.",
        "Failures only in parallel: search for shared users, ports, or files.",
        """# playwright.config.ts
fullyParallel: true,
workers: process.env.CI ? 4 : undefined,""",
        "1) Turn on parallel locally. 2) Fix isolation bugs. 3) Tune workers in CI. 4) Keep a serial project only if required.",
    ),
    "projects": K(
        "Playwright projects define variants (browsers, devices, configs) so one suite runs under multiple environments.",
        "Single-browser CI misses Safari/mobile issues; duplicating entire configs is unmaintainable.",
        [
            "Projects = named configs",
            "Dependencies between projects",
            "Use for browsers/roles/smoke",
            "Share tests, vary use options",
        ],
        "Declare projects → tag/grep as needed → CI runs matrix → artifacts per project.",
        "Too many projects multiply time; pick based on analytics/risk.",
        "Project-only fail: check viewport, userAgent, or permissions differences.",
        """projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'mobile', use: { ...devices['iPhone 14'] } },
]""",
        "1) Start with chromium+webkit or mobile. 2) Add Firefox if users warrant. 3) Separate smoke project. 4) Review matrix cost quarterly.",
    ),
    "trace viewer": K(
        "Playwright Trace Viewer records actions, DOM snapshots, network, and consoles so you can debug failures without re-running blindly.",
        "Console.log debugging doesn’t show timing/actionability; traces replace guesswork.",
        [
            "on/off/retain-on-failure",
            "Snapshots + network",
            "CI artifact upload",
            "Privacy: may capture data",
        ],
        "Enable retain-on-failure → download trace.zip → open trace.playwright.dev → inspect failed action.",
        "Always-on traces are heavy; retain-on-failure is the usual balance.",
        "Trace missing: ensure config + CI upload paths; check test timed out before tracing flushed.",
        """use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' }""",
        "1) Enable retain-on-failure. 2) Upload artifacts in CI. 3) Train team to read traces. 4) Redact secrets in demos.",
    ),
    "web-first assertion": K(
        "Web-first assertions (expect(locator).toBeVisible…) auto-retry until the condition holds—aligning with how UIs update asynchronously.",
        "Manual polling and assertImmediate on detached nodes cause flakes.",
        [
            "expect(locator) retries",
            "Prefer over page.waitFor*",
            "Soft assertions when useful",
            "Timeout messaging",
        ],
        "Perform action → expect(locator).toHaveText… → on fail read error + trace → fix app or locator.",
        "Soft expects collect multiple failures but can hide early breakage—use deliberately.",
        "Assertion timeout: improve condition (wait for response) rather than increasing globally without cause.",
        """await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByText('Saved')).toBeVisible();""",
        "1) Prefer web-first expects. 2) Remove manual polls. 3) Standardize assertion timeouts. 4) Review flake taxonomy weekly.",
    ),
    "collection": K(
        "A Postman collection groups requests, folders, variables, and tests for an API—shareable and runnable in CI via Newman.",
        "Loose individual requests don’t version well or encode assertions.",
        [
            "Requests + folders",
            "Collection/env variables",
            "Pre-request & test scripts",
            "Newman for CI",
        ],
        "Build collection → parameterize env → add test scripts → run locally → Newman in CI.",
        "Giant collections rot; split by service and ownership.",
        "Wrong env data: print resolved variables; avoid hardcoding tokens in collection JSON.",
        """// collection test script
pm.test('status 200', () => pm.response.to.have.status(200));
pm.expect(pm.response.json().id).to.be.ok;""",
        "1) Version collections in git. 2) Separate envs. 3) Newman gate on PR. 4) Lint for secrets.",
    ),
    "collection runner": K(
        "Collection Runner executes a Postman collection (optionally with data files) sequentially or iteratively for regression.",
        "Manual clicking requests doesn’t scale or produce consistent evidence.",
        [
            "Iterations + data files",
            "Delay between requests",
            "Environment selection",
            "Export results",
        ],
        "Select collection/env → optional CSV data → run → inspect failures → fix scripts/data.",
        "Runner is fine locally; CI should use Newman for repeatability.",
        "Order-dependent fails: make requests self-sufficient or explicit folders with setup.",
        """# newman
newman run orders.postman_collection.json -e staging.json -r cli,junit""",
        "1) Script Newman. 2) Store JUnit. 3) Use data files for variants. 4) Keep folders independent where possible.",
    ),
    "pre-request script": K(
        "Pre-request scripts run before a Postman request—to set signatures, timestamps, tokens, or dynamic variables.",
        "Test scripts assert after response; mixing responsibilities makes collections hard to debug.",
        [
            "Before request vs after response",
            "pm.variables / environment",
            "Crypto/signing helpers",
            "Don’t assert here",
        ],
        "Compute values in pre-request → send → assert in test script → chain via variables.",
        "Heavy logic in Postman may belong in real client libraries—avoid duplicating production crypto poorly.",
        "Auth fails: log computed headers carefully (no secrets in CI logs).",
        """// pre-request
pm.environment.set('ts', Date.now());
// test script
pm.test('ok', () => pm.response.to.have.status(200));""",
        "1) Split pre vs test scripts. 2) Share utility libs in collection. 3) Document required vars. 4) Mirror critical logic in automated API tests.",
    ),
    "SDLC": K(
        "SDLC is the software development lifecycle (requirements→design→build→test→deploy→maintain); STLC is the testing lifecycle aligned to it.",
        "Testing bolted on at the end ignores earlier quality leverage points.",
        [
            "Phases and artifacts",
            "STLC: plan, design, execute, close",
            "Entry/exit criteria",
            "Traceability across phases",
        ],
        "Map QA activities to each SDLC phase → define STLC artifacts → execute with gates → learn in retrospectives.",
        "Heavyweight phase gates vs continuous delivery—adapt STLC to Agile, don’t cargo-cult waterfall docs.",
        "Missed requirements: improve refinement and RTM, not only more end-phase testing.",
        """# Agile STLC sketch
# refine→test design→automate with PR→explore→release gate→prod monitor""",
        "1) Publish SDLC/STLC cheat sheet. 2) Align ceremonies. 3) Define gates. 4) Review escaped defects by phase.",
    ),
    "flaky test": K(
        "A flaky test yields both pass and fail without product changes—usually races, shared state, time, or environments.",
        "Treating flakes as product bugs (or ignoring them) destroys CI trust; real defects hide in noise.",
        [
            "Non-determinism sources",
            "Quarantine with owner/SLA",
            "Root-cause > blind retry",
            "Distinguish flake vs defect",
        ],
        "Detect intermittent → quarantine → gather trace/logs → fix isolation/timing/product race → re-enable with watch.",
        "Retries mask flakes temporarily; overuse hides real races.",
        "Only fails in CI: compare parallelism, load, and secrets; run with --repeat-each locally.",
        """# Classify
# A) product race B) test isolation C) infra
# Fix A/B; harden C; retry only as last resort""",
        "1) Track flake rate. 2) Quarantine policy. 3) Weekly flake triage. 4) Cap retries (e.g., 1) with reporting.",
    ),
    "retry": K(
        "Test retries re-run failed tests to reduce noise—but can also mask real races if overused.",
        "Zero retries makes flaky infra block teams; unlimited retries greenwash instability.",
        [
            "CI-only limited retries",
            "Report retried passes",
            "Fix root cause",
            "Not a substitute for isolation",
        ],
        "Configure small retries → alert on retry-pass rate → triage offenders → remove retry when stable.",
        "Product retries (API) are different from test retries—test both behaviors deliberately.",
        "High retry-pass%: treat as failed quality; quarantine top offenders.",
        """# playwright.config.ts
retries: process.env.CI ? 1 : 0,""",
        "1) Set retries=1 in CI. 2) Dashboard retry-pass. 3) Fix top flakes. 4) Forbid retries locally by default.",
    ),
    "test isolation": K(
        "Test isolation means each test controls its preconditions and side effects so order and parallelism don’t change outcomes.",
        "Ordered dependent tests pass locally in series and fail shuffled in CI.",
        [
            "Unique data per test/worker",
            "No shared mutable globals",
            "Cleanup or immutable seeds",
            "Deterministic time/randomness",
        ],
        "Create resources in-test → assert → delete/rollback → enable shuffle/parallel to prove isolation.",
        "Full isolation can be slower; prefer cheap API seeding over UI setup.",
        "Order dependency found: break chains; use beforeEach seeds; delete assume-previous-test patterns.",
        """# Run shuffled
npx playwright test --workers=4
# fail if tests need prior test state""",
        "1) Shuffle in CI. 2) Ban shared users. 3) Fixture cleanup. 4) Treat isolation bugs as P1 for CI health.",
    ),
    "OWASP testing": K(
        "OWASP-inspired testing uses common web/API risk patterns (injection, broken authz, XSS, SSRF, etc.) as a practical checklist for QA.",
        "Functional testers otherwise miss abuse cases that attackers try first.",
        [
            "OWASP Top 10 as prompts not gospel",
            "IDOR/authz emphasis",
            "Input attack strings",
            "Security headers/cookies",
        ],
        "Map features to risks → attempt exploits with least privilege → record evidence → retest fixes → automate regressions.",
        "Checklist depth vs time: prioritize authz and injection on money/PII flows.",
        "False positives: collaborate with security; still file if exploitability unclear.",
        """# Minimum API pack
# IDOR, privilege escalation, SQLi/XSS samples, verbose 500s, secure cookie flags""",
        "1) Adopt lightweight OWASP QA checklist. 2) Automate authz. 3) Train team yearly. 4) Escalate true exploits fast.",
    ),
    "authentication testing": K(
        "Authentication testing verifies identity establishment (login, tokens, sessions); authorization testing verifies permissions afterward.",
        "Happy-path login misses lockout, token expiry, refresh, and session fixation issues.",
        [
            "Authn ≠ authz",
            "Session/token lifecycle",
            "Brute force / lockout policies",
            "Logout & revocation",
        ],
        "Test valid/invalid creds → expiry/refresh → logout revocation → MFA if any → then separate authz matrix.",
        "Deep security testing may need specialists; QA still owns core auth regressions.",
        "Intermittent auth failures: clock skew, cookie domain, or third-party IdP outages.",
        """# Cases
# wrong password → 401
# expired access token → 401
# refresh → new access
# logout → refresh rejected""",
        "1) Automate auth lifecycle. 2) Separate authz suite. 3) Monitor IdP. 4) Never log raw tokens.",
    ),
    "synthetic test data": K(
        "Synthetic test data is generated fake data that respects formats/constraints without copying production PII.",
        "Production copies risk privacy/law issues and still aren’t deterministic for parallel tests.",
        [
            "Faker/generators + constraints",
            "Referential integrity",
            "PII avoidance",
            "Stable seeds for debug",
        ],
        "Define schemas → generate per test with unique keys → seed via API → cleanup → optional seeded RNG for repro.",
        "Pure synthetic may miss weird real edge strings; curated anonymized samples can complement carefully.",
        "Constraint violations: align generator with DB checks and unique indexes.",
        """import { faker } from '@faker-js/faker';
const email = `user_${Date.now()}_${faker.string.alphanumeric(6)}@example.test`;""",
        "1) Ban prod DB dumps in CI. 2) Provide generators. 3) Unique per worker. 4) Document reserved accounts.",
    ),
    "system testing": K(
        "System testing validates the fully integrated application against requirements in an environment like production.",
        "Acceptance testing focuses on user/business sign-off criteria; system testing is broader technical confirmation.",
        [
            "End-to-end integrated system",
            "Functional + some NFT",
            "Environment parity matters",
            "Differs from unit/integration scope",
        ],
        "Deploy candidate → execute system suites + exploratory → log defects → exit on criteria.",
        "Heavy system phases vs continuous testing—keep system packs but shift earlier where possible.",
        "Env drift causes ‘system’ fails: compare configs/migrations/feature flags to prod.",
        """# System pack includes
# critical journeys, batch jobs, email/push callbacks, admin + user roles""",
        "1) Define system exit criteria. 2) Automate stable journeys. 3) Sync env config. 4) Complement with acceptance UAT.",
    ),
    "mock": K(
        "A mock is a test double that pretends to be a dependency and often verifies interactions; a stub returns canned data with less behavior checking.",
        "Over-mocking tests the mocks; under-isolation makes tests slow/flaky on third parties.",
        [
            "Stub = state, mock = behavior verify",
            "Contract of the double",
            "Prefer real at boundaries sometimes",
            "Reset between tests",
        ],
        "Identify slow/fragile deps → stub/mock at boundary → assert your code → add a few real integration tests.",
        "Strict mocks brittle to refactors; loose stubs miss interaction bugs.",
        "False green: mock returns ideal JSON prod never does—add contract tests.",
        """# Playwright route mock
await page.route('**/api/price', r => r.fulfill({ json: { price: 10 } }));""",
        "1) Guidelines for when to mock. 2) Keep contract tests vs real. 3) Reset routes/doubles. 4) Review mock realism.",
    ),
    "service virtualization": K(
        "Service virtualization stands up simulated dependent services so teams can test when real deps are unavailable, costly, or rate-limited.",
        "Waiting on live shared deps blocks CI and creates noisy failures.",
        [
            "Virtual endpoints with canned behaviors",
            "Fault injection (latency/500s)",
            "Not a full substitute for staging",
            "Keep contracts aligned",
        ],
        "Capture traffic/schemas → virtualize → point app to virtual base URL in test → inject faults → periodically verify vs real.",
        "Virtual forever drifts from reality; schedule contract reconcilation.",
        "Tests pass vs virtual, fail vs real: diff payloads and update virtualization.",
        """# WireMock-ish stub
# GET /rates → 200 { "USD": 1 }
# GET /rates → 503 for chaos case""",
        "1) Virtualize flakiest deps. 2) Version stubs with contracts. 3) Chaos modes for resilience. 4) Reconcile with real quarterly.",
    ),
    "DOM": K(
        "The DOM is the browser’s object model of the page document; automation locates and asserts against DOM nodes, not pixels alone.",
        "Visual-only checks miss structure/a11y; misunderstanding DOM leads to brittle selectors.",
        [
            "Tree of elements/attributes",
            "Accessibility tree related but distinct",
            "Queries via roles/css/xpath",
            "Virtual DOM ≠ browser DOM (frameworks)",
        ],
        "Render page → query DOM via stable locators → act → assert text/attributes/structure.",
        "Visual regression complements DOM asserts for CSS issues.",
        "Detached node errors: re-query locators; don’t cache element handles across navigations.",
        """await expect(page.locator('#main')).toBeVisible();
// Better: getByRole('main')""",
        "1) Teach DOM vs visual testing. 2) Prefer semantic queries. 3) Avoid absolute XPath. 4) Use traces to inspect DOM.",
    ),
    "cookies": K(
        "Cookies are small key-value stores sent with requests; HttpOnly/Secure/SameSite matter for auth. localStorage is JS-visible origin storage—not automatically sent.",
        "Tesers confuse where tokens live and miss CSRF/SameSite issues.",
        [
            "Cookie attributes",
            "Session vs persistent",
            "localStorage/sessionStorage",
            "Playwright storageState",
        ],
        "Login → inspect set-cookie → assert attributes → verify subsequent authenticated calls → clear context to logout state.",
        "Cookies for auth enable CSRF concerns; bearer in localStorage enables XSS theft—pick deliberately.",
        "Auth lost: check domain/path/SameSite and HTTPS requirements.",
        """const cookies = await context.cookies();
expect(cookies.find(c => c.name === 'session')?.httpOnly).toBe(true);""",
        "1) Document auth storage choice. 2) Assert cookie flags in tests. 3) Cover logout/expiry. 4) Separate XSS/CSRF cases.",
    ),
    "threshold": K(
        "In k6, thresholds are pass/fail criteria on metrics (p95, error rate); checks are per-request assertions that feed metrics but don’t fail the run alone unless thresholded.",
        "Load tests without thresholds are dashboards without decisions.",
        [
            "thresholds fail the test run",
            "checks produce rates",
            "SLOs as code",
            "Separate smoke vs stress thresholds",
        ],
        "Define SLOs → encode thresholds → run → CI fails on breach → investigate.",
        "Over-tight thresholds flake; over-loose miss regressions.",
        "Failing threshold: confirm generator health, then app saturation metrics.",
        """export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};""",
        "1) Encode SLOs as thresholds. 2) Track trends. 3) Tune with prod data. 4) Don’t ignore check() rates.",
    ),
    "virtual user": K(
        "A virtual user (VU) in k6 is a concurrent iteration actor executing the script; request rate emerges from VUs × iteration speed.",
        "Confusing VUs with raw RPS mis-sizes tests and overwhelms generators.",
        [
            "VUs execute scenarios",
            "Arrival-rate executors available",
            "Think time affects RPS",
            "Generator capacity limits",
        ],
        "Choose executor (shared-iterations, ramping-vus, constant-arrival-rate) → script journey → observe RPS/latency → adjust.",
        "Arrival-rate is better when you care about RPS; VUs are simpler mental models.",
        "Cannot hit target RPS: generator CPU/network or blocking sleeps in script.",
        """export const options = {
  scenarios: {
    peak: { executor: 'constant-arrival-rate', rate: 100, timeUnit: '1s', duration: '5m', preAllocatedVUs: 50 },
  },
};""",
        "1) Pick executor for goal. 2) Measure generator. 3) Include think time. 4) Document VU↔RPS assumptions.",
    ),
    "unit testing": K(
        "Unit testing verifies small units (functions/classes) in isolation with fast feedback—base of the automation pyramid.",
        "Without units, teams over-rely on slow E2E to catch pure logic bugs.",
        [
            "Isolated, fast, deterministic",
            "Mocks at boundaries",
            "Not for full UX journeys",
            "High volume expected",
        ],
        "Choose pure logic → write failing test → implement → refactor; keep under milliseconds each.",
        "Over-mocking units can test fantasies; still keep some integration tests.",
        "Flaky unit = time/randomness/order—inject clocks and seeds.",
        """test('computeDiscount', () => {
  expect(computeDiscount(100, 0.1)).toBe(90);
});""",
        "1) Require units for domain logic. 2) Coverage on critical packages. 3) Keep E2E thin. 4) Run units on every commit.",
    ),
}
