import pymupdf  # PyMuPDF
from app.ingestion.documents.ocr_processor import perform_ocr

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF. If the PDF seems to be image-based (no extractable text),
    it falls back to OCR.
    """
    try:
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
        full_text = ""
        
        for page in doc:
            text = page.get_text()
            if not text.strip():
                # Fallback to OCR if page has no text (likely an image)
                pix = page.get_pixmap()
                img_bytes = pix.tobytes("png")
                text = perform_ocr(img_bytes)
            full_text += text + "\n"
        
        return full_text
    except Exception as e:
        print(f"PDF Processing Error: {e}")
        return ""
