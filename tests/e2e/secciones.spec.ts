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

test("las descripciones de los servicios tienen el mismo formato que la entradilla de la portada", async ({ page }) => {
  await page.goto("/");
  const estilos = await page.locator("#servicios .t-desc").evaluateAll((els) => [
    ...new Set(els.map((el) => `${getComputedStyle(el).fontSize} ${getComputedStyle(el).color}`)),
  ]);
  expect(estilos).toEqual(["16.2px rgb(71, 76, 88)"]);
});

test("las listas en gris de la portada y de /mohure usan el mismo gris más oscuro que la entradilla", async ({ page }) => {
  const colores = async (selectores: string[]) =>
    page.evaluate((sel) => Object.fromEntries(sel.map((s) => {
      const els = [...document.querySelectorAll(s)];
      return [s, els.length ? [...new Set(els.map((el) => getComputedStyle(el).color))].join(" | ") : "sin elementos"];
    })), selectores);
  const gris = "rgb(71, 76, 88)";
  await page.goto("/");
  const portada = ["#que-hacemos li small", "#sobre-mi .pru-etq", "#sobre-mi .sm-grupo li span", "#contacto .ct-check"];
  expect(await colores(portada)).toEqual(Object.fromEntries(portada.map((s) => [s, gris])));
  await page.goto("/mohure");
  const mohure = [".cv-pantalla li", ".mh-prueba-lista li"];
  expect(await colores(mohure)).toEqual(Object.fromEntries(mohure.map((s) => [s, gris])));
});

test("los enlaces del menú usan el gris más oscuro, sin cambiar su tamaño", async ({ page }) => {
  await page.goto("/");
  const estilos = await page.locator(".nav-links a").evaluateAll((els) => [
    ...new Set(els.map((el) => `${getComputedStyle(el).fontSize} ${getComputedStyle(el).color}`)),
  ]);
  expect(estilos).toEqual(["15px rgb(71, 76, 88)"]);
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

test("los servicios empiezan por las soluciones a medida, a todo el ancho, y no nombran el producto anterior", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#agentia")).toHaveCount(0);
  await expect(page.locator('.nav-links a[href="/#agentia"]')).toHaveCount(0);
  await expect(page.locator("#servicios .t-tit")).toHaveText(["Soluciones a medida para tus procesos", "Automatiza tu empresa", "Tu asistente de IA", "Tu web", "IA en tu equipo"]);
  const anchos = await page.locator("#servicios .tarjeta").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  expect(anchos[0]).toBeGreaterThan(anchos[1] * 1.5);
  for (const t of ["CRM a medida", "Documentos con IA", "Facturación automatizada", "Informes y cuadros de mando"]) await expect(page.locator("#servicios .tarjeta").first()).toContainText(t);
  await expect(page.locator("#servicios")).toContainText("cursos de IA adaptados a tu empresa y a tus empleados");
  await expect(page.locator("#como-trabajamos .ct-tab")).toHaveCount(4);
  await expect(page.locator("#panel .pnl-t")).toHaveCount(6);
  const texto = await page.locator("main").innerText();
  for (const prohibido of ["Agentia Contable", "agentiacontable.com", "contable.cloud"]) expect(texto, prohibido).not.toContain(prohibido);
  await expect(page.locator("#que-hacemos .qh-no")).toContainText("No somos una agencia de marketing");
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
  for (const dato of ["+10", "+1.000", "+50", "finalización prevista en octubre de 2026"]) await expect(bloque).toContainText(dato);
  await expect(bloque.locator(".pru-item")).toHaveCount(4);
  await expect(bloque).toContainText("de gestión con IA, diseñada y dirigida de principio a fin");
  expect(texto).not.toContain("agentiacontable.com");
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
