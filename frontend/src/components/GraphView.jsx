import { useEffect, useRef, useCallback } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import './GraphView.css';

cytoscape.use(dagre);

const NODE_COLORS = {
  Supplier: '#f59e0b',
  Factory: '#8b5cf6',
  Warehouse: '#06b6d4',
  Customer: '#10b981',
};

const TYPE_ICONS = {
  Supplier: '📦',
  Factory: '🏭',
  Warehouse: '🏢',
  Customer: '🛒',
};

export default function GraphView({ nodes, edges, affectedNodeIds = [], bottleneckIds = [], selectedNodeId, onNodeClick }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  const buildElements = useCallback(() => {
    const elements = [];
    nodes.forEach(n => {
      const isAffected = affectedNodeIds.includes(n.id);
      const isBottleneck = bottleneckIds.includes(n.id);
      const isSelected = selectedNodeId === n.id;
      elements.push({
        data: {
          id: String(n.id),
          label: `${TYPE_ICONS[n.type] || ''} ${n.name}`,
          type: n.type,
          color: isAffected ? '#ef4444' : isSelected ? '#60a5fa' : NODE_COLORS[n.type] || '#94a3b8',
          borderColor: isBottleneck ? '#f59e0b' : isAffected ? '#ef4444' : 'transparent',
          borderWidth: isBottleneck || isAffected ? 3 : 1,
          opacity: 1,
        },
        group: 'nodes',
      });
    });
    edges.forEach(e => {
      elements.push({
        data: {
          id: `e-${e.id}`,
          source: String(e.source_id),
          target: String(e.target_id),
          label: `${e.lead_time}d`,
        },
        group: 'edges',
      });
    });
    return elements;
  }, [nodes, edges, affectedNodeIds, bottleneckIds, selectedNodeId]);

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    // Destroy old instance
    if (cyRef.current) cyRef.current.destroy();

    const cy = cytoscape({
      container: containerRef.current,
      elements: buildElements(),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#f0f6ff',
            'font-size': '11px',
            'font-family': 'Inter, sans-serif',
            'font-weight': '500',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': '6px',
            'text-outline-color': '#0a0f1e',
            'text-outline-width': '2px',
            'width': '42px',
            'height': '42px',
            'border-width': 'data(borderWidth)',
            'border-color': 'data(borderColor)',
            'transition-property': 'background-color, border-color',
            'transition-duration': '0.3s',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#1e3a5f',
            'target-arrow-color': '#1e3a5f',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '9px',
            'color': '#475569',
            'text-outline-color': '#0a0f1e',
            'text-outline-width': '2px',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#60a5fa',
            'box-shadow': '0 0 16px rgba(59,130,246,0.6)',
          },
        },
      ],
      layout: {
        name: 'dagre',
        rankDir: 'LR',
        nodeSep: 60,
        rankSep: 120,
        padding: 30,
      },
      wheelSensitivity: 0.3,
    });

    cy.on('tap', 'node', evt => {
      const nodeId = parseInt(evt.target.id(), 10);
      if (onNodeClick) onNodeClick(nodeId);
    });

    // Pan & zoom after layout
    cy.one('layoutstop', () => cy.fit(undefined, 40));

    cyRef.current = cy;

    return () => { if (cyRef.current) cyRef.current.destroy(); };
  }, [nodes, edges]);

  // Update styling without re-building the whole graph
  useEffect(() => {
    if (!cyRef.current || nodes.length === 0) return;
    nodes.forEach(n => {
      const node = cyRef.current.getElementById(String(n.id));
      if (!node.length) return;
      const isAffected = affectedNodeIds.includes(n.id);
      const isBottleneck = bottleneckIds.includes(n.id);
      const isSelected = selectedNodeId === n.id;
      node.data('color', isAffected ? '#ef4444' : isSelected ? '#60a5fa' : NODE_COLORS[n.type] || '#94a3b8');
      node.data('borderColor', isBottleneck ? '#f59e0b' : isAffected ? '#ef4444' : 'transparent');
      node.data('borderWidth', isBottleneck || isAffected ? 3 : 1);
    });
  }, [affectedNodeIds, bottleneckIds, selectedNodeId]);

  if (nodes.length === 0) {
    return (
      <div className="graph-container">
        <div className="graph-loading">
          <div className="spinner" />
          <span>Loading supply chain graph…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="graph-container">
      <div ref={containerRef} className="graph-canvas" />
      <div className="graph-controls">
        <button className="ctrl-btn" title="Fit graph" onClick={() => cyRef.current?.fit(undefined, 40)}>⊙</button>
        <button className="ctrl-btn" title="Zoom in" onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)}>+</button>
        <button className="ctrl-btn" title="Zoom out" onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 0.8)}>−</button>
      </div>
      <div className="graph-legend">
        <div className="legend-title">Node Types</div>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} className="legend-item">
            <div className="legend-dot" style={{ background: color }} />
            {type}
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#ef4444' }} />
          Disrupted / Affected
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'transparent', border: '2px solid #f59e0b' }} />
          Bottleneck
        </div>
      </div>
    </div>
  );
}
