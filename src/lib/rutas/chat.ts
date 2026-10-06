import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { mensajeError, parametrosChat, PROCESOS, type ClienteClaude } from "../claude";
import type { AlmacenConversaciones } from "../conversaciones";
import { ipDe } from "../ip";
import type { Limitador } from "../limites";
import { leerJson, respuestaJson } from "../peticion";
import { CABECERAS_SSE, eventoSSE } from "../sse";
import { EsquemaMensajeChat, primerError } from "../validacion";

export interface DepsChat {
  claude: ClienteClaude | null;
  almacen: AlmacenConversaciones;
  limites: Limitador;
  conocimiento: string;
  registrar?: (datos: Record<string, unknown>) => void;
}

export const MAX_TURNOS = 20;
export const TEXTO_RECHAZO = "Prefiero no responder a eso. Si quieres, lo hablamos por teléfono: 678 310 660.";
const NO_DISPONIBLE = "El asistente no está disponible ahora mismo. Llámanos al 678 310 660 o escríbenos por WhatsApp.";
const EntradaPropuesta = z.object({ motivo: z.string().trim().min(1).max(200), proceso: z.enum(PROCESOS) });

export async function manejarChat(request: Request, deps: DepsChat, direccion?: string): Promise<Response> {
  const lectura = await leerJson(request, 8192);
  if (!lectura.ok) return lectura.respuesta;
  const validacion = EsquemaMensajeChat.safeParse(lectura.datos);
  if (!validacion.success) return respuestaJson(400, { ok: false, codigo: "validacion", mensaje: primerError(validacion.error) });
  const claude = deps.claude;
  if (!claude) return respuestaJson(503, { ok: false, codigo: "no_disponible", mensaje: NO_DISPONIBLE });
  const consumo = deps.limites.consumir("chat", ipDe(request, direccion));
  if (!consumo.ok)
    return respuestaJson(
      429,
      { ok: false, codigo: "limite", mensaje: "Has llegado al límite de mensajes por ahora. Si quieres seguir, llámanos al 678 310 660 o escríbenos por WhatsApp." },
      { "Retry-After": String(consumo.reintentarEnS) },
    );

  const { conversacionId, mensaje } = validacion.data;
  const existente = deps.almacen.obtener(conversacionId);
  const conv = existente ?? deps.almacen.crear();
  if (conv.turnos >= MAX_TURNOS)
    return respuestaJson(429, { ok: false, codigo: "turnos", mensaje: "Esta conversación ya es larga. Para seguir, lo mejor es la llamada: 678 310 660." });

  /* Si el asistente propuso la llamada en el turno anterior, su tool_use se contesta primero */
  const contenido: Anthropic.Beta.BetaContentBlockParam[] = [];
  if (conv.propuesta)
    contenido.push({
      type: "tool_result",
      tool_use_id: conv.propuesta.toolUseId,
      content: `Tarjeta mostrada. Estado: ${conv.propuesta.enviada ? "solicitud enviada" : "sin enviar"}.`,
    });
  contenido.push({ type: "text", text: mensaje });
  const mensajeUsuario: Anthropic.Beta.BetaMessageParam = { role: "user", content: contenido };

  const cuerpo = new ReadableStream<Uint8Array>({
    async start(controlador) {
      const enviar = (evento: string, datos: unknown) => controlador.enqueue(eventoSSE(evento, datos));
      enviar("conversacion", { id: conv.id, nueva: !existente });
      try {
        const flujo = claude.stream(parametrosChat(deps.conocimiento, [...conv.mensajes, mensajeUsuario]));
        for await (const ev of flujo) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") enviar("texto", { t: ev.delta.text });
        }
        const final = await flujo.finalMessage();
        deps.registrar?.({
          ruta: "chat",
          stop: final.stop_reason,
          entrada: final.usage.input_tokens,
          cacheLeida: final.usage.cache_read_input_tokens ?? 0,
          cacheEscrita: final.usage.cache_creation_input_tokens ?? 0,
          salida: final.usage.output_tokens,
        });
        if (final.stop_reason === "refusal") {
          deps.almacen.borrar(conv.id);
          enviar("texto", { t: TEXTO_RECHAZO });
          enviar("fin", { motivo: "rechazo" });
          return;
        }
        /* Historial: solo se añade, con el contenido completo (incluidos los bloques de razonamiento) */
        conv.mensajes.push(mensajeUsuario, { role: "assistant", content: final.content });
        conv.turnos += 1;
        conv.propuesta = null;
        for (const bloque of final.content) {
          if (bloque.type !== "tool_use" || bloque.name !== "proponer_llamada") continue;
          conv.propuesta = { toolUseId: bloque.id, enviada: false };
          const entrada = EntradaPropuesta.safeParse(bloque.input);
          if (entrada.success) enviar("tarjeta", entrada.data);
        }
        enviar("fin", { motivo: final.stop_reason === "max_tokens" ? "cortado" : "ok" });
      } catch (err) {
        enviar("error", mensajeError(err));
      } finally {
        controlador.close();
      }
    },
  });
  return new Response(cuerpo, { headers: CABECERAS_SSE });
}
