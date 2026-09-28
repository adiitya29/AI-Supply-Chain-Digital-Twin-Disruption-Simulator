const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchNodes() {
  const res = await fetch(`${API_BASE}/nodes/`);
  if (!res.ok) throw new Error("Failed to fetch nodes");
  return res.json();
}

export async function fetchEdges() {
  const res = await fetch(`${API_BASE}/edges/`);
  if (!res.ok) throw new Error("Failed to fetch edges");
  return res.json();
}

export async function simulateDisruption(payload) {
  const res = await fetch(`${API_BASE}/disruptions/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to simulate disruption");
  return res.json();
}

export async function fetchBottlenecks() {
  const res = await fetch(`${API_BASE}/analysis/bottlenecks`);
  if (!res.ok) throw new Error("Failed to fetch bottlenecks");
  return res.json();
}

export async function fetchRecommendations(payload) {
  const res = await fetch(`${API_BASE}/recommendations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

export async function fetchScenarios() {
  const res = await fetch(`${API_BASE}/scenarios/`);
  if (!res.ok) throw new Error("Failed to fetch scenarios");
  return res.json();
}

export async function saveScenario(payload) {
  const res = await fetch(`${API_BASE}/scenarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save scenario");
  return res.json();
}
