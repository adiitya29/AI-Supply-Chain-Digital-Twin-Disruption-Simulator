from pydantic import BaseModel
from typing import List

class AlternativeNode(BaseModel):
    node_id: int
    name: str
    type: str
    capacity: float
    cost: float
    lead_time: float
    reliability_score: float
    score: float  # The computed score for ranking

class RecommendationRequest(BaseModel):
    disrupted_node_id: int
    magnitude: float
    duration: float

class RecommendationResponse(BaseModel):
    ranked_alternatives: List[AlternativeNode]
    llm_recommendation: str
