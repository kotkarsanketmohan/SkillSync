from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    branch_interest = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    college_name = Column(String, nullable=True)
    year_of_study = Column(String, nullable=True)

    user = relationship("User", back_populates="student_profile")
