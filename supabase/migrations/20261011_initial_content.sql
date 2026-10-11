-- Proud Partners content and media. Run this file in Supabase Dashboard → SQL Editor.
-- It exposes public read access only; writes are limited to accounts listed in site_admins.

create table if not exists public.site_content (
  id text primary key check (id = 'primary'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.site_admins enable row level security;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.site_admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

drop policy if exists "Public can read website content" on public.site_content;
create policy "Public can read website content"
on public.site_content for select to anon, authenticated using (true);

drop policy if exists "Admins can manage website content" on public.site_content;
create policy "Admins can manage website content"
on public.site_content for all to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 12582912, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
on storage.objects for update to authenticated
using (bucket_id = 'site-media' and public.is_site_admin())
with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
on storage.objects for delete to authenticated
using (bucket_id = 'site-media' and public.is_site_admin());

-- After creating an editor account in Authentication → Users, run this once,
-- replacing the email address with that editor's address:
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = 'you@example.com'
-- on conflict do nothing;
