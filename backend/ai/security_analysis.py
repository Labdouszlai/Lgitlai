import os
import re
from pathlib import Path

Q = '[\'"\']'
QOPT = Q + "?"

SECRET_PATTERNS = [
    (re.compile(r'(["\'])?(sk-[a-zA-Z0-9]{20,}|pk-[a-zA-Z0-9]{20,})(["\'])?'), "OpenAI API Key"),
    (re.compile(r'(["\'])?AIza[0-9A-Za-z\-_]{35}(["\'])?'), "Google API Key"),
    (re.compile(r'AKIA[0-9A-Z]{16}'), "AWS Access Key ID"),
    (re.compile(r'(?i)password\s*[:=]\s*[\'\"][^\'\"]{4,}[\'\"]'), "Hardcoded Password"),
    (re.compile(r'(?i)api[_-]?key\s*[:=]\s*[\'\"][^\'\"]{8,}[\'\"]'), "API Key"),
    (re.compile(r'(?i)secret\s*[:=]\s*[\'\"][^\'\"]{8,}[\'\"]'), "Secret Key"),
    (re.compile(r'(?i)token\s*[:=]\s*[\'\"][^\'\"]{8,}[\'\"]'), "Authentication Token"),
    (re.compile(r'(?i)private[_-]?key\s*[:=]\s*[\'\"][^\'\"]{8,}[\'\"]'), "Private Key"),
]

SQL_INJECTION_PATTERNS = [
    (re.compile(r'execute\s*\(\s*f[\"\']'), "f-string in SQL query"),
    (re.compile(r'executemany\s*\(\s*f[\"\']'), "f-string in SQL query"),
    (re.compile(r'raw\('), "Raw SQL query detected"),
    (re.compile(r'\$where\s*:'), "NoSQL injection risk in MongoDB"),
    (re.compile(r'whereRaw\s*\('), "Raw SQL where clause"),
]

PATH_TRAVERSAL_PATTERNS = [
    (re.compile(r"__import__\s*\(\s*[\"']os[\"']"), "Potential OS command injection"),
    (re.compile(r'os\.system\s*\('), "OS command execution"),
    (re.compile(r'subprocess\.(?:call|run|Popen)\s*\('), "Subprocess execution"),
    (re.compile(r'eval\s*\('), "Dangerous eval() usage"),
    (re.compile(r'exec\s*\('), "Dangerous exec() usage"),
    (re.compile(r'pickle\.loads?'), "Insecure deserialization with pickle"),
]

ROUTE_PATTERNS = [
    re.compile(r'@(?:app|router)\.(?:get|post|put|delete|patch)\([\"\']'),
]

AUTH_MIDDLEWARE_PATTERNS = [
    re.compile(r'@login_required'),
    re.compile(r'jwt_required'),
    re.compile(r'auth_required'),
    re.compile(r'require_auth'),
    re.compile(r'authenticate'),
    re.compile(r'@authenticated'),
    re.compile(r'middleware\s*\(\s*[\"\']auth[\"\']'),
    re.compile(r'UseGuards'),
    re.compile(r'@AuthGuard'),
    re.compile(r'@UseGuards'),
    re.compile(r'requireAuthentication'),
    re.compile(r'verifyToken'),
]


def analyze_security(repo_path: str) -> list[dict]:
    issues = []
    source_files = _get_analysis_files(repo_path)
    routes_found = []
    auth_usage = False

    for file_path in source_files:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except Exception:
            continue

        rel_path = os.path.relpath(file_path)
        lines = content.splitlines()

        for i, line in enumerate(lines, 1):
            stripped = line.strip()

            if re.match(r'^\s*#|^\s*//|^\s*/\*|^\s*\*|^\s*\*/', stripped):
                continue

            for pattern, label in SECRET_PATTERNS:
                if pattern.search(stripped) and not _is_test_file(file_path):
                    issues.append({
                        "type": "hardcoded_secret",
                        "severity": "critical",
                        "file": rel_path,
                        "line": i,
                        "message": f"Possible hardcoded {label} detected on line {i}.",
                        "recommendation": "Move to environment variables or a secrets manager.",
                    })
                    break

            for pattern, label in SQL_INJECTION_PATTERNS:
                if pattern.search(stripped):
                    issues.append({
                        "type": "sql_injection",
                        "severity": "critical",
                        "file": rel_path,
                        "line": i,
                        "message": f"Potential SQL injection risk: {label}.",
                        "recommendation": "Use parameterized queries or an ORM.",
                    })
                    break

            for pattern, label in PATH_TRAVERSAL_PATTERNS:
                if pattern.search(stripped):
                    issues.append({
                        "type": "insecure",
                        "severity": "high",
                        "file": rel_path,
                        "line": i,
                        "message": f"{label} detected. Validate all inputs if used with user data.",
                    })

            for pattern in ROUTE_PATTERNS:
                if pattern.search(stripped):
                    routes_found.append((rel_path, i, stripped))

            for pattern in AUTH_MIDDLEWARE_PATTERNS:
                if pattern.search(stripped):
                    auth_usage = True

    if routes_found and not auth_usage:
        sensitive_routes = [r for r in routes_found if any(
            kw in r[2].lower() for kw in ["admin", "user", "profile", "settings", "api"]
        )]
        if sensitive_routes:
            routes_desc = "; ".join([f"{r[0]}:{r[1]}" for r in sensitive_routes[:5]])
            issues.append({
                "type": "missing_auth",
                "severity": "high",
                "file": sensitive_routes[0][0],
                "line": sensitive_routes[0][1],
                "message": "Sensitive API routes detected without authentication middleware.",
                "recommendation": "Add authentication middleware to protect these routes.",
                "routes": routes_desc,
            })

    issues.sort(key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(x.get("severity", "low"), 4))
    return issues[:30]


def _get_analysis_files(repo_path: str) -> list[str]:
    files = []
    for root, dirs, filenames in os.walk(repo_path):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d not in {
            "node_modules", "__pycache__", ".git", "venv", "env",
            ".venv", ".next", "dist", "build", "target",
        }]
        for fname in filenames:
            ext = Path(fname).suffix
            if ext in {".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".rb", ".php", ".go", ".rs", ".yaml", ".yml", ".env"}:
                fpath = os.path.join(root, fname)
                files.append(fpath)
    return files[:200]


def _is_test_file(file_path: str) -> bool:
    parts = Path(file_path).parts
    return any("test" in p.lower() for p in parts)
