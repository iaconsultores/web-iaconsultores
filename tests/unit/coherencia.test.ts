import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROVINCIAS } from "../../src/datos/provincias";
import { SERVICIOS } from "../../src/datos/servicios";
import { CONOCIMIENTO } from "../../src/lib/conocimiento";

const leer = (ruta: string) => readFileSync(ruta, "utf8");

describe("la web y el asistente dicen lo mismo", () => {
  it("cada servicio de los datos aparece en la sección de servicios", () => {
    const html = leer("src/components/servicios/servicios.html");
    for (const s of SERVICIOS) expect(html).toContain(s.titulo);
  });
  it("la web pública y el asistente no nombran el producto anterior ni el servicio de contabilidad como propios", () => {
    const publico = [
      ...["portada", "panel", "servicios", "flujos", "contenido"].flatMap((s) => [`${s}.html`, `${s}.js`].map((f) => `src/components/${s}/${f}`)),
      "src/components/portada/portada-2.js",
      "src/components/Nav.astro",
      "src/components/Pie.astro",
      "src/pages/index.astro",
      "src/datos/sitio.ts",
      "src/datos/servicios.ts",
    ].map(leer).join("\n") + CONOCIMIENTO;
    for (const prohibido of [/Agentia Contable/i, /agentiacontable\.com/i, /contable\.cloud/i, /facturación y contabilidad con IA/i]) {
      expect(publico).not.toMatch(prohibido);
    }
  });
  it("cada zona de la portada tiene su escena, su banda y su sitio en el CSS", () => {
    const css = leer("src/components/portada/portada.css");
    const js = leer("src/components/portada/portada.js") + leer("src/components/portada/portada-2.js");
    for (const p of PROVINCIAS) {
      const ruta = `src/components/portada/escenas/${p.id}.html`;
      expect(existsSync(ruta), ruta).toBe(true);
      expect(leer(ruta)).toContain(`<div class="escena" data-prov="${p.id}" role="img" aria-label="Ilustración`);
      expect(css).toContain(`html[data-provincia="${p.id}"] #portada .escena[data-prov="${p.id}"]`);
      expect(css).toContain(`html[data-provincia="${p.id}"] #portada .banda[data-prov="${p.id}"]`);
      expect(css).toContain(`html[data-provincia="${p.id}"] #portada .pila-prov>[data-p="${p.id}"]`);
      expect(js).toMatch(new RegExp(`\\["${p.id}"|${p.id}(:|,| })`));
    }
    expect(css + js).not.toMatch(/madrid|espana/);
  });
  it("las escenas no repiten identificadores entre sí", () => {
    const ids = PROVINCIAS.flatMap((p) => [...leer(`src/components/portada/escenas/${p.id}.html`).matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("no quedan restos de las variantes descartadas ni del panel de opciones", () => {
    const todo = ["portada", "panel", "servicios", "flujos", "contenido"]
      .flatMap((s) => [`${s}.html`, `${s}.css`].map((f) => leer(`src/components/${s}/${f}`)))
      .join("\n");
    expect(todo).not.toMatch(/data-(tipo|servicios|fondo)=|data-flujo="plano"|data-json="oscuro"|op-boton|selProvincia/);
  });
});
