-- Kıvılcım Yolu V1: user-owned, idempotent career data.
-- Apply with the Supabase CLI before enabling server-backed career sync.

create table if not exists public.user_career_events (
  event_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  credit_key text not null,
  credit_type text not null check (credit_type in ('H', 'D', 'U')),
  event_subtype text not null,
  story_id text not null,
  category_id bigint,
  completion_method text,
  occurred_at timestamptz not null,
  local_day date not null,
  timezone_offset_minutes integer not null,
  rule_version integer not null check (rule_version >= 1),
  metadata_json jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id),
  unique (user_id, credit_key)
);

create index if not exists user_career_events_user_occurred_idx
  on public.user_career_events (user_id, occurred_at, event_id);

create table if not exists public.user_career_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active_path text check (active_path in ('exploration', 'depth', 'transfer')),
  rule_version integer not null default 1 check (rule_version >= 1),
  selected_at timestamptz,
  selection_source text,
  intro_seen_at timestamptz,
  migration_version integer not null default 0,
  migration_summary_seen_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_career_nodes (
  user_id uuid not null references auth.users(id) on delete cascade,
  node_id text not null,
  path_id text not null,
  rule_version integer not null check (rule_version >= 1),
  earned_at timestamptz not null,
  seen_at timestamptz,
  award_source text not null,
  requirements_snapshot_json jsonb not null,
  primary key (user_id, node_id)
);

create table if not exists public.user_legacy_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz,
  primary key (user_id, badge_id)
);

alter table public.user_career_events enable row level security;
alter table public.user_career_state enable row level security;
alter table public.user_career_nodes enable row level security;
alter table public.user_legacy_badges enable row level security;

create policy "Users can read their own career events"
  on public.user_career_events for select using (auth.uid() = user_id);
create policy "Users can read their own career state"
  on public.user_career_state for select using (auth.uid() = user_id);
create policy "Users can read their own career nodes"
  on public.user_career_nodes for select using (auth.uid() = user_id);
create policy "Users can read their own legacy badges"
  on public.user_legacy_badges for select using (auth.uid() = user_id);
create policy "Users can delete their own career events"
  on public.user_career_events for delete using (auth.uid() = user_id);
create policy "Users can delete their own career state"
  on public.user_career_state for delete using (auth.uid() = user_id);
create policy "Users can delete their own career nodes"
  on public.user_career_nodes for delete using (auth.uid() = user_id);
create policy "Users can delete their own legacy badges"
  on public.user_legacy_badges for delete using (auth.uid() = user_id);

-- Event writes must use this RPC so a client cannot forge a different user id
-- or bypass the durable (user_id, credit_key) idempotency boundary.
create or replace function public.record_career_event(
  p_event_id text, p_credit_key text, p_credit_type text, p_event_subtype text,
  p_story_id text, p_category_id bigint, p_completion_method text,
  p_occurred_at timestamptz, p_local_day date, p_timezone_offset_minutes integer,
  p_rule_version integer, p_metadata_json jsonb default null
)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare v_rows integer;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_credit_type not in ('H', 'D', 'U') then raise exception 'invalid_credit_type'; end if;
  if p_event_subtype is null or length(trim(p_event_subtype)) = 0 then raise exception 'invalid_event_subtype'; end if;
  if (p_credit_type = 'H' and p_event_subtype not in ('story_completed', 'legacy_read'))
    or (p_credit_type = 'D' and p_event_subtype not in ('revisit_24h', 'takeaway_saved', 'insight_saved'))
    or (p_credit_type = 'U' and p_event_subtype not in ('conversation_mark_used', 'practice_completed', 'private_application_plan', 'legacy_mark_used')) then
    raise exception 'invalid_event_subtype';
  end if;
  if p_occurred_at > now() + interval '10 minutes' or p_local_day > current_date + 1 then
    raise exception 'invalid_event_time';
  end if;
  insert into public.user_career_events (
    event_id, user_id, credit_key, credit_type, event_subtype, story_id,
    category_id, completion_method, occurred_at, local_day,
    timezone_offset_minutes, rule_version, metadata_json
  ) values (
    p_event_id, auth.uid(), p_credit_key, p_credit_type, p_event_subtype, p_story_id,
    p_category_id, p_completion_method, p_occurred_at, p_local_day,
    p_timezone_offset_minutes, p_rule_version, p_metadata_json
  ) on conflict (user_id, credit_key) do nothing;
  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

revoke all on function public.record_career_event(text, text, text, text, text, bigint, text, timestamptz, date, integer, integer, jsonb) from public;
grant execute on function public.record_career_event(text, text, text, text, text, bigint, text, timestamptz, date, integer, integer, jsonb) to authenticated;

create or replace function public.upsert_career_state(
  p_active_path text default null, p_rule_version integer default 1,
  p_selected_at timestamptz default null, p_selection_source text default null
)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_active_path is not null and p_active_path not in ('exploration', 'depth', 'transfer') then
    raise exception 'invalid_active_path';
  end if;
  insert into public.user_career_state (user_id, active_path, rule_version, selected_at, selection_source)
  values (auth.uid(), p_active_path, p_rule_version, p_selected_at, p_selection_source)
  on conflict (user_id) do update set
    active_path = excluded.active_path,
    rule_version = excluded.rule_version,
    selected_at = excluded.selected_at,
    selection_source = excluded.selection_source,
    updated_at = now();
end;
$$;

-- Migration state is monotonic and intentionally separate from a path choice:
-- a replay of a legacy migration must never clear a newer active path.
create or replace function public.upsert_career_migration_state(
  p_migration_version integer default null,
  p_migration_summary_seen_at timestamptz default null
)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_migration_version is not null and p_migration_version < 0 then
    raise exception 'invalid_migration_version';
  end if;
  insert into public.user_career_state (user_id, migration_version, migration_summary_seen_at)
  values (auth.uid(), coalesce(p_migration_version, 0), p_migration_summary_seen_at)
  on conflict (user_id) do update set
    migration_version = greatest(public.user_career_state.migration_version, excluded.migration_version),
    migration_summary_seen_at = coalesce(public.user_career_state.migration_summary_seen_at, excluded.migration_summary_seen_at),
    updated_at = now();
end;
$$;

create or replace function public.award_career_nodes(p_nodes jsonb)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if jsonb_typeof(p_nodes) <> 'array' then raise exception 'invalid_nodes'; end if;
  insert into public.user_career_nodes (
    user_id, node_id, path_id, rule_version, earned_at, award_source, requirements_snapshot_json
  )
  select
    auth.uid(), item->>'nodeId', item->>'pathId', coalesce((item->>'ruleVersion')::integer, 1),
    coalesce((item->>'earnedAt')::timestamptz, now()), coalesce(item->>'awardSource', 'live_event'),
    coalesce(item->'requirementsSnapshot', '[]'::jsonb)
  from jsonb_array_elements(p_nodes) item
  where coalesce(item->>'nodeId', '') <> '' and coalesce(item->>'pathId', '') <> ''
  on conflict (user_id, node_id) do nothing;
end;
$$;

create or replace function public.mark_career_node_seen(p_node_id text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  update public.user_career_nodes
  set seen_at = coalesce(seen_at, now())
  where user_id = auth.uid() and node_id = p_node_id;
end;
$$;

create or replace function public.upsert_legacy_badges(p_badge_ids jsonb)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if jsonb_typeof(p_badge_ids) <> 'array' then raise exception 'invalid_badge_ids'; end if;
  insert into public.user_legacy_badges (user_id, badge_id, earned_at)
  select auth.uid(), value, now()
  from jsonb_array_elements_text(p_badge_ids) value
  where length(value) > 0
  on conflict (user_id, badge_id) do nothing;
end;
$$;

revoke all on function public.upsert_career_state(text, integer, timestamptz, text) from public;
revoke all on function public.upsert_career_migration_state(integer, timestamptz) from public;
revoke all on function public.award_career_nodes(jsonb) from public;
revoke all on function public.mark_career_node_seen(text) from public;
revoke all on function public.upsert_legacy_badges(jsonb) from public;
grant execute on function public.upsert_career_state(text, integer, timestamptz, text) to authenticated;
grant execute on function public.upsert_career_migration_state(integer, timestamptz) to authenticated;
grant execute on function public.award_career_nodes(jsonb) to authenticated;
grant execute on function public.mark_career_node_seen(text) to authenticated;
grant execute on function public.upsert_legacy_badges(jsonb) to authenticated;
