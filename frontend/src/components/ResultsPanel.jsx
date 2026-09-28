import { useState } from 'react';
import './ResultsPanel.css';

export default function ResultsPanel({ simulationResult, recommendations, bottlenecks, activeTab, onTabChange, onSaveScenario }) {
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const affected = simulationResult?.affected_nodes ?? [];
  const alts = recommendations?.ranked_alternatives ?? [];
  const bns = bottlenecks?.bottlenecks ?? [];

  const maxCentrality = bns.length ? Math.max(...bns.map(b => b.centrality_score)) : 1;

  const handleSave = () => {
    if (!saveName.trim()) return;
    setIsSaving(true);
    onSaveScenario(saveName).then(() => {
      setSaveName('');
      setIsSaving(false);
    });
  };

  return (
    <div className={`results-panel ${affected.length > 0 ? 'disrupted' : ''}`}>
      {/* Tabs and Save action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        
        {/* Save Scenario UI (only when impact is active) */}
        {simulationResult && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              className="form-input" 
              placeholder="Name this scenario to save..." 
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              style={{ flex: 1, padding: '6px 10px', fontSize: '11px' }}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleSave} 
              disabled={isSaving || !saveName.trim()}
              style={{ width: 'auto', padding: '6px 12px' }}
            >
              {isSaving ? '⏳' : '💾 Save'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px' }}>
          {['impact', 'recovery', 'bottlenecks'].map(tab => (
            <button
              key={tab}
              id={`tab-${tab}`}
              onClick={() => onTabChange(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: '600',
                background: activeTab === tab ? 'var(--accent-blue)' : 'var(--bg-input)',
                color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'impact' && '💥 Impact'}
              {tab === 'recovery' && '🔄 Recovery'}
              {tab === 'bottlenecks' && '⚠️ Bottlenecks'}
            </button>
          ))}
        </div>
      </div>

      {/* ---- IMPACT TAB ---- */}
      {activeTab === 'impact' && (
        <>
          {affected.length === 0 ? (
            <div className="empty-results">
              <div className="big-icon">🛡️</div>
              <div>No disruption simulated yet.</div>
              <div style={{ fontSize: '12px' }}>Use the Scenario Builder → simulate a disruption to see downstream impact here.</div>
            </div>
          ) : (
            <>
              <div className="impact-summary">
                <div className="impact-stat">
                  <div className="impact-stat-value">{affected.length}</div>
                  <div className="impact-stat-label">Affected Nodes</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-stat-value">
                    {Math.max(...affected.map(n => n.delay_days)).toFixed(1)}d
                  </div>
                  <div className="impact-stat-label">Max Delay</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-stat-value">
                    {affected.reduce((s, n) => s + n.shortage_quantity, 0).toLocaleString()}
                  </div>
                  <div className="impact-stat-label">Total Shortage</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-stat-value" style={{ color: 'var(--accent-yellow)' }}>HIGH</div>
                  <div className="impact-stat-label">Risk Level</div>
                </div>
              </div>

              <div className="panel-title" style={{ fontSize: '11px' }}>
                <span className="icon">📋</span>
                Affected Nodes
              </div>

              <div className="affected-list">
                {affected.map((n, i) => (
                  <div key={n.node_id} className="affected-item" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="affected-name">{n.node_name}</div>
                    <div className="affected-stats">
                      <span className="tag tag-red">+{n.delay_days}d delay</span>
                      <span className="tag tag-yellow">{n.shortage_quantity.toLocaleString()} shortage</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ---- RECOVERY TAB ---- */}
      {activeTab === 'recovery' && (
        <>
          {alts.length === 0 ? (
            <div className="empty-results">
              <div className="big-icon">🔄</div>
              <div>No recovery options yet.</div>
              <div style={{ fontSize: '12px' }}>Simulate a disruption first to see ranked recovery alternatives.</div>
            </div>
          ) : (
            <>
              <div className="panel-title" style={{ fontSize: '11px' }}>
                <span className="icon">🏆</span>
                Ranked Alternatives
              </div>

              {alts.map((alt, i) => (
                <div key={alt.node_id} className="alt-item">
                  <div className="alt-header">
                    <div>
                      <div className="alt-rank">#{i + 1} Alternative</div>
                      <div className="alt-name">{alt.name}</div>
                    </div>
                    <div className="alt-score">{alt.score.toFixed(2)}</div>
                  </div>
                  <div className="alt-metrics">
                    <span className="tag tag-green">Reliability {Math.round(alt.reliability_score * 100)}%</span>
                    <span className="tag tag-blue">Lead {alt.lead_time}d</span>
                    <span className="tag tag-yellow">Cost ${alt.cost}</span>
                    <span className="tag tag-red">Cap {alt.capacity}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* ---- BOTTLENECKS TAB ---- */}
      {activeTab === 'bottlenecks' && (
        <>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Nodes ranked by betweenness centrality — higher score = more critical to network flow.
          </div>
          {bns.length === 0 ? (
            <div className="empty-results">
              <div className="big-icon">⚠️</div>
              <div>No bottleneck data available.</div>
            </div>
          ) : (
            <div className="affected-list">
              {bns.map((b, i) => (
                <div key={b.node_id} className="bottleneck-item">
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', minWidth: '20px' }}>#{i + 1}</span>
                  <span className="bottleneck-name">{b.node_name}</span>
                  <div className="centrality-bar-bg">
                    <div
                      className="centrality-bar-fill"
                      style={{ width: `${(b.centrality_score / maxCentrality) * 100}%` }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '34px' }}>
                    {b.centrality_score.toFixed(3)}
                  </span>
                  {b.is_single_point_of_failure && <span className="spof-badge">SPOF</span>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
