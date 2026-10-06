# Flujo de leads con n8n (local y gratuito)

Cada vez que alguien pide una llamada en iaconsultores.com:

1. **La web avisa a n8n.** Tras enviar el email del lead, `src/lib/leads.ts` (`avisarN8n`) manda un POST a
   `https://n8n.iaconsultores.com/webhook/lead-iaconsultores` firmado con HMAC-SHA256 (cabeceras `X-IAC-Timestamp` y
   `X-IAC-Firma`).
2. **n8n comprueba la firma y la hora** (nodo «Verificar firma»): rechaza avisos falsos o con más de 5 minutos.
3. **Claude Haiku clasifica la petición** (nodo «Clasificar con Claude», salida estructurada): proceso, urgencia,
   resumen y siguiente paso. **El nombre y el teléfono no se envían a la IA.**
4. **n8n guarda el lead con su clasificación** en la tabla «Leads web» (Data Tables de n8n; se crea sola).

```
Web (Hostinger) ──firma HMAC──▶ Cloudflare Tunnel ──▶ n8n (Docker, este PC) ──▶ Claude Haiku ──▶ tabla «Leads web»
```

## Por qué está montado así

- **Coste 0 €.** n8n Community Edition y Cloudflare Tunnel son gratuitos; Claude Haiku cuesta una fracción de céntimo
  por lead.
- **Seguridad.** El editor de n8n solo escucha en este PC (`127.0.0.1:5678`). El túnel publica únicamente la ruta del
  webhook; cualquier otra dirección de `n8n.iaconsultores.com` devuelve 404. Sin secretos en el repositorio: el
  secreto del webhook está en `.env` y la clave de Claude, en las credenciales de n8n.
- **La web no depende de n8n.** Si este PC está apagado, el lead llega igualmente por email; ese lead no se clasifica
  ni se guarda en la tabla (no hay cola de reintentos).

## Archivos

| Archivo | Qué es |
|---|---|
| `docker-compose.yml` | n8n y el túnel de Cloudflare |
| `flujos/leads-web.json` | El flujo, exportado de n8n (sin secretos) |
| `.env.example` | Variables necesarias; la copia real, `.env`, no se versiona |
| `cloudflared-config.example.yml` | Configuración del túnel; la real y sus credenciales viven en `cloudflared/`, fuera de git |
| `probar-aviso.mjs` | Envía un lead de prueba firmado igual que la web (`--firma-mala` para probar el rechazo) |

## Uso diario

- Abre **Docker Desktop**: n8n y el túnel arrancan solos (`restart: unless-stopped`). Para que todo arranque al
  encender el PC: Docker Desktop → Settings → General → «Start Docker Desktop when you sign in to your computer».
- El editor (http://localhost:5678) solo funciona en este PC y con Docker Desktop abierto; no se publica en internet.
  Si no carga: Docker Desktop → Containers → `iac-n8n` → ▶.
- Leads clasificados: http://localhost:5678 → **Overview** → **Data tables** → «Leads web».
- Ejecuciones (y avisos rechazados): abre el flujo → pestaña **Executions**.
- Parar: `docker compose down` en esta carpeta.

## Puesta en marcha desde cero

1. Copia `.env.example` como `.env` y rellena `N8N_ENCRYPTION_KEY` e `IAC_WEBHOOK_SECRET` con dos textos aleatorios
   largos (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
2. `docker compose up -d n8n` → http://localhost:5678 → crea tu usuario (es local).
3. Importa el flujo: `docker compose exec n8n n8n import:workflow --input=/files/leads-web.json`.
4. En el nodo «Claude Haiku», crea la credencial de Anthropic con una clave propia para n8n.
5. Túnel (una vez):
   - `docker run --rm -v "<ruta>/cloudflared:/home/nonroot/.cloudflared" cloudflare/cloudflared tunnel login`
     → abre el enlace y autoriza la zona iaconsultores.com.
   - `... tunnel create n8n-iaconsultores` y `... tunnel route dns n8n-iaconsultores n8n.iaconsultores.com`.
   - Copia `cloudflared-config.example.yml` como `cloudflared/config.yml` con el id del túnel → `docker compose up -d`.
6. Activa el flujo en n8n y comprueba: `node probar-aviso.mjs https://n8n.iaconsultores.com/webhook/lead-iaconsultores`.
7. En hPanel (variables de entorno de la web): `N8N_WEBHOOK_URL` con esa dirección y `N8N_WEBHOOK_SECRET` con el
   mismo valor que `IAC_WEBHOOK_SECRET`. Aplica los cambios y reinicia la aplicación.
