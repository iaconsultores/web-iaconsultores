import { expect, test } from "@playwright/test";

test("/mohure no se indexa y muestra la matriz honesta", async ({ page, request }) => {
  const r = await request.get("/mohure");
  expect(r.status()).toBe(200);
  expect(r.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  await page.goto("/mohure");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator(".mz-fila", { hasText: "Automatización con Make o n8n" })).toContainText("Formación + proyecto propio");
  await expect(page.locator(".mz-fila", { hasText: "GoHighLevel" })).toContainText("Sin experiencia aún");
  await expect(page.locator(".mz-fila", { hasText: "APIs REST" })).toContainText("Experiencia real");
  await expect(page.locator(".mz-fila", { hasText: "VPS" })).toContainText("Experiencia real");
});

test("el título de la oferta va seguido de un resumen con los nombres completos", async ({ page }) => {
  await page.goto("/mohure");
  await expect(page.locator("h1")).toHaveText("Consultor/a Técnico/a Freelance de IA y Automatización");
  const resumen = page.locator(".mh-resumen");
  for (const texto of [
    "Economista",
    "Administración y Dirección de Empresas",
    "asesor fiscal",
    "Postgrado en Dirección y Gestión de Proyectos Empresariales",
    "Máster en IA Aplicada y Optimización de Procesos Productivos",
    "finalización prevista en octubre de 2026",
  ])
    await expect(resumen).toContainText(texto);
});

test("el CV se ve en pantalla, antes de la matriz y sin descargarlo", async ({ page }) => {
  await page.goto("/mohure");
  const cv = page.locator("#cv");
  await expect(cv).toBeVisible();
  for (const texto of ["Experiencia", "Formación", "Agentia Contable", "Más de 50 webs", "Claude Code y Codex principalmente", "finalización prevista en octubre de 2026"])
    await expect(cv).toContainText(texto);
  const antesDeLaMatriz = await page.evaluate(() => {
    const cv = document.getElementById("cv");
    const matriz = document.getElementById("matriz");
    return Boolean(cv && matriz && cv.compareDocumentPosition(matriz) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(antesDeLaMatriz).toBe(true);
  await expect(page.locator("h1")).toHaveCount(1);
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(desborde).toBe(0);
});

test("las cifras clave van bajo el resumen y antes del CV", async ({ page }) => {
  await page.goto("/mohure");
  const cifras = page.locator(".mh-cifras");
  for (const texto of ["+10", "+1.000", "35", "29", "+50"]) await expect(cifras).toContainText(texto);
  const enOrden = await page.evaluate(() => {
    const [resumen, cifras, cv] = [".mh-resumen", ".mh-cifras", "#cv"].map((s) => document.querySelector(s));
    const antes = (a: Element | null, b: Element | null) => Boolean(a && b && a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    return antes(resumen, cifras) && antes(cifras, cv);
  });
  expect(enOrden).toBe(true);
});

test("«Esta página es la prueba» enlaza al código público, entre el CV y la matriz", async ({ page }) => {
  await page.goto("/mohure");
  const prueba = page.locator("#prueba");
  await expect(prueba.locator("h2")).toHaveText("Esta página es la prueba");
  await expect(prueba.locator('a[href="https://github.com/iaconsultores/web-iaconsultores"]')).toBeVisible();
  await expect(prueba).toContainText("programados con agentes de IA (Claude Code)");
  await expect(prueba.locator('a[href="https://github.com/iaconsultores/web-iaconsultores/tree/main/automatizaciones/n8n"]')).toBeVisible();
  const enOrden = await page.evaluate(() => {
    const [cv, prueba, matriz] = ["#cv", "#prueba", "#matriz"].map((s) => document.querySelector(s));
    const antes = (a: Element | null, b: Element | null) => Boolean(a && b && a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    return antes(cv, prueba) && antes(prueba, matriz);
  });
  expect(enOrden).toBe(true);
});

test("sin la sección de encaje ni su API", async ({ page, request }) => {
  await page.goto("/mohure");
  await expect(page.locator("#encaje")).toHaveCount(0);
  const r = await request.post("/api/encaje", { headers: { origin: "http://127.0.0.1:4329" }, data: { oferta: "x".repeat(300) } });
  expect(r.status()).toBe(404);
});

test("el CV en PDF se descarga y no se indexa", async ({ request }) => {
  const r = await request.get("/cv/juan-luis-toboso-consultor-ia.pdf");
  expect(r.status()).toBe(200);
  expect(r.headers()["content-type"]).toContain("application/pdf");
  expect(r.headers()["x-robots-tag"]).toBe("noindex, nofollow");
});

test("/mohure no aparece en el sitemap", async ({ request }) => {
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("mohure");
});
