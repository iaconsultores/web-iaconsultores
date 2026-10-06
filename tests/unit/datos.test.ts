import { describe, expect, it } from "vitest";
import { MODULOS_AGENTIA } from "../../src/datos/agentia";
import { EVIDENCIAS, NIVELES, NOTA_AGENTIA } from "../../src/datos/evidencias";
import { PROVINCIAS, PROVINCIA_INICIAL, ROTACION_MS, esProvincia } from "../../src/datos/provincias";
import { SERVICIOS } from "../../src/datos/servicios";
import { CV } from "../../src/datos/cv";

describe("datos compartidos", () => {
  it("las provincias siguen el orden de la rotación y empiezan por Alicante", () => {
    expect(PROVINCIAS.map((p) => p.id)).toEqual(["alicante", "valencia", "murcia", "albacete", "madrid", "espana"]);
    expect(PROVINCIA_INICIAL).toBe("alicante");
    expect(ROTACION_MS).toBe(3000);
    expect(esProvincia("murcia")).toBe(true);
    expect(esProvincia("cuenca")).toBe(false);
  });

  it("hay 10 servicios completos", () => {
    expect(SERVICIOS).toHaveLength(10);
    for (const s of SERVICIOS) {
      expect(s.titulo && s.descripcion && s.beneficio).toBeTruthy();
      expect(s.herramientas.length).toBeGreaterThan(0);
    }
  });

  it("Agentia Contable tiene 10 módulos y solo dos en validación", () => {
    expect(MODULOS_AGENTIA).toHaveLength(10);
    expect(MODULOS_AGENTIA.filter((m) => m.enValidacion).map((m) => m.nombre)).toEqual([
      "Facturación y Verifactu",
      "Bancos y tesorería",
    ]);
  });

  it("las evidencias tienen id único y un nivel válido", () => {
    const ids = EVIDENCIAS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of EVIDENCIAS) expect(Object.keys(NIVELES)).toContain(e.nivel);
  });

  it("mantiene los niveles honestos confirmados por Juan Luis", () => {
    const nivel = (id: string) => EVIDENCIAS.find((e) => e.id === id)?.nivel;
    expect(nivel("make-n8n")).toBe("formacion_y_proyecto"); // flujo n8n propio conectado a la web, 6-oct-2026
    expect(nivel("gohighlevel")).toBe("sin_experiencia");
    expect(nivel("vps")).toBe("experiencia_real"); // uso básico, confirmado el 6-oct-2026
    expect(nivel("copilot-studio")).toBe("aprendiendo");
    expect(nivel("whatsapp-api")).toBe("sin_experiencia");
    expect(nivel("linux")).toBe("sin_experiencia");
    expect(nivel("apis")).toBe("experiencia_real");
  });

  it("recoge lo que ha confirmado Juan Luis", () => {
    const detalle = (id: string) => EVIDENCIAS.find((e) => e.id === id)?.detalle;
    expect(NOTA_AGENTIA).toContain("programada con agentes de IA (Claude Code y Codex principalmente)");
    expect(detalle("modelos-ia")).toContain("Uso habitual y comparado de modelos OpenAI, Gemini, NotebookLM");
    expect(detalle("modelos-ia")).toContain("Mistral, Jev y otros modelos");
    expect(detalle("apis")).toContain("la API de Claude, OpenAI, Mistral y otros");
    expect(detalle("gohighlevel")).toContain("puede crear uno similar");
    expect(detalle("procesos")).toContain("Máster en IA Aplicada y Optimización de Procesos Productivos");
    expect(detalle("cloud")).toContain("Más de 50 webs creadas en los últimos 10 años");
    expect(detalle("vps")).toContain("Uso básico");
    expect(detalle("make-n8n")).toContain("Flujo n8n propio conectado a esta web");
    expect(detalle("clientes")).toContain("durante más de una década");
    expect(detalle("copilot-studio")).toContain("sin uso en desarrollo de proyectos");
    expect(detalle("crm-erp")).toContain("RE/MAX");
    /* El máster aún no ha terminado: se dice siempre (6-oct-2026) */
    expect(detalle("procesos")).toContain("finalización prevista en octubre de 2026");
    expect(CV.formacion.find((l) => l.inicio.startsWith("Máster"))?.resto).toContain("finalización prevista en octubre de 2026");
    /* La lectura de documentos va más allá de las facturas */
    expect(detalle("ocr")).not.toContain("facturas");
    expect(detalle("modelos-ia")).not.toContain("facturas");
  });
});
