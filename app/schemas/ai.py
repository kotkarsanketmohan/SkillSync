from pydantic import BaseModel, Field
from typing import List, Optional, Any

class SearchQueryDict(BaseModel):
    cities: List[str]
    state: str
    branch: str

class AICollegeResult(BaseModel):
    rank: int
    college_name: str
    university: Optional[str] = None
    city: str
    state: str
    branch: str
    college_source_url: Optional[str] = None
    university_source_url: Optional[str] = None
    curriculum_status: str = "AI_RESEARCHED"
    curriculum_summary: str
    major_subjects: List[str]
    curriculum_skills: List[str]
    industry_skills: List[str]
    matched_skills: List[str]
    skill_gaps: List[str]
    relevant_job_roles: List[str]
    curriculum_industry_match_score: int
    explanation: str
    data_confidence: str

class StudentSearchAIResponse(BaseModel):
    search: SearchQueryDict
    provider: str
    data_mode: str
    model: Optional[str] = None
    fallback_used: bool = False
    generated_at: str
    colleges: List[AICollegeResult]
