import { useEffect, useState } from 'react';
import { fetchScenarios } from '../api';
import './ScenarioHistory.css';

export default function ScenarioHistory({ onLoadScenario, refreshTrigger }) {
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    fetchScenarios().then(setScenarios).catch(console.error);
  }, [refreshTrigger]);

  if (scenarios.length === 0) return null;

  return (
    <div className="panel history-panel">
      <div className="panel-title">
        <span className="icon">🕒</span>
        Saved Scenarios
      </div>
      <div className="history-list">
        {scenarios.map(s => (
          <div key={s.id} className="history-item" onClick={() => onLoadScenario(s)}>
            <div className="history-header">
              <span className="history-name">{s.name}</span>
              <span className="history-date">{new Date(s.created_at).toLocaleDateString()}</span>
            </div>
            <div className="history-details">
              <span>Node #{s.target_node_id}</span>
              <span>{Math.round(s.magnitude * 100)}% cap</span>
              <span>{s.duration}d</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
