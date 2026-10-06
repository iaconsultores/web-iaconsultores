import { afterEach, describe, expect, it, vi } from "vitest";
import { avisarN8n, componerEmailLead, crearEnviadorResend, firmarWebhook } from "../../src/lib/leads";
import { EsquemaLead } from "../../src/lib/validacion";

const LEAD = EsquemaLead.parse({
  nombre: "José Ñúñez 😀", telefono: "+34 678 31 06 60", proceso: "Facturas <script>alert(1)</script>",
  franja: "manana", origen: "formulario", privacidad: true, t: 5000,
});

describe("firmarWebhook", () => {
  it("coincide con el vector conocido", () => {
    expect(firmarWebhook("secreto-de-prueba", 1700000000, JSON.stringify({ evento: "lead.creado" }))).toBe(
      "sha256=f0ce609c7354de68bddd72ff52d03d9e59f7c95b33838e1ea8ec4e8d50423e5b",
    );
  });
});

describe("componerEmailLead", () => {
  it("incluye los datos, la franja legible y escapa el HTML", () => {
    const email = componerEmailLead(LEAD, new Date("2026-10-05T10:00:00Z"), "para@x.com", "de@x.com");
    expect(email.subject).toBe("Nueva solicitud de llamada · José Ñúñez 😀");
    expect(email.text).toContain("Teléfono: +34678310660");
    expect(email.text).toContain("Franja: Mañana");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).not.toContain("<script>");
  });
});

describe("crearEnviadorResend", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("en producción registra por qué Resend rechaza el envío, sin datos del lead", async () => {
    vi.stubEnv("NODE_ENV", "production"); // el SDK solo registra sus errores fuera de producción
    const registros: string[] = [];
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      registros.push(args.map(String).join(" "));
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ statusCode: 403, name: "validation_error", message: "The iaconsultores.com domain is not verified." }, { status: 403 })),
    );
    const enviado = await crearEnviadorResend("clave-de-prueba").enviar(componerEmailLead(LEAD, new Date(), "para@x.com", "de@x.com"));
    expect(enviado).toBe(false);
    const texto = registros.join("\n");
    expect(texto).toContain("validation_error");
    expect(texto).toContain("domain is not verified");
    expect(texto).not.toContain("Ñúñez");
    expect(texto).not.toContain("678");
  });
});

describe("avisarN8n", () => {
  it("firma el aviso y no lanza si n8n falla", async () => {
    const fetchFalso = vi.fn().mockRejectedValue(new Error("caído"));
    await expect(avisarN8n("http://n8n/webhook", "s", LEAD, new Date(1_700_000_000_000), fetchFalso)).resolves.toBeUndefined();
    const [, init] = fetchFalso.mock.calls[0];
    expect(init.headers["X-IAC-Timestamp"]).toBe("1700000000");
    expect(init.headers["X-IAC-Firma"]).toBe(firmarWebhook("s", 1700000000, init.body));
  });
});
