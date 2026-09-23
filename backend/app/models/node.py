from sqlalchemy import Column, Integer, String, Float, Enum
import enum
from app.db.database import Base

class NodeType(str, enum.Enum):
    SUPPLIER = "Supplier"
    FACTORY = "Factory"
    WAREHOUSE = "Warehouse"
    CUSTOMER = "Customer"

class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(Enum(NodeType))
    capacity = Column(Float, default=0.0)
    lead_time = Column(Float, default=0.0) # in days
    cost = Column(Float, default=0.0)
    reliability_score = Column(Float, default=1.0) # 0.0 to 1.0
    current_stock = Column(Float, default=0.0)
