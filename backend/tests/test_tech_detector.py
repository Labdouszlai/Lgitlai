import pytest
import tempfile
import json
from pathlib import Path
from analysis.tech_detector import detect_tech_stack, parse_github_url


def test_detect_react():
    with tempfile.TemporaryDirectory() as tmpdir:
        package = {"dependencies": {"react": "^18.0.0", "react-dom": "^18.0.0"}}
        Path(tmpdir, "package.json").write_text(json.dumps(package))
        result = detect_tech_stack(tmpdir)
        assert "react" in result["frontend"]


def test_detect_fastapi():
    with tempfile.TemporaryDirectory() as tmpdir:
        Path(tmpdir, "requirements.txt").write_text("fastapi\nuvicorn")
        result = detect_tech_stack(tmpdir)
        assert "fastapi" in result["backend"]


def test_detect_docker():
    with tempfile.TemporaryDirectory() as tmpdir:
        Path(tmpdir, "Dockerfile").write_text("FROM python:3.12")
        result = detect_tech_stack(tmpdir)
        assert "docker" in result["infrastructure"]


def test_detect_postgres():
    with tempfile.TemporaryDirectory() as tmpdir:
        package = {"dependencies": {"pg": "^8.0.0"}}
        Path(tmpdir, "package.json").write_text(json.dumps(package))
        result = detect_tech_stack(tmpdir)
        assert "postgresql" in result["database"]


def test_no_tech():
    with tempfile.TemporaryDirectory() as tmpdir:
        result = detect_tech_stack(tmpdir)
        assert result["frontend"] == []
        assert result["backend"] == []
        assert result["database"] == []
