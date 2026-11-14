---
name: add-api-route
description: Add a new Express CRUD route (zod-validated) plus matching client api.js helpers to the CodeSquad starter. Use when the user asks for a new resource, endpoint, table, or API route.
---

# Add an API route

Follow these steps in order. Don't skip the schema step — it's where most bugs come from.

## 1. Data
- Add the table to `supabase/schema.sql` (uuid `id`, `created_at`, RLS enabled, a public-read policy only if the data is public).
- Add 25–40 realistic sample rows to a new `server/src/data/<name>.json`. Seed data quality matters as much as UI.

## 2. Server
- Create `server/src/routes/<name>.js`. First line: `import 'dotenv/config';`
- Define a zod schema. Every handler calls `safeParse` and returns `400` with `error.flatten()` on failure.
- Implement: `GET /` (with optional `q` filter), `GET /:id`, `POST /`, `PATCH /:id` (use `schema.partial()`), `DELETE /:id`.
- Wrap each handler in `try { … } catch (err) { next(err) }`.
- Register it in `server/src/index.js`: `app.use('/api/<name>', <name>Router);`

## 3. Client
- Add `get<Name>s`, `create<Name>` etc. to `client/src/api.js` using the existing `request()` helper.
- Never call Supabase or AI providers directly from the browser.

## 4. Verify
- `npm run dev`, then `curl http://localhost:3001/api/<name>` and one bad POST to confirm a 400.
- Summarize the files you touched for the student, in plain English.

Use `server/src/routes/resources.js` as the model to copy — match its structure and comment style.
