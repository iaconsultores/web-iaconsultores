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

test("el sitemap lista todas las páginas locales y cada enlace interno de ellas funciona", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>https:\/\/iaconsultores\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  expect(urls).toContain("/consultoria-ia");
  expect(urls).toContain("/soluciones");
  for (const z of ZONAS) expect(urls).toContain(`/consultoria-ia/${z.slug}`);
  for (const s of SOLUCIONES) expect(urls).toContain(`/soluciones/${s.slug}`);
  expect(urls.length).toBe(6 + ZONAS.length + SOLUCIONES.length);

  const enlaces = new Set<string>();
  for (const u of urls.filter((x) => x.startsWith("/consultoria-ia") || x.startsWith("/soluciones"))) {
    const r = await request.get(u);
    expect(r.status(), u).toBe(200);
    for (const [, href] of (await r.text()).matchAll(/href="(\/[^"#]*)/g)) enlaces.add(href);
  }
  for (const href of enlaces) {
    if (href.startsWith("/_astro/")) continue;
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test("la portada lleva a las zonas: sección «Dónde trabajamos», enlace de la columna geo y menú", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('#zonas a[href="/consultoria-ia/vega-baja"]')).toBeVisible();
  await expect(page.locator('#zonas a[href="/consultoria-ia/xabia"]')).toHaveText("Xàbia (Jávea)");
  await expect(page.locator("#portada .dato-enlace")).toHaveAttribute("href", "/consultoria-ia/alicante");
  await page.locator('.prov-chip[data-p="vega-baja"]').click();
  await expect(page.locator("#portada .dato-enlace")).toHaveAttribute("href", "/consultoria-ia/vega-baja");
  await expect(page.locator("#portada .dato-enlace")).toContainText("IA para empresas de la Vega Baja");
  await expect(page.locator('.nav-links a[href="/consultoria-ia"]')).toHaveCount(1);
  await expect(page.locator('.nav-links a[href="/soluciones"]')).toHaveCount(1);
});
