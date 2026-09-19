from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.database import get_db
from app.common.dependencies import get_current_user
from app.common.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.auth.models import User, RefreshToken
from app.student.models import StudentProfile
from app.university.models import UniversityProfile
from app.industry.models import IndustryProfile
from app.schemas.user import UserResponse, StudentRegistration, UniversityRegistration, IndustryRegistration
from app.auth.schemas import Token, LoginRequest, RefreshTokenRequest, PasswordUpdate
import jwt
from app.common.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register/student", response_model=UserResponse)
def register_student(data: StudentRegistration, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        mobile_number=data.mobile_number,
        role=data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    profile = StudentProfile(
        user_id=user.id
    )
    db.add(profile)
    db.commit()
    
    return user

@router.post("/register/university", response_model=UserResponse)
def register_university(data: UniversityRegistration, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        mobile_number=data.mobile_number,
        role=data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    profile = UniversityProfile(
        user_id=user.id,
        university_name=data.profile.university_name,
        college_name=data.profile.college_name,
        department=data.profile.department,
        designation=data.profile.designation
    )
    db.add(profile)
    db.commit()
    
    return user

@router.post("/register/industry", response_model=UserResponse)
def register_industry(data: IndustryRegistration, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        mobile_number=data.mobile_number,
        role=data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    profile = IndustryProfile(
        user_id=user.id,
        company_name=data.profile.company_name,
        company_website=data.profile.company_website,
        designation=data.profile.designation
    )
    db.add(profile)
    db.commit()
    
    return user

@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    user.last_login = datetime.utcnow()
    db.commit()

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    # Store refresh token
    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        exp_date = datetime.fromtimestamp(payload['exp'])
    except:
        exp_date = datetime.utcnow() # fallback
        
    db_token = RefreshToken(token=refresh_token, user_id=user.id, expires_at=exp_date)
    db.add(db_token)
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
def refresh_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    db_token = db.query(RefreshToken).filter(RefreshToken.token == data.refresh_token).first()
    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    
    try:
        payload = jwt.decode(data.refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    access_token = create_access_token(subject=user_id)
    new_refresh_token = create_refresh_token(subject=user_id)
    
    # Update refresh token
    db.delete(db_token)
    
    try:
        new_payload = jwt.decode(new_refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        new_exp = datetime.fromtimestamp(new_payload['exp'])
    except:
        new_exp = datetime.utcnow()
        
    new_db_token = RefreshToken(token=new_refresh_token, user_id=int(user_id), expires_at=new_exp)
    db.add(new_db_token)
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    db_token = db.query(RefreshToken).filter(RefreshToken.token == data.refresh_token).first()
    if db_token:
        db.delete(db_token)
        db.commit()
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/update-password")
def update_password(data: PasswordUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}
