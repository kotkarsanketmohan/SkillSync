from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class IndustryProfile(Base):
    __tablename__ = "industry_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    company_website = Column(String, nullable=True)
    designation = Column(String, nullable=False)

    user = relationship("User", back_populates="industry_profile")
