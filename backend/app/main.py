from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import mysql_api, curriculum, outputs, rfp, curriculum_chat, brd, ppt_chat
from app.database import engine
from app.db_models import Base

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GTA CPR Curriculum API",
    description="Backend API for curriculum design and generation with MySQL database",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include MySQL API router (CRUD operations with MySQL database)
app.include_router(mysql_api.router, prefix="/api", tags=["Data Management"])

# Include specialized routers (curriculum generation, outputs, RFP parsing)
app.include_router(rfp.router, prefix="/api/rfp", tags=["RFP Processing"])
app.include_router(brd.router, prefix="/api", tags=["Business Requirements"])
app.include_router(curriculum.router, prefix="/api/curriculum", tags=["Curriculum Generation"])
app.include_router(curriculum_chat.router, prefix="/api/curriculum", tags=["Conversational Curriculum Builder"])
app.include_router(outputs.router, prefix="/api/outputs", tags=["Output Generation"])
app.include_router(ppt_chat.router, prefix="/api/outputs", tags=["PowerPoint Chat"])

@app.get("/")
async def root():
    return {
        "message": "GTA CPR Curriculum API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

