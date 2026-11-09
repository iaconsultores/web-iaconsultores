import { describe, expect, it } from "vitest";
import { EVIDENCIAS, NIVELES, NOTA_AGENTIA } from "../../src/datos/evidencias";
import { PROVINCIAS, PROVINCIA_INICIAL, ROTACION_MS, esProvincia } from "../../src/datos/provincias";
import { SERVICIOS } from "../../src/datos/servicios";
import { CV } from "../../src/datos/cv";
import { ZONAS } from "../../src/datos/zonas";

describe("datos compartidos", () => {
  it("la portada rota por las comarcas de Alicante y termina en las provincias vecinas, sin Madrid ni «toda España»", () => {
    expect(PROVINCIAS.map((p) => p.id)).toEqual(["alicante", "elche", "vega-baja", "vinalopo", "alcoia", "marina-baixa", "marina-alta", "valencia", "murcia", "albacete"]);
    expect(PROVINCIA_INICIAL).toBe("alicante");
    expect(ROTACION_MS).toBe(7500);
    expect(esProvincia("murcia")).toBe(true);
    expect(esProvincia("madrid")).toBe(false);
    expect(esProvincia("espana")).toBe(false);
  });

  it("cada zona de la portada enlaza a una página de zona, con coordenadas válidas y su economía sin cifras", () => {
    for (const p of PROVINCIAS) {
      expect(ZONAS.map((z) => z.slug), p.id).toContain(p.zona);
      expect(p.c).toMatch(/^\d+\.\d+°N \d+\.\d+°[EW]$/);
      expect(p.economia).not.toMatch(/\d/);
      expect(p.lugar && p.etiqueta && p.ante).toBeTruthy();
    }
    /* Nombres en valenciano donde se usan así */
    expect(PROVINCIAS.find((p) => p.id === "alcoia")?.nombre).toBe("l'Alcoià");
    expect(PROVINCIAS.find((p) => p.id === "marina-baixa")?.nombre).toBe("la Marina Baixa");
  });

  it("hay 5 fichas de servicios completas, con las soluciones a medida la primera", () => {
    expect(SERVICIOS.map((s) => s.titulo)).toEqual(["Soluciones a medida para tus procesos", "Automatiza tu empresa", "Tu asistente de IA", "Tu web", "IA en tu equipo"]);
    for (const s of SERVICIOS) {
      expect(s.titulo && s.descripcion && s.beneficio).toBeTruthy();
      expect(s.herramientas.length).toBeGreaterThan(0);
    }
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
