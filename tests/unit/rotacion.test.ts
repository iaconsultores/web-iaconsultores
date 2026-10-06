import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { crearRotacion, siguiente } from "../../src/scripts/rotacion";

const IDS = ["alicante", "valencia", "murcia"];

describe("siguiente", () => {
  it("avanza y vuelve al principio", () => {
    expect(siguiente(IDS, "alicante")).toBe("valencia");
    expect(siguiente(IDS, "murcia")).toBe("alicante");
  });
});

describe("crearRotacion", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function montar() {
    const vistas: string[] = [];
    const r = crearRotacion({ ids: IDS, intervalo: 6000, alCambiar: (id) => vistas.push(id) });
    return { r, vistas };
  }

  it("cambia de provincia en cada intervalo", () => {
    const { r, vistas } = montar();
    r.iniciar();
    vi.advanceTimersByTime(12_000);
    expect(vistas).toEqual(["valencia", "murcia"]);
    expect(r.actual).toBe("murcia");
  });

  it("no avanza en pausa y sigue al reanudar", () => {
    const { r, vistas } = montar();
    r.iniciar();
    r.pausar("boton");
    vi.advanceTimersByTime(20_000);
    expect(vistas).toEqual([]);
    r.reanudar("boton");
    vi.advanceTimersByTime(6000);
    expect(vistas).toEqual(["valencia"]);
  });

  it("solo sigue cuando se retiran todas las pausas", () => {
    const { r, vistas } = montar();
    r.iniciar();
    r.pausar("puntero");
    r.pausar("fuera");
    r.reanudar("puntero");
    vi.advanceTimersByTime(12_000);
    expect(vistas).toEqual([]);
    r.reanudar("fuera");
    vi.advanceTimersByTime(6000);
    expect(vistas).toEqual(["valencia"]);
  });

  it("al fijar una provincia la muestra y deja de rotar hasta soltarla", () => {
    const { r, vistas } = montar();
    r.iniciar();
    r.fijar("murcia");
    vi.advanceTimersByTime(30_000);
    expect(vistas).toEqual(["murcia"]);
    expect(r.fijada).toBe(true);
    r.soltar();
    r.reanudar("boton");
    vi.advanceTimersByTime(6000);
    expect(vistas).toEqual(["murcia", "alicante"]);
  });
});
