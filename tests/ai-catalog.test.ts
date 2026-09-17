import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { aiToolSchema, promptRecipeSchema } from '../src/content/schemas';
import { getInterviewQuestions } from '../src/data/interviews';
import { tracks } from '../src/data/tracks/tracks';
import decisionGuides from '../src/data/ai/decision-guides.json';

function loadJsonDir(rel: string) {
  const dir = join(process.cwd(), rel);
  return readdirSync(dir)
    .filter((n) => n.endsWith('.json'))
    .map((name) => JSON.parse(readFileSync(join(dir, name), 'utf8')) as unknown);
}

describe('AI and Framework catalogs', () => {
  it('registers ai-framework track', () => {
    expect(tracks.some((t) => t.id === 'ai-framework' && t.slug === 'ai-framework')).toBe(true);
  });

  it('parses AI tool catalog entries', () => {
    const tools = loadJsonDir('src/content/ai-tools');
    expect(tools.length).toBeGreaterThanOrEqual(20);
    const ids = new Set<string>();
    for (const raw of tools) {
      const tool = aiToolSchema.parse(raw);
      expect(ids.has(tool.id)).toBe(false);
      ids.add(tool.id);
    }
  });

  it('parses prompt recipe library', () => {
    const recipes = loadJsonDir('src/content/prompt-recipes');
    expect(recipes.length).toBeGreaterThanOrEqual(24);
    const ids = new Set<string>();
    for (const raw of recipes) {
      const recipe = promptRecipeSchema.parse(raw);
      expect(ids.has(recipe.id)).toBe(false);
      ids.add(recipe.id);
      expect(recipe.promptTemplate).toMatch(/GOAL:/);
    }
  });

  it('has framework decision guides', () => {
    expect(decisionGuides.length).toBeGreaterThanOrEqual(10);
    for (const g of decisionGuides) {
      expect(g.id).toBeTruthy();
      expect(g.criteria.length).toBeGreaterThan(0);
      expect(g.lastVerified).toBeTruthy();
    }
  });

  it('exposes AI interview bank questions across levels', () => {
    const qs = getInterviewQuestions('ai-framework');
    expect(qs.length).toBeGreaterThanOrEqual(30);
    expect(qs.some((q) => q.level === 'Beginner')).toBe(true);
    expect(qs.some((q) => q.level === 'Intermediate')).toBe(true);
    expect(qs.some((q) => q.level === 'Advanced')).toBe(true);
  });

  it('includes AI failure/troubleshooting issues', () => {
    const dir = join(process.cwd(), 'src/content/issues');
    const aiIssues = readdirSync(dir).filter((n) => n.startsWith('issue-ai-') && n.endsWith('.json'));
    expect(aiIssues.length).toBeGreaterThanOrEqual(20);
  });
});
