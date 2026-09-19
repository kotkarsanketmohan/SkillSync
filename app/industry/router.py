from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.common.dependencies import require_industry, User
from app.industry.models import IndustryProfile
from pydantic import BaseModel
from typing import List
import uuid
import json
import threading
from app.student.job import SearchJob
from app.ai.provider_manager import ProviderManager

router = APIRouter(prefix="/api/industry", tags=["industry"])

class JobDescriptionRequest(BaseModel):
    job_description: str
    required_skills: List[str]
    city: str = None

@router.get("/profile")
def get_profile(current_user: User = Depends(require_industry), db: Session = Depends(get_db)):
    profile = db.query(IndustryProfile).filter(IndustryProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/match")
def match_colleges(request: JobDescriptionRequest, current_user: User = Depends(require_industry), db: Session = Depends(get_db)):
    profile = db.query(IndustryProfile).filter(IndustryProfile.user_id == current_user.id).first()
    company_name = profile.company_name if profile else "Unknown Company"
    
    job_id = str(uuid.uuid4())
    
    new_job = SearchJob(
        job_id=job_id,
        status="QUEUED",
        module="industry",
        company=company_name,
        job_role=request.job_description,
        required_skills=json.dumps(request.required_skills),
        city=request.city
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

@router.get("/match/status/{job_id}")
def check_match_status(job_id: str, current_user: User = Depends(require_industry), db: Session = Depends(get_db)):
    job = db.query(SearchJob).filter(SearchJob.job_id == job_id, SearchJob.module == "industry").first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return {
        "job_id": job.job_id,
        "status": job.status,
        "result_data": job.result_data,
        "error_message": job.error_message
    }
