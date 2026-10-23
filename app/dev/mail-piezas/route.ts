import { PIEZAS } from "@/lib/mail/piezas";

// Página con las partes del mail que van como imagen, para que
// scripts/mail-imagenes.mjs las capture. Solo en desarrollo.

export async function GET() {
  if (process.env.NODE_ENV !== "development") return new Response("Not found", { status: 404 });

  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@1,600;1,900&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>body{margin:0;padding:20px;background:transparent}[data-pieza]{display:inline-block;margin:0 0 20px}</style>
</head><body>${PIEZAS.map((p) => `<div><div data-pieza="${p.id}">${p.html}</div></div>`).join("")}</body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
