import { createHmac } from "node:crypto";
import { Resend } from "resend";
import type { Lead } from "./validacion";

export interface EmailSaliente {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface EnviadorEmail {
  enviar(email: EmailSaliente): Promise<boolean>;
}

/** Los errores de Resend describen la API (clave, dominio, límites), nunca los datos del lead: se registran tal cual */
export function crearEnviadorResend(apiKey: string): EnviadorEmail {
  const resend = new Resend(apiKey);
  return {
    async enviar(email) {
      try {
        const { error } = await resend.emails.send(email);
        if (error) console.error("[resend] envío rechazado:", error.name, error.message);
        return !error;
      } catch (err) {
        console.error("[resend] envío fallido:", err instanceof Error ? `${err.name}: ${err.message}` : "error");
        return false;
      }
    },
  };
}

/** Para desarrollo y pruebas: no envía nada ni registra datos personales */
export const enviadorSimulado: EnviadorEmail = {
  async enviar() {
    console.log("[email simulado] solicitud recibida");
    return true;
  },
};

const FRANJAS: Record<Lead["franja"], string> = { manana: "Mañana", tarde: "Tarde", indiferente: "Indiferente" };
const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapar = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

export function componerEmailLead(lead: Lead, fecha: Date, para: string, de: string): EmailSaliente {
  const tipo = lead.motivo === "colaboracion" ? "colaboración" : "llamada";
  const cuando = new Intl.DateTimeFormat("es-ES", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Madrid" }).format(fecha);
  const filas: [string, string][] = [
    ["Nombre", lead.nombre],
    ["Teléfono", lead.telefono],
    ["Empresa", lead.empresa || "—"],
    ["Proceso o propuesta", lead.proceso],
    ["Franja", FRANJAS[lead.franja]],
    ["Origen", lead.origen === "chat" ? "Asistente IA de la web" : "Formulario de la web"],
    ["Fecha", cuando],
  ];
  return {
    from: de,
    to: para,
    subject: `Nueva solicitud de ${tipo} · ${lead.nombre}`,
    text: filas.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html:
      `<h2>Nueva solicitud de ${tipo}</h2><table cellpadding="6">` +
      filas.map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapar(v).replace(/\n/g, "<br>")}</td></tr>`).join("") +
      `</table><p><a href="tel:${escapar(lead.telefono)}">Llamar ahora</a></p>`,
  };
}

export function firmarWebhook(secreto: string, timestamp: number, cuerpo: string): string {
  return "sha256=" + createHmac("sha256", secreto).update(`${timestamp}.${cuerpo}`).digest("hex");
}

/** Aviso opcional a n8n (automatizaciones/n8n: Docker + túnel de Cloudflare). Nunca bloquea ni rompe el envío del lead. */
export async function avisarN8n(url: string, secreto: string, lead: Lead, ahora: Date, fetchImpl: typeof fetch = fetch): Promise<void> {
  const timestamp = Math.floor(ahora.getTime() / 1000);
  const cuerpo = JSON.stringify({
    evento: "lead.creado",
    fecha: ahora.toISOString(),
    lead: { nombre: lead.nombre, telefono: lead.telefono, empresa: lead.empresa, proceso: lead.proceso, franja: lead.franja, motivo: lead.motivo, origen: lead.origen },
  });
  try {
    await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-IAC-Timestamp": String(timestamp), "X-IAC-Firma": firmarWebhook(secreto, timestamp, cuerpo) },
      body: cuerpo,
      signal: AbortSignal.timeout(3000),
    });
  } catch (err) {
    console.warn("[n8n] aviso no entregado:", err instanceof Error ? err.name : "error");
  }
}
