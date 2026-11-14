# Implementation Plan: [Feature name] (Spec 001)

> **HOW.** Your AI agent can draft this from spec.md + constitution.md. You review and approve it before any code.

## Summary
[2 sentences: the approach.]

## Data model
```sql
-- new or changed tables
create table if not exists public.example (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.example enable row level security;
```

## API routes
| Method | Path | Body / query | Returns | Auth? |
|---|---|---|---|---|
| GET | /api/example | ?q= | Example[] | No |
| POST | /api/example | { … } (zod) | Example | Yes |

## Front-end components
| Component | Purpose | New / changed |
|---|---|---|
| `ExampleList.jsx` | shows items | New |

## AI usage (if any)
- Prompt purpose:
- Data passed as context:
- What happens when the model fails:

## Files that change
- `server/src/routes/example.js` (new)
- `server/src/index.js` (register route)
- `client/src/api.js` (helpers)

## New packages (each needs a reason)
- none

## Risks & how we'll test
- [risk] → [test]

## Constitution check
- [ ] Security ✔ [ ] Accessibility ✔ [ ] Honest AI ✔ [ ] Privacy ✔ [ ] Simplicity ✔
