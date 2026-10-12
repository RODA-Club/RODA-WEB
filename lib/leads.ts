import { z } from "zod";
import { CONSENTIMIENTO_VERSION } from "./legal";
import { BICIS, CANTIDADES, LOCAL_TIPOS, RITMOS_CICLISTA, RITMOS_GRUPO, ZONAS } from "./opciones";

// Texto requerido / opcional. Los opcionales vacíos se guardan como null.
const req = (max: number) => z.string().trim().min(1).max(max);
const opt = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => v || null);

const base = {
  nombre: req(120),
  email: z.string().trim().toLowerCase().max(200).pipe(z.email()),
  whatsapp: opt(40),
  zona: z.enum(ZONAS),
  consentimiento: z.literal(true),

  utm_source: opt(200),
  utm_medium: opt(200),
  utm_campaign: opt(200),
  utm_content: opt(200),
  utm_term: opt(200),
  ref: opt(100),
  referrer: opt(500),
};

export const leadSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("ciclista"),
    ...base,
    tipo_bici: z.enum(BICIS),
    ritmo: z.enum(RITMOS_CICLISTA),
  }),
  z.object({
    tipo: z.literal("lider"),
    ...base,
    tipo_bici: z.enum(BICIS),
    grupo_nombre: req(120),
    grupo_cantidad: z.enum(CANTIDADES),
    grupo_ritmo: z
      .union([z.enum(RITMOS_GRUPO), z.literal("")])
      .nullish()
      .transform((v) => v || null),
    grupo_instagram: opt(80),
  }),
  z.object({
    tipo: z.literal("local"),
    ...base,
    local_tipo: z.enum(LOCAL_TIPOS),
    local_nombre: req(120),
    local_direccion: opt(200),
  }),
]);

export type Lead = z.infer<typeof leadSchema>;

// Fila completa para la tabla `leads`. Las columnas que no aplican al tipo van
// en null explícito, así un re-registro (mismo mail y tipo) pisa todo.
export function toRow(lead: Lead) {
  return {
    tipo: lead.tipo,
    nombre: lead.nombre,
    email: lead.email,
    whatsapp: lead.whatsapp,
    zona: lead.zona,
    consentimiento: lead.consentimiento,
    consentimiento_at: new Date().toISOString(),
    consentimiento_version: CONSENTIMIENTO_VERSION,
    tipo_bici: lead.tipo !== "local" ? lead.tipo_bici : null,
    ritmo: lead.tipo === "ciclista" ? lead.ritmo : null,
    grupo_nombre: lead.tipo === "lider" ? lead.grupo_nombre : null,
    grupo_cantidad: lead.tipo === "lider" ? lead.grupo_cantidad : null,
    grupo_ritmo: lead.tipo === "lider" ? lead.grupo_ritmo : null,
    grupo_instagram: lead.tipo === "lider" ? lead.grupo_instagram : null,
    local_tipo: lead.tipo === "local" ? lead.local_tipo : null,
    local_nombre: lead.tipo === "local" ? lead.local_nombre : null,
    local_direccion: lead.tipo === "local" ? lead.local_direccion : null,
    utm_source: lead.utm_source,
    utm_medium: lead.utm_medium,
    utm_campaign: lead.utm_campaign,
    utm_content: lead.utm_content,
    utm_term: lead.utm_term,
    ref: lead.ref,
    referrer: lead.referrer,
    updated_at: new Date().toISOString(),
  };
}
