import { defineConfig } from "@playwright/test";

const PUERTO = 4329;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  /* 3 navegadores: con n8n y Docker en marcha en el mismo PC, 6 en paralelo saturaban la CPU y fallaban clics y esperas */
  workers: 3,
  use: { baseURL: `http://127.0.0.1:${PUERTO}`, channel: "msedge" },
  projects: [
    { name: "escritorio", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "movil",
      testMatch: /(portada|chat|contacto|mohure)\.spec\.ts/,
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: {
    command: "npm run build && node servidor.mjs",
    url: `http://127.0.0.1:${PUERTO}/api/salud`,
    timeout: 300_000,
    reuseExistingServer: false,
    env: { HOST: "127.0.0.1", PORT: String(PUERTO), CLAUDE_SIMULADO: "1", RESEND_SIMULADO: "1" },
  },
});
