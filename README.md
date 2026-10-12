# RODA — landing + lista de espera

Next.js (App Router) en Vercel, leads en Supabase, analítica en PostHog sin cookies. El brief completo está en `CLAUDE.md`.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar las variables
npm run dev
```

## Supabase

1. Crear un proyecto en supabase.com (región São Paulo, `sa-east-1`).
2. En **SQL Editor**, correr `supabase/migrations/0001_leads.sql` y después `0002_consentimiento.sql`. Crean la tabla `leads` con RLS activado y sin políticas, más las columnas de registro del consentimiento. Las dos se pueden volver a correr sin romper nada.
3. En **Project Settings → API** copiar la Project URL (`SUPABASE_URL`) y la `service_role` key o la secret key (`SUPABASE_SERVICE_ROLE_KEY`).

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | De dónde sale |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` / secret key. Solo servidor. |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → Project settings → Project API key (`phc_…`) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` o `https://eu.i.posthog.com`, según la región del proyecto |
| `NEXT_PUBLIC_SITE_URL` | Opcional. El dominio final, cuando exista. |

Sin las variables de PostHog la página funciona igual y no manda eventos.

## Links por local

`https://<dominio>/?ref=giant-delta` guarda `ref = giant-delta` en el lead. También se guardan las UTM (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`).

## Textos legales

`/privacidad` y `/terminos` usan los datos de `lib/legal.ts` (fecha, domicilio, jurisdicción, dominio). Mientras sigan entre corchetes, las páginas no se indexan; no publicar el dominio final hasta completarlos. Si cambia el texto del consentimiento, subir `CONSENTIMIENTO_VERSION`.
