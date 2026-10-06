// Envía a n8n un lead de prueba firmado igual que la web (src/lib/leads.ts → avisarN8n).
// Uso: node probar-aviso.mjs [url] [--firma-mala]
// Lee el secreto de .env (no se muestra). Sin url, usa el webhook local de n8n.
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

const entorno = Object.fromEntries(
  readFileSync(new URL(".env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const url = process.argv.slice(2).find((a) => a.startsWith("http")) ?? "http://localhost:5678/webhook/lead-iaconsultores";
const ahora = new Date();
const timestamp = Math.floor(ahora.getTime() / 1000);
const cuerpo = JSON.stringify({
  evento: "lead.creado",
  fecha: ahora.toISOString(),
  lead: {
    nombre: "Prueba n8n (demo)",
    telefono: "+34600000000",
    empresa: "Asesoría de prueba (demo)",
    proceso: "Registramos a mano unas 300 facturas de proveedores al mes y queremos automatizarlo cuanto antes.",
    franja: "manana",
    motivo: "llamada",
    origen: "formulario",
  },
});
const secreto = process.argv.includes("--firma-mala") ? "secreto-equivocado" : entorno.IAC_WEBHOOK_SECRET;
const firma = "sha256=" + createHmac("sha256", secreto).update(`${timestamp}.${cuerpo}`).digest("hex");
const r = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-IAC-Timestamp": String(timestamp), "X-IAC-Firma": firma },
  body: cuerpo,
});
console.log(`${r.status} ${await r.text()}`);
