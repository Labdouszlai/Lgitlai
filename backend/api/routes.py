import os
import shutil
import asyncio
import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse

from models import AnalyzeRequest, AnalyzeResponse, ChatRequest, ChatResponse
from analysis.cloner import clone_repository, get_repo_path, parse_github_url, cleanup_repository
from analysis.structure import analyze_structure
from analysis.tech_detector import detect_tech_stack
from ai.code_review import review_codebase
from ai.security_analysis import analyze_security
from ai.architecture import analyze_architecture
from ai.chat import answer_question
from generators.documentation import generate_documentation
from generators.health_score import calculate_health_score
from generators.suggestions import generate_improvements
from generators.issues import generate_issues
from vector_store.embeddings import RepoVectorStore

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_repository(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    repo_path = None
    try:
        repo_path = clone_repository(request.repo_url)
        owner, repo = parse_github_url(request.repo_url)
        repo_name = f"{owner}/{repo}"

        tech_stack = detect_tech_stack(repo_path)
        structure = analyze_structure(repo_path)
        architecture = analyze_architecture(repo_path, tech_stack, structure, beginner_mode=request.beginner_mode)
        code_review = review_codebase(repo_path)
        security = analyze_security(repo_path)
        documentation = generate_documentation(repo_name, tech_stack, structure, architecture, beginner_mode=request.beginner_mode)
        health_score = calculate_health_score(code_review, security, structure, tech_stack)
        improvements = generate_improvements(tech_stack, structure, code_review, security, health_score)
        issues = generate_issues(code_review, security, improvements)

        if request.include_chat:
            background_tasks.add_task(_index_repo, request.repo_url, repo_path)

        return AnalyzeResponse(
            repo_name=repo_name,
            tech_stack=tech_stack,
            structure=structure,
            architecture=architecture,
            code_review=code_review,
            security=security,
            documentation=documentation,
            health_score=health_score,
            improvements=improvements,
            issues=issues,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        if repo_path and os.path.exists(repo_path):
            background_tasks.add_task(cleanup_repository, request.repo_url)


@router.post("/chat", response_model=ChatResponse)
async def chat_with_repository(request: ChatRequest):
    repo_path = None
    try:
        repo_path = get_repo_path(request.repo_url)
        if not os.path.exists(repo_path):
            repo_path = clone_repository(request.repo_url)

        owner, repo = parse_github_url(request.repo_url)
        answer, sources = await answer_question(
            repo_url=request.repo_url,
            repo_path=repo_path,
            question=request.question,
            beginner_mode=request.beginner_mode,
        )
        return ChatResponse(answer=answer, sources=sources)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "github-repo-analyzer"}


def _index_repo(repo_url: str, repo_path: str):
    try:
        vs = RepoVectorStore(repo_url)
        vs.index_repository(repo_path)
        logger.info(f"Indexed repository: {repo_url}")
    except Exception as e:
        logger.error(f"Failed to index repository {repo_url}: {e}")
