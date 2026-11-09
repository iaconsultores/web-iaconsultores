/* Sitemap generado en la construcción: páginas fijas, zonas y soluciones con texto (antes, public/sitemap.xml a mano) */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITIO } from "../datos/sitio";
import { rutaZona } from "../datos/zonas";
import { rutaSolucion } from "../datos/soluciones";

const FIJAS = ["/", "/consultoria-ia", "/soluciones", "/aviso-legal", "/privacidad", "/cookies"];

export const GET: APIRoute = async () => {
  const zonas = (await getCollection("zonas")).map((t) => rutaZona(t.id)).sort();
  const soluciones = (await getCollection("soluciones")).map((t) => rutaSolucion(t.id)).sort();
  const urls = [...FIJAS, ...zonas, ...soluciones].map((r) => `  <url><loc>${new URL(r, SITIO.url).href}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
