from pydantic import BaseModel
from typing import List, Optional

class SearchParams(BaseModel):
    city: str
    state: str
    branch: str

class GeminiCollegeResult(BaseModel):
    rank: int
    college_name: str
    university: Optional[str] = None
    city: str
    state: str
    branch: str
    
    college_source_url: Optional[str] = None
    university_source_url: Optional[str] = None
    
    data_confidence: str
    curriculum_status: str
    
    curriculum_summary: str
    major_subjects: List[str]
    curriculum_skills: List[str]
    industry_skills: List[str]
    matched_skills: List[str]
    skill_gaps: List[str]
    relevant_job_roles: List[str]
    
    curriculum_industry_match_score: int
    explanation: str

class GeminiStudentSearchResponse(BaseModel):
    search: SearchParams
    data_mode: str
    colleges: List[GeminiCollegeResult]
