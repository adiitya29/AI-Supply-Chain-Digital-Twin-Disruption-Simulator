from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.analysis import BottleneckResponse
from app.core.analysis import analyze_bottlenecks

router = APIRouter()

@router.get("/bottlenecks", response_model=BottleneckResponse)
def get_bottlenecks(db: Session = Depends(get_db)):
    """
    Computes graph metrics (betweenness centrality and single points of failure)
    to highlight fragile nodes in the supply chain before disruption occurs.
    """
    bottlenecks = analyze_bottlenecks(db)
    return BottleneckResponse(bottlenecks=bottlenecks)
