// Avisa por IndexNow de las URL nuevas o cambiadas de iaconsultores.com. Lo reciben Bing, Yandex, Seznam, Naver y los demás
// buscadores del protocolo (se pasan el aviso entre ellos); Google no lo usa: para Google, Search Console y el sitemap.
//
// Uso, DESPUÉS de publicar (lee los sitemaps en vivo):
//   node scripts/indexnow.mjs --desde=2026-11-11   las URL con lastmod desde esa fecha, más la portada
//   node scripts/indexnow.mjs --todas              todas las URL de los sitemaps
//   node scripts/indexnow.mjs / /soluciones        rutas concretas
//   --prueba                                       enseña lo que enviaría, sin enviarlo
//
// La clave es pública por diseño: el protocolo la comprueba en https://iaconsultores.com/<clave>.txt (public/<clave>.txt).
// Para cambiarla, cambia las dos cosas a la vez.
import { pathToFileURL } from "node:url";

export const SITIO_URL = "https://iaconsultores.com";
export const INDEXNOW_CLAVE = "3ea02b3897de1182b8b82019805e2e78";
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** Entradas de un sitemap ([{ loc, lastmod }]) y, si es un índice, las direcciones de sus sitemaps.
 *  @param {string} xml */
export function leerSitemap(xml) {
  const bloques = (etiqueta) => [...String(xml).matchAll(new RegExp(`<${etiqueta}>([\\s\\S]*?)</${etiqueta}>`, "g"))].map(([, b]) => ({
    loc: (b.match(/<loc>([^<]+)<\/loc>/) || [, ""])[1].trim(),
    lastmod: (b.match(/<lastmod>([^<]+)<\/lastmod>/) || [, ""])[1].trim().slice(0, 10),
  })).filter((e) => e.loc);
  return { urls: bloques("url"), sitemaps: bloques("sitemap").map((e) => e.loc) };
}

/** Qué URL se envían: las rutas pedidas, todas, o las cambiadas desde una fecha (y la portada, que enlaza a todo).
 *  @param {{ loc: string, lastmod: string }[]} entradas
 *  @param {{ base?: string, rutas?: string[], todas?: boolean, desde?: string }} [opciones]
 *  @returns {string[]} */
export function seleccionarUrls(entradas, { base = SITIO_URL, rutas = [], todas = false, desde = "" } = {}) {
  const B = base.replace(/\/$/, "");
  let urls;
  if (rutas.length) urls = rutas.map((r) => (r.startsWith("http") ? r : B + (r.startsWith("/") ? r : `/${r}`)));
  else if (todas) urls = entradas.map((e) => e.loc);
  else if (desde) urls = [`${B}/`, ...entradas.filter((e) => e.lastmod && e.lastmod >= desde).map((e) => e.loc)];
  else throw new Error("Indica --desde=AAAA-MM-DD, --todas o las rutas.");
  return [...new Set(urls)].filter((u) => u === `${B}/` || u.startsWith(`${B}/`)).slice(0, 10000);
}

/** @param {{ base?: string, clave?: string, urls: string[] }} aviso */
export function cuerpoAviso({ base = SITIO_URL, clave = INDEXNOW_CLAVE, urls }) {
  const B = base.replace(/\/$/, "");
  return { host: new URL(B).host, key: clave, keyLocation: `${B}/${clave}.txt`, urlList: urls };
}

const RESPUESTAS = { 200: "aceptado", 202: "recibido; la clave se comprobará más tarde", 400: "petición mal formada", 403: "la clave no es válida o no está publicada", 422: "alguna URL no es de este sitio o no coincide con la clave", 429: "demasiados avisos: espera y vuelve a intentarlo" };

async function main(args) {
  const prueba = args.includes("--prueba");
  const todas = args.includes("--todas");
  const desde = (args.find((a) => a.startsWith("--desde=")) || "").slice(8);
  const rutas = args.filter((a) => !a.startsWith("--"));
  const publicada = await fetch(`${SITIO_URL}/${INDEXNOW_CLAVE}.txt`).then((r) => (r.ok ? r.text() : "")).catch(() => "");
  if (publicada.trim() !== INDEXNOW_CLAVE) throw new Error(`La clave no está publicada en ${SITIO_URL}/${INDEXNOW_CLAVE}.txt: publica antes la web.`);
  let entradas = [];
  if (!rutas.length) {
    const pendientes = [`${SITIO_URL}/sitemap.xml`];
    for (let i = 0; i < pendientes.length && i < 20; i++) {
      const { urls, sitemaps } = leerSitemap(await (await fetch(pendientes[i])).text());
      entradas = entradas.concat(urls); pendientes.push(...sitemaps);
    }
  }
  const urls = seleccionarUrls(entradas, { rutas, todas, desde });
  if (!urls.length) { console.log("No hay URL que avisar."); return; }
  console.log(`${urls.length} URL:\n${urls.map((u) => `  ${u}`).join("\n")}`);
  if (prueba) { console.log("(--prueba: no se envía nada)"); return; }
  const r = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(cuerpoAviso({ urls })) });
  console.log(`IndexNow: ${r.status} ${RESPUESTAS[r.status] || ""}`.trim());
  if (r.status >= 300) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) main(process.argv.slice(2)).catch((e) => { console.error(e.message); process.exitCode = 1; });
