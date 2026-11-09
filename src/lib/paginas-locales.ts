/* Títulos, migas de pan y datos estructurados de las páginas locales (zonas y soluciones). Lógica pura. */
import { SITIO } from "../datos/sitio";
import { ZONAS, capitalizar, provinciaDe, rutaZona, zona, type Zona } from "../datos/zonas";
import { SOLUCIONES, rutaSolucion, type Solucion } from "../datos/soluciones";

const sinTildes = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** «Xàbia (Jávea)»; sin paréntesis si el otro nombre solo cambia una tilde (Dénia/Denia) o no hay otro */
export function nombreConAlt(z: Zona): string {
  if (!z.alt || sinTildes(z.alt) === sinTildes(z.nombre)) return z.nombre;
  return `${z.nombre} (${z.alt})`;
}

/** «en Xàbia (Jávea)», «en la Vega Baja (el Baix Segura)» */
export function enConAlt(z: Zona): string {
  const alt = nombreConAlt(z);
  return alt === z.nombre ? z.en : `${z.en} (${z.alt})`;
}

/** Para migas y etiquetas: «Provincia de Alicante», «Baix Vinalopó», «Vega Baja», «L'Alacantí», «Elche» */
export function nombreCorto(z: Zona): string {
  return capitalizar(z.tipo === "municipio" ? z.nombre : z.nombre.replace(/^(la|el) /, ""));
}

/** Etiqueta <title>: «Consultoría de IA y automatización en Elche (Elx) | IA Consultores» */
export const tituloZona = (z: Zona) => `Consultoría de IA y automatización ${enConAlt(z)} | ${SITIO.nombre}`;

/** H1: «IA y automatización para empresas de Elche (Elx)» */
export function h1Zona(z: Zona): string {
  const alt = nombreConAlt(z);
  return `IA y automatización para empresas ${alt === z.nombre ? z.de : `${z.de} (${z.alt})`}`;
}

export interface Miga {
  nombre: string;
  ruta: string;
}

/** Inicio › Zonas › provincia › comarca › zona */
export function migasZona(z: Zona): Miga[] {
  const cadena: Zona[] = [];
  for (let actual: Zona | undefined = z; actual; actual = actual.padre ? zona(actual.padre) : undefined) cadena.unshift(actual);
  return [
    { nombre: "Inicio", ruta: "/" },
    { nombre: "Zonas", ruta: "/consultoria-ia" },
    ...cadena.map((x) => ({ nombre: nombreCorto(x), ruta: rutaZona(x.slug) })),
  ];
}

export function migasSolucion(s: Solucion, titulo: string): Miga[] {
  return [
    { nombre: "Inicio", ruta: "/" },
    { nombre: "Soluciones", ruta: "/soluciones" },
    { nombre: titulo, ruta: rutaSolucion(s.slug) },
  ];
}

export function jsonMigas(migas: Miga[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.nombre, item: new URL(m.ruta, SITIO.url).href })),
  };
}

const TIPO_LUGAR: Record<Zona["tipo"], string> = { provincia: "AdministrativeArea", comarca: "AdministrativeArea", municipio: "City" };

/** El servicio que se presta en una zona */
export function jsonServicioZona(z: Zona, descripcion: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${SITIO.nombre} · ${capitalizar(nombreConAlt(z))}`,
    url: new URL(rutaZona(z.slug), SITIO.url).href,
    description: descripcion,
    telephone: "+34678310660",
    email: SITIO.email,
    address: { "@type": "PostalAddress", addressLocality: "Alicante", addressRegion: "Alicante", addressCountry: "ES" },
    areaServed: { "@type": TIPO_LUGAR[z.tipo], name: capitalizar(nombreConAlt(z)), containedInPlace: { "@type": "AdministrativeArea", name: capitalizar(provinciaDe(z).nombre) } },
    founder: { "@type": "Person", name: "Juan Luis Toboso", sameAs: [SITIO.linkedin] },
  };
}

export function jsonArticulo(s: Solucion, datos: { titulo: string; descripcion: string }, fecha: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: datos.titulo,
    description: datos.descripcion,
    url: new URL(rutaSolucion(s.slug), SITIO.url).href,
    inLanguage: "es-ES",
    datePublished: fecha,
    dateModified: fecha,
    author: { "@type": "Person", name: "Juan Luis Toboso", url: SITIO.linkedin },
    publisher: { "@type": "Organization", name: SITIO.nombre, url: SITIO.url },
    about: s.zonas.map((slug) => zona(slug)).filter((z): z is Zona => !!z).map((z) => ({ "@type": "Place", name: capitalizar(nombreConAlt(z)) })),
    image: new URL("/og.png", SITIO.url).href,
  };
}

/** Minutos de lectura a 200 palabras por minuto */
export const minutosLectura = (texto: string) => Math.max(1, Math.round(texto.split(/\s+/).filter(Boolean).length / 200));

/** Fecha de publicación de los artículos de soluciones (primera tanda) */
export const FECHA_SOLUCIONES = "2026-11-09";

/** Zonas hermanas (mismo padre), sin la propia */
export const hermanas = (z: Zona) => ZONAS.filter((x) => x.padre === z.padre && x.slug !== z.slug && x.tipo === z.tipo);

/** Artículos para la página de una zona: los suyos; si no hay, los de su padre; si tampoco, los de su provincia */
export function solucionesParaZona(z: Zona): Solucion[] {
  const propias = SOLUCIONES.filter((s) => s.zonas.includes(z.slug));
  if (propias.length) return propias;
  const padre = z.padre ? SOLUCIONES.filter((s) => s.zonas.includes(z.padre!)) : [];
  if (padre.length) return padre;
  const prov = provinciaDe(z).slug;
  return SOLUCIONES.filter((s) => s.zonas.some((slug) => { const x = zona(slug); return x ? provinciaDe(x).slug === prov : false; }));
}
