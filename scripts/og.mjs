// Genera public/og.png (1200×630) con la marca y el titular.
import { chromium } from "@playwright/test";

const html = `<!doctype html><html><body style="margin:0;width:1200px;height:630px;display:grid;place-items:center;background:#FFFFFF;font-family:Georgia,serif">
<div style="width:1040px">
  <div style="font:600 30px system-ui,sans-serif;color:#A3312A;letter-spacing:.02em">IA Consultores</div>
  <div style="font-size:72px;line-height:1.05;color:#1B1F2A;margin:24px 0">Inteligencia artificial para empresas reales.</div>
  <div style="font:400 30px system-ui,sans-serif;color:#5E6370">Primero entendemos tu negocio, después desarrollamos la solución.</div>
  <div style="height:10px;width:220px;background:#1A6AA6;border-radius:5px;margin-top:40px"></div>
</div></body></html>`;
const navegador = await chromium.launch({ channel: "msedge" });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html);
await pagina.screenshot({ path: "public/og.png" });
await navegador.close();
console.log("public/og.png generado");
