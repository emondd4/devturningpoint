import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  achievementSchema,
  careerSchema,
  companySchema,
  historyEventSchema,
  interviewSchema,
  issueSchema,
  projectSchema,
  topicFrontmatterSchema,
} from './content/schemas';

const topics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
  schema: topicFrontmatterSchema,
});

const careers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/careers' }),
  schema: careerSchema,
});

const companies = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/companies' }),
  schema: companySchema,
});

const achievements = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/achievements' }),
  schema: achievementSchema,
});

const interviews = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/interviews' }),
  schema: interviewSchema,
});

const issues = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/issues' }),
  schema: issueSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: projectSchema,
});

const history = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/history' }),
  schema: historyEventSchema,
});

export const collections = {
  topics,
  careers,
  companies,
  achievements,
  interviews,
  issues,
  projects,
  history,
};
