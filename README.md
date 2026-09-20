# 🚀 SkillSync

SkillSync is an AI-powered intelligence platform designed to bridge the widening gap between academia and industry. By analyzing university curriculums against real-world job market demands, SkillSync provides actionable insights to universities, empowers students to make informed college choices, and helps industries pinpoint campuses that produce exactly the talent they need.

## ⚠️ The Problem

The technology landscape evolves at lightning speed, but academic curriculums often struggle to keep pace. This leads to three distinct challenges:
1. **Universities** lack real-time visibility into exact industry skill demands, making it difficult to update 4-year degree programs effectively.
2. **Students** blindly choose colleges without knowing if the curriculum actually prepares them for modern job roles.
3. **Industries** waste massive resources doing broad campus recruitment because they don't know which specific colleges are teaching the niche skills their job roles require.

## 💡 The Solution

SkillSync leverages advanced proprietary analysis algorithms and semantic intelligence to bridge the gap. It solves the problem through three dedicated portals:

* **🎓 University Portal**: Colleges can upload their entire 8-semester curriculum. SkillSync's AI compares it against current industry trends, identifies critical skill gaps, visualizes projected placement readiness, and generates complete, downloadable PDF Curriculum Intelligence Reports to aid in accreditation and syllabus updates.
* **👨‍🎓 Student Portal**: Students can search for engineering colleges based on location and branch. Instead of relying on generic rankings, they receive AI-generated insights on how well a college's curriculum aligns with industry expectations.
* **🏢 Industry Portal**: Recruiters can input a job description and required skills. The AI scans regional college curriculums and returns a ranked list of campuses that mathematically match the skill requirements, pinpointing exactly where to hire.

## 🛠️ Technology Stack

SkillSync is built using a modern, scalable, and highly responsive architecture.

### **Frontend**
- **React.js (Vite)**: For blazing-fast component rendering and development.
- **Tailwind CSS**: For beautiful, responsive, glassmorphism-inspired UI design.
- **Framer Motion**: For buttery-smooth micro-interactions and layout animations.
- **Lucide React**: Clean, consistent iconography.
- **jsPDF**: For generating programmatic, multi-page data reports directly in the browser.

### **Backend**
- **FastAPI (Python)**: High-performance backend routing and asynchronous AI job management.
- **SQLAlchemy (SQLite)**: ORM for robust data modeling and user profile management.
- **JWT (JSON Web Tokens)**: Secure authentication and role-based access control.

### **Core Intelligence Engine**
- **Semantic Analysis**: Deep natural language processing algorithms to map academic syllabuses against live job market requirements.
- **Skill-Matching Heuristics**: Advanced mathematical modeling to generate curriculum-industry match scores.
- **Data Engineering**: A highly reliable backend data orchestrator that guarantees fast, asynchronous processing of complex curriculum datasets.

## ⚙️ Features & Highlights

- **Multi-Tenant Architecture**: Distinct, role-based dashboards for Universities, Students, and Industries.
- **Real-Time AI Polling**: Background threading architecture where the frontend smoothly polls the backend while AI tasks process asynchronously.
- **Curriculum Heatmaps**: Visual representations of where skills are taught across 8 semesters.
- **Automated PDF Generation**: One-click generation of comprehensive "Curriculum Intelligence Reports" ready for academic committees.
- **Dark Mode Support**: Global appearance toggles persisted across sessions.

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+

### Backend Setup
```bash
# Navigate to the backend directory
cd SkillSync

# Install dependencies (assuming a virtual environment is activated)
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Navigate to the frontend directory
cd SkillSync/frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

---
