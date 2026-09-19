import logging
import json
from app.ai.gemini_service import get_gemini_response
from sqlalchemy.orm import Session
from datetime import datetime
from app.common.config import settings
from app.industry.industry_data import IndustryDataset, IndustryDatasetSkill, JobDescription, IndustrySource
from app.services.skills import SkillNormalizationService
from apify_client import ApifyClient

logger = logging.getLogger(__name__)

class IndustryDataService:
    @staticmethod
    def scrape_and_process_jobs(db: Session, title: str, location: str, max_jobs: int = 10):
        if not settings.APIFY_API_TOKEN or not settings.GEMINI_API_KEY:
            logger.error("Missing Apify or Gemini API keys.")
            return None

        # 1. Scrape Jobs
        logger.info(f"Scraping {title} jobs in {location}...")
        jobs_data = IndustryDataService._scrape_jobs_apify(title, location, max_jobs)
        
        if not jobs_data:
            logger.warning("No jobs found or scraper failed.")
            return None
            
        # 2. Create Dataset
        dataset = IndustryDataset(
            version_string=f"v_{datetime.utcnow().strftime('%Y%m%d_%H%M')}",
            location=location,
            branch=title,
            status="ACTIVE"
        )
        db.add(dataset)
        db.flush()
        
        # 3. Create Source (representing Apify Scraper)
        source = db.query(IndustrySource).filter(IndustrySource.source_name == "Google Search (Career Portals)").first()
        if not source:
            source = IndustrySource(
                source_name="Google Search (Career Portals)",
                source_type="API"
            )
            db.add(source)
            db.flush()
            
        skill_counts = {}
        total_valid_jobs = 0

        # 4. Process each Job Description
        # Model configuration happens in gemini_service
        
        for jd in jobs_data:
            desc = jd.get("description")
            if not desc or len(desc) < 50:
                continue
                
            job_obj = JobDescription(
                source_id=source.id,
                dataset_id=dataset.id,
                job_title=jd.get("title", "Unknown"),
                company_name=jd.get("company", "Unknown"),
                location=jd.get("location", location),
                raw_text=desc
            )
            db.add(job_obj)
            db.flush()
            
            # Extract skills via Gemini
            skills = IndustryDataService._extract_skills_from_jd(desc)
            if skills:
                total_valid_jobs += 1
                for s in skills:
                    skill_counts[s] = skill_counts.get(s, 0) + 1
                    
        # 5. Normalize and Aggregate Skills
        for skill_name, count in skill_counts.items():
            demand_percentage = round((count / total_valid_jobs) * 100, 2)
            if demand_percentage < 5:  # Ignore noise
                continue
                
            canonical = SkillNormalizationService.normalize_skill(db, skill_name)
            
            dataset_skill = IndustryDatasetSkill(
                dataset_id=dataset.id,
                canonical_skill_id=canonical.id,
                demand_percentage=demand_percentage
            )
            db.add(dataset_skill)

        # Deactivate old datasets for this combination
        old_datasets = db.query(IndustryDataset).filter(
            IndustryDataset.location == location,
            IndustryDataset.branch == title,
            IndustryDataset.id != dataset.id
        ).all()
        for old in old_datasets:
            old.status = "ARCHIVED"
            
        db.commit()
        logger.info(f"Successfully processed industry dataset. ID: {dataset.id}")
        return dataset.id

    @staticmethod
    def _scrape_jobs_apify(title: str, location: str, max_jobs: int):
        client = ApifyClient(settings.APIFY_API_TOKEN)
        # Using a generalized google jobs scraper or similar
        # Strict restriction: No LinkedIn, Indeed, or Naukri. Use generic career portals or NASSCOM sources.
        run = client.actor("apify/google-search-scraper").call(run_input={
            "queries": f"\"{title}\" jobs in {location} career portal -linkedin -indeed -naukri",
            "resultsPerPage": max_jobs,
            "maxPagesPerQuery": 1
        })
        
        results = []
        for item in client.dataset(run.default_dataset_id).iterate_items():
            organics = item.get("organicResults", [])
            for org in organics:
                desc = org.get("description")
                title_text = org.get("title", "")
                if desc:
                    results.append({
                        "title": title_text,
                        "company": title_text.split("-")[0].strip() if "-" in title_text else "Unknown",
                        "location": location,
                        "description": desc
                    })
        return results

    @staticmethod
    def _extract_skills_from_jd(text: str):
        prompt = f"""
        Extract a list of technical skills, tools, and methodologies required for this job description.
        Return ONLY a JSON list of strings representing the skills.
        Example: ["Python", "Machine Learning", "Agile", "SQL"]
        Do not wrap the output in markdown blocks. Just the raw JSON array.
        
        Job Description:
        {text[:5000]}
        """
        try:
            out = get_gemini_response(prompt, json_mode=True)
            out = out.strip()
            if out.startswith("```json"): out = out[7:]
            if out.startswith("```"): out = out[3:]
            if out.endswith("```"): out = out[:-3]
            return json.loads(out.strip())
        except:
            return []
