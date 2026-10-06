import { describe, expect, it } from "vitest";
import { MODULOS_AGENTIA } from "../../src/datos/agentia";
import { CIFRAS } from "../../src/datos/cv";
import { EVIDENCIAS } from "../../src/datos/evidencias";
import { SERVICIOS } from "../../src/datos/servicios";
import { CONOCIMIENTO, componerConocimiento } from "../../src/lib/conocimiento";

describe("base de conocimiento del asistente", () => {
  it("es idéntica byte a byte en cada composición (caché) y sin fechas del día ni retornos de carro", () => {
    expect(componerConocimiento()).toBe(CONOCIMIENTO);
    expect(CONOCIMIENTO).not.toContain(new Date().toISOString().slice(0, 10));
    expect(CONOCIMIENTO).not.toContain("\r");
  });
  it("incluye servicios, módulos y evidencias con sus niveles", () => {
    for (const s of SERVICIOS) expect(CONOCIMIENTO).toContain(s.titulo);
    for (const m of MODULOS_AGENTIA) expect(CONOCIMIENTO).toContain(m.nombre);
    for (const e of EVIDENCIAS) expect(CONOCIMIENTO).toContain(e.requisito);
    expect(CONOCIMIENTO).toContain("Sin experiencia aún");
    expect(CONOCIMIENTO).toContain("Ha creado más de 50 webs en los últimos 10 años");
    expect(CONOCIMIENTO).toContain("programada con agentes de IA (Claude Code y Codex principalmente)");
    expect(CONOCIMIENTO).toContain("Inglés de nivel muy alto (C1-C2)");
    expect(CONOCIMIENTO).toContain("Máster en IA Aplicada y Optimización de Procesos Productivos (Universidad Tecnológica Atlántico Mediterráneo, UTAMED; 30 ECTS; finalización prevista en octubre de 2026)");
  });
  it("las cifras de /mohure coinciden con lo que sabe el asistente", () => {
    expect(CIFRAS.map((c) => c.cifra)).toEqual(["+10", "+1.000", "35", "29", "+50"]);
    for (const c of CIFRAS) expect(CONOCIMIENTO).toContain(`${c.cifra.replace("+", "")} ${c.unidad}`);
  });
  it("es lo bastante largo para la caché (más de 512 tokens)", () => {
    expect(CONOCIMIENTO.length).toBeGreaterThan(6000);
  });
});
