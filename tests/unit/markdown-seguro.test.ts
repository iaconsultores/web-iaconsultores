import { describe, expect, it } from "vitest";
import { analizarLinea, analizarMarkdown, enlacePermitido } from "../../src/scripts/markdown-seguro";

describe("markdown seguro", () => {
  it("solo permite enlaces propios, de contacto y de Agentia Contable", () => {
    expect(enlacePermitido("https://iaconsultores.com/#contacto")).toBe(true);
    expect(enlacePermitido("https://agentiacontable.com")).toBe(true);
    expect(enlacePermitido("tel:+34678310660")).toBe(true);
    expect(enlacePermitido("https://malicioso.com")).toBe(false);
    expect(enlacePermitido("javascript:alert(1)")).toBe(false);
  });
  it("convierte negritas y enlaces permitidos, y deja los demás como texto", () => {
    expect(analizarLinea("Hola **mundo**, ve a [la web](https://iaconsultores.com) o [esto](https://malo.com).")).toEqual([
      { tipo: "texto", valor: "Hola " },
      { tipo: "negrita", valor: "mundo" },
      { tipo: "texto", valor: ", ve a " },
      { tipo: "enlace", valor: "la web", href: "https://iaconsultores.com" },
      { tipo: "texto", valor: " o " },
      { tipo: "texto", valor: "esto" },
      { tipo: "texto", valor: "." },
    ]);
  });
  it("separa la puntuación final de una URL suelta", () => {
    expect(analizarLinea("Mira https://agentiacontable.com.")).toEqual([
      { tipo: "texto", valor: "Mira " },
      { tipo: "enlace", valor: "https://agentiacontable.com", href: "https://agentiacontable.com" },
      { tipo: "texto", valor: "." },
    ]);
  });
  it("agrupa párrafos y listas; el HTML queda como texto", () => {
    const bloques = analizarMarkdown("Uno\n\n- a\n- b\n\n<img src=x onerror=alert(1)>");
    expect(bloques).toEqual([
      { tipo: "parrafo", segmentos: [{ tipo: "texto", valor: "Uno" }] },
      { tipo: "lista", elementos: [[{ tipo: "texto", valor: "a" }], [{ tipo: "texto", valor: "b" }]] },
      { tipo: "parrafo", segmentos: [{ tipo: "texto", valor: "<img src=x onerror=alert(1)>" }] },
    ]);
  });
});
