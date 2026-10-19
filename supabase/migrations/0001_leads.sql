-- RODA: tabla única de leads de la landing (la que está corrida en Supabase).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  tipo text not null check (tipo in ('ciclista', 'lider', 'local')),
  nombre text not null,
  email text not null,
  whatsapp text,
  zona text not null,

  -- ciclista / líder
  tipo_bici text,
  ritmo text,

  -- líder
  grupo_nombre text,
  grupo_cantidad text,
  grupo_ritmo text,
  grupo_instagram text,

  -- local
  local_tipo text,
  local_nombre text,
  local_direccion text,

  -- consentimiento
  consentimiento boolean not null check (consentimiento = true),
  consentimiento_at timestamptz not null default now(),
  consentimiento_version text not null default 'v1-2026-10',

  -- origen
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  ref text,
  referrer text
);

-- un mismo mail no se duplica dentro del mismo tipo
create unique index if not exists leads_email_tipo_key
  on public.leads (lower(email), tipo);

-- RLS activado y sin políticas: nadie lee ni escribe desde el navegador
alter table public.leads enable row level security;
