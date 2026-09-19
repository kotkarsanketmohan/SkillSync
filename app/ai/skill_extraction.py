import json
from typing import List, Dict
from app.ai.gemini_service import get_gemini_response
from app.ai.prompts import SKILL_EXTRACTION_PROMPT, SYLLABUS_PARSING_PROMPT, RECOMMENDATION_PROMPT

def extract_skills_from_text(text: str) -> List[str]:
    prompt = SKILL_EXTRACTION_PROMPT.format(text=text)
    response_text = get_gemini_response(prompt, json_mode=True)
    try:
        data = json.loads(response_text)
        return data.get("skills", [])
    except Exception:
        return []

def parse_syllabus_text(text: str) -> Dict:
    prompt = SYLLABUS_PARSING_PROMPT.format(text=text)
    response_text = get_gemini_response(prompt, json_mode=True)
    try:
        return json.loads(response_text)
    except Exception:
        return {"subjects": []}

def generate_recommendations(gaps_data: dict) -> List[Dict]:
    prompt = RECOMMENDATION_PROMPT.format(gaps_data=json.dumps(gaps_data))
    response_text = get_gemini_response(prompt, json_mode=True)
    try:
        data = json.loads(response_text)
        return data.get("recommendations", [])
    except Exception:
        return []
