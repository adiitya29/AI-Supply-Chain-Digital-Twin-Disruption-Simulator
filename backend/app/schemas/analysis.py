from pydantic import BaseModel
from typing import List

class BottleneckNode(BaseModel):
    node_id: int
    node_name: str
    centrality_score: float
    is_single_point_of_failure: bool

class BottleneckResponse(BaseModel):
    bottlenecks: List[BottleneckNode]
