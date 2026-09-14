import { writeTopic, commonFooter } from './topic-helpers.mjs';

const C = {
  be: 'CAREER-BACKEND-ENGINEER',
  fs: 'CAREER-FULLSTACK-ENGINEER',
  se: 'CAREER-SOFTWARE-ENGINEER',
  data: 'CAREER-DATA-ENGINEER',
};

export function generateDatabase() {
  const topics = [
    {
      slug: 'relational-modeling',
      meta: {
        id: 'DATABASE-RELATIONAL-MODELING',
        title: 'Relational Modeling',
        titleBn: 'রিলেশনাল মডেলিং',
        description:
          'Entities, keys, normalization tradeoffs, and modeling for real product constraints.',
        descriptionBn:
          'এনটিটি, কী, নরমালাইজেশন ট্রেডঅফ, এবং আসল প্রোডাক্ট সীমাবদ্ধতার জন্য মডেলিং।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['FOUNDATIONS-SQL-FUNDAMENTALS', 'FOUNDATIONS-DATA-STRUCTURES-INTRO'],
        unlocks: ['DATABASE-SQL-JOINS-AGGREGATION', 'DATABASE-POSTGRESQL-INDEXING'],
        related: ['BACKEND-POSTGRESQL-WITH-BACKEND'],
        careers: [C.be, C.fs, C.data],
        tags: ['database', 'modeling', 'normalization'],
        sources: ['POSTGRES-DOCS'],
      },
      body: `
## Why modeling mistakes haunt forever

Schema changes are migrations, downtime risks, and broken reports. A clear model is cheaper than heroic SQL later.

## Mental model

<Callout type="mental-model">
  Identify entities and relationships (1:1, 1:N, M:N). Primary keys identity rows; foreign keys enforce relationships. Normalize to reduce update anomalies—denormalize deliberately for read performance.
</Callout>

\`\`\`sql
CREATE TABLE tracks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  track_id TEXT NOT NULL REFERENCES tracks(id),
  title TEXT NOT NULL
);

CREATE TABLE topic_tags (
  topic_id TEXT REFERENCES topics(id),
  tag TEXT NOT NULL,
  PRIMARY KEY (topic_id, tag)
);
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Encoding lists as CSV columns', detail: 'Breaks querying; use bridge tables or arrays thoughtfully.' },
    { title: 'No explicit keys', detail: 'Duplicates and fragile joins.' },
    { title: 'Over-normalizing UI preferences', detail: 'Sometimes a JSONB bag is fine.' },
  ],
  interview:
    'Model users, roles, and permissions—when is a join table required?',
  practice: [
    'Draw an ERD for a learning platform.',
    'Convert an M:N into a bridge table.',
    'List normalization anomalies you avoided.',
  ],
  sourceIds: ['POSTGRES-DOCS'],
})}
`,
    },
    {
      slug: 'sql-joins-aggregation',
      meta: {
        id: 'DATABASE-SQL-JOINS-AGGREGATION',
        title: 'SQL Joins and Aggregation',
        titleBn: 'SQL Join ও অ্যাগ্রিগেশন',
        description:
          'Inner/outer joins, GROUP BY, and HAVING—answering analytical questions in SQL.',
        descriptionBn:
          'Inner/outer join, GROUP BY ও HAVING—SQL-এ বিশ্লেষণাত্মক প্রশ্নের উত্তর।',
        difficulty: 'intermediate',
        estimatedMinutes: 38,
        prerequisites: ['DATABASE-RELATIONAL-MODELING'],
        unlocks: ['DATABASE-POSTGRESQL-INDEXING', 'DATABASE-POSTGRESQL-TRANSACTIONS'],
        related: ['FOUNDATIONS-ALGORITHMS-COMPLEXITY'],
        careers: [C.be, C.data, C.fs],
        tags: ['sql', 'joins', 'aggregation'],
        sources: ['POSTGRES-DOCS'],
      },
      body: `
## Why joins + aggregates replace nested loops

Databases are optimized for set operations. Expressing “per user counts” in SQL is usually clearer and faster than app-side loops.

## Mental model

<Callout type="mental-model">
  Join matches rows; aggregate collapses groups. WHERE filters rows before grouping; HAVING filters groups after.
</Callout>

\`\`\`sql
SELECT t.track_id, COUNT(*) AS topic_count
FROM topics t
LEFT JOIN topic_tags tt ON tt.topic_id = t.id
WHERE t.updated_at > now() - interval '90 days'
GROUP BY t.track_id
HAVING COUNT(*) >= 5
ORDER BY topic_count DESC;
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Filtering aggregates in WHERE', detail: 'Use HAVING for group conditions.' },
    { title: 'Unexpected row multiplication', detail: 'Joining M:N without care duplicates metrics.' },
    { title: 'SELECT * with heavy joins', detail: 'Pull only needed columns.' },
  ],
  interview:
    'Write SQL for top tracks by completed topics in the last 30 days.',
  practice: [
    'Practice INNER vs LEFT join results.',
    'Rewrite an app loop as GROUP BY.',
    'Explain a fan-out bug from a join.',
  ],
  sourceIds: ['POSTGRES-DOCS'],
})}
`,
    },
    {
      slug: 'postgresql-indexing',
      meta: {
        id: 'DATABASE-POSTGRESQL-INDEXING',
        title: 'PostgreSQL Indexing',
        titleBn: 'PostgreSQL ইনডেক্সিং',
        description:
          'B-tree indexes, selectivity, EXPLAIN, and the write/read tradeoff.',
        descriptionBn:
          'B-tree ইনডেক্স, সিলেক্টিভিটি, EXPLAIN, এবং রিড/রাইট ট্রেডঅফ।',
        difficulty: 'intermediate',
        estimatedMinutes: 40,
        prerequisites: ['DATABASE-SQL-JOINS-AGGREGATION', 'FOUNDATIONS-ALGORITHMS-COMPLEXITY'],
        unlocks: ['BACKEND-REDIS-CACHING'],
        related: ['POSTGRES-INDEXES', 'BACKEND-POSTGRESQL-WITH-BACKEND'],
        careers: [C.be, C.data],
        tags: ['postgresql', 'indexing', 'performance'],
        sources: ['POSTGRES-INDEXES', 'POSTGRES-DOCS'],
      },
      body: `
## Why indexes are not free

Indexes speed lookups and some sorts/joins, but slow writes and use disk. Index what you query—prove with \`EXPLAIN (ANALYZE)\`.

## Mental model

<Callout type="mental-model">
  A B-tree index is an ordered structure enabling logarithmic find/range scans for compatible predicates—like a book’s index, not a second full copy of every access path.
</Callout>

\`\`\`sql
CREATE INDEX CONCURRENTLY topics_track_updated_idx
  ON topics (track_id, updated_at DESC);

EXPLAIN ANALYZE
SELECT id FROM topics WHERE track_id = 'foundations' ORDER BY updated_at DESC LIMIT 20;
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Indexing every column', detail: 'Hurts writes; planner may ignore low-value indexes.' },
    { title: 'Leading-wildcard LIKE', detail: 'Often cannot use B-tree well.' },
    { title: 'Not measuring', detail: 'Guessing indexes wastes effort.' },
  ],
  interview:
    'How do you decide composite index column order?',
  practice: [
    'Create an index and compare EXPLAIN plans.',
    'Identify a sequential scan on a hot query.',
    'Read Postgres indexing docs overview.',
  ],
  sourceIds: ['POSTGRES-INDEXES', 'POSTGRES-DOCS'],
})}
`,
    },
    {
      slug: 'postgresql-transactions',
      meta: {
        id: 'DATABASE-POSTGRESQL-TRANSACTIONS',
        title: 'PostgreSQL Transactions',
        titleBn: 'PostgreSQL ট্রানজ্যাকশন',
        description:
          'ACID, isolation levels, and avoiding lost updates in concurrent apps.',
        descriptionBn:
          'ACID, আইসোলেশন লেভেল, এবং কনকারেন্ট অ্যাপে lost update এড়ানো।',
        difficulty: 'advanced',
        estimatedMinutes: 42,
        prerequisites: ['DATABASE-RELATIONAL-MODELING', 'BACKEND-POSTGRESQL-WITH-BACKEND'],
        unlocks: ['FULLSTACK-DATA-FLOW'],
        related: ['DATABASE-POSTGRESQL-INDEXING'],
        careers: [C.be, C.fs],
        tags: ['postgresql', 'transactions', 'acid'],
        sources: ['POSTGRES-TX', 'POSTGRES-DOCS'],
      },
      body: `
## Why transactions define correctness

Transferring credits, reserving seats, or publishing content needs **all-or-nothing** multi-statement changes under concurrency.

## Mental model

<Callout type="mental-model">
  BEGIN work; COMMIT makes it durable and visible per isolation rules; ROLLBACK undoes. Isolation levels trade anomaly prevention for throughput.
</Callout>

\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

Know read phenomena (dirty/nonrepeatable/phantom) at a practical level; use row locks or \`UPDATE … WHERE\` checks for lost updates.

${commonFooter({
  mistakes: [
    { title: 'Long transactions', detail: 'Hold locks; bloat; timeouts.' },
    { title: 'Assuming read committed prevents lost updates', detail: 'Need careful patterns/locking.' },
    { title: 'Catching errors and continuing dirty sessions', detail: 'Rollback explicitly.' },
  ],
  interview:
    'Explain isolation levels you would choose for inventory decrement and why.',
  practice: [
    'Simulate two concurrent updates and observe outcomes.',
    'Wrap a multi-step write in a transaction in your ORM.',
    'Read Postgres transaction isolation docs.',
  ],
  sourceIds: ['POSTGRES-TX', 'POSTGRES-DOCS'],
})}
`,
    },
    {
      slug: 'redis-data-structures',
      meta: {
        id: 'DATABASE-REDIS-DATA-STRUCTURES',
        title: 'Redis Data Structures',
        titleBn: 'Redis ডেটা স্ট্রাকচার',
        description:
          'Strings, hashes, lists, sets, sorted sets—picking the right Redis type.',
        descriptionBn:
          'String, hash, list, set, sorted set—সঠিক Redis টাইপ বেছে নেওয়া।',
        difficulty: 'intermediate',
        estimatedMinutes: 34,
        prerequisites: ['BACKEND-REDIS-CACHING', 'FOUNDATIONS-DATA-STRUCTURES-INTRO'],
        unlocks: [],
        related: ['REDIS-DATA-TYPES'],
        careers: [C.be, C.fs],
        tags: ['redis', 'data-structures'],
        sources: ['REDIS-DATA-TYPES'],
      },
      body: `
## Why Redis types matter

Using only \`GET/SET\` strings works—until you need leaderboards, queues, or field updates without rewriting giant JSON blobs.

## Mental model

<Callout type="mental-model">
  Match access pattern to type: hash for objects with field updates, list for queues, set for unique membership, sorted set for ranked feeds.
</Callout>

\`\`\`bash
HSET topic:1 title "Git" track foundations
ZADD leaderboard 100 "user:42"
LPUSH jobs '{"type":"reindex"}'
\`\`\`

${commonFooter({
  mistakes: [
    { title: 'Giant JSON strings always', detail: 'Partial updates become expensive.' },
    { title: 'Using Redis as sole system of record without persistence plan', detail: 'Know durability settings.' },
    { title: 'Unbounded keys without TTL', detail: 'Memory blowups.' },
  ],
  interview:
    'Which Redis type would you use for a trending topics leaderboard and why?',
  practice: [
    'Implement a simple rate limiter with INCR+TTL.',
    'Model a session hash.',
    'Read Redis data types overview.',
  ],
  sourceIds: ['REDIS-DATA-TYPES'],
})}
`,
    },
    {
      slug: 'mongodb-when-to-use',
      meta: {
        id: 'DATABASE-MONGODB-WHEN-TO-USE',
        title: 'MongoDB: When to Use It',
        titleBn: 'MongoDB: কখন ব্যবহার করবেন',
        description:
          'Document model tradeoffs versus relational systems—decision criteria, not hype.',
        descriptionBn:
          'রিলেশনাল সিস্টেমের বিপরীতে ডকুমেন্ট মডেলের ট্রেডঅফ—হাইপ নয়, সিদ্ধান্তের মানদণ্ড।',
        difficulty: 'intermediate',
        estimatedMinutes: 35,
        prerequisites: ['DATABASE-RELATIONAL-MODELING'],
        unlocks: [],
        related: ['MONGODB-DOCS', 'DATABASE-POSTGRESQL-TRANSACTIONS'],
        careers: [C.be, C.fs, C.se],
        tags: ['mongodb', 'document-db', 'tradeoffs'],
        sources: ['MONGODB-DOCS', 'POSTGRES-DOCS'],
      },
      body: `
## Why “Mongo vs Postgres” is the wrong first question

Ask about access patterns, consistency needs, team skills, and operational maturity. Both can succeed; both can fail.

## Mental model

<Callout type="mental-model">
  Documents shine when a business entity is naturally a nested aggregate loaded together. Relational shines with many ad-hoc joins, strong constraints, and complex transactions across entities.
</Callout>

Consider MongoDB when: flexible evolving attributes, aggregate-centric reads, horizontal scaling patterns you understand. Prefer Postgres when: rich relational constraints, reporting joins, and transactional workflows dominate (common for many SaaS apps).

${commonFooter({
  mistakes: [
    { title: 'Choosing Mongo to avoid learning SQL', detail: 'You still need data modeling discipline.' },
    { title: 'Unbounded document growth', detail: 'Arrays that grow forever hurt.' },
    { title: 'Ignoring transactions needs', detail: 'Multi-document tx exist but design still matters.' },
  ],
  interview:
    'Give a product example fit for documents and one better as relational—justify.',
  practice: [
    'Model the same feature in SQL and documents.',
    'List consistency requirements for checkout.',
    'Read MongoDB manual intro sections.',
  ],
  sourceIds: ['MONGODB-DOCS', 'POSTGRES-DOCS'],
})}
`,
    },
  ];

  for (const t of topics) {
    t.meta.related = (t.meta.related || []).filter(
      (id) => !['POSTGRES-INDEXES', 'REDIS-DATA-TYPES', 'MONGODB-DOCS'].includes(id),
    );
  }

  return topics.map((t) => writeTopic('database', t.slug, t.meta, t.body));
}
