import os
import sys

# Ensure the app module can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.node import Node, NodeType
from app.models.edge import Edge

def seed_data():
    db: Session = SessionLocal()
    
    print("Clearing existing data...")
    db.query(Edge).delete()
    db.query(Node).delete()
    db.commit()

    print("Seeding database...")

    # --- Create Nodes ---
    
    # Suppliers (Raw Materials)
    suppliers = [
        Node(name="Supplier Alpha (Asia)", type=NodeType.SUPPLIER, capacity=5000, lead_time=14.0, cost=10.0, reliability_score=0.85, current_stock=10000),
        Node(name="Supplier Beta (Europe)", type=NodeType.SUPPLIER, capacity=4000, lead_time=7.0, cost=15.0, reliability_score=0.95, current_stock=8000),
        Node(name="Supplier Gamma (NA)", type=NodeType.SUPPLIER, capacity=6000, lead_time=3.0, cost=20.0, reliability_score=0.98, current_stock=12000),
        Node(name="Supplier Delta (SA)", type=NodeType.SUPPLIER, capacity=3500, lead_time=12.0, cost=12.0, reliability_score=0.88, current_stock=5000),
    ]

    # Factories (Components & Assembly)
    factories = [
        Node(name="Factory 1 (Chassis)", type=NodeType.FACTORY, capacity=2000, lead_time=5.0, cost=50.0, reliability_score=0.92, current_stock=500),
        Node(name="Factory 2 (Electronics)", type=NodeType.FACTORY, capacity=3000, lead_time=8.0, cost=120.0, reliability_score=0.90, current_stock=800),
        Node(name="Factory 3 (Motors)", type=NodeType.FACTORY, capacity=2500, lead_time=6.0, cost=80.0, reliability_score=0.94, current_stock=600),
        Node(name="Assembly Plant East", type=NodeType.FACTORY, capacity=4000, lead_time=3.0, cost=200.0, reliability_score=0.97, current_stock=200),
        Node(name="Assembly Plant West", type=NodeType.FACTORY, capacity=3500, lead_time=3.0, cost=210.0, reliability_score=0.96, current_stock=150),
    ]

    # Warehouses / Distribution Centers
    warehouses = [
        Node(name="DC North", type=NodeType.WAREHOUSE, capacity=10000, lead_time=2.0, cost=5.0, reliability_score=0.99, current_stock=4000),
        Node(name="DC South", type=NodeType.WAREHOUSE, capacity=8000, lead_time=2.0, cost=5.0, reliability_score=0.98, current_stock=3500),
        Node(name="DC East", type=NodeType.WAREHOUSE, capacity=12000, lead_time=1.5, cost=6.0, reliability_score=0.99, current_stock=6000),
        Node(name="DC West", type=NodeType.WAREHOUSE, capacity=9000, lead_time=2.5, cost=4.5, reliability_score=0.97, current_stock=3000),
    ]

    # Customers (Retail Regions)
    customers = [
        Node(name="Retail NE", type=NodeType.CUSTOMER, capacity=2000, lead_time=1.0, cost=0.0, reliability_score=1.0, current_stock=200),
        Node(name="Retail NW", type=NodeType.CUSTOMER, capacity=1500, lead_time=1.0, cost=0.0, reliability_score=1.0, current_stock=150),
        Node(name="Retail SE", type=NodeType.CUSTOMER, capacity=1800, lead_time=1.0, cost=0.0, reliability_score=1.0, current_stock=180),
        Node(name="Retail SW", type=NodeType.CUSTOMER, capacity=1600, lead_time=1.0, cost=0.0, reliability_score=1.0, current_stock=160),
        Node(name="Retail Central", type=NodeType.CUSTOMER, capacity=3000, lead_time=1.5, cost=0.0, reliability_score=1.0, current_stock=300),
        Node(name="Online Fulfillment", type=NodeType.CUSTOMER, capacity=5000, lead_time=0.5, cost=0.0, reliability_score=1.0, current_stock=500),
    ]

    db.add_all(suppliers + factories + warehouses + customers)
    db.commit()

    # Get IDs for relationships
    all_nodes = {n.name: n.id for n in db.query(Node).all()}

    # --- Create Edges (Routes) ---
    routes = [
        # Suppliers to Component Factories
        ("Supplier Alpha (Asia)", "Factory 1 (Chassis)", 1000, 14.0, 5.0, 0.85),
        ("Supplier Alpha (Asia)", "Factory 2 (Electronics)", 1500, 12.0, 4.0, 0.88),
        ("Supplier Beta (Europe)", "Factory 2 (Electronics)", 800, 7.0, 8.0, 0.95),
        ("Supplier Beta (Europe)", "Factory 3 (Motors)", 1200, 6.0, 7.0, 0.96),
        ("Supplier Gamma (NA)", "Factory 1 (Chassis)", 1500, 3.0, 12.0, 0.98),
        ("Supplier Gamma (NA)", "Factory 3 (Motors)", 1000, 4.0, 10.0, 0.97),
        ("Supplier Delta (SA)", "Factory 1 (Chassis)", 500, 10.0, 6.0, 0.90),
        
        # Component Factories to Assembly Plants
        ("Factory 1 (Chassis)", "Assembly Plant East", 1200, 4.0, 15.0, 0.95),
        ("Factory 1 (Chassis)", "Assembly Plant West", 800, 6.0, 20.0, 0.92),
        ("Factory 2 (Electronics)", "Assembly Plant East", 1500, 3.0, 10.0, 0.98),
        ("Factory 2 (Electronics)", "Assembly Plant West", 1500, 3.5, 12.0, 0.97),
        ("Factory 3 (Motors)", "Assembly Plant East", 1000, 5.0, 18.0, 0.94),
        ("Factory 3 (Motors)", "Assembly Plant West", 1500, 4.0, 16.0, 0.96),

        # Assembly Plants to Warehouses (DCs)
        ("Assembly Plant East", "DC North", 1000, 2.0, 5.0, 0.99),
        ("Assembly Plant East", "DC East", 2000, 1.0, 3.0, 0.99),
        ("Assembly Plant East", "DC South", 1000, 3.0, 6.0, 0.98),
        ("Assembly Plant West", "DC West", 2500, 1.5, 4.0, 0.99),
        ("Assembly Plant West", "DC South", 1000, 4.0, 8.0, 0.95),

        # Warehouses to Customers
        ("DC North", "Retail NE", 800, 1.0, 2.0, 0.99),
        ("DC North", "Retail NW", 400, 2.0, 3.0, 0.97),
        ("DC North", "Retail Central", 600, 1.5, 2.5, 0.98),
        
        ("DC East", "Retail NE", 1200, 0.5, 1.0, 1.0),
        ("DC East", "Retail SE", 1000, 1.5, 2.5, 0.98),
        ("DC East", "Online Fulfillment", 3000, 0.5, 1.5, 0.99),
        
        ("DC South", "Retail SE", 800, 1.0, 2.0, 0.99),
        ("DC South", "Retail SW", 600, 2.0, 3.0, 0.97),
        ("DC South", "Retail Central", 700, 2.5, 3.5, 0.96),
        
        ("DC West", "Retail NW", 1100, 1.0, 2.0, 0.99),
        ("DC West", "Retail SW", 1000, 1.5, 2.5, 0.98),
        ("DC West", "Online Fulfillment", 2000, 1.0, 2.0, 0.98),
    ]

    edges = []
    for src, tgt, cap, lead, cst, rel in routes:
        edges.append(
            Edge(
                source_id=all_nodes[src],
                target_id=all_nodes[tgt],
                capacity=cap,
                lead_time=lead,
                cost=cst,
                reliability_score=rel
            )
        )
    
    db.add_all(edges)
    db.commit()
    
    print(f"Successfully seeded {len(all_nodes)} nodes and {len(edges)} edges!")
    db.close()

if __name__ == "__main__":
    seed_data()
