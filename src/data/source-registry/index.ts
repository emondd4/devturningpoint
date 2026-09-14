/**
 * Source registry for Dev Turning Point.
 * Topic frontmatter `sources` lists these ids; UI should resolve to citations.
 */
import registry from './sources.json';

export type SourceRecord = (typeof registry)[number];

export const sourcesById: Record<string, SourceRecord> = Object.fromEntries(
  registry.map((s) => [s.id, s]),
);

export function getSource(id: string): SourceRecord | undefined {
  return sourcesById[id];
}

export function resolveSources(ids: string[]): SourceRecord[] {
  return ids.map((id) => sourcesById[id]).filter(Boolean) as SourceRecord[];
}

export default registry;
