import os
from pathlib import Path


def generate_improvements(
    tech_stack: dict,
    structure: list,
    code_review: list,
    security: list,
    health_score: dict,
) -> list[dict]:
    suggestions = []
    dir_names = {d["name"] for d in structure}

    critical_security = [s for s in security if s.get("severity") == "critical"]
    if critical_security:
        suggestions.append({
            "category": "security",
            "priority": "high",
            "suggestion": f"Fix {len(critical_security)} critical security vulnerabilities immediately.",
            "details": ", ".join(s["message"][:60] for s in critical_security[:3]),
        })

    if not dir_names.intersection({"tests", "test", "__tests__", "e2e"}):
        suggestions.append({
            "category": "testing",
            "priority": "high",
            "suggestion": "Add automated testing (unit tests, integration tests).",
            "details": "No test directory detected. Consider adding pytest or Jest test suites.",
        })

    if not tech_stack.get("infrastructure"):
        suggestions.append({
            "category": "infrastructure",
            "priority": "medium",
            "suggestion": "Add Docker containerization for consistent deployments.",
            "details": "Docker improves reproducibility and simplifies CI/CD integration.",
        })

    if not tech_stack.get("database"):
        suggestions.append({
            "category": "performance",
            "priority": "medium",
            "suggestion": "Implement caching with Redis or Memcached.",
            "details": "Caching can significantly improve response times for repeated queries.",
        })

    has_ci = dir_names.intersection({".github", "ci", ".circleci"})
    if not has_ci:
        suggestions.append({
            "category": "devops",
            "priority": "medium",
            "suggestion": "Set up CI/CD pipeline with GitHub Actions.",
            "details": "Automated testing and deployment ensures code quality and faster releases.",
        })

    large_files = [i for i in code_review if "lines long" in i.get("message", "")]
    if large_files:
        suggestions.append({
            "category": "maintainability",
            "priority": "medium",
            "suggestion": f"Refactor {len(large_files)} large files into smaller modules.",
            "details": "Large files are harder to maintain and understand.",
        })

    if not tech_stack.get("infrastructure") or "nginx" not in tech_stack.get("infrastructure", []):
        suggestions.append({
            "category": "performance",
            "priority": "low",
            "suggestion": "Implement rate limiting for API endpoints.",
            "details": "Prevents abuse and ensures fair resource usage.",
        })

    doc_issues = [i for i in code_review if i.get("type") == "documentation"]
    if doc_issues:
        suggestions.append({
            "category": "documentation",
            "priority": "low",
            "suggestion": f"Add docstrings/comments to {len(doc_issues)} undocumented functions and classes.",
            "details": "Good documentation improves developer onboarding and code maintainability.",
        })

    if health_score.get("testing", 0) < 60:
        suggestions.append({
            "category": "testing",
            "priority": "high",
            "suggestion": "Increase test coverage.",
            "details": "Current testing score is low. Aim for at least 70% code coverage.",
        })

    if security:
        suggestions.append({
            "category": "security",
            "priority": "high",
            "suggestion": "Conduct regular security audits and dependency vulnerability scans.",
            "details": f"{len(security)} issues were found in the automated scan.",
        })

    return suggestions
