-- RODA: tabla única de leads de la landing.
-- Correr una vez en Supabase > SQL Editor.

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  tipo             text not null check (tipo in ('ciclista', 'lider', 'local')),
  nombre           text not null,
  email            text not null,
  whatsapp         text,
  zona             text not null,
  tipo_bici        text,
  ritmo            text,
  grupo_nombre     text,
  grupo_cantidad   text,
  grupo_ritmo      text,
  grupo_instagram  text,
  local_tipo       text,
  local_nombre     text,
  local_direccion  text,
  consentimiento   boolean not null check (consentimiento = true),
  consentimiento_at      timestamptz,
  consentimiento_version text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_content      text,
  utm_term         text,
  ref              text,
  referrer         text,
  -- Mismo mail + mismo tipo = se actualiza el registro en vez de duplicarlo.
  -- El mail se guarda siempre en minúsculas desde el servidor.
  constraint leads_email_tipo_key unique (email, tipo)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_ref_idx on public.leads (ref);

-- RLS activado y sin políticas: desde el navegador (anon) nadie lee ni escribe.
-- Solo el servidor de Next.js, con la service role / secret key, inserta.
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
