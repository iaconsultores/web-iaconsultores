import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ZONAS, rutaZona, type TipoZona } from "../../src/datos/zonas";
import { SOLUCIONES, rutaSolucion } from "../../src/datos/soluciones";

/* Textos de las páginas locales (src/textos): coherentes con los registros, honestos, únicos y con enlaces válidos.
   Lo que comprueba esta prueba está explicado en src/textos/LEEME.md. */

const DIR_ZONAS = "src/textos/zonas";
const DIR_SOLUCIONES = "src/textos/soluciones";

interface Texto {
  ruta: string;
  datos: Record<string, string>;
  cuerpo: string;
}

function leerTexto(ruta: string): Texto {
  const bruto = readFileSync(ruta, "utf8").replace(/\r\n/g, "\n");
  const m = bruto.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${ruta}: sin cabecera --- … ---`);
  const datos: Record<string, string> = {};
  for (const linea of m[1].split("\n")) {
    if (!linea.trim()) continue;
    const c = linea.match(/^([a-z]+):\s*"([^"]*)"\s*$/);
    if (!c) throw new Error(`${ruta}: línea de cabecera no válida (usa clave: "valor", sin comillas dentro): ${linea}`);
    datos[c[1]] = c[2];
  }
  return { ruta, datos, cuerpo: m[2] };
}

const md = (dir: string) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : []);
const textosZonas = md(DIR_ZONAS).map((f) => leerTexto(`${DIR_ZONAS}/${f}`));
const textosSoluciones = md(DIR_SOLUCIONES).map((f) => leerTexto(`${DIR_SOLUCIONES}/${f}`));
const todos = [...textosZonas, ...textosSoluciones];

const palabras = (t: string) => t.replace(/[#*_>\-[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
const MINIMO: Record<TipoZona | "solucion", number> = { municipio: 450, comarca: 500, provincia: 600, solucion: 850 };

const RUTAS_VALIDAS = new Set([
  "/",
  "/#contacto",
  "/#servicios",
  "/#como-trabajamos",
  "/#sobre-mi",
  "/consultoria-ia",
  "/soluciones",
  ...ZONAS.map((z) => rutaZona(z.slug)),
  ...SOLUCIONES.map((s) => rutaSolucion(s.slug)),
]);

/* Promesas que no podemos sostener: clientes, resultados, cifras, precios, superlativos */
const PROHIBIDO: [RegExp, string][] = [
  [/\d+(?:[.,]\d+)?\s?%/, "porcentajes (resultados o cifras inventadas)"],
  [/€|\beuros?\b/i, "precios"],
  [/casos? de éxito/i, "casos de éxito"],
  [/nuestros clientes|clientes como|uno de nuestros clientes/i, "clientes"],
  [/hemos (ayudado|trabajado con|implantado|automatizado)/i, "trabajos anteriores que no constan"],
  [/garantiza|garantizamos|garantía/i, "garantías"],
  [/\blíderes?\b|número uno|\bel mejor\b|\blos mejores\b/i, "superlativos"],
  [/revolucion|disruptiv/i, "lenguaje exagerado"],
  [/nuestra oficina|oficina en|sede en/i, "oficinas que no existen"],
  [/en (\d+|dos|tres|cuatro|pocas) (semanas|días)\b/i, "plazos"],
  [/Agentia Contable|contable\.cloud/i, "producto anterior"],
];

describe("textos de las páginas locales", () => {
  it("cada zona y cada solución del registro tienen su texto, y no sobra ninguno", () => {
    const zonasMd = md(DIR_ZONAS).map((f) => f.replace(/\.md$/, "")).sort();
    const solucionesMd = md(DIR_SOLUCIONES).map((f) => f.replace(/\.md$/, "")).sort();
    expect(zonasMd).toEqual(ZONAS.map((z) => z.slug).sort());
    expect(solucionesMd).toEqual(SOLUCIONES.map((s) => s.slug).sort());
  });

  it("los registros son coherentes: slugs únicos y zonas existentes", () => {
    const slugs = ZONAS.map((z) => z.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const z of ZONAS) if (z.padre) expect(slugs, `${z.slug}: padre ${z.padre}`).toContain(z.padre);
    const sol = SOLUCIONES.map((s) => s.slug);
    expect(new Set(sol).size).toBe(sol.length);
    for (const s of SOLUCIONES) for (const z of s.zonas) expect(slugs, `${s.slug}: zona ${z}`).toContain(z);
  });

  it.each(textosZonas.map((t) => [t.ruta, t] as const))("%s: cabecera y longitud", (_, t) => {
    const slug = t.ruta.split("/").pop()!.replace(/\.md$/, "");
    const z = ZONAS.find((x) => x.slug === slug);
    expect(Object.keys(t.datos).sort()).toEqual(["descripcion"]);
    expect(t.datos.descripcion.length, "descripción entre 110 y 165 caracteres").toBeGreaterThanOrEqual(110);
    expect(t.datos.descripcion.length, "descripción entre 110 y 165 caracteres").toBeLessThanOrEqual(165);
    if (z) expect(palabras(t.cuerpo), `mínimo de palabras para ${z.tipo}`).toBeGreaterThanOrEqual(MINIMO[z.tipo]);
  });

  it.each(textosSoluciones.map((t) => [t.ruta, t] as const))("%s: cabecera y longitud", (_, t) => {
    expect(Object.keys(t.datos).sort()).toEqual(["descripcion", "resumen", "titulo"]);
    expect(t.datos.titulo.length, "título entre 30 y 70 caracteres").toBeGreaterThanOrEqual(30);
    expect(t.datos.titulo.length, "título entre 30 y 70 caracteres").toBeLessThanOrEqual(70);
    expect(t.datos.descripcion.length, "descripción entre 110 y 165 caracteres").toBeGreaterThanOrEqual(110);
    expect(t.datos.descripcion.length, "descripción entre 110 y 165 caracteres").toBeLessThanOrEqual(165);
    expect(t.datos.resumen.length, "resumen entre 80 y 220 caracteres").toBeGreaterThanOrEqual(80);
    expect(t.datos.resumen.length, "resumen entre 80 y 220 caracteres").toBeLessThanOrEqual(220);
    expect(palabras(t.cuerpo), "mínimo de palabras para una solución").toBeGreaterThanOrEqual(MINIMO.solucion);
    expect(t.cuerpo.match(/\]\(\/consultoria-ia\//g)?.length ?? 0, "enlaza al menos una zona").toBeGreaterThanOrEqual(1);
  });

  it.each(todos.map((t) => [t.ruta, t] as const))("%s: formato, enlaces y honestidad", (_, t) => {
    expect(t.cuerpo, "sin H1: el título lo pone la plantilla").not.toMatch(/^# /m);
    expect(t.cuerpo.match(/^## /gm)?.length ?? 0, "al menos tres apartados ##").toBeGreaterThanOrEqual(3);
    expect(t.cuerpo, "sin HTML").not.toMatch(/<[a-z/][^>]*>/i);
    expect(t.cuerpo, "sin imágenes").not.toMatch(/!\[/);
    expect(t.cuerpo, "sin enlaces externos").not.toMatch(/\]\((?!\/)/);
    for (const [, ruta] of t.cuerpo.matchAll(/\]\((\/[^)\s]*)\)/g)) expect(RUTAS_VALIDAS, `enlace roto ${ruta}`).toContain(ruta);
    const texto = [t.cuerpo, ...Object.values(t.datos)].join("\n");
    for (const [patron, motivo] of PROHIBIDO) expect(texto, motivo).not.toMatch(patron);
  });

  it("títulos y descripciones únicos", () => {
    const desc = todos.map((t) => t.datos.descripcion);
    expect(new Set(desc).size).toBe(desc.length);
    const tit = textosSoluciones.map((t) => t.datos.titulo);
    expect(new Set(tit).size).toBe(tit.length);
  });

  it("ninguna frase larga se repite entre páginas (cada página es única)", () => {
    const vistas = new Map<string, string>();
    const repetidas: string[] = [];
    for (const t of todos) {
      const frases = new Set(
        t.cuerpo
          .split(/\n+|(?<=[.!?:;])\s+/)
          .map((f) => f.replace(/^[#>*\-\d.\s]+/, "").replace(/\s+/g, " ").trim().toLowerCase())
          .filter((f) => f.length >= 70),
      );
      for (const f of frases) {
        const otra = vistas.get(f);
        if (otra && otra !== t.ruta) repetidas.push(`«${f}» en ${otra} y ${t.ruta}`);
        else vistas.set(f, t.ruta);
      }
    }
    expect(repetidas).toEqual([]);
  });
});
