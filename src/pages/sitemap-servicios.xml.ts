/* Sitemap de servicios (enlazado desde el índice /sitemap.xml) */
import type { APIRoute } from "astro";
import { respuestaXml, xmlUrlset } from "../lib/sitemap";
import { entradasServicios } from "../lib/sitemap-entradas";

export const GET: APIRoute = async () => respuestaXml(xmlUrlset(await entradasServicios()));
