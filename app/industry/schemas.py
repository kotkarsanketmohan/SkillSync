from pydantic import BaseModel
from typing import List

class JobDescriptionRequest(BaseModel):
    company_name: str
    job_description: str
    required_skills: List[str]

class CollegeMatchResult(BaseModel):
    college_name: str
    matching_score: float

class IndustryMatchResponse(BaseModel):
    success: bool
    message: str
    results: List[CollegeMatchResult]
