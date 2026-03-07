import { useMemo } from 'react';

const NODE_W = 130;
const NODE_H = 32;
const H_GAP = 60;
const V_GAP = 10;

function calcLayout(node, depth = 0) {
  if (!node.children || node.children.length === 0) {
    return { ...node, depth, width: NODE_W, height: NODE_H, totalH: NODE_H };
  }
  const children = node.children.map(c => calcLayout(c, depth + 1));
  const totalH = children.reduce((sum, c) => sum + c.totalH + V_GAP, -V_GAP);
  return { ...node, depth, children, width: NODE_W, height: NODE_H, totalH };
}

function assignPositions(node, x, y) {
  const cx = x;
  const cy = y + node.totalH / 2;
  const positioned = { ...node, x: cx, y: cy - NODE_H / 2 };
  if (!node.children || node.children.length === 0) return positioned;

  let childY = y;
  const posChildren = node.children.map(child => {
    const pc = assignPositions(child, x + NODE_W + H_GAP, childY);
    childY += child.totalH + V_GAP;
    return pc;
  });
  return { ...positioned, children: posChildren };
}

function collectNodes(node, acc = []) {
  acc.push(node);
  (node.children || []).forEach(c => collectNodes(c, acc));
  return acc;
}

function collectEdges(node, acc = []) {
  (node.children || []).forEach(child => {
    acc.push({ from: node, to: child });
    collectEdges(child, acc);
  });
  return acc;
}

function MindMapNode({ node }) {
  const textLen = node.label.length;
  const fontSize = textLen > 14 ? 9 : textLen > 10 ? 10 : 11;
  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        fill={node.color || '#1F2937'}
        opacity={0.9}
      />
      <text
        x={node.x + NODE_W / 2}
        y={node.y + NODE_H / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={fontSize}
        fontFamily="system-ui, sans-serif"
        fontWeight="500"
      >
        {node.label.length > 18 ? node.label.slice(0, 17) + '…' : node.label}
      </text>
    </g>
  );
}

export default function MindMap({ data }) {
  const layout = useMemo(() => {
    if (!data) return null;
    const withLayout = calcLayout(data);
    return assignPositions(withLayout, 20, 20);
  }, [data]);

  if (!layout) return <p className="text-gray-400 p-4">No data to display.</p>;

  const nodes = collectNodes(layout);
  const edges = collectEdges(layout);

  const maxX = Math.max(...nodes.map(n => n.x + NODE_W)) + 20;
  const maxY = Math.max(...nodes.map(n => n.y + NODE_H)) + 20;
  const viewBox = `0 0 ${maxX} ${maxY}`;

  return (
    <div className="overflow-x-auto rounded-xl bg-gray-900 border border-gray-700">
      <svg
        width={maxX}
        height={maxY}
        viewBox={viewBox}
        style={{ minWidth: Math.min(maxX, 300) }}
      >
        {edges.map((e, i) => {
          const x1 = e.from.x + NODE_W;
          const y1 = e.from.y + NODE_H / 2;
          const x2 = e.to.x;
          const y2 = e.to.y + NODE_H / 2;
          const mx = (x1 + x2) / 2;
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={e.to.color || '#4B5563'}
              strokeWidth={1.5}
              opacity={0.6}
            />
          );
        })}
        {nodes.map(node => (
          <MindMapNode key={node.id} node={node} />
        ))}
      </svg>
    </div>
  );
}
