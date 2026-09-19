# SkillSync Backend API

This is the backend for the SkillSync project, an AI-Powered Curriculum-Industry Alignment platform.
It uses FastAPI, PostgreSQL (with pgvector), and Gemini AI for analyzing academic curricula against industry requirements.

## Architecture & Technology Stack
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with `pgvector`
- **ORM**: SQLAlchemy
- **AI/NLP**: Google Gemini AI API, Sentence-Transformers (Local)
- **Authentication**: JWT, Role-Based Access Control (RBAC)

## Project Setup (Local Development - No Docker)

1. Create a Python Virtual Environment:
```bash
python -m venv .venv
.\.venv\Scripts\activate
```

2. Install Requirements:
```bash
pip install -r requirements.txt
```

3. Setup Database (PostgreSQL required):
Make sure you have PostgreSQL running locally with the `pgvector` extension installed.
Configure your `.env` file (copy `.env.example` -> `.env`) and update the `DATABASE_URL` and `GEMINI_API_KEY`.

4. Run Database Migrations:
```bash
alembic upgrade head
```

5. Seed Demo Data:
```bash
python scripts/seed_demo_data.py
```

6. Run the Server:
```bash
uvicorn app.main:app --reload
```

## API Documentation
Once the server is running, visit `http://127.0.0.1:8000/docs` for the interactive Swagger API documentation.

### User Roles & Demo Credentials
- **Student**: `student@example.com` / `student123`
- **University**: `university@example.com` / `university123`
- **Industry**: `industry@example.com` / `industry123`

## Features Implemented
- JWT Authentication & RBAC (Student, University, Industry endpoints are isolated).
- Syllabus PDF Processing with OCR fallback (PyMuPDF + Tesseract).
- Skill Extraction using Gemini AI.
- Semantic Vector Matching using SentenceTransformers and PostgreSQL `pgvector`.
- GAP Analysis and AI-driven Curriculum Recommendations.
