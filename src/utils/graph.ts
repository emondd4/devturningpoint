export type EdgeType =
  | 'requires'
  | 'recommendedBefore'
  | 'unlocks'
  | 'related'
  | 'belongsToTrack'
  | 'usefulForCareer';

export interface SkillNode {
  id: string;
  title: string;
  titleBn?: string;
  track?: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SkillEdge {
  from: string;
  to: string;
  type: EdgeType;
}

export interface SkillGraph {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export interface GraphValidationIssue {
  code: 'MISSING_NODE' | 'DUPLICATE_NODE' | 'CYCLE';
  message: string;
  ids?: string[];
}

export function indexGraph(graph: SkillGraph) {
  const nodes = new Map(graph.nodes.map((n) => [n.id, n]));
  const outbound = new Map<string, SkillEdge[]>();
  const inbound = new Map<string, SkillEdge[]>();

  for (const edge of graph.edges) {
    if (!outbound.has(edge.from)) outbound.set(edge.from, []);
    if (!inbound.has(edge.to)) inbound.set(edge.to, []);
    outbound.get(edge.from)!.push(edge);
    inbound.get(edge.to)!.push(edge);
  }

  return { nodes, outbound, inbound };
}

export function getDirectPrerequisites(graph: SkillGraph, skillId: string): string[] {
  const { inbound } = indexGraph(graph);
  return (inbound.get(skillId) ?? [])
    .filter((e) => e.type === 'requires')
    .map((e) => e.from);
}

export function getAllPrerequisiteAncestors(graph: SkillGraph, skillId: string): string[] {
  const visited = new Set<string>();
  const stack = [...getDirectPrerequisites(graph, skillId)];

  while (stack.length) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const parent of getDirectPrerequisites(graph, current)) {
      if (!visited.has(parent)) stack.push(parent);
    }
  }

  return [...visited];
}

export function getUnlockableDescendants(graph: SkillGraph, skillId: string): string[] {
  const { outbound } = indexGraph(graph);
  const visited = new Set<string>();
  const stack = (outbound.get(skillId) ?? [])
    .filter((e) => e.type === 'requires' || e.type === 'unlocks')
    .map((e) => e.to);

  while (stack.length) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const edge of outbound.get(current) ?? []) {
      if (edge.type === 'requires' || edge.type === 'unlocks') {
        stack.push(edge.to);
      }
    }
  }

  return [...visited];
}

export function getMissingPrerequisites(
  graph: SkillGraph,
  skillId: string,
  knownSkillIds: Iterable<string>,
): string[] {
  const known = new Set(knownSkillIds);
  return getAllPrerequisiteAncestors(graph, skillId).filter((id) => !known.has(id));
}

export function getRelatedSkills(graph: SkillGraph, skillId: string): string[] {
  const { outbound, inbound } = indexGraph(graph);
  const related = new Set<string>();
  for (const edge of outbound.get(skillId) ?? []) {
    if (edge.type === 'related') related.add(edge.to);
  }
  for (const edge of inbound.get(skillId) ?? []) {
    if (edge.type === 'related') related.add(edge.from);
  }
  return [...related];
}

/** Kahn topological order over strict requires edges among the provided nodes. */
export function suggestLearningOrder(graph: SkillGraph, skillIds: string[]): string[] {
  const wanted = new Set(skillIds);
  const prereqCount = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const id of wanted) {
    prereqCount.set(id, 0);
    dependents.set(id, []);
  }

  for (const edge of graph.edges) {
    if (edge.type !== 'requires') continue;
    if (!wanted.has(edge.from) || !wanted.has(edge.to)) continue;
    prereqCount.set(edge.to, (prereqCount.get(edge.to) ?? 0) + 1);
    dependents.get(edge.from)!.push(edge.to);
  }

  const queue = [...wanted].filter((id) => (prereqCount.get(id) ?? 0) === 0).sort();
  const order: string[] = [];

  while (queue.length) {
    const current = queue.shift()!;
    order.push(current);
    for (const next of dependents.get(current) ?? []) {
      const nextCount = (prereqCount.get(next) ?? 0) - 1;
      prereqCount.set(next, nextCount);
      if (nextCount === 0) queue.push(next);
    }
    queue.sort();
  }

  if (order.length !== wanted.size) {
    const remaining = [...wanted].filter((id) => !order.includes(id)).sort();
    return [...order, ...remaining];
  }

  return order;
}

export function validateGraph(graph: SkillGraph): GraphValidationIssue[] {
  const issues: GraphValidationIssue[] = [];
  const seen = new Set<string>();

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
    const skipTargetCheck = edge.type === 'belongsToTrack' || edge.type === 'usefulForCareer';
    if (!seen.has(edge.from)) {
      issues.push({
        code: 'MISSING_NODE',
        message: `Edge from missing node: ${edge.from}`,
        ids: [edge.from],
      });
    }
    if (!skipTargetCheck && !seen.has(edge.to)) {
      issues.push({
        code: 'MISSING_NODE',
        message: `Edge to missing node: ${edge.to}`,
        ids: [edge.to],
      });
    }
  }

  // Cycle detection on strict requires
  const { outbound } = indexGraph(graph);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const path: string[] = [];

  const dfs = (id: string): boolean => {
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
    for (const edge of outbound.get(id) ?? []) {
      if (edge.type === 'requires' && dfs(edge.to)) return true;
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

export function buildRoadmap(options: {
  graph: SkillGraph;
  knownSkillIds: string[];
  goalSkillIds: string[];
}): {
  known: string[];
  missing: string[];
  ordered: string[];
  reasons: Record<string, string>;
} {
  const known = new Set(options.knownSkillIds);
  const required = new Set<string>();

  for (const goal of options.goalSkillIds) {
    required.add(goal);
    for (const ancestor of getAllPrerequisiteAncestors(options.graph, goal)) {
      required.add(ancestor);
    }
  }

  const missing = [...required].filter((id) => !known.has(id));
  const ordered = suggestLearningOrder(options.graph, missing);
  const reasons: Record<string, string> = {};

  for (const id of ordered) {
    const unlocks = getUnlockableDescendants(options.graph, id).filter((x) => required.has(x));
    reasons[id] =
      unlocks.length > 0
        ? `Required foundation; unlocks ${unlocks.slice(0, 5).join(', ')}${unlocks.length > 5 ? '…' : ''}`
        : 'Required for your selected track goals';
  }

  return {
    known: [...known].filter((id) => required.has(id)),
    missing,
    ordered,
    reasons,
  };
}
