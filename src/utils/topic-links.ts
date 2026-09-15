import { localePath, type Locale } from '../i18n/config';
import { skillToTopicId, trackCurriculum } from '../data/tracks/curriculum';

const publishedTopicIds = new Set(Object.values(trackCurriculum).flat());

/** Public learn URL slug from a canonical topic ID. */
export function toLearnSlug(id: string): string {
  return id.trim().toLowerCase().replace(/_/g, '-');
}

/** Resolve a skill-graph ID (or topic ID) to a published topic content ID. */
export function resolveTopicId(skillOrTopicId: string): string | undefined {
  if (!skillOrTopicId) return undefined;
  const mapped = skillToTopicId[skillOrTopicId];
  if (mapped && publishedTopicIds.has(mapped)) return mapped;
  if (publishedTopicIds.has(skillOrTopicId)) return skillOrTopicId;
  return undefined;
}

/** Learn href only when a published topic exists — never invent 404 URLs. */
export function learnPathForId(locale: Locale, skillOrTopicId: string): string | undefined {
  const topicId = resolveTopicId(skillOrTopicId);
  if (!topicId) return undefined;
  return localePath(locale, `learn/${toLearnSlug(topicId)}`);
}

export function getTrackCurriculum(trackId: string): string[] {
  return trackCurriculum[trackId] ?? [];
}

export function isPublishedTopicId(id: string): boolean {
  return publishedTopicIds.has(id);
}
