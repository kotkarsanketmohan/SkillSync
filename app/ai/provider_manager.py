import json
import logging
from typing import List, Optional
from datetime import datetime, timedelta
from app.database.database import SessionLocal
from app.student.job import SearchJob
from app.ai.groq_service import generate_groq_research_colleges, generate_groq_university_analysis, generate_groq_industry_matches
from app.ai.gemini_service import generate_ai_research_colleges, generate_gemini_university_analysis, generate_gemini_industry_matches
from app.ai.seed_data_service import get_seed_colleges, get_seed_university_analysis, get_seed_industry_matches
from app.common.config import settings

logger = logging.getLogger(__name__)

class ProviderManager:
    @staticmethod
    def _check_cache(filters: dict) -> Optional[dict]:
        # Caching disabled to prevent database/parsing errors
        return None

    @staticmethod
    def get_student_search_result(cities: List[str], state: str, branch: str) -> dict:
        cities_str = json.dumps(cities)
        cached_result = ProviderManager._check_cache({"module": "student", "city": cities_str, "state": state, "branch": branch})
        if cached_result:
            return cached_result
            
        if settings.AI_PROVIDER in ["auto", "groq"]:
            try:
                logger.info("[AI] module=student provider=groq status=attempting")
                result = generate_groq_research_colleges(cities, state, branch)
                if result and result.get("colleges"):
                    logger.info("[AI] module=student provider=groq status=success")
                    return result
            except Exception as e:
                logger.error(f"[AI] module=student provider=groq status=error reason={e}")
                
        if settings.AI_PROVIDER in ["auto", "gemini"]:
            try:
                logger.info("[AI] module=student provider=gemini status=attempting")
                result = generate_ai_research_colleges(cities, state, branch, fallback_used=True)
                if result and result.get("colleges"):
                    logger.info("[AI] module=student provider=gemini status=success")
                    return result
            except Exception as e:
                logger.error(f"[AI] module=student provider=gemini status=error reason={e}")
                
        if settings.STUDENT_SEARCH_FALLBACK == "seed" or settings.AI_PROVIDER == "auto":
            try:
                logger.info("[AI] module=student provider=seed status=attempting")
                result = get_seed_colleges(cities, state, branch)
                logger.info("[AI] module=student provider=seed status=success")
                return result
            except Exception as e:
                logger.error(f"[AI] module=student provider=seed status=error reason={e}")
                
        return {
            "search": {"cities": cities, "state": state, "branch": branch},
            "provider": "NONE",
            "data_mode": "FAILED",
            "fallback_used": True,
            "generated_at": datetime.utcnow().isoformat(),
            "colleges": []
        }

    @staticmethod
    def get_university_result(institution: str, department: str) -> dict:
        cached_result = ProviderManager._check_cache({"module": "university", "institution": institution, "department": department})
        if cached_result:
            return cached_result
            
        if settings.AI_PROVIDER in ["auto", "groq"]:
            try:
                logger.info("[AI] module=university provider=groq status=attempting")
                result = generate_groq_university_analysis(institution, department)
                if result and result.get("semesters"):
                    logger.info("[AI] module=university provider=groq status=success")
                    return result
            except Exception as e:
                logger.error(f"[AI] module=university provider=groq status=error reason={e}")
                
        if settings.AI_PROVIDER in ["auto", "gemini"]:
            try:
                logger.info("[AI] module=university provider=gemini status=attempting")
                result = generate_gemini_university_analysis(institution, department, fallback_used=True)
                if result and result.get("semesters"):
                    logger.info("[AI] module=university provider=gemini status=success")
                    return result
            except Exception as e:
                logger.error(f"[AI] module=university provider=gemini status=error reason={e}")
                
        if settings.STUDENT_SEARCH_FALLBACK == "seed" or settings.AI_PROVIDER == "auto":
            try:
                logger.info("[AI] module=university provider=seed status=attempting")
                result = get_seed_university_analysis(institution, department)
                logger.info("[AI] module=university provider=seed status=success")
                return result
            except Exception as e:
                logger.error(f"[AI] module=university provider=seed status=error reason={e}")
                
        return {
            "institution": institution,
            "department": department,
            "provider": "NONE",
            "data_mode": "FAILED",
            "fallback_used": True,
            "generated_at": datetime.utcnow().isoformat(),
            "semesters": [],
            "curriculum_analysis": {}
        }

    @staticmethod
    def get_industry_result(company: str, role: str, skills: List[str], city: str = None) -> dict:
        skills_str = json.dumps(skills)
        cached_result = ProviderManager._check_cache({"module": "industry", "company": company, "job_role": role, "required_skills": skills_str, "city": city})
        if cached_result:
            return cached_result
            
        if settings.AI_PROVIDER in ["auto", "groq"]:
            try:
                logger.info("[AI] module=industry provider=groq status=attempting")
                result = generate_groq_industry_matches(company, role, skills, city=city)
                if result and result.get("matches"):
                    logger.info("[AI] module=industry provider=groq status=success")
                    return result
            except Exception as e:
                logger.error(f"[AI] module=industry provider=groq status=error reason={e}")
                
        if settings.AI_PROVIDER in ["auto", "gemini"]:
            try:
                logger.info("[AI] module=industry provider=gemini status=attempting")
                result = generate_gemini_industry_matches(company, role, skills, fallback_used=True, city=city)
                if result and result.get("matches"):
                    logger.info("[AI] module=industry provider=gemini status=success")
                    return result
            except Exception as e:
                logger.error(f"[AI] module=industry provider=gemini status=error reason={e}")
                
        if settings.STUDENT_SEARCH_FALLBACK == "seed" or settings.AI_PROVIDER == "auto":
            try:
                logger.info("[AI] module=industry provider=seed status=attempting")
                result = get_seed_industry_matches(company, role, skills, city=city)
                logger.info("[AI] module=industry provider=seed status=success")
                return result
            except Exception as e:
                logger.error(f"[AI] module=industry provider=seed status=error reason={e}")
                
        return {
            "company": company,
            "role": role,
            "provider": "NONE",
            "data_mode": "FAILED",
            "fallback_used": True,
            "generated_at": datetime.utcnow().isoformat(),
            "matches": []
        }

    @staticmethod
    def get_course_plan(course_name: str, mode: str) -> dict:
        from app.ai.groq_service import generate_groq_course_plan
        from app.ai.gemini_service import generate_ai_course_plan
        from app.university.seed.university_seed import get_seed_course_plan
        
        if settings.AI_PROVIDER in ["auto", "groq"]:
            try:
                logger.info("[AI] module=course_plan provider=groq status=attempting")
                result = generate_groq_course_plan(course_name, mode)
                if result:
                    logger.info("[AI] module=course_plan provider=groq status=success")
                    return result
            except Exception as e:
                logger.error(f"[AI] module=course_plan provider=groq status=error reason={e}")

        if settings.AI_PROVIDER in ["auto", "gemini"]:
            try:
                logger.info("[AI] module=course_plan provider=gemini status=attempting")
                result = generate_ai_course_plan(course_name, mode, fallback_used=True)
                if result:
                    logger.info("[AI] module=course_plan provider=gemini status=success")
                    return result
            except Exception as e:
                logger.error(f"[AI] module=course_plan provider=gemini status=error reason={e}")

        logger.info("[AI] module=course_plan provider=seed status=attempting")
        seed_result = get_seed_course_plan(course_name, mode)
        logger.info("[AI] module=course_plan provider=seed status=success")
        return seed_result


    @staticmethod
    def run_search_job_background(job_id: str, **kwargs):
        db = SessionLocal()
        job = db.query(SearchJob).filter(SearchJob.job_id == job_id).first()
        if not job:
            db.close()
            return
            
        job.status = "RUNNING"
        db.commit()
        
        try:
            if job.module == "student":
                cities = json.loads(job.city)
                result_dict = ProviderManager.get_student_search_result(cities, job.state, job.branch)
            elif job.module == "university":
                result_dict = ProviderManager.get_university_result(job.institution, job.department)
            elif job.module == "industry":
                skills = json.loads(job.required_skills)
                result_dict = ProviderManager.get_industry_result(job.company, job.job_role, skills, job.city)
            else:
                raise ValueError("Unknown job module")
                
            job.result_data = json.dumps(result_dict)
            job.status = "COMPLETED"
            job.completed_at = datetime.utcnow()
            db.commit()
        except Exception as e:
            logger.error(f"Search job failed: {e}")
            job.status = "FAILED"
            job.error_message = str(e)
            db.commit()
        finally:
            db.close()
