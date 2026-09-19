import logging
from typing import List
from groq import Groq
from app.common.config import settings
from datetime import datetime

logger = logging.getLogger(__name__)

try:
    if settings.GROQ_API_KEY:
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
    else:
        groq_client = None
except Exception as e:
    logger.warning(f"Failed to initialize Groq Client: {e}")
    groq_client = None


def generate_groq_research_colleges(cities: List[str], state: str, branch: str) -> dict:
    if not groq_client:
        raise ValueError("GROQ_API_UNAVAILABLE")

    prompt = f"""
You are the AI research engine for SkillSync.

Generate a structured college curriculum-industry alignment dataset for the requested location and branch.

Return only JSON.

City: {", ".join(cities)}
State: {state}
Branch: {branch}

For each relevant engineering college, you must extract and estimate the following information. You MUST generate data for EXACTLY 5 realistic engineering colleges matching the criteria. Do not return less than 5 colleges!
Provide realistic data. For example, if the city is Pune, ensure top-tier colleges like COEP, PICT, VIT, PCCOE, Cummins, and DYPCOE are included and ranked appropriately above lower-tier options.

Provide the following JSON structure:
college_name
university
city
state
branch
college_source_url
university_source_url
curriculum_status
curriculum_summary
major_subjects
curriculum_skills
industry_skills
matched_skills
skill_gaps
relevant_job_roles
curriculum_industry_match_score
explanation
data_confidence

The score represents estimated curriculum-industry skill alignment only.

It is NOT:
- college ranking
- reputation
- placement percentage
- fees
- infrastructure
- admission difficulty.

Do not create obviously fictional colleges.

Do not return markdown.

If information is uncertain, set data_confidence accordingly.

Return a JSON object in this format:
{{
  "colleges": [
    {{
      "college_name": "...",
      "university": "...",
      "city": "...",
      "state": "...",
      "branch": "...",
      "college_source_url": null,
      "university_source_url": null,
      "curriculum_status": "AI_RESEARCHED",
      "curriculum_summary": "...",
      "major_subjects": ["...", "..."],
      "curriculum_skills": ["...", "..."],
      "industry_skills": ["...", "..."],
      "matched_skills": ["...", "..."],
      "skill_gaps": ["...", "..."],
      "relevant_job_roles": ["...", "..."],
      "curriculum_industry_match_score": 75,
      "explanation": "...",
      "data_confidence": "MEDIUM"
    }}
  ]
}}
"""

    try:
        response = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=settings.GROQ_MODEL,
            response_format={"type": "json_object"},
            max_tokens=6000
        )
        content = response.choices[0].message.content
        import json
        data = json.loads(content)
        
        # Format to match StudentSearchAIResponse
        colleges = data.get("colleges", [])
        # Assign ranks
        colleges.sort(key=lambda x: x.get("curriculum_industry_match_score", 0), reverse=True)
        for i, c in enumerate(colleges):
            c["rank"] = i + 1
            
        return {
            "search": {
                "cities": cities,
                "state": state,
                "branch": branch
            },
            "provider": "GROQ",
            "data_mode": "AI_RESEARCH",
            "model": settings.GROQ_MODEL,
            "fallback_used": False,
            "generated_at": datetime.utcnow().isoformat(),
            "colleges": colleges
        }
    except Exception as e:
        logger.error(f"Groq API Error: {e}")
        error_msg = str(e).lower()
        if "429" in error_msg:
            raise ValueError("GROQ_QUOTA_EXHAUSTED")
        if "401" in error_msg or "403" in error_msg:
            raise ValueError("GROQ_AUTH_ERROR")
        raise ValueError("GROQ_API_ERROR")


def generate_groq_university_analysis(institution: str, department: str) -> dict:
    if not groq_client:
        raise ValueError("GROQ_API_UNAVAILABLE")

    prompt = f"""
You are the AI research engine for SkillSync.

Generate a highly detailed 8-semester curriculum analysis and industry alignment report for the following university department.

Institution: {institution}
Department: {department}

You must return ONLY a valid JSON object matching the following structure exactly. Do not wrap it in markdown. Do not add any conversational text.

{{
  "institution": "{institution}",
  "department": "{department}",
  "curriculum_analysis": {{
    "curriculum_alignment": "High/Medium/Low",
    "skill_gaps": ["skill1", "skill2"],
    "subject_gaps": ["subject1"],
    "placement_intelligence": {{
      "roles": ["role1", "role2"],
      "covered_skills": ["skill1", "skill2"],
      "missing_skills": ["skill1", "skill2"],
      "projected_match": 85
    }}
  }},
  "semesters": [
    {{
      "semester": 1,
      "subjects": [
        {{
          "course_code": "CS101",
          "course_name": "Programming",
          "credits": 4,
          "skills": ["C", "Logic"]
        }}
      ]
    }}
  ],
  "recommendations": [
    {{
      "course_name": "Cloud Native Architecture",
      "reason": "High demand",
      "details": {{"credits": 3, "topics": ["Docker", "Kubernetes"]}}
    }}
  ]
}}
"""
    try:
        response = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=settings.GROQ_MODEL,
            response_format={"type": "json_object"},
            max_tokens=6000
        )
        content = response.choices[0].message.content
        import json
        data = json.loads(content)
        data["provider"] = "GROQ"
        data["data_mode"] = "AI_RESEARCH"
        data["model"] = settings.GROQ_MODEL
        data["fallback_used"] = False
        data["generated_at"] = datetime.utcnow().isoformat()
        return data
    except Exception as e:
        logger.error(f"Groq API Error: {e}")
        raise ValueError("GROQ_API_ERROR")

def generate_groq_industry_matches(company: str, role: str, skills: List[str], city: str = None) -> dict:
    if not groq_client:
        raise ValueError("GROQ_API_UNAVAILABLE")

    skills_str = ", ".join(skills)
    prompt = f"""
You are the AI research engine for SkillSync.

Find the top colleges that match the following job role requirements.

Company: {company}
City: {city}
Role: {role}
Required Skills: {skills_str}

Return a valid JSON object containing exactly 10 colleges with their match scores (out of 100). Do not include markdown.
Make sure to include a 'location' for each college.
Also generate a 'matched_skills' array for each college. This array should contain up to 5 elements mapping the required skills to specific curriculum subjects taught at that college. Each object should have 'curriculum_skill' (the subject taught), 'industry_skill' (the requested skill it maps to), and 'similarity' (a float between 0 and 1).

{{
  "company": "{company}",
  "role": "{role}",
  "matches": [
    {{
      "college_name": "College 1",
      "location": "City, State",
      "matching_score": 95,
      "campus_recommendation": "Short 2 sentence recommendation on whether to recruit here.",
      "why_this_campus": "A paragraph explaining why this campus aligns with the required skills and what specific curriculum parts match.",
      "matched_skills": [
         {{"curriculum_skill": "Advanced Programming", "industry_skill": "Java", "similarity": 0.95}}
      ]
    }}
  ]
}}
"""
    try:
        response = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=settings.GROQ_MODEL,
            response_format={"type": "json_object"},
            max_tokens=2000
        )
        content = response.choices[0].message.content
        import json
        data = json.loads(content)
        data["provider"] = "GROQ"
        data["data_mode"] = "AI_RESEARCH"
        data["model"] = settings.GROQ_MODEL
        data["fallback_used"] = False
        data["generated_at"] = datetime.utcnow().isoformat()
        return data
    except Exception as e:
        logger.error(f"Groq API Error: {e}")
        raise ValueError("GROQ_API_ERROR")
