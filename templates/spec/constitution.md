# Project Constitution

> The rules every feature must follow. Write once, update rarely. Your AI agent reads this before every plan.

## Mission
[One sentence: who this helps and how. e.g. "Help Chicago residents find free, verified community resources in under a minute."]

## Users
- Primary: [e.g. adults 40+ on phones, some with limited English]
- Secondary: [e.g. community organizers who add listings]

## Tech stack (don't change without updating this file)
- Front end: React + Vite, plain JavaScript, plain CSS
- Back end: Node 20+, Express, ES modules
- Data: Supabase (Postgres) with Row Level Security on every table
- AI: OpenAI-compatible SDK → Gemini / Groq / OpenRouter with fallback
- Hosting: Render (API) + Vercel/Netlify (front end)

## Non-negotiables
1. **Security:** secrets only in server `.env`; zod `safeParse` on every input; `ownerId` from the verified token, never `req.body`.
2. **Accessibility:** every input has a label; keyboard-usable; text contrast ≥ 4.5:1; works at 375px wide.
3. **Honest AI:** answers are grounded in our data; the model says "I don't know" instead of guessing; show sources.
4. **Privacy:** don't send personal information to AI providers; collect only data we need.
5. **Simplicity:** no new npm package without a written reason in `plan.md`.
6. **Teachability:** code is commented so a classmate can follow it.

## Definition of done
- Acceptance criteria in `spec.md` pass
- Works on mobile and desktop
- README updated
- No console errors
