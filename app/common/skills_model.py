from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    canonical_name = Column(String, unique=True, index=True, nullable=False)
    
    aliases = relationship("SkillAlias", back_populates="canonical_skill")
    curriculum_skills = relationship("CurriculumSkill", back_populates="canonical_skill")
    industry_skills = relationship("IndustrySkill", back_populates="canonical_skill")
    dataset_skills = relationship("IndustryDatasetSkill", back_populates="canonical_skill")


class SkillAlias(Base):
    __tablename__ = "skill_aliases"
    id = Column(Integer, primary_key=True, index=True)
    canonical_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    alias_name = Column(String, unique=True, index=True, nullable=False)
    
    canonical_skill = relationship("Skill", back_populates="aliases")
