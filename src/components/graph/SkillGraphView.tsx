import { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Locale } from '../../i18n/config';
import type { SkillEdge, SkillNode } from '../../utils/graph';

interface Props {
  locale: Locale;
  nodes: SkillNode[];
  edges: SkillEdge[];
  /** Optional learn hrefs keyed by skill id (only published topics). */
  nodeLinks?: Record<string, string | undefined>;
}

function layoutNodes(skillNodes: SkillNode[], nodeLinks?: Record<string, string | undefined>): Node[] {
  const byTrack = new Map<string, SkillNode[]>();
  for (const node of skillNodes) {
    const key = node.track ?? 'other';
    if (!byTrack.has(key)) byTrack.set(key, []);
    byTrack.get(key)!.push(node);
  }

  const result: Node[] = [];
  let row = 0;
  for (const [, group] of byTrack) {
    group.forEach((node, index) => {
      const hasLink = Boolean(nodeLinks?.[node.id]);
      result.push({
        id: node.id,
        position: { x: (index % 4) * 220, y: row * 110 + Math.floor(index / 4) * 90 },
        data: { label: node.title },
        style: {
          border: `1px solid ${hasLink ? 'var(--color-accent)' : 'var(--color-border)'}`,
          borderRadius: 8,
          background: 'var(--color-surface-1)',
          color: 'var(--color-ink)',
          fontSize: 12,
          padding: 8,
          width: 180,
          cursor: hasLink ? 'pointer' : 'default',
        },
      });
    });
    row += Math.ceil(group.length / 4) + 1;
  }
  return result;
}

export default function SkillGraphView({ locale, nodes, edges, nodeLinks }: Props) {
  const initialNodes = useMemo(() => layoutNodes(nodes, nodeLinks), [nodes, nodeLinks]);
  const initialEdges: Edge[] = useMemo(
    () =>
      edges
        .filter((e) => e.type === 'requires' || e.type === 'recommendedBefore' || e.type === 'unlocks')
        .map((e) => ({
          id: `${e.from}-${e.to}-${e.type}`,
          source: e.from,
          target: e.to,
          label: e.type === 'requires' ? 'requires' : e.type,
          animated: e.type === 'unlocks',
          style: { stroke: 'var(--color-border)' },
        })),
    [edges],
  );

  const [rfNodes, , onNodesChange] = useNodesState(initialNodes);
  const [rfEdges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selected, setSelected] = useState<string | null>(null);
  const isBn = locale === 'bn';

  const selectedNode = nodes.find((n) => n.id === selected);
  const selectedHref = selected ? nodeLinks?.[selected] : undefined;

  return (
    <div className="space-y-4">
      <div className="h-[28rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-0)]">
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.3}
          onNodeClick={(_, node) => setSelected(node.id)}
          onNodeDoubleClick={(_, node) => {
            const href = nodeLinks?.[node.id];
            if (href) window.location.href = href;
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={16} color="var(--color-border)" />
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="surface-card" role="status">
          <p className="font-semibold text-[var(--color-ink)]">{selectedNode.title}</p>
          <p className="text-xs text-[var(--color-ink-subtle)]">{selectedNode.id}</p>
          {selectedNode.description && (
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{selectedNode.description}</p>
          )}
          {selectedHref ? (
            <a className="btn btn-primary mt-3" href={selectedHref}>
              {isBn ? 'টপিক খুলুন' : 'Open topic'}
            </a>
          ) : (
            <p className="mt-3 text-sm text-[var(--color-ink-subtle)]">
              {isBn ? 'এই স্কিলের জন্য এখনো আলাদা টপিক নেই।' : 'No dedicated topic mapped for this skill yet.'}
            </p>
          )}
        </div>
      )}

      <details className="surface-card">
        <summary className="cursor-pointer font-medium text-[var(--color-ink)]">
          {isBn ? 'Accessible তালিকা ভিউ' : 'Accessible list view'}
        </summary>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
          {nodes.map((node) => {
            const requires = edges.filter((e) => e.to === node.id && e.type === 'requires').map((e) => e.from);
            const href = nodeLinks?.[node.id];
            return (
              <li key={node.id}>
                {href ? (
                  <a href={href} className="font-medium text-[var(--color-ink)]">
                    {node.title}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="text-left font-medium text-[var(--color-ink)] underline"
                    onClick={() => setSelected(node.id)}
                  >
                    {node.title}
                  </button>
                )}
                {requires.length > 0 && (
                  <span className="block text-xs text-[var(--color-ink-subtle)]">
                    {isBn ? 'প্রয়োজন' : 'Requires'}: {requires.join(', ')}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}
