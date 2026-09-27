import httpx
from sqlalchemy.orm import Session
from app.models.node import Node
from app.schemas.recommendation import AlternativeNode, RecommendationRequest
from app.core.config import settings

GROQ_API_KEY = settings.GROQ_API_KEY
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def calculate_score(node: Node) -> float:
    # Weights: Reliability (0.4), Cost (-0.2), Lead Time (-0.2), Capacity (0.2)
    score = (node.reliability_score * 0.4) - (node.cost * 0.01) - (node.lead_time * 0.05) + (node.capacity * 0.0001)
    return round(score, 4)

def generate_llm_recommendation(alternatives: list[AlternativeNode], disrupted_name: str) -> str:
    if not GROQ_API_KEY:
        return "LLM recommendations are disabled because GROQ_API_KEY is not set in the .env file."

    alts_context = "\n".join([
        f"- {alt.name} (Score: {alt.score}, Lead Time: {alt.lead_time} days, Cost: ${alt.cost}, Reliability: {int(alt.reliability_score * 100)}%)"
        for alt in alternatives[:3]
    ])

    prompt = (
        f"A supply chain disruption has occurred at the node: {disrupted_name}.\n"
        f"Here are the top ranked alternative nodes we can reroute through:\n{alts_context}\n\n"
        "Please write a short, professional, plain-language recommendation (3-4 sentences) for the supply chain manager, "
        "advising which alternative to choose and why, based on the provided metrics."
    )

    try:
        with httpx.Client(timeout=15) as client:
            response = client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 200,
                    "temperature": 0.7,
                },
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"Error generating LLM recommendation: {str(e)}"

def get_recommendations(db: Session, request: RecommendationRequest) -> tuple[list[AlternativeNode], str]:
    # 1. Identify the disrupted node
    disrupted = db.query(Node).filter(Node.id == request.disrupted_node_id).first()
    if not disrupted:
        return [], "Disrupted node not found."

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

    # 4. Generate LLM plain-language recommendation
    llm_rec = generate_llm_recommendation(ranked, disrupted.name)

    return ranked, llm_rec
