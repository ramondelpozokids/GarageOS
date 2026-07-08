-- GarageOS — Migración de esquema Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- La base actual solo tiene columnas mínimas; la app necesita el esquema completo.

-- OWNERS: añadir columnas faltantes
alter table public.owners add column if not exists portal text;
alter table public.owners add column if not exists vivienda text;
alter table public.owners add column if not exists obs text;

-- SPOTS: añadir columnas faltantes (modelo desnormalizado usado por la UI)
alter table public.spots add column if not exists portal text;
alter table public.spots add column if not exists type text default 'car';
alter table public.spots add column if not exists "ownerName" text;
alter table public.spots add column if not exists "ownerPhone" text;
alter table public.spots add column if not exists "ownerEmail" text;
alter table public.spots add column if not exists brand text;
alter table public.spots add column if not exists model text;
alter table public.spots add column if not exists plate text;
alter table public.spots add column if not exists color text;
alter table public.spots add column if not exists created_at timestamptz default now();

-- RLS: habilitar acceso anon para CRUD (ajustar en producción con auth real)
alter table public.owners enable row level security;
alter table public.spots enable row level security;

drop policy if exists "owners_select_anon" on public.owners;
drop policy if exists "owners_insert_anon" on public.owners;
drop policy if exists "owners_update_anon" on public.owners;
drop policy if exists "owners_delete_anon" on public.owners;
drop policy if exists "spots_select_anon" on public.spots;
drop policy if exists "spots_insert_anon" on public.spots;
drop policy if exists "spots_update_anon" on public.spots;
drop policy if exists "spots_delete_anon" on public.spots;

create policy "owners_select_anon" on public.owners for select to anon using (true);
create policy "owners_insert_anon" on public.owners for insert to anon with check (true);
create policy "owners_update_anon" on public.owners for update to anon using (true) with check (true);
create policy "owners_delete_anon" on public.owners for delete to anon using (true);

create policy "spots_select_anon" on public.spots for select to anon using (true);
create policy "spots_insert_anon" on public.spots for insert to anon with check (true);
create policy "spots_update_anon" on public.spots for update to anon using (true) with check (true);
create policy "spots_delete_anon" on public.spots for delete to anon using (true);

-- Recargar caché de PostgREST tras cambios de esquema
notify pgrst, 'reload schema';
