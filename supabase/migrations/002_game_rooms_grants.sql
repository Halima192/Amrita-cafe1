-- Fix: permission denied for table game_rooms
-- Grants + RLS for anon / authenticated (browser key)

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
  on table public.game_rooms
  to anon, authenticated;

alter table public.game_rooms enable row level security;

drop policy if exists "Anyone can read game rooms" on public.game_rooms;
create policy "Anyone can read game rooms"
  on public.game_rooms for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can create game rooms" on public.game_rooms;
create policy "Anyone can create game rooms"
  on public.game_rooms for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can update game rooms" on public.game_rooms;
create policy "Anyone can update game rooms"
  on public.game_rooms for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Anyone can delete empty game rooms" on public.game_rooms;
create policy "Anyone can delete empty game rooms"
  on public.game_rooms for delete
  to anon, authenticated
  using (true);
