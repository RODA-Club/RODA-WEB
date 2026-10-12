// Opciones de los selects del formulario. Las usan el formulario y la
// validación del servidor, así nunca se desincronizan.

export const ZONAS = [
  "Vicente López / Olivos / Florida",
  "San Isidro / Martínez",
  "San Fernando / Tigre / Nordelta",
  "Otro partido de zona norte",
  "CABA norte (Palermo, Belgrano, Núñez, Costanera)",
  "CABA, otra zona",
  "Zona oeste",
  "Zona sur",
  "La Plata",
  "Otra",
] as const;

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

export const LOCAL_TIPOS = ["Café", "Bicicletería", "Marca", "Otro"] as const;
