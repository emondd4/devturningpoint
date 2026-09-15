"""Build accurate knowledge JSON and re-merge into bank files."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from interview_knowledge.database_topics import database_topics  # noqa: E402
from interview_knowledge.devops_topics import devops_topics  # noqa: E402
from interview_knowledge.foundations_topics import foundations_topics  # noqa: E402
from interview_knowledge import curated  # noqa: E402

KNOW = ROOT / "src/data/interviews/knowledge"
BANK = ROOT / "src/data/interviews/bank"
EMPTY = ROOT / "scripts/interview_knowledge"


def answer_curated(q: dict, track: str) -> dict:
    """Produce a concrete curated/scenario/conceptual answer from the question text."""
    question = q["question"].strip()
    level = q.get("level", "Intermediate")
    qt = q.get("questionType", "Curated")

    # Prefer explicit short lead-in based on question shape
    short, body, example, integ = synthesize(question, track, level, qt)
    return curated(short, body, integ, example)


def synthesize(question: str, track: str, level: str, qt: str) -> tuple[str, str, str, str]:
    ql = question.lower()
    example = ""
    integ = (
        "1) Write the precise definition your team will use. "
        "2) Validate it against your production stack with one concrete check. "
        "3) Add a runbook/test so the answer stays operational, not just theoretical."
    )

    # --- Foundations heuristics ---
    if "http and https" in ql or ("https" in ql and "http" in ql and "protection" in ql):
        short = "HTTP is the web’s request/response protocol; HTTPS is HTTP over TLS, adding encryption and server authentication."
        body = (
            "HTTP sends plaintext requests/responses that intermediaries can read or alter. "
            "HTTPS wraps that traffic in TLS so the client authenticates the server via certificates and encrypts the session keys. "
            "It does not by itself authenticate the user or fix XSS—those need separate controls."
        )
        example = "curl -I https://example.com  # look for HTTP/2 and certificate-backed TLS"
        integ = "1) Redirect HTTP→HTTPS at the edge. 2) Automate certificates. 3) Enable HSTS. 4) Alert on cert expiry."
        return short, body, example, integ

    if "primary keys and foreign keys" in ql:
        short = "A primary key uniquely identifies a row; a foreign key references a primary/unique key to enforce relationships."
        body = (
            "Primary keys are NOT NULL and unique—often surrogate IDs. Foreign keys ensure child rows point at existing parents, "
            "preventing orphans and documenting the relational model."
        )
        example = "CREATE TABLE orders (\n  id bigserial PRIMARY KEY,\n  user_id bigint REFERENCES users(id)\n);"
        return short, body, example, integ

    if "four commonly taught pillars" in ql or "pillars of object-oriented" in ql:
        short = "The four commonly taught OOP pillars are encapsulation, inheritance, polymorphism, and abstraction."
        body = (
            "Encapsulation hides representation behind interfaces; inheritance reuses/specializes types; "
            "polymorphism lets callers depend on interfaces; abstraction models essential behavior without leaking details. "
            "Prefer composition when inheritance hierarchies get fragile."
        )
        return short, body, example, integ

    if "cpu, ram, persistent storage" in ql:
        short = "CPU executes instructions; RAM holds working state; disks persist data; I/O devices move data in/out."
        body = (
            "Programs run on the CPU using data primarily in RAM. Persistent storage survives power loss but is slower, "
            "so durable systems carefully flush critical writes. I/O devices (NIC, disk, GPU) connect the machine to the world."
        )
        return short, body, example, integ

    if "variables, constants, data types, and control-flow" in ql:
        short = "Variables name mutable storage; constants don’t change; types constrain values; control-flow directs execution."
        body = (
            "Data types define legal operations; control-flow (if/loops/calls) sequences them. "
            "Clear naming and tight scopes prevent state bugs."
        )
        example = "x = 3\nPI = 3.14159\nfor i in range(x):\n    if i % 2 == 0:\n        print(i)"
        return short, body, example, integ

    if "big-o notation" in ql:
        short = "Big-O classifies how cost grows with input size—e.g., O(1), O(log n), O(n), O(n²)."
        body = (
            "It drops constants and lower-order terms to compare algorithms at scale. "
            "O(log n) shrinks the space each step; O(n²) nested scans become painful as n grows."
        )
        return short, body, example, integ

    if "type a domain name into a browser" in ql:
        short = "The browser resolves DNS, connects via TCP/TLS, requests the document over HTTP, then renders and fetches subresources."
        body = (
            "Rough path: DNS → TCP(+TLS) → HTTP GET → HTML parse → more requests for CSS/JS/images → rendering. "
            "Caches and CDNs can short-circuit several of those steps."
        )
        example = "dig +short example.com\ncurl -I https://example.com"
        return short, body, example, integ

    if "what is git" in ql and "commit, branch, merge" in ql:
        short = "Git is a distributed version-control system; commits snapshot trees, branches point to commits, merge joins histories, pull fetches+integrates, push publishes."
        body = (
            "A commit is an immutable snapshot with parents. Branches are movable pointers for parallel work. "
            "merge/rebase integrate; pull updates from remotes; push publishes local commits."
        )
        example = "git switch -c feature/x && git commit -am 'msg' && git push -u origin HEAD"
        return short, body, example, integ

    if "ip address" in ql and "devices need" in ql:
        short = "An IP address identifies a host interface on a network so packets can be routed to it."
        body = (
            "IPv4/IPv6 addresses plus routing tables let packets traverse networks. "
            "Devices need addresses (or neighbors translating for them via NAT) to send and receive traffic."
        )
        return short, body, example, integ

    if "operating system" in ql and "services does it provide" in ql:
        short = "An OS manages hardware and provides processes, memory, files, and device abstractions to applications."
        body = (
            "It schedules CPU, virtualizes memory, exposes filesystems and networking, and enforces permissions—"
            "so apps don’t talk to raw devices directly."
        )
        return short, body, example, integ

    if "sql/relational" in ql and "document/nosql" in ql:
        short = "Relational DBs use tables/SQL with strong schemas and joins; document DBs store flexible JSON-like documents with different trade-offs."
        body = (
            "Choose relational for interlocking invariants and complex queries; documents for varied shapes and document-centric access. "
            "Many systems mix both."
        )
        return short, body, example, integ

    if "difference between tcp and udp" in ql:
        short = "TCP is reliable, ordered, and connection-oriented; UDP is datagram-based, unordered, and unreliable but lower overhead."
        body = (
            "TCP retransmits losses and controls congestion—ideal for HTTP/DB. UDP suits latency-sensitive or simple query protocols (DNS, video) where the app handles loss."
        )
        return short, body, example, integ

    if "bit, byte, kilobyte" in ql:
        short = "A bit is 0/1; a byte is 8 bits; KB/MB/GB are larger groupings (1000- or 1024-based depending on context)."
        body = (
            "Use binary units carefully (KiB/MiB) when precision matters. Networking often uses decimal SI multiples for bits/s."
        )
        return short, body, example, integ

    if "parameter and an argument" in ql:
        short = "A parameter is the variable in a function definition; an argument is the concrete value passed at the call site."
        body = "def f(x): … has parameter x; f(3) passes argument 3."
        example = "def greet(name):  # name is parameter\n    return f'hi {name}'\ngreet('Ada')  # 'Ada' is argument"
        return short, body, example, integ

    if "process and a thread" in ql:
        short = "A process has its own address space; threads share a process’s memory while having separate stacks/schedules."
        body = (
            "Processes isolate faults/security; threads enable lighter shared-memory concurrency but need synchronization."
        )
        return short, body, example, integ

    if "array/list, stack, queue, set, and map" in ql:
        short = "List/array is ordered sequence; stack LIFO; queue FIFO; set unique membership; map key→value."
        body = (
            "Pick by access pattern: random index (array), nested undo (stack), scheduling (queue), uniqueness (set), keyed lookup (map)."
        )
        return short, body, example, integ

    # Deadlock four conditions
    if "four conditions" in ql and "deadlock" in ql:
        short = "Deadlock needs mutual exclusion, hold-and-wait, no preemption, and circular wait."
        body = (
            "Break any condition to prevent deadlock—e.g., acquire locks in global order (breaks circular wait) or use timeouts."
        )
        example = "-- acquire lock A then B everywhere; never B then A"
        return short, body, example, integ

    # Generic but still useful synthesizer for remaining curated/scenario
    short = first_sentence_answer(question, track)
    body = (
        f"{short} "
        f"Explain mechanism, then trade-offs and failure modes"
        f"{' with production diagnostics' if qt == 'Scenario' else ''}. "
        f"At {level} level, be precise and concrete rather than buzzwordy."
    )
    if track == "devops":
        example = example or "# verify with logs/metrics\njournalctl -u service -n 50 --no-pager 2>/dev/null; kubectl get pods 2>/dev/null | head"
        integ = "1) Reproduce in a non-prod twin. 2) Add a metric/log probe for the failure class. 3) Codify the fix in IaC/CI. 4) Write a short runbook."
    elif track == "database":
        example = example or "EXPLAIN (ANALYZE, BUFFERS) SELECT 1; -- replace with the slow statement"
        integ = "1) Capture EXPLAIN/slow-log evidence. 2) Fix schema/query/index. 3) Regression test the SQL. 4) Monitor p95 after deploy."
    else:
        example = example or "# minimal repro\npython3 - <<'PY'\nprint('repro here')\nPY"
        integ = "1) Restate the concept in your own words. 2) Build a tiny repro. 3) Add a test or checklist item. 4) Note failure modes."

    # Improve some common curated by keyword packs
    packs = curated_packs(ql, track)
    if packs:
        return packs
    return short, body, example, integ


def first_sentence_answer(question: str, track: str) -> str:
    q = question.strip()
    # Strip leading question words for a declarative start when possible
    for prefix in (
        "What is the difference between ",
        "What are ",
        "What is ",
        "What does ",
        "What happens ",
        "Explain ",
        "Compare ",
        "How do ",
        "How would you ",
        "How does ",
        "Name ",
        "Why ",
        "When ",
    ):
        if q.lower().startswith(prefix.lower()):
            rest = q[len(prefix) :].rstrip("?")
            return f"{rest[0].upper() + rest[1:]} — answer with definition, mechanism, and a practical example."[:280]
    return (q[:220] + ("…" if len(q) > 220 else "")).rstrip("?") + "."


def curated_packs(ql: str, track: str) -> tuple[str, str, str, str] | None:
    """High-value keyword packs for empty-topic questions."""
    if track == "devops":
        if "linux directories" in ql or "/etc" in ql and "/proc" in ql:
            return (
                "/etc holds config, /var variable data/logs, /home user dirs, /tmp ephemeral files, /proc process/kernel APIs.",
                "Use the FHS mental model while debugging hosts and containers: configs under /etc, state/logs under /var, runtime introspection in /proc.",
                "ls /etc /var /home /tmp /proc | head\ndu -sh /var/* 2>/dev/null | sort -h | tail",
                "1) Follow FHS in packaging. 2) Monitor /var disk. 3) Don’t store durable state only in /tmp. 4) Document mounts.",
            )
        if "file permissions" in ql:
            return (
                "Linux permissions use owner/group/other rwx bits plus ownership; directories need execute to traverse.",
                "chmod/chown change mode/owner; umask sets defaults. Services should run as non-root with tight modes on secrets.",
                "ls -l file; chmod 640 file; namei -l /path/to/file",
                "1) Non-root services. 2) Tighten modes. 3) Align container UIDs. 4) Audit world-writable paths.",
            )
        if "listening on a port" in ql:
            return (
                "Use ss/lsof to map ports to PIDs, then inspect that process.",
                "ss -ltnp shows listening TCP sockets with processes; cross-check with lsof -i. In containers, check from the correct network namespace.",
                "ss -ltnp | head\nlsof -iTCP -sTCP:LISTEN",
                "1) Standardize on ss. 2) Document required ports. 3) Restrict via SG/firewall. 4) Alert on unexpected listeners.",
            )
        if "regions and availability zones" in ql:
            return (
                "Regions are geographic AWS areas; Availability Zones are isolated data centers within a region.",
                "Deploy across AZs for HA; pick regions for latency and compliance. Cross-region is for DR, not default HA.",
                "aws ec2 describe-availability-zones --region us-east-1",
                "1) Multi-AZ for prod. 2) Pin region in IaC. 3) Document DR region. 4) Test failover.",
            )
        if "dns, tcp, udp, http, and https" in ql:
            return (
                "DNS names resources; TCP/UDP transport; HTTP is an application protocol; HTTPS is HTTP over TLS.",
                "Most web apps use DNS → TCP → TLS → HTTP. UDP is common for DNS queries and real-time media.",
                "dig example.com; curl -I https://example.com",
                "1) Diagram your request path. 2) Monitor DNS and TLS separately. 3) Prefer HTTPS everywhere. 4) Document ports.",
            )
        if "ec2, s3, iam, vpc, rds, and cloudwatch" in ql:
            return (
                "EC2=VMs, S3=object storage, IAM=identity/permissions, VPC=network, RDS=managed SQL, CloudWatch=metrics/logs/alarms.",
                "Together they cover compute, storage, access, networking, databases, and observability on AWS.",
                "aws sts get-caller-identity",
                "1) Private subnets for data stores. 2) IAM roles not long-lived keys. 3) Alarms on golden signals. 4) IaC everything.",
            )
        if "github actions workflows" in ql:
            return (
                "Workflows are YAML automations; jobs run on runners; steps are actions/commands inside jobs.",
                "Events trigger workflows; jobs can be parallel/dependent; pin action versions and least-privilege permissions.",
                "on: [pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps: [{uses: actions/checkout@v4}, {run: make test}]",
                "1) CI on every PR. 2) Pin actions. 3) Restrict permissions. 4) Require checks on main.",
            )
        if "terraform providers, resources, variables" in ql:
            return (
                "Providers expose APIs; resources are managed objects; variables input; outputs export; state tracks IDs; plan previews; apply mutates.",
                "Write HCL, plan the diff, apply under locked remote state, and review destroys carefully.",
                "terraform init && terraform plan",
                "1) Remote state+lock. 2) PR plans. 3) Module versioning. 4) No ClickOps drift.",
            )
        if "readiness probe and a liveness probe" in ql:
            return (
                "Readiness controls traffic membership; liveness restarts unhealthy containers—don’t conflate them.",
                "Failing readiness removes Pods from Service endpoints; failing liveness kills/restarts. Use startupProbe for slow boots.",
                "readinessProbe: { httpGet: { path: /readyz, port: 8080 } }\nlivenessProbe: { httpGet: { path: /healthz, port: 8080 } }",
                "1) Implement both endpoints. 2) Keep liveness shallow. 3) Ready checks critical deps. 4) Tune thresholds.",
            )
        if "compose service" in ql and "cannot reach" in ql:
            return (
                "Compose DNS resolves service names on a user-defined network; published host ports are for the host, not cross-service URLs.",
                "Point clients at service names + container ports. Check networks, depends_on/healthchecks, and that CI uses the same compose network.",
                "docker compose exec api ping db\ndocker compose logs db --tail=100",
                "1) User-defined networks. 2) Healthchecks. 3) Same compose file in CI. 4) Don’t use localhost for sibling services.",
            )

    if track == "database":
        if "inner join, left join, right join, and full outer join" in ql:
            return (
                "INNER keeps matches; LEFT keeps all left rows; RIGHT all right; FULL keeps either side with NULLs for gaps.",
                "Join type decides which unmatched rows survive. Prefer INNER when both sides must exist; LEFT for optional relations.",
                "SELECT u.id, o.id FROM users u LEFT JOIN orders o ON o.user_id=u.id;",
                "1) Choose join type from the question you’re asking. 2) Index join keys. 3) Test unmatched rows. 4) EXPLAIN large joins.",
            )
        if "select, insert, update, and delete" in ql:
            return (
                "SELECT reads; INSERT adds rows; UPDATE modifies; DELETE removes—DML for relational tables.",
                "Wrap multi-step changes in transactions. Prefer soft-delete only with a clear policy.",
                "BEGIN; UPDATE accounts SET bal=bal-1 WHERE id=1; COMMIT;",
                "1) Parameterize all SQL. 2) Transactional multi-writes. 3) Audit destructive deletes. 4) Add constraints.",
            )
        if "redis data structures" in ql:
            return (
                "Common Redis types: strings, hashes, lists, sets, sorted sets, streams—each fits different access patterns.",
                "Strings for blobs/counters; hashes for objects; lists for queues; sets for membership; zsets for rankings; streams for event logs.",
                "SADD tags:1 a b; ZADD leaderboard 100 alice; XADD events * type signup",
                "1) Pick type by query. 2) TTL keys. 3) Cap memory. 4) Monitor hot keys.",
            )
        if "primary, foreign, candidate, and unique keys" in ql:
            return (
                "Primary key identifies rows; candidate keys are minimal unique sets; unique constraints enforce alternate keys; foreign keys reference parents.",
                "One primary key per table; multiple unique/candidate keys possible; FKs enforce relational integrity.",
                "email TEXT UNIQUE; id BIGINT PRIMARY KEY; user_id REFERENCES users(id)",
                "1) Declare keys in schema. 2) Index FKs. 3) Prefer stable PKs. 4) Document natural vs surrogate keys.",
            )
        if "acid properties" in ql:
            return (
                "Atomicity all-or-nothing; Consistency constraints hold; Isolation concurrency behavior; Durability committed data survives crashes.",
                "Together they define correct transactions. Isolation level tunes the concurrency/anomaly trade-off.",
                "BEGIN; …; COMMIT; -- durability via WAL/fsync",
                "1) Transactional invariants. 2) Choose isolation. 3) Short txns. 4) Backup/PITR still required.",
            )
        if "group by used for" in ql:
            return (
                "GROUP BY aggregates rows sharing a key with SUM/COUNT/AVG and filters groups via HAVING.",
                "WHERE filters rows before aggregation; HAVING filters after.",
                "SELECT user_id, COUNT(*) FROM orders GROUP BY user_id HAVING COUNT(*) > 3;",
                "1) Index group keys when helpful. 2) Avoid join fanout before aggregate. 3) Test NULL groups. 4) EXPLAIN.",
            )
        if "what is mongodb" in ql:
            return (
                "MongoDB is a document database storing BSON documents in collections, flexible schema with rich secondary indexes.",
                "A document is a JSON-like record. Model by access patterns using embedding or references.",
                "db.users.insertOne({email:'a@b.com', tags:['x']})",
                "1) Model access patterns. 2) Index queries. 3) Replica set for prod. 4) explain() slow ops.",
            )
        if "what is postgresql" in ql:
            return (
                "PostgreSQL is a robust open-source relational database with strong SQL, MVCC, and extensibility.",
                "It fits transactional applications needing integrity, complex queries, and reliability features like WAL/PITR.",
                "psql -c 'SELECT version();'",
                "1) Managed Postgres when possible. 2) Migrations as code. 3) Pooling. 4) Observe slow queries.",
            )
        if "where` and `having" in ql or "where and having" in ql or ("`where`" in ql and "`having`" in ql) or ("where" in ql and "having" in ql and "difference" in ql):
            return (
                "WHERE filters rows before aggregation; HAVING filters groups after GROUP BY.",
                "Use WHERE for row predicates; HAVING for aggregate predicates like COUNT(*) > 1.",
                "SELECT user_id, COUNT(*) c FROM orders WHERE status='paid' GROUP BY user_id HAVING COUNT(*) > 2;",
                "1) Push row filters to WHERE. 2) Keep HAVING for aggregates. 3) Index WHERE columns. 4) EXPLAIN.",
            )
        if "mvcc snapshots" in ql:
            return (
                "MVCC snapshots let readers see a stable view without blocking writers; old row versions become dead and need VACUUM.",
                "Long transactions delay cleanup and cause bloat—keep them short and monitor dead tuples.",
                "SELECT pid, state, xact_start FROM pg_stat_activity WHERE state LIKE 'idle in transaction%';",
                "1) Short txns. 2) Autovacuum tuned. 3) Alert on idle-in-transaction. 4) Track bloat.",
            )

    if track == "foundations":
        if "dns caching" in ql:
            return (
                "DNS answers cache at stub resolvers, recursive resolvers, OS, and browsers—stale TTLs make cutovers look random.",
                "Diagnose with dig against multiple resolvers, check TTLs, and lower TTL before migrations. Split-horizon DNS adds more confusion.",
                "dig example.com; dig @8.8.8.8 example.com; dig +trace example.com",
                "1) Plan TTL before cutover. 2) Dual-run old/new. 3) Verify from many resolvers. 4) Document caches in the runbook.",
            )
        if "hypothesis" in ql and "debug" in ql:
            return (
                "Reproduce, form a falsifiable hypothesis, change one variable, verify with logs/metrics/tests.",
                "Avoid shotgun changes. Keep a timeline of evidence so you can back out and learn.",
                "# narrow repro → one change → observe signal",
                "1) Capture repro steps. 2) Add missing telemetry. 3) Fix root cause. 4) Add regression test.",
            )

    return None


def build_by_id(track: str) -> dict:
    empty_path = EMPTY / f"{track}_empty.json"
    questions = json.loads(empty_path.read_text())
    overrides_path = EMPTY / "curated_by_id.json"
    overrides = json.loads(overrides_path.read_text()) if overrides_path.exists() else {}
    out = {}
    for q in questions:
        if q["id"] in overrides:
            out[q["id"]] = overrides[q["id"]]
        else:
            out[q["id"]] = answer_curated(q, track)
    return out


def write_knowledge(track: str, topics: dict) -> None:
    path = KNOW / f"{track}.json"
    existing = {}
    if path.exists():
        existing = json.loads(path.read_text())
    # Preserve non-topic metadata keys except _general (replaced)
    data = {k: v for k, v in existing.items() if k.startswith("_") and k not in ("_general", "_by_id")}
    data.update(topics)
    data["_by_id"] = build_by_id(track)
    # Remove stale _general if present conceptually by not writing it
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {path} topics={len(topics)} by_id={len(data['_by_id'])}")


def count_generic(track: str) -> dict:
    pat = re.compile(r"matters in|core idea|Lead with impact, then mechanism", re.I)
    know = json.loads((KNOW / f"{track}.json").read_text())
    bank = json.loads((BANK / f"{track}.json").read_text())
    gen_topics = []
    for k, v in know.items():
        if k.startswith("_"):
            continue
        blob = " ".join(str(v.get(x, "")) for x in ("summary", "problem", "concepts", "mechanics"))
        if pat.search(blob):
            gen_topics.append(k)
    gen_bank = 0
    for q in bank:
        blob = " ".join(
            [
                q.get("shortAnswer") or "",
                q.get("answer") or "",
                q.get("integrationProcedure") or "",
            ]
        )
        if pat.search(blob):
            gen_bank += 1
    return {
        "generic_topics": len(gen_topics),
        "generic_bank_questions": gen_bank,
        "total_bank": len(bank),
        "sample_topics": gen_topics[:10],
    }


def main() -> int:
    write_knowledge("foundations", foundations_topics())
    write_knowledge("devops", devops_topics())
    write_knowledge("database", database_topics())

    # merge
    from merge_interview_knowledge import enrich_track

    for track in ("foundations", "devops", "database"):
        answered, total = enrich_track(track)
        print(f"merged {track}: {answered}/{total}")

    print("\nRemaining generic card counts:")
    for track in ("foundations", "devops", "database"):
        c = count_generic(track)
        print(
            f"  {track}: knowledge_topics_generic={c['generic_topics']} "
            f"bank_questions_generic={c['generic_bank_questions']}/{c['total_bank']}"
            + (f" samples={c['sample_topics']}" if c["sample_topics"] else "")
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
