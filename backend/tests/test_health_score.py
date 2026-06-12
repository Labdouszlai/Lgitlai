import pytest
from generators.health_score import calculate_health_score


def test_perfect_score():
    score = calculate_health_score([], [], [
        {"name": "src", "explanation": "Source", "children": []},
        {"name": "tests", "explanation": "Tests", "children": []},
        {"name": "api", "explanation": "API", "children": []},
    ], {"frontend": ["react"], "backend": ["fastapi"], "database": ["postgres"], "infrastructure": ["docker"]})
    assert score["overall"] >= 80
    assert score["rating"] in ("Excellent", "Good")


def test_poor_score():
    score = calculate_health_score(
        [{"type": "code_smell", "severity": "critical", "message": "Bad"}],
        [{"type": "hardcoded_secret", "severity": "critical", "message": "Secret"}],
        [],
        {},
    )
    assert score["overall"] < 60


def test_score_range():
    score = calculate_health_score([], [], [], {})
    assert 0 <= score["overall"] <= 100
