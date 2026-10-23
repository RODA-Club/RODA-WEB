import { render } from "@react-email/components";
import { Resend } from "resend";
import { Confirmacion } from "@/emails/Confirmacion";
import type { Lead } from "@/lib/leads";
import { siteUrl } from "@/lib/site";
import { mailContent, mailText } from "./content";

const FROM = "RODA <hola@rodaclub.ar>";
const EQUIPO = "roda.club.app@gmail.com";

export function mailAssetsUrl() {
  return `${siteUrl()}/mail`;
}

export async function renderConfirmacion(lead: Lead) {
  const c = mailContent(lead);
  const html = await render(<Confirmacion c={c} assetsUrl={mailAssetsUrl()} />);
  return { subject: c.subject, html, text: mailText(c) };
}

// Aviso interno en texto simple cuando se anota un líder o un negocio.
function avisoInterno(lead: Lead) {
  const linea = (label: string, value: string | null | undefined) => `${label}: ${value || "-"}`;
  const comunes = [
    linea("Nombre", lead.nombre),
    linea("Mail", lead.email),
    linea("WhatsApp", lead.whatsapp),
    linea("Zona", lead.zona),
  ];
  const origen = [
    "",
    linea("utm_source", lead.utm_source),
    linea("utm_medium", lead.utm_medium),
    linea("utm_campaign", lead.utm_campaign),
    linea("utm_content", lead.utm_content),
    linea("utm_term", lead.utm_term),
    linea("ref", lead.ref),
    linea("referrer", lead.referrer),
  ];

  if (lead.tipo === "lider") {
    return {
      subject: `Nuevo líder: ${lead.grupo_nombre}`,
      text: [
        "Se anotó un líder en rodaclub.ar.",
        "",
        linea("Grupo", lead.grupo_nombre),
        linea("Cuántos salen", lead.grupo_cantidad),
        linea("Ritmo del grupo", lead.grupo_ritmo),
        linea("Instagram del grupo", lead.grupo_instagram),
        linea("Tipo de bici", lead.tipo_bici),
        ...comunes,
        ...origen,
      ].join("\n"),
    };
  }
  if (lead.tipo === "local") {
    return {
      subject: `Nuevo negocio: ${lead.local_nombre}`,
      text: [
        "Se anotó un negocio en rodaclub.ar.",
        "",
        linea("Negocio", lead.local_nombre),
        linea("Tipo de negocio", lead.local_tipo),
        linea("Dirección", lead.local_direccion),
        ...comunes,
        ...origen,
      ].join("\n"),
    };
  }
  return null;
}

// Manda la confirmación y, si corresponde, el aviso interno. Nunca tira: el
// lead ya está guardado, así que un error acá solo se loguea.
export async function sendLeadEmails(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("mail: falta RESEND_API_KEY, no se mandan mails");
    return;
  }
  const resend = new Resend(key);

  const envios: Promise<void>[] = [];

  envios.push(
    (async () => {
      const { subject, html, text } = await renderConfirmacion(lead);
      const { error } = await resend.emails.send({ from: FROM, to: lead.email, replyTo: EQUIPO, subject, html, text });
      if (error) throw new Error(`${error.name}: ${error.message}`);
    })().catch((e) => console.error("mail: falló la confirmación", lead.tipo, String(e))),
  );

  const aviso = avisoInterno(lead);
  if (aviso) {
    envios.push(
      (async () => {
        const { error } = await resend.emails.send({
          from: FROM,
          to: EQUIPO,
          replyTo: lead.email,
          subject: aviso.subject.replace(/[\r\n]+/g, " "),
          text: aviso.text,
        });
        if (error) throw new Error(`${error.name}: ${error.message}`);
      })().catch((e) => console.error("mail: falló el aviso interno", lead.tipo, String(e))),
    );
  }

  await Promise.all(envios);
}
