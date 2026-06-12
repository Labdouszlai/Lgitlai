import os
import re
import shutil
import tempfile
from pathlib import Path
from git import Repo, GitCommandError
import httpx
from config import settings


def parse_github_url(url: str) -> tuple[str, str]:
    url = url.rstrip("/")
    match = re.search(r"github\.com[:/]([^/]+)/([^/]+?)(?:\.git)?$", url)
    if not match:
        raise ValueError(f"Invalid GitHub URL: {url}")
    owner, repo = match.group(1), match.group(2)
    return owner, repo


def clone_repository(url: str) -> str:
    owner, repo = parse_github_url(url)
    dest = os.path.join(settings.repos_storage_path, f"{owner}_{repo}")
    if os.path.exists(dest):
        shutil.rmtree(dest, ignore_errors=True)
    os.makedirs(settings.repos_storage_path, exist_ok=True)
    try:
        Repo.clone_from(f"https://github.com/{owner}/{repo}.git", dest, depth=1)
    except GitCommandError as e:
        raise RuntimeError(f"Failed to clone repository: {e}")
    return dest


def get_repo_path(url: str) -> str:
    owner, repo = parse_github_url(url)
    return os.path.join(settings.repos_storage_path, f"{owner}_{repo}")


def cleanup_repository(url: str):
    path = get_repo_path(url)
    if os.path.exists(path):
        shutil.rmtree(path, ignore_errors=True)
