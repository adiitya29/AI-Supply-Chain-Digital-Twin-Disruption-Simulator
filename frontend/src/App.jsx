import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import GraphView from './components/GraphView';
import ScenarioBuilder from './components/ScenarioBuilder';
import ResultsPanel from './components/ResultsPanel';
import {
  fetchNodes,
  fetchEdges,
  fetchBottlenecks,
  simulateDisruption,
  fetchRecommendations,
} from './api';
import './App.css';

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [bottlenecks, setBottlenecks] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('impact');
  const [error, setError] = useState(null);

  // Load graph data and bottlenecks on mount
  useEffect(() => {
    async function load() {
      try {
        const [n, e, b] = await Promise.all([fetchNodes(), fetchEdges(), fetchBottlenecks()]);
        setNodes(n);
        setEdges(e);
        setBottlenecks(b);
      } catch (err) {
        setError('Failed to connect to the backend. Is uvicorn running?');
      }
    }
    load();
  }, []);

  const handleSimulate = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const [simResult, recResult] = await Promise.all([
        simulateDisruption(payload),
        fetchRecommendations({
          disrupted_node_id: payload.target_id,
          magnitude: payload.magnitude,
          duration: payload.duration,
        }),
      ]);
      setSimulationResult(simResult);
      setRecommendations(recResult);
      setActiveTab('impact');
    } catch (err) {
      setError('Simulation failed. Check the backend console for errors.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSimulationResult(null);
    setRecommendations(null);
    setSelectedNodeId(null);
    setActiveTab('impact');
  }, []);

  const affectedNodeIds = simulationResult?.affected_nodes?.map(n => n.node_id) ?? [];
  const bottleneckIds = (bottlenecks?.bottlenecks ?? [])
    .filter(b => b.is_single_point_of_failure || b.centrality_score > 0.1)
    .map(b => b.node_id);

  return (
    <div className="app">
      <Header nodeCount={nodes.length} edgeCount={edges.length} />

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      <div className="app-body">
        {/* Left sidebar — Scenario builder */}
        <aside className="sidebar">
          <ScenarioBuilder
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSimulate={handleSimulate}
            onReset={handleReset}
            isLoading={isLoading}
          />
        </aside>

        {/* Center — Graph visualization */}
        <main className="graph-area">
          <GraphView
            nodes={nodes}
            edges={edges}
            affectedNodeIds={affectedNodeIds}
            bottleneckIds={bottleneckIds}
            selectedNodeId={selectedNodeId}
            onNodeClick={setSelectedNodeId}
          />
        </main>

        {/* Right sidebar — Results */}
        <aside className="sidebar">
          <ResultsPanel
            simulationResult={simulationResult}
            recommendations={recommendations}
            bottlenecks={bottlenecks}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </aside>
      </div>
    </div>
  );
}
