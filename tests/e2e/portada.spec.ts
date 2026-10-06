import { expect, test, type Page } from "@playwright/test";

const PROVINCIAS = ["alicante", "valencia", "murcia", "albacete", "madrid", "espana"];

/* Reloj parado antes de cargar: la rotación (cada 3 s) solo avanza con runFor, tarde lo que tarde cada paso de la prueba */
async function relojParado(page: Page) {
  await page.clock.install({ time: new Date("2026-10-06T10:00:00") });
  await page.clock.pauseAt(new Date("2026-10-06T10:00:01"));
}

test("la portada carga sin errores ni desbordamiento con las 6 provincias", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errores.push(m.text());
  });
  await page.goto("/");
  await expect(page.locator("#portada h1")).toContainText("Inteligencia artificial para empresas reales en");
  for (const p of PROVINCIAS) {
    await page.locator(`.prov-chip[data-p="${p}"]`).click();
    await expect(page.locator("html")).toHaveAttribute("data-provincia", p);
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(desborde, `desbordamiento con ${p}`).toBe(0);
  }
  expect(errores).toEqual([]);
});

test("el bloque del titular no cambia de alto entre provincias", async ({ page }) => {
  await page.goto("/");
  const altos = new Set<number>();
  for (const p of PROVINCIAS) {
    await page.locator(`.prov-chip[data-p="${p}"]`).click();
    await page.waitForTimeout(700);
    const caja = await page.locator("#portada h1").boundingBox();
    altos.add(Math.round(caja?.height ?? -1));
  }
  expect(altos.size).toBe(1);
});

test("la portada rota sola cada 3 s y se pausa con el botón", async ({ page }) => {
  await relojParado(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "alicante");
  await page.clock.runFor(3100);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "valencia");
  await page.locator("#portada .pausa").dispatchEvent("click");
  await page.clock.runFor(13_000);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "valencia");
  await page.locator("#portada .pausa").dispatchEvent("click");
  await page.clock.runFor(3100);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "murcia");
});

test("sigue rotando con el ratón encima de la portada", async ({ page }) => {
  /* La portada ocupa casi toda la pantalla: pausar al pasar el ratón la dejaba quieta casi siempre */
  await relojParado(page);
  await page.goto("/");
  const titular = await page.locator("#portada h1").boundingBox();
  if (!titular) throw new Error("sin titular");
  await page.mouse.move(titular.x + titular.width / 2, titular.y + titular.height / 2);
  await page.clock.runFor(3100);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "valencia");
});

test("al elegir una provincia la portada se queda fija", async ({ page }) => {
  await relojParado(page);
  await page.goto("/");
  await page.locator('.prov-chip[data-p="madrid"]').dispatchEvent("click");
  await page.clock.runFor(20_000);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "madrid");
  await expect(page.locator('.prov-chip[data-p="madrid"]')).toHaveAttribute("aria-pressed", "true");
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });
  test("no rota", async ({ page }) => {
    await relojParado(page);
    await page.goto("/");
    await page.clock.runFor(20_000);
    await expect(page.locator("html")).toHaveAttribute("data-provincia", "alicante");
  });
});
