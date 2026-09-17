import type { Project } from '../../content/schemas';
import { tracks } from '../tracks/tracks';

export const PROJECT_LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'] as const;
export type ProjectLevel = (typeof PROJECT_LEVEL_ORDER)[number];

export interface ProjectCardModel {
  id: string;
  title: string;
  slug: string;
  track: string;
  trackTitle: string;
  level: ProjectLevel;
  projectRole: 'core' | 'market-alternative';
  marketRelevance?: string;
  summary: string;
  portfolioPitch: string;
  estimatedHours: number;
  prerequisiteSkillIds: string[];
  learningOutcomeSkillIds: string[];
  recommendedTools: string[];
  relatedTopicIds: string[];
  relatedInterviewQuestionIds: string[];
  portfolioEvidence: string[];
  previousProjectId?: string;
  nextProjectId?: string;
  milestoneCount: number;
  milestoneIds: string[];
}

export function toProjectCard(data: Project): ProjectCardModel {
  const track = tracks.find((t) => t.id === data.track);
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    track: data.track,
    trackTitle: track?.title ?? data.track,
    level: data.level,
    projectRole: data.projectRole ?? 'core',
    marketRelevance: data.marketRelevance,
    summary: data.summary,
    portfolioPitch: data.portfolioPitch,
    estimatedHours: data.estimatedHours,
    prerequisiteSkillIds: data.prerequisiteSkillIds,
    learningOutcomeSkillIds: data.learningOutcomeSkillIds,
    recommendedTools: data.recommendedTools,
    relatedTopicIds: data.relatedTopicIds,
    relatedInterviewQuestionIds: data.relatedInterviewQuestionIds,
    portfolioEvidence: data.portfolioEvidence,
    previousProjectId: data.previousProjectId,
    nextProjectId: data.nextProjectId,
    milestoneCount: data.milestones.length,
    milestoneIds: data.milestones.map((m) => m.id),
  };
}

export function sortProjectsByLevel<T extends { level: string }>(items: T[]): T[] {
  const order = new Map(PROJECT_LEVEL_ORDER.map((l, i) => [l, i]));
  return [...items].sort((a, b) => (order.get(a.level as ProjectLevel) ?? 99) - (order.get(b.level as ProjectLevel) ?? 99));
}

export function projectsForTrack<T extends { track: string }>(items: T[], trackId: string): T[] {
  return sortProjectsByLevel(items.filter((p) => p.track === trackId));
}

export function levelLabel(level: string, isBn: boolean): string {
  if (!isBn) return level.charAt(0).toUpperCase() + level.slice(1);
  if (level === 'beginner') return 'বিগিনার';
  if (level === 'intermediate') return 'ইন্টারমিডিয়েট';
  return 'অ্যাডভান্সড';
}

export {
  levelOrder,
  projectCatalog,
  getProjectsByTrack,
  getProjectBySlug,
  getProjectById,
} from './index';
export type { ProjectCatalogEntry } from './index';
