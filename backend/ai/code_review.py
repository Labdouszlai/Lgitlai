import os
import ast
import re
import hashlib
from pathlib import Path
from typing import Optional
from langchain_core.messages import HumanMessage, SystemMessage
from .agent import get_llm

EXCLUDED_FILES = {
    ".pyc", ".pyo", ".so", ".dll", ".dylib", ".min.js",
    ".min.css", ".map", ".svg", ".png", ".jpg", ".jpeg",
    ".gif", ".woff", ".woff2", ".ttf", ".eot", ".ico",
    ".mp4", ".webm", ".pdf", ".zip", ".tar", ".gz",
}

MAX_FILE_SIZE = 50000


def review_codebase(repo_path: str) -> list[dict]:
    issues = []
    source_files = _get_source_files(repo_path)
    function_hashes = {}

    for file_path in source_files:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except Exception:
            continue

        if len(content) > MAX_FILE_SIZE:
            content = content[:MAX_FILE_SIZE]

        ext = Path(file_path).suffix
        if ext == ".py":
            issues.extend(_analyze_python(file_path, content, function_hashes))
        else:
            issues.extend(_generic_analysis(file_path, content))

    issues.extend(_detect_duplicate_logic(function_hashes))
    issues.sort(key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(x.get("severity", "low"), 4))
    return issues[:50]


def _get_source_files(repo_path: str) -> list[str]:
    source_extensions = {
        ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".rb",
        ".php", ".go", ".rs", ".cs", ".cpp", ".c", ".swift",
        ".kt", ".scala", ".ex", ".exs",
    }
    files = []
    for root, dirs, filenames in os.walk(repo_path):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d not in {
            "node_modules", "__pycache__", ".git", "venv", "env",
            ".venv", ".next", "dist", "build", "target",
        }]
        for fname in filenames:
            ext = Path(fname).suffix
            if ext in source_extensions and not fname.startswith("."):
                fpath = os.path.join(root, fname)
                files.append(fpath)
    return files[:200]


def _detect_duplicate_logic(function_hashes: dict) -> list[dict]:
    issues = []
    seen = {}
    for func_key, func_info in function_hashes.items():
        body_hash = func_info.get("body_hash")
        if not body_hash:
            continue
        if body_hash in seen:
            prev = seen[body_hash]
            if func_info["file"] != prev["file"]:
                issues.append({
                    "type": "duplicate_logic",
                    "severity": "medium",
                    "file": func_info["file"],
                    "line": func_info["line"],
                    "message": f"Duplicate logic detected in '{func_info['function']}'. Similar to '{prev['function']}' in {prev['file']}:{prev['line']}.",
                })
        else:
            seen[body_hash] = func_info
    return issues[:10]


def _analyze_python(file_path: str, content: str, function_hashes: Optional[dict] = None) -> list[dict]:
    issues = []
    lines = content.splitlines()
    rel_path = os.path.relpath(file_path)

    if len(lines) > 500:
        issues.append({
            "type": "code_smell",
            "severity": "medium",
            "file": rel_path,
            "line": 1,
            "message": f"File is {len(lines)} lines long. Consider splitting into smaller modules.",
        })

    try:
        tree = ast.parse(content)
    except SyntaxError:
        issues.append({
            "type": "error",
            "severity": "high",
            "file": rel_path,
            "line": 1,
            "message": "File contains syntax errors.",
        })
        return issues

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            func_line_count = (node.end_lineno - node.lineno + 1) if hasattr(node, 'end_lineno') and node.end_lineno else (len(lines) - node.lineno + 1)
            if func_line_count > 500:
                issues.append({
                    "type": "code_smell",
                    "severity": "medium",
                    "file": rel_path,
                    "line": node.lineno,
                    "message": f"Large function '{node.name}' detected ({func_line_count} lines). Consider splitting responsibilities.",
                })
            if not node.name.startswith("_") and not node.name.startswith("test"):
                if not node.body or not ast.get_docstring(node):
                    issues.append({
                        "type": "documentation",
                        "severity": "low",
                        "file": rel_path,
                        "line": node.lineno,
                        "message": f"Public function '{node.name}' is missing a docstring.",
                    })
            if len(node.name) < 2 or node.name.isupper():
                issues.append({
                    "type": "naming",
                    "severity": "low",
                    "file": rel_path,
                    "line": node.lineno,
                    "message": f"Poor function name '{node.name}'. Use descriptive snake_case names.",
                })

        elif isinstance(node, ast.ClassDef):
            if not ast.get_docstring(node):
                issues.append({
                    "type": "documentation",
                    "severity": "low",
                    "file": rel_path,
                    "line": node.lineno,
                    "message": f"Class '{node.name}' is missing a docstring.",
                })

        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and function_hashes is not None:
            body_str = ast.dump(node)
            body_hash = hashlib.md5(body_str.encode()).hexdigest()
            func_key = f"{rel_path}:{node.name}"
            function_hashes[func_key] = {
                "file": rel_path,
                "line": node.lineno,
                "function": node.name,
                "body_hash": body_hash,
            }

    if re.search(r'print\s*\(', content):
        issues.append({
            "type": "debug",
            "severity": "low",
            "file": rel_path,
            "line": 1,
            "message": "Debug print statements found. Consider removing or replacing with logging.",
        })

    if re.search(r'try\s*:.*except\s*:', content, re.DOTALL):
        issues.append({
            "type": "code_smell",
            "severity": "medium",
            "file": rel_path,
            "line": 1,
            "message": "Bare except clause detected. Always specify exception types.",
        })

    return issues


def _generic_analysis(file_path: str, content: str) -> list[dict]:
    issues = []
    lines = content.splitlines()
    rel_path = os.path.relpath(file_path)

    if len(lines) > 500:
        issues.append({
            "type": "code_smell",
            "severity": "medium",
            "file": rel_path,
            "line": 1,
            "message": f"File is {len(lines)} lines long. Consider splitting into smaller modules.",
        })

    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if len(stripped) > 150:
            issues.append({
                "type": "code_smell",
                "severity": "low",
                "file": rel_path,
                "line": i,
                "message": f"Line is {len(stripped)} characters long. Consider breaking it up.",
            })
            if len(issues) >= 5:
                break

    return issues
