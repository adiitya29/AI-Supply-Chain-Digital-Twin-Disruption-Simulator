import { useState, useEffect } from 'react';
import './ScenarioBuilder.css';

const DISRUPTION_TYPES = [
  { value: 'node_down', label: '🔴 Node Down', description: 'A supplier, factory, or warehouse goes offline' },
  { value: 'route_blocked', label: '🚧 Route Blocked', description: 'A transportation route is blocked' },
  { value: 'demand_spike', label: '📈 Demand Spike', description: 'Sudden surge in customer demand' },
];

export default function ScenarioBuilder({ nodes, selectedNodeId, onSimulate, onReset, isLoading }) {
  const [disruptionType, setDisruptionType] = useState('node_down');
  const [targetId, setTargetId] = useState('');
  const [magnitude, setMagnitude] = useState(0.5);
  const [duration, setDuration] = useState(7);

  // When user clicks a node on the graph, auto-fill the target
  useEffect(() => {
    if (selectedNodeId) setTargetId(String(selectedNodeId));
  }, [selectedNodeId]);

  const selectedNode = nodes.find(n => n.id === parseInt(targetId, 10));

  const handleSubmit = () => {
    if (!targetId) return;
    onSimulate({
      disruption_type: disruptionType,
      target_id: parseInt(targetId, 10),
      magnitude,
      duration,
    });
  };

  return (
    <div className="panel">
      <div className="panel-title">
        <span className="icon">⚡</span>
        Scenario Builder
      </div>

      {/* Selected node display */}
      {selectedNode ? (
        <div className="selected-badge">
          🎯 Target: <strong>{selectedNode.name}</strong>
          <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>{selectedNode.type}</span>
        </div>
      ) : (
        <div className="hint-text">Click a node on the graph to select it as the disruption target</div>
      )}

      <div className="form-group">
        <label className="form-label">Disruption Type</label>
        <select
          id="disruption-type-select"
          className="form-select"
          value={disruptionType}
          onChange={e => setDisruptionType(e.target.value)}
        >
          {DISRUPTION_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {DISRUPTION_TYPES.find(t => t.value === disruptionType)?.description}
        </span>
      </div>

      <div className="form-group">
        <label className="form-label">Target Node (or click on graph)</label>
        <select
          id="target-node-select"
          className="form-select"
          value={targetId}
          onChange={e => setTargetId(e.target.value)}
        >
          <option value="">— Select node —</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.type}: {n.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Magnitude — {Math.round(magnitude * 100)}% capacity loss</label>
        <div className="slider-row">
          <input
            id="magnitude-slider"
            type="range"
            min={0.1} max={1.0} step={0.05}
            value={magnitude}
            onChange={e => setMagnitude(parseFloat(e.target.value))}
          />
          <span className="slider-val">{Math.round(magnitude * 100)}%</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Duration — {duration} day{duration !== 1 ? 's' : ''}</label>
        <div className="slider-row">
          <input
            id="duration-slider"
            type="range"
            min={1} max={30} step={1}
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value, 10))}
          />
          <span className="slider-val">{duration}d</span>
        </div>
      </div>

      <button
        id="simulate-btn"
        className="btn btn-danger"
        onClick={handleSubmit}
        disabled={!targetId || isLoading}
      >
        {isLoading ? '⏳ Simulating…' : '🚨 Simulate Disruption'}
      </button>

      <button
        id="reset-btn"
        className="btn btn-ghost"
        onClick={onReset}
        disabled={isLoading}
      >
        ↺ Reset
      </button>
    </div>
  );
}
