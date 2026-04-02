from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # APP
    APP_NAME: str = "GridTrace AI"
    DEBUG: bool = True

    # DATABASE
    DATABASE_URL: str

    # GROQ
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    GROQ_TIMEOUT: int = 30
    GROQ_MAX_RETRIES: int = 3

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    # FLAGS
    ENABLE_TRACE_VALIDATION: bool = True
    LOG_LLM_RESPONSES: bool = False

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()