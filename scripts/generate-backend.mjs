import { writeTopic, commonFooter } from './topic-helpers.mjs';

const C = {
  be: 'CAREER-BACKEND-ENGINEER',
  fs: 'CAREER-FULLSTACK-ENGINEER',
  devops: 'CAREER-DEVOPS-ENGINEER',
  se: 'CAREER-SOFTWARE-ENGINEER',
};

export function generateBackend() {
  const topics = [
    {
      slug: 'node-runtime-event-loop',
      meta: {
        id: 'BACKEND-NODE-RUNTIME-EVENT-LOOP',
        title: 'Node.js Runtime and Event Loop',
        titleBn: 'Node.js রানটাইম ও ইভেন্ট লুপ',
        description:
          'How Node stays non-blocking: libuv, the event loop phases, and CPU vs I/O work.',
        descriptionBn:
          'Node কীভাবে নন-ব্লকিং থাকে: libuv, ইভেন্ট লুপ ফেজ, এবং CPU বনাম I/O কাজ।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FRONTEND-JAVASCRIPT-ASYNC-EVENT-LOOP', 'FOUNDATIONS-OS-PROCESSES-MEMORY'],
        unlocks: ['BACKEND-HTTP-REST-API-DESIGN', 'BACKEND-TYPESCRIPT-FOR-BACKEND'],
        related: ['BACKEND-REDIS-CACHING'],
        careers: [C.be, C.fs, C.se],
        tags: ['node', 'event-loop', 'backend'],
        sources: ['NODE-EVENT-LOOP'],
      },
      body: `
## Why Node fits I/O-heavy APIs

Node’s strength is concurrent I/O with a single-threaded JS heap—great for APIs waiting on DB/network, poor for naive CPU crunching on the main thread.

## Mental model

<Callout type="mental-model">
  JS callbacks/promises queue work; libuv handles OS I/O. Heavy CPU on the main thread delays *everyone*. Offload CPU or scale out processes.
</Callout>

\`\`\`js
import http from 'node:http';

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(3000);
\`\`\`

Learn timers, poll, and \`process.nextTick\`/microtasks at a conceptual level from official Node guides.

${commonFooter({
  mistakes: [
    { title: 'Sync fs in request path', detail: 'Blocks the loop under load.' },
    { title: 'CPU-heavy loops in handlers', detail: 'Use workers or separate services.' },
    { title: 'Unhandled rejections', detail: 'Can crash or hide failures.' },
  ],
  interview:
    'What happens when a CPU-bound task runs on the Node event loop, and how would you mitigate it?',
  practice: [
    'Build a tiny http server.',
    'Compare sync vs async file read under concurrent requests.',
    'Read Node’s event loop documentation once end-to-end.',
  ],
  sourceIds: ['NODE-EVENT-LOOP'],
})}
`,
    },
    {
      slug: 'http-rest-api-design',
      meta: {
        id: 'BACKEND-HTTP-REST-API-DESIGN',
        title: 'HTTP and REST API Design',
        titleBn: 'HTTP ও REST API ডিজাইন',
        description:
          'Resources, status codes, idempotency, pagination, and versioning that clients can trust.',
        descriptionBn:
          'রিসোর্স, স্ট্যাটাস কোড, আইডেমপোটেন্সি, পেজিনেশন ও ভার্সনিং—ক্লায়েন্ট বিশ্বাস করতে পারে এমন API।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-NETWORKING-TCP-IP-HTTP', 'BACKEND-NODE-RUNTIME-EVENT-LOOP'],
        unlocks: ['BACKEND-NESTJS-ARCHITECTURE', 'FLUTTER-NETWORKING-REST'],
        related: ['BACKEND-SECURITY-BASICS', 'FRONTEND-NEXTJS-APP-ROUTER-BASICS'],
        careers: [C.be, C.fs],
        tags: ['rest', 'http', 'api-design'],
        sources: ['RFC-9110-HTTP'],
      },
      body: `
## Why API design is product design

Clients (web, mobile, partners) couple to your URLs and semantics for years. Consistency beats cleverness.

## Mental model

<Callout type="mental-model">
  Resources are nouns (\`/topics/{id}\`). Methods carry intent. Status codes are machine-readable outcomes. Idempotency makes retries safe.
</Callout>

\`\`\`http
GET /topics?track=foundations&limit=20 HTTP/1.1
Authorization: Bearer …

HTTP/1.1 200 OK
Content-Type: application/json
\`\`\`

- \`GET\`/\`PUT\`/\`DELETE\` should be idempotent in spirit.
- Use \`201\` on create when a new resource appears; \`204\` when empty success fits.
- Paginate list endpoints; never return unbounded tables.

${commonFooter({
  mistakes: [
    { title: 'RPC-only URLs with verbs everywhere', detail: 'Harder caching and uniformity—though RPC can be fine if consistent.' },
    { title: 'Always HTTP 200 with error payloads', detail: 'Breaks generic clients and monitors.' },
    { title: 'Breaking changes without versioning strategy', detail: 'Coordinate deprecations.' },
  ],
  interview:
    'Design endpoints for creating and listing topics with pagination and auth errors.',
  practice: [
    'Document 5 endpoints with status codes.',
    'Add idempotency keys for a payment-like POST.',
    'Define error body schema.',
  ],
  sourceIds: ['RFC-9110-HTTP'],
})}
`,
    },
    {
      slug: 'typescript-for-backend',
      meta: {
        id: 'BACKEND-TYPESCRIPT-FOR-BACKEND',
        title: 'TypeScript for Backend',
        titleBn: 'ব্যাকএন্ডে TypeScript',
        description:
          'Typing boundaries: DTOs, domain models, and safe parsing of untrusted input.',
        descriptionBn:
          'সীমানা টাইপ করা: DTO, ডোমেইন মডেল, এবং অবিশ্বস্ত ইনপুটের নিরাপদ পার্সিং।',
        difficulty: 'intermediate',
        estimatedMinutes: 35,
        prerequisites: ['FRONTEND-TYPESCRIPT-FUNDAMENTALS', 'BACKEND-NODE-RUNTIME-EVENT-LOOP'],
        unlocks: ['BACKEND-NESTJS-ARCHITECTURE', 'BACKEND-TESTING'],
        related: ['BACKEND-HTTP-REST-API-DESIGN'],
        careers: [C.be, C.fs],
        tags: ['typescript', 'backend', 'validation'],
        sources: ['TS-HANDBOOK'],
      },
      body: `
## Why backend types matter more

Frontend types protect UX. Backend types protect **data integrity and authz**—mistakes persist in databases.

## Mental model

<Callout type="mental-model">
  Trust boundaries require runtime validation (Zod/class-validator). TypeScript types alone are erased at runtime.
</Callout>

\`\`\`ts
import { z } from 'zod';

const CreateTopic = z.object({
  title: z.string().min(3).max(120),
  track: z.string().min(2),
});

type CreateTopic = z.infer<typeof CreateTopic>;

export function parseCreateTopic(input: unknown): CreateTopic {
  return CreateTopic.parse(input);
}
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Typing req.body as any', detail: 'You asserted a lie.' },
    { title: 'Sharing mutable global config', detail: 'Hard to test; prefer injection.' },
    { title: 'Leaking entities over DTOs', detail: 'Overexposes fields and couples clients.' },
  ],
  interview:
    'How do you validate untrusted JSON at the edge of a NestJS/Express app?',
  practice: [
    'Add Zod schemas to an endpoint.',
    'Separate DB entity from response DTO.',
    'Enable strict TypeScript for a service package.',
  ],
  sourceIds: ['TS-HANDBOOK'],
})}
`,
    },
    {
      slug: 'nestjs-architecture',
      meta: {
        id: 'BACKEND-NESTJS-ARCHITECTURE',
        title: 'NestJS Architecture',
        titleBn: 'NestJS আর্কিটেকচার',
        description:
          'Modules, providers, controllers, and dependency injection for structured Node APIs.',
        descriptionBn:
          'মডিউল, প্রোভাইডার, কন্ট্রোলার ও ডিপেন্ডেন্সি ইনজেকশন—গঠনময় Node API-এর জন্য।',
        difficulty: 'intermediate',
        estimatedMinutes: 42,
        prerequisites: ['BACKEND-TYPESCRIPT-FOR-BACKEND', 'BACKEND-HTTP-REST-API-DESIGN'],
        unlocks: ['BACKEND-NESTJS-AUTH-JWT', 'BACKEND-POSTGRESQL-WITH-BACKEND'],
        related: ['BACKEND-TESTING'],
        careers: [C.be, C.fs],
        tags: ['nestjs', 'architecture', 'di'],
        sources: ['NESTJS-ARCHITECTURE'],
      },
      body: `
## Why NestJS exists

Unstructured Express apps grow into spaghetti. Nest borrows Angular-like modules/DI to keep boundaries explicit.

## Mental model

<Callout type="mental-model">
  Controllers adapt HTTP. Providers hold business logic. Modules group and export providers. DI wires constructors instead of manual singletons.
</Callout>

\`\`\`ts
import { Controller, Get, Injectable, Module } from '@nestjs/common';

@Injectable()
class TopicsService {
  list() {
    return [{ id: 'FOUNDATIONS-GIT-FUNDAMENTALS' }];
  }
}

@Controller('topics')
class TopicsController {
  constructor(private readonly topics: TopicsService) {}
  @Get()
  list() {
    return this.topics.list();
  }
}

@Module({ controllers: [TopicsController], providers: [TopicsService] })
export class TopicsModule {}
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Fat controllers', detail: 'Move logic to services.' },
    { title: 'Circular module imports', detail: 'Revisit boundaries; use forwardRef sparingly.' },
    { title: 'Hidden new Service() calls', detail: 'Breaks DI and testing.' },
  ],
  interview:
    'Explain Nest modules and how you would structure auth vs topics domains.',
  practice: [
    'Create a module with controller + service.',
    'Inject a config provider.',
    'Write a unit test with a mocked service.',
  ],
  sourceIds: ['NESTJS-ARCHITECTURE'],
})}
`,
    },
    {
      slug: 'nestjs-auth-jwt',
      meta: {
        id: 'BACKEND-NESTJS-AUTH-JWT',
        title: 'NestJS Auth with JWT',
        titleBn: 'NestJS-এ JWT অথেন্টিকেশন',
        description:
          'Guards, strategies, and token hygiene for protecting NestJS routes.',
        descriptionBn:
          'NestJS রুট রক্ষায় গার্ড, স্ট্র্যাটেজি ও টোকেন হাইজিন।',
        difficulty: 'intermediate',
        estimatedMinutes: 42,
        prerequisites: ['BACKEND-NESTJS-ARCHITECTURE', 'FOUNDATIONS-SECURITY-FUNDAMENTALS'],
        unlocks: ['FULLSTACK-AUTH-ACROSS-STACK', 'BACKEND-SECURITY-BASICS'],
        related: ['NEXTJS-AUTH', 'FRONTEND-FORMS-VALIDATION'],
        careers: [C.be, C.fs],
        tags: ['nestjs', 'jwt', 'auth'],
        sources: ['NESTJS-AUTH', 'OWASP-TOP10'],
      },
      body: `
## Why auth is a cross-cutting concern

Authentication answers “who”; authorization answers “what may they do.” Nest Guards are the natural choke point.

## Mental model

<Callout type="mental-model">
  Issue short-lived access tokens (and preferably rotating refresh tokens). Verify signature + claims on every protected request. Never treat JWT presence as proof without verification.
</Callout>

Follow official Nest authentication docs for Passport JWT strategies and \`@UseGuards\`. Prefer httpOnly cookies for browser apps when aligned with your threat model; mobile apps often use secure storage + bearer tokens.

${commonFooter({
  mistakes: [
    { title: 'Long-lived JWTs in localStorage', detail: 'XSS becomes account takeover.' },
    { title: 'Putting permissions only on the client', detail: 'Server must enforce authz.' },
    { title: 'Weak secrets / none alg confusion', detail: 'Use vetted libraries and algorithms.' },
  ],
  interview:
    'How do you implement role-based access for admin routes in NestJS?',
  practice: [
    'Protect a route with a JWT guard.',
    'Add a roles decorator + guard.',
    'Document token lifetimes and refresh flow.',
  ],
  sourceIds: ['NESTJS-AUTH', 'OWASP-TOP10'],
})}
`,
    },
    {
      slug: 'postgresql-with-backend',
      meta: {
        id: 'BACKEND-POSTGRESQL-WITH-BACKEND',
        title: 'PostgreSQL with a Backend',
        titleBn: 'ব্যাকএন্ডের সাথে PostgreSQL',
        description:
          'Connection pooling, migrations, and mapping queries to Nest/Node services.',
        descriptionBn:
          'কানেকশন পুলিং, মাইগ্রেশন, এবং Nest/Node সার্ভিসে কোয়েরি ম্যাপিং।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-SQL-FUNDAMENTALS', 'BACKEND-NESTJS-ARCHITECTURE'],
        unlocks: ['BACKEND-REDIS-CACHING', 'DATABASE-POSTGRESQL-TRANSACTIONS'],
        related: ['DATABASE-POSTGRESQL-INDEXING'],
        careers: [C.be, C.fs],
        tags: ['postgresql', 'backend', 'migrations'],
        sources: ['POSTGRES-DOCS'],
      },
      body: `
## Why the database is part of your API

Schema and constraints are your last line of integrity. App code should cooperate with them—not fight them.

## Mental model

<Callout type="mental-model">
  One request → short DB transactions. Pool connections. Migrate schema forward with reviewable SQL/ORM migrations.
</Callout>

\`\`\`sql
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  track TEXT NOT NULL,
  title TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX topics_track_idx ON topics (track);
\`\`\`

Use parameterized queries / ORM bind parameters always.

${commonFooter({
  mistakes: [
    { title: 'New connection per query', detail: 'Exhausts Postgres; use a pool.' },
    { title: 'No migrations', detail: 'Snowflake prod schemas drift.' },
    { title: 'N+1 ORM queries', detail: 'Eager-load or join consciously.' },
  ],
  interview:
    'How do you run migrations safely in production with a NestJS service?',
  practice: [
    'Add a migration that creates an index.',
    'Configure a pool size thoughtfully.',
    'Log slow queries in development.',
  ],
  sourceIds: ['POSTGRES-DOCS'],
})}
`,
    },
    {
      slug: 'redis-caching',
      meta: {
        id: 'BACKEND-REDIS-CACHING',
        title: 'Redis Caching for Backends',
        titleBn: 'ব্যাকএন্ডে Redis ক্যাশিং',
        description:
          'When to cache, cache keys, TTLs, and invalidation—so Redis helps instead of lying.',
        descriptionBn:
          'কখন ক্যাশ করবেন, ক্যাশ কী, TTL ও ইনভ্যালিডেশন—যাতে Redis সাহায্য করে, মিথ্যা না বলে।',
        difficulty: 'intermediate',
        estimatedMinutes: 36,
        prerequisites: ['BACKEND-POSTGRESQL-WITH-BACKEND', 'FOUNDATIONS-DATA-STRUCTURES-INTRO'],
        unlocks: ['DATABASE-REDIS-DATA-STRUCTURES', 'FULLSTACK-DATA-FLOW'],
        related: ['FOUNDATIONS-ALGORITHMS-COMPLEXITY'],
        careers: [C.be, C.fs, C.devops],
        tags: ['redis', 'caching', 'performance'],
        sources: ['REDIS-DATA-TYPES'],
      },
      body: `
## Why caching is a consistency decision

Caches trade freshness for latency/cost. Without invalidation strategy, users see ghosts.

## Mental model

<Callout type="mental-model">
  Cache aside: read DB on miss, populate Redis with TTL. On write, update DB then delete/update cache keys deliberately.
</Callout>

\`\`\`ts
const key = \`topic:\${id}\`;
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
const row = await db.topic.find(id);
await redis.set(key, JSON.stringify(row), 'EX', 60);
return row;
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Caching personalized data under global keys', detail: 'Leakage across users.' },
    { title: 'No TTL and no invalidation', detail: 'Eternal stale reads.' },
    { title: 'Caching as fix for missing indexes', detail: 'Fix the query first.' },
  ],
  interview:
    'Design cache keys and invalidation for a topic page that editors update.',
  practice: [
    'Implement cache-aside for one GET.',
    'Expire keys on update.',
    'Measure hit rate conceptually.',
  ],
  sourceIds: ['REDIS-DATA-TYPES'],
})}
`,
    },
    {
      slug: 'backend-testing',
      meta: {
        id: 'BACKEND-TESTING',
        title: 'Backend Testing',
        titleBn: 'ব্যাকএন্ড টেস্টিং',
        description:
          'Unit tests with DI, integration tests with Testcontainers/DB, and contract checks.',
        descriptionBn:
          'DI দিয়ে ইউনিট টেস্ট, Testcontainers/DB দিয়ে ইন্টিগ্রেশন, এবং কন্ট্রাক্ট চেক।',
        difficulty: 'intermediate',
        estimatedMinutes: 38,
        prerequisites: ['BACKEND-NESTJS-ARCHITECTURE', 'BACKEND-TYPESCRIPT-FOR-BACKEND'],
        unlocks: ['BACKEND-DOCKER-DEPLOY'],
        related: ['QA-API-TESTING', 'BACKEND-SECURITY-BASICS'],
        careers: [C.be, 'CAREER-QA-ENGINEER', C.fs],
        tags: ['testing', 'backend', 'jest'],
        sources: ['NESTJS-ARCHITECTURE'],
      },
      body: `
## Why backend tests save incidents

APIs are contracts. Tests document expected status codes, validation, and authz—executable specs.

## Mental model

<Callout type="mental-model">
  Unit-test pure domain logic. Integration-test DB/adapters. A few end-to-end smoke tests against a running app.
</Callout>

Prefer deterministic fixtures; migrate a test database; never hit production.

${commonFooter({
  mistakes: [
    { title: 'Only testing happy paths', detail: 'Authz and validation bugs hide in 4xx.' },
    { title: 'Flaky time/network dependence', detail: 'Fake clocks and nocks.' },
    { title: 'Huge e2e-only suites', detail: 'Slow feedback; pyramid imbalance.' },
  ],
  interview:
    'How would you test a Nest guard that requires an admin role?',
  practice: [
    'Unit test a pure pricing function.',
    'Integration test an endpoint with a test DB.',
    'Add CI job running tests on PR.',
  ],
  sourceIds: ['NESTJS-ARCHITECTURE'],
})}
`,
    },
    {
      slug: 'backend-docker-deploy',
      meta: {
        id: 'BACKEND-DOCKER-DEPLOY',
        title: 'Backend Docker Deploy',
        titleBn: 'ব্যাকএন্ড Docker ডিপ্লয়',
        description:
          'Containerizing Node APIs: images, env config, healthchecks, and 12-factor habits.',
        descriptionBn:
          'Node API কন্টেইনারাইজ: ইমেজ, এনভ কনফিগ, হেলথচেক ও 12-factor অভ্যাস।',
        difficulty: 'intermediate',
        estimatedMinutes: 38,
        prerequisites: ['DEVOPS-DOCKER-FUNDAMENTALS', 'BACKEND-TESTING'],
        unlocks: ['FULLSTACK-DEPLOYMENT-PIPELINE', 'DEVOPS-KUBERNETES-FUNDAMENTALS'],
        related: ['DEVOPS-GITHUB-ACTIONS-CI'],
        careers: [C.be, C.devops],
        tags: ['docker', 'deploy', 'backend'],
        sources: ['DOCKER-GET-STARTED'],
      },
      body: `
## Why containers standardize runtime

“Works on my machine” becomes “runs the same image.” Ops and app teams share a contract: port, env, health endpoint.

## Mental model

<Callout type="mental-model">
  Build a lean image, configure via env, process logs to stdout, expose a health check, shut down on SIGTERM gracefully.
</Callout>

\`\`\`dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm i --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["node", "dist/main.js"]
\`\`\`

(Adjust to your package manager and build output.)

${commonFooter({
  mistakes: [
    { title: 'Baking secrets into images', detail: 'Use runtime secrets.' },
    { title: 'Running as root unnecessarily', detail: 'Reduce blast radius.' },
    { title: 'No graceful shutdown', detail: 'In-flight requests die on deploy.' },
  ],
  interview:
    'Describe a production-ready Dockerfile and how you pass DATABASE_URL securely.',
  practice: [
    'Dockerize a sample API.',
    'Add a /health endpoint.',
    'Handle SIGTERM in Node.',
  ],
  sourceIds: ['DOCKER-GET-STARTED'],
})}
`,
    },
    {
      slug: 'backend-security-basics',
      meta: {
        id: 'BACKEND-SECURITY-BASICS',
        title: 'Backend Security Basics',
        titleBn: 'ব্যাকএন্ড সিকিউরিটি বেসিক',
        description:
          'Input validation, authz, headers, rate limits, and dependency hygiene for APIs.',
        descriptionBn:
          'API-এর জন্য ইনপুট ভ্যালিডেশন, অথরাইজেশন, হেডার, রেট লিমিট ও ডিপেন্ডেন্সি হাইজিন।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-SECURITY-FUNDAMENTALS', 'BACKEND-HTTP-REST-API-DESIGN'],
        unlocks: ['FULLSTACK-AUTH-ACROSS-STACK'],
        related: ['BACKEND-NESTJS-AUTH-JWT', 'OWASP-TOP10'],
        careers: [C.be, C.fs, C.devops],
        tags: ['security', 'backend', 'owasp'],
        sources: ['OWASP-TOP10', 'NESTJS-AUTH'],
      },
      body: `
## Why backends are the real gate

Browsers lie. Mobile apps get reverse engineered. Authorization and validation must be enforced server-side—every time.

## Mental model

<Callout type="mental-model">
  Authenticate identity, authorize action on resource, validate input, minimize data returned, rate-limit abuse, observe anomalies.
</Callout>

Checklist: parameterized SQL, CSRF strategy for cookie sessions, security headers behind your proxy, least-privilege DB roles, secret rotation.

${commonFooter({
  mistakes: [
    { title: 'IDOR (ignore object ownership)', detail: 'Check resource belongs to caller.' },
    { title: 'Verbose prod errors', detail: 'Leak stack traces and schema hints.' },
    { title: 'Admin endpoints without audit logs', detail: 'You cannot investigate incidents.' },
  ],
  interview:
    'Explain IDOR and how you would prevent it in a NestJS topics API.',
  practice: [
    'Add ownership checks to an update endpoint.',
    'Rate-limit login attempts.',
    'Run a dependency audit in CI.',
  ],
  sourceIds: ['OWASP-TOP10', 'NESTJS-AUTH'],
})}
`,
    },
  ];

  for (const t of topics) {
    t.meta.related = (t.meta.related || []).filter((id) => !['NEXTJS-AUTH', 'OWASP-TOP10'].includes(id));
  }

  return topics.map((t) => writeTopic('backend', t.slug, t.meta, t.body));
}
