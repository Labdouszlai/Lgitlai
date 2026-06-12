from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    openai_api_key: Optional[str] = None
    github_token: Optional[str] = None
    openai_model: str = "gpt-4o-mini"
    use_local_llm: bool = False
    local_llm_endpoint: str = "http://localhost:11434/v1"
    local_llm_model: str = "llama3.2"
    repos_storage_path: str = "./repos"
    vector_store_path: str = "./vector_store"
    host: str = "0.0.0.0"
    port: int = 8000
    allowed_origins: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
