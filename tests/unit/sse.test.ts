import { describe, expect, it } from "vitest";
import { eventoSSE } from "../../src/lib/sse";

describe("eventoSSE", () => {
  it("serializa un evento en una sola línea de datos, en UTF-8", () => {
    const datos = { t: "Hola\nqué tal 😀" };
    const texto = new TextDecoder().decode(eventoSSE("texto", datos));
    const lineas = texto.split("\n");
    expect(lineas).toHaveLength(4);
    expect(lineas[0]).toBe("event: texto");
    expect(lineas[1].startsWith("data: ")).toBe(true);
    expect(JSON.parse(lineas[1].slice("data: ".length))).toEqual(datos);
    expect(texto.endsWith("\n\n")).toBe(true);
  });
});
