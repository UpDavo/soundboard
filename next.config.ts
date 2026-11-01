import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin indicador de dev: las esquinas inferiores son del aviso de carpeta y del volumen.
  // (El overlay de errores sigue funcionando.)
  devIndicators: false,
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
