-- ─────────────────────────────────────────────────────────────
-- Paste this into Supabase → SQL Editor → New query → Run
-- Creates the "resources" table the starter app expects.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.resources (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,          -- unique so the seed script can upsert
  category     text not null check (category in
                 ('food','housing','health','jobs','youth','seniors','legal','education','tech','arts')),
  neighborhood text default '',
  description  text default '',
  hours        text default '',
  website      text default '',
  tags         text[] default '{}',
  owner_id     uuid references auth.users (id), -- filled in once you add login (optional)
  created_at   timestamptz not null default now()
);

-- ── Row Level Security (RLS) ────────────────────────────────
-- RLS is OFF by default on new tables created with SQL. Turn it ON.
-- With RLS on and no policies, NOBODY using the public (anon/publishable) key can read or write.
alter table public.resources enable row level security;

-- Anyone (even logged-out visitors) can READ resources
drop policy if exists "Public can read resources" on public.resources;
create policy "Public can read resources"
  on public.resources for select
  using (true);

-- Logged-in users can add resources they own (only matters if the BROWSER talks to Supabase directly)
drop policy if exists "Users can insert their own resources" on public.resources;
create policy "Users can insert their own resources"
  on public.resources for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Owners can update / delete only their own rows
drop policy if exists "Owners can update their resources" on public.resources;
create policy "Owners can update their resources"
  on public.resources for update
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "Owners can delete their resources" on public.resources;
create policy "Owners can delete their resources"
  on public.resources for delete
  to authenticated
  using (auth.uid() = owner_id);

-- NOTE: The Express server uses the SERVICE ROLE / SECRET key, which bypasses RLS.
-- That's why the server must validate everything (zod) before writing.

-- Helpful index for category filtering
create index if not exists resources_category_idx on public.resources (category);
