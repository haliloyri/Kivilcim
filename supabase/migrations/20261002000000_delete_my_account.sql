-- In-app account deletion (App Store Guideline 5.1.1(v)).
-- Deletes the caller's auth.users row; every per-user table references it with
-- `on delete cascade`, so profile, reads, favorites, career data, badges and
-- referrals go with it. Apply with the Supabase CLI before shipping the app
-- version that calls deleteAccountOnServer().

create or replace function public.delete_my_account()
returns void
language plpgsql security definer set search_path = public, auth as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = v_uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
