from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillSync Backend"
    
    # Database
    DATABASE_URL: str
    
    # Security
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # External APIs
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    APIFY_API_TOKEN: str = ""
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    AI_PROVIDER: str = "auto"
    AI_PRIMARY_PROVIDER: str = "groq"
    AI_FALLBACK_ENABLED: bool = True
    
    # App Config
    DATA_MODE: str = "demo"
    STUDENT_SEARCH_MODE: str = "GEMINI"
    STUDENT_SEARCH_FALLBACK: str = "seed"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    DEMO_MODE: bool = False
    DISABLE_AI_CACHE: bool = False
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
