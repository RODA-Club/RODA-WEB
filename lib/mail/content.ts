import type { Lead } from "@/lib/leads";
import { ZONA_GRUPOS } from "@/lib/opciones";

// Copy de los mails de confirmación (MAILS.md, aprobado palabra por palabra).
// Una plantilla por tipo; el layout está en emails/Confirmacion.tsx y la
// versión en texto plano sale de este mismo contenido.

export type MailContent = {
  subject: string;
  preheader: string;
  eyebrow: string;
  // Líneas del título; la última va en lima.
  h1: string[];
  saludo: string;
  intro: string;
  pase: { titulo: string; chip: string; celdas: { label: string; value: string }[] };
  pasos: { texto: string; destacado?: boolean }[];
  franja: { titulo: string; texto: string };
  cta: string;
  pie: string;
};

// --- Valores cortos para el pase (las cajitas no entran textos largos) ---

const BICI_CORTA: Record<string, string> = {
  "Ruta (manubrio curvo, cubiertas finas)": "Ruta",
  "Gravel (ruta y tierra)": "Gravel",
  "MTB / mountain bike": "MTB",
  "Urbana, híbrida o de paseo": "Urbana",
  "Todavía no tengo": "Sin bici",
};

const NEGOCIO_CORTO: Record<string, string> = {
  "Café, bar o restaurante": "Café/bar",
  Bicicletería: "Bicicletería",
  "Marca o sponsor": "Marca",
  Otro: "Otro",
};

export function biciCorta(bici: string | null | undefined): string {
  return (bici && BICI_CORTA[bici]) || "Por definir";
}

export function ritmoCorto(ritmo: string | null | undefined): string {
  for (const r of ["Chill", "Moderado", "Intenso", "Varía"]) if (ritmo?.startsWith(r)) return r;
  return "Por definir";
}

export function negocioCorto(tipo: string | null | undefined): string {
  return (tipo && NEGOCIO_CORTO[tipo]) || "Otro";
}

export function zonaCorta(zona: string): string {
  if (zona.startsWith("CABA ")) return "CABA " + zona.split(" ")[1].toLowerCase();
  if (zona.startsWith("La Plata")) return "La Plata";
  const grupo = ZONA_GRUPOS.find((g) => (g.zonas as readonly string[]).includes(zona));
  if (grupo && grupo.label !== "Otra") return grupo.label;
  return zona;
}

export function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] || nombre;
}

// --- Plantillas ---

export const IG_URL = "https://instagram.com/rodaclub.ar";
export const IG_BUTTON = "Seguir a @rodaclub.ar";
export const PRIVACIDAD_URL = "https://rodaclub.ar/privacidad";

export function mailContent(lead: Lead): MailContent {
  const saludo = `Hola ${primerNombre(lead.nombre)}:`;
  const zona = zonaCorta(lead.zona);

  if (lead.tipo === "ciclista") {
    return {
      subject: "Ya estás en la lista de RODA",
      preheader: "Te avisamos por acá cuando abra la app.",
      eyebrow: "Lista de espera",
      h1: ["Ya estás en", "la lista."],
      saludo,
      intro:
        "Gracias por sumarte. Estamos armando RODA para que encuentres grupos de tu ritmo y tu zona, y sepas cómo es cada salida antes de ir. Nadie queda atrás.",
      pase: {
        titulo: "Tu lugar está guardado",
        chip: "Ciclista",
        celdas: [
          { label: "Zona", value: zona },
          { label: "Bici", value: biciCorta(lead.tipo_bici) },
          { label: "Ritmo", value: ritmoCorto(lead.ritmo) },
        ],
      },
      pasos: [
        { texto: "Terminamos la app y sumamos los primeros grupos de la zona." },
        { texto: "Cuando RODA esté lista, te avisamos a este mail.", destacado: true },
      ],
      franja: {
        titulo: "Estate atento a este mail.",
        texto:
          "Para que el aviso no se te pierda, agregá hola@rodaclub.ar a tus contactos. Si este mail te llegó a Promociones o Spam, movelo a Principal.",
      },
      cta: "Mientras tanto, seguinos en Instagram: ahí contamos cómo va todo.",
      pie: "Recibís este mail porque te anotaste en rodaclub.ar. Si no fuiste vos o querés que borremos tus datos, respondé a este mail.",
    };
  }

  if (lead.tipo === "lider") {
    return {
      subject: "Tu grupo ya está anotado en RODA",
      preheader: "Te vamos a escribir para sumarlo como grupo fundador.",
      eyebrow: "Grupos fundadores",
      h1: ["Tu grupo", "ya está", "anotado."],
      saludo,
      intro:
        "Gracias por sumar tu grupo. Los grupos son el corazón de RODA, y los primeros en anotarse entran como grupos fundadores: los cargamos antes de la apertura y aparecen primero cuando abra la app.",
      pase: {
        titulo: lead.grupo_nombre,
        chip: "Grupo fundador",
        celdas: [
          { label: "Zona", value: zona },
          { label: "Salen", value: lead.grupo_cantidad },
          { label: "Ritmo", value: ritmoCorto(lead.grupo_ritmo) },
        ],
      },
      pasos: [
        { texto: "Te vamos a escribir para conocer tu grupo.", destacado: true },
        { texto: "Cargamos tus salidas antes de la apertura." },
        { texto: "Cuando abra RODA, tu grupo aparece primero para los ciclistas de tu zona." },
      ],
      franja: {
        titulo: "Estate atento al mail y al WhatsApp.",
        texto:
          "Te vamos a escribir por ahí. Agregá hola@rodaclub.ar a tus contactos y, si este mail te llegó a Promociones o Spam, movelo a Principal.",
      },
      cta: "¿Tenés alguna pregunta? Respondé este mail y te contestamos.",
      pie: "Recibís este mail porque anotaste tu grupo en rodaclub.ar. Si no fuiste vos o querés que borremos tus datos, respondé a este mail.",
    };
  }

  return {
    subject: "Tu negocio ya está anotado en RODA",
    preheader: "Te vamos a escribir para contarte cómo ser aliado fundador.",
    eyebrow: "Aliados fundadores",
    h1: ["Tu negocio", "ya está", "anotado."],
    saludo,
    intro:
      "Gracias por sumar tu negocio. Los primeros en anotarse entran como aliados fundadores, sin costo durante todo el piloto.",
    pase: {
      titulo: lead.local_nombre,
      chip: "Aliado fundador",
      celdas: [
        { label: "Tipo", value: negocioCorto(lead.local_tipo) },
        { label: "Zona", value: zona },
        { label: "Piloto", value: "Sin costo" },
      ],
    },
    pasos: [
      { texto: "Te vamos a escribir para contarte cómo funciona.", destacado: true },
      {
        texto:
          "Vemos juntos cómo sumarte: en el mapa, como parada de las salidas o con acciones dentro de la app.",
      },
      { texto: "Medimos los resultados con datos reales de la app, no con estimaciones." },
    ],
    franja: {
      titulo: "Estate atento a este mail.",
      texto:
        "Te vamos a escribir por acá. Agregá hola@rodaclub.ar a tus contactos y, si este mail te llegó a Promociones o Spam, movelo a Principal.",
    },
    cta: "¿Querés hablar antes? Respondé este mail.",
    pie: "Recibís este mail porque anotaste tu negocio en rodaclub.ar. Si no fuiste vos o querés que borremos tus datos, respondé a este mail.",
  };
}

// Versión en texto plano del mismo contenido.
export function mailText(c: MailContent): string {
  const pasos = c.pasos.map((p, i) => `${String(i + 1).padStart(2, "0")}  ${p.texto}`).join("\n");
  const celdas = c.pase.celdas.map((x) => `${x.label}: ${x.value}`).join("\n");
  return [
    c.h1.join(" ").toUpperCase(),
    "",
    c.saludo,
    "",
    c.intro,
    "",
    `${c.pase.titulo.toUpperCase()} (${c.pase.chip})`,
    celdas,
    "",
    "QUÉ SIGUE",
    pasos,
    "",
    c.franja.titulo.toUpperCase(),
    c.franja.texto,
    "",
    c.cta,
    `${IG_BUTTON}: ${IG_URL}`,
    "",
    "Nos vemos en la ruta.",
    "El equipo de RODA",
    "",
    "--",
    c.pie,
    `Instagram: ${IG_URL}`,
    `Política de privacidad: ${PRIVACIDAD_URL}`,
  ].join("\n");
}
