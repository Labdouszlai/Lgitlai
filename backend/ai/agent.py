from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
try:
    from langchain_ollama import ChatOllama
except ImportError:
    from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from config import settings


class AgentState(TypedDict):
    repo_url: str
    repo_path: str
    repo_name: str
    tech_stack: Optional[dict]
    structure: Optional[list]
    architecture: Optional[dict]
    code_review: Optional[list]
    security: Optional[list]
    documentation: Optional[dict]
    health_score: Optional[dict]
    improvements: Optional[list]
    issues: Optional[list]
    beginner_mode: bool


def get_llm():
    if settings.use_local_llm:
        return ChatOllama(
            model=settings.local_llm_model,
            base_url=settings.local_llm_endpoint,
            temperature=0.1,
        )
    return ChatOpenAI(
        model=settings.openai_model,
        temperature=0.1,
        api_key=settings.openai_api_key,
    )


def get_llm_chat():
    if settings.use_local_llm:
        return ChatOllama(
            model=settings.local_llm_model,
            base_url=settings.local_llm_endpoint,
            temperature=0.3,
        )
    return ChatOpenAI(
        model=settings.openai_model,
        temperature=0.3,
        api_key=settings.openai_api_key,
    )


def build_analysis_graph():
    workflow = StateGraph(AgentState)
    workflow.set_entry_point("analyze")
    workflow.add_node("analyze", lambda state: state)
    workflow.add_conditional_actions(
        "analyze",
        lambda state: "complete" if state.get("tech_stack") else "analyze",
        {"complete": END, "analyze": "analyze"},
    )
    workflow.set_finish_point(END)
    return workflow.compile()
