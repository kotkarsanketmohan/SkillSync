import hashlib
import json
import logging
import pymupdf # PyMuPDF
from app.ai.gemini_service import get_gemini_response
from datetime import datetime
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from app.university.academic import College, Syllabus, Subject, SubjectUnit, SubjectTopic, CurriculumSkill
from app.common.config import settings

logger = logging.getLogger(__name__)

class SyllabusSourceService:
    @staticmethod
    def locate_curriculum(college: College, branch: str) -> Optional[Dict]:
        """
        Locates the official curriculum/syllabus.
        Priority:
        1. Official university source
        2. Official college website
        3. Verified academic repository
        
        Returns a dictionary with source_url and metadata, or None.
        (Mocked implementation for this scaffold - in reality, uses a search/scraper)
        """
        # For a real implementation, you might use Apify or a search API.
        # Returning a mock payload if running in demo mode or if no real scraper is attached.
        if settings.DATA_MODE == "demo":
            return {
                "source_url": f"https://mock-university.edu/{branch.replace(' ', '_').lower()}_syllabus.pdf",
                "source_type": "official_university",
                "academic_year": "2026-27",
                "confidence": 0.95
            }
        return None

class SyllabusFetcher:
    @staticmethod
    def fetch_syllabus(source_url: str) -> Optional[bytes]:
        """
        Fetches the syllabus document from the source_url.
        """
        # HTTP fetch using httpx or requests
        import httpx
        try:
            if settings.DATA_MODE == "demo":
                # In demo mode, we might just return an empty byte string or a sample PDF content
                return b"Mock PDF Content"
            
            response = httpx.get(source_url, timeout=30.0)
            response.raise_for_status()
            return response.content
        except Exception as e:
            logger.error(f"Failed to fetch syllabus from {source_url}: {e}")
            return None

class CurriculumProcessor:
    def __init__(self):
        pass

    def process_pdf(self, pdf_bytes: bytes) -> str:
        """
        Extracts text from PDF using PyMuPDF. Falls back to OCR if needed.
        """
        text = ""
        try:
            doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text()
            
            # Simple quality check: if text is too short, might be scanned
            if len(text.strip()) < 100 and len(doc) > 0:
                logger.info("PDF appears to be scanned. OCR would run here.")
                # Tesseract OCR logic would go here
        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
        return text

    def extract_structure(self, text: str) -> Dict:
        """
        Uses Gemini to extract curriculum structure from text.
        """
        prompt = """
        Extract the curriculum structure from the following syllabus text.
        Format as JSON with:
        {
          "subjects": [
            {
              "name": "Subject Name",
              "credits": 3,
              "units": [
                {
                  "name": "Unit Name",
                  "topics": ["Topic 1", "Topic 2"]
                }
              ],
              "skills": ["Skill 1", "Skill 2"]
            }
          ]
        }
        Only return the raw JSON object.
        Text:
        """ + text[:10000] # Limiting size for prompt
        
        try:
            if settings.DATA_MODE == "demo":
                return {
                    "subjects": [
                        {
                            "name": "Object Oriented Programming",
                            "credits": 4,
                            "units": [
                                {"name": "Introduction to Java", "topics": ["Classes", "Objects"]}
                            ],
                            "skills": ["Java", "OOP", "Classes"]
                        }
                    ]
                }

            response_text = get_gemini_response(prompt, json_mode=True)
            # Basic cleanup in case Gemini adds markdown fences
            resp_text = response_text.strip()
            if resp_text.startswith("```json"):
                resp_text = resp_text[7:-3].strip()
            return json.loads(resp_text)
        except Exception as e:
            logger.error(f"Gemini extraction failed: {e}")
            return {}

    def process_and_store(self, db: Session, syllabus: Syllabus, pdf_bytes: bytes):
        """
        End-to-end processing pipeline for a syllabus.
        """
        # 1. Hash the document
        doc_hash = hashlib.sha256(pdf_bytes).hexdigest()
        
        if syllabus.document_hash == doc_hash and syllabus.processing_status == "COMPLETED":
            logger.info("Syllabus already processed and hash matches.")
            return

        syllabus.document_hash = doc_hash
        syllabus.retrieved_at = datetime.utcnow()
        syllabus.processing_status = "PROCESSING"
        db.commit()

        # 2. Extract Text
        text = self.process_pdf(pdf_bytes)
        
        # 3. Extract Structure
        structure = self.extract_structure(text)

        # 4. Store in DB
        try:
            # Clear existing subjects if re-processing
            for existing_subject in syllabus.subjects:
                db.delete(existing_subject)
            db.commit()

            subjects_data = structure.get("subjects", [])
            for subj_data in subjects_data:
                subject = Subject(
                    syllabus_id=syllabus.id,
                    name=subj_data.get("name"),
                    credits=subj_data.get("credits")
                )
                db.add(subject)
                db.flush() # To get subject.id
                
                # Add Units and Topics
                for unit_data in subj_data.get("units", []):
                    unit = SubjectUnit(
                        subject_id=subject.id,
                        name=unit_data.get("name")
                    )
                    db.add(unit)
                    db.flush()
                    
                    for topic_name in unit_data.get("topics", []):
                        topic = SubjectTopic(
                            unit_id=unit.id,
                            name=topic_name
                        )
                        db.add(topic)
                
                # Add Skills (canonical linking done in next phase)
                for skill_name in subj_data.get("skills", []):
                    c_skill = CurriculumSkill(
                        subject_id=subject.id,
                        skill_name=skill_name
                        # canonical_skill linkage happens in Normalization Service
                    )
                    db.add(c_skill)
            
            syllabus.processing_status = "COMPLETED"
            db.commit()
        except Exception as e:
            logger.error(f"Failed to store curriculum: {e}")
            db.rollback()
            syllabus.processing_status = "FAILED"
            db.commit()
