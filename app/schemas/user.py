from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    mobile_number: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: str # STUDENT, UNIVERSITY, INDUSTRY

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}

class StudentProfileCreate(BaseModel):
    pass

class UniversityProfileCreate(BaseModel):
    university_name: str
    college_name: str
    department: str
    designation: str

class IndustryProfileCreate(BaseModel):
    company_name: str
    company_website: Optional[str] = None
    designation: str

# Role specific registration schemas
class StudentRegistration(UserCreate):
    role: str = "STUDENT"
    profile: StudentProfileCreate

class UniversityRegistration(UserCreate):
    role: str = "UNIVERSITY"
    profile: UniversityProfileCreate

class IndustryRegistration(UserCreate):
    role: str = "INDUSTRY"
    profile: IndustryProfileCreate
