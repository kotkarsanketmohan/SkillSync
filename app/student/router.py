from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.database import get_db
from app.common.dependencies import require_student, User
from app.student.models import StudentProfile
from app.university.academic import College, Syllabus, Department
from app.student.matching import MatchingResult, MatchingDetail
from app.industry.industry_data import IndustryDataset
from app.student.schemas import (
    CollegeSearchRequest, 
    StudentMatchResponse, 
    MatchResultResponse,
    CollegeAnalysisResponse,
    SearchQuery,
    DatasetInfo
)
import uuid
import json
import threading
from app.student.job import SearchJob
from app.ingestion.discovery import CollegeDiscoveryService
from pydantic import BaseModel
from typing import Optional

class SearchJobResponse(BaseModel):
    job_id: str
    status: str

class SearchJobStatusResponse(BaseModel):
    job_id: str
    status: str
    result: Optional[dict] = None
    error: Optional[str] = None

router = APIRouter(prefix="/api/student", tags=["student"])

@router.get("/profile")
def get_profile(current_user: User = Depends(require_student), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/branches")
def get_branches(db: Session = Depends(get_db)):
    # Always return exactly top 6 branches for MVP
    return sorted([
        "Computer Engineering",
        "Information Technology",
        "Artificial Intelligence and Data Science",
        "Electronics and Telecommunication Engineering",
        "Mechanical Engineering",
        "Civil Engineering"
    ])

@router.post("/college-search", response_model=SearchJobResponse)
def search_colleges(request: CollegeSearchRequest, current_user: User = Depends(require_student), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    cities_list = request.cities if request.cities else ([request.city] if request.city else [])
    
    if profile and len(cities_list) > 0:
        profile.city = cities_list[0] # Just save the first one to profile for backward compatibility
        profile.state = request.state
        profile.branch_interest = request.branch
        db.commit()

    job_id = str(uuid.uuid4())
    cities_str = json.dumps(cities_list)
    job = SearchJob(
        job_id=job_id,
        city=cities_str,
        state=request.state,
        branch=request.branch,
        status="QUEUED"
    )
    db.add(job)
    db.commit()
    
    # Start background thread to process job
    from app.ai.provider_manager import ProviderManager
    
    thread = threading.Thread(
        target=ProviderManager.run_search_job_background,
        args=(job_id,)
    )
    thread.daemon = True
    thread.start()

    return SearchJobResponse(job_id=job_id, status="QUEUED")

@router.get("/college-search/{job_id}/status", response_model=SearchJobStatusResponse)
def get_search_job_status(job_id: str, current_user: User = Depends(require_student), db: Session = Depends(get_db)):
    job = db.query(SearchJob).filter(SearchJob.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    result = None
    if job.status == "COMPLETED" and job.result_data:
        try:
            result = json.loads(job.result_data)
        except:
            pass

    return SearchJobStatusResponse(
        job_id=job.job_id,
        status=job.status,
        result=result,
        error=job.error_message
    )

@router.get("/colleges/{college_id}/analysis", response_model=CollegeAnalysisResponse)
def get_college_analysis(college_id: int, current_user: User = Depends(require_student), db: Session = Depends(get_db)):
    college = db.query(College).filter(College.id == college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
        
    result = db.query(MatchingResult).filter(MatchingResult.college_id == college_id).order_by(MatchingResult.created_at.desc()).first()
    score = result.match_score if result else 0.0
    
    matched_skills = []
    partial_skills = []
    gaps = []
    
    if result:
        details = db.query(MatchingDetail).filter(MatchingDetail.result_id == result.id).all()
        for d in details:
            if not d.industry_skill and not d.dataset_skill:
                continue
                
            skill_name = d.industry_skill.skill_name if d.industry_skill else d.dataset_skill.canonical_skill.canonical_name if d.dataset_skill else "Unknown"
            c_skill_name = d.curriculum_skill.skill_name if d.curriculum_skill else "N/A"
            
            entry = {
                "industry_skill": skill_name,
                "curriculum_skill": c_skill_name,
                "similarity": d.similarity,
                "demand": d.industry_demand
            }
            if d.match_status == "STRONG":
                matched_skills.append(entry)
            elif d.match_status == "PARTIAL":
                partial_skills.append(entry)
            else:
                gaps.append(entry)

    university_name = college.university.name if college.university else "Unknown University"
    
    return CollegeAnalysisResponse(
        college_id=college.id,
        college_name=college.name,
        university=university_name,
        location=f"{college.city}, {college.state}",
        department="Computer Engineering", # Mapped in real implementation based on syllabus
        matching_score=score,
        curriculum_overview="This curriculum is modern and aligns reasonably well with industry standards.",
        major_skill_areas=["Software Development", "Databases", "Algorithms"],
        industry_alignment="Good alignment with current tech market.",
        matched_skills=matched_skills,
        partial_skills=partial_skills,
        potential_gaps=gaps,
        relevant_subjects=[],
        industry_skill_demand=[]
    )

from app.university.service import SyllabusDiscoveryService

@router.post("/colleges/{college_id}/fetch-syllabus")
def fetch_college_syllabus(college_id: int, current_user: User = Depends(require_student), db: Session = Depends(get_db)):
    college = db.query(College).filter(College.id == college_id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
        
    # Start syllabus fetch process asynchronously
    thread = threading.Thread(
        target=SyllabusDiscoveryService.fetch_and_process_syllabus,
        args=(college_id,)
    )
    thread.daemon = True
    thread.start()
    
    return {"status": "Processing Started", "college_id": college_id}

