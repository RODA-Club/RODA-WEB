// URL pública del sitio. Cuando haya dominio, cargar NEXT_PUBLIC_SITE_URL en
// Vercel; mientras tanto se usa la URL de producción que da Vercel.
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const SITE_DESCRIPTION =
  "RODA te conecta con grupos de ciclistas de tu nivel, tu ritmo y tu zona. Antes de ir ya sabés a qué velocidad van, cuántos son y dónde se juntan. Nadie queda atrás.";
