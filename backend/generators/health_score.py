def calculate_health_score(
    code_review: list,
    security: list,
    structure: list,
    tech_stack: dict,
) -> dict:
    architecture_score = _score_architecture(structure, tech_stack)
    security_score = _score_security(security)
    maintainability_score = _score_maintainability(code_review)
    documentation_score = _score_documentation(code_review)
    testing_score = _score_testing(structure)

    overall = int(round(
        architecture_score * 0.25 +
        security_score * 0.20 +
        maintainability_score * 0.20 +
        documentation_score * 0.20 +
        testing_score * 0.15
    ))

    return {
        "overall": min(overall, 100),
        "architecture": architecture_score,
        "security": security_score,
        "maintainability": maintainability_score,
        "documentation": documentation_score,
        "testing": testing_score,
        "rating": _get_rating(overall),
    }


def _score_architecture(structure: list, tech_stack: dict) -> int:
    score = 70
    if len(structure) >= 3:
        score += 10
    if len(structure) >= 6:
        score += 10
    if tech_stack.get("frontend"):
        score += 5
    if tech_stack.get("backend"):
        score += 5
    if tech_stack.get("database"):
        score += 5
    if tech_stack.get("infrastructure"):
        score += 5
    return min(score, 100)


def _score_security(security_issues: list) -> int:
    score = 100
    for issue in security_issues:
        sev = issue.get("severity", "low")
        if sev == "critical":
            score -= 25
        elif sev == "high":
            score -= 15
        elif sev == "medium":
            score -= 8
        else:
            score -= 3
    return max(score, 0)


def _score_maintainability(code_review: list) -> int:
    score = 90
    for issue in code_review:
        sev = issue.get("severity", "low")
        if sev == "critical":
            score -= 15
        elif sev == "high":
            score -= 10
        elif sev == "medium":
            score -= 5
        else:
            score -= 2
    return max(score, 0)


def _score_documentation(code_review: list) -> int:
    doc_issues = [i for i in code_review if i.get("type") == "documentation"]
    score = 80 - len(doc_issues) * 5
    return max(score, 0)


def _score_testing(structure: list) -> int:
    dir_names = [d["name"] for d in structure]
    has_tests = any("test" in name.lower() for name in dir_names)
    return 85 if has_tests else 40


def _get_rating(score: int) -> str:
    if score >= 90:
        return "Excellent"
    elif score >= 75:
        return "Good"
    elif score >= 55:
        return "Fair"
    else:
        return "Needs Improvement"
