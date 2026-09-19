from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Float
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
from app.database.database import Base

class IndustryDataset(Base):
    __tablename__ = "industry_datasets"
    id = Column(Integer, primary_key=True, index=True)
    version_string = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, nullable=False, default="BUILDING") # BUILDING, VALIDATING, ACTIVE, FAILED, ARCHIVED
    generated_at = Column(DateTime, default=datetime.utcnow)
    location = Column(String, nullable=True) # E.g., Pune
    branch = Column(String, nullable=True) # E.g., Computer Engineering
    
    jobs = relationship("JobDescription", back_populates="dataset")
    skills = relationship("IndustryDatasetSkill", back_populates="dataset")

class IndustryDatasetSkill(Base):
    __tablename__ = "industry_dataset_skills"
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("industry_datasets.id"), nullable=False)
    canonical_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    demand_percentage = Column(Float, nullable=False)
    job_count = Column(Integer, default=0)
    
    dataset = relationship("IndustryDataset", back_populates="skills")
    canonical_skill = relationship("Skill", back_populates="dataset_skills")

class IndustrySource(Base):
    __tablename__ = "industry_sources"
    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String, nullable=False)
    source_type = Column(String, nullable=False) # PRIMARY, SECONDARY
    source_url = Column(String, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

    job_descriptions = relationship("JobDescription", back_populates="source")

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("industry_sources.id"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("industry_datasets.id"), nullable=True)
    company_name = Column(String, index=True, nullable=False)
    job_title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    source = relationship("IndustrySource", back_populates="job_descriptions")
    dataset = relationship("IndustryDataset", back_populates="jobs")
    required_skills = relationship("IndustrySkill", back_populates="job")

class IndustrySkill(Base):
    __tablename__ = "industry_skills"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    skill_name = Column(String, index=True, nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True) # Canonical skill reference
    embedding = Column(Vector(384))
    
    job = relationship("JobDescription", back_populates="required_skills")
    canonical_skill = relationship("Skill", back_populates="industry_skills")
