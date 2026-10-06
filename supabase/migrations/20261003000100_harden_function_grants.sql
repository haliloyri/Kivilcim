-- Supabase grants EXECUTE on new public functions to anon/authenticated by
-- default, and `revoke ... from public` does not remove those explicit grants.
-- Signed-out callers (anon) must not reach the SECURITY DEFINER RPCs, and the
-- auth trigger function must not be callable as an RPC at all.
alter function public.handle_new_user() set search_path = public;
revoke all on function public.handle_new_user() from public, anon, authenticated;

revoke execute on function public.record_career_event(text, text, text, text, text, bigint, text, timestamptz, date, integer, integer, jsonb) from anon;
revoke execute on function public.upsert_career_state(text, integer, timestamptz, text) from anon;
revoke execute on function public.upsert_career_migration_state(integer, timestamptz) from anon;
revoke execute on function public.award_career_nodes(jsonb) from anon;
revoke execute on function public.mark_career_node_seen(text) from anon;
revoke execute on function public.upsert_legacy_badges(jsonb) from anon;
revoke execute on function public.claim_referral(uuid, bigint, text) from anon;
revoke execute on function public.get_user_stats() from anon;
