# RODA — Web (landing + lista de espera)

Brief para Claude Code. Fuente: chat "Web" del proyecto RODA (2026-10-12). Hablale a Gonzalo en español rioplatense (vos), directo.

## Qué es RODA
App mobile (iOS/Android, en desarrollo) que conecta ciclistas de Buenos Aires con grupos compatibles según nivel, ritmo, tipo de bici y zona, y registra cada salida con GPS. Fundador: Gonzalo Eujanian. Tagline: "Encontrá tu grupo. Salí a rodar." Promesa: nadie queda atrás. La app abre como piloto en marzo 2027.

## Qué tiene que hacer esta web
Una landing de una sola página, mobile-first, cuyo objetivo es juntar leads antes de que exista la app:
- Es el link de la bio de Instagram (@rodaclub.ar) y se comparte en bicicleterías y cafés (por link o QR).
- Tres tipos de alta en un mismo formulario: **ciclista** (lista de espera), **líder** (alguien que organiza un grupo, el usuario más importante) y **local** (café, bicicletería o marca).
- Cada registro se guarda en una base de datos con su tipo y con el canal del que vino (UTM y `ref`).

Prioridades: que cargue rápido en el celular, que el formulario no falle nunca, y medir de dónde viene cada lead.

## Diseño
- **Referencia visual exacta: `design/Main.dc.html`**. Es el diseño aprobado, en un formato de componente propio del editor: tomalo como referencia de layout, copy, colores, tamaños y comportamiento, no como código para copiar tal cual. El copy está aprobado: respetalo palabra por palabra.
- Secciones, en orden: nav sticky (logo, Líderes, Locales, botón Sumate) → hero con tarjeta de salida que rota cada 4,5 s (4 ejemplos, fundido de 280 ms, puntos para elegir; si el usuario toca un punto se frena la rotación; sin rotación si `prefers-reduced-motion`) → Cómo funciona (3 pasos) → Para quienes organizan un grupo → Para cafés y bicicleterías (fondo lima) → Por qué RODA → Formulario (#sumate) → Preguntas (details/summary) → Footer.
- Los botones "Anotate en la lista", "Organizo un grupo", "Sumá tu grupo" y "Sumar mi local" bajan a #sumate y abren la pestaña correspondiente.

### Marca
- Colores: lima `#C6FE04`, negro oliva `#141408` (fondo principal), `#EBEAE4`, `#F8FEBA`, `#FFFFFF`. Superficies oscuras del diseño: `#1E1E12`, bordes `#33331F` / `#3A3A26`, texto secundario `#A8A898` / `#C8C8B8`. Naranja de compatibilidad "1 nivel arriba": `#FF9F43`.
- **Nunca texto lima sobre fondo claro** (contraste 1,2:1).
- Tipografías (Google Fonts, OFL, cargar con `next/font/google`):
  - Archivo Black Italic → en la práctica `Archivo` itálica peso 900: títulos y logo. Mayúsculas.
  - Archivo SemiBold Italic → `Archivo` itálica 600: etiquetas en mayúscula con tracking 0.14–0.16em.
  - Inter 400/500/600: todo el texto, botones y formularios. Cifras tabulares (`font-variant-numeric: tabular-nums`) en km/h, km y cupos.
- Logo: `brand/roda-logo.svg` (versión para fondo oscuro). Favicon e ícono: `brand/roda-perfil-instagram.svg` (la rueda sola).
- Sin emojis. Íconos de línea (stroke 2).

## Stack
- Next.js (App Router, TypeScript) en Vercel.
- Supabase (Postgres) para los leads.
- PostHog para analítica, en modo sin cookies (`persistence: 'memory'`), para no necesitar banner.
- Sin librerías de UI pesadas. CSS Modules o Tailwind, lo que sea más simple de mantener.

## Base de datos (Supabase)
Una sola tabla `leads`:

| columna | tipo | notas |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| created_at | timestamptz default now() | |
| tipo | text not null check in ('ciclista','lider','local') | |
| nombre | text not null | |
| email | text not null | |
| whatsapp | text | opcional |
| zona | text not null | valor del select |
| tipo_bici | text | ciclista y líder |
| ritmo | text | ciclista |
| grupo_nombre | text | líder |
| grupo_cantidad | text | líder |
| grupo_ritmo | text | líder |
| grupo_instagram | text | líder |
| local_tipo | text | local |
| local_nombre | text | local |
| local_direccion | text | local |
| consentimiento | boolean not null | debe ser true |
| utm_source, utm_medium, utm_campaign, utm_content, utm_term | text | de la URL de entrada |
| ref | text | parámetro `?ref=` (ej. `?ref=giant-delta` para el QR de cada local) |
| referrer | text | document.referrer |

- RLS activado y **sin políticas para anon**: nadie lee ni escribe desde el navegador.
- El insert se hace desde un route handler o server action de Next.js con la service role key (solo en variables de entorno del servidor).
- Índice por `email` + `tipo`. Si el mismo mail se anota dos veces con el mismo tipo, actualizar el registro en vez de duplicarlo.

## Formulario
- Campos por pestaña, labels y opciones de los selects: exactamente como en `design/Main.dc.html`.
- Validación en el servidor con zod (mail válido, campos requeridos según tipo, consentimiento = true).
- Anti-spam: campo honeypot oculto, y rechazar envíos que lleguen en menos de 2 segundos desde que cargó la página.
- Las UTM y el `ref` se leen al entrar a la página y se guardan en sessionStorage (con try/catch), así no se pierden si la persona navega dentro de la página.
- Estados: enviando (botón deshabilitado), éxito (el bloque "Ya estás adentro." del diseño, con texto según tipo), error (mensaje claro y el formulario sigue completo).

## Analítica (PostHog)
Eventos: `page_view`, `tab_change` {tipo}, `form_start` {tipo} (primer campo tocado), `form_submit` {tipo, zona, utm_source, ref}, `form_error`. Que se pueda ver conversión por tipo y por `ref`.

## SEO y básicos
- `lang="es-AR"`, title "RODA — Encontrá tu grupo. Salí a rodar.", meta description con la bajada del hero.
- Open Graph y Twitter card. Imagen OG 1200×630: placeholder hasta que Gonzalo la apruebe.
- sitemap.xml, robots.txt, favicon y apple-touch-icon desde la rueda.
- Lighthouse mobile ≥ 90 en Performance, Accessibility y SEO.
- Accesibilidad: labels reales, foco visible, botones de 44 px mínimo, contraste AA.

## Páginas legales
- `/privacidad` y `/terminos` como páginas simples con texto placeholder `[TEXTO LEGAL PENDIENTE]`. El texto definitivo se redacta aparte (Ley 25.326 de datos personales). **No publicar el dominio final sin ese texto.**

## Variables de entorno
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`. Nunca commitearlas; Gonzalo las carga en Vercel.

## Dominio
Pendiente. Preferido: rodaclub.com.ar (a confirmar en nic.ar); alternativa: rodaclub.app. Mientras tanto, usar la URL de Vercel.

## Orden de trabajo sugerido
1. Proyecto Next.js + página estática fiel al diseño, con datos falsos en el formulario. Deploy en Vercel para revisarla en el celular.
2. Tabla en Supabase + endpoint de alta + estados del formulario.
3. UTM/ref, PostHog, SEO, legales placeholder.
4. Prueba completa: anotarse con los tres tipos desde el celular, con `?utm_source=instagram` y `?ref=prueba`, y verificar que aparezca en Supabase.

Fuera de alcance por ahora: login, páginas separadas por público, mapa de grupos, mails automáticos (posible siguiente paso: aviso por mail a roda.club.app@gmail.com cuando se anota un líder o un local).
