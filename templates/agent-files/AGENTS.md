# AGENTS.md

> Copy to your repo root. Keep it under ~60 lines. Add a rule every time the AI repeats a mistake.

## Project
[App name] — [one sentence: who it helps and how].

## Stack
- Client: React + Vite, plain JavaScript, [CSS / Tailwind]
- Server: Node 20+, Express, ES modules
- Data: [Supabase | MongoDB Atlas]
- AI: [Gemini / Groq / OpenRouter via OpenAI SDK]

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Test: `npm test`
- Build: `npm run build`

## Folder map
- `client/src/components/` — React components (one per file)
- `client/src/api.js` — every fetch call
- `server/src/routes/` — one router per resource
- `server/src/lib/` — db + ai helpers
- `specs/` — constitution + feature specs

## Rules
1. First line of every server file: `import 'dotenv/config';`
2. zod `safeParse` before every DB or AI call.
3. Secrets never in client code, logs, or commits.
4. `ownerId` comes from the verified token (`req.user.userId`), never `req.body`.
5. Multi-provider AI calls use `Promise.allSettled()`.
6. Keep and write teaching comments.
7. No new npm packages without asking.
8. Follow the current spec in `specs/`. If the spec is unclear, ask.

## Done means
- App runs with `npm run dev`
- Acceptance criteria in the spec pass
- You explained the change in plain English
