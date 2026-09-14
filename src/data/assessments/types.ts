export type AssessmentQuestionType =
  | 'self-confidence'
  | 'multiple-choice'
  | 'conceptual'
  | 'scenario'
  | 'code-reading';

export interface AssessmentOption {
  id: string;
  label: string;
  labelBn?: string;
}

export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  prompt: string;
  promptBn?: string;
  skillIds: string[];
  /** Present for multiple-choice (and optionally conceptual) questions. */
  options?: AssessmentOption[];
  /** Option id, or for self-confidence a scale note is unused (answers are 1–5). */
  correctAnswer?: string | string[];
  weight: number;
}

export interface AssessmentBank {
  id: string;
  trackId: string;
  title: string;
  titleBn?: string;
  description?: string;
  questions: AssessmentQuestion[];
}

/** Learner response for one question. */
export interface AssessmentAnswer {
  questionId: string;
  /**
   * self-confidence: number 1–5
   * multiple-choice / conceptual / scenario / code-reading: option id string
   */
  value: number | string;
}

export interface AssessmentScoreResult {
  demonstrated: string[];
  uncertain: string[];
  missing: string[];
  missingPrerequisites: string[];
  recommendedStartId: string | null;
  /** Per-skill aggregate score in [0, 1] for debugging/UI. */
  skillScores: Record<string, number>;
}
