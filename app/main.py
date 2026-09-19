from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.common.config import settings
from app.common.scheduler import scheduler_manager
from app.auth.router import router as auth_router
from app.student.router import router as student_router
from app.university.router import router as university_router
from app.industry.router import router as industry_router
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler_manager.start()
    yield
    scheduler_manager.shutdown()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for SkillSync: AI-Powered Curriculum-Industry Alignment Platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(student_router)
app.include_router(university_router)
app.include_router(industry_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/system/status")
def system_status():
    return {
        "status": "ok",
        "data_mode": settings.DATA_MODE
    }
 
