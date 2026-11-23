/* Entradas de cada sitemap a partir de las colecciones de contenido (solo en la construcción) */
import { getCollection } from "astro:content";
import { rutaZona } from "../datos/zonas";
import { rutaSolucion } from "../datos/soluciones";
import { rutaServicio } from "../datos/servicios";
import { LASTMOD_LOCALES, LASTMOD_SERVICIOS, LASTMOD_ZONAS, PAGINAS_FIJAS, type EntradaSitemap } from "./sitemap";

export async function entradasZonas(): Promise<EntradaSitemap[]> {
  return (await getCollection("zonas")).map((t) => ({ ruta: rutaZona(t.id), lastmod: t.data.actualizado ?? LASTMOD_ZONAS }));
}

export async function entradasServicios(): Promise<EntradaSitemap[]> {
  return (await getCollection("servicios")).map((t) => ({ ruta: rutaServicio(t.id), lastmod: t.data.actualizado ?? LASTMOD_SERVICIOS }));
}

export async function entradasSoluciones(): Promise<EntradaSitemap[]> {
  return (await getCollection("soluciones")).map((t) => ({ ruta: rutaSolucion(t.id), lastmod: t.data.actualizado ?? LASTMOD_LOCALES }));
}

export const entradasPaginas = async (): Promise<EntradaSitemap[]> => [...PAGINAS_FIJAS];
