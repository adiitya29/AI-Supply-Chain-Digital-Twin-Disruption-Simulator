import networkx as nx
from sqlalchemy.orm import Session
from app.core.simulation import build_graph
from app.schemas.analysis import BottleneckNode

def analyze_bottlenecks(db: Session) -> list[BottleneckNode]:
    G = build_graph(db)
    if len(G.nodes) == 0:
        return []

    # Calculate betweenness centrality
    # This measures how often a node acts as a bridge along the shortest path between other nodes
    centrality = nx.betweenness_centrality(G, normalized=True)
    
    # Identify single points of failure
    # Articulation points are nodes whose removal increases the number of connected components.
    G_undirected = G.to_undirected()
    try:
        articulation_points = set(nx.articulation_points(G_undirected))
    except Exception:
        # Fallback if graph is too disconnected
        articulation_points = set()

    results = []
    for node_id, score in centrality.items():
        node_data = G.nodes[node_id]
        results.append(BottleneckNode(
            node_id=node_id,
            node_name=node_data.get('name', 'Unknown'),
            centrality_score=round(score, 4),
            is_single_point_of_failure=(node_id in articulation_points)
        ))
        
    # Sort by centrality score descending to put the biggest bottlenecks first
    results.sort(key=lambda x: x.centrality_score, reverse=True)
    return results
