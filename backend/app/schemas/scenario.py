from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class ScenarioCreate(BaseModel):
    name: str
    disruption_type: str
    target_node_id: int
    magnitude: float
    duration: int
    impact_summary: Any

class ScenarioResponse(BaseModel):
    id: int
    name: str
    disruption_type: str
    target_node_id: int
    magnitude: float
    duration: int
    impact_summary: Any
    created_at: datetime

    class Config:
        from_attributes = True
