from pydantic import BaseModel
from typing import Optional

class EdgeBase(BaseModel):
    source_id: int
    target_id: int
    capacity: float = 0.0
    lead_time: float = 0.0
    cost: float = 0.0
    reliability_score: float = 1.0

class EdgeCreate(EdgeBase):
    pass

class EdgeUpdate(BaseModel):
    capacity: Optional[float] = None
    lead_time: Optional[float] = None
    cost: Optional[float] = None
    reliability_score: Optional[float] = None

class EdgeResponse(EdgeBase):
    id: int

    class Config:
        from_attributes = True
