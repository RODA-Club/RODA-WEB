import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
