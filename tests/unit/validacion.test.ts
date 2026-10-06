import { describe, expect, it } from "vitest";
import { EsquemaLead, EsquemaMensajeChat, normalizarTelefono } from "../../src/lib/validacion";

const BASE = { nombre: "José Ñúñez 😀", telefono: "678 310 660", proceso: "Registrar facturas", origen: "formulario", privacidad: true, t: 5000 };

describe("normalizarTelefono", () => {
  it.each([
    ["+34 678 31 06 60", "+34678310660"],
    ["678-310-660", "678310660"],
    ["0034678310660", "+34678310660"],
    ["(678) 310.660", "678310660"],
  ])("%s → %s", (entrada, salida) => expect(normalizarTelefono(entrada)).toBe(salida));
});

describe("EsquemaLead", () => {
  it("acepta nombres con tildes y emojis y pone los valores por defecto", () => {
    const r = EsquemaLead.parse(BASE);
    expect(r.nombre).toBe("José Ñúñez 😀");
    expect(r.telefono).toBe("678310660");
    expect(r.franja).toBe("indiferente");
    expect(r.motivo).toBe("llamada");
    expect(r.empresa).toBe("");
  });
  it("rechaza un teléfono imposible", () => {
    expect(EsquemaLead.safeParse({ ...BASE, telefono: "123" }).success).toBe(false);
  });
  it("exige aceptar la privacidad", () => {
    const r = EsquemaLead.safeParse({ ...BASE, privacidad: false });
    expect(r.success).toBe(false);
  });
});

describe("EsquemaMensajeChat", () => {
  it("limita el mensaje a 1.000 caracteres y no admite vacíos", () => {
    expect(EsquemaMensajeChat.safeParse({ mensaje: "  " }).success).toBe(false);
    expect(EsquemaMensajeChat.safeParse({ mensaje: "a".repeat(1001) }).success).toBe(false);
    expect(EsquemaMensajeChat.safeParse({ mensaje: "Hola" }).success).toBe(true);
  });
});
