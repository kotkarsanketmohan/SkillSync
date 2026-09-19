# Exporting Base and all models to be discovered by Alembic
from app.database.database import Base
from app.auth.models import User, RefreshToken
from app.student.models import StudentProfile
from app.university.models import UniversityProfile
from app.industry.models import IndustryProfile
from app.common.skills_model import Skill, SkillAlias
from app.university.academic import University, College, Department, Syllabus, Subject, SubjectUnit, SubjectTopic, CurriculumSkill
from app.industry.industry_data import IndustryDataset, IndustryDatasetSkill, IndustrySource, JobDescription, IndustrySkill
from app.student.matching import MatchingResult, MatchingDetail, CurriculumRecommendation

from app.student.job import SearchJob
