#!/usr/bin/env node
/**
 * Validate Project-Based Learning content integrity for CI.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const issues = [];

const VALID_TRACKS = new Set([
  'foundations',
  'mobile-flutter',
  'frontend',
  'backend',
  'fullstack',
  'devops',
  'database',
  'qa',
  'uiux',
  'project-management',
]);
const VALID_LEVELS = new Set(['beginner', 'intermediate', 'advanced']);

function walk(dir, filter) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, filter));
    else if (filter(entry.name)) out.push(full);
  }
  return out;
}

function parseList(fm, key) {
  const block = fm.match(new RegExp(`${key}:\\n((?:  - .+\\n)*)`));
  if (!block) return [];
  if (fm.includes(`${key}: []`)) return [];
  return [...block[1].matchAll(/- "([^"]+)"/g)].map((m) => m[1]);
}

function parseScalar(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'));
  return m ? m[1].trim().replace(/^"|"$/g, '') : undefined;
}

// Topics
const topicIds = new Set();
for (const file of walk(join(root, 'src/content/topics'), (n) => n.endsWith('.mdx') || n.endsWith('.md'))) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---([\s\S]*?)---/);
  if (!match) continue;
  const id = parseScalar(match[1], 'id');
  if (id) topicIds.add(id);
}

// Skills
const graph = JSON.parse(readFileSync(join(root, 'src/data/skill-graphs/master-graph.json'), 'utf8'));
const skillIds = new Set(graph.nodes.map((n) => n.id));

// Sources
const sources = JSON.parse(readFileSync(join(root, 'src/data/source-registry/sources.json'), 'utf8'));
const sourceIds = new Set(sources.map((s) => s.id));

// Interview IDs (bank + deep dives)
const interviewIds = new Set();
for (const file of walk(join(root, 'src/data/interviews/bank'), (n) => n.endsWith('.json'))) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  for (const q of data) interviewIds.add(q.id);
}
for (const file of walk(join(root, 'src/content/interviews'), (n) => n.endsWith('.json'))) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  if (data.id) interviewIds.add(data.id);
}

const projectFiles = walk(join(root, 'src/content/projects'), (n) => n.endsWith('.mdx') || n.endsWith('.md'));
const projectById = new Map();
const milestoneIds = new Map();
const trackLevels = new Map();

if (projectFiles.length !== 30) {
  issues.push(`Expected 30 projects, found ${projectFiles.length}`);
}

for (const file of projectFiles) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---([\s\S]*?)---/);
  if (!match) {
    issues.push(`Missing frontmatter: ${file}`);
    continue;
  }
  const fm = match[1];
  const id = parseScalar(fm, 'id');
  const title = parseScalar(fm, 'title');
  const slug = parseScalar(fm, 'slug');
  const track = parseScalar(fm, 'track');
  const level = parseScalar(fm, 'level');
  const summary = parseScalar(fm, 'summary');
  const portfolioPitch = parseScalar(fm, 'portfolioPitch');
  const estimatedHours = parseScalar(fm, 'estimatedHours');
  const previousProjectId = parseScalar(fm, 'previousProjectId');
  const nextProjectId = parseScalar(fm, 'nextProjectId');

  const required = { id, title, slug, track, level, summary, portfolioPitch, estimatedHours };
  for (const [k, v] of Object.entries(required)) {
    if (!v) issues.push(`Missing critical metadata ${k} in ${file}`);
  }

  if (id && !/^PROJECT-[A-Z0-9]+(-[A-Z0-9]+)+$/.test(id)) {
    issues.push(`Invalid project id format ${id} in ${file}`);
  }
  if (id && projectById.has(id)) {
    issues.push(`Duplicate project ID ${id} in ${file} (also ${projectById.get(id)})`);
  } else if (id) {
    projectById.set(id, { file, previousProjectId, nextProjectId, track, level });
  }

  if (track && !VALID_TRACKS.has(track)) issues.push(`Invalid track ${track} in ${file}`);
  if (level && !VALID_LEVELS.has(level)) issues.push(`Invalid level ${level} in ${file}`);
  if (track && level) {
    const key = `${track}:${level}`;
    if (trackLevels.has(key)) issues.push(`Duplicate ${key} project (${trackLevels.get(key)} and ${file})`);
    else trackLevels.set(key, file);
  }

  for (const skillId of [...parseList(fm, 'prerequisiteSkillIds'), ...parseList(fm, 'learningOutcomeSkillIds')]) {
    if (!skillIds.has(skillId)) issues.push(`Unknown skill ${skillId} in ${file}`);
  }
  for (const topicId of parseList(fm, 'relatedTopicIds')) {
    if (!topicIds.has(topicId)) issues.push(`Unknown related topic ${topicId} in ${file}`);
  }
  // milestone prerequisite topics
  const prereqTopics = [...fm.matchAll(/prerequisiteTopicIds:\n((?: {6}- .+\n)*)/g)];
  for (const block of prereqTopics) {
    for (const m of block[1].matchAll(/- "([^"]+)"/g)) {
      if (!topicIds.has(m[1])) issues.push(`Unknown prerequisite topic ${m[1]} in ${file}`);
    }
  }
  for (const qid of parseList(fm, 'relatedInterviewQuestionIds')) {
    if (!interviewIds.has(qid)) issues.push(`Invalid interview ID ${qid} in ${file}`);
  }
  for (const sid of parseList(fm, 'sources')) {
    if (!sourceIds.has(sid)) issues.push(`Malformed/unknown source ${sid} in ${file}`);
  }

  const milestonesBlock = fm.match(/\nmilestones:\n([\s\S]*?)(?=\n---|\n[a-zA-Z]|$)/);
  const ms = milestonesBlock
    ? [...milestonesBlock[1].matchAll(/^\s+- id: "([^"]+)"/gm)].map((m) => m[1])
    : [...fm.matchAll(/^\s+- id: "([^"]+)"/gm)]
        .map((m) => m[1])
        .filter((mid) => mid !== id && !mid.startsWith('PROJECT-'));
  if (ms.length < 3) issues.push(`Project needs >=3 milestones: ${file}`);
  for (const mid of ms) {
    if (milestoneIds.has(mid)) {
      issues.push(`Duplicate milestone ID ${mid} in ${file} (also ${milestoneIds.get(mid)})`);
    } else {
      milestoneIds.set(mid, file);
    }
  }

  if (!parseList(fm, 'portfolioEvidence').length) {
    issues.push(`Missing portfolioEvidence in ${file}`);
  }
}

for (const track of VALID_TRACKS) {
  for (const level of VALID_LEVELS) {
    if (!trackLevels.has(`${track}:${level}`)) {
      issues.push(`Missing ${level} project for track ${track}`);
    }
  }
}

// previous/next integrity + cycles
for (const [id, meta] of projectById) {
  if (meta.previousProjectId) {
    const prev = projectById.get(meta.previousProjectId);
    if (!prev) issues.push(`Unknown previousProjectId ${meta.previousProjectId} on ${id}`);
    else if (prev.nextProjectId && prev.nextProjectId !== id) {
      issues.push(`Broken previous/next link around ${id}`);
    }
  }
  if (meta.nextProjectId) {
    const next = projectById.get(meta.nextProjectId);
    if (!next) issues.push(`Unknown nextProjectId ${meta.nextProjectId} on ${id}`);
  }
}

// Detect cycles in next pointers
for (const [startId] of projectById) {
  const seen = new Set();
  let cur = startId;
  while (cur) {
    if (seen.has(cur)) {
      issues.push(`Circular project navigation involving ${startId}`);
      break;
    }
    seen.add(cur);
    cur = projectById.get(cur)?.nextProjectId;
  }
}

if (issues.length) {
  console.error('Project validation failed:');
  for (const issue of issues) console.error(` - ${issue}`);
  process.exit(1);
}

console.log(`Projects OK: ${projectById.size} projects, ${milestoneIds.size} milestones`);
