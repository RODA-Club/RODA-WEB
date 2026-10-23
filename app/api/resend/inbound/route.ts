import { after } from "next/server";
import { Resend } from "resend";
import { esDelDominio, reenviar } from "@/lib/mail/inbound";

// Webhook de Resend (evento email.received): reenvía a roda.club.app@gmail.com
// todo lo que llega a cualquier dirección @rodaclub.ar. Ver CLAUDE.md.

export const maxDuration = 60;

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const key = process.env.RESEND_API_KEY;
  if (!secret || !key) {
    console.error("inbound: faltan RESEND_WEBHOOK_SECRET o RESEND_API_KEY");
    return new Response("Not configured", { status: 500 });
  }

  // La firma se verifica sobre el cuerpo crudo, antes de parsearlo.
  const payload = await request.text();
  const h = request.headers;
  const resend = new Resend(key);
  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: h.get("svix-id") ?? h.get("webhook-id") ?? "",
        timestamp: h.get("svix-timestamp") ?? h.get("webhook-timestamp") ?? "",
        signature: h.get("svix-signature") ?? h.get("webhook-signature") ?? "",
      },
      webhookSecret: secret,
    });
  } catch {
    console.error("inbound: firma inválida, se ignora el pedido");
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "email.received") return Response.json({ ok: true, ignorado: event.type });

  const { email_id, from } = event.data;
  if (esDelDominio(from)) {
    console.log("inbound: no se reenvía (remitente del dominio)", email_id);
    return Response.json({ ok: true, omitido: true });
  }

  // Se responde 200 enseguida y el reenvío corre después: si falla, solo se
  // loguea, así Resend no reintenta en loop.
  after(async () => {
    try {
      const r = await reenviar(resend, email_id);
      if (r.omitido) console.log("inbound: no se reenvía (remitente del dominio)", email_id);
    } catch (e) {
      console.error("inbound: falló el reenvío", email_id, String(e));
    }
  });

  return Response.json({ ok: true });
}
