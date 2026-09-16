import { describe, expect, it } from 'vitest';
import {
  validateProgressImport,
  deriveProjectStatus,
} from '../src/stores/progress';
import { CURRENT_STORAGE_VERSION } from '../src/utils/theme';

describe('project progress persistence', () => {
  it('derives project status from milestone completion', () => {
    expect(deriveProjectStatus([], 4)).toBe('NOT_STARTED');
    expect(deriveProjectStatus([{ milestoneId: 'm1', completedAt: 't' }], 4)).toBe('IN_PROGRESS');
    expect(
      deriveProjectStatus(
        [
          { milestoneId: 'm1', completedAt: 't' },
          { milestoneId: 'm2', completedAt: 't' },
          { milestoneId: 'm3', completedAt: 't' },
          { milestoneId: 'm4', completedAt: 't' },
        ],
        4,
      ),
    ).toBe('COMPLETED');
  });

  it('validates export/import payloads including projects and migration from v1', () => {
    expect(CURRENT_STORAGE_VERSION).toBe(2);

    const v1 = validateProgressImport({
      schemaVersion: 1,
      exportedAt: '2026-09-15T00:00:00.000Z',
      assessments: [],
      topics: [],
      paths: [],
      bookmarks: [],
    });
    expect(v1.ok).toBe(true);

    const v2 = validateProgressImport({
      schemaVersion: 2,
      exportedAt: '2026-09-15T00:00:00.000Z',
      assessments: [],
      topics: [],
      paths: [],
      bookmarks: [],
      projects: [
        {
          projectId: 'PROJECT-FOUNDATIONS-DEV-TOOLBOX-CLI',
          status: 'IN_PROGRESS',
          startedAt: '2026-09-15T00:00:00.000Z',
          lastVisitedAt: '2026-09-15T00:00:00.000Z',
          milestoneCompletion: [{ milestoneId: 'PROJECT-FOUNDATIONS-DEV-TOOLBOX-CLI-M1', completedAt: 't' }],
        },
      ],
    });
    expect(v2.ok).toBe(true);

    const bad = validateProgressImport({
      schemaVersion: 2,
      assessments: [],
      topics: [],
      paths: [],
      projects: 'nope',
    });
    expect(bad.ok).toBe(false);
  });
});
