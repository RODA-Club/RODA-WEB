import type { NextConfig } from "next";

// PostHog pasa por nuestro dominio (rodaclub.ar/ingest) en vez de ir directo a
// posthog.com: así no lo frenan los bloqueadores de anuncios y medimos a más
// gente. Es la configuración que recomienda PostHog para Next.js.
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const POSTHOG_ASSETS = POSTHOG_HOST.replace("://us.i.", "://us-assets.i.").replace("://eu.i.", "://eu-assets.i.");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // PostHog usa rutas con barra final; Next no tiene que redirigirlas.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${POSTHOG_ASSETS}/static/:path*` },
      { source: "/ingest/array/:path*", destination: `${POSTHOG_ASSETS}/array/:path*` },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  async redirects() {
    return [
      // El dominio viejo de Vercel lleva al oficial, conservando ruta y
      // parámetros (UTM, ref). Va primero para que /ig también pase por acá.
      {
        source: "/:path*",
        has: [{ type: "host", value: "roda-web.vercel.app" }],
        destination: "https://rodaclub.ar/:path*",
        permanent: true,
      },
      // Links cortos para compartir. Redirigen a la home con la UTM, así en la
      // bio de Instagram se ve un link limpio y el lead igual queda atribuido.
      // Temporales (307) para poder cambiarles el destino sin que quede cacheado.
      { source: "/ig", destination: "/?utm_source=instagram&utm_medium=bio", permanent: false },
    ];
  },
};

export default nextConfig;
