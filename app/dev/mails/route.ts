import { mailContent, mailText } from "@/lib/mail/content";
import { EJEMPLOS } from "@/lib/mail/ejemplos";
import { renderConfirmacion } from "@/lib/mail/send";

// Vista previa de los mails de confirmación, solo en desarrollo (`npm run dev`):
// /dev/mails?tipo=ciclista|lider|local  (agregar &formato=texto para el texto plano)

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
