import pytest
import tempfile
from pathlib import Path
from ai.security_analysis import analyze_security


def test_detect_api_key():
    with tempfile.TemporaryDirectory() as tmpdir:
        Path(tmpdir, "config.py").write_text(
            'API_KEY = "sk-123456789012345678901234567890123456"\n'
        )
        issues = analyze_security(tmpdir)
        secrets = [i for i in issues if i["type"] == "hardcoded_secret"]
        assert len(secrets) > 0


def test_detect_sql_injection():
    with tempfile.TemporaryDirectory() as tmpdir:
        Path(tmpdir, "db.py").write_text(
            'query = f"SELECT * FROM users WHERE id={user_id}"\n'
        )
        issues = analyze_security(tmpdir)
        sqli = [i for i in issues if i["type"] == "sql_injection"]
        assert len(sqli) > 0


def test_clean_code_no_issues():
    with tempfile.TemporaryDirectory() as tmpdir:
        Path(tmpdir, "app.py").write_text(
            "def hello():\n    return 'world'\n"
        )
        issues = analyze_security(tmpdir)
        assert len(issues) == 0
