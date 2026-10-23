import type { Lead } from "@/lib/leads";

// Altas de ejemplo para la vista previa de los mails y para generar sus imágenes.

const base = {
  nombre: "Gonzalo Eujanian",
  email: "prueba@rodaclub.ar",
  whatsapp: null,
  consentimiento: true as const,
  novedades: false,
  utm_source: "instagram",
  utm_medium: "bio",
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  ref: null,
  referrer: null,
};

export const EJEMPLOS: Record<string, Lead> = {
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
