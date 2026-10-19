// Opciones de los selects del formulario. Las usan el formulario y la
// validación del servidor, así nunca se desincronizan.

// Zonas agrupadas en el select (optgroup). Cada opción es el valor que se
// guarda en `leads.zona`, así que tiene que entenderse sola.
export const ZONA_GRUPOS = [
  {
    label: "Ciudad de Buenos Aires",
    zonas: [
      "CABA Norte (Palermo, Belgrano, Núñez, Saavedra, Colegiales)",
      "CABA Centro (Recoleta, Retiro, Puerto Madero, San Telmo)",
      "CABA Oeste (Caballito, Flores, Villa Urquiza, Devoto, Liniers)",
      "CABA Sur (La Boca, Barracas, Parque Patricios, Pompeya, Lugano)",
    ],
  },
  {
    label: "Zona norte",
    zonas: [
      "Vicente López / San Isidro",
      "San Fernando / Tigre / Escobar",
      "San Martín / Tres de Febrero",
      "San Miguel / Malvinas Argentinas / José C. Paz",
      "Pilar",
    ],
  },
  {
    label: "Zona oeste",
    zonas: ["Morón / Hurlingham / Ituzaingó", "La Matanza", "Merlo / Moreno / General Rodríguez"],
  },
  {
    label: "Zona sur",
    zonas: [
      "Avellaneda / Lanús",
      "Lomas de Zamora / Esteban Echeverría / Ezeiza",
      "Quilmes / Berazategui / Florencio Varela",
      "Almirante Brown / Presidente Perón / San Vicente",
      "La Plata / Berisso / Ensenada",
    ],
  },
  {
    label: "Otra",
    zonas: ["Fuera del AMBA"],
  },
] as const;

export const ZONAS = ZONA_GRUPOS.flatMap((g) => g.zonas) as [string, ...string[]];

const RITMOS = ["Chill (menos de 25 km/h)", "Moderado (25–30 km/h)", "Intenso (más de 30 km/h)"] as const;

export const RITMOS_CICLISTA = [...RITMOS, "No sé todavía"] as const;

export const RITMOS_GRUPO = [...RITMOS, "Varía"] as const;

export const BICIS = [
  "Ruta (manubrio curvo, cubiertas finas)",
  "Gravel (ruta y tierra)",
  "MTB / mountain bike",
  "Urbana, híbrida o de paseo",
  "Todavía no tengo",
] as const;

export const CANTIDADES = ["Menos de 5", "5 a 10", "11 a 20", "21 a 40", "Más de 40"] as const;

export const LOCAL_TIPOS = ["Café", "Bicicletería", "Sponsor (hidratación, nutrición, indumentaria)", "Otro"] as const;
