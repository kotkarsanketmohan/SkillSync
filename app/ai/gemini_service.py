from typing import List
from google import genai
from google.genai import types
from app.common.config import settings
import json
import logging
import time

try:
    import openai
except ImportError:
    openai = None

logger = logging.getLogger(__name__)

# Configure Gemini Client
try:
    gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
except Exception as e:
    gemini_client = None
    logger.warning(f"Failed to initialize Gemini Client: {e}")

# Configure OpenAI Client
try:
    if settings.OPENAI_API_KEY:
        openai_client = openai.Client(api_key=settings.OPENAI_API_KEY)
    else:
        openai_client = None
except Exception as e:
    openai_client = None
    logger.warning(f"Failed to initialize OpenAI Client: {e}")

def get_gemini_response(prompt: str, json_mode: bool = False) -> str:
    response, _ = get_ai_response_with_method(prompt, json_mode)
    return response

def get_ai_response_with_method(prompt: str, json_mode: bool = False) -> tuple[str, str]:
    """
    Returns (response_text, processing_method)
    """
    primary = settings.AI_PRIMARY_PROVIDER.lower()
    
    if primary == "gemini":
        methods = ["GEMINI", "OPENAI", "LOCAL_NLP"]
    elif primary == "openai":
        methods = ["OPENAI", "GEMINI", "LOCAL_NLP"]
    else:
        methods = ["GEMINI", "OPENAI", "LOCAL_NLP"]
        
    if not settings.AI_FALLBACK_ENABLED:
        methods = [methods[0]]
        
    last_error = None
        
    for method in methods:
        if method == "GEMINI":
            if not gemini_client:
                continue
            try:
                res = _call_gemini(prompt, json_mode)
                logger.info("AI processing completed using GEMINI")
                return res, "GEMINI"
            except Exception as e:
                last_error = e
                logger.warning(f"GEMINI provider failed: {e}")
                
        elif method == "OPENAI":
            if not openai_client:
                continue
            try:
                res = _call_openai(prompt, json_mode)
                logger.info("AI processing completed using OPENAI")
                return res, "OPENAI"
            except Exception as e:
                last_error = e
                logger.warning(f"OPENAI provider failed: {e}")
                
        elif method == "LOCAL_NLP":
            try:
                res = _call_local_nlp(prompt, json_mode)
                logger.info("AI processing completed using LOCAL_NLP")
                return res, "LOCAL_NLP"
            except Exception as e:
                last_error = e
                logger.warning(f"LOCAL_NLP provider failed: {e}")

    logger.error("All AI processing providers failed.")
    raise ValueError("GEMINI_API_ERROR") if "GEMINI" in methods else ValueError("AI_PROCESSING_ERROR")

def _call_gemini(prompt: str, json_mode: bool) -> str:
    config = types.GenerateContentConfig()
    if json_mode:
        config.response_mime_type = "application/json"
        
    max_retries = 3
    base_delay = 2
    
    last_error = None
    for attempt in range(max_retries):
        try:
            response = gemini_client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=config
            )
            return response.text
        except Exception as e:
            last_error = e
            error_msg = str(e).lower()
            if "429" in error_msg or "resource exhausted" in error_msg or "quota" in error_msg:
                logger.error(f"Gemini API quota exhausted (429). Bypassing retries. {e}")
                break
                
            if "503" in error_msg or "502" in error_msg or "unavailable" in error_msg or "too many requests" in error_msg:
                if attempt < max_retries - 1:
                    sleep_time = base_delay * (2 ** attempt)
                    logger.warning(f"Gemini API error (attempt {attempt + 1}/{max_retries}): {e}. Retrying in {sleep_time}s...")
                    time.sleep(sleep_time)
                    continue
            # For other errors, don't retry, just break
            break
            
    raise last_error

def _call_openai(prompt: str, json_mode: bool) -> str:
    response = openai_client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"} if json_mode else {"type": "text"}
    )
    return response.choices[0].message.content

def _call_local_nlp(prompt: str, json_mode: bool) -> str:
    # Deterministic fallback parsing
    # If json_mode is required, we construct a dummy empty valid JSON list.
    if json_mode:
        import json
        if "analyze the following raw college data" in prompt.lower():
            # Return an empty JSON list for discovery extraction
            return "[]"
        if "job description" in prompt.lower():
            # Return empty skills list for JD extraction
            return json.dumps({"skills": []})
        return "{}"
    return "Local processor successfully handled the request."

def generate_ai_research_colleges(cities: list, state: str, branch: str, fallback_used: bool = False) -> dict:
    """
    Generate a complete research dataset in one Gemini call.
    Raises GEMINI_QUOTA_EXHAUSTED if 429 quota exhaustion is detected.
    """
    if not gemini_client:
        raise ValueError("GEMINI_API_ERROR")

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
        response_text = _call_gemini(prompt, json_mode=True)
        import json
        text = response_text.strip()
        if text.startswith("```json"): text = text[7:]
        if text.startswith("```"): text = text[3:]
        if text.endswith("```"): text = text[:-3]
        
        data = json.loads(text.strip())
        colleges = data.get("colleges", [])
        
        # Sort and assign ranks
        colleges.sort(key=lambda x: x.get("curriculum_industry_match_score", 0), reverse=True)
        for i, c in enumerate(colleges):
            c["rank"] = i + 1
            
        from datetime import datetime
        return {
            "search": {
                "cities": cities,
                "state": state,
                "branch": branch
            },
            "provider": "GEMINI",
            "data_mode": "AI_RESEARCH",
            "model": settings.GEMINI_MODEL,
            "fallback_used": fallback_used,
            "generated_at": datetime.utcnow().isoformat(),
            "colleges": colleges
        }
    except Exception as e:
        error_str = str(e).lower()
        if "429" in error_str or "exhausted" in error_str or "quota" in error_str:
            raise ValueError("GEMINI_QUOTA_EXHAUSTED")
        if "401" in error_str or "403" in error_str:
            raise ValueError("GEMINI_AUTH_ERROR")
        raise ValueError("GEMINI_API_ERROR")


def generate_gemini_university_analysis(institution: str, department: str, fallback_used: bool = False) -> dict:
    if not gemini_client:
        raise ValueError("GEMINI_API_UNAVAILABLE")

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
        response = gemini_client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        content = response.text
        import json
        data = json.loads(content)
        data["provider"] = "GEMINI"
        data["data_mode"] = "AI_RESEARCH"
        data["model"] = settings.GEMINI_MODEL
        data["fallback_used"] = fallback_used
        data["generated_at"] = datetime.utcnow().isoformat()
        return data
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        raise ValueError("GEMINI_API_ERROR")

def generate_gemini_industry_matches(company: str, role: str, skills: List[str], fallback_used: bool = False, city: str = None) -> dict:
    if not gemini_client:
        raise ValueError("GEMINI_API_UNAVAILABLE")

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
        response = gemini_client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        content = response.text
        import json
        data = json.loads(content)
        data["provider"] = "GEMINI"
        data["data_mode"] = "AI_RESEARCH"
        data["model"] = settings.GEMINI_MODEL
        data["fallback_used"] = fallback_used
        data["generated_at"] = datetime.utcnow().isoformat()
        return data
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        raise ValueError("GEMINI_API_ERROR")
