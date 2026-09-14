/**
 * Shared helpers for generating Dev Turning Point topic MDX files.
 */
import fs from 'node:fs';
import path from 'node:path';

const DATE = '2026-09-14';
const ROOT = path.resolve(import.meta.dirname, '..');
const TOPICS_DIR = path.join(ROOT, 'src/content/topics');

export function yamlList(items) {
  if (!items?.length) return '[]';
  return `\n${items.map((i) => `  - ${JSON.stringify(i)}`).join('\n')}`;
}

export function frontmatter(meta) {
  return `---
id: ${meta.id}
title: ${JSON.stringify(meta.title)}
titleBn: ${JSON.stringify(meta.titleBn)}
description: ${JSON.stringify(meta.description)}
descriptionBn: ${JSON.stringify(meta.descriptionBn)}
track: ${meta.track}
difficulty: ${meta.difficulty}
estimatedMinutes: ${meta.estimatedMinutes}
prerequisites: ${yamlList(meta.prerequisites)}
unlocks: ${yamlList(meta.unlocks)}
related: ${yamlList(meta.related)}
careers: ${yamlList(meta.careers)}
tags: ${yamlList(meta.tags)}
status: published
translationStatus: ${meta.translationStatus ?? 'partial'}
createdAt: "${DATE}"
updatedAt: "${DATE}"
lastVerified: "${DATE}"
sources: ${yamlList(meta.sources)}
contributors:
  - name: "Dev Turning Point"
---`;
}

export function wrapArticle(meta, body) {
  const importPath = '../../../components/content/Callout.astro';
  const translationNote =
    (meta.translationStatus ?? 'partial') === 'partial'
      ? `\nimport Callout from '${importPath}';\n\n<Callout type="info" title="Translation status">\n  Body text is English for V1. Bangla title and description are available; full Bangla body may arrive later (\`translationStatus: partial\`).\n</Callout>\n`
      : `\nimport Callout from '${importPath}';\n`;

  return `${frontmatter(meta)}${translationNote}\n${body.trim()}\n`;
}

export function writeTopic(track, slug, meta, body) {
  const dir = path.join(TOPICS_DIR, track);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${slug}.mdx`);
  fs.writeFileSync(file, wrapArticle({ ...meta, track }, body), 'utf8');
  return file;
}

export function sourcesSection(ids) {
  return `## Sources

Cited registry ids (see \`src/data/source-registry/sources.json\`):

${ids.map((id) => `- \`${id}\``).join('\n')}

Always prefer primary docs over secondary summaries when verifying APIs or security guidance.`;
}

export function commonFooter({ mistakes, interview, practice, sourceIds }) {
  return `
## Common mistakes

${mistakes.map((m) => `- **${m.title}** — ${m.detail}`).join('\n')}

## Interview angle

<Callout type="interview">
  ${interview}
</Callout>

## Practice checklist

${practice.map((p) => `- [ ] ${p}`).join('\n')}

${sourcesSection(sourceIds)}
`;
}
