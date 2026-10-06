// Genera public/cv/juan-luis-toboso-consultor-ia.pdf desde /mohure/cv (servidor local en 127.0.0.1:4329).
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:4329";
mkdirSync("public/cv", { recursive: true });
const navegador = await chromium.launch({ channel: "msedge" });
const pagina = await navegador.newPage();
await pagina.goto(`${BASE}/mohure/cv`, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
await pagina.pdf({ path: "public/cv/juan-luis-toboso-consultor-ia.pdf", format: "A4", printBackground: true });
await navegador.close();
console.log("PDF generado en public/cv/juan-luis-toboso-consultor-ia.pdf");
