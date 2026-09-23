from pydantic import BaseModel
from typing import Optional
from app.models.node import NodeType

class NodeBase(BaseModel):
    name: str
    type: NodeType
    capacity: float = 0.0
    lead_time: float = 0.0
    cost: float = 0.0
    reliability_score: float = 1.0
    current_stock: float = 0.0

class NodeCreate(NodeBase):
    pass

class NodeUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[NodeType] = None
    capacity: Optional[float] = None
    lead_time: Optional[float] = None
    cost: Optional[float] = None
    reliability_score: Optional[float] = None
    current_stock: Optional[float] = None

class NodeResponse(NodeBase):
    id: int

    class Config:
        from_attributes = True
