-- push_tokens.user_id is `on delete set null`, so deleting auth.users left the
-- device's Expo push token on the server with no owner. Account deletion must
-- remove it too (App Store 5.1.1(v): delete the account and its data).
-- Apply with the Supabase CLI before shipping the app version that calls
-- deleteAccountOnServer().

create or replace function public.delete_my_account()
returns void
language plpgsql security definer set search_path = public, auth as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  delete from public.push_tokens where user_id = v_uid;
  delete from auth.users where id = v_uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
