from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.node import Node
from app.models.edge import Edge
from app.schemas.node import NodeCreate, NodeUpdate, NodeResponse
from app.schemas.edge import EdgeCreate, EdgeUpdate, EdgeResponse

router = APIRouter()

# --- Node Endpoints ---
@router.post("/nodes/", response_model=NodeResponse)
def create_node(node: NodeCreate, db: Session = Depends(get_db)):
    db_node = Node(**node.dict())
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node

@router.get("/nodes/", response_model=List[NodeResponse])
def read_nodes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    nodes = db.query(Node).offset(skip).limit(limit).all()
    return nodes

@router.get("/nodes/{node_id}", response_model=NodeResponse)
def read_node(node_id: int, db: Session = Depends(get_db)):
    node = db.query(Node).filter(Node.id == node_id).first()
    if node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return node

@router.put("/nodes/{node_id}", response_model=NodeResponse)
def update_node(node_id: int, node_update: NodeUpdate, db: Session = Depends(get_db)):
    db_node = db.query(Node).filter(Node.id == node_id).first()
    if db_node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    
    update_data = node_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_node, key, value)
        
    db.commit()
    db.refresh(db_node)
    return db_node

@router.delete("/nodes/{node_id}")
def delete_node(node_id: int, db: Session = Depends(get_db)):
    db_node = db.query(Node).filter(Node.id == node_id).first()
    if db_node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    
    db.delete(db_node)
    db.commit()
    return {"ok": True}

# --- Edge Endpoints ---
@router.post("/edges/", response_model=EdgeResponse)
def create_edge(edge: EdgeCreate, db: Session = Depends(get_db)):
    db_edge = Edge(**edge.dict())
    db.add(db_edge)
    db.commit()
    db.refresh(db_edge)
    return db_edge

@router.get("/edges/", response_model=List[EdgeResponse])
def read_edges(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    edges = db.query(Edge).offset(skip).limit(limit).all()
    return edges

@router.get("/edges/{edge_id}", response_model=EdgeResponse)
def read_edge(edge_id: int, db: Session = Depends(get_db)):
    edge = db.query(Edge).filter(Edge.id == edge_id).first()
    if edge is None:
        raise HTTPException(status_code=404, detail="Edge not found")
    return edge

@router.put("/edges/{edge_id}", response_model=EdgeResponse)
def update_edge(edge_id: int, edge_update: EdgeUpdate, db: Session = Depends(get_db)):
    db_edge = db.query(Edge).filter(Edge.id == edge_id).first()
    if db_edge is None:
        raise HTTPException(status_code=404, detail="Edge not found")
    
    update_data = edge_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_edge, key, value)
        
    db.commit()
    db.refresh(db_edge)
    return db_edge

@router.delete("/edges/{edge_id}")
def delete_edge(edge_id: int, db: Session = Depends(get_db)):
    db_edge = db.query(Edge).filter(Edge.id == edge_id).first()
    if db_edge is None:
        raise HTTPException(status_code=404, detail="Edge not found")
    
    db.delete(db_edge)
    db.commit()
    return {"ok": True}
