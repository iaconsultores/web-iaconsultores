// Middlewares de Express para servidor.mjs. JavaScript plano: Node lo ejecuta sin compilar.
import { existsSync } from "node:fs";
import { extname, join, sep } from "node:path";

export const CABECERAS_SEGURIDAD = {
  "Content-Security-Policy": "frame-ancestors 'none'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

/* Páginas y archivos que no deben indexarse */
const PRIVADAS = /^\/(mohure(\/|\.|$)|cv\/)/;

export function redirigirWww(req, res, next) {
  const host = String(req.headers.host ?? "");
  if (host.toLowerCase().startsWith("www.")) {
    res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
    return;
  }
  next();
}

export function cabecerasSeguridad(req, res, next) {
  res.set(CABECERAS_SEGURIDAD);
  if (req.headers["x-forwarded-proto"] === "https") res.set("Strict-Transport-Security", "max-age=31536000");
  if (PRIVADAS.test(req.path)) res.set("X-Robots-Tag", "noindex, nofollow");
  next();
}

/* Páginas de Astro con build.format "file": /mohure → mohure.html aunque exista la carpeta mohure/
   (express.static ve la carpeta y no prueba la extensión .html) */
export function paginasHtml(cliente) {
  return (req, res, next) => {
    if ((req.method === "GET" || req.method === "HEAD") && req.path !== "/" && !extname(req.path)) {
      const archivo = join(cliente, `${req.path}.html`);
      if (archivo.startsWith(cliente + sep) && existsSync(archivo)) {
        res.sendFile(archivo, { headers: { "Cache-Control": "no-cache" } });
        return;
      }
    }
    next();
  };
}

export function cabecerasEstaticos(res, ruta) {
  if (ruta.includes(`${sep}_astro${sep}`)) res.set("Cache-Control", "public, max-age=31536000, immutable");
  else if (ruta.endsWith(".html")) res.set("Cache-Control", "no-cache");
}
