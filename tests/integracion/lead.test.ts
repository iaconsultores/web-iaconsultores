import { describe, expect, it, vi } from "vitest";
import type { Config } from "../../src/lib/config";
import type { avisarN8n, EmailSaliente, EnviadorEmail } from "../../src/lib/leads";
import { crearLimitador } from "../../src/lib/limites";
import { manejarLead, type DepsLead } from "../../src/lib/rutas/lead";

const CONFIG: Config = {
  claudeSimulado: false, resendSimulado: false, anthropicKey: "", resendKey: "k",
  leadPara: "juanluis@iaconsultores.com", leadDe: "IA Consultores <web@iaconsultores.com>", n8nUrl: "", n8nSecreto: "",
};
const VALIDO = { nombre: "Ana", telefono: "0034 678 310 660", proceso: "Facturas", origen: "formulario", privacidad: true, t: 5000 };

const peticion = (cuerpo: unknown) =>
  new Request("http://127.0.0.1:4329/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://127.0.0.1:4329", "x-forwarded-for": "1.2.3.4" },
    body: JSON.stringify(cuerpo),
  });

function montar(resultados: boolean[] = [true], extra: Partial<DepsLead> = {}) {
  const enviar = vi.fn(async (_email: EmailSaliente) => resultados.shift() ?? true);
  const email: EnviadorEmail = { enviar };
  const deps: DepsLead = { email, limites: crearLimitador(), config: CONFIG, ...extra };
  return { deps, enviar };
}

describe("manejarLead", () => {
  it("envía el email con el teléfono normalizado", async () => {
    const { deps, enviar } = montar();
    const r = await manejarLead(peticion(VALIDO), deps);
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true });
    expect(enviar).toHaveBeenCalledOnce();
    expect(enviar.mock.calls[0][0].text).toContain("Teléfono: +34678310660");
  });
  it("reintenta una vez y, si Resend sigue fallando, ofrece teléfono y WhatsApp", async () => {
    const { deps, enviar } = montar([false, false]);
    const r = await manejarLead(peticion(VALIDO), deps);
    expect(r.status).toBe(502);
    expect((await r.json()).mensaje).toContain("678 310 660");
    expect(enviar).toHaveBeenCalledTimes(2);
  });
  it("descarta en silencio el campo trampa y los envíos demasiado rápidos", async () => {
    const { deps, enviar } = montar();
    expect((await manejarLead(peticion({ ...VALIDO, web: "spam" }), deps)).status).toBe(200);
    expect((await manejarLead(peticion({ ...VALIDO, t: 500 }), deps)).status).toBe(200);
    expect(enviar).not.toHaveBeenCalled();
  });
  it("devuelve 400 con el primer error de validación", async () => {
    const { deps } = montar();
    const r = await manejarLead(peticion({ ...VALIDO, privacidad: false }), deps);
    expect(r.status).toBe(400);
    expect((await r.json()).mensaje).toBe("Debes aceptar la política de privacidad.");
  });
  it("avisa a n8n si está configurado y notifica el envío", async () => {
    const avisar = vi.fn(async (..._args: Parameters<typeof avisarN8n>) => {});
    const alEnviar = vi.fn();
    const { deps } = montar([true], { avisar, alEnviar, config: { ...CONFIG, n8nUrl: "http://n8n/w", n8nSecreto: "s" } });
    await manejarLead(peticion({ ...VALIDO, origen: "chat", conversacionId: "00000000-0000-4000-8000-000000000000" }), deps);
    expect(avisar).toHaveBeenCalledOnce();
    expect(avisar.mock.calls[0][0]).toBe("http://n8n/w");
    expect(alEnviar).toHaveBeenCalledOnce();
  });
  it("limita a 5 solicitudes por hora y IP", async () => {
    const { deps } = montar(Array(10).fill(true));
    for (let i = 0; i < 5; i++) expect((await manejarLead(peticion(VALIDO), deps)).status).toBe(200);
    expect((await manejarLead(peticion(VALIDO), deps)).status).toBe(429);
  });
});
