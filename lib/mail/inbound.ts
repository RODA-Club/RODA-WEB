import PostalMime from "postal-mime";
import type { Resend } from "resend";

// Reenvío de los mails que llegan a cualquier dirección @rodaclub.ar hacia la
// casilla del equipo. Hace lo mismo que resend.emails.receiving.forward (baja
// el mail original y lo vuelve a mandar con contenido y adjuntos), pero además
// pone reply_to con quien escribió: así "Responder" en Gmail le contesta a esa
// persona y no vuelve a hola@rodaclub.ar.

export const DOMINIO = "rodaclub.ar";
const DESDE = "hola@rodaclub.ar";
const EQUIPO = "roda.club.app@gmail.com";

export function direccion(from: string): string {
  const m = from.match(/<([^>]+)>/);
  return (m ? m[1] : from).trim().toLowerCase();
}

function nombreVisible(from: string): string {
  const m = from.match(/^\s*"?([^"<]*?)"?\s*</);
  const nombre = (m?.[1] || direccion(from)).replace(/["<>\r\n]/g, "").trim();
  return nombre.slice(0, 60) || "Alguien";
}

// Evita loops: lo que sale de nuestro propio dominio no se reenvía.
export function esDelDominio(from: string): boolean {
  return direccion(from).endsWith(`@${DOMINIO}`);
}

export async function reenviar(resend: Resend, emailId: string) {
  const { data: email, error } = await resend.emails.receiving.get(emailId);
  if (error || !email) throw new Error(`no se pudo leer el mail: ${error?.name}: ${error?.message}`);

  // Doble chequeo de loop con el remitente real del mail.
  if (esDelDominio(email.from)) return { omitido: true as const };

  if (!email.raw?.download_url) throw new Error("el mail no tiene contenido original para bajar");
  const res = await fetch(email.raw.download_url);
  if (!res.ok) throw new Error(`no se pudo bajar el mail original: HTTP ${res.status}`);

  const parsed = await PostalMime.parse(await res.arrayBuffer(), { attachmentEncoding: "base64" });
  const attachments = parsed.attachments.map((a) => ({
    filename: a.filename || undefined,
    content: String(a.content),
    contentType: a.mimeType,
    contentId: a.contentId ? a.contentId.replace(/^<|>$/g, "") : undefined,
  }));

  const { data, error: errorEnvio } = await resend.emails.send(
    {
      from: `"${nombreVisible(email.from)} vía RODA" <${DESDE}>`,
      to: EQUIPO,
      replyTo: email.reply_to?.length ? email.reply_to : email.from,
      subject: email.subject || "(sin asunto)",
      ...(parsed.html ? { html: parsed.html } : {}),
      text: parsed.text || (parsed.html ? undefined : "(mail sin contenido)"),
      attachments: attachments.length ? attachments : undefined,
    } as Parameters<Resend["emails"]["send"]>[0],
    // Resend puede reintentar el webhook: la misma clave evita reenviar dos veces.
    { idempotencyKey: `reenvio/${emailId}` },
  );
  if (errorEnvio) throw new Error(`no se pudo reenviar: ${errorEnvio.name}: ${errorEnvio.message}`);
  return { omitido: false as const, id: data?.id };
}
