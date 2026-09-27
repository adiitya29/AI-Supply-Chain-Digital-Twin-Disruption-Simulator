from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import routes
from app.api import disruptions
from app.api import analysis
from app.api import recommendations
from app.db.database import engine
from app.models import node, edge
from app.db.database import Base

# Create tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Backend API for AI Supply Chain Digital Twin & Disruption Simulator"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(routes.router, prefix="/api")
app.include_router(disruptions.router, prefix="/api/disruptions")
app.include_router(analysis.router, prefix="/api/analysis")
app.include_router(recommendations.router, prefix="/api/recommendations")

@app.get("/")
def root():
    return {"message": "Welcome to the AI Supply Chain Digital Twin API"}
