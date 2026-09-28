from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.db.database import Base

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    disruption_type = Column(String)
    target_node_id = Column(Integer, ForeignKey("nodes.id"))
    magnitude = Column(Float)
    duration = Column(Integer)
    impact_summary = Column(JSON)  # Stores a summary of affected nodes for quick reload
    created_at = Column(DateTime(timezone=True), server_default=func.now())
