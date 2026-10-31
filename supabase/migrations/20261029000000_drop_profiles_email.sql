-- Free-text profile email is no longer collected by the app (KVKK/GDPR: do not
-- keep unused personal data). Auth's own auth.users.email is untouched.
alter table public.profiles drop column if exists email;
