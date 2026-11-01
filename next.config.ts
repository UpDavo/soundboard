import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El indicador de dev va a la derecha: abajo-izquierda es del aviso de carpeta local.
  devIndicators: { position: "bottom-right" },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
