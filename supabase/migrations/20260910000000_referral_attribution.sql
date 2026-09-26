-- Share attribution + referral reward (Plan Bölüm 3.1).
-- Apply with the Supabase CLI before relying on claimReferral()/premium_bonus_until
-- client-side — until this runs, share.js still tags links with `s`/`st`/`l`
-- attribution params (harmless no-op server-side) but no reward is ever granted.

alter table public.profiles
  add column if not exists premium_bonus_until timestamptz;

-- One row per invited user: a device can only ever be credited as "invited"
-- once (the primary key enforces this), which is what stops a user from
-- replaying the same share link to farm repeat rewards for one referrer.
create table if not exists public.referrals (
  invited_id  uuid primary key references auth.users(id) on delete cascade,
  referrer_id uuid not null references auth.users(id) on delete cascade,
  story_id    bigint,
  lang        text,
  created_at  timestamptz not null default now()
);

create index if not exists referrals_referrer_idx on public.referrals(referrer_id);

alter table public.referrals enable row level security;

create policy "Users can read referrals they're part of"
  on public.referrals for select
  using (auth.uid() = invited_id or auth.uid() = referrer_id);

-- No insert/update/delete policies: only claim_referral() (security definer,
-- below) is allowed to write, so the reward can't be granted or resized by a
-- direct client-side insert/update.

create or replace function public.claim_referral(
  p_referrer_id uuid,
  p_story_id bigint default null,
  p_lang text default null
) returns table(claimed boolean, premium_bonus_until timestamptz)
language plpgsql security definer set search_path = public as $$
declare
  v_invited uuid := auth.uid();
  v_bonus timestamptz;
  v_rows integer;
begin
  if v_invited is null then raise exception 'not_authenticated'; end if;

  -- Can't refer yourself, and the referrer must be a real account.
  if p_referrer_id is null or p_referrer_id = v_invited
    or not exists (select 1 from public.profiles where id = p_referrer_id) then
    return query select false, null::timestamptz;
    return;
  end if;

  insert into public.referrals (invited_id, referrer_id, story_id, lang)
  values (v_invited, p_referrer_id, p_story_id, p_lang)
  on conflict (invited_id) do nothing;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    -- This device already claimed a referral before — no repeat reward.
    return query select false, null::timestamptz;
    return;
  end if;

  -- Grant/extend 7 days of Premium to both accounts. Extends from the later
  -- of "now" and any bonus already running, so a referrer collecting several
  -- referrals accumulates bonus time rather than resetting it.
  update public.profiles
  set premium_bonus_until = greatest(now(), coalesce(premium_bonus_until, now())) + interval '7 days',
      updated_at = now()
  where id = v_invited
  returning premium_bonus_until into v_bonus;

  update public.profiles
  set premium_bonus_until = greatest(now(), coalesce(premium_bonus_until, now())) + interval '7 days',
      updated_at = now()
  where id = p_referrer_id;

  return query select true, v_bonus;
end; $$;

revoke all on function public.claim_referral(uuid, bigint, text) from public;
grant execute on function public.claim_referral(uuid, bigint, text) to authenticated;
