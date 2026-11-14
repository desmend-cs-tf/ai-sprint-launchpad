# AGENTS.md — instructions for AI coding agents

> Read by Codex, Cursor, Copilot, Gemini CLI, Kiro, Antigravity, Claude Code (via CLAUDE.md) and most other agents.
> Keep it short. Update it every time the AI makes the same mistake twice.

## Project
Community Resource Finder — a CodeSquad AI Community Sprint starter.
- `client/` React 18 + Vite, **plain JavaScript (no TypeScript)**, plain CSS
- `server/` Node 20+, Express 4, ES modules (`import`/`export`)
- Data: Supabase (Postgres) via `server/src/lib/db.js`, in-memory fallback from `server/src/data/seed.json`
- AI: OpenAI-compatible SDK pointed at Gemini / Groq / OpenRouter in `server/src/lib/ai.js`

## Commands
- Install everything: `npm run install:all`
- Run both apps: `npm run dev` (client :5173, API :3001)
- Build client: `npm run build` · Production: `npm start`
- Seed Supabase: `npm run seed`

## Rules (non-negotiable)
1. `import 'dotenv/config';` is the FIRST line of every server file.
2. Validate every request body/query with **zod `safeParse`** before touching the DB or an AI model.
3. API keys live ONLY in `server/.env`. Never import secrets into `client/`. Never log them.
4. When auth exists, `ownerId` comes from `req.user.userId` — never from `req.body`.
5. Use `Promise.allSettled()` (not `Promise.all`) when calling several AI providers at once.
6. Keep teaching comments. Students read this code line by line — don't delete comments, add them.
7. Keep functions small; one route file per resource in `server/src/routes/`.
8. New DB columns → update `supabase/schema.sql`, `seed.json`, AND the zod schema together.

## Before you say "done"
- Run `npm run dev` and hit `http://localhost:3001/api/health`.
- Explain what you changed in plain English, file by file.
- If you weren't sure about something, say so instead of guessing.

## Specs
Feature specs live in `specs/<feature-name>/spec.md`, `plan.md`, `tasks.md`.
Implement tasks in order and tick them off in `tasks.md`.
