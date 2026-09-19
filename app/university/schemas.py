from pydantic import BaseModel
from typing import List, Optional

class SyllabusFetchRequest(BaseModel):
    college_id: int
    department_id: int
    degree: str
    branch: str
    semester: int
    url: Optional[str] = None

class SyllabusProcessResponse(BaseModel):
    success: bool
    message: str
    extracted_subjects: int
    extracted_skills: int

class RecommendationResponse(BaseModel):
    recommendation_type: str
    course_name: str
    reason: str
    details: dict

class GapAnalysisResponse(BaseModel):
    skill_gaps: List[str]
    subject_gaps: List[str]
    recommendations: List[RecommendationResponse]
