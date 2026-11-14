# 04 · Supabase Setup (JavaScript)

Supabase = a hosted **Postgres database + Auth + file Storage + auto-generated APIs**. Think "MongoDB Atlas + Passport + S3" in one free dashboard.

**Free plan (check [supabase.com/pricing](https://supabase.com/pricing) for current limits):** 2 active projects, ~500 MB database, 50k monthly active users. Free projects **pause after ~7 days of no activity** — un-pause from the dashboard, or use the keep-awake GitHub Action in the starter.

## MongoDB → Supabase translation

| You know (MERN) | Supabase / Postgres |
|---|---|
| Database → collection | Project → **table** |
| Document | **Row** |
| Mongoose schema | `create table` SQL (or the Table Editor UI) |
| `_id` | `id uuid default gen_random_uuid()` |
| `Model.find({ category: 'food' })` | `supabase.from('resources').select('*').eq('category', 'food')` |
| `Model.create(doc)` | `supabase.from('resources').insert(doc).select().single()` |
| `findByIdAndUpdate` | `.update(fields).eq('id', id)` |
| `findByIdAndDelete` | `.delete().eq('id', id)` |
| `populate()` | `select('*, owner:profiles(name)')` (foreign-key joins) |
| Passport / JWT | **Supabase Auth** (email, magic link, Google, GitHub…) |
| Middleware auth checks | **Row Level Security (RLS)** policies in the DB |

## Step by step

### 1. Create the project
1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**. Save the database password somewhere safe.
2. Pick the region closest to your users (e.g. US East for Chicago).

### 2. Create a table
**SQL Editor → New query** → paste [`../starter/supabase/schema.sql`](../starter/supabase/schema.sql) → **Run**.

### 3. Get your keys — and know which is which
**Project Settings → API** (newer projects show *API Keys*):

| Key | Older name | Safe in the browser? | Respects RLS? |
|---|---|---|---|
| **Publishable** key | `anon` key | ✅ Yes | ✅ Yes |
| **Secret** key | `service_role` key | ❌ **NEVER** | ❌ Bypasses it |

### 4. Install and connect
```bash
npm install @supabase/supabase-js
```

**Server (Express) — secret key, full access:**
```js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});
```

**Browser (React) — publishable key, RLS protects you:**
```js
// client/src/supabase.js — Vite only exposes env vars that start with VITE_
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

### 5. CRUD cheat sheet
```js
// READ with filters
const { data, error } = await supabase
  .from('resources')
  .select('id, name, category')
  .eq('category', 'food')
  .ilike('name', '%pantry%')
  .order('name')
  .limit(20);

// CREATE
const { data: created } = await supabase.from('resources').insert({ name: 'X', category: 'food' }).select().single();

// UPDATE
await supabase.from('resources').update({ hours: 'Sat 9–1' }).eq('id', created.id);

// DELETE
await supabase.from('resources').delete().eq('id', created.id);

// ALWAYS check error
if (error) throw error;
```

### 6. Add login (Supabase Auth) in React
```js
// Magic-link sign in (no passwords to store!)
await supabase.auth.signInWithOtp({ email });

// Who's logged in?
const { data: { user } } = await supabase.auth.getUser();

// React to login/logout
supabase.auth.onAuthStateChange((event, session) => setUser(session?.user ?? null));

// Sign out
await supabase.auth.signOut();
```
Enable providers in **Authentication → Sign In / Providers**. Set your site URL in **Authentication → URL Configuration** (add your Codespaces/Vercel URL too).

### 7. Verify the user on YOUR Express server
```js
import 'dotenv/config';
import { supabase } from './supabase.js';

// Middleware: React sends  Authorization: Bearer <session.access_token>
export async function requireUser(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Invalid session' });

  req.user = { userId: data.user.id, email: data.user.email };
  next();
}

// In a route: ownerId comes from the VERIFIED token, never from req.body
// insert({ ...parsed.data, owner_id: req.user.userId })
```

### 8. Row Level Security in plain English
RLS = "rules the database enforces on every query from the browser."
```sql
alter table resources enable row level security;

-- anyone can read
create policy "read all" on resources for select using (true);

-- you can only edit rows you own
create policy "edit own" on resources for update to authenticated using (auth.uid() = owner_id);
```
If your browser query returns `[]` and you *know* there's data, it's almost always a missing RLS policy.

## Level-ups
- **Storage** — image uploads (`supabase.storage.from('photos').upload(...)`)
- **Realtime** — live updates when rows change (chat, dashboards)
- **pgvector** — store embeddings for real semantic search / RAG ([supabase.com/docs/guides/ai](https://supabase.com/docs/guides/ai))
- **Edge Functions** — server code without running Express
- **Supabase MCP** — let your AI agent inspect your schema ([guide](https://supabase.com/docs/guides/getting-started/mcp))
