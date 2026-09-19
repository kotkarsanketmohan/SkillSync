from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class CollegeSearchRequest(BaseModel):
    city: Optional[str] = None
    cities: Optional[List[str]] = None
    state: str
    branch: str = Field(alias="branch_interest")

class DatasetInfo(BaseModel):
    version: Optional[str] = None
    generated_at: Optional[str] = None
    age_hours: Optional[int] = None
    status: Optional[str] = None

class SearchQuery(BaseModel):
    city: Optional[str] = None
    cities: Optional[List[str]] = None
    state: str
    branch: str

class MatchResultResponse(BaseModel):
    rank: int
    college_id: int
    college_name: str
    university: str
    matching_score: float

class StudentMatchResponse(BaseModel):
    query: SearchQuery
    dataset: DatasetInfo
    results: List[MatchResultResponse]

class CollegeAnalysisResponse(BaseModel):
    college_id: int
    college_name: str
    university: str
    location: str
    department: str
    matching_score: float
    curriculum_overview: str
    major_skill_areas: List[str]
    industry_alignment: str
    matched_skills: List[Dict[str, Any]]
    partial_skills: List[Dict[str, Any]]
    potential_gaps: List[Dict[str, Any]]
    relevant_subjects: List[str]
    industry_skill_demand: List[Dict[str, Any]]
