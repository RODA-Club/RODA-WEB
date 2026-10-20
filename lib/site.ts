// Dominio oficial del sitio. NEXT_PUBLIC_SITE_URL lo pisa si hace falta (por
// ejemplo, para probar otro dominio); en local se usa localhost.
const PRODUCTION_URL = "https://rodaclub.ar";

export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL) return PRODUCTION_URL;
  return "http://localhost:3000";
}

export const SITE_DESCRIPTION =
  "RODA te conecta con grupos de ciclistas de tu nivel, tu ritmo y tu zona. Antes de ir ya sabés a qué velocidad van, cuántos son y dónde se juntan. Nadie queda atrás.";
