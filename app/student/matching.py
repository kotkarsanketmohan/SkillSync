from sqlalchemy import Column, Integer, String, ForeignKey, Float, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class MatchingResult(Base):
    __tablename__ = "matching_results"
    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=True) # Could be overall industry match instead of single job
    dataset_id = Column(Integer, ForeignKey("industry_datasets.id"), nullable=True) # Overall match with dataset
    match_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    college = relationship("College")
    job = relationship("JobDescription")
    dataset = relationship("IndustryDataset")
    details = relationship("MatchingDetail", back_populates="result")

class MatchingDetail(Base):
    __tablename__ = "matching_details"
    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, ForeignKey("matching_results.id"), nullable=False)
    industry_skill_id = Column(Integer, ForeignKey("industry_skills.id"), nullable=True)
    dataset_skill_id = Column(Integer, ForeignKey("industry_dataset_skills.id"), nullable=True)
    curriculum_skill_id = Column(Integer, ForeignKey("curriculum_skills.id"), nullable=False)
    similarity = Column(Float, nullable=False)
    industry_demand = Column(Float, nullable=True) # Stores the demand at time of matching
    weighted_contribution = Column(Float, nullable=True) # How much this skill contributed to final score
    match_status = Column(String, nullable=True) # STRONG, PARTIAL, WEAK, etc.
    
    result = relationship("MatchingResult", back_populates="details")
    industry_skill = relationship("IndustrySkill")
    dataset_skill = relationship("IndustryDatasetSkill")
    curriculum_skill = relationship("CurriculumSkill")

class CurriculumRecommendation(Base):
    __tablename__ = "curriculum_recommendations"
    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    recommendation_type = Column(String, nullable=False) # MODIFY_EXISTING_SUBJECT, NEW_COURSE, etc.
    course_name = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    details = Column(JSON, nullable=False) # Stores JSON with credits, prerequisites, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    
    department = relationship("Department")
