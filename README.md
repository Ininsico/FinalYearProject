# Fablet

Fablet is an online teaching academy. Courses across mathematics, physics,
computer science, business and design are drafted with AI, directed by
instructors, and delivered to students as short video, reading, exercise and
quiz lessons. Institutions run their own academies on the platform with seat
plans, member management, and the same AI course-building tools.

## Repository layout

| Path | What lives there |
| --- | --- |
| `apps/web` | Marketing site and the student, institution and admin consoles (React 19, Vite, Tailwind v4) |
| `apps/api` | The API service: auth, courses, subscriptions, payments (Node, Express 5, MongoDB) |
| `apps/mobile` | Flutter companion app |
| `apps/desktop` | Tauri desktop shell |
| `services/ai` | Course content generation: RAG, lessons, quizzes, knowledge graphs (Flask, ChromaDB, Groq) |
| `deploy` | Deployment tooling, VM pipeline references and configs |
| `docs` | [Deployment runbook](docs/deployment.md), [architecture vision](docs/architecture/vision.md), research |

## Local development

```sh
# web (dev server proxies /api to 127.0.0.1:4000)
cd apps/web && npm install && npm run dev

# api (needs a MongoDB reachable via apps/api/.env)
cd apps/api && npm install && npm run dev

# ai service
cd services/ai && powershell -File setup.ps1     # Windows first-time setup
.\.venv\Scripts\python.exe app.py
```

## Deployment

Pushing to `main` ships automatically: GitHub sends a push webhook to the
deploy receiver on the VM, which pulls, builds, and publishes. The full
runbook is in [docs/deployment.md](docs/deployment.md).

## License

No license file is included yet. Until one is added, all rights are reserved.
