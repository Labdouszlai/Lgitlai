import os
from pathlib import Path

EXCLUDED_DIRS = {
    ".git", "__pycache__", "node_modules", ".next", ".venv",
    "venv", "env", ".tox", "dist", "build", ".egg-info",
    ".github", "vendor", ".idea", ".vscode", "target",
}

EXCLUDED_FILES = {
    ".DS_Store", "Thumbs.db", "*.pyc", "*.pyo",
    "*.so", "*.dll", "*.dylib", "package-lock.json",
    "yarn.lock", ".gitignore",
}

DIRECTORY_EXPLANATIONS = {
    "components": "Reusable UI components used across the application.",
    "pages": "Application routes and page-level components.",
    "views": "View-level components that compose pages.",
    "routes": "Route handlers and URL endpoint definitions.",
    "services": "Business logic, external API communication, and service layer.",
    "api": "REST API endpoint definitions and request handlers.",
    "controllers": "Controllers that handle HTTP requests and orchestrate responses.",
    "middleware": "Middleware functions for request preprocessing and authentication.",
    "models": "Data models, database schemas, and ORM definitions.",
    "database": "Database connection setup, migrations, and query utilities.",
    "migrations": "Database migration files for schema versioning.",
    "config": "Configuration files and environment variable definitions.",
    "utils": "Utility functions, helpers, and shared constants.",
    "helpers": "Helper functions for common operations.",
    "lib": "Library code, third-party integrations, and shared modules.",
    "hooks": "Custom React hooks and reusable stateful logic.",
    "store": "State management store (Redux, Zustand, etc.).",
    "types": "TypeScript type definitions and interfaces.",
    "constants": "Application-wide constant values and enums.",
    "styles": "Stylesheets, CSS modules, and theming files.",
    "assets": "Static assets including images, fonts, and icons.",
    "public": "Publicly accessible static files served by the web server.",
    "tests": "Test files and testing utilities.",
    "__tests__": "Test files organized by feature or module.",
    "test": "Test suites and test configuration.",
    "e2e": "End-to-end test files.",
    "scripts": "Build scripts, automation scripts, and CLI tools.",
    "docker": "Docker configuration files and Dockerfile components.",
    "kubernetes": "Kubernetes deployment manifests and configurations.",
    "infrastructure": "Infrastructure-as-code definitions and cloud configs.",
    "ci": "CI/CD pipeline configuration files.",
    ".github": "GitHub-specific configurations including Actions workflows.",
    "docs": "Documentation files and API references.",
    "examples": "Example code and usage demonstrations.",
    "seeds": "Database seed files for development data.",
    "graphql": "GraphQL schema definitions, resolvers, and type definitions.",
    "websockets": "WebSocket handler definitions and connection management.",
    "auth": "Authentication and authorization logic.",
    "decorators": "Python/TypeScript decorator definitions.",
    "validators": "Input validation schemas and rules.",
    "serializers": "Data serialization and deserialization logic.",
    "filters": "Data filtering and query parameter handling.",
    "permissions": "Permission checks and access control rules.",
    "tasks": "Background task definitions and job queues.",
    "workers": "Background worker processes and consumer logic.",
    "cache": "Caching layer configuration and cache utility functions.",
    "logging": "Logging configuration and custom log handlers.",
    "errors": "Error handling middleware and custom exception classes.",
    "prompts": "Prompt templates and configuration definitions.",
    "tools": "Utility tools and helper functions for automation.",
}


def get_directory_name(path: str) -> str:
    return os.path.basename(path)


def explain_directory(dirname: str) -> str:
    return DIRECTORY_EXPLANATIONS.get(
        dirname,
        f"Contains {dirname}-related files and functionality.",
    )


def analyze_structure(repo_path: str) -> list[dict]:
    structure = []
    root = Path(repo_path)
    for item in sorted(root.iterdir()):
        if not item.is_dir():
            continue
        name = item.name
        if name in EXCLUDED_DIRS or name.startswith("."):
            continue
        structure.append({
            "name": name,
            "explanation": explain_directory(name),
            "children": _list_children(item),
        })
    return structure


def _list_children(directory: Path, max_depth: int = 2) -> list[str]:
    children = []
    try:
        for item in sorted(directory.iterdir()):
            if item.name.startswith(".") or item.name in EXCLUDED_DIRS:
                continue
            if item.is_dir():
                children.append(f"{item.name}/")
            elif not any(item.name.endswith(ext.replace("*", "")) for ext in EXCLUDED_FILES if ext.startswith("*")):
                children.append(item.name)
        return children[:30]
    except PermissionError:
        return []
