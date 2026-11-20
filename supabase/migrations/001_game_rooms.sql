-- Amrita Coffee House — cross-device game rooms (Phase 5)
-- Run this in the Supabase SQL editor, then enable Realtime for `game_rooms`.

create table if not exists public.game_rooms (
  code text primary key,
  game_id text not null,
  players jsonb not null default '[]'::jsonb,
  phase text not null default 'lobby'
    check (phase in ('lobby', 'playing', 'finished')),
  current_player_id text,
  game_state jsonb,
  result_message text,
  updated_at timestamptz not null default now()
);

create index if not exists game_rooms_updated_at_idx
  on public.game_rooms (updated_at desc);

alter table public.game_rooms enable row level security;

-- Cafe MVP: room code acts as the shared secret. Tighten later if needed.
drop policy if exists "Anyone can read game rooms" on public.game_rooms;
create policy "Anyone can read game rooms"
  on public.game_rooms for select
  using (true);

drop policy if exists "Anyone can create game rooms" on public.game_rooms;
create policy "Anyone can create game rooms"
  on public.game_rooms for insert
  with check (true);

drop policy if exists "Anyone can update game rooms" on public.game_rooms;
create policy "Anyone can update game rooms"
  on public.game_rooms for update
  using (true)
  with check (true);

drop policy if exists "Anyone can delete empty game rooms" on public.game_rooms;
create policy "Anyone can delete empty game rooms"
  on public.game_rooms for delete
  using (true);

-- Realtime: Dashboard → Database → Publications → supabase_realtime → add game_rooms
-- or run:
alter publication supabase_realtime add table public.game_rooms;
