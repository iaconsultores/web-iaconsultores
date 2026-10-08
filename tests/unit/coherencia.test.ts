import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BENEFICIOS_AGENTIA, MODULOS_AGENTIA } from "../../src/datos/agentia";
import { PROVINCIAS } from "../../src/datos/provincias";
import { SERVICIOS } from "../../src/datos/servicios";

const leer = (ruta: string) => readFileSync(ruta, "utf8");

describe("la web y el asistente dicen lo mismo", () => {
  it("cada servicio de los datos aparece en la sección de servicios", () => {
    const html = leer("src/components/servicios/servicios.html");
    for (const s of SERVICIOS) expect(html).toContain(s.titulo);
  });
  it("los beneficios de Agentia Contable cubren todos sus módulos y aparecen en #agentia", () => {
    const html = leer("src/components/contenido/contenido.html");
    const cubiertos = BENEFICIOS_AGENTIA.flatMap((b) => b.modulos);
    for (const m of MODULOS_AGENTIA) expect(cubiertos).toContain(m.nombre);
    for (const b of BENEFICIOS_AGENTIA) {
      expect(html).toContain(b.titulo);
      for (const nombre of b.modulos) expect(MODULOS_AGENTIA.map((m) => m.nombre)).toContain(nombre);
    }
  });
  it("un beneficio va «en validación» si y solo si usa un módulo en validación, y la web lo muestra", () => {
    const html = leer("src/components/contenido/contenido.html");
    const validando = (b: (typeof BENEFICIOS_AGENTIA)[number]) => MODULOS_AGENTIA.some((m) => m.enValidacion && b.modulos.includes(m.nombre));
    for (const b of BENEFICIOS_AGENTIA) expect(b.enValidacion, b.titulo).toBe(validando(b));
    const seccion = html.slice(html.indexOf('id="agentia"'), html.indexOf("<!-- ===================== 3"));
    expect((seccion.match(/class="ag-valid"/g) ?? []).length).toBe(BENEFICIOS_AGENTIA.filter((b) => b.enValidacion).length);
  });
  it("cada provincia tiene su botón y su escena", () => {
    const html = leer("src/components/portada/portada.html");
    for (const p of PROVINCIAS) {
      expect(html).toContain(`class="prov-chip" data-p="${p.id}"`);
      expect(html).toContain(`data-prov="${p.id}"`);
    }
  });
  it("no quedan restos de las variantes descartadas ni del panel de opciones", () => {
    const todo = ["portada", "panel", "servicios", "flujos", "contenido"]
      .flatMap((s) => [`${s}.html`, `${s}.css`].map((f) => leer(`src/components/${s}/${f}`)))
      .join("\n");
    expect(todo).not.toMatch(/data-(tipo|servicios|fondo)=|data-flujo="plano"|data-json="oscuro"|op-boton|selProvincia/);
  });
});
