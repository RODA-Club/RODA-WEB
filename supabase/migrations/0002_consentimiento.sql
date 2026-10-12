-- Registro del consentimiento: cuándo se aceptó y qué versión del texto.
-- Correr en Supabase > SQL Editor después de 0001_leads.sql.

alter table public.leads
  add column if not exists consentimiento_at timestamptz,
  add column if not exists consentimiento_version text;
