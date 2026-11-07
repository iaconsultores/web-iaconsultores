# iaconsultores.com · instrucciones para Claude

Web de IA Consultores (consultoría de IA y automatización para pymes) en Hostinger.

- **Antes de nada, lee entero `docs/privado/HANDOFF.md`**: objetivo, decisiones aprobadas, infraestructura,
  reglas de honestidad y privacidad, y siguiente paso. Responde siempre en español.
- Fase 1 implementada según `docs/superpowers/plans/2026-10-05-iaconsultores-web-fase1.md` (spec en
  `docs/superpowers/specs/2026-10-05-iaconsultores-web-design.md`) y publicada en https://iaconsultores.com. La
  maqueta aprobada vive solo en local (`maquetas/`, fuera de git).
- Desplegar cambios: se publica desde `main`. Se sube a Hostinger un `web.zip` con la fuente (sin `node_modules`,
  `dist` ni `.env`) y se construye allí con estos ajustes: Node 24, npm, tipo express, entrada `servidor.mjs`, script
  `build` y salida `.`. Después se comprueban `/`, `/aviso-legal` y `/api/salud` en vivo. Más detalle en las tareas 18
  y 20 del plan y en `docs/privado/HANDOFF.md`.
- `docs/privado/` es privado y no se publica (está en `.gitignore`).
- DNS en Cloudflare con correo de Microsoft 365: nunca cambiar nameservers ni registros MX/TXT.
- Nunca escribir claves en el código ni pedirlas por el chat; van en variables de entorno de Hostinger.
- Pedir permiso antes de cualquier acción externa (publicar el repo, DNS, despliegues, compras).
