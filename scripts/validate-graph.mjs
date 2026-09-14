#!/usr/bin/env node
/**
 * Validates src/data/skill-graphs/master-graph.json
 * Rules: missing node ids on edges, duplicate node ids, cycles on `requires`.
 * Exit 1 on failure.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const graphPath = join(__dirname, '../src/data/skill-graphs/master-graph.json');

/**
 * @param {{ nodes: { id: string }[], edges: { from: string, to: string, type: string }[] }} graph
 */
function validateGraph(graph) {
  /** @type {{ code: string, message: string, ids?: string[] }[]} */
  const issues = [];
  const seen = new Set();

  for (const node of graph.nodes) {
    if (seen.has(node.id)) {
      issues.push({
        code: 'DUPLICATE_NODE',
        message: `Duplicate skill id: ${node.id}`,
        ids: [node.id],
      });
    }
    seen.add(node.id);
  }

  for (const edge of graph.edges) {
    if (!seen.has(edge.from)) {
      issues.push({
        code: 'MISSING_NODE',
        message: `Edge from missing node: ${edge.from}`,
        ids: [edge.from],
      });
    }
    if (!seen.has(edge.to)) {
      issues.push({
        code: 'MISSING_NODE',
        message: `Edge to missing node: ${edge.to}`,
        ids: [edge.to],
      });
    }
  }

  /** @type {Map<string, string[]>} */
  const outbound = new Map();
  for (const edge of graph.edges) {
    if (edge.type !== 'requires') continue;
    if (!outbound.has(edge.from)) outbound.set(edge.from, []);
    outbound.get(edge.from).push(edge.to);
  }

  const visiting = new Set();
  const visited = new Set();
  /** @type {string[]} */
  const path = [];

  /** @param {string} id */
  const dfs = (id) => {
    if (visiting.has(id)) {
      const cycleStart = path.indexOf(id);
      issues.push({
        code: 'CYCLE',
        message: `Cycle detected in requires: ${[...path.slice(cycleStart), id].join(' -> ')}`,
        ids: [...path.slice(cycleStart), id],
      });
      return true;
    }
    if (visited.has(id)) return false;
    visiting.add(id);
    path.push(id);
    for (const to of outbound.get(id) ?? []) {
      if (dfs(to)) return true;
    }
    path.pop();
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) dfs(node.id);
  }

  return issues;
}

function main() {
  let raw;
  try {
    raw = readFileSync(graphPath, 'utf8');
  } catch (err) {
    console.error(`Failed to read ${graphPath}`);
    console.error(err);
    process.exit(1);
  }

  const graph = JSON.parse(raw);
  if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    console.error('Graph must have nodes[] and edges[]');
    process.exit(1);
  }

  const issues = validateGraph(graph);
  if (issues.length) {
    console.error(`Graph validation failed with ${issues.length} issue(s):`);
    for (const issue of issues) {
      console.error(`- [${issue.code}] ${issue.message}`);
    }
    process.exit(1);
  }

  const requires = graph.edges.filter((e) => e.type === 'requires').length;
  console.log(
    `OK: ${graph.nodes.length} nodes, ${graph.edges.length} edges (${requires} requires)`,
  );
}

main();
