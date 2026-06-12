import os
import json
import re
from pathlib import Path

FRAMEWORK_SIGNATURES = {
    "frontend": {
        "react": {"files": ["package.json"], "deps": ["react", "react-dom"]},
        "next.js": {"files": ["next.config.js", "next.config.ts", "next.config.mjs"]},
        "vue": {"files": ["vue.config.js"], "deps": ["vue"]},
        "angular": {"files": ["angular.json"], "deps": ["@angular/core"]},
        "svelte": {"files": ["svelte.config.js"], "deps": ["svelte"]},
        "nuxt": {"files": ["nuxt.config.js", "nuxt.config.ts"], "deps": ["nuxt"]},
        "gatsby": {"files": ["gatsby-config.js"], "deps": ["gatsby"]},
        "tailwindcss": {"files": ["tailwind.config.js", "tailwind.config.ts"]},
        "bootstrap": {"deps": ["bootstrap"]},
        "material-ui": {"deps": ["@mui/material"]},
        "shadcn/ui": {"deps": ["@radix-ui/react"]},
    },
    "backend": {
        "node.js": {"files": ["package.json"], "deps": ["express", "fastify", "koa"]},
        "express": {"deps": ["express"]},
        "fastapi": {"files": ["requirements.txt", "pyproject.toml"], "deps": ["fastapi"]},
        "django": {"files": ["manage.py", "django"], "deps": ["django"]},
        "flask": {"files": [], "deps": ["flask"]},
        "laravel": {"files": ["artisan"], "deps": []},
        "spring boot": {"files": ["pom.xml", "build.gradle"], "deps": ["spring-boot"]},
        "rails": {"files": ["Gemfile", "config/routes.rb"], "deps": ["rails"]},
        "fastify": {"deps": ["fastify"]},
        "next.js (api)": {"files": ["package.json"], "deps": ["next"]},
    },
    "database": {
        "postgresql": {"deps": ["pg", "psycopg2", "psycopg", "sqlalchemy"]},
        "mongodb": {"deps": ["mongodb", "mongoose", "pymongo", "motor"]},
        "mysql": {"deps": ["mysql", "mysql2", "mysqlclient"]},
        "redis": {"deps": ["redis", "ioredis", "redis-py"]},
        "sqlite": {"deps": ["sqlite3", "better-sqlite3"]},
        "prisma": {"deps": ["prisma", "@prisma/client"]},
        "dynamodb": {"deps": ["aws-sdk", "boto3"]},
    },
    "infrastructure": {
        "docker": {"files": ["Dockerfile", "docker-compose.yml", "docker-compose.yaml"]},
        "kubernetes": {"files": ["k8s", "kubernetes", "deployment.yaml"]},
        "nginx": {"files": ["nginx.conf", ".nginx"]},
        "github actions": {"files": [".github/workflows"]},
        "terraform": {"files": ["*.tf"]},
        "aws": {"deps": ["aws-sdk", "boto3", "@aws-sdk"]},
    },
}

LANGUAGE_EXTENSIONS = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript (React)",
    ".ts": "TypeScript",
    ".tsx": "TypeScript (React)",
    ".java": "Java",
    ".rb": "Ruby",
    ".php": "PHP",
    ".go": "Go",
    ".rs": "Rust",
    ".swift": "Swift",
    ".kt": "Kotlin",
    ".cs": "C#",
    ".cpp": "C++",
    ".c": "C",
    ".scala": "Scala",
    ".r": "R",
    ".ex": "Elixir",
    ".exs": "Elixir",
}


def detect_tech_stack(repo_path: str) -> dict:
    result = {"languages": {}, "frontend": [], "backend": [], "database": [], "infrastructure": []}
    repo_path = Path(repo_path)
    package_json = _safe_read_json(repo_path / "package.json")
    requirements_txt = _safe_read_text(repo_path / "requirements.txt")
    pyproject_toml = _safe_read_text(repo_path / "pyproject.toml")
    gemfile = _safe_read_text(repo_path / "Gemfile")
    pom_xml = _safe_read_text(repo_path / "pom.xml")

    deps = _collect_dependencies(package_json, requirements_txt, pyproject_toml, gemfile, pom_xml)

    for category, frameworks in FRAMEWORK_SIGNATURES.items():
        for name, sig in frameworks.items():
            if _matches_signature(repo_path, sig, deps, package_json, requirements_txt):
                result[category].append(name)

    result["languages"] = _detect_languages(repo_path)
    return result


def _collect_dependencies(*args) -> set:
    deps = set()
    for arg in args:
        if isinstance(arg, dict):
            for section in ["dependencies", "devDependencies", "peerDependencies"]:
                deps.update(arg.get(section, {}).keys())
        elif isinstance(arg, str):
            for line in arg.splitlines():
                line = line.strip()
                if line and not line.startswith(("#", "//", "--")):
                    parts = re.split(r"[=~><!]", line)
                    if parts:
                        deps.add(parts[0].strip().lower().replace("_", "-"))
    return deps


def _matches_signature(repo_path, sig, deps, package_json, requirements_txt) -> bool:
    if sig.get("deps"):
        if any(dep in deps for dep in sig["deps"]):
            return True
    if sig.get("files"):
        for f in sig["files"]:
            if f.startswith("*"):
                if list(repo_path.glob(f)):
                    return True
            elif (repo_path / f).exists():
                return True
    return False


def _detect_languages(repo_path: Path) -> dict[str, int]:
    counts = {}
    for ext, lang in LANGUAGE_EXTENSIONS.items():
        files = list(repo_path.rglob(f"*{ext}"))
        if files:
            count = 0
            for f in files:
                try:
                    with open(f, "r", encoding="utf-8", errors="ignore") as fh:
                        count += sum(1 for _ in fh)
                except Exception:
                    pass
            if count > 0:
                counts[lang] = count
    return dict(sorted(counts.items(), key=lambda x: -x[1])[:10])


def _safe_read_json(path: Path) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def _safe_read_text(path: Path) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return ""
