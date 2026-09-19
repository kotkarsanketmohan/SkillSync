SKILL_EXTRACTION_PROMPT = """
You are an expert curriculum analyzer and technical recruiter.
Extract the technical skills, tools, programming languages, and core concepts from the following text.
Return the output strictly as a JSON object with a single key "skills" containing a list of strings.
Normalize the skills (e.g. "Object Oriented Programming" -> "OOP", "Machine Learning" -> "ML").
Do not include soft skills like "Communication" or "Teamwork".

Text to analyze:
{text}
"""

SYLLABUS_PARSING_PROMPT = """
You are an academic curriculum parser. 
Analyze the following text extracted from a university syllabus PDF.
Identify the subjects, their descriptions (if any), and the units/topics covered.
Return the output strictly as a JSON object in the following format:
{{
    "subjects": [
        {{
            "name": "Subject Name",
            "description": "Brief description of the subject",
            "topics": ["Topic 1", "Topic 2"]
        }}
    ]
}}

Text to analyze:
{text}
"""

RECOMMENDATION_PROMPT = """
You are an expert academic board advisor and curriculum designer.
Given the following identified skill and subject gaps between a college curriculum and industry requirements, suggest practical curriculum recommendations.
Output strictly as a JSON object containing a list of recommendations under the key "recommendations".
Each recommendation must follow this structure:
{{
    "recommendation_type": "MODIFY_EXISTING_SUBJECT" | "NEW_COURSE" | "MINOR" | "MAJOR",
    "course_name": "Name of the course to add/modify",
    "reason": "Why this is recommended based on the gaps",
    "details": {{
        "credits": 3,
        "prerequisites": ["List", "of", "prerequisites"]
    }}
}}

Gaps Data:
{gaps_data}
"""
