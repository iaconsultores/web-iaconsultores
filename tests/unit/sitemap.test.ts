import { describe, expect, it } from "vitest";
import { PAGINAS_FIJAS, masReciente, xmlIndice, xmlUrlset } from "../../src/lib/sitemap";

describe("sitemaps", () => {
  it("cada URL lleva su loc absoluta y su lastmod, ordenadas y sin priority ni changefreq", () => {
    const xml = xmlUrlset([{ ruta: "/soluciones", lastmod: "2026-11-09" }, { ruta: "/", lastmod: "2026-11-01" }]);
    expect(xml).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        "  <url>\n    <loc>https://iaconsultores.com/</loc>\n    <lastmod>2026-11-01</lastmod>\n  </url>\n" +
        "  <url>\n    <loc>https://iaconsultores.com/soluciones</loc>\n    <lastmod>2026-11-09</lastmod>\n  </url>\n</urlset>\n",
    );
  });
  it("el índice apunta a cada sitemap con la fecha más reciente de sus páginas", () => {
    const xml = xmlIndice([{ archivo: "sitemap-zonas.xml", lastmod: masReciente([{ ruta: "/a", lastmod: "2026-10-05" }, { ruta: "/b", lastmod: "2026-11-09" }]) }]);
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain("<loc>https://iaconsultores.com/sitemap-zonas.xml</loc>\n    <lastmod>2026-11-09</lastmod>");
  });
  it("las páginas fijas son solo las indexables, con fechas válidas", () => {
    expect(PAGINAS_FIJAS.map((p) => p.ruta)).toEqual(["/", "/consultoria-ia", "/soluciones", "/aviso-legal", "/privacidad", "/cookies"]);
    for (const p of PAGINAS_FIJAS) expect(p.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
