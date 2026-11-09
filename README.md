# IA Consultores · iaconsultores.com

Web de IA Consultores, la consultoría de inteligencia artificial y automatización para pymes y autónomos de Juan Luis Toboso.

## Qué incluye
- Portada que rota por las comarcas de la provincia de Alicante y su economía (Alicante, Elche, la Vega Baja, el
  Vinalopó, l'Alcoià, la Marina Baixa y la Marina Alta) y termina en Valencia, Murcia y Albacete.
- Páginas locales: `/consultoria-ia` (provincias, comarcas y municipios a menos de hora y media de Alicante) y
  `/soluciones` (artículos por sector y zona). Estructura en `src/datos/zonas.ts` y `src/datos/soluciones.ts`;
  textos y guía de redacción en `src/textos/`.
- Asistente con Claude Opus 5.5 (streaming, propuesta de llamada con confirmación humana; nombre y teléfono nunca pasan por la IA).
- Formulario de llamada con aviso por email (Resend) y webhook firmado opcional para n8n.
- Página privada de candidatura con el CV en pantalla (y en PDF) y la matriz de evidencias requisito a requisito.

## Pila
Astro 7 (HTML estático) + Express 5 (`servidor.mjs`) + `@astrojs/node` en modo middleware, `@anthropic-ai/sdk`, zod, Resend. Pruebas con Vitest y Playwright.

## Uso local
    npm install
    npm run local        # build + servidor en http://127.0.0.1:4329 con Claude y email simulados
    npm test             # unitarias e integración
    npx playwright test  # navegador (usa el Edge instalado)

## Variables de entorno (producción)
`ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` y, opcionales, `N8N_WEBHOOK_URL` y `N8N_WEBHOOK_SECRET` (lista completa en `.env.example`). Nunca se versionan.

## Publicación
Se publica desde `main` en Hostinger: se sube un `web.zip` con la fuente (sin `node_modules`, `dist` ni `.env`) y
Hostinger lo construye con Node 24 y npm, tipo express, entrada `servidor.mjs`, script `build` y salida `.`. Las
variables de entorno viven en el alojamiento, nunca en el zip. Tras cada publicación se comprueban `/`, `/aviso-legal`
y `/api/salud`.

## Diseño y plan
- Spec: `docs/superpowers/specs/2026-10-05-iaconsultores-web-design.md`
- Plan: `docs/superpowers/plans/2026-10-05-iaconsultores-web-fase1.md`
- Enfoque local (9-nov-2026): `docs/superpowers/specs/2026-11-09-enfoque-local-alicante.md`
- SEO local fuera de la web (perfil de Google, Search Console, NAP, reseñas): `docs/seo-local-siguientes-pasos.md`

© 2026 Agentia Codex S.L. Todos los derechos reservados. Repositorio público solo para consulta: no se concede
licencia para copiar ni reutilizar su contenido (ver [LICENSE](LICENSE)).
