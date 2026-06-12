from pydantic import BaseModel
from typing import Optional


class AnalyzeRequest(BaseModel):
    repo_url: str
    beginner_mode: bool = False
    include_chat: bool = True


class AnalyzeResponse(BaseModel):
    repo_name: str
    tech_stack: dict
    structure: list
    architecture: dict
    code_review: list
    security: list
    documentation: dict
    health_score: dict
    improvements: list
    issues: list


class ChatRequest(BaseModel):
    repo_url: str
    question: str
    beginner_mode: bool = False


class ChatResponse(BaseModel):
    answer: str
    sources: list[str] = []
