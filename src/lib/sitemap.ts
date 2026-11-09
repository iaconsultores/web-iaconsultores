/* Sitemaps según las pautas de Google: un índice (/sitemap.xml) con un sitemap por tipo de página, solo URL
   canónicas e indexables (sin /mohure ni /api) y <lastmod> con la fecha real del último cambio del contenido.
   No se usan <priority> ni <changefreq>: Google los ignora. */
import { SITIO } from "../datos/sitio";

export interface EntradaSitemap {
  ruta: string;
  /** AAAA-MM-DD: última vez que cambió el contenido de la página */
  lastmod: string;
}

/** Páginas fijas y la fecha de su último cambio de contenido */
export const PAGINAS_FIJAS: readonly EntradaSitemap[] = [
  { ruta: "/", lastmod: "2026-11-09" },
  { ruta: "/consultoria-ia", lastmod: "2026-11-09" },
  { ruta: "/soluciones", lastmod: "2026-11-09" },
  { ruta: "/aviso-legal", lastmod: "2026-11-09" },
  { ruta: "/privacidad", lastmod: "2026-10-05" },
  { ruta: "/cookies", lastmod: "2026-10-05" },
];

/** Fecha de las páginas locales si su texto no dice otra (campo `actualizado` de la cabecera) */
export const LASTMOD_LOCALES = "2026-11-09";

/** Sitemaps del índice, en este orden */
export const SITEMAPS = ["sitemap-paginas.xml", "sitemap-zonas.xml", "sitemap-soluciones.xml"] as const;

const url = (ruta: string) => new URL(ruta, SITIO.url).href;
const escapar = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const CABECERA = '<?xml version="1.0" encoding="UTF-8"?>\n';

export function xmlUrlset(entradas: readonly EntradaSitemap[]): string {
  const filas = [...entradas]
    .sort((a, b) => a.ruta.localeCompare(b.ruta))
    .map((e) => `  <url>\n    <loc>${escapar(url(e.ruta))}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`);
  return `${CABECERA}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas.join("\n")}\n</urlset>\n`;
}

export function xmlIndice(sitemaps: readonly { archivo: string; lastmod: string }[]): string {
  const filas = sitemaps.map((s) => `  <sitemap>\n    <loc>${escapar(url(`/${s.archivo}`))}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`);
  return `${CABECERA}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${filas.join("\n")}\n</sitemapindex>\n`;
}

/** La fecha más reciente de una lista (para el <lastmod> de cada sitemap en el índice) */
export const masReciente = (entradas: readonly EntradaSitemap[]) => entradas.map((e) => e.lastmod).sort().at(-1) ?? LASTMOD_LOCALES;

export const respuestaXml = (xml: string) => new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
