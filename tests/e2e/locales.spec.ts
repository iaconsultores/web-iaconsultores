import { expect, test } from "@playwright/test";
import { ZONAS } from "../../src/datos/zonas";
import { SOLUCIONES } from "../../src/datos/soluciones";

test("una página de municipio: título, migas, ficha, texto, soluciones y datos estructurados", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(e.message));
  await page.goto("/consultoria-ia/elche");
  await expect(page).toHaveTitle("Consultoría de IA y automatización en Elche (Elx) | IA Consultores");
  await expect(page.locator("h1")).toHaveText("IA y automatización para empresas de Elche (Elx)");
  await expect(page.locator(".migas li")).toHaveText(["Inicio", "Zonas", "Provincia de Alicante", "Baix Vinalopó", "Elche"]);
  await expect(page.locator(".ficha")).toContainText("A unos 25 minutos de Alicante");
  await expect(page.locator(".prosa h2").first()).toBeVisible();
  await expect(page.locator(".tarjeta-sol").first()).toBeVisible();
  await expect(page.locator('.cta-local a[href="/#contacto"]')).toBeVisible();
  const tipos = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")["@type"]));
  expect(tipos).toEqual(["BreadcrumbList", "ProfessionalService"]);
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(desborde).toBe(0);
  expect(errores).toEqual([]);
});

test("un artículo de soluciones avisa de que son ejemplos y enlaza sus zonas", async ({ page }) => {
  await page.goto("/soluciones/ia-fabricas-calzado-elche");
  await expect(page.locator("h1")).toHaveText("IA y automatización para fábricas de calzado en Elche");
  await expect(page.locator(".nota-ejemplos")).toContainText("no casos de clientes");
  await expect(page.locator('.ficha a[href="/consultoria-ia/elche"]')).toBeVisible();
  const tipos = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")["@type"]));
  expect(tipos).toEqual(["BreadcrumbList", "Article"]);
});

test("los índices enlazan todas las zonas y todas las soluciones", async ({ page }) => {
  await page.goto("/consultoria-ia");
  for (const z of ZONAS) {
    await expect(page.locator(`main a[href="/consultoria-ia/${z.slug}"]`).first(), z.slug).toBeAttached();
  }
  await page.goto("/soluciones");
  await expect(page.locator(".tarjeta-sol")).toHaveCount(SOLUCIONES.length);
});

test("el índice de sitemaps enlaza un sitemap por tipo, con lastmod, y cada enlace interno de las páginas locales funciona", async ({ request }) => {
  const indice = await request.get("/sitemap.xml");
  expect(indice.headers()["content-type"]).toContain("xml");
  const xmlIndice = await indice.text();
  expect(xmlIndice).toContain("<sitemapindex");
  const hijos = [...xmlIndice.matchAll(/<loc>https:\/\/iaconsultores\.com(\/[^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(hijos).toEqual(["/sitemap-paginas.xml", "/sitemap-zonas.xml", "/sitemap-soluciones.xml"]);
  expect(xmlIndice.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)).toHaveLength(3);

  const urls: string[] = [];
  for (const h of hijos) {
    const xml = await (await request.get(h)).text();
    expect(xml).toContain("<urlset");
    const locs = [...xml.matchAll(/<loc>https:\/\/iaconsultores\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
    expect(xml.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)?.length, h).toBe(locs.length);
    expect(xml).not.toMatch(/<priority>|<changefreq>/);
    urls.push(...locs);
  }
  expect(urls).toContain("/");
  expect(urls).toContain("/consultoria-ia");
  expect(urls).toContain("/soluciones");
  expect(urls.some((u) => u.startsWith("/mohure") || u.startsWith("/api"))).toBe(false);
  for (const z of ZONAS) expect(urls).toContain(`/consultoria-ia/${z.slug}`);
  for (const s of SOLUCIONES) expect(urls).toContain(`/soluciones/${s.slug}`);
  expect(urls.length).toBe(6 + ZONAS.length + SOLUCIONES.length);
  expect(new Set(urls).size).toBe(urls.length);

  /* Cada URL del sitemap es indexable: 200, sin noindex y con canónica a sí misma */
  const enlaces = new Set<string>();
  for (const u of urls) {
    const r = await request.get(u);
    expect(r.status(), u).toBe(200);
    expect(r.headers()["x-robots-tag"], u).toBeUndefined();
    const html = await r.text();
    expect(html, u).not.toContain('name="robots"');
    expect(html, u).toContain(`<link rel="canonical" href="https://iaconsultores.com${u === "/" ? "/" : u}">`);
    if (u.startsWith("/consultoria-ia") || u.startsWith("/soluciones")) for (const [, href] of html.matchAll(/href="(\/[^"#]*)/g)) enlaces.add(href);
  }
  for (const href of enlaces) {
    if (href.startsWith("/_astro/")) continue;
    expect((await request.get(href)).status(), href).toBe(200);
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://iaconsultores.com/sitemap.xml");
  expect(robots).not.toMatch(/Disallow: \/\s*$/m);
});

test("la portada lleva a las zonas: sección «Dónde trabajamos», enlace de la columna geo y menú", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('#zonas a[href="/consultoria-ia/vega-baja"]')).toBeVisible();
  await expect(page.locator('#zonas a[href="/consultoria-ia/xabia"]')).toHaveText("Xàbia");
  await expect(page.locator("#portada .dato-enlace")).toHaveAttribute("href", "/consultoria-ia/alicante");
  await page.locator('.prov-chip[data-p="vega-baja"]').click();
  await expect(page.locator("#portada .dato-enlace")).toHaveAttribute("href", "/consultoria-ia/vega-baja");
  await expect(page.locator("#portada .dato-enlace")).toContainText("IA para empresas de la Vega Baja");
  await expect(page.locator('.nav-links a[href="/consultoria-ia"]')).toHaveCount(1);
  await expect(page.locator('.nav-links a[href="/soluciones"]')).toHaveCount(1);
});
