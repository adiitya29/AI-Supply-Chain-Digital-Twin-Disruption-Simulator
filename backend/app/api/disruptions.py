from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.disruption import DisruptionEvent, DisruptionResponse
from app.core.simulation import simulate_disruption

router = APIRouter()

@router.post("/simulate", response_model=DisruptionResponse)
def simulate(event: DisruptionEvent, db: Session = Depends(get_db)):
    """
    Accepts a disruption event and computes downstream impact by propagating through the graph.
    """
    impacts = simulate_disruption(db, event)
    return DisruptionResponse(event=event, affected_nodes=impacts)
