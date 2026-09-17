import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { siteConfig } from '../src/config/site';
import {
  getFooterColumns,
  getMobilePrimaryLinks,
  getNavigablePathSuffixes,
  getPrimaryNav,
  trackIcon,
} from '../src/data/navigation';
import { tracks } from '../src/data/tracks/tracks';

describe('TechStackBD navigation & brand', () => {
  it('exposes TechStackBD site config and brand asset files', () => {
    expect(siteConfig.siteName).toBe('TechStackBD');
    expect(siteConfig.repoUrl).toContain('github.com');
    for (const rel of [
      siteConfig.brand.icon,
      siteConfig.brand.wordmark,
      ...siteConfig.brand.heroes,
      ...Object.values(siteConfig.brand.features),
    ]) {
      const abs = join(process.cwd(), 'public', rel.replace(/^\//, ''));
      expect(existsSync(abs), abs).toBe(true);
    }
  });

  it('builds primary and mobile nav without empty hrefs', () => {
    const primary = getPrimaryNav('en');
    expect(primary.length).toBeGreaterThanOrEqual(6);
    for (const item of primary) {
      expect(item.href.length).toBeGreaterThan(0);
      expect(item.labelEn.length).toBeGreaterThan(0);
    }
    const mobile = getMobilePrimaryLinks('bn');
    expect(mobile.some((l) => l.id === 'ai')).toBe(true);
  });

  it('maps every track to a Material icon name', () => {
    for (const track of tracks) {
      expect(trackIcon(track.id).length).toBeGreaterThan(0);
    }
  });

  it('footer columns include learn/career/platform/legal links', () => {
    const cols = getFooterColumns('en');
    expect(cols.map((c) => c.id)).toEqual(
      expect.arrayContaining(['learn', 'career', 'platform', 'community', 'legal']),
    );
    const hrefs = cols.flatMap((c) => c.links.map((l) => l.href));
    expect(hrefs.every((h) => h.length > 0)).toBe(true);
  });

  it('lists navigable path suffixes for known routes', () => {
    const suffixes = getNavigablePathSuffixes();
    expect(suffixes).toContain('ai');
    expect(suffixes).toContain('tracks/ai-framework');
    expect(suffixes).toContain('my-learning');
  });
});
