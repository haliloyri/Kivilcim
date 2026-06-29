-- ─────────────────────────────────────────────────────────────────────────────
-- Albor — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- One row per auth.users entry. Created automatically on sign-up via trigger.

create table if not exists public.profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  display_name  text,
  lang          text        not null default 'tr',
  is_premium    boolean     not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on new user sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name, lang)
  values (
    new.id,
    new.raw_user_meta_data->>'display_name',
    coalesce(new.raw_user_meta_data->>'lang', 'tr')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── Push tokens ─────────────────────────────────────────────────────────────
-- Stores Expo push tokens per device. `token` is unique (one row per device).

create table if not exists public.push_tokens (
  id          bigserial   primary key,
  token       text        not null unique,
  user_id     uuid        references auth.users(id) on delete set null,
  platform    text        check (platform in ('ios', 'android')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists push_tokens_user_id_idx on public.push_tokens(user_id);

-- RLS: users can manage their own tokens; Edge Functions use service role (bypasses RLS)
alter table public.push_tokens enable row level security;

create policy "Users can upsert their own push tokens"
  on public.push_tokens for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can delete their own push tokens"
  on public.push_tokens for delete
  using (auth.uid() = user_id);

create policy "Users can read their own push tokens"
  on public.push_tokens for select
  using (auth.uid() = user_id);

-- ─── Stories ─────────────────────────────────────────────────────────────────
-- Online story catalogue served from Supabase.

create table if not exists public.stories (
  id                  bigserial   primary key,
  title               text        not null,
  content             text        not null,
  summary             text,
  lang                text        not null default 'tr',
  category_id         int,
  read_time_seconds   int,
  is_active           boolean     not null default true,
  is_premium          boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists stories_lang_active_idx on public.stories(lang, is_active);

-- RLS: anyone can read active stories; only service role can write
alter table public.stories enable row level security;

create policy "Anyone can read active stories"
  on public.stories for select
  using (is_active = true);

-- ─── Done ────────────────────────────────────────────────────────────────────
-- After running this schema:
--   1. Copy your Supabase URL + anon key
--   2. Add them to app.json → expo.extra.supabase
--   3. Deploy the Edge Function: supabase functions deploy notify-new-story
