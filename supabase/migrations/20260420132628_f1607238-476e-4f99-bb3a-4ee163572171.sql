
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Playlists
create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.playlists enable row level security;
create policy "Users can view own playlists" on public.playlists for select using (auth.uid() = user_id);
create policy "Users can insert own playlists" on public.playlists for insert with check (auth.uid() = user_id);
create policy "Users can update own playlists" on public.playlists for update using (auth.uid() = user_id);
create policy "Users can delete own playlists" on public.playlists for delete using (auth.uid() = user_id);

-- Playlist tracks (track_id is a string ref to seed data)
create table public.playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  track_id text not null,
  position int not null default 0,
  added_at timestamptz not null default now()
);
alter table public.playlist_tracks enable row level security;
create policy "View tracks of own playlists" on public.playlist_tracks for select
  using (exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid()));
create policy "Insert tracks into own playlists" on public.playlist_tracks for insert
  with check (exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid()));
create policy "Delete tracks from own playlists" on public.playlist_tracks for delete
  using (exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid()));

-- Liked tracks
create table public.liked_tracks (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  liked_at timestamptz not null default now(),
  primary key (user_id, track_id)
);
alter table public.liked_tracks enable row level security;
create policy "View own likes" on public.liked_tracks for select using (auth.uid() = user_id);
create policy "Insert own likes" on public.liked_tracks for insert with check (auth.uid() = user_id);
create policy "Delete own likes" on public.liked_tracks for delete using (auth.uid() = user_id);

-- Followed artists
create table public.followed_artists (
  user_id uuid not null references auth.users(id) on delete cascade,
  artist_id text not null,
  followed_at timestamptz not null default now(),
  primary key (user_id, artist_id)
);
alter table public.followed_artists enable row level security;
create policy "View own follows" on public.followed_artists for select using (auth.uid() = user_id);
create policy "Insert own follows" on public.followed_artists for insert with check (auth.uid() = user_id);
create policy "Delete own follows" on public.followed_artists for delete using (auth.uid() = user_id);

-- Listening history
create table public.listening_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  played_at timestamptz not null default now()
);
alter table public.listening_history enable row level security;
create policy "View own history" on public.listening_history for select using (auth.uid() = user_id);
create policy "Insert own history" on public.listening_history for insert with check (auth.uid() = user_id);
create index listening_history_user_played_idx on public.listening_history(user_id, played_at desc);

-- updated_at trigger fn
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger playlists_set_updated_at before update on public.playlists
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
