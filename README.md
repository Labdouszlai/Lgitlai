# LgitLai

Paste a GitHub URL. Get a full breakdown of the repo — what it's built with, how it's structured, whether the code is clean and secure, plus auto-generated docs and a chat that answers questions about the code.

No sign-up. No API key needed for most features. Free and open source (MIT).

---

## What it does

- **Tech detection** — languages, frameworks, databases, infrastructure
- **Structure map** — explains every directory
- **Architecture diagram** — shows how data flows through the app
- **Code review** — flags large functions, missing docs, duplicate logic
- **Security scan** — finds hardcoded secrets, SQL injection, missing auth
- **Documentation** — auto-generates README, API docs, developer guide
- **Health score** — 0–100 rating across 5 categories
- **Suggestions** — actionable tips for CI/CD, caching, testing, etc.
- **Issue generator** — creates GitHub issues from findings
- **Codebase chat** — ask questions in plain English, get answers with source references
- **Beginner mode** — explains everything in simple terms

---

## Quick start

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

### Run it

```bash
# 1. Clone
git clone https://github.com/Labdouszlai/Lgitlai.git
cd Lgitlai

# 2. Backend
cd backend
python -m venv .venv

# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
python main.py
# API runs at http://localhost:8000

# 3. Frontend (open a second terminal)
cd frontend
npm install
npm run dev
# UI opens at http://localhost:3000
```

Open the browser, paste a GitHub URL like `https://github.com/facebook/react`, hit Analyze. That's it.

### Docker

```bash
docker compose up --build
```

### Configuration (optional)

Copy `backend/.env.example` to `backend/.env`:

| Variable | What it's for | Required? |
|----------|--------------|-----------|
| `OPENAI_API_KEY` | Powers the chat feature | Only for chat |
| `GITHUB_TOKEN` | Lets you create issues on the analyzed repo | Only for issue creation |
| `USE_LOCAL_LLM` | Use Ollama instead of OpenAI (`true`/`false`) | Only for chat |

Everything else — tech detection, code review, security, health score, docs, suggestions — works out of the box with zero config.

---

## Project structure

```
Lgitlai/
├── backend/
│   ├── api/            # FastAPI routes
│   ├── analysis/       # Cloning, structure, tech detection
│   ├── ai/             # Code review, security, architecture, chat
│   ├── generators/     # Docs, health score, issues, suggestions
│   ├── vector_store/   # FAISS embeddings
│   ├── tests/          # Pytest
│   ├── main.py
│   └── config.py
├── frontend/
│   ├── src/
│   │   ├── app/        # Pages & layout
│   │   ├── components/ # 12 UI components
│   │   ├── contexts/   # Theme provider
│   │   └── lib/        # API client
│   └── package.json
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## Deploy for free

### Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New Blueprint
3. Pick your LgitLai repo
4. Render reads `docker-compose.yml` and deploys everything

Render's free tier gives 750 hours/month — enough for 24/7.

### Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add `backend/` and `frontend/` as separate services

---

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/analyze` | Analyze a repo |
| POST | `/api/v1/chat` | Ask a question |
| GET | `/api/v1/health` | Health check |

---

## Tech stack

- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend:** Python, FastAPI, LangGraph, LangChain
- **Vector search:** FAISS
- **AI models:** OpenAI GPT or local Ollama

---

## Why I built this

I got tired of jumping between five different tools every time I wanted to understand a new codebase. GitHub tells you what files exist, but it doesn't tell you if the code is well-written, whether there are security holes, or how everything fits together. So I built LgitLai to do all of that in one place.

Paste a URL. Get answers. Simple as that.

— *labdouszlai*

---

## License

MIT — see [LICENSE](LICENSE).

Copyright 2026 labdouszlai.
