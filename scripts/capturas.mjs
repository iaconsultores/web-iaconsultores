// Capturas de la web local (build + servidor en 127.0.0.1:4329) para compararlas con la maqueta.
// Uso: node scripts/capturas.mjs   (con el servidor arrancado: HOST=127.0.0.1 PORT=4329 node servidor.mjs)
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:4329";
const PROVINCIAS = ["alicante", "valencia", "murcia", "albacete", "madrid", "espana"];
const VISTAS = [
  { nombre: "escritorio", viewport: { width: 1440, height: 900 }, isMobile: false },
  { nombre: "movil", viewport: { width: 390, height: 844 }, isMobile: true },
];
mkdirSync("tmp/capturas", { recursive: true });
const navegador = await chromium.launch({ channel: "msedge" });
for (const v of VISTAS) {
  const ctx = await navegador.newContext({ viewport: v.viewport, isMobile: v.isMobile, reducedMotion: "reduce" });
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + "/", { waitUntil: "networkidle" });
  for (const p of PROVINCIAS) {
    await pagina.locator(`.prov-chip[data-p="${p}"]`).dispatchEvent("click");
    await pagina.waitForTimeout(400);
    await pagina.screenshot({ path: `tmp/capturas/portada-${p}-${v.nombre}.png` });
  }
  await pagina.screenshot({ path: `tmp/capturas/completa-${v.nombre}.png`, fullPage: true });
  await ctx.close();
}
await navegador.close();
console.log("Capturas en tmp/capturas/");
