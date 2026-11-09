/* Índice de sitemaps: el que se declara en robots.txt y se envía a Google Search Console */
import type { APIRoute } from "astro";
import { masReciente, respuestaXml, xmlIndice } from "../lib/sitemap";
import { entradasPaginas, entradasSoluciones, entradasZonas } from "../lib/sitemap-entradas";

export const GET: APIRoute = async () => {
  const [paginas, zonas, soluciones] = await Promise.all([entradasPaginas(), entradasZonas(), entradasSoluciones()]);
  return respuestaXml(
    xmlIndice([
      { archivo: "sitemap-paginas.xml", lastmod: masReciente(paginas) },
      { archivo: "sitemap-zonas.xml", lastmod: masReciente(zonas) },
      { archivo: "sitemap-soluciones.xml", lastmod: masReciente(soluciones) },
    ]),
  );
};
