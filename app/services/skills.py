import logging
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.common.skills_model import Skill, SkillAlias
from app.university.academic import College, Syllabus, Subject, CurriculumSkill
from app.industry.industry_data import IndustryDataset, IndustryDatasetSkill, IndustrySkill
from app.student.matching import MatchingResult, MatchingDetail
from app.common.config import settings

logger = logging.getLogger(__name__)

# Lazy load model to avoid loading on every import
_embedding_model = None

import numpy as np

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            # Using a fast, standard model suitable for semantic similarity
            _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        except ImportError:
            logger.warning("SentenceTransformers not installed. Embeddings will not be generated locally.")
    return _embedding_model

def cosine_similarity(vec1, vec2):
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    if np.linalg.norm(v1) == 0 or np.linalg.norm(v2) == 0:
        return 0.0
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))


class SkillNormalizationService:
    @staticmethod
    def normalize_skill(db: Session, raw_skill_name: str) -> Skill:
        """
        Normalizes a raw skill name into a canonical Skill object.
        If it doesn't exist, it creates one.
        """
        normalized_str = raw_skill_name.strip().title()
        
        # 1. Exact match on Canonical
        skill = db.query(Skill).filter(Skill.canonical_name == normalized_str).first()
        if skill:
            return skill
            
        # 2. Exact match on Alias
        alias = db.query(SkillAlias).filter(SkillAlias.alias_name == normalized_str).first()
        if alias:
            return alias.canonical_skill
            
        # 3. Create new Canonical (In a full NLP pipeline, we'd use Gemini/Semantic search to find near matches here)
        new_skill = Skill(canonical_name=normalized_str)
        db.add(new_skill)
        db.flush()
        
        return new_skill
        
    @staticmethod
    def generate_embedding(text: str) -> list[float]:
        model = get_embedding_model()
        if model:
            return model.encode(text).tolist()
        return [0.0] * 384 # Fallback dummy embedding


class MatchingEngine:
    @staticmethod
    def calculate_college_match(db: Session, college_id: int, dataset_id: int) -> float:
        """
        Calculates the semantic Curriculum-Industry alignment score for a given college
        against a specific IndustryDataset.
        """
        if settings.DATA_MODE == "demo":
            # Deterministic mock score based on IDs
            return 75.0 + ((college_id * dataset_id * 17) % 20)
            
        # 1. Fetch Curriculum Skills for the college
        from app.university.academic import Department
        curriculum_skills = (
            db.query(CurriculumSkill)
            .join(Subject, CurriculumSkill.subject_id == Subject.id)
            .join(Syllabus, Subject.syllabus_id == Syllabus.id)
            .join(Department, Syllabus.department_id == Department.id)
            .join(College, Department.college_id == College.id)
            .filter(College.id == college_id)
            .all()
        )
        
        # 2. Fetch Industry Demand Skills
        industry_skills = (
            db.query(IndustryDatasetSkill)
            .filter(IndustryDatasetSkill.dataset_id == dataset_id)
            .all()
        )
        
        if not curriculum_skills or not industry_skills:
            return 0.0

        total_weighted_score = 0.0
        total_demand_weight = sum([isk.demand_percentage for isk in industry_skills])
        
        if total_demand_weight == 0:
            return 0.0

        # Create or update MatchingResult
        result = db.query(MatchingResult).filter(
            MatchingResult.college_id == college_id, 
            MatchingResult.dataset_id == dataset_id
        ).first()
        
        if not result:
            result = MatchingResult(
                college_id=college_id,
                dataset_id=dataset_id,
                match_score=0.0
            )
            db.add(result)
            db.flush()
        else:
            # Clear old details
            db.query(MatchingDetail).filter(MatchingDetail.result_id == result.id).delete()

        # 3. Compute Semantic Matching
        # In a highly optimized pgvector setup, this is an SQL query using cosine distance.
        # Here we demonstrate the logic conceptually.
        
        # Cache embeddings to avoid recomputing
        c_skill_embeddings = {}
        for c in curriculum_skills:
            name = c.skill_name or c.canonical_skill.canonical_name if c.canonical_skill else ""
            if name and name not in c_skill_embeddings:
                c_skill_embeddings[name] = SkillNormalizationService.generate_embedding(name)
                
        for ind_skill in industry_skills:
            best_similarity = 0.0
            best_c_skill = None
            ind_name = ind_skill.canonical_skill.canonical_name if ind_skill.canonical_skill else ""
            ind_emb = SkillNormalizationService.generate_embedding(ind_name) if ind_name else None
            
            for c_skill in curriculum_skills:
                c_name = c_skill.skill_name or c_skill.canonical_skill.canonical_name if c_skill.canonical_skill else ""
                if c_skill.skill_id == ind_skill.canonical_skill_id:
                    similarity = 1.0
                elif ind_emb is not None and c_name in c_skill_embeddings:
                    c_emb = c_skill_embeddings[c_name]
                    # Compute cosine similarity
                    similarity = float(cosine_similarity(c_emb, ind_emb))
                else:
                    similarity = 0.0 
                    
                if similarity > best_similarity:
                    best_similarity = similarity
                    best_c_skill = c_skill

            # Demand Weighting
            demand_weight = ind_skill.demand_percentage / total_demand_weight
            weighted_contribution = best_similarity * demand_weight
            total_weighted_score += weighted_contribution
            
            if best_c_skill:
                status = "STRONG" if best_similarity >= 0.85 else "PARTIAL" if best_similarity >= 0.55 else "WEAK"
                detail = MatchingDetail(
                    result_id=result.id,
                    dataset_skill_id=ind_skill.id,
                    curriculum_skill_id=best_c_skill.id,
                    similarity=best_similarity,
                    industry_demand=ind_skill.demand_percentage,
                    weighted_contribution=weighted_contribution,
                    match_status=status
                )
                db.add(detail)

        final_score = round(total_weighted_score * 100, 2)
        result.match_score = final_score
        db.commit()
        
        return final_score
