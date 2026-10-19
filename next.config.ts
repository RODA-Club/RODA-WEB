import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Links cortos para compartir. Redirigen a la home con la UTM, así en la bio
  // de Instagram se ve un link limpio y el lead igual queda atribuido.
  // Temporales (307) para poder cambiarles el destino sin que quede cacheado.
  async redirects() {
    return [
      { source: "/ig", destination: "/?utm_source=instagram&utm_medium=bio", permanent: false },
    ];
  },
};

export default nextConfig;
