# Fablet AI service

Flask + ChromaDB microservice behind Fablet's course content generation.

```
Frontend course editor
        │  (via the Node backend — the only caller)
        ▼
Backend  /api/admin/courses/:id/ai/*  ·  /api/institutions/modules/:id/ai/*
        │  X-AI-Key shared secret
        ▼
AI service (this folder, 127.0.0.1:8001)
   Flask  →  Guard (pacing + daily budgets)  →  Groq (gpt-oss)
        │
        ▼
   ChromaDB (persistent, one collection per course)
```

## What it does

- **RAG (vector)**: course knowledge sources, description and lesson content are
  chunked and embedded into a per-course Chroma collection (cosine similarity).
  Every generation request retrieves the most relevant chunks and grounds the
  prompt in them — no lexical guessing.
- **Generation**: course description + learning outcomes, per-lesson content,
  and quiz/assignment briefs, all via Groq (`openai/gpt-oss-120b`, falling back
  to `openai/gpt-oss-20b`).
- **Knowledge graph**: extracts 6–16 concept nodes with typed edges from the
  retrieved material; the backend persists the graph on the course.
- **Guardrails**: one call at a time with a minimum interval (requests/min cap),
  daily request and token budgets, prompt truncation, token caps, retries with
  backoff on Groq 429s. Limits live in `.env`.

## Run

```sh
cd Fablet/AI
.venv\Scripts\python.exe app.py        # Windows
# or:  .venv/bin/python app.py         # macOS/Linux
```

First install on Windows: `powershell -File setup.ps1` (creates the venv, installs
deps and pre-fetches the embedding model).

> The Chroma embedding bundle (~80MB) lives on a slow S3 bucket; the library's
> built-in downloader has a short read timeout and will fail on slow links.
> `setup.ps1` pre-downloads it once into `~/.cache/chroma/onnx_models` with a
> long timeout and verifies the SHA256, after which everything runs offline.

First run downloads the local embedding model (one-off) and creates `data/chroma`.

## Endpoints (all require `X-AI-Key` when AI_SERVICE_KEY is set)

| Method | Path | Body |
|---|---|---|
| GET  | `/health`  | — |
| GET  | `/status`  | — |
| POST | `/index`   | `{ courseId, sources[], description, lessons[] }` |
| POST | `/generate`| `{ courseId, mode: "describe" \| "lesson", brief, query, lessonType, instruction, sources[], description, lessons[] }` |
| POST | `/graph`   | `{ courseId, brief, sources[], description, lessons[] }` |
