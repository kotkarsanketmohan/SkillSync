

### Variable Details
- `DATABASE_URL`: Connection string for your local PostgreSQL instance. Required for all persistence and vector searches.
- `GEMINI_API_KEY`: API key from Google AI Studio. Required for extracting skills and curriculum structure from syllabus PDFs. (Obtain from Google AI Studio).
- `APIFY_API_TOKEN`: API token for running scraping actors on company career portals. (Obtain from Apify).
- `JWT_SECRET_KEY`: Used by the existing authentication module to sign tokens. (Can be any strong random string for local dev).
- `DATA_MODE`: When set to "demo", the application bypasses external API calls (Gemini/Apify) and returns deterministic mock data.

## Step 3: Database & pgvector Setup

1. Ensure PostgreSQL is running.
2. Connect to PostgreSQL and create the database:
   ```sql
   CREATE DATABASE skillsync;
   \c skillsync
   CREATE EXTENSION vector;
   ```

## Step 4: Run Migrations

The Student Module includes a manual migration that adds all required tables (skills, datasets, subject units).

```bash
alembic upgrade head
```

## Step 5: Start FastAPI

Run the FastAPI development server:

```bash
uvicorn app.main:app --reload
```
This will also automatically start the `APScheduler` in the background for the 24-hour industry refresh pipeline.

## Step 6: Triggering the Industry Refresh

By default, the `industry_refresh_job` runs every 24 hours via APScheduler.
If you need to manually trigger it for testing:
You can create a temporary admin endpoint or simply invoke the service directly via a python shell:
```python
from app.core.database import SessionLocal
from app.services.industry import IndustryDatasetRefreshService

db = SessionLocal()
IndustryDatasetRefreshService.run_refresh(db, "Pune", "Maharashtra", "Computer Engineering")
```
### Verifying Failure Handling
If the collection fails (e.g., you put in a fake API key for Apify), the service will catch the error, mark the new dataset as `FAILED`, and rollback. Your previous `ACTIVE` dataset will remain safe and queryable.

## Step 7: Testing the Student API

You can test the API using the built-in Swagger UI at `http://localhost:8000/docs` or via Postman.

### 1. Discover Colleges & Match
**POST** `/api/student/college-search`

**Request**:
```json
{
  "city": "Pune",
  "state": "Maharashtra",
  "branch_interest": "Computer Engineering"
}
```

**Expected Flow**:
1. Colleges in Pune offering Computer Engineering are discovered (max 50).
2. The active industry dataset for Pune is loaded.
3. The semantic matching engine compares the curriculum embeddings of each college against the dataset.
4. Scores are calculated deterministically.
5. Colleges are ranked.

### 2. College Analysis Details
**GET** `/api/student/colleges/1/analysis`

Returns detailed evidence for the match score, including `matched_skills`, `partial_skills`, and `potential_gaps`.

## Step 8: Verifying Semantic Matching

In a real scenario, the SentenceTransformer (`all-MiniLM-L6-v2`) will encode skills. 
For example:
- **Curriculum**: `"Object Oriented Programming using Java"`
- **Industry**: `"Java OOP development"`

The embeddings will yield a high cosine similarity (e.g., `> 0.85`), classifying it as a `STRONG` match, demonstrating that the system understands meaning rather than just keyword counting.

## Step 9: Running Automated Tests

Run the pytest suite to verify deterministic scoring and location filtering:

```bash
pytest tests/test_student_discovery.py
pytest tests/test_matching_engine.py
pytest tests/test_industry_refresh.py
```

## Step 10: Verify Frontend Compatibility

```bash
cd frontend
npm run build
```
This ensures that none of the backend changes have broken the existing University/Industry frontend workflows.
