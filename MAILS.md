# RODA — Mail de confirmación + cambio "Local" → "Negocio" (v2)

Chat Web, 2026-10-22. Reemplaza la v1. Diseño aprobado por Gonzalo en Claude Design (canvas "RODA Mails"). Los diseños están en `design/mails/`:
- `ciclista.dc.html` → mail para tipo `ciclista`
- `lider.dc.html` → mail para tipo `lider`
- `negocio.dc.html` → mail para tipo `local` (en la web ahora se llama "Negocio")

Los `.dc.html` son la **referencia visual y de copy exacta** (formato de componente del editor de diseño, no HTML de mail). El copy está aprobado: respetarlo palabra por palabra.

---

## Parte 1 — Cambios en la web: "Local" pasa a "Negocio"

Motivo: la tercera puerta también es para marcas y sponsors, no solo para cafés y bicicleterías.

1. Pestaña del formulario: "Local" → **"Negocio"**. Botón de envío: "Sumar mi local" → **"Sumar mi negocio"**. El botón de la sección de locales también: **"Sumar mi negocio"**.
2. Select "Tipo de local" → **"Tipo de negocio"**, opciones: **Café, bar o restaurante · Bicicletería · Marca o sponsor · Otro**.
3. Labels: "Nombre del local" → **"Nombre del negocio"**; "Zona del local" → **"Zona del negocio"**; "Dirección y localidad" pasa a **opcional** (una marca puede no tener local a la calle).
4. Mensaje de éxito para este tipo: "Te vamos a escribir para contarte cómo funciona ser aliado fundador."
5. La sección "Para cafés y bicicleterías" queda igual. Agregar al final de la tarjeta "Aliado fundador" una línea chica: **"¿Tenés una marca? También podés sumarte."** con link a #sumate que abre la pestaña Negocio.
6. **En la base no cambia nada**: el valor de `tipo` sigue siendo `local`. Solo cambian los textos visibles.

---

## Parte 2 — Mail de confirmación

### Envío
1. Después de guardar el lead en Supabase (`/api/leads`), mandar el mail con **Resend** (`resend` npm) usando **React Email** (`@react-email/components`) para armar el HTML. Variable de entorno: `RESEND_API_KEY`.
2. Remitente: `RODA <hola@rodaclub.ar>`. `reply_to`: `roda.club.app@gmail.com`.
3. Elegir la plantilla según `tipo`. Reemplazar los placeholders con los datos del formulario: `[NOMBRE]` (solo el primer nombre), `[ZONA]`, `[BICI]`, `[RITMO]`, `[NOMBRE DEL GRUPO]`, `[CANTIDAD]`, `[NOMBRE DEL NEGOCIO]`, `[TIPO]`. Escapar todo lo que venga del usuario.
4. **Si el mail falla, el registro no falla**: el lead ya está guardado; loguear el error y mostrar igual "Ya estás adentro.".
5. Mandar solo en altas nuevas, no cuando el mismo mail + tipo se vuelve a anotar (upsert).
6. Aviso interno: si el tipo es `lider` o `local`, mandar además un mail de texto simple a roda.club.app@gmail.com con todos los datos del alta (asunto: "Nuevo líder: [NOMBRE DEL GRUPO]" / "Nuevo negocio: [NOMBRE DEL NEGOCIO]").
7. Versión en texto plano de cada mail además del HTML.

### Valores cortos para el "pase" (las cajitas no entran textos largos)
- Bici: Ruta · Gravel · MTB · Urbana · Sin bici
- Ritmo: Chill · Moderado · Intenso · Varía · Por definir
- Tipo de negocio: Café/bar · Bicicletería · Marca · Otro
- Zona: usar una versión corta (ej. "Vicente López", "San Isidro", "Tigre", "CABA norte", "Zona oeste").

### Diseño (fiel a los .dc.html, adaptado a mail)
- Ancho 600 px, una sola columna, layout con tablas (React Email lo resuelve). Que se vea bien en Gmail (web y app), Apple Mail y Outlook.
- Colores: fondo `#141408`, cajas `#1E1E12` con borde `#33331F`, celdas del pase `#141408`, separadores `#2A2A1C`, texto `#FFFFFF` / `#EBEAE4`, secundario `#A8A898`, números apagados `#5A5A48`, franja y botón lima `#C6FE04` con texto `#141408`, texto chico sobre lima `#2A2A14`, pie `#0E0E05`.
- Fondo oscuro: agregar `<meta name="color-scheme" content="dark">` y `supported-color-schemes`, para que Gmail/Apple no inviertan los colores.
- Logo: PNG (no SVG, muchos clientes no lo muestran) exportado de `brand/roda-logo.svg` a 2x (alto visible 28 px), con `alt="RODA"`.
- Tipografía: los clientes de mail no cargan Archivo. Títulos (h1, "Tu lugar está guardado"/nombre en el pase, franja lima, "Qué sigue", números 01/02/03, firma) en `Archivo` con fallback `'Arial Black', Arial, sans-serif`, itálica, mayúsculas. Texto en `Inter` con fallback `Arial, sans-serif`. **Opcional, mejor resultado:** el h1 como imagen PNG con `alt` igual al texto.
- Ícono de sobre de la franja lima: PNG chico (no SVG inline).
- Botón "Seguir a @rodaclub.ar": botón con padding real (no solo link), radio 999 px, link a https://instagram.com/rodaclub.ar.
- Links del pie: Instagram y "Política de privacidad" → `https://rodaclub.ar/privacidad`.

### Asunto y preheader
| tipo | Asunto | Preheader |
|---|---|---|
| ciclista | Ya estás en la lista de RODA | Te avisamos por acá cuando abra la app. |
| lider | Tu grupo ya está anotado en RODA | Te vamos a escribir para sumarlo como grupo fundador. |
| local | Tu negocio ya está anotado en RODA | Te vamos a escribir para contarte cómo ser aliado fundador. |

### Copy final (igual que en los .dc.html)

**Ciclista** — etiqueta: LISTA DE ESPERA
- H1: YA ESTÁS EN **LA LISTA.** (lo último en lima)
- Hola [NOMBRE]:
- Gracias por sumarte. Estamos armando RODA para que encuentres grupos de tu ritmo y tu zona, y sepas cómo es cada salida antes de ir. Nadie queda atrás.
- Pase: "Tu lugar está guardado" · chip "Ciclista" · Zona / Bici / Ritmo
- Qué sigue: 01 Terminamos la app y sumamos los primeros grupos de la zona. · **02 Cuando RODA esté lista, te avisamos a este mail.** (destacado)
- Franja lima: ESTATE ATENTO A ESTE MAIL. / Para que el aviso no se te pierda, agregá hola@rodaclub.ar a tus contactos. Si este mail te llegó a Promociones o Spam, movelo a Principal.
- Mientras tanto, seguinos en Instagram: ahí contamos cómo va todo. [Seguir a @rodaclub.ar]
- Nos vemos en la ruta. / El equipo de RODA
- Pie: Recibís este mail porque te anotaste en rodaclub.ar. Si no fuiste vos o querés que borremos tus datos, respondé a este mail.

**Líder** — etiqueta: GRUPOS FUNDADORES
- H1: TU GRUPO YA ESTÁ **ANOTADO.**
- Hola [NOMBRE]:
- Gracias por sumar tu grupo. Los grupos son el corazón de RODA, y los primeros en anotarse entran como grupos fundadores: los cargamos antes de la apertura y aparecen primero cuando abra la app.
- Pase: [NOMBRE DEL GRUPO] · chip "Grupo fundador" · Zona / Salen / Ritmo
- Qué sigue: **01 Te vamos a escribir para conocer tu grupo.** (destacado) · 02 Cargamos tus salidas antes de la apertura. · 03 Cuando abra RODA, tu grupo aparece primero para los ciclistas de tu zona.
- Franja lima: ESTATE ATENTO AL MAIL Y AL WHATSAPP. / Te vamos a escribir por ahí. Agregá hola@rodaclub.ar a tus contactos y, si este mail te llegó a Promociones o Spam, movelo a Principal.
- ¿Tenés alguna pregunta? Respondé este mail y te contestamos. [Seguir a @rodaclub.ar]
- Nos vemos en la ruta. / El equipo de RODA
- Pie: Recibís este mail porque anotaste tu grupo en rodaclub.ar. Si no fuiste vos o querés que borremos tus datos, respondé a este mail.

**Negocio** (tipo `local`) — etiqueta: ALIADOS FUNDADORES
- H1: TU NEGOCIO YA ESTÁ **ANOTADO.**
- Hola [NOMBRE]:
- Gracias por sumar tu negocio. Los primeros en anotarse entran como aliados fundadores, sin costo durante todo el piloto.
- Pase: [NOMBRE DEL NEGOCIO] · chip "Aliado fundador" · Tipo / Zona / Piloto: Sin costo
- Qué sigue: **01 Te vamos a escribir para contarte cómo funciona.** (destacado) · 02 Vemos juntos cómo sumarte: en el mapa, como parada de las salidas o con acciones dentro de la app. · 03 Medimos los resultados con datos reales de la app, no con estimaciones.
- Franja lima: ESTATE ATENTO A ESTE MAIL. / Te vamos a escribir por acá. Agregá hola@rodaclub.ar a tus contactos y, si este mail te llegó a Promociones o Spam, movelo a Principal.
- ¿Querés hablar antes? Respondé este mail. [Seguir a @rodaclub.ar]
- Nos vemos en la ruta. / El equipo de RODA
- Pie: Recibís este mail porque anotaste tu negocio en rodaclub.ar. Si no fuiste vos o querés que borremos tus datos, respondé a este mail.

### Prueba
- Agregar una ruta de preview solo en desarrollo (`/dev/mails?tipo=ciclista|lider|local`) o usar `email dev` de React Email para ver los 3 mails sin mandarlos.
- Probar un envío real a la casilla de Gonzalo de cada tipo y revisar en Gmail web y Gmail app.
- Agregar al CLAUDE.md una sección "Mail de confirmación" que apunte a este archivo.
