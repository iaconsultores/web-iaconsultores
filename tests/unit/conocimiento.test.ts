import { describe, expect, it } from "vitest";
import { SERVICIOS } from "../../src/datos/servicios";
import { CONOCIMIENTO, componerConocimiento } from "../../src/lib/conocimiento";

describe("base de conocimiento del asistente", () => {
  it("es idéntica byte a byte en cada composición (caché) y sin fechas del día ni retornos de carro", () => {
    expect(componerConocimiento()).toBe(CONOCIMIENTO);
    expect(CONOCIMIENTO).not.toContain(new Date().toISOString().slice(0, 10));
    expect(CONOCIMIENTO).not.toContain("\r");
  });
  it("incluye las fichas de servicios, las soluciones a medida y el perfil de Juan Luis", () => {
    for (const s of SERVICIOS) expect(CONOCIMIENTO).toContain(s.titulo);
    expect(CONOCIMIENTO).toContain("cursos de IA adaptados a cada empresa y a sus empleados");
    expect(CONOCIMIENTO).toContain("Ha diseñado y dirigido de principio a fin el desarrollo de una plataforma de gestión con IA");
    expect(CONOCIMIENTO).toContain("Lo principal: soluciones a medida para los procesos de la empresa");
    expect(CONOCIMIENTO).toContain("Ha creado más de 50 webs en los últimos 10 años");
    expect(CONOCIMIENTO).toContain("programada con agentes de IA (Claude Code y Codex principalmente)");
    expect(CONOCIMIENTO).toContain("Inglés de nivel muy alto (C1-C2)");
    expect(CONOCIMIENTO).toContain("Máster en IA Aplicada y Optimización de Procesos Productivos (Universidad Tecnológica Atlántico Mediterráneo, UTAMED; 30 ECTS; finalización prevista en octubre de 2026)");
  });
  it("no vende un programa de contabilidad propio y deriva a las soluciones a medida", () => {
    expect(CONOCIMIENTO).toContain("No vendemos un programa de facturación ni de contabilidad propio");
    expect(CONOCIMIENTO).not.toContain("Para reclutadores");
  });
  it("es lo bastante largo para la caché (más de 512 tokens)", () => {
    expect(CONOCIMIENTO.length).toBeGreaterThan(6000);
  });
});
