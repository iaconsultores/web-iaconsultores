import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://iaconsultores.com",
  output: "static",
  /* 16 KB: ninguna API admite más (chat y lead, 8 KB); leerJson aplica además el máximo de cada ruta */
  adapter: node({ mode: "middleware", bodySizeLimit: 16_384 }),
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "never" },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://cloudflareinsights.com",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      scriptDirective: { resources: ["'self'", "https://static.cloudflareinsights.com"] },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
});
