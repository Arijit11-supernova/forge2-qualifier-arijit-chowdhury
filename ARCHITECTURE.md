\# Architecture



\## Two-agent system



| Agent | Role | Model |

|---|---|---|

| \*\*Hermes\*\* | Orchestrator / brain — plans tasks, remembers context across sessions, runs autonomously on a schedule | Google Gemini `gemini-2.5-flash` (free tier) |

| \*\*OpenClaw\*\* | Coding agent / hands — writes and runs code, reports results back in chat | `gemma4:31b-cloud` via Ollama (primary); `qwen2.5-coder:7b` local Ollama and Groq `llama-3.3-70b-versatile` tested as alternatives |



\*\*Why this routing:\*\* Hermes handles planning and decomposition, where a larger context window and reasoning quality matter most. OpenClaw's coding tasks were routed through Ollama-served models for fast, iterative execution — confirmed by the organizers as an acceptable free-stack choice for any local/Ollama model.



\## Slack channel scheme



| Channel | Purpose |

|---|---|

| `#sprint-main` | Human <-> Hermes. Goals, plans, and status updates land here. |

| `#agent-coder` | Hermes assigns tasks to OpenClaw; OpenClaw works and reports here. |

| `#agent-log` | Raw agent activity and autonomous-run output — the audit trail. |



\## The loop



1\. Human posts a goal in `#sprint-main`.

2\. Hermes plans it and posts a task breakdown.

3\. Hermes hands a task to OpenClaw in `#agent-coder`.

4\. OpenClaw writes code, runs it, and reports \*\*What I Did / What's Left / What Needs Your Call\*\*.

5\. Human reviews, approves, or corrects in chat.



No agent works in private DMs or off-channel — everything is visible.



\## Memory, skill, and autonomous run



\- \*\*Memory:\*\* Hermes was told the repo name and default branch in one session, then correctly recalled it in a separate, freshly-restarted gateway session — confirming cross-session memory (not just same-conversation recall).

\- \*\*Skill:\*\* `skills/status-report/SKILL.md` — a reusable skill that formats status updates into three sections (What I Did / What's Left / What Needs Your Call).

\- \*\*Autonomous run:\*\* a Hermes cron job posted an unprompted Kanban board status update to `#sprint-main` on its own schedule, with no manual trigger. Evidence in `agent-log.md` and `slack-export/`.



\## Repository structure



/backend     - Laravel API (PHP 8.4, SQLite)



/frontend    - React + Vite UI



/skills      - Hermes skill definitions



\## Deployment



\- \*\*Frontend\*\* -> Vercel, root directory `frontend`, env var `VITE\_API\_BASE\_URL` pointing at the live backend.

\- \*\*Backend\*\* -> Render (free tier), Docker runtime, root directory `backend`. PHP 8.4 + Laravel, SQLite database, migrations run at build time.



Render's free tier was chosen because Vercel doesn't support PHP/Laravel — only the React frontend is hosted there.

