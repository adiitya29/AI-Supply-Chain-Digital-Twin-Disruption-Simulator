from sqlalchemy.orm import Session
from app.models.node import Node
from app.schemas.recommendation import AlternativeNode, RecommendationRequest

def calculate_score(node: Node) -> float:
    # Weights: Reliability (0.4), Cost (-0.2), Lead Time (-0.2), Capacity (0.2)
    score = (node.reliability_score * 0.4) - (node.cost * 0.01) - (node.lead_time * 0.05) + (node.capacity * 0.0001)
    return round(score, 4)

def get_recommendations(db: Session, request: RecommendationRequest) -> list[AlternativeNode]:
    # 1. Identify the disrupted node
    disrupted = db.query(Node).filter(Node.id == request.disrupted_node_id).first()
    if not disrupted:
        return []

    # 2. Find alternatives (nodes of the same type)
    alternatives_db = db.query(Node).filter(
        Node.type == disrupted.type,
        Node.id != disrupted.id
    ).all()

    # 3. Score and rank them
    ranked = []
    for alt in alternatives_db:
        score = calculate_score(alt)
        ranked.append(AlternativeNode(
            node_id=alt.id,
            name=alt.name,
            type=alt.type.value,
            capacity=alt.capacity,
            cost=alt.cost,
            lead_time=alt.lead_time,
            reliability_score=alt.reliability_score,
            score=score
        ))

    ranked.sort(key=lambda x: x.score, reverse=True)
    return ranked
