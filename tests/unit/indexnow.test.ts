import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INDEXNOW_CLAVE, SITIO_URL, cuerpoAviso, leerSitemap, seleccionarUrls } from "../../scripts/indexnow.mjs";

const B = "https://iaconsultores.com";

describe("IndexNow", () => {
  it("la clave del script está publicada en public/<clave>.txt", () => {
    expect(INDEXNOW_CLAVE).toMatch(/^[a-f0-9]{32}$/);
    expect(readFileSync(`public/${INDEXNOW_CLAVE}.txt`, "utf8")).toBe(INDEXNOW_CLAVE);
    expect(SITIO_URL).toBe(B);
  });

  it("lee el índice de sitemaps y los sitemaps de URL", () => {
    expect(leerSitemap(`<sitemapindex><sitemap><loc>${B}/sitemap-zonas.xml</loc><lastmod>2026-11-09</lastmod></sitemap></sitemapindex>`)).toEqual({ urls: [], sitemaps: [`${B}/sitemap-zonas.xml`] });
    const { urls } = leerSitemap(`<urlset><url><loc>${B}/</loc><lastmod>2026-11-09</lastmod></url><url><loc>${B}/soluciones</loc><lastmod>2026-11-11</lastmod></url></urlset>`);
    expect(urls).toEqual([{ loc: `${B}/`, lastmod: "2026-11-09" }, { loc: `${B}/soluciones`, lastmod: "2026-11-11" }]);
  });

  it("elige las URL cambiadas, todas o las pedidas, y solo del propio sitio", () => {
    const entradas = [{ loc: `${B}/`, lastmod: "2026-11-09" }, { loc: `${B}/soluciones`, lastmod: "2026-11-11" }];
    expect(seleccionarUrls(entradas, { desde: "2026-11-11" })).toEqual([`${B}/`, `${B}/soluciones`]);
    expect(seleccionarUrls(entradas, { todas: true })).toHaveLength(2);
    expect(seleccionarUrls([], { rutas: ["/", "soluciones", "https://otro.example/x"] })).toEqual([`${B}/`, `${B}/soluciones`]);
    expect(() => seleccionarUrls(entradas, {})).toThrow();
    expect(cuerpoAviso({ urls: [`${B}/`] })).toEqual({ host: "iaconsultores.com", key: INDEXNOW_CLAVE, keyLocation: `${B}/${INDEXNOW_CLAVE}.txt`, urlList: [`${B}/`] });
  });
});
