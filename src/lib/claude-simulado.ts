import type Anthropic from "@anthropic-ai/sdk";
import type { ClienteClaude, FlujoClaude, ParamsStream } from "./claude";

const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));

function ultimoTexto(params: ParamsStream): string {
  const ultimo = params.messages.at(-1);
  if (!ultimo) return "";
  if (typeof ultimo.content === "string") return ultimo.content;
  return ultimo.content.map((b) => (b.type === "text" ? b.text : "")).join(" ");
}

/** Cliente falso para desarrollo local y pruebas de navegador: sin red y sin clave */
export function clienteSimulado(): ClienteClaude {
  return {
    stream(params): FlujoClaude {
      const texto = ultimoTexto(params);
      const proponer = /llamada/i.test(texto);
      const respuesta = proponer
        ? "Te propongo una llamada de diagnóstico gratuita de 30 minutos para verlo con calma."
        : `Respuesta simulada del asistente de IA Consultores a: «${texto.slice(0, 80)}».`;
      const contenido: unknown[] = [{ type: "text", text: respuesta, citations: null }];
      if (proponer)
        contenido.push({ type: "tool_use", id: `toolu_simulado_${Date.now()}`, name: "proponer_llamada", input: { motivo: "Automatizar un proceso de la empresa", proceso: "otro" } });
      const mensaje = {
        id: "msg_simulado",
        type: "message",
        role: "assistant",
        model: params.model,
        content: contenido,
        stop_reason: proponer ? "tool_use" : "end_turn",
        stop_sequence: null,
        usage: { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
      } as unknown as Anthropic.Beta.BetaMessage;
      const trozos = respuesta.match(/.{1,24}/gs) ?? [respuesta];
      return {
        async *[Symbol.asyncIterator]() {
          for (const t of trozos) {
            await pausa(15);
            yield { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: t } } as unknown as Anthropic.Beta.BetaRawMessageStreamEvent;
          }
        },
        finalMessage: async () => mensaje,
      };
    },
  };
}
