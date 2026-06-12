import os
from pathlib import Path
from langchain_core.messages import HumanMessage, SystemMessage
from .agent import get_llm_chat
from vector_store.embeddings import RepoVectorStore


QA_SYSTEM_PROMPT = """You are an expert software engineer analyzing a GitHub repository.
Answer the user's question based on the repository code context provided.
Be concise, specific, and reference actual file paths and line numbers when possible.
If the context doesn't contain enough information, say so clearly.

Repository context:
{context}

Beginner mode: {beginner_mode}
{beginner_instruction}"""


async def answer_question(
    repo_url: str,
    repo_path: str,
    question: str,
    beginner_mode: bool = False,
) -> tuple[str, list[str]]:
    vector_store = RepoVectorStore(repo_url)
    docs = vector_store.similarity_search(question, k=6)

    context_parts = []
    sources = []
    for doc in docs:
        source = doc.metadata.get("source", "unknown")
        context_parts.append(f"--- {source} ---\n{doc.page_content}")
        if source not in sources:
            sources.append(source)

    context = "\n\n".join(context_parts)

    beginner_instruction = ""
    if beginner_mode:
        beginner_instruction = (
            "Explain concepts in simple terms suitable for a junior developer or student. "
            "Avoid jargon; when using technical terms, provide brief explanations. "
            "Use analogies where helpful."
        )

    system_prompt = QA_SYSTEM_PROMPT.format(
        context=context,
        beginner_mode=str(beginner_mode),
        beginner_instruction=beginner_instruction,
    )

    llm = get_llm_chat()
    response = await llm.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=question),
    ])

    return response.content, sources
