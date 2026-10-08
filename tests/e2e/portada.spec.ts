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

test("la portada rota sola cada 7,5 s y se pausa con el botón", async ({ page }) => {
  await relojParado(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "alicante");
  await page.clock.runFor(7000);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "alicante");
  await page.clock.runFor(600);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "valencia");
  await page.locator("#portada .pausa").dispatchEvent("click");
  await page.clock.runFor(13_000);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "valencia");
  await page.locator("#portada .pausa").dispatchEvent("click");
  await page.clock.runFor(7600);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "murcia");
});

test("sigue rotando con el ratón encima de la portada", async ({ page }) => {
  /* La portada ocupa casi toda la pantalla: pausar al pasar el ratón la dejaba quieta casi siempre */
  await relojParado(page);
  await page.goto("/");
  const titular = await page.locator("#portada h1").boundingBox();
  if (!titular) throw new Error("sin titular");
  await page.mouse.move(titular.x + titular.width / 2, titular.y + titular.height / 2);
  await page.clock.runFor(7600);
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

test("la primera pantalla no lleva la firma con el nombre", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#portada .firma")).toHaveCount(0);
  await expect(page.locator("#portada")).not.toContainText("Juan Luis Toboso");
});

test("las bandas son un 30 % transparentes, con las paradas opacas", async ({ page }) => {
  await page.goto("/");
  const opacidad = (sel: string) => page.locator(sel).first().evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(await opacidad('#portada .banda[data-prov="alicante"] > svg')).toBeCloseTo(0.7, 2);
  expect(await opacidad('#portada .banda[data-prov="alicante"] .paradas')).toBe(1);
});

test("el dato de la banda va tres veces más despacio que la maqueta: la parada 2 se activa a los 7,8 s", async ({ page }) => {
  await relojParado(page);
  await page.goto("/");
  await page.locator('.prov-chip[data-p="alicante"]').dispatchEvent("click");
  const paradas = page.locator('#portada .banda[data-prov="alicante"] .parada');
  await page.clock.runFor(7400);
  await expect(paradas.nth(0)).toHaveClass(/activo/);
  await page.clock.runFor(800);
  await expect(paradas.nth(1)).toHaveClass(/activo/);
});

test("el recorrido de la banda sigue al cambiar de ciudad, sin volver a empezar", async ({ page }) => {
  await relojParado(page);
  await page.goto("/");
  await page.clock.runFor(7600);
  await expect(page.locator("html")).toHaveAttribute("data-provincia", "valencia");
  await page.clock.runFor(600);
  await expect(page.locator('#portada .banda[data-prov="valencia"] .parada').nth(1)).toHaveClass(/activo/);
});

test.describe("en una pantalla de 1920×1080", () => {
  test.use({ viewport: { width: 1920, height: 1080 } });
  test.skip(({ isMobile }) => isMobile, "solo escritorio");
  test("la banda baja unos 100 px y sus paradas siguen alineadas con el contenido", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => {
      const c = document.querySelector("#portada .contenedor")!, cs = getComputedStyle(c), r = c.getBoundingClientRect();
      const izq = r.left + parseFloat(cs.paddingLeft), ancho = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const medalla = document.querySelector('#portada .banda[data-prov="alicante"] .parada .medalla')!.getBoundingClientRect();
      return { arriba: document.querySelector("#portada .bandas")!.getBoundingClientRect().top, esperado: izq + ancho * 0.12, medalla: medalla.left + medalla.width / 2 };
    });
    expect(m.arriba).toBeGreaterThanOrEqual(830);
    expect(Math.abs(m.medalla - m.esperado)).toBeLessThan(4);
  });
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
