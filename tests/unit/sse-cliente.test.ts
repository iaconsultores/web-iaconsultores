import { describe, expect, it } from "vitest";
import { crearLectorSSE, type EventoSSE } from "../../src/scripts/sse-cliente";

describe("crearLectorSSE", () => {
  it("reconstruye eventos partidos en trozos arbitrarios", () => {
    const eventos: EventoSSE[] = [];
    const leer = crearLectorSSE((e) => eventos.push(e));
    const flujo = 'event: conversacion\ndata: {"id":"x","nueva":true}\n\nevent: texto\ndata: {"t":"Hola 😀"}\n\nevent: fin\ndata: {"motivo":"ok"}\n\n';
    for (let i = 0; i < flujo.length; i += 7) leer(flujo.slice(i, i + 7));
    expect(eventos).toEqual([
      { evento: "conversacion", datos: { id: "x", nueva: true } },
      { evento: "texto", datos: { t: "Hola 😀" } },
      { evento: "fin", datos: { motivo: "ok" } },
    ]);
  });
  it("ignora un bloque con JSON roto", () => {
    const eventos: EventoSSE[] = [];
    crearLectorSSE((e) => eventos.push(e))("event: texto\ndata: {roto\n\n");
    expect(eventos).toEqual([]);
  });
});
