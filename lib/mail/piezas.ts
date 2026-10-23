import { IG_BUTTON, mailContent } from "./content";
import { EJEMPLOS } from "./ejemplos";
import tamanos from "./piezas.json";

// Partes del mail que van como imagen PNG: todo lo que es lima o va sobre
// lima. La app de Gmail en iPhone invierte los colores en modo oscuro y esos
// colores no se pueden recuperar con CSS; las imágenes no las toca.
//
// Si cambia el copy de estas partes, regenerar con:
//   npm run dev   (en otra terminal)
//   node scripts/mail-imagenes.mjs
// Eso actualiza public/mail/*.png y lib/mail/piezas.json.

const TIPOS = ["ciclista", "lider", "local"] as const;

type Pieza = { id: string; alt: string; html: string };

const TITULO = "font-family:Archivo;font-style:italic;text-transform:uppercase;";
const ETIQUETA = `${TITULO}font-weight:600;letter-spacing:0.16em;`;

function piezasDe(tipo: (typeof TIPOS)[number]): Pieza[] {
  const c = mailContent(EJEMPLOS[tipo]);
  const ultima = c.h1.length - 1;
  return [
    {
      id: `h1-${tipo}`,
      alt: c.h1.join(" "),
      html: `<div style="display:inline-block;white-space:nowrap;${TITULO}font-weight:900;font-size:54px;line-height:0.98;letter-spacing:-0.01em;color:#FFFFFF">${c.h1
        .map((l, i) => (i === ultima ? `<span style="color:#C6FE04">${l}</span>` : l))
        .join("<br>")}</div>`,
    },
    {
      id: `chip-${tipo}`,
      alt: c.pase.chip,
      html: `<div style="display:inline-block;background:#C6FE04;color:#141408;font-family:Inter;font-size:12px;font-weight:600;padding:6px 12px;border-radius:999px;white-space:nowrap">${c.pase.chip}</div>`,
    },
    // La franja tiene texto largo: una versión de 520 px y otra de 295 px para
    // celular (Gmail muestra el mail al ancho de la pantalla).
    ...[
      { id: `franja-${tipo}`, ancho: 520 },
      { id: `franja-${tipo}-m`, ancho: 295 },
    ].map(({ id, ancho }) => ({
      id,
      alt: `${c.franja.titulo} ${c.franja.texto}`,
      html: `<div style="width:${ancho}px;display:flex;gap:${ancho > 300 ? 20 : 14}px;align-items:flex-start;color:#141408">
        <svg width="${ancho > 300 ? 40 : 32}" height="${ancho > 300 ? 40 : 32}" viewBox="0 0 24 24" fill="none" stroke="#141408" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
        <div style="display:flex;flex-direction:column;gap:10px">
          <span style="${TITULO}font-weight:900;font-size:${ancho > 300 ? 26 : 22}px;line-height:1.02">${c.franja.titulo}</span>
          <span style="font-family:Inter;font-size:15px;line-height:1.55;color:#2A2A14">${c.franja.texto}</span>
        </div></div>`,
    })),
  ];
}

export const PIEZAS: Pieza[] = [
  ...TIPOS.flatMap(piezasDe),
  {
    id: "boton-ig",
    alt: IG_BUTTON,
    html: `<div style="display:inline-block;background:#C6FE04;color:#141408;font-family:Inter;font-weight:600;font-size:16px;line-height:1.2;padding:15px 26px;border-radius:999px;white-space:nowrap">${IG_BUTTON}</div>`,
  },
  {
    id: "que-sigue",
    alt: "Qué sigue",
    html: `<div style="display:inline-block;${ETIQUETA}font-size:13px;color:#C6FE04">Qué sigue</div>`,
  },
  ...["01", "02", "03"].map((n) => ({
    id: `num-${n}`,
    alt: n,
    html: `<div style="display:inline-block;${TITULO}font-weight:900;font-size:26px;line-height:1;color:#C6FE04;padding-right:2px">${n}</div>`,
  })),
  {
    id: "pie-tagline",
    alt: "Encontrá tu grupo. Salí a rodar.",
    html: `<div style="display:inline-block;${ETIQUETA}letter-spacing:0.14em;font-size:12px;color:#EBEAE4">Encontrá tu grupo. <span style="color:#C6FE04">Salí a rodar.</span></div>`,
  },
  {
    id: "pie-instagram",
    alt: "Instagram",
    html: `<div style="display:inline-block;font-family:Inter;font-size:12px;line-height:1.6;color:#C6FE04">Instagram</div>`,
  },
];

// Tamaño en px (1x) de cada imagen; los PNG están a 2x.
export function pieza(id: string): { width: number; height: number } {
  const t = (tamanos as Record<string, { width: number; height: number }>)[id];
  if (!t) throw new Error(`Falta la imagen del mail "${id}": correr node scripts/mail-imagenes.mjs`);
  return t;
}
