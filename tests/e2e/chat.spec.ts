import { expect, test } from "@playwright/test";

async function abrirYPreguntar(page: import("@playwright/test").Page, texto: string) {
  await page.goto("/");
  await page.locator("#chatAbrir").click();
  await page.locator("#chatInput").fill(texto);
  await page.locator("#chatInput").press("Enter");
}

test("responde en streaming (simulado) y bloquea el campo mientras responde", async ({ page }) => {
  await page.goto("/");
  await page.locator("#chatAbrir").click();
  /* La respuesta simulada tarda milisegundos: el bloqueo se comprueba en el mismo instante del envío */
  const bloqueado = await page.evaluate(() => {
    const campo = document.getElementById("chatInput") as HTMLInputElement;
    campo.value = "Hola, tengo una asesoría";
    (document.getElementById("chatForm") as HTMLFormElement).requestSubmit();
    return campo.disabled;
  });
  expect(bloqueado).toBe(true);
  /* Suele ser la primera petición al chat del servidor recién arrancado: puede pasar de los 5 s por defecto */
  await expect(page.locator("#chatCuerpo .ch-bot").last()).toContainText("Respuesta simulada", { timeout: 15_000 });
  await expect(page.locator("#chatInput")).toBeEnabled();
});

test("propone la llamada y la tarjeta envía una sola solicitud", async ({ page }) => {
  let peticiones = 0;
  page.on("request", (r) => {
    if (r.url().endsWith("/api/lead")) peticiones++;
  });
  await abrirYPreguntar(page, "Quiero una llamada");
  const tarjeta = page.locator(".ch-tarjeta");
  /* Con n8n y Docker en marcha en el mismo PC, la respuesta simulada puede tardar más de 5 s en llegar */
  await expect(tarjeta).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(3100);
  await tarjeta.locator('input[name="nombre"]').fill("Ana");
  await tarjeta.locator('input[name="telefono"]').fill("678 310 660");
  await tarjeta.locator('input[name="privacidad"]').check();
  await tarjeta.locator(".ch-enviar").dblclick();
  await expect(page.locator("#chatCuerpo")).toContainText("Solicitud enviada");
  expect(peticiones).toBe(1);
});

test("la tarjeta cuenta el tiempo desde que se abrió el chat, no desde que aparece", async ({ page }) => {
  /* Con autocompletado se rellena en menos de 3 s; si t se mide desde la tarjeta, el servidor lo toma por un bot */
  let cuerpo: { t?: number } = {};
  await page.route("**/api/lead", async (ruta) => {
    cuerpo = JSON.parse(ruta.request().postData() ?? "{}");
    await ruta.fulfill({ json: { ok: true } });
  });
  await page.goto("/");
  await page.locator("#chatAbrir").click();
  await page.waitForTimeout(3100);
  await page.locator("#chatInput").fill("Quiero una llamada");
  await page.locator("#chatInput").press("Enter");
  const tarjeta = page.locator(".ch-tarjeta");
  await expect(tarjeta).toBeVisible();
  await tarjeta.locator('input[name="nombre"]').fill("Ana");
  await tarjeta.locator('input[name="telefono"]').fill("678 310 660");
  await tarjeta.locator('input[name="privacidad"]').check();
  await tarjeta.locator(".ch-enviar").click();
  await expect(page.locator("#chatCuerpo")).toContainText("Solicitud enviada");
  expect(cuerpo.t).toBeGreaterThanOrEqual(3000);
});

test("un lector de pantalla oye cada respuesta una vez y completa, no cada trozo", async ({ page }) => {
  await abrirYPreguntar(page, "Hola, tengo una asesoría");
  await expect(page.locator("#chatInput")).toBeEnabled();
  expect(await page.locator("#chatCuerpo").getAttribute("aria-live")).toBeNull();
  const anuncio = page.locator("#chatAnuncio");
  await expect(anuncio).toHaveAttribute("aria-live", "polite");
  await expect(anuncio.locator("p")).toHaveText([/^Respuesta simulada del asistente de IA Consultores a: «Hola, tengo una asesoría»\.$/]);
});

test("al proponer la llamada se anuncia la respuesta y después la tarjeta", async ({ page }) => {
  await abrirYPreguntar(page, "Quiero una llamada");
  await expect(page.locator(".ch-tarjeta")).toBeVisible();
  await expect(page.locator("#chatAnuncio p")).toHaveText([/^Te propongo una llamada/, /^Te proponemos una llamada de diagnóstico/]);
});

test("una palabra larguísima no desborda la pantalla", async ({ page }) => {
  await abrirYPreguntar(page, "a".repeat(300));
  await expect(page.locator("#chatCuerpo .ch-bot").last()).toContainText("Respuesta simulada");
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(desborde).toBe(0);
});

test("si se corta la conexión muestra lo recibido y un aviso", async ({ page }) => {
  await page.route("**/api/chat", (ruta) =>
    ruta.fulfill({
      status: 200,
      headers: { "content-type": "text/event-stream; charset=utf-8" },
      body: 'event: conversacion\ndata: {"id":"00000000-0000-4000-8000-000000000000","nueva":true}\n\nevent: texto\ndata: {"t":"Hola, "}\n\n',
    }),
  );
  await abrirYPreguntar(page, "Hola");
  await expect(page.locator("#chatCuerpo .ch-bot").last()).toContainText("Hola,");
  await expect(page.locator("#chatCuerpo")).toContainText("Se ha cortado la conexión");
});
