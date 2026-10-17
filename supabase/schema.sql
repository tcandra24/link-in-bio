-- =====================================================================
-- Plot: skema database lengkap untuk proyek Supabase BARU
-- Jalankan sekali di SQL Editor. Bagian fungsi, policy, dan trigger aman diulang.
-- =====================================================================

-- ---------- Tabel ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name text check (display_name is null or char_length(display_name) between 1 and 40),
  bio text check (bio is null or char_length(bio) <= 160),
  avatar_url text check (avatar_url is null or avatar_url ~* '^https?://'),
  theme text not null default 'kertas' check (theme in ('kertas', 'malam', 'permen')),
  corner_radius int not null default 24 check (corner_radius between 8 and 32),
  shadow_depth int not null default 4 check (shadow_depth in (2, 4, 6)),
  created_at timestamptz not null default now()
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 60),
  subtitle text check (subtitle is null or char_length(subtitle) <= 100),
  url text not null check (url ~* '^https?://'),
  size text not null default '1x1' check (size in ('1x1', '2x1', '2x2')),
  color text not null default 'sun'
    check (color in ('tomato', 'sun', 'mint', 'lilac', 'sky', 'cream', 'ink')),
  badge text check (badge is null or char_length(badge) <= 20),
  icon text,
  image_url text,
  position int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists links_profile_idx on public.links (profile_id, position);

create table if not exists public.link_clicks (
  id bigint generated always as identity primary key,
  link_id uuid not null references public.links (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text -- belum dipakai
);
create index if not exists link_clicks_link_time_idx on public.link_clicks (link_id, clicked_at desc);

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.link_clicks enable row level security;

drop policy if exists "profiles_select_public" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "links_select" on public.links;
drop policy if exists "links_insert_own" on public.links;
drop policy if exists "links_update_own" on public.links;
drop policy if exists "links_delete_own" on public.links;
drop policy if exists "clicks_select_own" on public.link_clicks;

-- Profil dibaca publik; dibuat oleh trigger (di bawah), jadi tidak ada policy insert
create policy "profiles_select_public" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Link aktif dibaca publik; pemilik melihat dan mengelola semua miliknya
create policy "links_select" on public.links
  for select using (is_active or (select auth.uid()) = profile_id);
create policy "links_insert_own" on public.links
  for insert to authenticated with check ((select auth.uid()) = profile_id);
create policy "links_update_own" on public.links
  for update to authenticated
  using ((select auth.uid()) = profile_id) with check ((select auth.uid()) = profile_id);
create policy "links_delete_own" on public.links
  for delete to authenticated using ((select auth.uid()) = profile_id);

-- Klik: tidak ada policy tulis (dicatat lewat record_click); pemilik boleh membaca
create policy "clicks_select_own" on public.link_clicks
  for select to authenticated
  using (
    exists (
      select 1 from public.links l
      where l.id = link_clicks.link_id and l.profile_id = (select auth.uid())
    )
  );

-- ---------- Profil otomatis saat daftar ----------
-- Username dikirim lewat metadata signUp: options.data.username
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'username'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Pencatat klik dan statistik ----------
create or replace function public.record_click(p_link_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url text;
begin
  select url into v_url from public.links where id = p_link_id and is_active;
  if v_url is null then
    return null;
  end if;
  insert into public.link_clicks (link_id) values (p_link_id);
  return v_url;
end;
$$;

create or replace function public.click_totals()
returns table (link_id uuid, total bigint, last_7d bigint)
language sql
stable
set search_path = ''
as $$
  select c.link_id,
         count(*),
         count(*) filter (where c.clicked_at >= now() - interval '7 days')
  from public.link_clicks c
  group by c.link_id;
$$;

create or replace function public.click_daily(p_days int default 7, p_tz text default 'Asia/Jakarta')
returns table (day date, clicks bigint)
language sql
stable
set search_path = ''
as $$
  select d::date, count(c.id)
  from generate_series(
         ((now() at time zone p_tz)::date - (least(greatest(p_days, 1), 90) - 1))::timestamp,
         (now() at time zone p_tz)::date::timestamp,
         interval '1 day'
       ) as d
  left join public.link_clicks c
    on (c.clicked_at at time zone p_tz)::date = d::date
  group by d
  order by d;
$$;

revoke all on function public.record_click(uuid) from public, anon, authenticated;
grant execute on function public.record_click(uuid) to anon, authenticated;
revoke all on function public.click_totals() from public, anon;
revoke all on function public.click_daily(int, text) from public, anon;
grant execute on function public.click_totals() to authenticated;
grant execute on function public.click_daily(int, text) to authenticated;

-- ---------- Storage: foto profil ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars_select_own" on storage.objects;
drop policy if exists "avatars_insert_own" on storage.objects;
drop policy if exists "avatars_update_own" on storage.objects;
drop policy if exists "avatars_delete_own" on storage.objects;

create policy "avatars_select_own" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatars_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatars_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatars_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
  