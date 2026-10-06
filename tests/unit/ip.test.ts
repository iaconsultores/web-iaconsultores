import { describe, expect, it } from "vitest";
import { ipDe } from "../../src/lib/ip";

const req = (cabeceras: Record<string, string>) => new Request("http://x/api", { headers: cabeceras });

describe("ipDe", () => {
  it("usa la última IP de x-forwarded-for (la añade el proxy, el visitante no puede falsearla)", () => {
    expect(ipDe(req({ "x-forwarded-for": "6.6.6.6, 81.2.3.4" }))).toBe("81.2.3.4");
  });
  it("si no hay x-forwarded-for usa x-real-ip y después la dirección del socket", () => {
    expect(ipDe(req({ "x-real-ip": "81.2.3.4" }))).toBe("81.2.3.4");
    expect(ipDe(req({}), "10.0.0.1")).toBe("10.0.0.1");
    expect(ipDe(req({}))).toBe("desconocida");
  });
  it("ignora cf-connecting-ip (sin el proxy de Cloudflare se puede falsear)", () => {
    expect(ipDe(req({ "cf-connecting-ip": "1.1.1.1" }), "10.0.0.1")).toBe("10.0.0.1");
  });
});
