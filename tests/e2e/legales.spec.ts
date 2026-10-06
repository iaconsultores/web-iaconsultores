import { expect, test } from "@playwright/test";

test("las páginas legales identifican al titular", async ({ page }) => {
  await page.goto("/aviso-legal");
  await expect(page.locator("main")).toContainText("Agentia Codex S.L.");
  await expect(page.locator("main")).toContainText("NIF: pendiente de asignación");
  await expect(page.locator("main")).toContainText("Avda. Teodomiro 30, Entlo. B, 03300 Orihuela (Alicante)");
  await expect(page.locator("main")).toContainText("constituida ante notario");
  await page.goto("/privacidad");
  await expect(page.locator("main")).toContainText("Anthropic");
  await expect(page.locator("main")).toContainText("Agencia Española de Protección de Datos");
  await page.goto("/cookies");
  await expect(page.locator("main")).toContainText("no usa cookies");
});

test("404 propia, sitemap, robots, imagen social y datos estructurados", async ({ page, request }) => {
  const r = await request.get("/no-existe");
  expect(r.status()).toBe(404);
  expect(await r.text()).toContain("Esta página no existe");
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  expect((await request.get("/og.png")).headers()["content-type"]).toContain("image/png");
  await page.goto("/");
  await expect(page).toHaveTitle("Inteligencia artificial para empresas reales | IA Consultores");
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld ?? "{}")["@type"]).toBe("ProfessionalService");
});

test("la portada y el CV citan las más de 50 webs y el inglés C1-C2", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#sobre-mi")).toContainText("Más de 50 webs");
  await expect(page.locator("#sobre-mi")).toContainText("nivel muy alto (C1-C2)");
  await expect(page.locator("#sobre-mi")).toContainText("finalización prevista en octubre de 2026");
  await expect(page.locator("#pruebas")).toContainText("Formación técnica · en curso");
  await page.goto("/mohure/cv");
  await expect(page.locator("main")).toContainText("Más de 50 webs");
  await expect(page.locator("main")).toContainText("Inglés: nivel muy alto (C1-C2)");
  await expect(page.locator("main")).toContainText("finalización prevista en octubre de 2026");
});
