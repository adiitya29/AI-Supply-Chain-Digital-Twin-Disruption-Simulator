import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

/* ────────── Animated SVG network background ────────── */
const NetworkGraph = () => (
  <svg viewBox="0 0 900 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }} aria-hidden="true">
    <defs>
      <filter id="lp-glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <line x1="120" y1="200" x2="300" y2="140" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="120" y1="200" x2="290" y2="310" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="300" y1="140" x2="500" y2="100" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="500" y1="100" x2="680" y2="150" stroke="#fb923c" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="6 4">
      <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite" />
    </line>
    <line x1="680" y1="150" x2="800" y2="220" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="290" y1="310" x2="460" y2="360" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="460" y1="360" x2="650" y2="380" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="650" y1="380" x2="800" y2="340" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="800" y1="220" x2="800" y2="340" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="300" y1="140" x2="800" y2="220" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="8 4">
      <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite" />
    </line>
    {[
      { cx: 120, cy: 200, r: 16, stroke: '#22d3ee', label: 'S1' },
      { cx: 300, cy: 140, r: 14, stroke: '#22d3ee', label: 'F1' },
      { cx: 290, cy: 310, r: 14, stroke: '#22d3ee', label: 'F2' },
      { cx: 460, cy: 360, r: 14, stroke: '#22d3ee', label: 'W2' },
      { cx: 680, cy: 150, r: 14, stroke: '#22d3ee', label: 'D1' },
      { cx: 650, cy: 380, r: 14, stroke: '#22d3ee', label: 'D2' },
      { cx: 800, cy: 340, r: 14, stroke: '#22d3ee', label: 'D3' },
    ].map(n => (
      <g key={n.label}>
        <circle cx={n.cx} cy={n.cy} r={n.r} fill="#0d1628" stroke={n.stroke} strokeWidth="1.5" filter="url(#lp-glow)" style={{ animation: 'pulse-node 3s ease-in-out infinite' }} />
        <text x={n.cx} y={n.cy + 4} textAnchor="middle" fill={n.stroke} fontSize="8" fontFamily="monospace">{n.label}</text>
      </g>
    ))}
    <circle cx={500} cy={100} r={18} fill="#1a0a00" stroke="#fb923c" strokeWidth="2.5" filter="url(#lp-glow)" style={{ animation: 'pulse-node 1.5s ease-in-out infinite' }} />
    <text x={500} y={96} textAnchor="middle" fill="#fb923c" fontSize="8" fontFamily="monospace">W1</text>
    <text x={500} y={108} textAnchor="middle" fill="#fb923c" fontSize="9">⚠</text>
    <circle cx={800} cy={220} r={16} fill="#001a10" stroke="#34d399" strokeWidth="2" filter="url(#lp-glow)" style={{ animation: 'pulse-node 3s ease-in-out infinite 2s' }} />
    <text x={800} y={224} textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="monospace">END</text>
  </svg>
);

/* ────────── Data ────────── */
const features = [
  { icon: '◈', title: 'Interactive Network Mapping', body: 'Visualize your entire supply chain using our interactive graph. Instantly understand dependencies between suppliers, factories, and warehouses.', accent: '#22d3ee', accentBg: 'rgba(34,211,238,0.08)' },
  { icon: '⚡', title: 'Real-time Disruption Engine', body: 'Inject disruptions like disasters, port blockages, or bankruptcies. Watch downstream impact propagate through your network in milliseconds.', accent: '#fb923c', accentBg: 'rgba(251,146,60,0.08)' },
  { icon: '◎', title: 'Intelligent Recovery Algorithms', body: "Don't just find problems — fix them. Our engine calculates optimal alternative routes based on cost, lead time, and reliability scores.", accent: '#22d3ee', accentBg: 'rgba(34,211,238,0.08)' },
  { icon: '⌖', title: 'Predictive Bottleneck Analysis', body: 'Proactively identify Single Points of Failure (SPOF). We use betweenness centrality to rank vulnerable nodes before a crisis happens.', accent: '#fb923c', accentBg: 'rgba(251,146,60,0.08)' },
  { icon: '◉', title: 'Scenario History & Persistence', body: 'Save and reload complex what-if simulations. Compare different mitigation strategies side-by-side to prepare for any scenario.', accent: '#34d399', accentBg: 'rgba(52,211,153,0.08)' },
];

const impactMetrics = [
  { label: 'Affected Nodes', value: '14', unit: 'nodes', color: '#fb923c' },
  { label: 'Maximum Delay', value: '9.3', unit: 'days', color: '#fb923c' },
  { label: 'Total Shortage', value: '42,800', unit: 'units', color: '#fb923c' },
];

const recoveryMetrics = [
  { label: 'Route Reliability', value: '97.2', unit: '%', color: '#34d399' },
  { label: 'Alt Lead Time', value: '3.1', unit: 'days', color: '#22d3ee' },
  { label: 'Cost Impact', value: '+$18K', unit: 'est.', color: '#22d3ee' },
  { label: 'Alt Capacity', value: '12,000', unit: 'units/day', color: '#34d399' },
];

const techStack = [
  { label: 'React', category: 'Frontend' }, { label: 'Vite', category: 'Frontend' },
  { label: 'Cytoscape.js', category: 'Graph' }, { label: 'Python', category: 'Backend' },
  { label: 'FastAPI', category: 'Backend' }, { label: 'NetworkX', category: 'Graph' },
  { label: 'PostgreSQL', category: 'Database' }, { label: 'Supabase', category: 'Database' },
  { label: 'SQLAlchemy', category: 'ORM' }, { label: 'Docker', category: 'Infra' },
  { label: 'Uvicorn', category: 'Infra' },
];

/* ────────── Styles shorthand ────────── */
const S = {
  page: { background: '#040810', minHeight: '100vh', fontFamily: 'Outfit, Inter, sans-serif', color: '#e2e8f0', overflowX: 'hidden' },
  section: (bg) => ({ background: bg || '#040810', padding: '96px 24px' }),
  inner: { maxWidth: 1152, margin: '0 auto' },
  label: { fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(34,211,238,0.65)', fontFamily: 'monospace', marginBottom: 16 },
  h2: { fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 16 },
  cyan: { color: '#22d3ee', textShadow: '0 0 32px rgba(34,211,238,0.4)' },
  muted: { color: 'rgba(226,232,240,0.55)', fontSize: 15, lineHeight: 1.7 },
  gridLine: (color) => ({ background: `linear-gradient(${color || 'rgba(34,211,238,0.04)'} 1px, transparent 1px), linear-gradient(90deg, ${color || 'rgba(34,211,238,0.04)'} 1px, transparent 1px)`, backgroundSize: '60px 60px' }),
  card: (accent) => ({ background: 'rgba(13,22,40,0.7)', border: `1px solid ${accent || 'rgba(34,211,238,0.15)'}`, borderRadius: 12, padding: 32, position: 'relative', overflow: 'hidden' }),
  topGlow: (color) => ({ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}55, transparent)` }),
};

/* ────────── Component ────────── */
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goSim = () => navigate('/simulator');

  return (
    <div style={S.page}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        background: scrolled ? 'rgba(4,8,16,0.9)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(34,211,238,0.1)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 700, fontSize: 12 }}>SC</div>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#e2e8f0' }}>SupplyTwin<span style={{ color: '#22d3ee' }}>.ai</span></span>
        </div>
        <div className="lp-nav-links" style={{ display: 'none', alignItems: 'center', gap: 32 }}>
          {['Features', 'Dashboard', 'Stack'].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="lp-nav-link">{l}</a>)}
        </div>
        <button onClick={goSim} className="lp-cta-primary" style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: 12, letterSpacing: '0.06em' }}>
          LAUNCH SIMULATOR
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', padding: '0 24px' }}>
        <div style={{ position: 'absolute', inset: 0, ...S.gridLine() }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(34,211,238,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><NetworkGraph /></div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 860, animation: 'float-up 0.8s ease forwards' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)', color: '#fdba74', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.04em', marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fb923c', boxShadow: '0 0 6px #fb923c', display: 'inline-block', animation: 'pulse-node 1.5s ease-in-out infinite' }} />
            DISRUPTION SIMULATION ACTIVE — WHAT-IF MODE
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24 }}>
            Resilient Supply Chains,{' '}
            <span style={S.cyan}>Powered by AI.</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'rgba(226,232,240,0.65)', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Simulate disruptions, identify critical bottlenecks, and generate intelligent recovery strategies in real-time with our interactive digital twin platform.
          </p>

          <div className="lp-hero-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <button onClick={goSim} className="lp-cta-primary" style={{ background: '#22d3ee', color: '#040810', padding: '16px 40px', borderRadius: 6, fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', boxShadow: '0 0 28px rgba(34,211,238,0.35)' }}>
              LAUNCH SIMULATOR
            </button>
            <button className="lp-cta-secondary" style={{ background: 'transparent', color: '#e2e8f0', padding: '16px 40px', borderRadius: 6, fontWeight: 600, fontSize: 13, letterSpacing: '0.06em', border: '1px solid rgba(226,232,240,0.2)' }}>
              ▶ WATCH DEMO
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 128, background: 'linear-gradient(transparent, #040810)', pointerEvents: 'none' }} />
      </section>

      {/* ── PROBLEM & SOLUTION ── */}
      <section style={S.section()}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', ...S.label, marginBottom: 48 }}>// WHY THIS EXISTS</div>
          <div className="lp-grid-2">
            {[
              { accent: '#fb923c', bg: 'rgba(251,146,60,0.05)', icon: '⚠', tag: 'THE PROBLEM', title: 'Global supply chains are fragile.', body: 'A single factory shutdown or port delay can trigger cascading shortages, costing millions across the network. Traditional spreadsheets can\'t predict downstream impact fast enough — by the time you react, the damage is done.', titleColor: '#fde68a' },
              { accent: '#22d3ee', bg: 'rgba(34,211,238,0.04)', icon: '◎', tag: 'THE SOLUTION', title: 'A living digital twin.', body: 'By mapping your entire network — Suppliers → Factories → Warehouses — you can inject any what-if disruption and instantly see the blast radius and optimal recovery paths, before reality forces your hand.', titleColor: '#e2e8f0' },
            ].map(c => (
              <div key={c.tag} style={{ ...S.card(`${c.accent}33`), background: c.bg }}>
                <div style={S.topGlow(c.accent)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${c.accent}22`, border: `1px solid ${c.accent}44`, fontSize: 16 }}>{c.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: c.accent, fontFamily: 'monospace' }}>{c.tag}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: c.titleColor, marginBottom: 16 }}>{c.title}</h3>
                <p style={S.muted}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={S.section('#06090f')}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={S.label}>// CORE CAPABILITIES</div>
            <h2 style={S.h2}>How It Works</h2>
            <p style={{ ...S.muted, maxWidth: 480, margin: '0 auto' }}>Five interconnected capabilities that turn supply chain uncertainty into strategic advantage.</p>
          </div>
          <div className="lp-grid-2" style={{ marginBottom: 20 }}>
            {features.slice(0, 2).map(f => (
              <div key={f.title} className="lp-feature-card" style={{ ...S.card(`${f.accent}22`), background: 'rgba(13,22,40,0.7)' }}>
                <div style={S.topGlow(f.accent)} />
                <div style={{ width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: f.accentBg, border: `1px solid ${f.accent}33`, marginBottom: 20, color: f.accent }}>{f.icon}</div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#e2e8f0', marginBottom: 12 }}>{f.title}</h3>
                <p style={S.muted}>{f.body}</p>
              </div>
            ))}
          </div>
          <div className="lp-grid-3">
            {features.slice(2).map(f => (
              <div key={f.title} className="lp-feature-card" style={{ ...S.card(`${f.accent}22`), background: 'rgba(13,22,40,0.7)', padding: 28 }}>
                <div style={S.topGlow(f.accent)} />
                <div style={{ width: 44, height: 44, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: f.accentBg, border: `1px solid ${f.accent}33`, marginBottom: 16, color: f.accent }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ ...S.muted, fontSize: 14 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD SHOWCASE ── */}
      <section id="dashboard" style={S.section()}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ ...S.label, color: 'rgba(251,146,60,0.7)' }}>// BLAST RADIUS DASHBOARD</div>
            <h2 style={S.h2}>From disruption to resolution —<br /><span style={S.cyan}>in one view.</span></h2>
          </div>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(34,211,238,0.12)', boxShadow: '0 0 80px rgba(34,211,238,0.07)', background: '#06090f' }}>
            {/* Panel header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid rgba(34,211,238,0.1)', background: 'rgba(13,22,40,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#fb923c', '#fbbf24', '#34d399'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)', fontFamily: 'monospace' }}>scenario_2024_port_closure.sim</span>
              </div>
              <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 4, background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c', fontFamily: 'monospace' }}>● DISRUPTION ACTIVE</span>
            </div>
            <div className="lp-grid-2" style={{ padding: 32, gap: 32 }}>
              {/* Impact */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#fb923c', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fb923c', display: 'inline-block' }} />IMPACT METRICS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {impactMetrics.map(m => (
                    <div key={m.label} className="lp-metric-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderRadius: 8, background: 'rgba(251,146,60,0.05)', border: '1px solid rgba(251,146,60,0.15)' }}>
                      <span style={{ fontSize: 14, color: 'rgba(226,232,240,0.6)' }}>{m.label}</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: m.color }}>{m.value}</span>
                        <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.4)', fontFamily: 'monospace' }}>{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recovery */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#34d399', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />RECOVERY RECOMMENDATIONS
                </div>
                <div className="lp-grid-4">
                  {recoveryMetrics.map(m => (
                    <div key={m.label} className="lp-metric-card" style={{ padding: 20, borderRadius: 8, background: 'rgba(13,22,40,0.8)', border: `1px solid ${m.color}33` }}>
                      <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.5)', display: 'block', marginBottom: 8 }}>{m.label}</span>
                      <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: m.color, display: 'block' }}>{m.value}</span>
                      <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.35)', fontFamily: 'monospace' }}>{m.unit}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', display: 'flex', gap: 12 }}>
                  <span style={{ color: '#22d3ee', fontSize: 16, marginTop: 2 }}>◎</span>
                  <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.65)', lineHeight: 1.6, margin: 0 }}>
                    <span style={{ color: '#22d3ee', fontWeight: 600 }}>Recommendation: </span>
                    Reroute via Supplier S3 → Factory F2. Estimated recovery in 3.1 days, 97.2% reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section id="stack" style={S.section('#06090f')}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={S.label}>// BUILT WITH</div>
            <h2 style={S.h2}>Robust engineering under the hood.</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {techStack.map(t => (
              <div key={t.label} className="lp-tech-badge" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, background: 'rgba(13,22,40,0.8)', border: '1px solid rgba(34,211,238,0.12)', cursor: 'default' }}>
                <span style={{ fontSize: 10, color: 'rgba(34,211,238,0.5)', fontFamily: 'monospace' }}>{t.category}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#cbd5e1' }}>{t.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 48 }}>
            {[['Suppliers', '#22d3ee'], ['→', 'rgba(226,232,240,0.3)'], ['Factories', '#22d3ee'], ['→', 'rgba(226,232,240,0.3)'], ['Warehouses', '#22d3ee'], ['→', 'rgba(226,232,240,0.3)'], ['Distribution', '#34d399']].map(([label, color], i) => (
              <span key={i} style={{ fontSize: 14, fontWeight: 600, color, letterSpacing: '0.04em', textShadow: color !== 'rgba(226,232,240,0.3)' ? `0 0 16px ${color}55` : 'none' }}>{label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ ...S.section(), position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(34,211,238,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, ...S.gridLine('rgba(34,211,238,0.03)'), pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={S.label}>// GET STARTED</div>
          <h2 style={S.h2}>Ready to build a <span style={S.cyan}>resilient</span> supply chain?</h2>
          <p style={{ ...S.muted, marginBottom: 40 }}>Model your network, inject disruptions, and receive AI-powered recovery recommendations — all in one platform.</p>
          <button onClick={goSim} className="lp-cta-primary" style={{ background: '#22d3ee', color: '#040810', padding: '18px 48px', borderRadius: 6, fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', boxShadow: '0 0 32px rgba(34,211,238,0.35)' }}>
            START SIMULATING NOW
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '40px 48px', borderTop: '1px solid rgba(34,211,238,0.08)', background: '#040810' }}>
        <div className="lp-footer-inner" style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', fontWeight: 700, fontSize: 11 }}>SC</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(226,232,240,0.45)' }}>SupplyTwin</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['GitHub Repo', 'Documentation', 'About'].map(l => <a key={l} href="#" className="lp-nav-link" style={{ fontSize: 12 }}>{l}</a>)}
          </div>
          <span style={{ fontSize: 11, color: 'rgba(226,232,240,0.25)', fontFamily: 'monospace' }}>PS-04 · AI Supply Chain Digital Twin</span>
        </div>
      </footer>
    </div>
  );
}
