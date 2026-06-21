# Forge 2 Qualifier — Kanban API



A tiny Trello-style Kanban board, built by a two-agent system (OpenClaw + Hermes) for the NMG Labs Forge 2 Qualifier.



## What it does



- Create boards, lists, and cards

- Move cards between lists

- Add coloured tags to cards

- Assign members to cards

- Set due dates, with overdue cards visually flagged



## Live URLs



- **Frontend:** https://forge2-qualifier-arijit-chowdhury.vercel.app

- **Backend API:** https://forge2-qualifier-arijit-chowdhury.onrender.com



> Note: the backend is on Render's free tier, so it may take 30–60 seconds to wake up after a period of inactivity.



## Tech stack



- **Backend:** Laravel 13 (PHP 8.4), REST API, SQLite

- **Frontend:** React + Vite

- **Agents:** OpenClaw (coding agent) + Hermes (orchestrator), wired through Slack

- **Models used (all free):**

 - Hermes (planning/brain) → Google Gemini `gemini-2.5-flash`

 - OpenClaw (coding/hands) → `gemma4:31b-cloud` via Ollama, with `qwen2.5-coder:7b` (local Ollama) and Groq `llama-3.3-70b-versatile` tested as alternatives during setup

 - *Why this routing:* Gemini's larger context window suited planning and task decomposition. OpenClaw's coding tasks were routed through Ollama-served models (confirmed acceptable by the organizers for any local/Ollama model) for fast, iterative code execution.



## Running locally



### Backend

```bash

cd backend

composer install

cp .env.example .env

php artisan key:generate

touch database/database.sqlite

php artisan migrate

php artisan serve

```

API runs at `http://localhost:8000`.



### Frontend

```bash

cd frontend

npm install

npm run dev

```

App runs at `http://localhost:5173`.



By default the frontend points at `http://localhost:8000/api` for local dev (set via `VITE_API_BASE_URL` in `.env.local`).



## Agent setup



See `ARCHITECTURE.md` for full details on the two-agent system, Slack channel scheme, and model routing.



## Evidence



- `agent-log.md` — chat exchanges between human → Hermes → OpenClaw

- `slack-export/` — screenshots of the chat loop, autonomous cron run, and Slack round-trip test

- `skills/status-report/SKILL.md` — Hermes skill for status updates

- Video walkthrough: [add link]

