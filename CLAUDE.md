# iaconsultores.com · instrucciones para Claude

Web de IA Consultores (consultoría de IA y automatización para pymes) en Hostinger.

- **Antes de nada, lee entero `docs/privado/HANDOFF.md`**: objetivo, decisiones aprobadas, infraestructura,
  reglas de honestidad y privacidad, y siguiente paso. Responde siempre en español.
- Fase 1 implementada según `docs/superpowers/plans/2026-10-05-iaconsultores-web-fase1.md` (spec en
  `docs/superpowers/specs/2026-10-05-iaconsultores-web-design.md`) y publicada en https://iaconsultores.com. La
  maqueta aprobada vive solo en local (`maquetas/`, fuera de git).
- Desplegar cambios: ver los resultados de las tareas 18 y 20 del plan (ajustes de build en Hostinger) y
  `docs/privado/HANDOFF.md`. El repositorio público recibe solo la rama `publicacion`, regenerada desde `main`.
- `docs/privado/` es privado y no se publica (está en `.gitignore`).
- DNS en Cloudflare con correo de Microsoft 365: nunca cambiar nameservers ni registros MX/TXT.
- Nunca escribir claves en el código ni pedirlas por el chat; van en variables de entorno de Hostinger.
- Pedir permiso antes de cualquier acción externa (publicar el repo, DNS, despliegues, compras).
