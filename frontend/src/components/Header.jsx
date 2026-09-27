import './Header.css';

export default function Header({ nodeCount, edgeCount }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-icon">🔗</div>
        <div>
          <div className="header-title">Supply Chain Digital Twin</div>
          <div className="header-subtitle">AI-Powered Disruption Simulator</div>
        </div>
      </div>
      <div className="header-status">
        <div className="status-dot" />
        <span>Live</span>
        <span style={{ color: 'var(--border-light)', margin: '0 4px' }}>|</span>
        <span>{nodeCount} Nodes</span>
        <span style={{ color: 'var(--border-light)', margin: '0 4px' }}>·</span>
        <span>{edgeCount} Routes</span>
      </div>
    </header>
  );
}
