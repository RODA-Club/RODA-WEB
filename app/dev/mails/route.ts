import type { Lead } from "@/lib/leads";
import { mailContent, mailText } from "@/lib/mail/content";
import { renderConfirmacion } from "@/lib/mail/send";

// Vista previa de los mails de confirmación, solo en desarrollo (`npm run dev`):
// /dev/mails?tipo=ciclista|lider|local  (agregar &formato=texto para el texto plano)

const base = {
  nombre: "Gonzalo Eujanian",
  email: "prueba@rodaclub.ar",
  whatsapp: null,
  consentimiento: true as const,
  utm_source: "instagram",
  utm_medium: "bio",
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  ref: null,
  referrer: null,
};

const EJEMPLOS: Record<string, Lead> = {
  ciclista: {
    ...base,
    tipo: "ciclista",
    zona: "Vicente López / San Isidro",
    tipo_bici: "Ruta (manubrio curvo, cubiertas finas)",
    ritmo: "Moderado (25–30 km/h)",
  },
  lider: {
    ...base,
    tipo: "lider",
    zona: "CABA Norte (Palermo, Belgrano, Núñez, Saavedra, Colegiales)",
    tipo_bici: "Ruta (manubrio curvo, cubiertas finas)",
    grupo_nombre: "Los del Vial",
    grupo_cantidad: "11 a 20",
    grupo_ritmo: "Intenso (más de 30 km/h)",
    grupo_instagram: "@losdelvial",
  },
  local: {
    ...base,
    tipo: "local",
    zona: "San Fernando / Tigre / Escobar",
    local_tipo: "Café, bar o restaurante",
    local_nombre: "Café de la Ruta",
    local_direccion: null,
  },
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") return new Response("Not found", { status: 404 });

  const params = new URL(request.url).searchParams;
  const lead = EJEMPLOS[params.get("tipo") ?? "ciclista"] ?? EJEMPLOS.ciclista;

  if (params.get("formato") === "texto") {
    return new Response(mailText(mailContent(lead)), { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  const { html } = await renderConfirmacion(lead);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
