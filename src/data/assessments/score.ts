import type { SkillGraph } from '../../utils/graph';
import {
  getAllPrerequisiteAncestors,
  suggestLearningOrder,
} from '../../utils/graph';
import { masterGraph } from '../skill-graphs/master-graph';
import type { AssessmentResult as StoredAssessmentResult } from '../../stores/progress';
import type {
  AssessmentAnswer,
  AssessmentBank,
  AssessmentQuestion,
  AssessmentScoreResult,
} from './types';

/** Confidence scale: 1–2 missing, 3 uncertain, 4–5 demonstrated. */
function confidenceToScore(value: number): number {
  if (value >= 4) return 1;
  if (value === 3) return 0.5;
  return 0;
}

function isCorrect(
  question: AssessmentQuestion,
  value: number | string,
): boolean | null {
  if (question.type === 'self-confidence') return null;
  if (question.correctAnswer === undefined) return null;

  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.includes(String(value));
  }
  return String(value) === question.correctAnswer;
}

function answerContribution(
  question: AssessmentQuestion,
  value: number | string,
): number {
  if (question.type === 'self-confidence') {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n) || n < 1 || n > 5) return 0;
    return confidenceToScore(n);
  }

  const correct = isCorrect(question, value);
  if (correct === null) return 0.5;
  return correct ? 1 : 0;
}

function classify(score: number): 'demonstrated' | 'uncertain' | 'missing' {
  if (score >= 0.7) return 'demonstrated';
  if (score >= 0.35) return 'uncertain';
  return 'missing';
}

function normalizeAnswers(
  answers: AssessmentAnswer[] | Record<string, string | number | boolean>,
): AssessmentAnswer[] {
  if (Array.isArray(answers)) return answers;
  return Object.entries(answers).map(([questionId, value]) => ({
    questionId,
    value: typeof value === 'boolean' ? String(value) : value,
  }));
}

export type ScoreAssessmentOptions = {
  bank: AssessmentBank;
  answers: AssessmentAnswer[] | Record<string, string | number | boolean>;
  graph?: SkillGraph;
  goalSkillIds?: string[];
};

/**
 * Deterministic assessment scoring.
 * Supports both `scoreAssessment(bank, answers)` (UI) and options-object form (tests).
 */
export function scoreAssessment(
  bankOrOptions: AssessmentBank | ScoreAssessmentOptions,
  answersMaybe?: AssessmentAnswer[] | Record<string, string | number | boolean>,
): AssessmentScoreResult {
  const options: ScoreAssessmentOptions =
    typeof bankOrOptions === 'object' &&
    bankOrOptions !== null &&
    'bank' in bankOrOptions &&
    'answers' in bankOrOptions
      ? (bankOrOptions as ScoreAssessmentOptions)
      : {
          bank: bankOrOptions as AssessmentBank,
          answers: answersMaybe ?? {},
        };

  const bank = options.bank;
  const graph = options.graph ?? masterGraph;
  const goalSkillIds = options.goalSkillIds ?? [];
  const answers = normalizeAnswers(options.answers);

  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  const weightedSum = new Map<string, number>();
  const weightTotal = new Map<string, number>();

  for (const question of bank.questions) {
    const raw = answerMap.get(question.id);
    if (raw === undefined) {
      for (const skillId of question.skillIds) {
        weightedSum.set(skillId, (weightedSum.get(skillId) ?? 0) + 0);
        weightTotal.set(skillId, (weightTotal.get(skillId) ?? 0) + question.weight);
      }
      continue;
    }

    const contribution = answerContribution(question, raw);
    for (const skillId of question.skillIds) {
      weightedSum.set(
        skillId,
        (weightedSum.get(skillId) ?? 0) + contribution * question.weight,
      );
      weightTotal.set(skillId, (weightTotal.get(skillId) ?? 0) + question.weight);
    }
  }

  const skillScores: Record<string, number> = {};
  const demonstrated: string[] = [];
  const uncertain: string[] = [];
  const missing: string[] = [];

  for (const [skillId, total] of weightTotal) {
    const score = total > 0 ? (weightedSum.get(skillId) ?? 0) / total : 0;
    skillScores[skillId] = Math.round(score * 1000) / 1000;
    const bucket = classify(score);
    if (bucket === 'demonstrated') demonstrated.push(skillId);
    else if (bucket === 'uncertain') uncertain.push(skillId);
    else missing.push(skillId);
  }

  demonstrated.sort();
  uncertain.sort();
  missing.sort();

  const known = new Set(demonstrated);
  const targetSkills = new Set<string>([...missing, ...uncertain, ...goalSkillIds]);

  const missingPrerequisites = new Set<string>();
  for (const skillId of targetSkills) {
    for (const ancestor of getAllPrerequisiteAncestors(graph, skillId)) {
      if (!known.has(ancestor)) missingPrerequisites.add(ancestor);
    }
  }

  const startCandidates = [
    ...new Set([...missingPrerequisites, ...missing, ...uncertain]),
  ].filter((id) => graph.nodes.some((n) => n.id === id));

  const ordered = suggestLearningOrder(graph, startCandidates);
  const recommendedStartId = ordered[0] ?? null;

  return {
    demonstrated,
    uncertain,
    missing,
    missingPrerequisites: [...missingPrerequisites].sort(),
    recommendedStartId,
    skillScores,
  };
}

/** Persistable assessment payload for IndexedDB. */
export function toAssessmentResult(
  trackId: string,
  score: AssessmentScoreResult,
  answers: Record<string, string | number | boolean>,
): StoredAssessmentResult {
  return {
    trackId,
    completedAt: new Date().toISOString(),
    demonstrated: score.demonstrated,
    uncertain: score.uncertain,
    missing: score.missing,
    recommendedStartId: score.recommendedStartId ?? undefined,
    answers,
  };
}
