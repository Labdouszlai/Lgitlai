import os
from pathlib import Path


def generate_documentation(repo_name: str, tech_stack: dict, structure: list, architecture: dict, beginner_mode: bool = False) -> dict:
    readme = _generate_readme(repo_name, tech_stack, structure, architecture, beginner_mode)
    api_docs = _generate_api_docs(structure)
    developer_guide = _generate_developer_guide(repo_name, structure, tech_stack, beginner_mode)

    return {
        "readme": readme,
        "api_documentation": api_docs,
        "developer_guide": developer_guide,
    }


def _generate_readme(repo_name: str, tech_stack: dict, structure: list, architecture: dict, beginner_mode: bool = False) -> str:
    frontend = ", ".join(tech_stack.get("frontend", [])) or "N/A"
    backend = ", ".join(tech_stack.get("backend", [])) or "N/A"
    database = ", ".join(tech_stack.get("database", [])) or "N/A"

    lines = [
        f"# {repo_name}",
        "",
        "## Project Overview",
        f"{repo_name} is a software project built with modern technologies." + (" This guide explains everything in simple, beginner-friendly terms." if beginner_mode else ""),
        "",
        "## Tech Stack",
        f"- **Frontend:** {frontend}",
        f"- **Backend:** {backend}",
        f"- **Database:** {database}",
        "",
        "## Features",
    ]

    dir_names = [d["name"] for d in structure]
    for name in dir_names[:8]:
        lines.append(f"- {name.capitalize()} module")

    lines += [
        "",
        "## Installation",
        "```bash",
        "# Clone the repository",
        f"git clone https://github.com/{repo_name.replace('_', '/') if '_' in repo_name else repo_name}.git",
        "# Install dependencies",
        "npm install  # or pip install -r requirements.txt",
        "```",
        "",
        "## Usage",
        "```bash",
        "# Start the development server",
        "npm run dev  # or python main.py",
        "```",
        "",
    ]

    if architecture.get("layers"):
        lines.append("## Architecture")
        lines.append("```")
        for layer in architecture["layers"]:
            lines.append(f"  {layer['name']}")
        lines.append("```")
        for flow in architecture.get("data_flow", []):
            lines.append(f"- {flow}")
        lines.append("")

    return "\n".join(lines)


def _generate_api_docs(structure: list) -> str:
    dir_names = [d["name"] for d in structure]
    has_api = "api" in dir_names or "routes" in dir_names or "controllers" in dir_names

    if not has_api:
        return "No API endpoints detected."

    lines = [
        "# API Documentation",
        "",
        "## Endpoints",
        "",
        "The following API endpoints are available:",
        "",
    ]

    for d in structure:
        if d["name"] in ("api", "routes", "controllers"):
            for child in d.get("children", [])[:10]:
                if child.endswith((".py", ".js", ".ts", ".jsx", ".tsx")):
                    name = child.rsplit(".", 1)[0]
                    lines.append(f"### `/{name}`")
                    lines.append(f"Handled by `{d['name']}/{child}`")
                    lines.append("")

    return "\n".join(lines)


def _generate_developer_guide(repo_name: str, structure: list, tech_stack: dict, beginner_mode: bool = False) -> str:
    lines = [
        f"# Developer Guide: {repo_name}",
        "",
        "## Project Structure",
        "",
    ]

    for d in structure:
        lines.append(f"### `{d['name']}/`")
        lines.append(d.get("explanation", "Contains related files."))
        if d.get("children"):
            for child in d["children"][:5]:
                lines.append(f"  - `{child}`")
        lines.append("")

    lines += [
        "## Development Workflow",
        "1. Clone the repository",
        "2. Install dependencies",
        "3. Make changes in the appropriate directory",
        "4. Run tests before committing",
        "5. Submit a pull request",
        "",
    ]

    return "\n".join(lines)
