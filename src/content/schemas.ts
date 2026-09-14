import { z } from 'astro/zod';

export const localeSchema = z.enum(['en', 'bn']);

export const difficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const contentStatusSchema = z.enum([
  'draft',
  'review',
  'published',
  'needs-review',
  'deprecated',
]);

export const sourceTypeSchema = z.enum([
  'official-docs',
  'specification',
  'github',
  'engineering-blog',
  'job-posting',
  'company-announcement',
  'news',
  'academic',
  'community',
]);

export const authorityTierSchema = z.enum(['S1', 'S2', 'S3', 'S4']);

/** YAML may parse bare dates as Date objects; normalize to YYYY-MM-DD strings. */
export const dateStringSchema = z.preprocess((value) => {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}, z.string());

export const sourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().optional(),
  sourceType: sourceTypeSchema,
  publishedDate: dateStringSchema.optional(),
  accessedDate: dateStringSchema,
  authorityTier: authorityTierSchema,
});

export const contributorSchema = z.object({
  name: z.string(),
  github: z.string().optional(),
});

export const topicFrontmatterSchema = z.object({
  id: z.string().regex(/^[A-Z0-9]+(-[A-Z0-9]+)+$/),
  title: z.string(),
  titleBn: z.string().optional(),
  description: z.string(),
  descriptionBn: z.string().optional(),
  track: z.string(),
  category: z.string().optional(),
  difficulty: difficultySchema,
  estimatedMinutes: z.number().int().positive(),
  prerequisites: z.array(z.string()).default([]),
  recommendedBefore: z.array(z.string()).default([]),
  unlocks: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  careers: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: contentStatusSchema.default('published'),
  translationStatus: z.enum(['complete', 'partial', 'missing']).default('missing'),
  applicableVersions: z.record(z.string(), z.string()).optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  lastVerified: dateStringSchema,
  sources: z.array(z.string()).default([]),
  contributors: z.array(contributorSchema).default([]),
  draft: z.boolean().default(false),
});

export const careerSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  nameBn: z.string().optional(),
  alternativeNames: z.array(z.string()).default([]),
  summary: z.string(),
  summaryBn: z.string().optional(),
  whatTheyDo: z.string(),
  typicalDailyWork: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  technicalSkills: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
  juniorExpectations: z.array(z.string()).default([]),
  midExpectations: z.array(z.string()).default([]),
  seniorExpectations: z.array(z.string()).default([]),
  relatedCareers: z.array(z.string()).default([]),
  careerTransitions: z.array(z.string()).default([]),
  learningTracks: z.array(z.string()).default([]),
  projectIds: z.array(z.string()).default([]),
  interviewCategories: z.array(z.string()).default([]),
  bangladeshNotes: z.string(),
  commonQualifications: z.array(z.string()).default([]),
  commonlyRequestedTech: z.array(z.string()).default([]),
  experienceExpectations: z.string().optional(),
  lastVerified: dateStringSchema,
  sources: z.array(z.string()).default([]),
  status: contentStatusSchema.default('published'),
});

export const companySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  website: z.string().url(),
  category: z.string(),
  businessAreas: z.array(z.string()).default([]),
  careerAreas: z.array(z.string()).default([]),
  headquarters: z.string().optional(),
  summary: z.string(),
  selectionCriteria: z.string(),
  lastVerified: dateStringSchema,
  sources: z.array(z.string()).default([]),
});

export const achievementSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  achievementType: z.enum([
    'product-launch',
    'expansion',
    'partnership',
    'award',
    'funding',
    'acquisition',
    'contract',
    'innovation',
    'milestone',
  ]),
  sourceId: z.string(),
  sourceDate: z.string().optional(),
  confidence: z.enum(['verified', 'reported', 'company-claim']),
});

export const interviewSchema = z.object({
  id: z.string(),
  question: z.string(),
  questionBn: z.string().optional(),
  careerIds: z.array(z.string()).default([]),
  technology: z.array(z.string()).default([]),
  difficulty: z.enum(['junior', 'mid', 'senior', 'lead']),
  shortAnswer: z.string(),
  strongAnswer: z.string(),
  advancedAnswer: z.string().optional(),
  followUps: z.array(z.string()).default([]),
  commonWrongAnswer: z.string().optional(),
  codeExample: z.string().optional(),
  productionRelevance: z.string().optional(),
  relatedTopics: z.array(z.string()).default([]),
  lastVerified: dateStringSchema,
});

export const issueSchema = z.object({
  id: z.string(),
  title: z.string(),
  technology: z.string(),
  platform: z.string().optional(),
  symptoms: z.array(z.string()).default([]),
  cause: z.string(),
  solution: z.string().optional(),
  workaround: z.string().optional(),
  affectedVersions: z.string().optional(),
  status: z.enum([
    'VERIFIED',
    'KNOWN_BUG',
    'WORKAROUND',
    'FIXED',
    'VERSION_SPECIFIC',
    'UNRESOLVED',
    'DEPRECATED',
  ]),
  relatedTopics: z.array(z.string()).default([]),
  sources: z.array(z.string()).default([]),
  lastVerified: dateStringSchema,
});

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  titleBn: z.string().optional(),
  track: z.string(),
  difficulty: difficultySchema,
  summary: z.string(),
  requiredKnowledge: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  suggestedArchitecture: z.string(),
  milestones: z.array(z.string()).default([]),
  extensions: z.array(z.string()).default([]),
  portfolioProof: z.string(),
  relatedTopics: z.array(z.string()).default([]),
  estimatedHours: z.number().optional(),
});

export const historyEventSchema = z.object({
  id: z.string(),
  year: z.string(),
  title: z.string(),
  titleBn: z.string().optional(),
  before: z.string(),
  problem: z.string(),
  change: z.string(),
  whyItMattered: z.string(),
  enabled: z.string(),
  modernDescendants: z.array(z.string()).default([]),
  concreteExample: z.string(),
  caveat: z.string().optional(),
  sources: z.array(z.string()).default([]),
});

export type TopicFrontmatter = z.infer<typeof topicFrontmatterSchema>;
export type Career = z.infer<typeof careerSchema>;
export type Company = z.infer<typeof companySchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type Interview = z.infer<typeof interviewSchema>;
export type Issue = z.infer<typeof issueSchema>;
export type Project = z.infer<typeof projectSchema>;
export type HistoryEvent = z.infer<typeof historyEventSchema>;
export type Source = z.infer<typeof sourceSchema>;
