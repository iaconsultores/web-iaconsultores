import { describe, expect, it } from "vitest";
import { BETA_FALLBACK, type ClienteClaude, type ParamsStream } from "../../src/lib/claude";
import { crearAlmacen } from "../../src/lib/conversaciones";
import { crearLimitador } from "../../src/lib/limites";
import { manejarChat, MAX_TURNOS, TEXTO_RECHAZO, type DepsChat } from "../../src/lib/rutas/chat";
import { crearLectorSSE, type EventoSSE } from "../../src/scripts/sse-cliente";

interface Guion {
  trozos?: string[];
  contenido?: unknown[];
  stop?: string;
  falloAMitad?: Error;
}

function clienteFalso(guiones: Guion[]) {
  const llamadas: ParamsStream[] = [];
  const cliente: ClienteClaude = {
    stream(params) {
      llamadas.push(structuredClone(params));
      const g = guiones.shift() ?? { trozos: ["ok"] };
      const trozos = g.trozos ?? [];
      const contenido = g.contenido ?? [{ type: "text", text: trozos.join(""), citations: null }];
      return {
        async *[Symbol.asyncIterator]() {
          for (const [i, t] of trozos.entries()) {
            if (g.falloAMitad && i === 1) throw g.falloAMitad;
            yield { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: t } } as never;
          }
        },
        finalMessage: async () =>
          ({
            content: contenido,
            stop_reason: g.stop ?? "end_turn",
            usage: { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
          }) as never,
      };
    },
  };
  return { cliente, llamadas };
}

const peticion = (cuerpo: unknown, cabeceras: Record<string, string> = {}) =>
  new Request("http://127.0.0.1:4329/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1:4329", "x-forwarded-for": "1.2.3.4", ...cabeceras },
    body: JSON.stringify(cuerpo),
  });

async function eventos(r: Response): Promise<EventoSSE[]> {
  const lista: EventoSSE[] = [];
  crearLectorSSE((e) => lista.push(e))(await r.text());
  return lista;
}

const deps = (cliente: ClienteClaude | null, extra: Partial<DepsChat> = {}): DepsChat => ({
  claude: cliente,
  almacen: crearAlmacen({ maximo: 10, caducidadMs: 60_000 }),
  limites: crearLimitador(),
  conocimiento: "CONOCIMIENTO DE PRUEBA",
  ...extra,
});

const idDe = (lista: EventoSSE[]) => (lista[0].datos as { id: string }).id;

describe("manejarChat", () => {
  it("responde en streaming y guarda el turno sin editar", async () => {
    const { cliente, llamadas } = clienteFalso([{ trozos: ["Hola", ", ¿qué tal?"] }, { trozos: ["Seguimos"] }]);
    const d = deps(cliente);
    const lista = await eventos(await manejarChat(peticion({ mensaje: "Hola" }), d));
    expect(lista.map((e) => e.evento)).toEqual(["conversacion", "texto", "texto", "fin"]);
    expect(lista.at(-1)?.datos).toEqual({ motivo: "ok" });
    await eventos(await manejarChat(peticion({ conversacionId: idDe(lista), mensaje: "Otra" }), d));
    expect(llamadas[1].messages).toHaveLength(3);
    expect(llamadas[1].messages[1]).toEqual({ role: "assistant", content: [{ type: "text", text: "Hola, ¿qué tal?", citations: null }] });
  });

  it("envía los parámetros acordados (modelo, esfuerzo, fallback, caché y herramienta)", async () => {
    const { cliente, llamadas } = clienteFalso([{ trozos: ["ok"] }]);
    await eventos(await manejarChat(peticion({ mensaje: "Hola" }), deps(cliente)));
    const p = llamadas[0] as Record<string, unknown> & ParamsStream;
    expect(p.model).toBe("claude-opus-5-5");
    expect(p.max_tokens).toBe(8000);
    expect(p.output_config).toEqual({ effort: "medium" });
    expect(p.fallbacks).toBe("default");
    expect(p.betas).toContain(BETA_FALLBACK);
    expect(p.system).toEqual([{ type: "text", text: "CONOCIMIENTO DE PRUEBA", cache_control: { type: "ephemeral" } }]);
    expect(p.tools?.[0]).toMatchObject({ name: "proponer_llamada", strict: true });
    expect(p).not.toHaveProperty("thinking");
    expect(p).not.toHaveProperty("tool_choice");
  });

  it("propone la llamada y contesta el tool_use en el turno siguiente", async () => {
    const { cliente, llamadas } = clienteFalso([
      {
        trozos: ["Te propongo una llamada."],
        contenido: [
          { type: "text", text: "Te propongo una llamada.", citations: null },
          { type: "tool_use", id: "toolu_1", name: "proponer_llamada", input: { motivo: "Registrar facturas", proceso: "facturas_contabilidad" } },
        ],
        stop: "tool_use",
      },
      { trozos: ["Gracias"] },
    ]);
    const d = deps(cliente);
    const lista = await eventos(await manejarChat(peticion({ mensaje: "Quiero una llamada" }), d));
    expect(lista.find((e) => e.evento === "tarjeta")?.datos).toEqual({ motivo: "Registrar facturas", proceso: "facturas_contabilidad" });
    d.almacen.marcarPropuestaEnviada(idDe(lista));
    await eventos(await manejarChat(peticion({ conversacionId: idDe(lista), mensaje: "Ya está" }), d));
    const ultimo = llamadas[1].messages.at(-1);
    expect(ultimo?.content).toEqual([
      { type: "tool_result", tool_use_id: "toolu_1", content: "Tarjeta mostrada. Estado: solicitud enviada." },
      { type: "text", text: "Ya está" },
    ]);
  });

  it("ante un rechazo muestra un texto fijo y cierra la conversación", async () => {
    const { cliente } = clienteFalso([{ trozos: [], stop: "refusal" }, { trozos: ["ok"] }]);
    const d = deps(cliente);
    const lista = await eventos(await manejarChat(peticion({ mensaje: "x" }), d));
    expect(lista.find((e) => e.evento === "texto")?.datos).toEqual({ t: TEXTO_RECHAZO });
    expect(lista.at(-1)?.datos).toEqual({ motivo: "rechazo" });
    const otra = await eventos(await manejarChat(peticion({ conversacionId: idDe(lista), mensaje: "y" }), d));
    expect(otra[0].datos).toMatchObject({ nueva: true });
  });

  it("marca la respuesta cortada por max_tokens", async () => {
    const { cliente } = clienteFalso([{ trozos: ["a medias"], stop: "max_tokens" }]);
    const lista = await eventos(await manejarChat(peticion({ mensaje: "x" }), deps(cliente)));
    expect(lista.at(-1)?.datos).toEqual({ motivo: "cortado" });
  });

  it("si falla a mitad emite error y no toca el historial", async () => {
    const { cliente, llamadas } = clienteFalso([{ trozos: ["Hola", "mundo"], falloAMitad: new Error("red") }, { trozos: ["ok"] }]);
    const d = deps(cliente);
    const lista = await eventos(await manejarChat(peticion({ mensaje: "x" }), d));
    expect(lista.map((e) => e.evento)).toContain("error");
    await eventos(await manejarChat(peticion({ conversacionId: idDe(lista), mensaje: "y" }), d));
    expect(llamadas[1].messages).toHaveLength(1);
  });

  it("valida la entrada, el origen y la disponibilidad", async () => {
    const { cliente } = clienteFalso([]);
    expect((await manejarChat(peticion({ mensaje: "" }), deps(cliente))).status).toBe(400);
    expect((await manejarChat(peticion({ mensaje: "a".repeat(1001) }), deps(cliente))).status).toBe(400);
    expect((await manejarChat(peticion({ mensaje: "Hola" }, { origin: "https://otra.com" }), deps(cliente))).status).toBe(403);
    expect((await manejarChat(peticion({ mensaje: "Hola" }), deps(null))).status).toBe(503);
  });

  it("aplica el límite por IP y el máximo de turnos", async () => {
    const { cliente } = clienteFalso([{ trozos: ["ok"] }, { trozos: ["ok"] }]);
    const limites = crearLimitador({
      reglas: { chat: { porHora: 1, globalDia: 100 }, lead: { globalDia: 1 } },
    });
    const d = deps(cliente, { limites });
    await eventos(await manejarChat(peticion({ mensaje: "1" }), d));
    expect((await manejarChat(peticion({ mensaje: "2" }), d)).status).toBe(429);
    const d2 = deps(clienteFalso([{ trozos: ["ok"] }]).cliente);
    const c = d2.almacen.crear();
    c.turnos = MAX_TURNOS;
    expect((await manejarChat(peticion({ conversacionId: c.id, mensaje: "x" }), d2)).status).toBe(429);
  });
});
