import { expect, test } from "@playwright/test";

test("la API de salud responde", async ({ request }) => {
  const r = await request.get("/api/salud");
  expect(r.ok()).toBe(true);
  expect(await r.json()).toMatchObject({ ok: true, version: "1.0.0" });
});

test("la portada lleva las cabeceras de seguridad y la CSP de Astro", async ({ request, page }) => {
  const r = await request.get("/");
  const h = r.headers();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-powered-by"]).toBeUndefined();
  await page.goto("/");
  await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1);
});

test("una ruta inexistente devuelve 404", async ({ request }) => {
  const r = await request.get("/no-existe");
  expect(r.status()).toBe(404);
});
