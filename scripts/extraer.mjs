// Copia rangos de líneas de la maqueta (maquetas/r2) a los componentes de la web.
// Uso:
//   node scripts/extraer.mjs <origen> <desde>-<hasta> <destino> [--sin 3,4,10-12] [--anexar]
//   node scripts/extraer.mjs --en <destino> --marca "<!--SLOT:x-->" <origen> <desde>-<hasta>
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const args = process.argv.slice(2);
const rango = (r) => r.split("-").map(Number);
const expandir = (lista) =>
  lista.split(",").filter(Boolean).flatMap((t) => {
    if (!t.includes("-")) return [Number(t)];
    const [a, b] = rango(t);
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  });

function lineas(origen, r, sin = new Set()) {
  const [desde, hasta] = rango(r);
  const todas = readFileSync(origen, "utf8").split(/\r?\n/);
  if (!desde || !hasta || hasta > todas.length) throw new Error(`Rango ${r} fuera de ${origen} (${todas.length} líneas)`);
  return todas.slice(desde - 1, hasta).filter((_, i) => !sin.has(desde + i));
}

if (args[0] === "--en") {
  const [, destino, , marca, origen, r] = args;
  const contenido = readFileSync(destino, "utf8");
  if (!contenido.includes(marca)) throw new Error(`No encuentro ${marca} en ${destino}`);
  writeFileSync(destino, contenido.replace(marca, () => lineas(origen, r).join("\n")));
} else {
  const [origen, r, destino, ...resto] = args;
  const i = resto.indexOf("--sin");
  const sin = new Set(i >= 0 ? expandir(resto[i + 1]) : []);
  mkdirSync(dirname(destino), { recursive: true });
  const escribir = resto.includes("--anexar") ? appendFileSync : writeFileSync;
  escribir(destino, lineas(origen, r, sin).join("\n") + "\n");
}
