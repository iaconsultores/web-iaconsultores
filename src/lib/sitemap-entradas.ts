/* Entradas de cada sitemap a partir de las colecciones de contenido (solo en la construcción) */
import { getCollection } from "astro:content";
import { rutaZona } from "../datos/zonas";
import { rutaSolucion } from "../datos/soluciones";
import { LASTMOD_LOCALES, PAGINAS_FIJAS, type EntradaSitemap } from "./sitemap";

export async function entradasZonas(): Promise<EntradaSitemap[]> {
  return (await getCollection("zonas")).map((t) => ({ ruta: rutaZona(t.id), lastmod: t.data.actualizado ?? LASTMOD_LOCALES }));
}

export async function entradasSoluciones(): Promise<EntradaSitemap[]> {
  return (await getCollection("soluciones")).map((t) => ({ ruta: rutaSolucion(t.id), lastmod: t.data.actualizado ?? LASTMOD_LOCALES }));
}

export const entradasPaginas = async (): Promise<EntradaSitemap[]> => [...PAGINAS_FIJAS];
