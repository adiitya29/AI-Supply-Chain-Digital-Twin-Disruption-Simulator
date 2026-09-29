import { useState, useEffect } from "react";

const NetworkGraph = () => (
  <svg
    viewBox="0 0 900 500"
    className="absolute inset-0 w-full h-full"
    style={{ opacity: 0.18 }}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="node-glow-cyan" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="node-glow-amber" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fb923c" stopOpacity="1" />
        <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="node-glow-green" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Edges — normal routes */}
    <line x1="120" y1="200" x2="300" y2="140" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="120" y1="200" x2="290" y2="310" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="300" y1="140" x2="500" y2="100" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="500" y1="100" x2="680" y2="150" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="680" y1="150" x2="800" y2="220" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="290" y1="310" x2="460" y2="360" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="460" y1="360" x2="650" y2="380" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="650" y1="380" x2="800" y2="340" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="800" y1="220" x2="800" y2="340" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.5" />
    <line x1="500" y1="100" x2="460" y2="360" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.25" />
    <line x1="300" y1="140" x2="460" y2="360" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.25" />

    {/* Disrupted edge */}
    <line x1="500" y1="100" x2="680" y2="150" stroke="#fb923c" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="6 4">
      <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite" />
    </line>

    {/* Recovery route — alternate path */}
    <line x1="300" y1="140" x2="800" y2="220" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="8 4">
      <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite" />
    </line>

    {/* Supplier nodes */}
    <circle cx="120" cy="200" r="16" fill="#0d1628" stroke="#22d3ee" strokeWidth="2" filter="url(#glow)" style={{ animation: "pulse-node 3s ease-in-out infinite" }} />
    <text x="120" y="205" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="JetBrains Mono">S1</text>

    {/* Factory nodes */}
    <circle cx="300" cy="140" r="14" fill="#0d1628" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow)" style={{ animation: "pulse-node 3.4s ease-in-out infinite 0.3s" }} />
    <text x="300" y="145" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="JetBrains Mono">F1</text>

    <circle cx="290" cy="310" r="14" fill="#0d1628" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow)" style={{ animation: "pulse-node 2.8s ease-in-out infinite 0.8s" }} />
    <text x="290" y="315" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="JetBrains Mono">F2</text>

    {/* Disrupted node */}
    <circle cx="500" cy="100" r="18" fill="#1a0a00" stroke="#fb923c" strokeWidth="2.5" filter="url(#glow)" style={{ animation: "pulse-node 1.5s ease-in-out infinite" }} />
    <text x="500" y="96" textAnchor="middle" fill="#fb923c" fontSize="8" fontFamily="JetBrains Mono">W1</text>
    <text x="500" y="107" textAnchor="middle" fill="#fb923c" fontSize="7" fontFamily="JetBrains Mono">⚠</text>

    {/* Warehouse nodes */}
    <circle cx="460" cy="360" r="14" fill="#0d1628" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow)" style={{ animation: "pulse-node 3.2s ease-in-out infinite 1.1s" }} />
    <text x="460" y="365" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="JetBrains Mono">W2</text>

    <circle cx="680" cy="150" r="14" fill="#0d1628" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow)" style={{ animation: "pulse-node 2.6s ease-in-out infinite 0.5s" }} />
    <text x="680" y="155" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="JetBrains Mono">D1</text>

    <circle cx="650" cy="380" r="14" fill="#0d1628" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow)" style={{ animation: "pulse-node 3.8s ease-in-out infinite 1.6s" }} />
    <text x="650" y="385" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="JetBrains Mono">D2</text>

    {/* Destination */}
    <circle cx="800" cy="220" r="16" fill="#001a10" stroke="#34d399" strokeWidth="2" filter="url(#glow)" style={{ animation: "pulse-node 3s ease-in-out infinite 2s" }} />
    <text x="800" y="225" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="JetBrains Mono">END</text>

    <circle cx="800" cy="340" r="14" fill="#0d1628" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow)" style={{ animation: "pulse-node 2.9s ease-in-out infinite 0.9s" }} />
    <text x="800" y="345" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="JetBrains Mono">D3</text>
  </svg>
);

const features = [
  {
    icon: "◈",
    title: "Interactive Network Mapping",
    body: "Visualize your entire supply chain architecture using our interactive graph view. Instantly understand dependencies between suppliers, factories, and warehouses.",
    accent: "cyan",
  },
  {
    icon: "⚡",
    title: "Real-time Disruption Engine",
    body: "Inject real-world disruptions like natural disasters, port blockages, or supplier bankruptcies. Watch downstream impact propagate through the network in milliseconds.",
    accent: "amber",
  },
  {
    icon: "◎",
    title: "Intelligent Recovery Algorithms",
    body: "Don't just find problems — fix them. Our engine instantly calculates optimal alternative routes based on cost, lead time, and reliability scores.",
    accent: "cyan",
  },
  {
    icon: "⌖",
    title: "Predictive Bottleneck Analysis",
    body: "Proactively identify Single Points of Failure (SPOF). We use betweenness centrality to rank the most vulnerable nodes before a crisis even happens.",
    accent: "amber",
  },
  {
    icon: "◉",
    title: "Scenario History & Persistence",
    body: "Save and reload complex what-if simulations. Compare different mitigation strategies side-by-side to prepare your team for any scenario.",
    accent: "emerald",
  },
];

const impactMetrics = [
  { label: "Affected Nodes", value: "14", unit: "nodes", color: "amber" },
  { label: "Maximum Delay", value: "9.3", unit: "days", color: "amber" },
  { label: "Total Shortage", value: "42,800", unit: "units", color: "amber" },
];

const recoveryMetrics = [
  { label: "Route Reliability", value: "97.2", unit: "%", color: "emerald" },
  { label: "Alt Lead Time", value: "3.1", unit: "days", color: "cyan" },
  { label: "Cost Impact", value: "+$18K", unit: "est.", color: "cyan" },
  { label: "Alt Capacity", value: "12,000", unit: "units/day", color: "emerald" },
];

const techStack = [
  { label: "React", category: "Frontend" },
  { label: "Vite", category: "Frontend" },
  { label: "Cytoscape.js", category: "Graph" },
  { label: "Python", category: "Backend" },
  { label: "FastAPI", category: "Backend" },
  { label: "NetworkX", category: "Graph" },
  { label: "PostgreSQL", category: "Database" },
  { label: "Supabase", category: "Database" },
  { label: "SQLAlchemy", category: "ORM" },
  { label: "Docker", category: "Infra" },
  { label: "Uvicorn", category: "Infra" },
];

const accentStyles = {
  cyan: {
    border: "rgba(34,211,238,0.18)",
    iconColor: "#22d3ee",
    badge: "rgba(34,211,238,0.1)",
  },
  amber: {
    border: "rgba(251,146,60,0.2)",
    iconColor: "#fb923c",
    badge: "rgba(251,146,60,0.1)",
  },
  emerald: {
    border: "rgba(52,211,153,0.18)",
    iconColor: "#34d399",
    badge: "rgba(52,211,153,0.1)",
  },
};

const metricColorStyles = {
  amber: { value: "#fb923c", glow: "rgba(251,146,60,0.15)" },
  cyan: { value: "#22d3ee", glow: "rgba(34,211,238,0.12)" },
  emerald: { value: "#34d399", glow: "rgba(52,211,153,0.12)" },
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#040810", fontFamily: "Outfit, sans-serif" }}>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(4,8,16,0.9)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(34,211,238,0.1)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
            style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.4)", color: "#22d3ee", fontFamily: "Exo 2, sans-serif" }}
          >
            SC
          </div>
          <span className="font-semibold text-sm tracking-wide" style={{ fontFamily: "Exo 2, sans-serif", color: "#e2e8f0" }}>
            SupplyTwin<span style={{ color: "#22d3ee" }}>.ai</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Dashboard", "Stack", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link text-sm"
              style={{ color: "rgba(226,232,240,0.6)", textDecoration: "none", fontFamily: "Outfit, sans-serif" }}
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="http://localhost:5173"
          className="cta-btn-primary text-xs font-semibold px-4 py-2 rounded"
          style={{
            background: "rgba(34,211,238,0.15)",
            border: "1px solid rgba(34,211,238,0.4)",
            color: "#22d3ee",
            textDecoration: "none",
            fontFamily: "Exo 2, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          LAUNCH SIMULATOR
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6">
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial vignette glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(34,211,238,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Network graph */}
        <div className="absolute inset-0 overflow-hidden">
          <NetworkGraph />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto" style={{ animation: "float-up 0.8s ease forwards" }}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: "rgba(251,146,60,0.1)",
              border: "1px solid rgba(251,146,60,0.3)",
              color: "#fdba74",
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.04em",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#fb923c", boxShadow: "0 0 6px #fb923c", animation: "pulse-node 1.5s ease-in-out infinite" }}
            />
            DISRUPTION SIMULATION ACTIVE — WHAT-IF MODE
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{
              fontFamily: "Exo 2, sans-serif",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
            }}
          >
            Resilient Supply Chains,{" "}
            <span
              style={{
                color: "#22d3ee",
                textShadow: "0 0 40px rgba(34,211,238,0.5)",
              }}
            >
              Powered by AI.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(226,232,240,0.65)", fontFamily: "Outfit, sans-serif", fontWeight: 400 }}
          >
            Simulate disruptions, identify critical bottlenecks, and generate intelligent recovery
            strategies in real-time with our interactive digital twin platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="http://localhost:5173"
              className="cta-btn-primary w-full sm:w-auto px-8 py-4 rounded font-bold text-sm tracking-wider"
              style={{
                background: "#22d3ee",
                color: "#040810",
                fontFamily: "Exo 2, sans-serif",
                letterSpacing: "0.08em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(34,211,238,0.3)",
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              LAUNCH SIMULATOR
            </a>
            <button
              className="cta-btn-secondary w-full sm:w-auto px-8 py-4 rounded font-semibold text-sm tracking-wider"
              style={{
                background: "transparent",
                color: "#e2e8f0",
                fontFamily: "Exo 2, sans-serif",
                letterSpacing: "0.06em",
                border: "1px solid rgba(226,232,240,0.2)",
                cursor: "pointer",
              }}
            >
              ▶ WATCH DEMO
            </button>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(transparent, #040810)" }}
        />
      </section>

      {/* ── PROBLEM & SOLUTION ── */}
      <section className="py-24 px-6 md:px-12" style={{ background: "#040810" }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="text-xs font-medium tracking-widest mb-12 text-center"
            style={{ color: "rgba(34,211,238,0.6)", fontFamily: "JetBrains Mono, monospace" }}
          >
            // WHY THIS EXISTS
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Problem */}
            <div
              className="p-8 rounded-xl relative overflow-hidden"
              style={{
                background: "rgba(251,146,60,0.05)",
                border: "1px solid rgba(251,146,60,0.2)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.5), transparent)" }}
              />
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded flex items-center justify-center text-base"
                  style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}
                >
                  ⚠
                </div>
                <span
                  className="text-xs font-semibold tracking-widest"
                  style={{ color: "#fb923c", fontFamily: "JetBrains Mono, monospace" }}
                >
                  THE PROBLEM
                </span>
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "Exo 2, sans-serif", color: "#fde68a", fontWeight: 700 }}
              >
                Global supply chains are fragile.
              </h3>
              <p style={{ color: "rgba(226,232,240,0.65)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                A single factory shutdown or port delay can trigger cascading shortages, costing millions across the network. Traditional spreadsheets can't predict downstream impact fast enough — by the time you react, the damage is done.
              </p>
            </div>

            {/* Solution */}
            <div
              className="p-8 rounded-xl relative overflow-hidden"
              style={{
                background: "rgba(34,211,238,0.04)",
                border: "1px solid rgba(34,211,238,0.18)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)" }}
              />
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded flex items-center justify-center text-base"
                  style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)" }}
                >
                  ◎
                </div>
                <span
                  className="text-xs font-semibold tracking-widest"
                  style={{ color: "#22d3ee", fontFamily: "JetBrains Mono, monospace" }}
                >
                  THE SOLUTION
                </span>
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "Exo 2, sans-serif", color: "#e2e8f0", fontWeight: 700 }}
              >
                A living digital twin.
              </h3>
              <p style={{ color: "rgba(226,232,240,0.65)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                By mapping your entire network — Suppliers → Factories → Warehouses — you can inject any what-if disruption and instantly see the blast radius and optimal recovery paths, before reality forces your hand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 md:px-12" style={{ background: "#06090f" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="text-xs font-medium tracking-widest mb-4"
              style={{ color: "rgba(34,211,238,0.6)", fontFamily: "JetBrains Mono, monospace" }}
            >
              // CORE CAPABILITIES
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "Exo 2, sans-serif", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}
            >
              How It Works
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "rgba(226,232,240,0.55)" }}>
              Five interconnected capabilities that turn supply chain uncertainty into strategic advantage.
            </p>
          </div>

          {/* Asymmetric grid: 2 large + 3 below */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {features.slice(0, 2).map((f) => {
              const s = accentStyles[f.accent];
              return (
                <div
                  key={f.title}
                  className="feature-card p-8 rounded-xl relative overflow-hidden"
                  style={{
                    background: "rgba(13,22,40,0.7)",
                    border: `1px solid ${s.border}`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${s.iconColor}55, transparent)`,
                    }}
                  />
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-5"
                    style={{ background: s.badge, border: `1px solid ${s.border}` }}
                  >
                    <span style={{ color: s.iconColor }}>{f.icon}</span>
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "Exo 2, sans-serif", fontWeight: 700, color: "#e2e8f0" }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ color: "rgba(226,232,240,0.6)", lineHeight: 1.7, fontSize: "0.9rem" }}>{f.body}</p>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.slice(2).map((f) => {
              const s = accentStyles[f.accent];
              return (
                <div
                  key={f.title}
                  className="feature-card p-7 rounded-xl relative overflow-hidden"
                  style={{
                    background: "rgba(13,22,40,0.7)",
                    border: `1px solid ${s.border}`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${s.iconColor}55, transparent)`,
                    }}
                  />
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-xl mb-4"
                    style={{ background: s.badge, border: `1px solid ${s.border}` }}
                  >
                    <span style={{ color: s.iconColor }}>{f.icon}</span>
                  </div>
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{ fontFamily: "Exo 2, sans-serif", fontWeight: 700, color: "#e2e8f0" }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ color: "rgba(226,232,240,0.6)", lineHeight: 1.7, fontSize: "0.875rem" }}>{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD SHOWCASE ── */}
      <section id="dashboard" className="py-24 px-6 md:px-12" style={{ background: "#040810" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="text-xs font-medium tracking-widest mb-4"
              style={{ color: "rgba(251,146,60,0.7)", fontFamily: "JetBrains Mono, monospace" }}
            >
              // BLAST RADIUS DASHBOARD
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "Exo 2, sans-serif", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}
            >
              From disruption to resolution —<br />
              <span style={{ color: "#22d3ee" }}>in one view.</span>
            </h2>
          </div>

          {/* Mock dashboard panel */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#06090f",
              border: "1px solid rgba(34,211,238,0.12)",
              boxShadow: "0 0 80px rgba(34,211,238,0.07)",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(34,211,238,0.1)", background: "rgba(13,22,40,0.5)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#fb923c" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#fbbf24" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#34d399" }} />
                </div>
                <span
                  className="text-xs"
                  style={{ color: "rgba(226,232,240,0.4)", fontFamily: "JetBrains Mono, monospace" }}
                >
                  scenario_2024_port_closure.sim
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    background: "rgba(251,146,60,0.12)",
                    border: "1px solid rgba(251,146,60,0.3)",
                    color: "#fb923c",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  ● DISRUPTION ACTIVE
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
              {/* Impact metrics */}
              <div>
                <div
                  className="text-xs font-semibold tracking-widest mb-5 flex items-center gap-2"
                  style={{ color: "#fb923c", fontFamily: "JetBrains Mono, monospace" }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: "#fb923c" }} />
                  IMPACT METRICS
                </div>
                <div className="flex flex-col gap-4">
                  {impactMetrics.map((m) => {
                    const c = metricColorStyles[m.color];
                    return (
                      <div
                        key={m.label}
                        className="metric-card flex items-center justify-between px-5 py-4 rounded-lg"
                        style={{
                          background: "rgba(251,146,60,0.05)",
                          border: "1px solid rgba(251,146,60,0.15)",
                        }}
                      >
                        <span className="text-sm" style={{ color: "rgba(226,232,240,0.6)" }}>{m.label}</span>
                        <div className="flex items-baseline gap-2">
                          <span
                            className="text-2xl font-bold"
                            style={{ fontFamily: "JetBrains Mono, monospace", color: c.value }}
                          >
                            {m.value}
                          </span>
                          <span className="text-xs" style={{ color: "rgba(226,232,240,0.4)", fontFamily: "JetBrains Mono, monospace" }}>
                            {m.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recovery metrics */}
              <div>
                <div
                  className="text-xs font-semibold tracking-widest mb-5 flex items-center gap-2"
                  style={{ color: "#34d399", fontFamily: "JetBrains Mono, monospace" }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} />
                  RECOVERY RECOMMENDATIONS
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {recoveryMetrics.map((m) => {
                    const c = metricColorStyles[m.color];
                    return (
                      <div
                        key={m.label}
                        className="metric-card p-5 rounded-lg"
                        style={{
                          background: "rgba(13,22,40,0.8)",
                          border: `1px solid ${c.glow.replace("0.12", "0.2").replace("0.15", "0.2")}`,
                        }}
                      >
                        <span
                          className="text-xs block mb-2"
                          style={{ color: "rgba(226,232,240,0.5)", fontFamily: "Outfit, sans-serif" }}
                        >
                          {m.label}
                        </span>
                        <span
                          className="text-xl font-bold block"
                          style={{ fontFamily: "JetBrains Mono, monospace", color: c.value }}
                        >
                          {m.value}
                        </span>
                        <span
                          className="text-xs mt-1 block"
                          style={{ color: "rgba(226,232,240,0.35)", fontFamily: "JetBrains Mono, monospace" }}
                        >
                          {m.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="mt-4 px-4 py-3 rounded-lg flex items-start gap-3"
                  style={{
                    background: "rgba(34,211,238,0.06)",
                    border: "1px solid rgba(34,211,238,0.2)",
                  }}
                >
                  <span style={{ color: "#22d3ee", fontSize: "1rem", marginTop: "1px" }}>◎</span>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(226,232,240,0.65)" }}>
                    <span style={{ color: "#22d3ee", fontWeight: 600 }}>AI Recommendation:</span> Reroute via Supplier S3 → Factory F2 → Distribution D1. Estimated recovery in 3.1 days with 97.2% reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section id="stack" className="py-24 px-6 md:px-12" style={{ background: "#06090f" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="text-xs font-medium tracking-widest mb-4"
              style={{ color: "rgba(34,211,238,0.6)", fontFamily: "JetBrains Mono, monospace" }}
            >
              // BUILT WITH
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "Exo 2, sans-serif", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}
            >
              Robust engineering under the hood.
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((t) => (
              <div
                key={t.label}
                className="tech-badge flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{
                  background: "rgba(13,22,40,0.8)",
                  border: "1px solid rgba(34,211,238,0.12)",
                  cursor: "default",
                }}
              >
                <span
                  className="text-xs"
                  style={{
                    color: "rgba(34,211,238,0.5)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.65rem",
                  }}
                >
                  {t.category}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#cbd5e1", fontFamily: "Exo 2, sans-serif" }}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>

          {/* Architecture visual */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {[
              { label: "Suppliers", color: "#22d3ee" },
              { label: "→", color: "rgba(226,232,240,0.3)" },
              { label: "Factories", color: "#22d3ee" },
              { label: "→", color: "rgba(226,232,240,0.3)" },
              { label: "Warehouses", color: "#22d3ee" },
              { label: "→", color: "rgba(226,232,240,0.3)" },
              { label: "Distribution", color: "#34d399" },
            ].map((item, i) => (
              <span
                key={i}
                className="text-sm font-semibold"
                style={{
                  color: item.color,
                  fontFamily: "Exo 2, sans-serif",
                  letterSpacing: "0.04em",
                  textShadow: item.color !== "rgba(226,232,240,0.3)" ? `0 0 16px ${item.color}55` : "none",
                }}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-6 md:px-12 relative overflow-hidden" style={{ background: "#040810" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(34,211,238,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div
            className="text-xs font-medium tracking-widest mb-6"
            style={{ color: "rgba(34,211,238,0.6)", fontFamily: "JetBrains Mono, monospace" }}
          >
            // GET STARTED
          </div>
          <h2
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: "Exo 2, sans-serif", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.025em", lineHeight: 1.15 }}
          >
            Ready to build a{" "}
            <span style={{ color: "#22d3ee", textShadow: "0 0 40px rgba(34,211,238,0.4)" }}>
              resilient
            </span>{" "}
            supply chain?
          </h2>
          <p className="text-base mb-10" style={{ color: "rgba(226,232,240,0.55)" }}>
            Model your network, inject disruptions, and receive AI-powered recovery recommendations — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="http://localhost:5173"
              className="cta-btn-primary w-full sm:w-auto px-10 py-4 rounded font-bold text-sm tracking-wider"
              style={{
                background: "#22d3ee",
                color: "#040810",
                fontFamily: "Exo 2, sans-serif",
                letterSpacing: "0.08em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 32px rgba(34,211,238,0.35)",
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              START SIMULATING NOW
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 md:px-12 py-10"
        style={{ borderTop: "1px solid rgba(34,211,238,0.08)", background: "#040810" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)", color: "#22d3ee", fontFamily: "Exo 2, sans-serif" }}
            >
              SC
            </div>
            <span className="text-sm font-semibold" style={{ fontFamily: "Exo 2, sans-serif", color: "rgba(226,232,240,0.5)" }}>
              SupplyTwin
            </span>
          </div>

          <div className="flex items-center gap-8">
            {["GitHub Repo", "Documentation", "About"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs nav-link"
                style={{ color: "rgba(226,232,240,0.4)", textDecoration: "none", fontFamily: "Outfit, sans-serif" }}
              >
                {link}
              </a>
            ))}
          </div>

          <span
            className="text-xs"
            style={{ color: "rgba(226,232,240,0.25)", fontFamily: "JetBrains Mono, monospace" }}
          >
            PS-04 · AI Supply Chain Digital Twin
          </span>
        </div>
      </footer>
    </div>
  );
}
