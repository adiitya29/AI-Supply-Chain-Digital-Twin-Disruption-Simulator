from pydantic import BaseModel
from typing import List
from enum import Enum

class DisruptionType(str, Enum):
    NODE_DOWN = "node_down"
    ROUTE_BLOCKED = "route_blocked"
    DEMAND_SPIKE = "demand_spike"

class DisruptionEvent(BaseModel):
    disruption_type: DisruptionType
    target_id: int
    magnitude: float
    duration: float

class DisruptionImpact(BaseModel):
    node_id: int
    node_name: str
    delay_days: float
    shortage_quantity: float

class DisruptionResponse(BaseModel):
    event: DisruptionEvent
    affected_nodes: List[DisruptionImpact]
