import { describe, expect, it } from "vitest";
import { crearLimitador } from "../../src/lib/limites";

describe("crearLimitador", () => {
  it("aplica el límite por hora y por IP", () => {
    let t = Date.UTC(2026, 9, 5, 10, 0, 0);
    const l = crearLimitador({ ahora: () => t });
    for (let i = 0; i < 20; i++) expect(l.consumir("chat", "1.1.1.1").ok).toBe(true);
    const r = l.consumir("chat", "1.1.1.1");
    expect(r.ok).toBe(false);
    expect(l.consumir("chat", "2.2.2.2").ok).toBe(true);
    t += 3_600_001;
    expect(l.consumir("chat", "1.1.1.1").ok).toBe(true);
  });
  it("aplica el tope global diario y lo reinicia al cambiar de día en Madrid", () => {
    let t = Date.UTC(2026, 9, 5, 21, 0, 0); // 23:00 en Madrid
    const l = crearLimitador({
      ahora: () => t,
      reglas: { chat: { globalDia: 2 }, lead: { globalDia: 1 } },
    });
    expect(l.consumir("chat", "a").ok).toBe(true);
    expect(l.consumir("chat", "b").ok).toBe(true);
    expect(l.consumir("chat", "c").ok).toBe(false);
    t += 2 * 3_600_000; // 01:00 del día siguiente en Madrid
    expect(l.consumir("chat", "c").ok).toBe(true);
  });
});
