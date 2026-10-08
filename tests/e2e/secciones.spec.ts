import { expect, test, type Page } from "@playwright/test";

/* Ajustes de la portada pedidos por Juan Luis el 8-oct-2026 */

async function relojParado(page: Page) {
  await page.clock.install({ time: new Date("2026-10-08T10:00:00") });
  await page.clock.pauseAt(new Date("2026-10-08T10:00:01"));
}

test("«Así trabaja una automatización» va más despacio: el paso 2 llega a los 2,1 s y no a los 1,5 s", async ({ page }) => {
  await relojParado(page);
  await page.goto("/");
  await page.locator("#como-trabajamos .ct-paso").first().scrollIntoViewIfNeeded();
  await page.clock.runFor(100);
  const estado = page.locator("#como-trabajamos .ct-res-paso").first();
  await page.clock.runFor(1800);
  await expect(estado).toContainText("Paso 1 de");
  await page.clock.runFor(500);
  await expect(estado).toContainText("Paso 2 de");
});

test("«Los informáticos no entienden mi negocio» va en una sola línea y sin hueco extra", async ({ page }) => {
  await page.goto("/");
  const frase = page.locator("#por-que .pq-frase");
  const { alto, linea } = await frase.evaluate((el) => ({ alto: el.getBoundingClientRect().height, linea: parseFloat(getComputedStyle(el).lineHeight) }));
  expect(alto).toBeLessThan(linea * 1.5);
  const hueco = await page.evaluate(() => {
    const cita = document.querySelector("#por-que .pq-cita")!.getBoundingClientRect();
    const respuesta = document.querySelector("#por-que .pq-respuesta")!.getBoundingClientRect();
    return respuesta.top - cita.bottom;
  });
  expect(hueco).toBeLessThan(60);
});

test("Agentia Contable muestra beneficios en vez de interruptores de módulos", async ({ page }) => {
  await page.goto("/");
  const agentia = page.locator("#agentia");
  await expect(agentia.locator('[role="switch"]')).toHaveCount(0);
  await expect(agentia.locator(".ag-beneficios li")).toHaveCount(6);
  await expect(agentia.locator(".ag-beneficios")).toContainText("Facturas que se registran solas");
  await expect(agentia.locator(".ag-valid")).toHaveCount(2);
});

test("«Quién dirige tu proyecto» y «Sobre mí» son un solo bloque, sin el nombre ni datos repetidos", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#pruebas")).toHaveCount(0);
  const bloque = page.locator("#sobre-mi");
  await expect(bloque).toContainText("Quién dirige tu proyecto");
  await expect(bloque.locator("h2")).toHaveText("Juan Luis Toboso, el director de orquesta");
  const texto = (await bloque.innerText()).replace(/\s+/g, " ");
  for (const frase of ["Juan Luis Toboso", "Máster", "Director financiero", "Economista", "50 webs", "asesor fiscal"])
    expect(texto.split(frase).length - 1, frase).toBe(1);
  for (const dato of ["+10", "+1.000", "agentiacontable.com", "finalización prevista en octubre de 2026"]) await expect(bloque).toContainText(dato);
});

test.describe("en una pantalla de 1920×1080", () => {
  test.use({ viewport: { width: 1920, height: 1080 } });
  /* Los textos legales conservan su columna de lectura de 820 px (párrafos de 72 caracteres como máximo) */
  test("el contenido ocupa en torno al 65 % del ancho, en la portada y en /mohure", async ({ page }) => {
    for (const ruta of ["/", "/mohure"]) {
      await page.goto(ruta);
      const pct = await page.locator("main .contenedor").first().evaluate((c) => {
        const cs = getComputedStyle(c);
        return ((c.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / innerWidth) * 100;
      });
      expect(pct, ruta).toBeGreaterThan(64);
      expect(pct, ruta).toBeLessThan(66);
    }
  });
});

test("«¿Colaboramos?» es compacto: título y texto en la misma fila", async ({ page }) => {
  await page.goto("/");
  const colabora = page.locator("#colabora");
  expect(await colabora.evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(440);
  const desfase = await page.evaluate(() => {
    const t = document.querySelector("#colabora .co-titulo")!.getBoundingClientRect();
    const p = document.querySelector("#colabora .co-texto")!.getBoundingClientRect();
    return Math.abs(p.top - t.top);
  });
  expect(desfase).toBeLessThan(40);
});

test("el bloque de la llamada gratuita es compacto", async ({ page }) => {
  await page.goto("/");
  const contacto = page.locator("#contacto");
  expect(await contacto.evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(680);
  const { alto, linea } = await contacto.locator(".titulo-seccion").evaluate((el) => ({ alto: el.getBoundingClientRect().height, linea: parseFloat(getComputedStyle(el).lineHeight) }));
  expect(alto).toBeLessThan(linea * 2.5);
});
