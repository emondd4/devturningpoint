import { describe, expect, it } from 'vitest';
import { learnPathForId, resolveTopicId, toLearnSlug } from '../src/utils/topic-links';
import { trackCurriculum } from '../src/data/tracks/curriculum';

describe('topic link resolution', () => {
  it('maps skill ids to published topic ids', () => {
    expect(resolveTopicId('MOBILE-DART-BASICS')).toBe('FLUTTER-DART-FUNDAMENTALS');
    expect(resolveTopicId('DEVOPS-DOCKER')).toBe('DEVOPS-DOCKER-FUNDAMENTALS');
    expect(resolveTopicId('FRONTEND-REACT')).toBe('FRONTEND-REACT-COMPONENTS-STATE');
  });

  it('accepts canonical topic ids', () => {
    expect(resolveTopicId('FLUTTER-WIDGET-TREE')).toBe('FLUTTER-WIDGET-TREE');
  });

  it('does not invent urls for unmapped skills', () => {
    expect(resolveTopicId('TRACK-FOUNDATIONS')).toBeUndefined();
    expect(learnPathForId('en', 'SOME-UNKNOWN-SKILL')).toBeUndefined();
  });

  it('builds base-aware learn paths for mapped skills', () => {
    const href = learnPathForId('en', 'MOBILE-FLUTTER-WIDGETS');
    expect(href).toContain('/en/learn/flutter-widget-tree');
  });

  it('covers every track curriculum with unique topics', () => {
    const all = Object.values(trackCurriculum).flat();
    expect(new Set(all).size).toBe(all.length);
    expect(all.length).toBeGreaterThanOrEqual(70);
    for (const [track, ids] of Object.entries(trackCurriculum)) {
      expect(ids.length, track).toBeGreaterThan(0);
      for (const id of ids) {
        expect(toLearnSlug(id)).toMatch(/^[a-z0-9-]+$/);
      }
    }
  });
});
