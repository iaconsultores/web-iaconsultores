import { describe, expect, it } from "vitest";
import { cargarAnalitica } from "../../src/scripts/analitica";

/* Documento mínimo: solo lo que usa cargarAnalitica */
function documento(hostname: string) {
  const anadidos: { src: string; type: string; atributos: Record<string, string> }[] = [];
  const doc = {
    location: { hostname },
    createElement: () => ({
      src: "",
      type: "",
      atributos: {} as Record<string, string>,
      setAttribute(nombre: string, valor: string) {
        this.atributos[nombre] = valor;
      },
    }),
    head: { append: (el: (typeof anadidos)[number]) => anadidos.push(el) },
  };
  return { doc: doc as unknown as Document, anadidos };
}

describe("cargarAnalitica", () => {
  it("en el dominio de producción añade el script de Cloudflare (módulo, como su fragmento) con el token", () => {
    const { doc, anadidos } = documento("iaconsultores.com");
    expect(cargarAnalitica("token-publico", "iaconsultores.com", doc)).toBe(true);
    expect(anadidos).toHaveLength(1);
    expect(anadidos[0].src).toBe("https://static.cloudflareinsights.com/beacon.min.js");
    expect(anadidos[0].type).toBe("module");
    expect(JSON.parse(anadidos[0].atributos["data-cf-beacon"])).toEqual({ token: "token-publico" });
  });

  it("no carga nada en local, en pruebas ni en el dominio temporal", () => {
    for (const host of ["127.0.0.1", "localhost", "iaconsultores-com-636379.hostingersite.com", "www.iaconsultores.com"]) {
      const { doc, anadidos } = documento(host);
      expect(cargarAnalitica("token-publico", "iaconsultores.com", doc)).toBe(false);
      expect(anadidos).toHaveLength(0);
    }
  });

  it("sin token no carga nada", () => {
    const { doc, anadidos } = documento("iaconsultores.com");
    expect(cargarAnalitica("", "iaconsultores.com", doc)).toBe(false);
    expect(anadidos).toHaveLength(0);
  });
});
