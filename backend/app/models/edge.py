from sqlalchemy import Column, Integer, Float, ForeignKey
from app.db.database import Base

class Edge(Base):
    __tablename__ = "edges"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("nodes.id"))
    target_id = Column(Integer, ForeignKey("nodes.id"))
    capacity = Column(Float, default=0.0)
    lead_time = Column(Float, default=0.0) # in days
    cost = Column(Float, default=0.0)
    reliability_score = Column(Float, default=1.0) # 0.0 to 1.0
