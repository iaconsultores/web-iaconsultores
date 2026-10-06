import { expect, test } from "@playwright/test";

test("la página base carga con menú, pie, fuentes propias y sin peticiones externas", async ({ page }) => {
  const errores: string[] = [];
  const externas: string[] = [];
  const fuentes: string[] = [];
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errores.push(m.text());
  });
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.hostname !== "127.0.0.1") externas.push(u.hostname);
    if (r.resourceType() === "font") fuentes.push(u.pathname);
  });
  await page.goto("/");
  await expect(page.locator("header.nav .logo")).toContainText("IA Consultores");
  await expect(page.locator("footer.pie")).toContainText("Agentia Codex S.L.");
  await expect(page.locator('footer.pie a[href="/privacidad"]')).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
  expect(fuentes.some((f) => f.startsWith("/_astro/") && f.endsWith(".woff2"))).toBe(true);
  expect(externas).toEqual([]);
  expect(errores).toEqual([]);
});
