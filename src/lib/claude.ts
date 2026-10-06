import Anthropic from "@anthropic-ai/sdk";
import { clienteSimulado } from "./claude-simulado";
import { leerConfig } from "./config";

export const MODELO = "claude-opus-5-5";
/** Fallback del servidor: si un clasificador rechaza por error, Anthropic reintenta en el modelo que recomienda */
export const BETA_FALLBACK = "server-side-fallback-2026-07-01";

export type ParamsStream = Parameters<Anthropic["beta"]["messages"]["stream"]>[0];

export interface FlujoClaude extends AsyncIterable<Anthropic.Beta.BetaRawMessageStreamEvent> {
  finalMessage(): Promise<Anthropic.Beta.BetaMessage>;
}

export interface ClienteClaude {
  stream(params: ParamsStream): FlujoClaude;
}

export const PROCESOS = ["facturas_contabilidad", "leads_crm", "documentos", "atencion_cliente", "informes", "web", "formacion", "otro"] as const;

export const HERRAMIENTA_PROPONER_LLAMADA = {
  name: "proponer_llamada",
  description:
    "Propón al usuario una llamada de diagnóstico gratuita de 30 minutos cuando quiera avanzar, pida contacto, presupuesto o una reunión. No pidas nombre ni teléfono: la web le mostrará un formulario para que confirme.",
  strict: true,
  eager_input_streaming: true,
  input_schema: {
    type: "object",
    properties: {
      motivo: { type: "string", description: "La necesidad del usuario resumida en una frase (máximo 200 caracteres)." },
      proceso: { type: "string", enum: [...PROCESOS], description: "Tipo de proceso que quiere mejorar." },
    },
    required: ["motivo", "proceso"],
    additionalProperties: false,
  },
} satisfies Anthropic.Beta.BetaTool;

export function parametrosChat(conocimiento: string, mensajes: Anthropic.Beta.BetaMessageParam[]): ParamsStream {
  return {
    model: MODELO,
    max_tokens: 8000,
    betas: [BETA_FALLBACK],
    fallbacks: "default",
    output_config: { effort: "medium" },
    cache_control: { type: "ephemeral" },
    system: [{ type: "text", text: conocimiento, cache_control: { type: "ephemeral" } }],
    tools: [HERRAMIENTA_PROPONER_LLAMADA],
    messages: mensajes,
  };
}

export function crearClienteClaude(): ClienteClaude | null {
  const config = leerConfig();
  if (config.claudeSimulado) return clienteSimulado();
  if (!config.anthropicKey) return null;
  const anthropic = new Anthropic({ apiKey: config.anthropicKey, maxRetries: 2 });
  return { stream: (params) => anthropic.beta.messages.stream(params) };
}

const CONTACTO = "Llámanos al 678 310 660 o escríbenos por WhatsApp.";

/** Errores del SDK, de la clase más específica a la más general */
export function mensajeError(err: unknown): { codigo: string; mensaje: string } {
  if (err instanceof Anthropic.RateLimitError)
    return { codigo: "saturado", mensaje: `Ahora mismo hay mucha demanda. Prueba en un minuto, o ${CONTACTO.charAt(0).toLowerCase()}${CONTACTO.slice(1)}` };
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError || err instanceof Anthropic.BadRequestError)
    return { codigo: "no_disponible", mensaje: `El asistente no está disponible ahora mismo. ${CONTACTO}` };
  return { codigo: "fallo", mensaje: `No he podido responder. ${CONTACTO}` };
}
