from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, DateTime, Boolean
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.database.database import Base

class University(Base):
    __tablename__ = "universities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    
    colleges = relationship("College", back_populates="university")

class College(Base):
    __tablename__ = "colleges"
    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=True)
    name = Column(String, index=True, nullable=False)
    city = Column(String, index=True, nullable=False)
    state = Column(String, index=True, nullable=False)
    website = Column(String, nullable=True)
    source_verification_info = Column(String, nullable=True)
    
    # Provenance and Validation
    source_url = Column(String, nullable=True)
    source_domain = Column(String, nullable=True)
    discovery_method = Column(String, nullable=True)
    retrieved_at = Column(DateTime, nullable=True)
    source_verified = Column(Boolean, default=False)

    university = relationship("University", back_populates="colleges")
    departments = relationship("Department", back_populates="college")
    
class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=False)
    name = Column(String, nullable=False)
    
    college = relationship("College", back_populates="departments")
    syllabi = relationship("Syllabus", back_populates="department")

class Syllabus(Base):
    __tablename__ = "syllabi"
    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    degree = Column(String, nullable=False) # e.g. B.Tech
    branch = Column(String, index=True, nullable=False) # e.g. Computer Science
    semester = Column(Integer, nullable=False)
    source_url = Column(String, nullable=True)
    document_hash = Column(String, nullable=True)
    retrieved_at = Column(DateTime, nullable=True)
    processing_status = Column(String, default="PENDING")
    
    department = relationship("Department", back_populates="syllabi")
    subjects = relationship("Subject", back_populates="syllabus")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    syllabus_id = Column(Integer, ForeignKey("syllabi.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    credits = Column(Integer, nullable=True)
    
    syllabus = relationship("Syllabus", back_populates="subjects")
    units = relationship("SubjectUnit", back_populates="subject")
    skills = relationship("CurriculumSkill", back_populates="subject")

class SubjectUnit(Base):
    __tablename__ = "subject_units"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    subject = relationship("Subject", back_populates="units")
    topics = relationship("SubjectTopic", back_populates="unit")
    
class SubjectTopic(Base):
    __tablename__ = "subject_topics"
    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("subject_units.id"), nullable=False)
    name = Column(String, nullable=False)
    
    unit = relationship("SubjectUnit", back_populates="topics")

class CurriculumSkill(Base):
    __tablename__ = "curriculum_skills"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    skill_name = Column(String, index=True, nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True) # Canonical skill reference
    embedding = Column(Vector(384)) # Using all-MiniLM-L6-v2 which has 384 dimensions
    
    subject = relationship("Subject", back_populates="skills")
    canonical_skill = relationship("Skill", back_populates="curriculum_skills")
