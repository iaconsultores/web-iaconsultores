import { describe, expect, it } from "vitest";
import { leerJson } from "../../src/lib/peticion";

const URL_API = "http://127.0.0.1:4329/api/lead";
const req = (cuerpo: string, cabeceras: Record<string, string> = {}) =>
  new Request(URL_API, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1:4329", ...cabeceras },
    body: cuerpo,
  });

describe("leerJson", () => {
  it("devuelve el JSON de una petición del propio sitio", async () => {
    const r = await leerJson(req('{"a":1}'), 100);
    expect(r).toEqual({ ok: true, datos: { a: 1 } });
  });
  it("rechaza otro origen (403), otro tipo (415), un cuerpo grande (413) y JSON roto (400)", async () => {
    const estado = async (p: Promise<Awaited<ReturnType<typeof leerJson>>>) => {
      const r = await p;
      return r.ok ? 200 : r.respuesta.status;
    };
    expect(await estado(leerJson(req("{}", { origin: "https://otra.com" }), 100))).toBe(403);
    expect(await estado(leerJson(req("{}", { "content-type": "text/plain" }), 100))).toBe(415);
    expect(await estado(leerJson(req(JSON.stringify({ a: "x".repeat(200) })), 100))).toBe(413);
    expect(await estado(leerJson(req("{roto"), 100))).toBe(400);
  });

  /* Un POST enorme no debe cargarse entero en la memoria del único proceso */
  const flujo = (trozos: number, tamano: number) => {
    let leidos = 0;
    /* highWaterMark 0: el flujo solo produce un trozo cuando alguien lo lee */
    const cuerpo = new ReadableStream<Uint8Array>(
      {
        pull(c) {
          if (leidos === trozos) return c.close();
          leidos++;
          c.enqueue(new Uint8Array(tamano).fill(32));
        },
      },
      { highWaterMark: 0 },
    );
    return { cuerpo, leidos: () => leidos };
  };
  const reqFlujo = (cuerpo: ReadableStream<Uint8Array>, cabeceras: Record<string, string> = {}) =>
    new Request(URL_API, {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://127.0.0.1:4329", ...cabeceras },
      body: cuerpo,
      duplex: "half",
    } as RequestInit);

  it("rechaza con 413 un cuerpo declarado mayor que el máximo sin leerlo", async () => {
    const f = flujo(1, 10);
    const r = await leerJson(reqFlujo(f.cuerpo, { "content-length": "10000000" }), 8192);
    expect(r.ok ? 200 : r.respuesta.status).toBe(413);
    expect(f.leidos()).toBe(0);
  });

  it("deja de leer en cuanto un cuerpo sin longitud declarada supera el máximo", async () => {
    const f = flujo(128, 16_384);
    const r = await leerJson(reqFlujo(f.cuerpo), 8192);
    expect(r.ok ? 200 : r.respuesta.status).toBe(413);
    expect(f.leidos()).toBeLessThanOrEqual(2);
  });
});
