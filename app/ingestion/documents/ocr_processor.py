import pytesseract
from PIL import Image
import io

def perform_ocr(image_bytes: bytes) -> str:
    """
    Extract text from an image using Tesseract OCR.
    Assumes pytesseract is correctly installed and in PATH.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
