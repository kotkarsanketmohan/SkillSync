import logging
import requests
import json
import pymupdf # PyMuPDF
import os
import tempfile
from app.ai.gemini_service import get_gemini_response
from urllib.parse import urlparse
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.common.config import settings
from app.university.academic import College, Department, Syllabus, Subject, SubjectUnit, SubjectTopic, CurriculumSkill
from app.services.skills import MatchingEngine
from apify_client import ApifyClient
from datetime import datetime

logger = logging.getLogger(__name__)

class SyllabusDiscoveryService:
    @staticmethod
    def fetch_and_process_syllabus(college_id: int):
        db = SessionLocal()
        try:
            college = db.query(College).filter(College.id == college_id).first()
            if not college:
                return

            department = db.query(Department).filter(Department.college_id == college_id).first()
            if not department:
                department = Department(college_id=college_id, name="Department of Computer Engineering")
                db.add(department)
                db.commit()
                db.refresh(department)

            syllabus = db.query(Syllabus).filter(Syllabus.department_id == department.id).first()
            if not syllabus:
                syllabus = Syllabus(department_id=department.id, branch="Computer Engineering", effective_year=str(datetime.utcnow().year))
                db.add(syllabus)
                db.commit()
                db.refresh(syllabus)

            # Check if syllabus is already parsed (has subjects)
            existing_subjects = db.query(Subject).filter(Subject.syllabus_id == syllabus.id).count()
            if existing_subjects > 0:
                logger.info(f"Syllabus for college {college_id} already has {existing_subjects} subjects.")
                # Ensure match is run
                SyllabusDiscoveryService._trigger_matching(db, college_id)
                return

            logger.info(f"Fetching syllabus for college: {college.name}")
            
            # Step 1: Discover PDF
            pdf_url = SyllabusDiscoveryService._find_syllabus_pdf(college.name, college.university.name if college.university else "")
            
            text_content = ""
            if pdf_url:
                logger.info(f"Found syllabus PDF: {pdf_url}")
                # Step 2: Download and parse PDF
                text_content = SyllabusDiscoveryService._download_and_extract_text(pdf_url)
            else:
                logger.warning(f"No syllabus PDF found for {college.name}. Fetching HTML page text...")
                # Could fetch HTML text instead
                text_content = SyllabusDiscoveryService._fetch_html_text(college.name)

            if not text_content or len(text_content.strip()) < 100:
                logger.error("Failed to extract sufficient text content for syllabus.")
                return

            # Step 3: Extract structure via Gemini
            logger.info("Extracting subjects and skills using Gemini")
            curriculum_data = SyllabusDiscoveryService._extract_curriculum_data(text_content, college.name)
            
            if curriculum_data and "subjects" in curriculum_data:
                # Step 4: Save to Database
                SyllabusDiscoveryService._save_curriculum(db, syllabus.id, curriculum_data["subjects"])
                logger.info("Curriculum saved successfully.")
                
                # Step 5: Trigger matching
                SyllabusDiscoveryService._trigger_matching(db, college_id)
                
        except Exception as e:
            logger.exception("Error processing syllabus")
        finally:
            db.close()

    @staticmethod
    def _find_syllabus_pdf(college_name: str, university_name: str) -> str:
        if not settings.APIFY_API_TOKEN:
            return ""
            
        client = ApifyClient(settings.APIFY_API_TOKEN)
        query = f'"{college_name}" OR "{university_name}" "Computer Engineering" syllabus filetype:pdf'
        
        try:
            run = client.actor("apify/google-search-scraper").call(run_input={
                "queries": query,
                "resultsPerPage": 3,
                "maxPagesPerQuery": 1
            })
            
            for item in client.dataset(run.default_dataset_id).iterate_items():
                if "url" in item and item["url"].endswith(".pdf"):
                    return item["url"]
        except Exception as e:
            logger.error(f"Apify search error: {e}")
            
        return ""

    @staticmethod
    def _fetch_html_text(college_name: str) -> str:
        # Fallback simulated text for demo/MVP
        return "Simulated syllabus text for Computer Engineering: Data Structures, Algorithms, Machine Learning, Operating Systems."

    @staticmethod
    def _download_and_extract_text(pdf_url: str) -> str:
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(pdf_url, headers=headers, timeout=15)
            response.raise_for_status()
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(response.content)
                tmp_path = tmp.name
                
            text = ""
            try:
                doc = pymupdf.open(tmp_path)
                for page in doc:
                    text += page.get_text()
                doc.close()
            finally:
                os.unlink(tmp_path)
                
            # Limit text size to prevent Gemini token overflow
            return text[:100000]
        except Exception as e:
            logger.error(f"PDF extract error: {e}")
            return ""

    @staticmethod
    def _extract_curriculum_data(text: str, college_name: str) -> dict:
        prompt = f"""
        Extract the Computer Engineering curriculum subjects and skills from the provided text.
        Return ONLY a JSON object with this exact structure:
        {{
            "subjects": [
                {{
                    "name": "Subject Name",
                    "code": "Subject Code (if any)",
                    "credits": 3,
                    "units": [
                        {{
                            "title": "Unit Title",
                            "topics": ["topic 1", "topic 2"]
                        }}
                    ],
                    "skills": ["skill 1", "skill 2"]
                }}
            ]
        }}
        
        Do not include markdown code block syntax. Just the raw JSON.
        Limit to 5-10 major subjects to keep it concise.
        
        Syllabus Text Snippet:
        {text[:20000]}
        """
        
        try:
            response_text = get_gemini_response(prompt, json_mode=True)
            text_res = response_text.strip()
            if text_res.startswith("```json"): text_res = text_res[7:]
            if text_res.startswith("```"): text_res = text_res[3:]
            if text_res.endswith("```"): text_res = text_res[:-3]
                
            return json.loads(text_res.strip())
        except Exception as e:
            logger.error(f"Gemini extraction error: {e}")
            return {}

    @staticmethod
    def _save_curriculum(db: Session, syllabus_id: int, subjects_data: list):
        for sub_data in subjects_data:
            subject = Subject(
                syllabus_id=syllabus_id,
                name=sub_data.get("name", "Unknown Subject"),
                code=sub_data.get("code"),
                credits=sub_data.get("credits", 3),
                is_elective=False
            )
            db.add(subject)
            db.commit()
            db.refresh(subject)
            
            for unit_data in sub_data.get("units", []):
                unit = SubjectUnit(
                    subject_id=subject.id,
                    title=unit_data.get("title", "Unit")
                )
                db.add(unit)
                db.commit()
                db.refresh(unit)
                
                for topic_name in unit_data.get("topics", []):
                    topic = SubjectTopic(unit_id=unit.id, topic_name=topic_name)
                    db.add(topic)
            
            for skill_name in sub_data.get("skills", []):
                c_skill = CurriculumSkill(subject_id=subject.id, skill_name=skill_name, extracted_from="LLM")
                db.add(c_skill)
                
            db.commit()

    @staticmethod
    def _trigger_matching(db: Session, college_id: int):
        from app.industry.industry_data import IndustryDataset
        active_dataset = db.query(IndustryDataset).filter(IndustryDataset.status == "ACTIVE").first()
        if active_dataset:
            MatchingEngine.calculate_college_match(db, college_id, active_dataset.id)
            logger.info(f"Triggered recalculation for college {college_id}")
