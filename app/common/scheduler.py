import logging
from apscheduler.schedulers.background import BackgroundScheduler
from app.industry.service import IndustryDatasetRefreshService
from app.database.database import SessionLocal

logger = logging.getLogger(__name__)

def run_industry_refresh():
    """
    Wrapper to run the industry refresh with a fresh DB session.
    """
    logger.info("Triggering scheduled 24-hour industry dataset refresh...")
    db = SessionLocal()
    try:
        # Hardcoding Pune/Maharashtra/Computer Engineering for the assignment.
        # In a real app, this would iterate over active student profiles' preferred locations.
        IndustryDatasetRefreshService.run_refresh(
            db=db,
            city="Pune",
            state="Maharashtra",
            branch="Computer Engineering"
        )
    except Exception as e:
        logger.error(f"Scheduled refresh failed: {e}")
    finally:
        db.close()

class SchedulerManager:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        
    def start(self):
        # Run every 24 hours
        self.scheduler.add_job(
            run_industry_refresh, 
            'interval', 
            hours=24,
            id='daily_industry_refresh',
            replace_existing=True
        )
        self.scheduler.start()
        logger.info("APScheduler started successfully.")
        
    def shutdown(self):
        self.scheduler.shutdown()
        logger.info("APScheduler shut down successfully.")

# Singleton
scheduler_manager = SchedulerManager()
