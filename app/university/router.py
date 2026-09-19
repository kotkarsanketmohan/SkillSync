from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.common.dependencies import require_university, User
from app.university.models import UniversityProfile
from pydantic import BaseModel
import uuid
from app.student.job import SearchJob
from app.ai.provider_manager import ProviderManager
import threading

router = APIRouter(prefix="/api/university", tags=["university"])

class UniversityAnalyzeRequest(BaseModel):
    institution_name: str
    department: str

@router.get("/profile")
def get_profile(current_user: User = Depends(require_university), db: Session = Depends(get_db)):
    profile = db.query(UniversityProfile).filter(UniversityProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/analyze")
def analyze_curriculum(request: UniversityAnalyzeRequest, current_user: User = Depends(require_university), db: Session = Depends(get_db)):
    job_id = str(uuid.uuid4())
    
    new_job = SearchJob(
        job_id=job_id,
        status="QUEUED",
        module="university",
        institution=request.institution_name,
        department=request.department
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    thread = threading.Thread(
        target=ProviderManager.run_search_job_background,
        args=(job_id,)
    )
    thread.daemon = True
    thread.start()
    
    return {"job_id": job_id, "status": "QUEUED"}

@router.get("/analyze/status/{job_id}")
def check_analyze_status(job_id: str, current_user: User = Depends(require_university), db: Session = Depends(get_db)):
    job = db.query(SearchJob).filter(SearchJob.job_id == job_id, SearchJob.module == "university").first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {
        "job_id": job.job_id,
        "status": job.status,
        "result_data": job.result_data,
        "error_message": job.error_message
    }
