import { expect, test } from "@playwright/test";

test("el formulario indica los datos que faltan", async ({ page }) => {
  await page.goto("/#contacto");
  await page.locator("#contacto button[type=submit]").click();
  await expect(page.locator("#contacto .ct-estado")).toContainText("Para llamarte necesitamos tu nombre");
});

test("envía una sola solicitud aunque se pulse dos veces", async ({ page }) => {
  let peticiones = 0;
  page.on("request", (r) => {
    if (r.url().endsWith("/api/lead")) peticiones++;
  });
  await page.goto("/#contacto");
  await page.waitForTimeout(3100);
  await page.fill("#ct-nombre", "José Ñúñez 😀");
  await page.fill("#ct-telefono", "+34 678 31 06 60");
  await page.fill("#ct-proceso", "Registrar facturas de proveedores");
  await page.locator('#contacto input[name="privacidad"]').check({ force: true });
  await page.locator("#contacto button[type=submit]").dblclick();
  await expect(page.locator("#contacto .ct-estado")).toContainText("Gracias, José");
  expect(peticiones).toBe(1);
});
