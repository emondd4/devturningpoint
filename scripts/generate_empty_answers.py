#!/usr/bin/env python3
"""Generate empty-topic curated answers from knowledge cards + question text."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KNOW_DIR = ROOT / "src/data/interviews/knowledge"
BANK_DIR = ROOT / "src/data/interviews/bank"

TRACKS = ("frontend", "backend", "mobile-flutter")

# Extra aliases so empty curated questions map onto knowledge topics.
ALIASES: dict[str, list[str]] = {
    "frontend": [
        (r"flexbox|css grid|grid", ["Flexbox", "CSS Grid"]),
        (r"promise|async/await", ["Promise", "async/await"]),
        (r"box model", ["box model"]),
        (r"\bvar\b|let, and const|let and const", ["scope", "hoisting"]),
        (r"components, props, and state|props, and state", ["React", "props", "useState"]),
        (r"useState and useEffect", ["useState", "useEffect"]),
        (r"specificity", ["specificity", "cascade"]),
        (r"typescript", ["generics", "type narrowing", "union types"]),
        (r"closure", ["scope"]),
        (r"client-side routing", ["client-side routing"]),
        (r"event bubbling|event capturing|event delegation", ["DOM"]),
        (r"responsive design|mobile-first", ["container queries", "responsive images"]),
        (r"semantic html", ["semantic HTML"]),
        (r"\bDOM\b", ["DOM"]),
        (r"== and ===|===, and `Object.is`|==`, `===`", ["type coercion"]),
        (r"interface and a type alias", ["utility types", "union types"]),
        (r"block, inline", ["box model", "formatting context"]),
        (r"null and undefined", ["primitive types"]),
        (r"key prop|keys", ["keys", "reconciliation"]),
        (r"Next\.js|App Router|Server Components|Pages Router", ["App Router", "Server Components", "static rendering"]),
        (r"debounce and throttle", ["autocomplete UI", "event loop"]),
        (r"<button>|clickable `<div>`", ["semantic HTML", "keyboard focus"]),
        (r"SSR|static generation|streaming|revalidation", ["static rendering", "streaming/Suspense", "caching and revalidation"]),
        (r"local UI state|URL state|server state|global client state", ["state ownership", "TanStack Query"]),
        (r"XSS|CSRF|CSP|CORS|SameSite", ["XSS", "CSRF", "CSP", "cookie security"]),
        (r"controlled versus uncontrolled|controlled vs", ["controlled components"]),
        (r"prototype inheritance|ES classes", ["prototype chain", "this binding"]),
        (r"render versus commit|render vs commit", ["render phase", "reconciliation"]),
        (r"event loop", ["event loop", "microtask queue"]),
        (r"browser rendering pipeline", ["browser rendering pipeline"]),
        (r"lexical scope|garbage collection", ["scope"]),
        (r"preserve or reset component state|reconciliation", ["reconciliation", "keys", "component identity"]),
        (r"test a React feature|RTL|Playwright", ["React Testing Library", "Playwright", "Vitest/Jest"]),
        (r"layout shift|CLS", ["Core Web Vitals", "font loading", "image optimization"]),
        (r"mapped types|conditional types|type narrowing", ["mapped types", "conditional types", "type narrowing", "generics"]),
        (r"hydration", ["Server Components", "streaming/Suspense"]),
        (r"stacking context|z-index", ["stacking context", "positioning"]),
        (r"TanStack Query", ["TanStack Query"]),
        (r"useMemo|useCallback", ["useMemo", "useCallback"]),
        (r"stale closure", ["useEffect", "useCallback", "scope"]),
        (r"network waterfalls|INP", ["Core Web Vitals", "browser rendering pipeline", "code splitting"]),
        (r"combobox|autocomplete", ["autocomplete UI", "accessible name computation", "keyboard focus"]),
        (r"state live in the URL", ["client-side routing", "state ownership"]),
        (r"thousands of components|re-renders", ["batching", "useMemo", "virtualization", "state ownership"]),
        (r"RSC boundaries|BFF", ["Server Components", "Route Handlers"]),
        (r"reusable component API|composition", ["component composition", "design system"]),
        (r"cache invalidation|optimistic", ["TanStack Query", "caching and revalidation"]),
        (r"virtualized data grid|virtualiz", ["virtualization", "virtualized data grid"]),
        (r"offline|synchronize|conflict", ["collaborative editor", "localStorage"]),
        (r"authentication for an SSR|secure cookies", ["cookie security", "CSRF", "XSS"]),
        (r"multi-team|design system|micro-frontend", ["design system", "micro-frontends", "monorepo", "feature-based organization"]),
        (r"browser storage", ["localStorage", "cookie security"]),
        (r"Suspense and streaming", ["streaming/Suspense"]),
        (r"CSS Modules|utility CSS|CSS-in-JS", ["custom properties", "cascade", "design system"]),
        (r"HTTP/2|HTTP/3|CDN", ["bundling", "caching and revalidation", "image optimization"]),
        (r"instant rollback|deployment", ["bundling", "source maps"]),
        (r"observability", ["Core Web Vitals", "source maps"]),
        (r"supply-chain|dependency", ["bundling", "ES modules"]),
        (r"collaborative editor|collaborative", ["collaborative editor", "real-time chat UI"]),
        (r"display: none|visibility: hidden", ["box model", "accessible name computation"]),
    ],
    "backend": [
        (r"GET, POST, PUT, PATCH, and DELETE|HTTP method", ["HTTP semantics", "REST resource design"]),
        (r"controllers, providers|NestJS", ["NestJS", "controller", "module", "provider and dependency injection"]),
        (r"\blogs\b|structured logging", ["structured logging", "correlation ID"]),
        (r"modules in Node", ["ES modules", "modules"]),
        (r"backend application do", ["HTTP semantics", "REST resource design"]),
        (r"HTTP request reaches", ["HTTP semantics", "middleware", "controller"]),
        (r"JSON serialization", ["response serialization", "DTO validation"]),
        (r"What is Node\.js", ["Node.js event loop"]),
        (r"\bREST\b", ["REST resource design", "HTTP semantics"]),
        (r"\bDTO\b", ["DTO validation", "mass assignment"]),
        (r"\bJWT\b", ["JWT access token"]),
        (r"relational database", ["ORM", "transaction boundary", "connection pool"]),
        (r"dependency injection", ["provider and dependency injection", "NestJS"]),
        (r"input validation", ["DTO validation", "mass assignment"]),
        (r"event loop", ["Node.js event loop", "CPU-bound workload"]),
        (r"4xx and a 5xx", ["HTTP semantics"]),
        (r"environment variables|configuration", ["environment configuration", "secrets management"]),
        (r"unit and integration tests", ["unit test", "API integration test", "contract testing"]),
        (r"Redis", ["Redis TTL", "cache-aside", "cache invalidation"]),
        (r"authentication middleware and authorization", ["guard", "RBAC", "resource ownership checks"]),
        (r"background job|job queue", ["job queue", "at-least-once delivery"]),
        (r"idempotent", ["idempotency", "HTTP semantics"]),
        (r"blocking the Node", ["Node.js event loop", "CPU-bound workload", "worker threads"]),
        (r"password", ["password hashing"]),
        (r"pagination", ["pagination", "N+1 query problem"]),
        (r"rate limit", ["rate limiting", "circuit breaker"]),
        (r"WebSocket|SSE", ["WebSocket", "SSE"]),
        (r"OAuth", ["OAuth 2.0", "JWT access token"]),
        (r"connection pool|connections usually come from a pool|from a pool", ["connection pool"]),
        (r"cookie-based sessions|bearer-token|session authentication", ["session authentication", "JWT access token", "stateless API"]),
        (r"refresh-token|token theft|token rotation", ["JWT access token", "OAuth 2.0", "secrets management"]),
        (r"event-loop phases|microtasks|CPU-heavy work can block", ["Node.js event loop", "CPU-bound workload", "worker threads"]),
        (r"API error responses|error envelope|sensitive internals", ["HTTP semantics", "response serialization", "DTO validation"]),
        (r"distributed caching|cache stampede|fallback", ["cache invalidation", "cache-aside", "Redis TTL", "circuit breaker"]),
        (r"N\+1", ["N+1 query problem", "ORM"]),
        (r"graceful shutdown", ["graceful shutdown"]),
        (r"observability|tracing|metrics", ["distributed tracing", "metrics", "structured logging", "correlation ID"]),
        (r"saga|outbox", ["saga", "transaction boundary", "at-least-once delivery"]),
        (r"multi-tenant", ["multi-tenant SaaS", "resource ownership checks"]),
        (r"notification", ["notification service", "job queue"]),
        (r"exactly-once|at-least-once", ["at-least-once delivery", "idempotency"]),
        (r"modular monolith|split.*services|service boundary", ["modular monolith", "service boundary", "hexagonal architecture"]),
        (r"cache", ["cache invalidation", "cache-aside", "Redis TTL"]),
        (r"transaction", ["transaction boundary", "optimistic locking"]),
        (r"disaster recovery|RPO|RTO", ["secrets management", "object storage"]),
        (r"API contract|version", ["API versioning", "OpenAPI", "contract testing"]),
        (r"schema migration|zero-downtime", ["ORM", "API versioning"]),
        (r"memory growth|profil", ["profiling", "worker threads"]),
        (r"checkout|payment|ecommerce", ["payment API", "idempotency", "saga"]),
        (r"p99 latency|spikes", ["distributed tracing", "timeout", "circuit breaker", "profiling"]),
        (r"SSRF", ["SSRF"]),
        (r"backpressure", ["backpressure", "Node streams"]),
        (r"heap grows|memory growth", ["profiling", "Node.js event loop"]),
        (r"retrying a failed request make an outage worse|retry policy", ["retry with backoff", "circuit breaker", "idempotency"]),
        (r"low CPU but high latency|growing request queue", ["timeout", "connection pool", "backpressure", "Node.js event loop"]),
        (r"vertical sharding|horizontal sharding|read replicas|partitioning", ["ORM", "connection pool", "cache-aside", "pagination"]),
        (r"signals that would justify extracting a microservice", ["modular monolith", "service boundary"]),
        (r"organizations, projects, roles, ownership|delegated permissions", ["RBAC", "resource ownership checks", "multi-tenant SaaS"]),
        (r"failure modes introduced by distributed caching", ["cache invalidation", "cache-aside", "circuit breaker"]),
        (r"one tenant produces|50% of total|noisy neighbor tenant", ["multi-tenant SaaS", "rate limiting", "load balancing"]),
    ],
    "mobile-flutter": [
        (r"Row, Column, Stack, Expanded", ["Row and Column", "Expanded", "Flutter constraints model"]),
        (r"lifecycle of a StatefulWidget|State lifecycle", ["State lifecycle", "setState"]),
        (r"BuildContext", ["BuildContext", "async BuildContext safety"]),
        (r"Navigator\.push|Navigator 1\.0|navigation", ["Navigator 1.0", "go_router"]),
        (r"assets and fonts|pubspec", ["final and const"]),
        (r"responsive", ["LayoutBuilder", "adaptive UI", "Flutter constraints model"]),
        (r"Futures and async|Future", ["Future", "async BuildContext safety"]),
        (r"\bKeys\b|ValueKey|GlobalKey|ObjectKey|PageStorageKey", ["Key", "GlobalKey"]),
        (r"const constructors", ["final and const", "StatelessWidget"]),
        (r"constraints go down", ["Flutter constraints model"]),
        (r"runApp", ["Widget", "Widget tree"]),
        (r"What is Flutter", ["Widget", "Widget tree"]),
        (r"\bStream\b", ["Stream", "Future"]),
        (r"ListView and SingleChildScrollView|ListView\.builder|SliverList|CustomScrollView", ["ListView", "CustomScrollView and slivers"]),
        (r"StatelessWidget and StatefulWidget", ["StatelessWidget", "State lifecycle"]),
        (r"hot reload|hot restart", ["debug/profile/release modes"]),
        (r"ThemeData|ColorScheme|Material 3", ["Material 3 theming", "design tokens"]),
        (r"setState\(\)", ["setState", "setState after dispose"]),
        (r"debug, profile, and release", ["debug/profile/release modes"]),
        (r"package and a plugin", ["federated plugin architecture", "package maintenance evaluation"]),
        (r"declarative UI", ["Widget", "setState"]),
        (r"dispose", ["State lifecycle", "AnimationController", "ScrollController"]),
        (r"Provider|Riverpod|BLoC|Cubit|ValueNotifier|ChangeNotifier", ["Provider", "Riverpod", "BLoC/Cubit", "ValueNotifier"]),
        (r"SharedPreferences|secure storage|SQLite|Drift", ["SharedPreferences", "secure token storage", "SQLite/sqflite", "Drift"]),
        (r"build, layout, paint|frame", ["frame lifecycle", "build phase", "layout phase", "compositing"]),
        (r"deep linking|nested navigation", ["deep linking", "go_router", "Navigator 1.0"]),
        (r"platform channels|MethodChannel|Pigeon|EventChannel", ["MethodChannel", "Pigeon"]),
        (r"Widget, Element, and RenderObject", ["Widget tree", "Element tree", "RenderObject"]),
        (r"lifecycle/background|background", ["AppLifecycleState", "background task execution", "foreground/background services"]),
        (r"inherited widgets|InheritedWidget", ["InheritedWidget", "Provider"]),
        (r"DevTools|jank|performance timeline", ["DevTools performance timeline", "rebuild optimization"]),
        (r"offline-first|conflict|synchron", ["offline-first mobile app", "offline-first synchronization"]),
        (r"API layer|retries|token refresh", ["REST API integration", "retry/backoff", "http package"]),
        (r"unnecessary rebuilds", ["rebuild optimization", "final and const"]),
        (r"unit, widget, integration, and golden|testing", ["unit test", "integration test", "golden test", "mocking"]),
        (r"memory leaks", ["garbage collection", "memory profiling", "setState after dispose"]),
        (r"isolates|Isolate\.run|compute", ["isolates"]),
        (r"RenderFlex overflow|unbounded", ["RenderFlex overflow", "Flutter constraints model"]),
        (r"Flutter Web", ["Flutter Web rendering", "Wasm/SkWasm"]),
        (r"async gap", ["async BuildContext safety", "BuildContext"]),
        (r"search-as-you-type|race", ["retry/backoff", "Future"]),
        (r"Skia and Impeller|Impeller", ["Impeller rendering"]),
        (r"secure authentication|token stor", ["secure token storage", "Firebase Auth"]),
        (r"multi-team|feature packages|monorepo", ["large Flutter app modularization"]),
        (r"custom RenderObject", ["RenderObject", "CustomPainter"]),
        (r"federated Flutter plugin", ["federated plugin architecture"]),
        (r"image-memory|image memory", ["image memory management"]),
        (r"didUpdateWidget|State object", ["State lifecycle", "Element tree", "Key"]),
        (r"platform-channel.*deadlock|deadlocks|times out on iOS", ["MethodChannel", "Pigeon"]),
        (r"Semantics", ["Semantics"]),
        (r"local UI state, cached server state|boundaries between UI state|application state, server state", ["Provider", "Riverpod", "BLoC/Cubit", "repository pattern", "offline-first mobile app"]),
        (r"multiple feature teams|large Flutter application", ["large Flutter app modularization", "dependency injection"]),
        (r"isolate message-passing|large datasets", ["isolates", "json_serializable"]),
        (r"intrinsic measurement|repeated layout passes|poorly designed constraints", ["IntrinsicWidth/IntrinsicHeight", "Flutter constraints model", "layout phase"]),
        (r"scheduler callback through build", ["frame lifecycle", "build phase", "layout phase", "compositing"]),
        (r"release-only rendering|GPU/vendor|Impeller|Skia", ["Impeller rendering", "debug/profile/release modes", "DevTools performance timeline"]),
        (r"Flutter package is safe|package maintenance|mission-critical", ["package maintenance evaluation", "federated plugin architecture"]),
    ],
}


def first_sentence(text: str) -> str:
    text = (text or "").strip()
    m = re.search(r"(.+?[.!?])(\s|$)", text)
    return (m.group(1) if m else text).strip()


def match_topics(track: str, question: str, knowledge: dict) -> list[str]:
    hits: list[str] = []
    for pattern, topics in ALIASES.get(track, []):
        if re.search(pattern, question, re.I):
            for t in topics:
                if t in knowledge and t not in hits:
                    hits.append(t)
    # fallback: score by topic name appearing in question
    qlow = question.lower()
    scored = []
    for topic in knowledge:
        if topic == "_general":
            continue
        if topic.lower() in qlow:
            scored.append(topic)
    for t in scored:
        if t not in hits:
            hits.append(t)
    if not hits and "_general" in knowledge:
        hits = ["_general"]
    return hits[:4]


def synthesize_empty(q: dict, knowledge: dict, topics: list[str]) -> dict:
    cards = [knowledge[t] for t in topics if t in knowledge]
    if not cards:
        cards = [knowledge.get("_general", {})]

    primary = cards[0]
    question = q["question"].rstrip("?")
    level = q.get("level") or "Intermediate"

    short = first_sentence(primary.get("summary", ""))
    # Prefer a question-shaped opener for common stems while keeping topic accuracy.
    if question.lower().startswith("compare") and primary.get("tradeoffs"):
        # Prefer summary; append a crisp contrast if tradeoffs starts cleanly
        trade = first_sentence(primary.get("tradeoffs", ""))
        if trade and len(trade) < 140:
            short = trade if not trade.lower().startswith("simple") else short
    elif question.lower().startswith("why") and primary.get("problem"):
        short = first_sentence(primary.get("problem", short))
    elif question.lower().startswith("how") and primary.get("mechanics"):
        mech = first_sentence(primary.get("mechanics", short))
        if len(mech) <= 160:
            short = mech

    parts = [
        f"Answering “{question}?”: {primary.get('summary', '').strip()}",
        primary.get("problem", ""),
    ]
    concepts = []
    for c in cards:
        concepts.extend(c.get("concepts") or [])
    # unique preserve order
    seen = set()
    uniq = []
    for c in concepts:
        if c not in seen:
            seen.add(c)
            uniq.append(c)
    if uniq:
        parts.append("Relevant ideas: " + "; ".join(uniq[:6]) + ".")
    parts.append(primary.get("mechanics", ""))
    if level != "Beginner":
        parts.append(primary.get("tradeoffs", ""))
    if level == "Advanced":
        parts.append(primary.get("troubleshoot", ""))
        if len(cards) > 1:
            parts.append(cards[1].get("tradeoffs", ""))

    answer = " ".join(p.strip() for p in parts if p and p.strip())
    # trim to ~6 sentences
    sents = re.split(r"(?<=[.!?])\s+", answer)
    sents = [s for s in sents if s]
    answer = " ".join(sents[:6]).strip()

    examples = [c.get("example", "").strip() for c in cards if (c.get("example") or "").strip()]
    example = "\n\n".join(examples[:2]) if examples else ""

    integration = primary.get("integration") or (
        "1) Clarify the requirement in your codebase. "
        "2) Implement the smallest correct slice. "
        "3) Add a regression test. "
        "4) Document the failure mode."
    )

    out = {
        "shortAnswer": short,
        "answer": answer,
        "integrationProcedure": integration,
    }
    if example:
        out["example"] = example
    return out


def main() -> None:
    for track in TRACKS:
        knowledge = json.loads((KNOW_DIR / f"{track}.json").read_text())
        bank = json.loads((BANK_DIR / f"{track}.json").read_text())
        empty_qs = [q for q in bank if not (q.get("topic") or "").strip()]
        out = {}
        unmatched = []
        for q in empty_qs:
            topics = match_topics(track, q["question"], knowledge)
            if topics == ["_general"] or not topics:
                unmatched.append(q["id"])
            out[q["id"]] = synthesize_empty(q, knowledge, topics)
        path = KNOW_DIR / f"empty-{track}.json"
        path.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
        print(f"{track}: wrote {len(out)} empty answers; weak-match ids={len(unmatched)}")
        if unmatched[:5]:
            print("  e.g.", unmatched[:5])


if __name__ == "__main__":
    main()
