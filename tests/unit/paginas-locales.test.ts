import { describe, expect, it } from "vitest";
import { ZONAS, zona } from "../../src/datos/zonas";
import { SOLUCIONES } from "../../src/datos/soluciones";
import { h1Zona, jsonServicioZona, migasZona, minutosLectura, nombreConAlt, nombreCorto, solucionesParaZona, tituloZona } from "../../src/lib/paginas-locales";

const z = (slug: string) => zona(slug)!;

describe("páginas locales", () => {
  it("nombra cada zona como se busca: el nombre y, si cambia algo más que una tilde, el otro entre paréntesis", () => {
    expect(nombreConAlt(z("xabia"))).toBe("Xàbia (Jávea)");
    expect(nombreConAlt(z("alcoi"))).toBe("Alcoi (Alcoy)");
    expect(nombreConAlt(z("denia"))).toBe("Dénia");
    expect(nombreConAlt(z("gandia"))).toBe("Gandia");
    expect(nombreConAlt(z("benidorm"))).toBe("Benidorm");
  });

  it("título, H1 y migas de una zona", () => {
    expect(tituloZona(z("elche"))).toBe("Consultoría de IA y automatización en Elche (Elx) | IA Consultores");
    expect(h1Zona(z("vega-baja"))).toBe("IA y automatización para empresas de la Vega Baja (el Baix Segura)");
    expect(h1Zona(z("baix-vinalopo"))).toBe("IA y automatización para empresas del Baix Vinalopó");
    expect(migasZona(z("elche")).map((m) => m.nombre)).toEqual(["Inicio", "Zonas", "Provincia de Alicante", "Baix Vinalopó", "Elche"]);
    expect(migasZona(z("murcia")).map((m) => m.ruta)).toEqual(["/", "/consultoria-ia", "/consultoria-ia/region-de-murcia", "/consultoria-ia/murcia"]);
    expect(nombreCorto(z("alacanti"))).toBe("L'Alacantí");
  });

  it("todas las zonas tienen al menos un artículo que enseñar, y todos los artículos salen en alguna zona", () => {
    for (const x of ZONAS) expect(solucionesParaZona(x).length, x.slug).toBeGreaterThan(0);
    const enZonas = new Set(ZONAS.flatMap((x) => solucionesParaZona(x).map((s) => s.slug)));
    for (const s of SOLUCIONES) expect(enZonas, s.slug).toContain(s.slug);
  });

  it("los datos estructurados llevan el domicilio social de Orihuela y el NIF, como el aviso legal", () => {
    const j = jsonServicioZona(z("torrevieja"), "Descripción") as { address: Record<string, string>; areaServed: { name: string }; taxID: string; legalName: string };
    expect(j.address).toEqual({ "@type": "PostalAddress", streetAddress: "Avda. Teodomiro 30, Entlo. B", postalCode: "03300", addressLocality: "Orihuela", addressRegion: "Alicante", addressCountry: "ES" });
    expect(j.taxID).toBe("B05723184");
    expect(j.legalName).toBe("Agentia Codex S.L.");
    expect(j.areaServed.name).toBe("Torrevieja");
  });

  it("calcula los minutos de lectura", () => {
    expect(minutosLectura("palabra ".repeat(1000))).toBe(5);
    expect(minutosLectura("hola")).toBe(1);
  });

  it("la visita en persona solo se promete a menos de hora y media", () => {
    for (const x of ZONAS) {
      if (x.slug === "provincia-de-valencia" || x.slug === "provincia-de-albacete" || x.slug === "region-de-murcia") expect(x.visita).toBe("parcial");
      else expect(x.visita, x.slug).toBe("si");
    }
  });
});
