---
name: add-api-route
description: Add a new Express CRUD route with zod validation, a Supabase table, seed data and client api.js helpers. Use when the user asks for a new endpoint, table, resource, or "CRUD for X".
---

# Add an API route (Express + zod + Supabase)

## Steps
1. **Table** — append to `supabase/schema.sql`: `id uuid default gen_random_uuid() primary key`, `created_at timestamptz default now()`, then `enable row level security` and only the policies the spec needs.
2. **Seed** — 25–40 realistic, clearly fictional rows in `server/src/data/<name>.json`.
3. **Route** — `server/src/routes/<name>.js`, modeled on `reference.md`:
   - First line `import 'dotenv/config';`
   - zod schema; `safeParse` in every handler; 400 + `error.flatten()` on failure
   - `GET /`, `GET /:id`, `POST /`, `PATCH /:id` (`schema.partial()`), `DELETE /:id`
   - `try/catch` → `next(err)`
4. **Register** — `app.use('/api/<name>', router)` in `server/src/index.js`.
5. **Client** — add helpers to `client/src/api.js`. Never call Supabase with the secret key from the browser.
6. **Verify** — run the server; curl one good and one bad request; report results.
7. **Explain** — list every file touched, one plain-English line each.
