import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projectSchema } from '../src/content/schemas';
import { tracks } from '../src/data/tracks/tracks';
import {
  PROJECT_LEVEL_ORDER,
  projectsForTrack,
  sortProjectsByLevel,
  toProjectCard,
} from '../src/data/projects/catalog';
import { buildCursorPrompt, promptVariantForTrack } from '../src/utils/project-prompt';
import { localePath } from '../src/i18n/config';

function loadProjectFrontmatter() {
  const dir = join(process.cwd(), 'src/content/projects');
  return readdirSync(dir)
    .filter((n) => n.endsWith('.mdx'))
    .map((name) => {
      const text = readFileSync(join(dir, name), 'utf8');
      const match = text.match(/^---([\s\S]*?)---/);
      if (!match) throw new Error(`Missing frontmatter in ${name}`);
      // Minimal YAML-ish parse via schema after JSON conversion from generator shape:
      // Use a light parser: extract with regex for tests of uniqueness; schema via validate script.
      return { name, fm: match[1], text };
    });
}

function parseList(fm: string, key: string): string[] {
  const block = fm.match(new RegExp(`${key}:\\n((?:  - .+\\n)*)`));
  if (!block) return [];
  return [...block[1].matchAll(/- "([^"]+)"/g)].map((m) => m[1]!);
}

function parseScalar(fm: string, key: string): string | undefined {
  const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'));
  return m?.[1]?.trim().replace(/^"|"$/g, '');
}

describe('project-based learning content', () => {
  const files = loadProjectFrontmatter();

  it('has exactly 30 projects', () => {
    expect(files).toHaveLength(30);
  });

  it('has unique project IDs and milestone IDs', () => {
    const projectIds = new Set<string>();
    const milestoneIds = new Set<string>();
    for (const file of files) {
      const id = parseScalar(file.fm, 'id')!;
      expect(projectIds.has(id)).toBe(false);
      projectIds.add(id);
      const milestonesBlock = file.fm.match(/\nmilestones:\n([\s\S]*)$/);
      const ms = milestonesBlock
        ? [...milestonesBlock[1].matchAll(/^\s+- id: "([^"]+)"/gm)].map((m) => m[1]!)
        : [];
      expect(ms.length).toBeGreaterThanOrEqual(3);
      for (const mid of ms) {
        expect(milestoneIds.has(mid)).toBe(false);
        milestoneIds.add(mid);
      }
    }
  });

  it('covers each track with beginner/intermediate/advanced', () => {
    const seen = new Set<string>();
    for (const file of files) {
      const track = parseScalar(file.fm, 'track')!;
      const level = parseScalar(file.fm, 'level')!;
      seen.add(`${track}:${level}`);
      expect(tracks.some((t) => t.id === track)).toBe(true);
      expect(PROJECT_LEVEL_ORDER).toContain(level as (typeof PROJECT_LEVEL_ORDER)[number]);
    }
    for (const track of tracks) {
      for (const level of PROJECT_LEVEL_ORDER) {
        expect(seen.has(`${track.id}:${level}`)).toBe(true);
      }
    }
  });

  it('has valid previous/next relationships without cycles', () => {
    const byId = new Map(
      files.map((f) => {
        const id = parseScalar(f.fm, 'id')!;
        return [
          id,
          {
            prev: parseScalar(f.fm, 'previousProjectId'),
            next: parseScalar(f.fm, 'nextProjectId'),
            track: parseScalar(f.fm, 'track')!,
          },
        ] as const;
      }),
    );
    for (const [id, meta] of byId) {
      if (meta.prev) {
        expect(byId.has(meta.prev)).toBe(true);
        expect(byId.get(meta.prev)!.track).toBe(meta.track);
      }
      if (meta.next) {
        expect(byId.has(meta.next)).toBe(true);
        expect(byId.get(meta.next)!.track).toBe(meta.track);
      }
      const seen = new Set<string>();
      let cur: string | undefined = id;
      while (cur) {
        expect(seen.has(cur)).toBe(false);
        seen.add(cur);
        cur = byId.get(cur)?.next;
      }
    }
  });

  it('parses through projectSchema for a representative sample', () => {
    const sample = files[0]!;
    const milestonesBlock = sample.fm.match(/\nmilestones:\n([\s\S]*)$/)?.[1] ?? '';
    const milestones = [
      ...milestonesBlock.matchAll(
        /^\s+- id: "([^"]+)"\n\s+title: "([^"]+)"\n\s+objective: "([^"]+)"\n\s+whyItMatters: "([^"]+)"/gm,
      ),
    ].map((m) => ({
      id: m[1]!,
      title: m[2]!,
      objective: m[3]!,
      whyItMatters: m[4]!,
      prerequisiteTopicIds: [] as string[],
      tasks: ['t'],
      expectedArtifacts: ['a'],
      validationChecklist: ['v'],
      commonProblems: ['c'],
      completionCriteria: ['d'],
    }));
    expect(milestones.length).toBeGreaterThanOrEqual(3);
    const parsed = projectSchema.parse({
      id: parseScalar(sample.fm, 'id'),
      title: parseScalar(sample.fm, 'title'),
      slug: parseScalar(sample.fm, 'slug'),
      track: parseScalar(sample.fm, 'track'),
      level: parseScalar(sample.fm, 'level'),
      summary: parseScalar(sample.fm, 'summary'),
      portfolioPitch: parseScalar(sample.fm, 'portfolioPitch'),
      estimatedHours: Number(parseScalar(sample.fm, 'estimatedHours')),
      prerequisiteSkillIds: parseList(sample.fm, 'prerequisiteSkillIds'),
      learningOutcomeSkillIds: parseList(sample.fm, 'learningOutcomeSkillIds'),
      recommendedTools: parseList(sample.fm, 'recommendedTools'),
      portfolioEvidence: parseList(sample.fm, 'portfolioEvidence'),
      relatedTopicIds: parseList(sample.fm, 'relatedTopicIds'),
      relatedInterviewQuestionIds: parseList(sample.fm, 'relatedInterviewQuestionIds'),
      sources: parseList(sample.fm, 'sources'),
      createdAt: parseScalar(sample.fm, 'createdAt'),
      updatedAt: parseScalar(sample.fm, 'updatedAt'),
      lastVerified: parseScalar(sample.fm, 'lastVerified'),
      milestones,
    });
    expect(parsed.id.startsWith('PROJECT-')).toBe(true);
    const card = toProjectCard(parsed);
    expect(card.slug).toBe(parsed.slug);
    expect(sortProjectsByLevel([card])).toHaveLength(1);
    expect(projectsForTrack([card], parsed.track)).toHaveLength(1);
  });

  it('builds Cursor prompts with required sections', () => {
    const sample = files.find((f) => parseScalar(f.fm, 'track') === 'frontend')!;
    const milestones = [
      {
        id: 'M1',
        title: 'One',
        objective: 'Obj',
        whyItMatters: 'Why',
        prerequisiteTopicIds: [],
        tasks: ['t'],
        expectedArtifacts: ['a'],
        validationChecklist: ['v'],
        commonProblems: ['c'],
        completionCriteria: ['done'],
      },
      {
        id: 'M2',
        title: 'Two',
        objective: 'Obj2',
        whyItMatters: 'Why2',
        prerequisiteTopicIds: [],
        tasks: ['t'],
        expectedArtifacts: ['a'],
        validationChecklist: ['v'],
        commonProblems: ['c'],
        completionCriteria: ['done'],
      },
      {
        id: 'M3',
        title: 'Three',
        objective: 'Obj3',
        whyItMatters: 'Why3',
        prerequisiteTopicIds: [],
        tasks: ['t'],
        expectedArtifacts: ['a'],
        validationChecklist: ['v'],
        commonProblems: ['c'],
        completionCriteria: ['done'],
      },
    ];
    const project = projectSchema.parse({
      id: parseScalar(sample.fm, 'id'),
      title: parseScalar(sample.fm, 'title'),
      slug: parseScalar(sample.fm, 'slug'),
      track: parseScalar(sample.fm, 'track'),
      level: parseScalar(sample.fm, 'level'),
      summary: parseScalar(sample.fm, 'summary'),
      portfolioPitch: parseScalar(sample.fm, 'portfolioPitch'),
      estimatedHours: Number(parseScalar(sample.fm, 'estimatedHours')),
      prerequisiteSkillIds: parseList(sample.fm, 'prerequisiteSkillIds'),
      learningOutcomeSkillIds: parseList(sample.fm, 'learningOutcomeSkillIds'),
      recommendedTools: parseList(sample.fm, 'recommendedTools'),
      portfolioEvidence: parseList(sample.fm, 'portfolioEvidence'),
      relatedTopicIds: parseList(sample.fm, 'relatedTopicIds'),
      relatedInterviewQuestionIds: parseList(sample.fm, 'relatedInterviewQuestionIds'),
      sources: parseList(sample.fm, 'sources'),
      createdAt: '2026-09-15',
      updatedAt: '2026-09-15',
      lastVerified: '2026-09-15',
      milestones,
    });
    const prompt = buildCursorPrompt(project);
    expect(prompt).toContain('PROJECT:');
    expect(prompt).toContain(project.id);
    expect(prompt).toContain('ACCEPTANCE CRITERIA:');
    expect(promptVariantForTrack('uiux')).toBe('uiux');
    expect(promptVariantForTrack('project-management')).toBe('pm');
  });

  it('resolves EN/BN project routes', () => {
    expect(localePath('en', 'projects')).toContain('/en/projects/');
    expect(localePath('bn', 'projects')).toContain('/bn/projects/');
    expect(localePath('en', 'projects/developer-toolbox-cli')).toContain(
      '/en/projects/developer-toolbox-cli/',
    );
  });
});
