import os
import logging
from github import Github, GithubException
from config import settings

logger = logging.getLogger(__name__)


def create_github_issues(repo_full_name: str, issues: list[dict]) -> list[dict]:
    token = settings.github_token
    if not token:
        logger.warning("No GitHub token configured. Issues generated locally only.")
        return issues

    try:
        g = Github(token)
        repo = g.get_repo(repo_full_name)
    except GithubException as e:
        logger.warning(f"Cannot access repo {repo_full_name}: {e}")
        return issues

    created = []
    for issue_data in issues:
        try:
            gh_issue = repo.create_issue(
                title=issue_data["title"],
                body=issue_data["body"],
                labels=issue_data.get("labels", []),
            )
            issue_data["github_url"] = gh_issue.html_url
            issue_data["github_number"] = gh_issue.number
            created.append(issue_data)
            logger.info(f"Created issue #{gh_issue.number}: {issue_data['title']}")
        except GithubException as e:
            logger.error(f"Failed to create issue '{issue_data['title']}': {e}")
            created.append(issue_data)
        if len(created) >= 5:
            break

    return created
