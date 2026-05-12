-- =============================================================================
-- Sprout — Supabase schema (tables, RLS, signup trigger)
-- Paste this entire file into Supabase → SQL Editor → Run.
-- Safe to re-run: uses CREATE IF NOT EXISTS / OR REPLACE where possible.
-- =============================================================================

-- ───── extensions ──────────────────────────────────────────────────────────
-- pgcrypto gives us gen_random_uuid() if you ever want random UUIDs
create extension if not exists pgcrypto;

-- ===========================================================================
-- profiles  (one row per auth.users user — financial snapshot + preferences)
-- ===========================================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  income       numeric(12, 2) default 0,
  debt         numeric(12, 2) default 0,
  savings      numeric(12, 2) default 0,
  risk         text default 'Moderate'
                 check (risk in ('Conservative', 'Moderate', 'Aggressive')),
  splits       jsonb default '{"needs":50,"wants":30,"save":20}'::jsonb,
  plant_name   text default 'Sproutie',
  mood         smallint,  -- 0=GOOD, 1=MEH, 2=BAD, null=not set
  onboarded    boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- bump updated_at on every UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- plants  (each investment = one plant in the garden)
-- ===========================================================================
create table if not exists public.plants (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  label       text,                              -- e.g. ticker symbol "VTI"
  type        text default 'sprout'
                check (type in ('seed', 'sprout', 'bud', 'bloom', 'tree')),
  value       numeric(12, 2) not null default 0, -- dollars invested
  weeks       integer default 0,
  tint        text,                              -- color/palette name for variety
  created_at  timestamptz default now()
);

create index if not exists plants_user_id_idx on public.plants (user_id, created_at desc);

-- ===========================================================================
-- transactions  (scanned receipts + manual entries — single source of truth)
-- ===========================================================================
create table if not exists public.transactions (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  price         numeric(12, 2) not null,         -- positive number; income vs expense via category=IN
  category      text not null
                  check (category in ('NEEDS', 'WANTS', 'SAVE', 'IN')),
  source        text default 'manual'
                  check (source in ('scanned', 'manual', 'import')),
  merchant      text,
  occurred_on   date default current_date,
  created_at    timestamptz default now()
);

create index if not exists transactions_user_id_idx
  on public.transactions (user_id, occurred_on desc, created_at desc);
create index if not exists transactions_category_idx
  on public.transactions (user_id, category);

-- ===========================================================================
-- Auto-create a profile row whenever a new auth.users row is created
-- ===========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- A user can only see/touch rows that belong to them (user_id = auth.uid()).
-- =============================================================================

-- ── profiles ───────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists "profiles: own row read"   on public.profiles;
drop policy if exists "profiles: own row write"  on public.profiles;
drop policy if exists "profiles: own row insert" on public.profiles;

create policy "profiles: own row read"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: own row insert"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles: own row write"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ── plants ─────────────────────────────────────────────────────────────────
alter table public.plants enable row level security;

drop policy if exists "plants: own rows read"   on public.plants;
drop policy if exists "plants: own rows insert" on public.plants;
drop policy if exists "plants: own rows update" on public.plants;
drop policy if exists "plants: own rows delete" on public.plants;

create policy "plants: own rows read"
  on public.plants for select
  using (user_id = auth.uid());

create policy "plants: own rows insert"
  on public.plants for insert
  with check (user_id = auth.uid());

create policy "plants: own rows update"
  on public.plants for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "plants: own rows delete"
  on public.plants for delete
  using (user_id = auth.uid());

-- ── transactions ───────────────────────────────────────────────────────────
alter table public.transactions enable row level security;

drop policy if exists "txns: own rows read"   on public.transactions;
drop policy if exists "txns: own rows insert" on public.transactions;
drop policy if exists "txns: own rows update" on public.transactions;
drop policy if exists "txns: own rows delete" on public.transactions;

create policy "txns: own rows read"
  on public.transactions for select
  using (user_id = auth.uid());

create policy "txns: own rows insert"
  on public.transactions for insert
  with check (user_id = auth.uid());

create policy "txns: own rows update"
  on public.transactions for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "txns: own rows delete"
  on public.transactions for delete
  using (user_id = auth.uid());
