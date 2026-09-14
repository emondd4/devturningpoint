import { writeTopic, commonFooter } from './topic-helpers.mjs';

const C = {
  se: 'CAREER-SOFTWARE-ENGINEER',
  fe: 'CAREER-FRONTEND-ENGINEER',
  be: 'CAREER-BACKEND-ENGINEER',
  mobile: 'CAREER-MOBILE-ENGINEER',
  devops: 'CAREER-DEVOPS-ENGINEER',
  qa: 'CAREER-QA-ENGINEER',
  fs: 'CAREER-FULLSTACK-ENGINEER',
};

export function generateFoundations() {
  const topics = [
    {
      slug: 'binary-bits-bytes',
      meta: {
        id: 'FOUNDATIONS-BINARY-BITS-BYTES',
        title: 'Binary, Bits, and Bytes',
        titleBn: 'বাইনারি, বিট ও বাইট',
        description:
          'Why computers use binary, how bits compose bytes, and how that maps to numbers, text, and memory sizes.',
        descriptionBn:
          'কম্পিউটার কেন বাইনারি ব্যবহার করে, বিট থেকে বাইট কীভাবে তৈরি হয়, এবং সংখ্যা·টেক্সট·মেমোরি সাইজে তার মানে কী।',
        difficulty: 'beginner',
        estimatedMinutes: 28,
        prerequisites: [],
        unlocks: ['FOUNDATIONS-CPU-MEMORY-STORAGE', 'FOUNDATIONS-NETWORKING-TCP-IP-HTTP'],
        related: ['FOUNDATIONS-OS-PROCESSES-MEMORY', 'FOUNDATIONS-SECURITY-FUNDAMENTALS'],
        careers: [C.se, C.be, C.devops],
        tags: ['binary', 'bits', 'bytes', 'encoding', 'foundations'],
        sources: ['TC39-ECMASCRIPT'],
      },
      body: `
## Why this matters before tools

Every file, network packet, and variable ultimately becomes a pattern of **on/off states**. If you skip this mental model, later topics (memory, networking, encryption, image formats) feel like magic words instead of engineering tradeoffs.

## Mental model

<Callout type="mental-model">
  Think of a bit as a light switch. One switch → 2 states. Two switches → 4 states. Eight switches (a byte) → 256 states. Programs invent *meanings* for those states: numbers, letters, colors, instructions.
</Callout>

### Powers of two (the vocabulary of size)

| Bits | Distinct values | Common name |
| --- | --- | --- |
| 1 | 2 | bit |
| 8 | 256 | byte |
| 10 | 1024 | often “about a kilobyte of addresses” in older talk |
| 16 | 65,536 | often \`uint16\` range |
| 32 | ~4.3 billion | classic \`uint32\` / IPv4 address space |
| 64 | enormous | modern pointers / \`bigint\` territory |

Memory and disk marketing uses **KB/MB/GB** (decimal powers of 1000) while engineers often think in **KiB/MiB/GiB** (powers of 1024). Ambiguity causes real bugs in capacity planning.

## From switches to numbers

Unsigned integers are the simplest mapping: interpret the bit pattern as base-2.

\`\`\`js
// 0b prefix = binary literal in JavaScript
const n = 0b1101; // 13 in decimal
console.log(n); // 13
console.log(n.toString(2)); // "1101"
console.log((255).toString(16)); // "ff" — hex is shorthand for nibbles (4 bits)
\`\`\`

Two’s complement (how signed integers work on almost all CPUs) is the reason \`-1\` is “all bits 1” in a fixed width—useful when debugging overflow and casting.

## Text is also bits

ASCII maps bytes to characters for English-centric history. **UTF-8** maps Unicode code points to 1–4 bytes so Bangla, emoji, and Latin share one encoding.

\`\`\`js
const text = 'বাংলা';
const bytes = new TextEncoder().encode(text);
console.log(bytes); // Uint8Array of UTF-8 bytes
console.log(new TextDecoder().decode(bytes));
\`\`\`

<Callout type="warning">
  Never assume “one character = one byte.” Bangla graphemes and emoji can be multiple code points and multiple UTF-8 bytes.
</Callout>

## Units you will see every week

- **Bandwidth**: bits per second (Mbps) on ISP plans vs **bytes per second** in download UIs.
- **Memory**: process RSS in MiB; container limits in MiB/GiB.
- **Hashes**: SHA-256 output is 256 **bits** (32 bytes), often shown as 64 hex characters.

${commonFooter({
  mistakes: [
    {
      title: 'Confusing bits and bytes',
      detail: 'A “100 Mbps” link is ~12.5 MB/s in ideal conditions, not 100 MB/s.',
    },
    {
      title: 'Assuming ASCII everywhere',
      detail: 'Bangla and emoji break naive length/substring logic based on bytes.',
    },
    {
      title: 'Ignoring endianness',
      detail: 'Multi-byte integers on the wire need an agreed byte order (network byte order is big-endian).',
    },
  ],
  interview:
    'Explain why UTF-8 is variable-width and how you would safely truncate a user-visible string without cutting a multi-byte character in half.',
  practice: [
    'Convert a few decimals to binary and hex by hand, then verify with code.',
    'Encode a Bangla sentence to UTF-8 and count bytes vs code points.',
    'Read a file size in bytes and express it in MiB and MB.',
  ],
  sourceIds: ['TC39-ECMASCRIPT'],
})}
`,
    },
    {
      slug: 'cpu-memory-storage',
      meta: {
        id: 'FOUNDATIONS-CPU-MEMORY-STORAGE',
        title: 'CPU, Memory, and Storage',
        titleBn: 'সিপিইউ, মেমোরি ও স্টোরেজ',
        description:
          'A practical hierarchy of compute and data locality: CPU caches, RAM, SSD/HDD, and why latency dominates design.',
        descriptionBn:
          'কম্পিউট ও ডেটা লোক্যালিটির ব্যবহারিক স্তর: CPU ক্যাশ, RAM, SSD/HDD—এবং ল্যাটেন্সি কেন ডিজাইন নির্ধারণ করে।',
        difficulty: 'beginner',
        estimatedMinutes: 32,
        prerequisites: ['FOUNDATIONS-BINARY-BITS-BYTES'],
        unlocks: ['FOUNDATIONS-OS-PROCESSES-MEMORY', 'FOUNDATIONS-ALGORITHMS-COMPLEXITY'],
        related: ['DEVOPS-LINUX-FUNDAMENTALS', 'FOUNDATIONS-DATA-STRUCTURES-INTRO'],
        careers: [C.se, C.be, C.devops],
        tags: ['cpu', 'memory', 'storage', 'latency', 'foundations'],
        sources: ['LINUX-MAN-PAGES'],
      },
      body: `
## Why hierarchy beats “just buy more RAM”

Programs feel fast or slow because of **where data lives** when the CPU needs it. Algorithms that look “O(n)” on paper can thrash caches and lose to a tighter “worse” algorithm that stays hot in L1.

## Mental model: distance to data

<Callout type="mental-model">
  Imagine the CPU as a chef. Registers are ingredients in hand. L1/L2 cache is the counter. RAM is the pantry. SSD is the garage freezer. Network storage is a store across town. Cooking (compute) is cheap compared to walking.
</Callout>

### Rough latency intuition (orders of magnitude)

You do not need exact nanoseconds memorized—you need the **gaps**:

1. Register / L1: essentially free relative to everything else
2. Main memory (DRAM): hundreds of times slower than L1
3. NVMe SSD: thousands of times slower than RAM
4. Spinning disk / cold cloud object storage: another huge jump
5. Cross-region network: human-perceptible

## What the CPU actually does

Fetch instruction → decode → execute → (maybe) read/write memory. Modern CPUs pipeline and speculate, but your mental model can stay: **instruction stream + data accesses**.

Branch-heavy code and random memory access fight the hardware’s preferences (predictable branches, sequential scans).

## Memory vs storage

| Layer | Volatile? | Typical role |
| --- | --- | --- |
| Registers / caches | yes | speed |
| RAM | yes | working set |
| SSD/HDD | no | persistence |
| Object storage | no | durability / archives |

Persistence requires writing past RAM. Databases carefully order writes (WAL, fsync) because “saved in memory” is not “safe on disk.”

## Practical engineering consequences

- Prefer sequential scans and batching over pointer-chasing when datasets are large.
- Keep hot paths allocation-light.
- Measure before blaming the language—often the bottleneck is I/O or chatty RPCs.

\`\`\`bash
# Linux: quick peek at memory pressure (read man pages for fields)
free -h
# Rough CPU / run-queue sense
uptime
\`\`\`

${commonFooter({
  mistakes: [
    {
      title: 'Equating core count with speed',
      detail: 'Extra cores help parallel work; single-thread latency still matters for many APIs.',
    },
    {
      title: 'Treating SSD like RAM',
      detail: 'Persisting every keystroke or chatty fsync patterns destroy throughput.',
    },
    {
      title: 'Ignoring locality in data structures',
      detail: 'Linked lists look elegant but can be cache-hostile compared to arrays.',
    },
  ],
  interview:
    'Walk through why adding an in-memory cache can make a service faster yet introduce consistency bugs—and when you would still do it.',
  practice: [
    'Sketch the storage hierarchy for a mobile app offline cache.',
    'Compare reading 100MB sequentially vs many tiny random reads (conceptually).',
    'Explain volatile vs durable storage to a non-engineer in one minute.',
  ],
  sourceIds: ['LINUX-MAN-PAGES'],
})}
`,
    },
    {
      slug: 'programming-variables-control-flow',
      meta: {
        id: 'FOUNDATIONS-PROGRAMMING-VARIABLES',
        title: 'Variables, Types, and Control Flow',
        titleBn: 'ভেরিয়েবল, টাইপ ও কন্ট্রোল ফ্লো',
        description:
          'Names, values, branching, and loops—the grammar every language shares, with JavaScript examples.',
        descriptionBn:
          'নাম, মান, শাখা ও লুপ—প্রতিটি ভাষার সাধারণ ব্যাকরণ; JavaScript উদাহরণসহ।',
        difficulty: 'beginner',
        estimatedMinutes: 30,
        prerequisites: ['FOUNDATIONS-BINARY-BITS-BYTES'],
        unlocks: ['FOUNDATIONS-DATA-STRUCTURES-INTRO', 'FRONTEND-JAVASCRIPT-FUNDAMENTALS'],
        related: ['FOUNDATIONS-ALGORITHMS-COMPLEXITY', 'FLUTTER-DART-FUNDAMENTALS'],
        careers: [C.se, C.fe, C.be, C.mobile],
        tags: ['programming', 'variables', 'control-flow', 'foundations'],
        sources: ['MDN-JS-EVENT-LOOP', 'TC39-ECMASCRIPT'],
      },
      body: `
## Why “variables” are not just boxes

A variable is a **binding**: a name that refers to a value (or to a mutable storage location, depending on language rules). Bugs often come from misunderstanding *what* is shared when you assign or pass data.

## Mental model

<Callout type="mental-model">
  Expressions produce values. Statements do work (assign, branch, loop, return). Control flow is the road network those statements travel—straight lines, forks (\`if\`), and roundabouts (\`for\`/\`while\`).
</Callout>

## Bindings in JavaScript

\`\`\`js
const pi = 3.14159; // binding cannot be reassigned
let count = 0; // reassignable
count += 1;

// Primitive values are copied by value
let a = 1;
let b = a;
b = 2;
console.log(a); // 1

// Objects are references to shared heap values
const user = { name: 'Nila' };
const alias = user;
alias.name = 'Rafi';
console.log(user.name); // "Rafi"
\`\`\`

## Control flow patterns

\`\`\`js
function grade(score) {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  return 'C';
}

const nums = [1, 2, 3];
let sum = 0;
for (const n of nums) sum += n;

// Prefer early returns over deep nesting
function canPublish(post, user) {
  if (!user) return false;
  if (!post.title) return false;
  return user.role === 'editor' || post.authorId === user.id;
}
\`\`\`

<Callout type="tip">
  Readable control flow beats clever one-liners in production. Interviewers notice clear branching more than golfed code.
</Callout>

## Truthiness and equality traps

\`\`\`js
console.log(0 == false); // true (avoid)
console.log(0 === false); // false (prefer)
console.log('' || 'fallback'); // "fallback"
\`\`\`

${commonFooter({
  mistakes: [
    {
      title: 'Mutating shared objects unintentionally',
      detail: 'Passing an object into a function and modifying it surprises callers.',
    },
    {
      title: 'Deeply nested if/else',
      detail: 'Use guard clauses; nested pyramids hide bugs.',
    },
    {
      title: 'Using == in JS',
      detail: 'Coercion makes equality surprising; default to ===.',
    },
  ],
  interview:
    'Explain pass-by-value vs pass-by-reference using a small code snippet, and how immutability patterns reduce bugs.',
  practice: [
    'Rewrite a nested if/else using early returns.',
    'Write a loop and an equivalent array reduce; compare readability.',
    'Trace a bug caused by shared object mutation.',
  ],
  sourceIds: ['TC39-ECMASCRIPT', 'MDN-JS-EVENT-LOOP'],
})}
`,
    },
    {
      slug: 'data-structures-intro',
      meta: {
        id: 'FOUNDATIONS-DATA-STRUCTURES-INTRO',
        title: 'Data Structures: Arrays, Maps, and Trees',
        titleBn: 'ডেটা স্ট্রাকচার: অ্যারে, ম্যাপ ও ট্রি',
        description:
          'Choose structures by access pattern: ordered lists, key lookups, and hierarchical trees.',
        descriptionBn:
          'অ্যাক্সেস প্যাটার্ন অনুযায়ী স্ট্রাকচার বাছুন: সাজানো তালিকা, কী লুকআপ, এবং শ্রেণিবিন্যাস ট্রি।',
        difficulty: 'beginner',
        estimatedMinutes: 35,
        prerequisites: ['FOUNDATIONS-PROGRAMMING-VARIABLES'],
        unlocks: ['FOUNDATIONS-ALGORITHMS-COMPLEXITY', 'DATABASE-RELATIONAL-MODELING'],
        related: ['FOUNDATIONS-SQL-FUNDAMENTALS', 'BACKEND-REDIS-CACHING'],
        careers: [C.se, C.be, C.fe],
        tags: ['data-structures', 'arrays', 'hashmaps', 'trees'],
        sources: ['TC39-ECMASCRIPT', 'REDIS-DATA-TYPES'],
      },
      body: `
## Why structure choice is a product decision

The “right” structure is the one that matches **how you query and update** data under real constraints (memory, concurrency, API shape)—not the fanciest name on a flashcard.

## Mental model

<Callout type="mental-model">
  Arrays = seats in a row (index by position). Hash maps = labeled lockers (index by key). Trees = org charts (parent/child navigation). Graphs = city maps (many-to-many links).
</Callout>

## Arrays / lists

Strengths: ordered iteration, cache-friendly contiguous storage (in many runtimes), index access \(O(1)\).

Weaknesses: inserting/removing at the front can be \(O(n)\); searching unsorted data is \(O(n)\).

\`\`\`js
const ids = [10, 20, 30];
ids.push(40); // amortised O(1) at end
ids.includes(20); // O(n)
\`\`\`

## Hash maps / dictionaries

Strengths: average \(O(1)\) get/set by key.

Weaknesses: no inherent order (unless insertion-ordered like JS \`Map\`); poor for range queries; memory overhead.

\`\`\`js
const sessions = new Map();
sessions.set('user:42', { exp: Date.now() + 3600_000 });
console.log(sessions.get('user:42'));
\`\`\`

## Trees

Use when hierarchy matters: file systems, UI widget trees, DOM, org data, indexes (B-trees in databases).

\`\`\`js
const nav = {
  title: 'Docs',
  children: [
    { title: 'Foundations', children: [] },
    { title: 'Frontend', children: [{ title: 'React', children: [] }] },
  ],
};
\`\`\`

## Selection cheat sheet

| Need | Reach for |
| --- | --- |
| Ordered collection, scan often | Array |
| Frequent lookup by id | Hash map |
| Hierarchy / nested docs | Tree |
| FIFO jobs | Queue |
| Undo stack | Stack |
| Unique membership tests | Set |

${commonFooter({
  mistakes: [
    {
      title: 'Using arrays for hot key lookups',
      detail: 'Repeated \`find\` on large arrays becomes a latency bug; use a Map.',
    },
    {
      title: 'Over-normalizing in memory',
      detail: 'Deep trees of tiny objects can hurt locality; sometimes a flat table is faster.',
    },
    {
      title: 'Ignoring uniqueness needs',
      detail: 'Sets prevent duplicate work; arrays silently accumulate dupes.',
    },
  ],
  interview:
    'Given a feed of events keyed by userId, which structure would you use to count events per user in one pass—and why?',
  practice: [
    'Implement frequency counting with Map.',
    'Model a simple file tree and write a recursive print.',
    'Compare array \`includes\` vs Set \`has\` for membership.',
  ],
  sourceIds: ['TC39-ECMASCRIPT', 'REDIS-DATA-TYPES'],
})}
`,
    },
    {
      slug: 'algorithms-complexity',
      meta: {
        id: 'FOUNDATIONS-ALGORITHMS-COMPLEXITY',
        title: 'Algorithms and Complexity (Big O)',
        titleBn: 'অ্যালগরিদম ও কমপ্লেক্সিটি (Big O)',
        description:
          'Estimate how runtime and memory grow so you can predict scaling before production surprises you.',
        descriptionBn:
          'রানটাইম ও মেমোরি কীভাবে বাড়ে তা অনুমান করুন—প্রোডাকশন সারপ্রাইজের আগে স্কেলিং বোঝার জন্য।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-DATA-STRUCTURES-INTRO', 'FOUNDATIONS-CPU-MEMORY-STORAGE'],
        unlocks: ['DATABASE-SQL-JOINS-AGGREGATION', 'DATABASE-POSTGRESQL-INDEXING'],
        related: ['FOUNDATIONS-SQL-FUNDAMENTALS', 'BACKEND-REDIS-CACHING'],
        careers: [C.se, C.be, C.fe],
        tags: ['algorithms', 'big-o', 'complexity', 'performance'],
        sources: ['POSTGRES-INDEXES'],
      },
      body: `
## Why Big O is a communication tool

Complexity notation is how engineers say: “this will hurt at 10× data.” It is not a micro-benchmark replacement—it is a **scaling language**.

## Mental model

<Callout type="mental-model">
  Big O ignores constants and lower-order terms to spotlight growth shape: flat, linear, quadratic, logarithmic. Ask: if input size doubles, does work stay ~same, double, or square?
</Callout>

### Common families

| Class | Name | Intuition |
| --- | --- | --- |
| \(O(1)\) | constant | map lookup, array index |
| \(O(\\log n)\) | logarithmic | binary search, balanced tree height |
| \(O(n)\) | linear | single scan |
| \(O(n \\log n)\) | linearithmic | efficient comparison sorts |
| \(O(n^2)\) | quadratic | nested loops over n |
| \(O(2^n)\) | exponential | naive subsets / some recursions |

## Worked examples

\`\`\`js
// O(n)
function sum(arr) {
  let s = 0;
  for (const x of arr) s += x;
  return s;
}

// O(n^2) — nested scan
function hasDuplicateNaive(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// Average O(n) time, O(n) extra memory
function hasDuplicateSet(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
\`\`\`

## Complexity in databases and APIs

- Full table scan ≈ \(O(n)\) rows examined.
- Indexed point lookup can approach \(O(\\log n)\) I/O.
- Chatty N+1 HTTP calls are often worse than a slightly heavier single query.

<Callout type="warning">
  An \(O(n)\) algorithm with huge constants or disk I/O can lose to an \(O(n \\log n)\) in-memory approach. Measure when stakes are real.
</Callout>

${commonFooter({
  mistakes: [
    {
      title: 'Memorizing without access patterns',
      detail: 'Know *why* a hash set helps membership tests.',
    },
    {
      title: 'Ignoring space complexity',
      detail: 'Caching everything is O(n) memory that can OOM a container.',
    },
    {
      title: 'Premature micro-optimization',
      detail: 'Fix algorithmic cliffs and I/O first.',
    },
  ],
  interview:
    'Given two nested loops filtering users then posts, estimate complexity and propose a better approach with maps or a join.',
  practice: [
    'Classify three of your own functions by Big O.',
    'Replace a nested search with a Set and compare clarity.',
    'Explain N+1 queries as a complexity problem.',
  ],
  sourceIds: ['POSTGRES-INDEXES'],
})}
`,
    },
    {
      slug: 'git-fundamentals',
      meta: {
        id: 'FOUNDATIONS-GIT-FUNDAMENTALS',
        title: 'Git Fundamentals',
        titleBn: 'Git এর মৌলিক ধারণা',
        description:
          'Snapshots, branches, and collaboration workflows—why Git models history the way it does.',
        descriptionBn:
          'স্ন্যাপশট, ব্রাঞ্চ ও সহযোগিতার ওয়ার্কফ্লো—Git ইতিহাসকে যেভাবে মডেল করে তার কারণ।',
        difficulty: 'beginner',
        estimatedMinutes: 35,
        prerequisites: ['FOUNDATIONS-PROGRAMMING-VARIABLES'],
        unlocks: ['DEVOPS-GITHUB-ACTIONS-CI', 'FULLSTACK-DEPLOYMENT-PIPELINE'],
        related: ['DEVOPS-LINUX-FUNDAMENTALS', 'PM-SOFTWARE-DELIVERY'],
        careers: [C.se, C.fe, C.be, C.devops, C.mobile],
        tags: ['git', 'version-control', 'collaboration'],
        sources: ['GIT-SCM-BOOK'],
      },
      body: `
## Why version control is a team prosthetic

Git is not “save with extras.” It is a **content-addressed history graph** that lets many people experiment safely and reconstruct how code evolved.

## Mental model

<Callout type="mental-model">
  Commits are snapshots of the project (via trees of files), linked to parents. A branch is a movable pointer to a commit. \`HEAD\` is “where I am now.”
</Callout>

## Daily loop

\`\`\`bash
git status
git add path/to/file
git commit -m "Explain why this change exists"
git push -u origin HEAD
\`\`\`

Write commit messages for future readers: **why**, not a restatement of the diff.

## Branching without fear

\`\`\`bash
git switch -c feature/topic-page
# ...work...
git switch main
git merge feature/topic-page
\`\`\`

Prefer small branches. Huge long-lived branches increase merge pain and review fatigue.

## Undoing safely

| Goal | Prefer |
| --- | --- |
| Unstage a file | \`git restore --staged <file>\` |
| Discard local uncommitted changes | \`git restore <file>\` (destructive) |
| New commit that reverses a published commit | \`git revert <sha>\` |
| Rewrite local-only history | \`git reset\` (never rewrite shared main casually) |

<Callout type="danger">
  Force-pushing rewritten history on shared branches breaks collaborators. Treat \`main\` as append-only unless the team explicitly agrees otherwise.
</Callout>

${commonFooter({
  mistakes: [
    {
      title: 'Giant opaque commits',
      detail: 'Reviewers cannot reason about risk; bisect becomes useless.',
    },
    {
      title: 'Committing secrets',
      detail: 'Rotate keys immediately; use ignore rules and secret scanning.',
    },
    {
      title: 'Merging without reading the diff',
      detail: 'Conflicts marked “resolved” can still be logically wrong.',
    },
  ],
  interview:
    'Describe the difference between merge and rebase, and when you would avoid rebasing a shared branch.',
  practice: [
    'Create a branch, commit twice, open a PR mentally (review your own diff).',
    'Practice \`git revert\` on a throwaway repo.',
    'Read Pro Git chapter on branching and sketch the graph.',
  ],
  sourceIds: ['GIT-SCM-BOOK'],
})}
`,
    },
    {
      slug: 'networking-tcp-ip-http',
      meta: {
        id: 'FOUNDATIONS-NETWORKING-TCP-IP-HTTP',
        title: 'Networking: TCP/IP and HTTP',
        titleBn: 'নেটওয়ার্কিং: TCP/IP ও HTTP',
        description:
          'Packets, reliable transport, and request/response web semantics—the backbone of every API.',
        descriptionBn:
          'প্যাকেট, নির্ভরযোগ্য ট্রান্সপোর্ট, এবং ওয়েবের রিকোয়েস্ট/রেসপন্স সেমantics—প্রতিটি API-এর ভিত্তি।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-BINARY-BITS-BYTES'],
        unlocks: ['BACKEND-HTTP-REST-API-DESIGN', 'DEVOPS-NETWORKING-FOR-DEVOPS', 'FLUTTER-NETWORKING-REST'],
        related: ['FOUNDATIONS-SECURITY-FUNDAMENTALS', 'DEVOPS-NGINX-REVERSE-PROXY'],
        careers: [C.se, C.be, C.devops, C.fe],
        tags: ['networking', 'tcp', 'http', 'ip'],
        sources: ['RFC-791-IPV4', 'RFC-9293-TCP', 'RFC-9110-HTTP'],
      },
      body: `
## Why layers exist

Networking problems are unbearable as one blob. Layers let you reason: addressing (IP), reliable streams (TCP), application messages (HTTP).

## Mental model

<Callout type="mental-model">
  IP delivers packets toward a destination (best-effort). TCP turns that into a reliable, ordered byte stream with connections. HTTP speaks request/response *messages* on top (often over TLS).
</Callout>

## IP and ports

- **IP address**: which host (roughly).
- **Port**: which process/service on that host.
- Together: a socket endpoint.

IPv4 space exhaustion drove NAT and IPv6 adoption; as a developer you mostly care that clients and servers agree on reachability and DNS.

## TCP essentials

TCP provides: connection handshake, retransmission, ordering, flow control. Cost: state, latency for handshake (mitigated by TLS session resumption, HTTP/2+/QUIC ecosystem—learn HTTP/1.1 first).

## HTTP mental checklist

\`\`\`http
GET /topics/foundations/git-fundamentals HTTP/1.1
Host: example.com
Accept: text/html
\`\`\`

- **Method**: intent (safe methods like GET should not change server state).
- **Status**: 2xx success, 4xx client issue, 5xx server issue.
- **Headers**: metadata (auth, caching, content type).
- **Body**: optional payload.

\`\`\`js
const res = await fetch('https://httpbin.org/get');
console.log(res.status);
console.log(res.headers.get('content-type'));
const data = await res.json();
\`\`\`

<Callout type="tip">
  When debugging “API down,” separate DNS failure, TCP connect timeout, TLS errors, and HTTP 5xx—they are different layers.
</Callout>

${commonFooter({
  mistakes: [
    {
      title: 'Treating HTTP status as optional',
      detail: 'Clients must branch on status; “always 200 with error in JSON” hides outages from monitors.',
    },
    {
      title: 'Putting secrets in query strings',
      detail: 'URLs leak via logs and Referer; use headers or body over TLS.',
    },
    {
      title: 'Ignoring idempotency',
      detail: 'Retries on non-idempotent POSTs create duplicate orders.',
    },
  ],
  interview:
    'Explain what happens after you type a URL until HTML renders—at least DNS, TCP, TLS, HTTP, and rendering at a high level.',
  practice: [
    'Use browser DevTools Network panel to inspect status, timing, headers.',
    'curl an API and change method/headers deliberately.',
    'Map a failure to the correct layer.',
  ],
  sourceIds: ['RFC-791-IPV4', 'RFC-9293-TCP', 'RFC-9110-HTTP'],
})}
`,
    },
    {
      slug: 'sql-fundamentals',
      meta: {
        id: 'FOUNDATIONS-SQL-FUNDAMENTALS',
        title: 'SQL Fundamentals',
        titleBn: 'SQL এর মৌলিক বিষয়',
        description:
          'Relational tables, SELECT/WHERE/JOIN basics, and why SQL remains the shared language of data.',
        descriptionBn:
          'রিলেশনাল টেবিল, SELECT/WHERE/JOIN বেসিক, এবং ডেটার ভাষা হিসেবে SQL কেন টিকে আছে।',
        difficulty: 'beginner',
        estimatedMinutes: 35,
        prerequisites: ['FOUNDATIONS-DATA-STRUCTURES-INTRO'],
        unlocks: ['DATABASE-RELATIONAL-MODELING', 'DATABASE-SQL-JOINS-AGGREGATION', 'BACKEND-POSTGRESQL-WITH-BACKEND'],
        related: ['FOUNDATIONS-ALGORITHMS-COMPLEXITY', 'DATABASE-POSTGRESQL-TRANSACTIONS'],
        careers: [C.se, C.be, C.fs],
        tags: ['sql', 'databases', 'relational'],
        sources: ['POSTGRES-DOCS'],
      },
      body: `
## Why SQL survives every framework fashion

SQL describes **what** data you want; the database decides **how** (indexes, join order). That separation is why ORMs still speak SQL underneath.

## Mental model

<Callout type="mental-model">
  Tables are relations (sets of rows with named columns). A query builds a new relation from old ones via filter, project, join, and aggregate.
</Callout>

## Core verbs

\`\`\`sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO users (email) VALUES ('learner@example.com');

SELECT id, email
FROM users
WHERE email LIKE '%@example.com'
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

## Join as “match rows”

\`\`\`sql
SELECT u.email, p.title
FROM users u
JOIN posts p ON p.author_id = u.id
WHERE u.id = 42;
\`\`\`

Inner join keeps matches; left join keeps all left rows even without matches (padding with NULL).

## NULL is not zero

\`\`\`sql
-- Unknown propagates; use IS NULL, not = NULL
SELECT * FROM users WHERE deleted_at IS NULL;
\`\`\`

${commonFooter({
  mistakes: [
    {
      title: 'SELECT * in APIs',
      detail: 'Over-fetches data, couples clients to schema churn, and can leak columns.',
    },
    {
      title: 'Filtering in application after fetching everything',
      detail: 'Push predicates to SQL so indexes can help.',
    },
    {
      title: 'String-building SQL with user input',
      detail: 'Use parameterized queries to prevent injection.',
    },
  ],
  interview:
    'Write a query for “users who placed more than 3 orders in the last 30 days” and discuss indexes you would consider.',
  practice: [
    'Create two tables and join them.',
    'Rewrite a loop-of-queries idea as one SQL statement.',
    'Practice parameterized queries in your language of choice.',
  ],
  sourceIds: ['POSTGRES-DOCS'],
})}
`,
    },
    {
      slug: 'security-fundamentals',
      meta: {
        id: 'FOUNDATIONS-SECURITY-FUNDAMENTALS',
        title: 'Security Fundamentals',
        titleBn: 'সিকিউরিটির মৌলিক ধারণা',
        description:
          'Threats, trust boundaries, and OWASP-aligned habits every developer needs before shipping features.',
        descriptionBn:
          'হুমকি, ট্রাস্ট বাউন্ডারি, এবং ফিচার শিপের আগে প্রতিটি ডেভেলপারের OWASP-সংশ্লিষ্ট অভ্যাস।',
        difficulty: 'intermediate',
        estimatedMinutes: 38,
        prerequisites: ['FOUNDATIONS-NETWORKING-TCP-IP-HTTP', 'FOUNDATIONS-PROGRAMMING-VARIABLES'],
        unlocks: ['BACKEND-SECURITY-BASICS', 'BACKEND-NESTJS-AUTH-JWT', 'FULLSTACK-AUTH-ACROSS-STACK'],
        related: ['FOUNDATIONS-SQL-FUNDAMENTALS', 'BACKEND-SECURITY-BASICS'],
        careers: [C.se, C.be, C.devops, C.fe],
        tags: ['security', 'owasp', 'auth', 'fundamentals'],
        sources: ['OWASP-TOP10', 'RFC-9110-HTTP'],
      },
      body: `
## Why security is a design constraint, not a plugin

Attackers automate. Your app’s **trust boundaries**—browser, API, database, admin tools—must assume hostile input and limited privilege.

## Mental model

<Callout type="mental-model">
  Security is reducing expected loss: identify assets, threats, and controls. Perfect safety is impossible; intentional tradeoffs are mandatory.
</Callout>

## Starter controls mapped to common failures

| Risk theme | Habit |
| --- | --- |
| Injection | Parameterize SQL; sanitize HTML carefully; avoid \`eval\` |
| Broken auth | Hash passwords (modern KDF); short-lived sessions/tokens; MFA where needed |
| XSS | Encode output; Content-Security-Policy; framework safe defaults |
| CSRF | SameSite cookies; anti-CSRF tokens for cookie sessions |
| Misconfig | No default secrets; least privilege IAM; turn off debug in prod |
| Vulnerable deps | Lockfiles + audits + timely upgrades |

## Secrets handling

- Never commit API keys; use environment / secret managers.
- Scope keys; rotate on leak.
- Log carefully—tokens in logs are breaches.

\`\`\`js
// Parameterized query shape (library-specific APIs vary)
// db.query('SELECT id FROM users WHERE email = $1', [email]);
\`\`\`

<Callout type="danger">
  “We only store JWTs in localStorage” is a common XSS-amplified account takeover pattern for SPAs. Prefer httpOnly secure cookies or hardened BFF patterns when possible.
</Callout>

${commonFooter({
  mistakes: [
    {
      title: 'Security through obscurity',
      detail: 'Hidden admin URLs are not authz.',
    },
    {
      title: 'Rolling your own crypto',
      detail: 'Use vetted libraries and protocols.',
    },
    {
      title: 'All-powerful service accounts',
      detail: 'Breach blast radius becomes the whole company.',
    },
  ],
  interview:
    'Pick one OWASP Top Ten risk and explain a concrete prevention in a NestJS or Next.js app you have built.',
  practice: [
    'Threat-model a login form on a whiteboard.',
    'Check a personal project for secrets in git history.',
    'Enable dependency auditing in CI.',
  ],
  sourceIds: ['OWASP-TOP10', 'RFC-9110-HTTP'],
})}
`,
    },
    {
      slug: 'os-processes-memory',
      meta: {
        id: 'FOUNDATIONS-OS-PROCESSES-MEMORY',
        title: 'OS Processes and Memory',
        titleBn: 'অপারেটিং সিস্টেম: প্রসেস ও মেমোরি',
        description:
          'How operating systems isolate programs, schedule CPU time, and virtualize memory.',
        descriptionBn:
          'অপারেটিং সিস্টেম কীভাবে প্রোগ্রাম আলাদা রাখে, CPU সময় শিডিউল করে, এবং মেমোরি ভার্চুয়ালাইজ করে।',
        difficulty: 'intermediate',
        estimatedMinutes: 36,
        prerequisites: ['FOUNDATIONS-CPU-MEMORY-STORAGE'],
        unlocks: ['DEVOPS-LINUX-FUNDAMENTALS', 'DEVOPS-DOCKER-FUNDAMENTALS', 'BACKEND-NODE-RUNTIME-EVENT-LOOP'],
        related: ['FOUNDATIONS-SECURITY-FUNDAMENTALS', 'DEVOPS-KUBERNETES-FUNDAMENTALS'],
        careers: [C.se, C.devops, C.be],
        tags: ['os', 'processes', 'memory', 'linux'],
        sources: ['LINUX-MAN-PAGES'],
      },
      body: `
## Why OS concepts unlock Docker and production debugging

Containers, process managers, and “why is my Node service OOMKilled?” all sit on **process isolation + virtual memory**.

## Mental model

<Callout type="mental-model">
  A process is a running program with its own address space and resources. Threads share that address space. The kernel schedules CPU time and enforces isolation.
</Callout>

## Processes vs threads

- **Process**: strong isolation, separate memory (usually), costlier to start.
- **Thread**: shared memory, cheaper context, needs synchronization.

Node.js is often one main thread + worker pool for some I/O/CPU tasks—event loop details come later.

## Virtual memory (developer view)

Each process sees a private virtual address space. The kernel maps pages to physical RAM or swap. Page faults and thrashing explain sudden freezes under memory pressure.

## Useful Linux observables

\`\`\`bash
ps aux | head
# memory / cpu top-ish views
# (tooling varies: top, htop, ps)
kill -TERM <pid>   # graceful first
\`\`\`

Signals (\`SIGTERM\`, \`SIGKILL\`) matter for graceful shutdown in containers.

${commonFooter({
  mistakes: [
    {
      title: 'Assuming kill -9 is normal shutdown',
      detail: 'SIGKILL skips cleanup; prefer TERM with a timeout.',
    },
    {
      title: 'Ignoring memory limits in containers',
      detail: 'Apps that “work on my laptop” die under cgroup limits.',
    },
    {
      title: 'Sharing mutable state across threads carelessly',
      detail: 'Data races are Heisenbugs.',
    },
  ],
  interview:
    'Explain what a process ID is, what happens on fork/exec at a high level, and why containers still show processes as PID 1.',
  practice: [
    'Start a process, find it with \`ps\`, send SIGTERM.',
    'Read about OOM killer behavior conceptually.',
    'Compare threads vs processes for a CPU-heavy job queue.',
  ],
  sourceIds: ['LINUX-MAN-PAGES'],
})}
`,
    },
  ];

  return topics.map((t) => writeTopic('foundations', t.slug, t.meta, t.body));
}
