-- Casilla opcional "Quiero recibir novedades de RODA" del formulario.
alter table public.leads
  add column if not exists acepta_novedades boolean not null default false,
  add column if not exists novedades_at timestamptz;
