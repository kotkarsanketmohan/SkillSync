import json
import os
import logging
from typing import List
from datetime import datetime

logger = logging.getLogger(__name__)

STUDENT_SEED_PATH = os.path.join(os.path.dirname(__file__), "..", "student", "seed", "student_seed_data.json")
UNIVERSITY_SEED_PATH = os.path.join(os.path.dirname(__file__), "..", "university", "seed", "university_seed_data.json")
INDUSTRY_SEED_PATH = os.path.join(os.path.dirname(__file__), "..", "industry", "seed", "industry_seed_data.json")

def get_seed_colleges(cities: List[str], state: str, branch: str) -> dict:
    if not os.path.exists(STUDENT_SEED_PATH):
        logger.warning(f"Seed data file not found at {STUDENT_SEED_PATH}")
        return _empty_student_response(cities, state, branch)

    try:
        with open(STUDENT_SEED_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"Failed to read student seed data: {e}")
        return _empty_student_response(cities, state, branch)

    all_colleges = data.get("colleges", [])
    target_cities = [c.lower().strip() for c in cities]
    branch_keywords = set(branch.lower().replace("engineering", "").replace("technology", "").split())
    branch_keywords = {k for k in branch_keywords if len(k) > 2}

    matched = []
    for c in all_colleges:
        c_city = c.get("city", "").lower()
        c_branch = c.get("branch", "").lower()
        
        city_match = not target_cities or any(tc in c_city for tc in target_cities)
        
        branch_match = False
        if not branch_keywords:
            branch_match = True
        else:
            for keyword in branch_keywords:
                if keyword in c_branch:
                    branch_match = True
                    break
                    
        if city_match and branch_match:
            c_copy = dict(c)
            matched.append(c_copy)
            
    matched.sort(key=lambda x: x.get("curriculum_industry_match_score", 0), reverse=True)
    for i, c in enumerate(matched):
        c["rank"] = i + 1

    return {
        "search": {"cities": cities, "state": state, "branch": branch},
        "provider": "SEEDED_DATA",
        "data_mode": "seed",
        "model": "local_seed",
        "fallback_used": True,
        "generated_at": datetime.utcnow().isoformat(),
        "colleges": matched
    }

def get_seed_university_analysis(institution: str, department: str) -> dict:
    if not os.path.exists(UNIVERSITY_SEED_PATH):
        logger.warning(f"Seed data file not found at {UNIVERSITY_SEED_PATH}")
        return _empty_university_response(institution, department)

    try:
        with open(UNIVERSITY_SEED_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"Failed to read university seed data: {e}")
        return _empty_university_response(institution, department)

    institutions = data.get("institutions", [])
    
    for uni in institutions:
        if institution.lower() in uni.get("institution", "").lower() and department.lower() in uni.get("department", "").lower():
            # Add metadata
            uni_copy = dict(uni)
            uni_copy["provider"] = "SEEDED_DATA"
            uni_copy["data_mode"] = "seed"
            uni_copy["model"] = "local_seed"
            uni_copy["fallback_used"] = True
            uni_copy["generated_at"] = datetime.utcnow().isoformat()
            return uni_copy

    return _empty_university_response(institution, department)

def get_seed_industry_matches(company: str, role: str, skills: List[str], city: str = None) -> dict:
    if not os.path.exists(INDUSTRY_SEED_PATH):
        logger.warning(f"Seed data file not found at {INDUSTRY_SEED_PATH}")
        return _empty_industry_response(company, role)

    try:
        with open(INDUSTRY_SEED_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"Failed to read industry seed data: {e}")
        return _empty_industry_response(company, role)

    companies = data.get("companies", [])
    
    for comp in companies:
        if company.lower() in comp.get("company", "").lower() and role.lower() in comp.get("role", "").lower():
            comp_copy = dict(comp)
            
            if city:
                city_lower = city.lower()
                filtered_matches = []
                for match in comp_copy.get("matches", []):
                    loc = match.get("location", "").lower()
                    cname = match.get("college_name", "").lower()
                    if city_lower in loc or city_lower in cname:
                        filtered_matches.append(match)
                comp_copy["matches"] = filtered_matches

            # Inject the user's requested skills to generate a realistic matched_skills payload for the UI
            skills_to_map = skills if skills else ["Java", "SQL", "Spring Boot", "Git"]
            prefixes = ["Advanced", "Applied", "Enterprise", "Fundamentals of", "Core"]
            suffixes = ["Systems", "Architecture", "Engineering", "Development", "Concepts"]

            for match in comp_copy.get("matches", []):
                seed = len(match.get("college_name", ""))
                score = match.get("matching_score", 80)
                
                matched_skills = []
                for idx, skill in enumerate(skills_to_map[:5]):
                    sim = (score / 100) - (0.02 * ((seed + idx) % 4))
                    prefix = prefixes[(seed + idx) % len(prefixes)]
                    suffix = suffixes[(seed + idx * 2) % len(suffixes)]
                    cur_skill = f"{prefix} {skill}" if idx % 2 == 0 else f"{skill} {suffix}"
                    
                    matched_skills.append({
                        "curriculum_skill": cur_skill,
                        "industry_skill": skill,
                        "similarity": max(0.65, min(0.99, sim))
                    })
                match["matched_skills"] = matched_skills

            comp_copy["provider"] = "SEEDED_DATA"
            comp_copy["data_mode"] = "seed"
            comp_copy["model"] = "local_seed"
            comp_copy["fallback_used"] = True
            comp_copy["generated_at"] = datetime.utcnow().isoformat()
            return comp_copy

    # Fallback to the first company if no exact match (since it's a seed dataset)
    if companies:
        comp_copy = dict(companies[0])
        comp_copy["provider"] = "SEEDED_DATA"
        comp_copy["data_mode"] = "seed"
        comp_copy["model"] = "local_seed"
        comp_copy["fallback_used"] = True
        comp_copy["generated_at"] = datetime.utcnow().isoformat()
        return comp_copy

    return _empty_industry_response(company, role)

def _empty_student_response(cities, state, branch):
    return {
        "search": {"cities": cities, "state": state, "branch": branch},
        "provider": "SEEDED_DATA",
        "data_mode": "seed",
        "model": "local_seed",
        "fallback_used": True,
        "generated_at": datetime.utcnow().isoformat(),
        "colleges": []
    }

def _empty_university_response(institution, department):
    return {
        "institution": institution,
        "department": department,
        "provider": "SEEDED_DATA",
        "data_mode": "seed",
        "model": "local_seed",
        "fallback_used": True,
        "generated_at": datetime.utcnow().isoformat(),
        "curriculum_analysis": {},
        "semesters": [],
        "recommendations": []
    }

def _empty_industry_response(company, role):
    return {
        "company": company,
        "role": role,
        "provider": "SEEDED_DATA",
        "data_mode": "seed",
        "model": "local_seed",
        "fallback_used": True,
        "generated_at": datetime.utcnow().isoformat(),
        "matches": []
    }
