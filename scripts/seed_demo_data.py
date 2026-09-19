import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.academic import University, College, Department, Syllabus, Subject, CurriculumSkill
from app.models.industry_data import IndustrySource, JobDescription, IndustrySkill
from app.models.matching import MatchingResult
from app.core.security import get_password_hash
import numpy as np

def create_demo_data():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 1. Create Users
    if not db.query(User).filter(User.email == "student@example.com").first():
        student = User(email="student@example.com", mobile_number="1234567890", password_hash=get_password_hash("student123"), first_name="Demo", last_name="Student", role="STUDENT")
        db.add(student)
        
    if not db.query(User).filter(User.email == "university@example.com").first():
        uni = User(email="university@example.com", mobile_number="1234567890", password_hash=get_password_hash("university123"), first_name="Demo", last_name="University", role="UNIVERSITY")
        db.add(uni)
        
    if not db.query(User).filter(User.email == "industry@example.com").first():
        ind = User(email="industry@example.com", mobile_number="1234567890", password_hash=get_password_hash("industry123"), first_name="Demo", last_name="Industry", role="INDUSTRY")
        db.add(ind)
        
    db.commit()

    # 2. Create University/College data
    if not db.query(University).first():
        u1 = University(name="Tech University")
        db.add(u1)
        db.commit()
        db.refresh(u1)
        
        c1 = College(university_id=u1.id, name="Institute of Engineering", city="Mumbai", state="Maharashtra")
        c2 = College(university_id=u1.id, name="College of Science", city="Pune", state="Maharashtra")
        db.add_all([c1, c2])
        db.commit()
        db.refresh(c1)
        
        d1 = Department(college_id=c1.id, name="Computer Science")
        db.add(d1)
        db.commit()
        db.refresh(d1)
        
        syl = Syllabus(department_id=d1.id, degree="B.Tech", branch="Computer Science", semester=6)
        db.add(syl)
        db.commit()
        db.refresh(syl)
        
        sub = Subject(syllabus_id=syl.id, name="Cloud Computing", description="Basics of AWS and GCP", credits=4)
        db.add(sub)
        db.commit()
        db.refresh(sub)
        
        # Add a skill with dummy embeddings
        skill1 = CurriculumSkill(subject_id=sub.id, skill_name="AWS", embedding=np.random.rand(384))
        skill2 = CurriculumSkill(subject_id=sub.id, skill_name="Docker", embedding=np.random.rand(384))
        db.add_all([skill1, skill2])
        db.commit()

    # 3. Create Industry data
    if not db.query(IndustrySource).first():
        src = IndustrySource(source_name="NASSCOM", source_type="PRIMARY")
        db.add(src)
        db.commit()
        db.refresh(src)
        
        jd = JobDescription(source_id=src.id, company_name="TechCorp", job_title="Cloud Engineer", description="Looking for cloud specialists.")
        db.add(jd)
        db.commit()
        db.refresh(jd)
        
        iskill1 = IndustrySkill(job_id=jd.id, skill_name="AWS Cloud", embedding=np.random.rand(384))
        iskill2 = IndustrySkill(job_id=jd.id, skill_name="Kubernetes", embedding=np.random.rand(384))
        db.add_all([iskill1, iskill2])
        db.commit()

    print("Demo data seeded successfully!")
    db.close()

if __name__ == "__main__":
    create_demo_data()
