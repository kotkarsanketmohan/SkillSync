import sys
import os
import json

# Add parent directory to path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.ai.gemini_service import get_gemini_response

def test_gemini():
    print(f"Testing Gemini initialization...")
    print(f"Model: {settings.GEMINI_MODEL}")
    
    prompt = """
    Extract the following information into a JSON object:
    Text: SkillSync is an AI-Powered Curriculum-Industry Alignment Platform based in Pune, Maharashtra.
    Required keys: name, purpose, city, state.
    """
    
    print("Sending prompt to Gemini...")
    try:
        response_text = get_gemini_response(prompt, json_mode=True)
        print("Raw Response:", response_text)
        
        parsed = json.loads(response_text)
        print("Successfully parsed JSON:", json.dumps(parsed, indent=2))
        
        if parsed.get("name") == "SkillSync":
            print("\nSUCCESS: Gemini API is working correctly with structured output.")
        else:
            print("\nWARNING: Gemini API returned unexpected result.")
            
    except Exception as e:
        print(f"\nERROR: Failed to run Gemini test: {e}")

if __name__ == "__main__":
    test_gemini()
