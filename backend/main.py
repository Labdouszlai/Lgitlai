import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from config import settings

app = FastAPI(
    title="GitHub Repository Analyzer",
    description="Analyzes GitHub repositories and generates architectural insights, "
                "code quality reports, security findings, documentation, and interactive chat.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

os.makedirs(settings.repos_storage_path, exist_ok=True)
os.makedirs(settings.vector_store_path, exist_ok=True)


@app.get("/")
async def root():
    return {
        "message": "GitHub Repository Analyzer API",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
