#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _topic_lib import fm, write_all

items: list[tuple[str, str]] = []

items.append((
    "backend/nodejs-runtime.mdx",
    fm(
        id="BACKEND-NODE",
        title="Node.js runtime",
        title_bn="Node.js রানটাইম",
        description="What Node.js is, how the event loop handles concurrency, and when Node fits backend workloads.",
        description_bn="Node.js কী, event loop কীভাবে concurrency চালায়, কখন Node ব্যাকএন্ডে মানানসই।",
        track="backend",
        category="nodejs",
        difficulty="intermediate",
        minutes=40,
        prerequisites=["FRONTEND-JS-ASYNC"],
        recommended_before=["FOUNDATIONS-PROCESSES"],
        unlocks=["BACKEND-HTTP-SERVER", "BACKEND-NESTJS"],
        related=["BACKEND-LOGGING", "FOUNDATIONS-PROCESSES"],
        careers=["backend-engineer", "fullstack-engineer"],
        tags=["nodejs", "javascript", "event-loop"],
        sources=["NODE-EVENT-LOOP", "TC39-ECMASCRIPT"],
        versions={"node": "LTS — verify against current Node.js docs"},
    )
    + """## What is it?

**Node.js** is a JavaScript runtime built around an event loop and non-blocking I/O, commonly used to build APIs, CLIs, and tooling.

## Why does it exist?

JavaScript was trapped in browsers. Node brought the same language to servers so teams could share skills and packages across the stack—especially for I/O-heavy services.

## Mental model

```js
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('ok');
});

server.listen(3000);
```

Node shines when many connections wait on network/disk. CPU-heavy work can block the loop unless offloaded (worker threads, separate services).

## Common mistakes

1. Running synchronous CPU-bound loops on the main thread in request handlers.
2. Ignoring unhandled promise rejections.
3. Treating Node as “just browser JS” and skipping operational concerns (signals, logging, metrics).

## Interview angles

**Junior:** What is Node.js?  
**Mid:** Explain the event loop vs OS threads at a high level.  
**Senior:** Clustering, worker threads, and backpressure in streams.

## Mini exercise

Describe whether a JSON-transform API that gzip-compresses large files is primarily I/O-bound or CPU-bound—and what that implies for Node.

## Sources

- Node event loop docs (`NODE-EVENT-LOOP`); ECMAScript baseline (`TC39-ECMASCRIPT`).
""",
))

items.append((
    "backend/http-servers.mdx",
    fm(
        id="BACKEND-HTTP-SERVER",
        title="HTTP servers",
        title_bn="HTTP সার্ভার",
        description="How backend HTTP servers accept connections, route requests, and return responses safely under load.",
        description_bn="ব্যাকএন্ড HTTP সার্ভার কীভাবে কানেকশন নেয়, route করে, লোডে নিরাপদে রেসপন্স দেয়।",
        track="backend",
        category="http",
        difficulty="intermediate",
        minutes=40,
        prerequisites=["BACKEND-NODE", "FOUNDATIONS-HTTP"],
        recommended_before=["FOUNDATIONS-TCP-IP"],
        unlocks=["BACKEND-REST", "BACKEND-VALIDATION"],
        related=["DEVOPS-NGINX", "BACKEND-LOGGING"],
        careers=["backend-engineer", "devops-engineer"],
        tags=["http", "servers", "backend"],
        sources=["RFC-9110-HTTP", "NODE-EVENT-LOOP"],
    )
    + """## What is it?

An **HTTP server** listens on a socket, parses requests, invokes application logic, and writes responses. Frameworks add routing, middleware, and helpers on top of this core loop.

## Why does it exist?

Clients speak HTTP. Servers must terminate that protocol correctly—including headers, body streaming, timeouts, and error mapping—before business logic matters.

## Mental model

1. Accept connection / receive request
2. Match route + method
3. Authenticate/authorize as needed
4. Validate input
5. Execute use case
6. Map domain results to status codes + body
7. Log and observe

Keep timeouts explicit. Slow clients and hanging upstreams will exhaust resources otherwise.

## Common mistakes

1. Not limiting body size (memory exhaustion).
2. Returning stack traces to clients in production.
3. Blocking the event loop inside handlers.

## Interview angles

**Junior:** What does a server do with a request?  
**Mid:** Explain middleware ordering with auth and logging examples.  
**Senior:** Connection pooling, keep-alive, and graceful shutdown.

## Mini exercise

List status codes you’d return for invalid JSON body vs missing auth vs downstream timeout.

## Sources

- HTTP semantics (`RFC-9110-HTTP`); Node concurrency context (`NODE-EVENT-LOOP`).
""",
))

items.append((
    "backend/rest-api-design.mdx",
    fm(
        id="BACKEND-REST",
        title="REST API design",
        title_bn="REST API ডিজাইন",
        description="How resource-oriented HTTP APIs stay predictable, and how to model collections, errors, and versioning thoughtfully.",
        description_bn="রিসোর্স-কেন্দ্রিক HTTP API কীভাবে অনুমানযোগ্য থাকে—collections, error ও versioning।",
        track="backend",
        category="api-design",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["BACKEND-HTTP-SERVER", "FOUNDATIONS-API-CONCEPTS"],
        recommended_before=["FOUNDATIONS-HTTP"],
        unlocks=["BACKEND-VALIDATION", "BACKEND-AUTH"],
        related=["FULLSTACK-INTEGRATION", "BACKEND-NESTJS"],
        careers=["backend-engineer", "fullstack-engineer"],
        tags=["rest", "api", "http"],
        sources=["RFC-9110-HTTP", "OWASP-TOP10"],
    )
    + """## What is it?

**REST-style HTTP APIs** model the world as resources identified by URLs, manipulated with standard methods, and represented as JSON (commonly) payloads.

## Why does it exist?

Ad-hoc RPC endpoints proliferate inconsistent naming and error behavior. Resource conventions help clients, docs, caches, and gateways share expectations.

## Mental model

```http
GET /orders/123
POST /orders
PATCH /orders/123
```

- Use nouns for resources; keep verbs in methods.
- Prefer consistent error envelopes and correct status codes.
- Pagination, filtering, and idempotency keys matter as soon as traffic is real.

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "email is required",
    "fields": { "email": "required" }
  }
}
```

## Common mistakes

1. Encoding actions as `GET /deleteUser` (unsafe + uncacheable mess).
2. Breaking clients with silent response shape changes.
3. Ignoring pagination until the endpoint times out.

## Interview angles

**Junior:** What makes an API “RESTful” in practice?  
**Mid:** How do you version APIs without chaos?  
**Senior:** Idempotency, partial updates, and compatibility strategies.

## Mini exercise

Design endpoints for listing, creating, and cancelling orders—including one error case each.

## Sources

- HTTP semantics (`RFC-9110-HTTP`); security-aware API habits (`OWASP-TOP10`).
""",
))

items.append((
    "backend/nestjs-fundamentals.mdx",
    fm(
        id="BACKEND-NESTJS",
        title="NestJS fundamentals",
        title_bn="NestJS ফান্ডামেন্টালস",
        description="Why NestJS structures Node APIs with modules and providers, and how controllers map HTTP to application services.",
        description_bn="NestJS কেন module/provider দিয়ে Node API সাজায়, controller কীভাবে HTTP-কে সার্ভিসে ম্যাপ করে।",
        track="backend",
        category="nestjs",
        difficulty="intermediate",
        minutes=50,
        prerequisites=["BACKEND-NODE", "FRONTEND-TYPESCRIPT"],
        recommended_before=["BACKEND-REST"],
        unlocks=["BACKEND-NESTJS-DI", "BACKEND-VALIDATION", "BACKEND-AUTH"],
        related=["BACKEND-ORM", "BACKEND-TESTING"],
        careers=["backend-engineer", "fullstack-engineer"],
        tags=["nestjs", "nodejs", "typescript"],
        sources=["NESTJS-ARCHITECTURE", "NODE-EVENT-LOOP"],
        versions={"nestjs": "Verify against current NestJS docs"},
    )
    + """## What is it?

**NestJS** is a TypeScript-first framework for building server applications with Angular-inspired modules, dependency injection, and decorators.

## Why does it exist?

Raw Express apps can grow into unstructured middleware piles. Nest provides conventions for boundaries: modules, controllers, providers, pipes, guards.

## Mental model

```ts
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

- **Controllers** adapt transport (HTTP).
- **Providers/services** hold business logic.
- **Modules** group cohesive features.

## Common mistakes

1. Putting business rules directly in controllers.
2. Creating giant shared modules that import the world (circular dependency hell).
3. Skipping DTO validation pipes and trusting raw `req.body`.

## Interview angles

**Junior:** Controller vs service?  
**Mid:** Explain Nest modules and why DI helps testing.  
**Senior:** Bounded contexts, transport-agnostic services, and hybrid microservice setups.

## Mini exercise

Sketch modules for `UsersModule` and `OrdersModule` and list what each exports.

## Sources

- NestJS architecture docs (`NESTJS-ARCHITECTURE`); Node runtime context (`NODE-EVENT-LOOP`).
""",
))

items.append((
    "backend/authentication-authorization.mdx",
    fm(
        id="BACKEND-AUTH",
        title="Authentication and authorization",
        title_bn="অথেন্টিকেশন ও অথরাইজেশন",
        description="How systems verify identity versus grant permissions, and how to design session or token flows carefully.",
        description_bn="আইডেন্টিটি যাচাই বনাম অনুমতি প্রদান, এবং session/token ফ্লো সতর্কভাবে ডিজাইন।",
        track="backend",
        category="security",
        difficulty="advanced",
        minutes=50,
        prerequisites=["BACKEND-REST", "FOUNDATIONS-SECURITY-BASICS"],
        recommended_before=["BACKEND-VALIDATION"],
        unlocks=["BACKEND-JWT", "BACKEND-SECURITY", "FULLSTACK-AUTH-FLOWS"],
        related=["NESTJS-AUTH", "FULLSTACK-CORS-CSRF"],
        careers=["backend-engineer", "cybersecurity-engineer"],
        tags=["auth", "security", "sessions"],
        sources=["NESTJS-AUTH", "OWASP-TOP10"],
    )
    + """## What is it?

**Authentication** answers “who are you?” **Authorization** answers “what are you allowed to do?” Conflating them causes privilege bugs.

## Why does it exist?

Multi-user systems must trust carefully. Every protected action needs a verified identity and a policy decision.

## Mental model

1. Establish identity (password + MFA, OAuth, passkeys, etc.).
2. Create a session or token representing that identity.
3. On each request, authenticate the credential.
4. Authorize against roles/permissions/policies for the resource.

```ts
// Pseudocode policy check
function assertCanCancel(user: User, order: Order) {
  if (user.id !== order.ownerId && !user.roles.includes('admin')) {
    throw new ForbiddenError();
  }
}
```

## Common mistakes

1. Checking authentication but forgetting object-level authorization.
2. Storing passwords reversibly or with weak hashing.
3. Putting sensitive permissions only in client UI without server enforcement.

## Interview angles

**Junior:** AuthN vs AuthZ?  
**Mid:** Sessions vs JWTs—tradeoffs.  
**Senior:** Threat model a password-reset and refresh-token rotation design.

## Mini exercise

For “delete comment,” list checks for anonymous users, authors, and moderators.

## Sources

- NestJS auth docs (`NESTJS-AUTH`); OWASP themes (`OWASP-TOP10`).
""",
))

items.append((
    "backend/input-validation.mdx",
    fm(
        id="BACKEND-VALIDATION",
        title="Input validation",
        title_bn="ইনপুট ভ্যালিডেশন",
        description="Why servers must validate every external input, and how schemas turn untrusted data into safe domain values.",
        description_bn="সার্ভার কেন প্রতিটি বাইরের ইনপুট যাচাই করে, schema কীভাবে অবিশ্বস্ত ডেটাকে নিরাপদ মানে রূপান্তর করে।",
        track="backend",
        category="security",
        difficulty="intermediate",
        minutes=35,
        prerequisites=["BACKEND-HTTP-SERVER"],
        recommended_before=["BACKEND-REST"],
        unlocks=["BACKEND-AUTH", "BACKEND-ORM"],
        related=["FOUNDATIONS-SECURITY-BASICS", "BACKEND-SECURITY"],
        careers=["backend-engineer", "qa-engineer"],
        tags=["validation", "security", "dto"],
        sources=["OWASP-TOP10", "NESTJS-ARCHITECTURE"],
    )
    + """## What is it?

**Input validation** checks that request data matches expected types, ranges, formats, and business constraints before use.

## Why does it exist?

Clients lie—by bug or by malice. Validation is your first control against injection, logic abuse, and corrupt persisted data.

## Mental model

```ts
type CreateUserInput = {
  email: string;
  age: number;
};

function parseCreateUser(body: unknown): CreateUserInput {
  if (!body || typeof body !== 'object') throw new ValidationError('body');
  const email = (body as any).email;
  const age = (body as any).age;
  if (typeof email !== 'string' || !email.includes('@')) throw new ValidationError('email');
  if (typeof age !== 'number' || age < 13) throw new ValidationError('age');
  return { email: email.trim().toLowerCase(), age };
}
```

Prefer schema libraries in real apps; the idea is explicit parsing at the boundary.

## Common mistakes

1. Validating only in the UI.
2. Accepting stringly-typed booleans/ids without coercion rules.
3. Returning different error shapes per endpoint.

## Interview angles

**Junior:** Why validate on the server?  
**Mid:** Whitelist vs blacklist validation.  
**Senior:** Parsing at boundaries (Parse, don’t validate) and aligning runtime schemas with TypeScript types.

## Mini exercise

Write validation rules for a payment amount field (type, minimum, maximum, currency code).

## Sources

- OWASP input themes (`OWASP-TOP10`); Nest pipes/DTO culture (`NESTJS-ARCHITECTURE`).
""",
))

items.append((
    "backend/orm-query-builders.mdx",
    fm(
        id="BACKEND-ORM",
        title="ORMs and query builders",
        title_bn="ORM ও কোয়েরি বিল্ডার",
        description="How ORMs map objects to tables, when raw SQL is better, and how to avoid N+1 query pitfalls.",
        description_bn="ORM কীভাবে অবজেক্টকে টেবিলে ম্যাপ করে, কখন raw SQL ভালো, N+1 কীভাবে এড়াবেন।",
        track="backend",
        category="data-access",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["BACKEND-POSTGRES", "DATABASE-SQL"],
        recommended_before=["BACKEND-VALIDATION"],
        unlocks=["BACKEND-TESTING", "BACKEND-QUEUES"],
        related=["DATABASE-EXPLAIN", "DATABASE-TRANSACTIONS"],
        careers=["backend-engineer", "database-engineer"],
        tags=["orm", "sql", "postgres"],
        sources=["POSTGRES-DOCS", "POSTGRES-INDEXES"],
    )
    + """## What is it?

An **ORM** (object-relational mapper) lets you work with database rows via objects/classes. A **query builder** helps construct SQL safely with composable APIs.

## Why does it exist?

Hand-written SQL is powerful but repetitive and easy to inject if concatenated. ORMs/query builders improve productivity and parameterization—when used with understanding.

## Mental model

- Map entities to tables.
- Express filters in code that become parameterized SQL.
- Watch the generated queries in development.

N+1 problem: loading a list, then querying once per row for relations. Fix with joins/eager loading or batched queries.

## Common mistakes

1. Never reading the SQL your ORM emits.
2. Using ORM transactions incorrectly (partial updates without atomicity).
3. Over-fetching huge object graphs for simple endpoints.

## Interview angles

**Junior:** What is an ORM?  
**Mid:** Explain N+1 and how you’d detect it.  
**Senior:** When to drop to SQL for CTEs/window functions and performance.

## Mini exercise

Given `GET /posts` that also needs author names, sketch two query strategies and their tradeoffs.

## Sources

- PostgreSQL docs (`POSTGRES-DOCS`); indexing for query plans (`POSTGRES-INDEXES`).
""",
))

items.append((
    "backend/redis-caching.mdx",
    fm(
        id="BACKEND-REDIS",
        title="Redis caching",
        title_bn="Redis ক্যাশিং",
        description="Why Redis helps hot-path reads, which data structures fit which jobs, and how to avoid stale-cache disasters.",
        description_bn="Redis কেন হট-পাথ read সাহায্য করে, কোন ডেটা স্ট্রাকচার কখন, stale cache কীভাবে এড়াবেন।",
        track="backend",
        category="caching",
        difficulty="advanced",
        minutes=40,
        prerequisites=["BACKEND-HTTP-SERVER", "DATABASE-REDIS"],
        recommended_before=["BACKEND-POSTGRES"],
        unlocks=["BACKEND-QUEUES"],
        related=["DATABASE-REDIS", "DEVOPS-OBSERVABILITY"],
        careers=["backend-engineer", "devops-engineer"],
        tags=["redis", "cache", "performance"],
        sources=["REDIS-DATA-TYPES", "POSTGRES-DOCS"],
    )
    + """## What is it?

**Redis** is an in-memory data store often used as a cache, rate limiter, session store, or queue backbone—depending on structure and durability settings.

## Why does it exist?

Repeated database reads for the same hot keys waste latency and load. A fast memory layer absorbs duplicates when correctness rules allow it.

## Mental model

```text
Request -> Cache lookup
  hit  -> return
  miss -> query DB -> populate cache (TTL) -> return
```

Pick structures intentionally: strings for blobs, hashes for objects, sets for uniqueness, sorted sets for leaderboards.

## Common mistakes

1. Caching without TTLs or invalidation strategy.
2. Caching personalized/private data under a shared key.
3. Treating Redis as a durable source of truth without understanding persistence tradeoffs.

## Interview angles

**Junior:** Why use a cache?  
**Mid:** Cache-aside vs write-through at a high level.  
**Senior:** Stampede prevention, key design, and consistency with DB writes.

## Mini exercise

Design cache keys for `GET /products/:id` including a version or updated-at strategy.

## Sources

- Redis data types (`REDIS-DATA-TYPES`); primary store contrast (`POSTGRES-DOCS`).
""",
))

# Fix related that incorrectly includes NODE-EVENT-LOOP and NESTJS-AUTH as topic related
# BACKEND-NODE related has NODE-EVENT-LOOP - fix
# BACKEND-AUTH related has NESTJS-AUTH - fix

write_all(items)
