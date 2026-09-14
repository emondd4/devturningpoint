import type { SkillGraph } from '../../utils/graph';
import raw from './master-graph.json' with { type: 'json' };

/** Canonical skill graph — structure lives in master-graph.json for CI validation. */
export const masterGraph = raw as SkillGraph;
export default masterGraph;
