import os
import json
from pathlib import Path
from .agent import get_llm
from langchain_core.messages import HumanMessage, SystemMessage


def analyze_architecture(repo_path: str, tech_stack: dict, structure: list, beginner_mode: bool = False) -> dict:
    frontend = ", ".join(tech_stack.get("frontend", [])) or "Unknown"
    backend = ", ".join(tech_stack.get("backend", [])) or "Unknown"
    database = ", ".join(tech_stack.get("database", [])) or "Not detected"
    infra = ", ".join(tech_stack.get("infrastructure", [])) or "None"

    layers = []
    if tech_stack.get("frontend"):
        layers.append({"name": "Client Browser", "type": "client"})
        layers.append({"name": f"{frontend}", "type": "frontend"})
    if tech_stack.get("backend"):
        layers.append({"name": f"{backend}", "type": "backend"})
    if tech_stack.get("database"):
        layers.append({"name": f"{database}", "type": "database"})

    if not layers:
        is_python = any(lang.startswith("Python") for lang in tech_stack.get("languages", {}))
        if is_python:
            layers = [{"name": "Client Browser", "type": "client"}, {"name": "Python Application", "type": "backend"}]
        else:
            layers = [{"name": "Client Browser", "type": "client"}, {"name": "Web Application", "type": "frontend"}]

    data_flow = []
    for i in range(len(layers) - 1):
        data_flow.append(f"{layers[i]['name']} → {layers[i+1]['name']}")

    dir_names = [d["name"] for d in structure[:8]]
    description = _generate_ai_description(layers, tech_stack, dir_names, beginner_mode)

    return {
        "layers": layers,
        "data_flow": data_flow,
        "stack_summary": {"frontend": frontend, "backend": backend, "database": database, "infrastructure": infra},
        "description": description,
    }


def _generate_ai_description(layers, tech_stack, dir_names, beginner_mode):
    try:
        llm = get_llm()
        tone = "Explain in simple terms for a beginner developer. Avoid jargon." if beginner_mode else "Be concise and technical."
        prompt = (
            f"Given a repository with these architecture layers: {[l['name'] for l in layers]}, "
            f"tech stack: frontend={tech_stack.get('frontend')}, backend={tech_stack.get('backend')}, database={tech_stack.get('database')}, "
            f"and key directories: {dir_names}. "
            f"Write a 3-5 sentence architecture overview explaining how data flows through the system. {tone}"
        )
        response = llm.invoke([HumanMessage(content=prompt)])
        return response.content
    except Exception:
        return _generate_fallback_description(layers, dir_names)


def _generate_fallback_description(layers, dir_names):
    parts = ["The application follows a layered architecture:"]
    for layer in layers:
        parts.append(f"- **{layer['name']}** handles the {layer['type']} layer.")
    if dir_names:
        parts.append(f"Key directories include: {', '.join(dir_names)}.")
    return "\n".join(parts)
