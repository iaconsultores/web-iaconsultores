import { describe, expect, it } from "vitest";
import { crearAlmacen } from "../../src/lib/conversaciones";

describe("crearAlmacen", () => {
  it("crea, recupera y caduca conversaciones", () => {
    let t = 0;
    const a = crearAlmacen({ maximo: 10, caducidadMs: 1000, ahora: () => t });
    const c = a.crear();
    expect(a.obtener(c.id)).toBe(c);
    t = 2000;
    expect(a.obtener(c.id)).toBeUndefined();
    expect(a.obtener(undefined)).toBeUndefined();
  });
  it("descarta la menos usada al llegar al máximo", () => {
    const a = crearAlmacen({ maximo: 2, caducidadMs: 60_000 });
    const c1 = a.crear();
    const c2 = a.crear();
    a.obtener(c1.id);
    a.crear();
    expect(a.obtener(c2.id)).toBeUndefined();
    expect(a.obtener(c1.id)).toBe(c1);
    expect(a.tamano).toBe(2);
  });
  it("marca como enviada la propuesta de llamada pendiente", () => {
    const a = crearAlmacen({ maximo: 2, caducidadMs: 60_000 });
    const c = a.crear();
    c.propuesta = { toolUseId: "toolu_1", enviada: false };
    a.marcarPropuestaEnviada(c.id);
    expect(c.propuesta.enviada).toBe(true);
  });
});
