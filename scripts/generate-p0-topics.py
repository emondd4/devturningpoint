#!/usr/bin/env python3
"""One-shot generator for educational MDX topics. Not part of runtime."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOPICS = ROOT / "src/content/topics"

DATE = "2026-09-14"
CONTRIB = "  - name: Dev Turning Point"


def fm(
    *,
    id: str,
    title: str,
    title_bn: str,
    description: str,
    description_bn: str,
    track: str,
    category: str,
    difficulty: str,
    minutes: int,
    prerequisites: list[str],
    recommended_before: list[str],
    unlocks: list[str],
    related: list[str],
    careers: list[str],
    tags: list[str],
    sources: list[str],
    versions: dict[str, str] | None = None,
) -> str:
    def arr(xs: list[str]) -> str:
        if not xs:
            return "[]"
        return "[" + ", ".join(xs) + "]"

    lines = [
        "---",
        f"id: {id}",
        f"title: {title}",
        f"titleBn: {title_bn}",
        f"description: {description}",
        f"descriptionBn: {description_bn}",
        f"track: {track}",
        f"category: {category}",
        f"difficulty: {difficulty}",
        f"estimatedMinutes: {minutes}",
        f"prerequisites: {arr(prerequisites)}",
        f"recommendedBefore: {arr(recommended_before)}",
        f"unlocks: {arr(unlocks)}",
        f"related: {arr(related)}",
        f"careers: {arr(careers)}",
        f"tags: {arr(tags)}",
        "status: published",
        "translationStatus: partial",
    ]
    if versions:
        lines.append("applicableVersions:")
        for k, v in versions.items():
            lines.append(f'  {k}: "{v}"')
    lines += [
        f"createdAt: {DATE}",
        f"updatedAt: {DATE}",
        f"lastVerified: {DATE}",
        f"sources: {arr(sources)}",
        "contributors:",
        CONTRIB,
        "---",
        "",
    ]
    return "\n".join(lines)


def write(rel: str, content: str) -> None:
    path = TOPICS / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        raise SystemExit(f"Refusing to overwrite existing topic: {path}")
    path.write_text(content, encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


TOPICS_SPEC: list[tuple[str, str]] = []


def add(rel: str, content: str) -> None:
    TOPICS_SPEC.append((rel, content))


# ---------------------------------------------------------------------------
# FOUNDATIONS (9)
# ---------------------------------------------------------------------------

add(
    "foundations/cpu-instruction-basics.mdx",
    fm(
        id="FOUNDATIONS-CPU",
        title="CPU and instruction basics",
        title_bn="CPU ও ইন্সট্রাকশন বেসিকস",
        description="How a CPU fetches and executes instructions, why clocks and cores matter, and how this connects to performance.",
        description_bn="CPU কীভাবে ইন্সট্রাকশন fetch ও execute করে, clock ও core কেন গুরুত্বপূর্ণ।",
        track="foundations",
        category="computer-fundamentals",
        difficulty="beginner",
        minutes=30,
        prerequisites=["FOUNDATIONS-BINARY"],
        recommended_before=["FOUNDATIONS-BITS-BYTES"],
        unlocks=["FOUNDATIONS-MEMORY", "FOUNDATIONS-PROCESSES"],
        related=["FOUNDATIONS-STORAGE", "FOUNDATIONS-COMPLEXITY"],
        careers=["software-engineer", "devops-engineer"],
        tags=["cpu", "fundamentals", "performance"],
        sources=["LINUX-MAN-PAGES", "src-chm-silicon"],
    )
    + """## What is it?

A **CPU** (central processing unit) repeatedly does a simple loop: fetch an instruction from memory, decode it, execute it, then continue. Software is a long sequence of such instructions.

## Why does it exist?

General-purpose computers needed a programmable engine: change the instruction stream and you change behavior without rebuilding hardware. That separation—hardware that runs many programs—is why one laptop can run a browser, a compiler, and a game.

## Mental model

1. **Registers** hold a tiny amount of ultra-fast data the CPU is working on now.
2. **Program counter** points at the next instruction.
3. **Clock** paces how often the pipeline advances (reality is more nuanced with pipelining and out-of-order execution).
4. **Cores** are mostly independent execution engines sharing some caches and memory controllers.

## How software meets hardware

High-level languages compile or interpret down toward machine instructions (or bytecode that a VM turns into machine code). When you profile “CPU time,” you are measuring how long the processor spent retiring work for your process.

```bash
# Rough sense of CPU pressure on Linux/macOS-style systems
# (tool names vary; the idea is observation, not a specific flag set)
ps -o pid,pcpu,comm -p $$
```

## Real-world usage

- Web servers bound by CPU need more cores or more efficient algorithms.
- Mobile apps must respect battery: unnecessary wakeups burn joules.
- Compilers optimize instruction selection and register use so hot loops run fewer cycles.

## Common mistakes

1. Assuming more GHz always means faster software (memory waits and algorithm choice dominate).
2. Confusing “more threads” with “more useful parallelism” when work is serial.
3. Ignoring that waiting on I/O is not the same as needing a faster CPU.

## Interview angles

**Junior:** What does a CPU do with an instruction?  
**Mid:** Explain why a CPU-bound loop may not scale linearly with cores.  
**Senior:** Discuss caches, false sharing, and how locality affects throughput.

## Mini exercise

Describe one task that is CPU-bound and one that is I/O-bound. What would you measure first to tell them apart?

## Sources

- Historical and systems references for silicon and process execution (`src-chm-silicon`, Linux process tooling docs via `LINUX-MAN-PAGES`).
""",
)

add(
    "foundations/memory-hierarchy.mdx",
    fm(
        id="FOUNDATIONS-MEMORY",
        title="Memory hierarchy",
        title_bn="মেমোরি হায়ারার্কি",
        description="Why caches, RAM, and storage form a hierarchy, and how locality shapes real program performance.",
        description_bn="Cache, RAM ও storage কেন স্তরে সাজানো, এবং locality কীভাবে পারফরম্যান্স বদলায়।",
        track="foundations",
        category="computer-fundamentals",
        difficulty="beginner",
        minutes=35,
        prerequisites=["FOUNDATIONS-CPU"],
        recommended_before=[],
        unlocks=["FOUNDATIONS-STORAGE", "FOUNDATIONS-PROCESSES"],
        related=["FOUNDATIONS-COMPLEXITY", "FOUNDATIONS-DATA-STRUCTURES"],
        careers=["software-engineer", "backend-engineer"],
        tags=["memory", "cache", "performance"],
        sources=["LINUX-MAN-PAGES", "src-chm-silicon"],
    )
    + """## What is it?

**Memory hierarchy** is the layered storage system from tiny/fast (CPU registers and caches) to large/slow (RAM, SSD, network disks). Programs that respect this hierarchy feel fast; programs that thrash it feel mysteriously slow.

## Why does it exist?

Fast memory is expensive and physically limited. Engineers stack layers so the working set stays hot in cache while capacity lives cheaper farther away.

## Mental model

Think of a desk (registers/L1), a nearby shelf (L2/L3), a filing cabinet in the room (RAM), and a warehouse across town (disk). Fetching from the warehouse is correct but costly—so keep frequently used papers on the desk.

## Locality

- **Temporal locality:** recently used data is likely reused soon.
- **Spatial locality:** nearby addresses are often accessed together (arrays, sequential reads).

Data structures and access patterns that preserve locality beat “clever” algorithms that jump randomly through huge heaps.

## Real-world usage

- Database buffer pools and OS page caches exist because disk is slow relative to RAM.
- Game engines pack hot data tightly for cache friendliness.
- GC languages still pay for pointer-chasing graphs that destroy spatial locality.

## Common mistakes

1. Optimizing CPU instructions while the program is waiting on memory.
2. Assuming “more RAM” fixes algorithmic O(n²) memory access patterns.
3. Ignoring that serialization formats and object graphs can amplify cache misses.

## Interview angles

**Junior:** Why not make all memory as fast as registers?  
**Mid:** Explain cache lines and why contiguous arrays often beat linked lists for scans.  
**Senior:** Discuss NUMA, false sharing, and profiling memory stalls.

## Mini exercise

Compare scanning a large array of integers vs following a long linked list of the same integers. Which should usually be faster, and why?

## Sources

- Systems and Linux memory concepts (`LINUX-MAN-PAGES`, `src-chm-silicon`).
""",
)

add(
    "foundations/git-version-control.mdx",
    fm(
        id="FOUNDATIONS-GIT",
        title="Git version control",
        title_bn="Git ভার্সন কন্ট্রোল",
        description="Why teams need version history, how Git models commits and branches, and safe daily workflows.",
        description_bn="টিমের কেন ভার্সন হিস্ট্রি লাগে, Git-এ commit/branch মডেল, এবং নিরাপদ দৈনন্দিন ওয়ার্কফ্লো।",
        track="foundations",
        category="tooling",
        difficulty="beginner",
        minutes=40,
        prerequisites=[],
        recommended_before=["FOUNDATIONS-FILESYSTEMS"],
        unlocks=["FOUNDATIONS-DEBUGGING"],
        related=["DEVOPS-CICD", "PM-SDLC"],
        careers=["software-engineer", "devops-engineer", "qa-engineer"],
        tags=["git", "version-control"],
        sources=["GIT-SCM-BOOK"],
        versions={"git": "2.x"},
    )
    + """## What is it?

**Git** is a distributed version control system. It records snapshots (commits), lets many people work in parallel (branches), and helps integrate changes deliberately (merge/rebase/review).

## Why does it exist?

Without history, collaboration becomes “who overwrote the file?” With history, you can explain *what* changed, *why*, and *when*—and roll back when experiments fail.

## Mental model

- A **commit** points to a tree of files plus parent commit(s).
- A **branch** is a movable pointer to a commit.
- Your **working tree** is the checkout; the **index/staging area** is what will go into the next commit.

```bash
git status
git add path/to/file
git commit -m "Explain why this change exists"
git switch -c feature/short-name
```

## Safe daily habits

1. Pull/rebase onto an updated mainline before opening a PR.
2. Keep commits focused; prefer clear messages over noisy dumps.
3. Never rewrite shared history that teammates already based work on—unless the team explicitly agrees.

## Common mistakes

1. Committing secrets (`.env`, keys). Rotate immediately if it happens.
2. Giant “fix everything” commits that are impossible to review.
3. Force-pushing to shared branches without coordination.

## Interview angles

**Junior:** What is a commit? What is a branch?  
**Mid:** Compare merge and rebase; when is each appropriate?  
**Senior:** Describe trunk-based vs long-lived feature branches and how CI interacts with each.

## Mini exercise

Create a branch, make two small commits, then explain what `git log --oneline --graph` shows.

## Sources

- Pro Git / Git SCM book (`GIT-SCM-BOOK`).
""",
)

add(
    "foundations/http-fundamentals.mdx",
    fm(
        id="FOUNDATIONS-HTTP",
        title="HTTP fundamentals",
        title_bn="HTTP ফান্ডামেন্টালস",
        description="How HTTP request/response semantics work, why methods and status codes matter, and how browsers and APIs use them.",
        description_bn="HTTP request/response, method ও status code কেন গুরুত্বপূর্ণ, ব্রাউজার ও API কীভাবে ব্যবহার করে।",
        track="foundations",
        category="networking",
        difficulty="beginner",
        minutes=35,
        prerequisites=["FOUNDATIONS-TCP-IP"],
        recommended_before=["FOUNDATIONS-DNS"],
        unlocks=["FOUNDATIONS-HTTPS-TLS", "FOUNDATIONS-API-CONCEPTS"],
        related=["BACKEND-REST", "FRONTEND-JS-ASYNC"],
        careers=["software-engineer", "frontend-engineer", "backend-engineer"],
        tags=["http", "networking", "web"],
        sources=["RFC-9110-HTTP", "src-mdn-web"],
    )
    + """## What is it?

**HTTP** is an application protocol for transferring representations of resources. A client sends a **request**; a server returns a **response** with a status code and optional body.

## Why does it exist?

The web needed a simple, extensible contract: identify a resource (URL), say what you want to do (method), and get a standard outcome (status). That contract scales from fetching HTML to calling JSON APIs.

## Mental model

```http
GET /users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"id":42,"name":"Ada"}
```

- **Idempotent** methods (like GET, PUT) can be retried more safely than non-idempotent ones (like many POST uses).
- Status classes: 2xx success, 3xx redirect, 4xx client error, 5xx server error.

## Real-world usage

Browsers issue HTTP for documents, scripts, and APIs. Mobile apps and backend services speak HTTP for the same reasons: tooling, caching, proxies, and observability all understand it.

## Common mistakes

1. Using GET for state-changing operations (caches and crawlers will surprise you).
2. Returning 200 for every failure and burying errors in JSON only.
3. Ignoring caching headers and accidentally serving stale authenticated data.

## Interview angles

**Junior:** Name common methods and what 404 vs 500 means.  
**Mid:** Explain idempotency and safe methods.  
**Senior:** Discuss HTTP semantics with proxies, conditional requests, and API evolution.

## Mini exercise

Design status codes for: create user (success), duplicate email, and validation failure. Justify each.

## Sources

- HTTP Semantics RFC 9110 (`RFC-9110-HTTP`), MDN/web platform notes (`src-mdn-web`).
""",
)

add(
    "foundations/tcp-ip-networking.mdx",
    fm(
        id="FOUNDATIONS-TCP-IP",
        title="TCP/IP networking",
        title_bn="TCP/IP নেটওয়ার্কিং",
        description="How packets move across networks, what IP addressing provides, and why TCP reliability matters for applications.",
        description_bn="প্যাকেট কীভাবে নেটওয়ার্কে যায়, IP addressing কী দেয়, এবং TCP reliability কেন দরকার।",
        track="foundations",
        category="networking",
        difficulty="intermediate",
        minutes=40,
        prerequisites=["FOUNDATIONS-BINARY"],
        recommended_before=["FOUNDATIONS-MEMORY"],
        unlocks=["FOUNDATIONS-DNS", "FOUNDATIONS-HTTP"],
        related=["DEVOPS-NETWORKING", "FOUNDATIONS-HTTPS-TLS"],
        careers=["software-engineer", "devops-engineer"],
        tags=["tcp", "ip", "networking"],
        sources=["RFC-791-IPV4", "RFC-9293-TCP"],
    )
    + """## What is it?

**IP** moves packets between hosts. **TCP** builds a reliable byte stream on top of an unreliable packet network: ordering, retransmission, and congestion control.

## Why does it exist?

Networks drop, reorder, and duplicate packets. Applications usually want a dependable stream (“send this file completely”) without reinventing reliability per app. TCP provides that shared solution; UDP leaves reliability to the application when low latency matters more.

## Mental model

1. Your process writes bytes to a socket.
2. TCP segments those bytes, tracks acknowledgements, and retransmits losses.
3. IP routes packets hop by hop toward the destination address.
4. On arrival, TCP reassembles the stream for the receiving process.

Ports distinguish multiple conversations on one host (for example, `:443` vs `:22`).

## Real-world usage

Almost every web request rides TCP (or QUIC, which re-learns similar lessons). Database connections, SSH, and many RPC systems assume stream reliability.

## Common mistakes

1. Assuming “connected” means “the other process is healthy”—TCP only knows about the transport.
2. Ignoring timeouts and retries at the application layer.
3. Confusing bandwidth with latency; a fat pipe does not fix a long round trip.

## Interview angles

**Junior:** Difference between IP and TCP?  
**Mid:** What problem does the three-way handshake solve?  
**Senior:** Compare TCP head-of-line blocking with newer transports; discuss congestion control impact on APIs.

## Mini exercise

Explain what happens if a middlebox drops 1% of packets during a large download. Who notices first: IP or TCP?

## Sources

- IPv4 RFC 791 (`RFC-791-IPV4`), TCP RFC 9293 (`RFC-9293-TCP`).
""",
)

add(
    "foundations/data-structures.mdx",
    fm(
        id="FOUNDATIONS-DATA-STRUCTURES",
        title="Data structures essentials",
        title_bn="ডেটা স্ট্রাকচার এসেনশিয়ালস",
        description="How arrays, hash maps, and trees organize data, and how to choose structures from access patterns.",
        description_bn="Array, hash map ও tree কীভাবে ডেটা সাজায়, এবং access pattern থেকে কীভাবে বেছে নেবেন।",
        track="foundations",
        category="programming",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["FOUNDATIONS-DATA-TYPES", "FOUNDATIONS-FUNCTIONS"],
        recommended_before=["FOUNDATIONS-VARIABLES"],
        unlocks=["FOUNDATIONS-ALGORITHMS", "FOUNDATIONS-COMPLEXITY"],
        related=["DATABASE-RELATIONAL", "BACKEND-REDIS"],
        careers=["software-engineer", "backend-engineer"],
        tags=["data-structures", "algorithms"],
        sources=["TC39-ECMASCRIPT", "POSTGRES-DOCS"],
    )
    + """## What is it?

A **data structure** is an organization of data that makes some operations cheap and others expensive. Choosing well is often more important than micro-optimizing code.

## Why does it exist?

Programs repeatedly insert, look up, update, and delete. Different structures trade memory, speed, and ordering guarantees so common operations stay fast.

## Mental model

| Structure | Great at | Weak at |
|-----------|----------|---------|
| Array / list | Index access, scans | Middle inserts (arrays) |
| Hash map | Average key lookup | Ordered traversal |
| Tree / sorted map | Ordered ops, ranges | Constant factors vs hash |
| Queue / stack | Producer-consumer patterns | Random access |

```js
// Hash map mental model in JavaScript
const sessions = new Map();
sessions.set("user:42", { role: "editor" });
console.log(sessions.get("user:42"));
```

## How to choose

Start from the **questions your code asks most often**. If you need “get by id,” prefer a map. If you need “next event in time,” prefer a queue or heap. If you need range queries, think trees or sorted structures (and databases).

## Common mistakes

1. Using arrays for frequent membership tests (`includes` in a hot loop).
2. Nesting maps/objects until the model is unreadable—normalize earlier.
3. Premature clever structures when a simple list + clear code would do.

## Interview angles

**Junior:** When would you use a hash map over an array?  
**Mid:** Explain average vs worst-case hash map behavior.  
**Senior:** Connect in-memory structures to database indexes and cache layouts.

## Mini exercise

You need fast “is this id logged in?” checks for millions of ids. Which structure, and what memory concern do you mention?

## Sources

- Language collection semantics (`TC39-ECMASCRIPT`); relational storage contrast (`POSTGRES-DOCS`).
""",
)

add(
    "foundations/algorithms-complexity.mdx",
    fm(
        id="FOUNDATIONS-ALGORITHMS",
        title="Algorithms and complexity",
        title_bn="অ্যালগরিদম ও কমপ্লেক্সিটি",
        description="How to reason about algorithm cost with Big-O, and why complexity thinking prevents scaling disasters.",
        description_bn="Big-O দিয়ে অ্যালগরিদম খরচ বোঝা, এবং complexity চিন্তা কেন স্কেলিং বিপর্যয় আটকায়।",
        track="foundations",
        category="programming",
        difficulty="intermediate",
        minutes=45,
        prerequisites=["FOUNDATIONS-DATA-STRUCTURES"],
        recommended_before=["FOUNDATIONS-CONTROL-FLOW"],
        unlocks=["FOUNDATIONS-COMPLEXITY"],
        related=["DATABASE-EXPLAIN", "FRONTEND-PERFORMANCE"],
        careers=["software-engineer", "backend-engineer"],
        tags=["algorithms", "big-o", "performance"],
        sources=["TC39-ECMASCRIPT", "POSTGRES-INDEXES"],
    )
    + """## What is it?

An **algorithm** is a precise procedure for solving a problem. **Complexity** estimates how time and memory grow as input size grows—usually written with Big-O notation.

## Why does it exist?

A solution that works on 100 rows can collapse on 10 million. Complexity reasoning helps you predict pain before production traffic finds it.

## Mental model

- **O(1)** roughly constant work.
- **O(log n)** grows slowly (binary search, balanced tree height).
- **O(n)** linear scan.
- **O(n log n)** common for efficient sorting.
- **O(n²)** nested loops over the same set—danger at scale.

```js
// O(n²) trap: nested scans
function hasDuplicateNaive(items) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i] === items[j]) return true;
    }
  }
  return false;
}

// Often closer to O(n) expected with a set
function hasDuplicate(items) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item)) return true;
    seen.add(item);
  }
  return false;
}
```

## Real-world usage

API handlers, report generators, and mobile scroll lists all hide algorithms. Databases use indexes to turn scans into logarithmic lookups—same idea at a larger scale.

## Common mistakes

1. Quoting Big-O without stating what *n* is.
2. Ignoring constants and real hardware (an O(n) with huge constants can lose to a tight O(n log n) for moderate n).
3. Optimizing cold paths while the hot path does repeated full-table work.

## Interview angles

**Junior:** What does O(n) mean in plain language?  
**Mid:** Compare hash set vs sorting for duplicate detection.  
**Senior:** Relate algorithmic complexity to p95 latency and database `EXPLAIN` plans.

## Mini exercise

Estimate complexity of checking every pair of users for a “mutual friends” feature. What changes if you index friendships?

## Sources

- Language-level examples (`TC39-ECMASCRIPT`); index-driven alternatives (`POSTGRES-INDEXES`).
""",
)

add(
    "foundations/security-fundamentals.mdx",
    fm(
        id="FOUNDATIONS-SECURITY-BASICS",
        title="Security fundamentals",
        title_bn="সিকিউরিটি ফান্ডামেন্টালস",
        description="Core security principles—least privilege, threat thinking, and common web risks—before tool-specific hardening.",
        description_bn="Least privilege, threat thinking ও সাধারণ ওয়েব ঝুঁকি—টুল-নির্দিষ্ট হার্ডেনিংয়ের আগে।",
        track="foundations",
        category="security",
        difficulty="beginner",
        minutes=40,
        prerequisites=["FOUNDATIONS-HTTP"],
        recommended_before=["FOUNDATIONS-API-CONCEPTS"],
        unlocks=["BACKEND-SECURITY", "FOUNDATIONS-HTTPS-TLS"],
        related=["BACKEND-SECURITY", "BACKEND-AUTH"],
        careers=["software-engineer", "cybersecurity-engineer", "backend-engineer"],
        tags=["security", "owasp", "fundamentals"],
        sources=["OWASP-TOP10", "RFC-9110-HTTP"],
    )
    + """## What is it?

**Security fundamentals** are the habits and models that reduce harm when software meets adversaries: protect data, verify identity carefully, minimize privileges, and design for failure.

## Why does it exist?

Any system connected to users or networks will be probed. Security is not a feature bolted on later; it is constraints on how data and trust flow.

## Mental model

1. **Assets:** what must stay confidential/integral/available.
2. **Threats:** who might attack and what they gain.
3. **Controls:** authentication, authorization, encryption, validation, logging.
4. **Least privilege:** grant only what is needed, only as long as needed.

## High-frequency web risks (starter set)

From widely taught catalogs such as OWASP Top 10 themes:

- Injection (untrusted input becomes code/query)
- Broken authentication/session handling
- XSS and unsafe HTML composition
- Misconfigured access control
- Sensitive data exposure

## Practical starter rules

- Never trust client input; validate on the server.
- Hash passwords with a modern password hashing scheme (not reversible encryption).
- Use HTTPS for authenticating endpoints and sensitive data in transit.
- Log security-relevant events without logging secrets.

## Common mistakes

1. “We’re small, nobody will attack us.”
2. Security through obscurity as the only control.
3. Copy-pasting auth code without understanding session fixation, CSRF, or token storage.

## Interview angles

**Junior:** What is least privilege?  
**Mid:** Explain authentication vs authorization with an example.  
**Senior:** Walk through a threat model for a password-reset flow.

## Mini exercise

List three assets in a school results website and one realistic abuse case for each.

## Sources

- OWASP Top 10 (`OWASP-TOP10`); HTTP semantics relevant to web trusts (`RFC-9110-HTTP`).
""",
)

add(
    "foundations/processes-and-threads.mdx",
    fm(
        id="FOUNDATIONS-PROCESSES",
        title="Processes and threads",
        title_bn="প্রসেস ও থ্রেড",
        description="How operating systems isolate processes, what threads share, and how concurrency models affect application design.",
        description_bn="OS কীভাবে প্রসেস আলাদা রাখে, থ্রেড কী শেয়ার করে, concurrency মডেল কীভাবে ডিজাইন বদলায়।",
        track="foundations",
        category="operating-systems",
        difficulty="intermediate",
        minutes=35,
        prerequisites=["FOUNDATIONS-MEMORY"],
        recommended_before=["FOUNDATIONS-CPU"],
        unlocks=["FOUNDATIONS-OS-PERMISSIONS"],
        related=["BACKEND-NODE", "DEVOPS-LINUX"],
        careers=["software-engineer", "devops-engineer", "backend-engineer"],
        tags=["processes", "threads", "concurrency"],
        sources=["LINUX-MAN-PAGES", "NODE-EVENT-LOOP"],
    )
    + """## What is it?

A **process** is an OS-managed running program with its own address space. A **thread** is an execution path inside a process; threads in the same process share memory (and therefore share bugs if synchronization is wrong).

## Why does it exist?

Users run many programs at once. The OS isolates failures and resources per process, while threads allow parallel work without the full cost of separate processes.

## Mental model

- Process boundary ≈ safety and isolation.
- Thread boundary ≈ concurrent progress with shared heap.
- Async event loops (common in Node.js) often use few threads plus non-blocking I/O to juggle many tasks.

```bash
# Inspect your shell's process id (Linux/macOS)
echo $$
```

## Real-world usage

Web servers may fork workers (process model) or run thread pools. Containers usually wrap one main process. Crashes in one process ideally do not corrupt another.

## Common mistakes

1. Sharing mutable state across threads without locks/atomics/queues.
2. Assuming more threads always increase throughput (context switching and contention).
3. Blocking an event-loop thread with CPU-heavy work and starving I/O.

## Interview angles

**Junior:** Process vs thread in one minute.  
**Mid:** When prefer multi-process over multi-thread?  
**Senior:** Discuss race conditions, deadlocks, and structured concurrency.

## Mini exercise

If two threads increment the same counter without synchronization, what can go wrong? How would you fix it at a high level?

## Sources

- Linux process concepts (`LINUX-MAN-PAGES`); event-loop concurrency contrast (`NODE-EVENT-LOOP`).
""",
)

print(f"queued {len(TOPICS_SPEC)} so far")
# Write foundations now; continue in same process via exec of more files
for rel, content in TOPICS_SPEC:
    write(rel, content)
print("foundations batch done", len(TOPICS_SPEC))
PY