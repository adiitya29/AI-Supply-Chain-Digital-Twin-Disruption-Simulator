import { useState, useEffect, useCallback } from 'react';

import Header from './components/Header';
import GraphView from './components/GraphView';
import ScenarioBuilder from './components/ScenarioBuilder';
import ScenarioHistory from './components/ScenarioHistory';
import ResultsPanel from './components/ResultsPanel';
import {
  fetchNodes,
  fetchEdges,
  fetchBottlenecks,
  simulateDisruption,
  fetchRecommendations,
  saveScenario,
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
  
  // To trigger re-fetch of history when a new one is saved
  const [historyRefresh, setHistoryRefresh] = useState(0);
  
  // Keep track of the last simulated payload so we can save it
  const [lastPayload, setLastPayload] = useState(null);

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
      setLastPayload(payload);
    } catch (err) {
      setError('Simulation failed. Check the backend console for errors.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleSaveScenario = async (name) => {
    if (!lastPayload || !simulationResult) return;
    try {
      await saveScenario({
        name,
        disruption_type: lastPayload.disruption_type,
        target_node_id: lastPayload.target_id,
        magnitude: lastPayload.magnitude,
        duration: lastPayload.duration,
        impact_summary: simulationResult,
      });
      setHistoryRefresh(prev => prev + 1);
    } catch (err) {
      setError('Failed to save scenario.');
    }
  };
  
  const handleLoadScenario = (savedScenario) => {
    setSimulationResult(savedScenario.impact_summary);
    setRecommendations(null); // Clear old recs
    setSelectedNodeId(savedScenario.target_node_id);
    setActiveTab('impact');
    // Also re-fetch recommendations for the loaded scenario
    fetchRecommendations({
        disrupted_node_id: savedScenario.target_node_id,
        magnitude: savedScenario.magnitude,
        duration: savedScenario.duration,
    }).then(setRecommendations).catch(console.error);
  };

  const handleReset = useCallback(() => {
    setSimulationResult(null);
    setRecommendations(null);
    setSelectedNodeId(null);
    setLastPayload(null);
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
        {/* Left sidebar — Scenario builder & History */}
        <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
          <ScenarioBuilder
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSimulate={handleSimulate}
            onReset={handleReset}
            isLoading={isLoading}
          />
          <ScenarioHistory 
            refreshTrigger={historyRefresh} 
            onLoadScenario={handleLoadScenario} 
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
            onSaveScenario={handleSaveScenario}
          />
        </aside>
      </div>
    </div>
  );
}
