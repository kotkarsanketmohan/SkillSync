import os
import sys
import logging
from dotenv import load_dotenv

# Add the root directory to sys.path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.services.industry_scraper import IndustryDataService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    load_dotenv()
    db = SessionLocal()
    
    title = "Data Scientist"
    location = "Pune"
    max_jobs = 5  # Keeping it low for testing/demo
    
    try:
        logger.info(f"Starting seeding process for {title} in {location}")
        dataset_id = IndustryDataService.scrape_and_process_jobs(db, title, location, max_jobs)
        if dataset_id:
            logger.info(f"Successfully seeded industry data. Dataset ID: {dataset_id}")
        else:
            logger.error("Failed to seed industry data.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
