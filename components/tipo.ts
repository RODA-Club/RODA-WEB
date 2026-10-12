export type Tipo = "ciclista" | "lider" | "local";

// Los CTA de la página avisan al formulario qué pestaña abrir con este evento.
export const PICK_TIPO_EVENT = "roda:pick-tipo";

export function pickTipo(tipo: Tipo) {
  window.dispatchEvent(new CustomEvent<Tipo>(PICK_TIPO_EVENT, { detail: tipo }));
}
