from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database.database import Base

class SearchJob(Base):
    __tablename__ = "search_jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, unique=True, index=True)
    status = Column(String, default="QUEUED") # QUEUED, PROCESSING, COMPLETED, FAILED
    module = Column(String, default="student") # student, university, industry
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    branch = Column(String, nullable=True)
    
    # University fields
    institution = Column(String, nullable=True)
    department = Column(String, nullable=True)
    
    # Industry fields
    company = Column(String, nullable=True)
    job_role = Column(String, nullable=True)
    required_skills = Column(String, nullable=True)
    
    result_data = Column(Text, nullable=True) # JSON serialized string
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
