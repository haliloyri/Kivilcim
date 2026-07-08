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
  email         text,
  lang          text        not null default 'tr',
  is_premium    boolean     not null default false,
  device_id     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- email: free-text profile field the user types in the Edit Profile modal
-- (ProfileScreen). Not linked to Supabase Auth's own auth.users.email /
-- linkEmailToDeviceAccount() — this is just "what the user typed for their
-- profile", mirrored the same way display_name already was. Added separately
-- for existing DBs, same pattern as device_id above.
alter table public.profiles add column if not exists email text;

-- device_id: stable per-install id stamped by ensureDeviceSession() so a
-- profile can be matched back to its device. Added separately for existing DBs.
alter table public.profiles add column if not exists device_id text;
create index if not exists profiles_device_id_idx on public.profiles(device_id);

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

-- SECURITY: found via ToServerTasks.md §10 end-to-end testing — the policy
-- above has no explicit WITH CHECK, so (per Postgres RLS rules) it defaults
-- to the same USING expression, which only constrains auth.uid() = id and
-- says nothing about *which columns* change. That means any client could
-- previously do `update profiles set is_premium = true where id = auth.uid()`
-- directly via the REST API and grant themselves Premium, completely
-- bypassing the RevenueCat webhook (supabase/functions/revenuecat-webhook)
-- that's supposed to be the sole source of truth. Confirmed exploitable,
-- then fixed with this trigger, which silently reverts any client-driven
-- change to is_premium — only a genuine service_role write (the webhook)
-- can move it.
create or replace function public.protect_is_premium()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_premium is distinct from old.is_premium and auth.role() <> 'service_role' then
    new.is_premium := old.is_premium;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_is_premium_trigger on public.profiles;
create trigger protect_is_premium_trigger
  before update on public.profiles
  for each row execute function public.protect_is_premium();

-- Trigger functions don't need EXECUTE granted to any role to fire (they run
-- as the trigger, not via RPC) — revoke it so this isn't callable directly
-- via /rest/v1/rpc/protect_is_premium.
revoke all on function public.protect_is_premium() from public;
revoke all on function public.protect_is_premium() from anon;
revoke all on function public.protect_is_premium() from authenticated;

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

-- ─── Profile extensions (local → server migration) ────────────────────────────
-- onboarded/preferences/streak_freeze_credits/share_count used to live only in
-- AsyncStorage. See ToServerTasks.md §2.

alter table public.profiles
  add column if not exists onboarded boolean not null default false,
  add column if not exists preferences jsonb not null default '{}'::jsonb,
  add column if not exists streak_freeze_credits int not null default 0,
  add column if not exists share_count int not null default 0;

-- ─── User reads ──────────────────────────────────────────────────────────────
-- One row per (user, story): last read date. Mirrors SQLite's
-- `INSERT OR REPLACE` semantics in db.js#recordRead, since streak/today's-count
-- are derived from distinct read_at days, not a full read log.

create table if not exists public.user_reads (
  user_id    uuid not null references auth.users(id) on delete cascade,
  story_id   bigint not null,
  read_at    date not null default current_date,
  primary key (user_id, story_id)
);

create index if not exists user_reads_user_date_idx on public.user_reads(user_id, read_at);

alter table public.user_reads enable row level security;

create policy "Users can read their own reads"
  on public.user_reads for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own reads"
  on public.user_reads for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reads"
  on public.user_reads for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reads"
  on public.user_reads for delete
  using (auth.uid() = user_id);

-- ─── User likes ──────────────────────────────────────────────────────────────

create table if not exists public.user_likes (
  user_id    uuid not null references auth.users(id) on delete cascade,
  story_id   bigint not null,
  liked      boolean not null default true,
  liked_at   timestamptz not null default now(),
  primary key (user_id, story_id)
);

alter table public.user_likes enable row level security;

create policy "Users can read their own likes"
  on public.user_likes for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own likes"
  on public.user_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own likes"
  on public.user_likes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.user_likes for delete
  using (auth.uid() = user_id);

-- ─── User selected categories ────────────────────────────────────────────────
-- category_id matches the bundled SQLite `categories.id` — there is no
-- server-side categories table yet (content is still asset-bundled), so no FK.

create table if not exists public.user_selected_categories (
  user_id      uuid not null references auth.users(id) on delete cascade,
  category_id  int not null,
  primary key (user_id, category_id)
);

alter table public.user_selected_categories enable row level security;

create policy "Users can read their own selected categories"
  on public.user_selected_categories for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own selected categories"
  on public.user_selected_categories for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own selected categories"
  on public.user_selected_categories for delete
  using (auth.uid() = user_id);

-- ─── User streak freezes ─────────────────────────────────────────────────────

create table if not exists public.user_streak_freezes (
  user_id      uuid not null references auth.users(id) on delete cascade,
  freeze_date  date not null,
  used_at      timestamptz not null default now(),
  primary key (user_id, freeze_date)
);

alter table public.user_streak_freezes enable row level security;

create policy "Users can read their own streak freezes"
  on public.user_streak_freezes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own streak freezes"
  on public.user_streak_freezes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own streak freezes"
  on public.user_streak_freezes for delete
  using (auth.uid() = user_id);

-- ─── User favorites ──────────────────────────────────────────────────────────

create table if not exists public.user_favorites (
  user_id     uuid not null references auth.users(id) on delete cascade,
  story_id    bigint not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, story_id)
);

alter table public.user_favorites enable row level security;

create policy "Users can read their own favorites"
  on public.user_favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.user_favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.user_favorites for delete
  using (auth.uid() = user_id);

-- ─── User favorite collections ───────────────────────────────────────────────
-- Generalizes beyond "saved_for_later" — collection_id is a free-form key.

create table if not exists public.user_collections (
  user_id        uuid not null references auth.users(id) on delete cascade,
  collection_id  text not null default 'saved_for_later',
  story_id       bigint not null,
  created_at     timestamptz not null default now(),
  primary key (user_id, collection_id, story_id)
);

alter table public.user_collections enable row level security;

create policy "Users can read their own collections"
  on public.user_collections for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own collections"
  on public.user_collections for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from their own collections"
  on public.user_collections for delete
  using (auth.uid() = user_id);

-- ─── User variant usage ──────────────────────────────────────────────────────
-- "Sohbette kullan" copy/share/mark-used log. Server-side so quota abuse can
-- be checked independent of the client.

create table if not exists public.user_variant_usage (
  id               bigserial   primary key,
  user_id          uuid        not null references auth.users(id) on delete cascade,
  story_id         bigint,
  story_title      text,
  story_category   text,
  variant_type     text,
  variant_id       text,
  variant_key      text,
  action           text check (action in ('copy', 'share', 'mark_used')),
  feedback_rating  int,
  used_at          timestamptz not null default now()
);

create index if not exists user_variant_usage_user_idx on public.user_variant_usage(user_id, used_at desc);

alter table public.user_variant_usage enable row level security;

create policy "Users can read their own variant usage"
  on public.user_variant_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert their own variant usage"
  on public.user_variant_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own variant usage"
  on public.user_variant_usage for delete
  using (auth.uid() = user_id);

-- ─── Variant usage quota enforcement (server-side RPC) ──────────────────────
-- ToServerTasks.md item 7: "Varyant kullanım kotasını server'da denet
-- (kötüye kullanım/jailbreak'e karşı)". Previously user_variant_usage allowed
-- any authenticated client to INSERT freely (RLS only checked user_id =
-- auth.uid()), so a modified/jailbroken client could bypass the client-side
-- AsyncStorage quota and claim unlimited free "mark_used" actions. This makes
-- the SECURITY DEFINER RPC below the only write path, and it enforces the
-- daily free-tier quota in the database itself.

create or replace function public.record_variant_usage(
  p_story_id        bigint,
  p_story_title     text,
  p_story_category  text,
  p_variant_type    text,
  p_variant_id      text,
  p_variant_key     text,
  p_action          text,
  p_feedback_rating int default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id    uuid := auth.uid();
  v_is_premium boolean;
  v_used_count int;
  v_new_id     bigint;
  -- Free (non-premium) tier: max "mark_used" actions per rolling 24h.
  -- Rationale: this is a "read a few stories a day" habit app; "Sohbette
  -- kullan" is a bonus/sharing action layered on top of normal reading, not
  -- the core loop, so a small daily allowance (enough to try the feature and
  -- use it for a couple of favorite stories) while still pushing frequent
  -- users toward premium feels right. Tune by changing this one constant.
  c_free_daily_mark_used_limit constant int := 3;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if p_action = 'mark_used' then
    select coalesce(is_premium, false) into v_is_premium
    from public.profiles
    where id = v_user_id;

    if not coalesce(v_is_premium, false) then
      select count(*) into v_used_count
      from public.user_variant_usage
      where user_id = v_user_id
        and action = 'mark_used'
        and used_at > now() - interval '24 hours';

      if v_used_count >= c_free_daily_mark_used_limit then
        raise exception 'quota_exceeded';
      end if;
    end if;
  end if;

  insert into public.user_variant_usage (
    user_id, story_id, story_title, story_category,
    variant_type, variant_id, variant_key, action, feedback_rating
  ) values (
    v_user_id, p_story_id, p_story_title, p_story_category,
    p_variant_type, p_variant_id, p_variant_key, p_action, p_feedback_rating
  )
  returning id into v_new_id;

  return v_new_id;
end;
$$;

-- Lock down direct table writes: clients must go through the RPC above
-- (which runs as SECURITY DEFINER and bypasses RLS for its own insert).
-- SELECT and DELETE policies on user_variant_usage are left untouched so
-- users can still read/delete their own usage history.
drop policy if exists "Users can insert their own variant usage" on public.user_variant_usage;

-- Only authenticated sessions may call the RPC (this app's device-token flow
-- always has an authenticated, possibly-anonymous, session by the time
-- variant usage is recorded). Explicitly do NOT grant to anon.
revoke all on function public.record_variant_usage(bigint, text, text, text, text, text, text, int) from public;
revoke all on function public.record_variant_usage(bigint, text, text, text, text, text, text, int) from anon;
grant execute on function public.record_variant_usage(bigint, text, text, text, text, text, text, int) to authenticated;

-- ─── User badges (seen state) ────────────────────────────────────────────────

create table if not exists public.user_badges (
  user_id   uuid not null references auth.users(id) on delete cascade,
  badge_id  text not null,
  seen_at   timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.user_badges enable row level security;

create policy "Users can read their own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "Users can insert their own badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);

-- ─── Stats RPC (streak / totals / per-category / per-story) ─────────────────
-- ToServerTasks.md item: "Streak/istatistik için Postgres RPC ya da view yaz
-- (get_streak, get_stats, get_reads_per_category)". Single round trip that
-- mirrors db.js's getTotalReads/getTodayReadsCount/getStreak/getLongestStreak/
-- getReadsPerCategory/getReadCountsByStory exactly (including the streak
-- freeze "protected days" logic), so the server becomes the one source of
-- truth instead of client-side SQLite arithmetic.
--
-- SECURITY INVOKER (the default) is intentional here, unlike
-- record_variant_usage: this function only reads rows the caller's own RLS
-- policies already let them see (user_reads/user_streak_freezes filtered to
-- auth.uid(), stories filtered to is_active = true), so there's no need to
-- escalate privilege and no risk of leaking another user's stats.

create or replace function public.get_user_stats()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id               uuid := auth.uid();
  v_total_reads           int;
  v_today_reads           int;
  v_days_desc             date[];
  v_days_asc              date[];
  v_streak                int := 0;
  v_longest               int := 0;
  v_current               int := 1;
  v_reads_per_category    jsonb;
  v_read_counts_by_story  jsonb;
  i                       int;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  select count(*) into v_total_reads
  from public.user_reads
  where user_id = v_user_id;

  select count(*) into v_today_reads
  from public.user_reads
  where user_id = v_user_id and read_at = current_date;

  -- Distinct read days ∪ streak-freeze "protected" days, most recent first —
  -- same union db.js#getStreak/getLongestStreak build client-side.
  select array_agg(day order by day desc) into v_days_desc
  from (
    select read_at as day from public.user_reads where user_id = v_user_id
    union
    select freeze_date as day from public.user_streak_freezes where user_id = v_user_id
  ) d;

  if v_days_desc is not null and array_length(v_days_desc, 1) > 0 then
    -- Streak only counts if the most recent protected/read day is today or
    -- yesterday (matches db.js: `if (firstDay < yesterday) return 0;`).
    if v_days_desc[1] >= current_date - 1 then
      v_streak := 1;
      for i in 2 .. array_length(v_days_desc, 1) loop
        if v_days_desc[i - 1] - v_days_desc[i] = 1 then
          v_streak := v_streak + 1;
        else
          exit;
        end if;
      end loop;
    end if;

    select array_agg(day order by day asc) into v_days_asc
    from unnest(v_days_desc) as day;

    v_longest := 1;
    v_current := 1;
    for i in 2 .. array_length(v_days_asc, 1) loop
      if v_days_asc[i] - v_days_asc[i - 1] = 1 then
        v_current := v_current + 1;
        if v_current > v_longest then
          v_longest := v_current;
        end if;
      else
        v_current := 1;
      end if;
    end loop;
  end if;

  -- Keyed by category_name to match db.js#getReadsPerCategory's
  -- map[categoryName] = count shape (checkBadges() consumes that shape).
  select coalesce(jsonb_object_agg(cat, cnt), '{}'::jsonb) into v_reads_per_category
  from (
    select coalesce(s.category_name, 'Tümü') as cat, count(*) as cnt
    from public.user_reads ur
    join public.stories s on s.id = ur.story_id
    where ur.user_id = v_user_id
    group by coalesce(s.category_name, 'Tümü')
  ) t;

  select coalesce(jsonb_object_agg(story_id::text, cnt), '{}'::jsonb) into v_read_counts_by_story
  from (
    select story_id, count(*) as cnt
    from public.user_reads
    where user_id = v_user_id
    group by story_id
  ) t;

  return jsonb_build_object(
    'total_reads',          v_total_reads,
    'today_reads',          v_today_reads,
    'streak',                v_streak,
    'longest_streak',        v_longest,
    'reads_per_category',    v_reads_per_category,
    'read_counts_by_story',  v_read_counts_by_story
  );
end;
$$;

revoke all on function public.get_user_stats() from public;
grant execute on function public.get_user_stats() to authenticated;

-- ─── Done ────────────────────────────────────────────────────────────────────
-- After running this schema:
--   1. Copy your Supabase URL + anon key
--   2. Add them to app.json → expo.extra.supabase
--   3. Deploy the Edge Function: supabase functions deploy notify-new-story
