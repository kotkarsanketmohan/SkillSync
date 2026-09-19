import logging
from abc import ABC, abstractmethod
from typing import List, Dict
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.industry.industry_data import IndustryDataset, IndustryDatasetSkill, IndustrySource, JobDescription, IndustrySkill
from app.services.skills import SkillNormalizationService
from app.common.config import settings

logger = logging.getLogger(__name__)

from app.ingestion.industry_sources.nsdc_jobx_adapter import NSDCAdapter
from app.ingestion.industry_sources.company_career_adapter import CompanyCareerPortalAdapter
from app.ingestion.industry_sources.nasscom_adapter import NASSCOMAdapter


class IndustryDataCollectionService:
    def __init__(self):
        self.adapters = [NASSCOMAdapter(), NSDCAdapter(), CompanyCareerPortalAdapter()]
        
    def collect_all(self, city: str, state: str, branch: str) -> List[Dict]:
        all_jobs = []
        for adapter in self.adapters:
            try:
                jobs = adapter.collect_jobs(city, state, branch)
                all_jobs.extend(jobs)
            except Exception as e:
                logger.error(f"Adapter {type(adapter).__name__} failed: {e}")
        return all_jobs


class IndustryDatasetRefreshService:
    @staticmethod
    def run_refresh(db: Session, city: str, state: str, branch: str):
        """
        Runs the 24-hour industry data refresh pipeline.
        Creates a new dataset, activates it, and archives the old one.
        """
        logger.info(f"Starting industry dataset refresh for {city}, {state}, {branch}")
        
        # 1. Create New Dataset (BUILDING)
        version_str = f"dataset_{city.lower()}_{branch.lower().replace(' ', '_')}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        new_dataset = IndustryDataset(
            version_string=version_str,
            status="BUILDING",
            location=city,
            branch=branch
        )
        db.add(new_dataset)
        db.commit()
        db.refresh(new_dataset)
        
        try:
            # 2. Collect Data
            collector = IndustryDataCollectionService()
            jobs_data = collector.collect_all(city, state, branch)
            
            if not jobs_data:
                raise ValueError("No jobs collected.")
                
            # Keep track of skill frequencies
            skill_counts = {}
            total_jobs = len(jobs_data)
            
            source_mock = db.query(IndustrySource).first()
            if not source_mock:
                source_mock = IndustrySource(source_name="Aggregate Source", source_type="PRIMARY")
                db.add(source_mock)
                db.flush()

            # Batch AI Skill Extraction
            # We construct one large prompt for all JDs to save Gemini quota.
            from app.ai.gemini_service import get_ai_response_with_method
            import json
            
            jobs_to_extract = [jd for jd in jobs_data if not jd.get("skills")]
            if jobs_to_extract:
                prompt = "Extract a concise list of 5-10 technical skills required for EACH of the following job descriptions. Return as JSON array of objects, where each object has 'job_index' (integer) and 'skills' (array of strings).\n\n"
                for i, jd in enumerate(jobs_to_extract):
                    prompt += f"Job {i}: {jd['title']} at {jd['company']}\nDescription: {jd['description']}\n\n"
                    
                try:
                    response, method = get_ai_response_with_method(prompt, json_mode=True)
                    extracted_list = json.loads(response)
                    if isinstance(extracted_list, list):
                        for item in extracted_list:
                            idx = item.get("job_index")
                            if idx is not None and 0 <= idx < len(jobs_to_extract):
                                jobs_to_extract[idx]["skills"] = item.get("skills", [])
                except Exception as e:
                    logger.warning(f"Batch AI extraction failed or format invalid ({e}).")
                    
                # Deterministic Fallback if AI didn't populate skills
                common_skills = ["Java", "Python", "SQL", "C++", "AWS", "Machine Learning", "Data Structures", "Algorithms", "React", "Node.js", "Docker", "Kubernetes", "Linux", "Git", "REST", "Agile", "Testing", "Database Management", "Cloud Computing"]
                for jd in jobs_to_extract:
                    if not jd.get("skills"):
                        logger.info("Using deterministic local parser for job skills.")
                        desc_lower = jd['description'].lower()
                        jd["skills"] = [s for s in common_skills if s.lower() in desc_lower]
                        if not jd["skills"]:
                            jd["skills"] = ["Software Engineering", "Problem Solving"]

            # 3. Extract & Normalize Skills
            for job_data in jobs_data:
                job = JobDescription(
                    source_id=source_mock.id,
                    dataset_id=new_dataset.id,
                    company_name=job_data["company"],
                    job_title=job_data["title"],
                    description=job_data["description"]
                )
                db.add(job)
                db.flush()
                
                unique_skills = set()
                for raw_skill in job_data.get("skills", []):
                    # Normalize
                    canonical_skill = SkillNormalizationService.normalize_skill(db, raw_skill)
                    unique_skills.add(canonical_skill)
                    
                    # Store job requirement
                    # Ensure embedding is generated
                    embedding = SkillNormalizationService.generate_embedding(canonical_skill.canonical_name)
                    ind_skill = IndustrySkill(
                        job_id=job.id,
                        skill_name=raw_skill,
                        skill_id=canonical_skill.id,
                        embedding=embedding
                    )
                    db.add(ind_skill)
                    
                # Count for demand calculation
                for c_skill in unique_skills:
                    skill_counts[c_skill.id] = skill_counts.get(c_skill.id, 0) + 1
                    
            # 4. Calculate Demand & Create Dataset Skills
            new_dataset.status = "VALIDATING"
            db.commit()
            
            if len(skill_counts) == 0:
                raise ValueError("Validation failed: No skills extracted.")
                
            for skill_id, count in skill_counts.items():
                demand = (count / total_jobs) * 100.0
                ds_skill = IndustryDatasetSkill(
                    dataset_id=new_dataset.id,
                    canonical_skill_id=skill_id,
                    demand_percentage=demand,
                    job_count=count
                )
                db.add(ds_skill)
                
            # 5. Activate New Dataset and Archive Old
            # Find current active
            old_active = db.query(IndustryDataset).filter(
                IndustryDataset.location == city,
                IndustryDataset.branch == branch,
                IndustryDataset.status == "ACTIVE"
            ).first()
            
            new_dataset.status = "ACTIVE"
            if old_active:
                old_active.status = "ARCHIVED"
                
            db.commit()
            logger.info(f"Dataset {version_str} successfully activated.")
            
        except Exception as e:
            logger.error(f"Dataset refresh failed: {e}")
            db.rollback()
            new_dataset.status = "FAILED"
            db.commit()
            # Note: Old active dataset remains ACTIVE because we didn't touch it
