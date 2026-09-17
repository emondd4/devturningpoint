import catalogJson from './catalog.json' with { type: 'json' };
import arraysHashing from './bank/arrays-hashing.json' with { type: 'json' };
import twoPointersSlidingWindow from './bank/two-pointers-sliding-window.json' with { type: 'json' };
import stacksQueues from './bank/stacks-queues.json' with { type: 'json' };
import linkedLists from './bank/linked-lists.json' with { type: 'json' };
import binarySearchSorting from './bank/binary-search-sorting.json' with { type: 'json' };
import trees from './bank/trees.json' with { type: 'json' };
import graphs from './bank/graphs.json' with { type: 'json' };
import dynamicProgramming from './bank/dynamic-programming.json' with { type: 'json' };
import greedy from './bank/greedy.json' with { type: 'json' };
import backtracking from './bank/backtracking.json' with { type: 'json' };
import heaps from './bank/heaps.json' with { type: 'json' };
import bitManipulationMath from './bank/bit-manipulation-math.json' with { type: 'json' };
import matrixGrid from './bank/matrix-grid.json' with { type: 'json' };
import type { Problem, ProblemCatalog, ProblemCategoryCatalog } from './types';

export type { Problem, ProblemCatalog, ProblemCategoryCatalog, ProblemDifficulty, ProblemExample } from './types';

export const problemCatalog = catalogJson as ProblemCatalog;

const banksBySlug: Record<string, Problem[]> = {
  'arrays-hashing': arraysHashing as Problem[],
  'two-pointers-sliding-window': twoPointersSlidingWindow as Problem[],
  'stacks-queues': stacksQueues as Problem[],
  'linked-lists': linkedLists as Problem[],
  'binary-search-sorting': binarySearchSorting as Problem[],
  trees: trees as Problem[],
  graphs: graphs as Problem[],
  'dynamic-programming': dynamicProgramming as Problem[],
  greedy: greedy as Problem[],
  backtracking: backtracking as Problem[],
  heaps: heaps as Problem[],
  'bit-manipulation-math': bitManipulationMath as Problem[],
  'matrix-grid': matrixGrid as Problem[],
};

/** All problems across every category, flattened. */
export function getAllProblems(): Problem[] {
  return Object.values(banksBySlug).flat();
}

export function getProblemCategory(slug: string): ProblemCategoryCatalog | undefined {
  return problemCatalog.categories.find((c) => c.slug === slug);
}

export function getProblemsByCategory(slug: string): Problem[] {
  return banksBySlug[slug] ?? [];
}

export function getProblemCategorySlugs(): string[] {
  return Object.keys(banksBySlug);
}
