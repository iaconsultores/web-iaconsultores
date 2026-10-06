import type { Config } from "../config";
import { ipDe } from "../ip";
import { avisarN8n, componerEmailLead, type EnviadorEmail } from "../leads";
import type { Limitador } from "../limites";
import { leerJson, respuestaJson } from "../peticion";
import { EsquemaLead, primerError, type Lead } from "../validacion";

export interface DepsLead {
  email: EnviadorEmail | null;
  limites: Limitador;
  config: Config;
  ahora?: () => Date;
  avisar?: typeof avisarN8n;
  alEnviar?: (lead: Lead) => void;
}

const FALLO = "No hemos podido enviar tu solicitud. Llámanos al 678 310 660 o escríbenos por WhatsApp.";

export async function manejarLead(request: Request, deps: DepsLead, direccion?: string): Promise<Response> {
  const lectura = await leerJson(request, 8192);
  if (!lectura.ok) return lectura.respuesta;
  const consumo = deps.limites.consumir("lead", ipDe(request, direccion));
  if (!consumo.ok)
    return respuestaJson(
      429,
      { ok: false, codigo: "limite", mensaje: "Has enviado varias solicitudes seguidas. Llámanos al 678 310 660 o escríbenos por WhatsApp." },
      { "Retry-After": String(consumo.reintentarEnS) },
    );
  const validacion = EsquemaLead.safeParse(lectura.datos);
  if (!validacion.success) return respuestaJson(400, { ok: false, codigo: "validacion", mensaje: primerError(validacion.error) });
  const lead = validacion.data;
  /* Trampa para bots: se responde como si nada para no darles pistas */
  if (lead.web || lead.t < 3000) return respuestaJson(200, { ok: true });
  if (!deps.email) return respuestaJson(502, { ok: false, codigo: "email", mensaje: FALLO });
  const ahora = deps.ahora?.() ?? new Date();
  const email = componerEmailLead(lead, ahora, deps.config.leadPara, deps.config.leadDe);
  let enviado = await deps.email.enviar(email).catch(() => false);
  if (!enviado) enviado = await deps.email.enviar(email).catch(() => false);
  if (!enviado) return respuestaJson(502, { ok: false, codigo: "email", mensaje: FALLO });
  if (deps.config.n8nUrl && deps.config.n8nSecreto)
    await (deps.avisar ?? avisarN8n)(deps.config.n8nUrl, deps.config.n8nSecreto, lead, ahora);
  deps.alEnviar?.(lead);
  return respuestaJson(200, { ok: true });
}
