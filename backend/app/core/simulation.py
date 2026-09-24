import networkx as nx
from sqlalchemy.orm import Session
from app.models.node import Node
from app.models.edge import Edge
from app.schemas.disruption import DisruptionEvent, DisruptionType, DisruptionImpact

def build_graph(db: Session) -> nx.DiGraph:
    G = nx.DiGraph()
    nodes = db.query(Node).all()
    for n in nodes:
        # Include node data as graph node attributes
        G.add_node(n.id, name=n.name, capacity=n.capacity, current_stock=n.current_stock)
    
    edges = db.query(Edge).all()
    for e in edges:
        G.add_edge(e.source_id, e.target_id, capacity=e.capacity, lead_time=e.lead_time)
        
    return G

def simulate_disruption(db: Session, event: DisruptionEvent) -> list[DisruptionImpact]:
    G = build_graph(db)
    impacts = []
    
    # We only process if the target exists in the graph
    if event.disruption_type == DisruptionType.NODE_DOWN:
        if event.target_id not in G:
            return impacts
            
        # Find all downstream nodes affected by this failure
        downstream_nodes = list(nx.descendants(G, event.target_id))
        
        for n_id in downstream_nodes:
            node_data = G.nodes[n_id]
            
            # Simple propagation logic:
            # 1. Delay propagates downstream based on duration + graph distance
            shortest_path_len = nx.shortest_path_length(G, source=event.target_id, target=n_id)
            delay = event.duration + (shortest_path_len * 0.5)
            
            # 2. Shortage calculation based on magnitude of disruption vs their capacity
            # Magnitude 1.0 = total failure, 0.5 = half capacity
            shortage = node_data.get('capacity', 0) * event.magnitude
            
            # If the downstream node has inventory, it cushions the shortage
            cushion = node_data.get('current_stock', 0) * 0.2  # 20% of stock can buffer
            actual_shortage = max(0, shortage - cushion)
            
            if delay > 0 or actual_shortage > 0:
                impacts.append(DisruptionImpact(
                    node_id=n_id,
                    node_name=node_data.get('name', 'Unknown'),
                    delay_days=round(delay, 2),
                    shortage_quantity=round(actual_shortage, 2)
                ))
                
    elif event.disruption_type == DisruptionType.ROUTE_BLOCKED:
        # In a real app we would map target_id to an Edge and find paths through that edge
        pass
        
    elif event.disruption_type == DisruptionType.DEMAND_SPIKE:
        # Demand spike starts at a customer node and propagates upstream
        pass

    return impacts
