export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface BruteForceApproach {
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: ProblemDifficulty;
  /** The recognizable technique, e.g. "Two Pointers", "DFS/BFS", "DP - 1D" */
  pattern: string;
  problemStatement: string;
  examples: ProblemExample[];
  constraints: string[];
  /** Ordered, language-agnostic "how to think about this" steps */
  approachSteps: string[];
  bruteForce?: BruteForceApproach;
  optimalApproach: string;
  solutionCode: string;
  timeComplexity: string;
  spaceComplexity: string;
  followUps: string[];
  relatedTopicIds: string[];
  tags: string[];
  /** Real companies where this exact problem (or a close variant) has been reported in Bangladeshi interviews */
  reportedAt?: string[];
  /** Source-registry ids backing the reportedAt claim */
  sources?: string[];
}

export interface ProblemCategoryCatalog {
  slug: string;
  label: string;
  labelBn?: string;
  prefix: string;
  count: number;
  byDifficulty: Record<ProblemDifficulty, number>;
}

export interface ProblemCatalog {
  title: string;
  generatedAt: string;
  methodology: {
    goal: string;
    notes: string[];
  };
  totalProblems: number;
  categories: ProblemCategoryCatalog[];
}
