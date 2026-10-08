# Web iaconsultores.com · Diseño técnico

- **Fecha:** 2026-10-05
- **Estado:** aprobado el 5-oct-2026 (diseño por secciones y documento escrito).
- **Cambios posteriores (6-oct-2026, a petición del usuario):** la portada rota cada 3 s y no se pausa con el ratón;
  en `/mohure`, el CV se muestra en pantalla antes de la matriz, se retira «pega una oferta → encaje» (sección y
  `/api/encaje`), se actualiza el anexo A y se añade el flujo n8n de leads (`automatizaciones/n8n`).
- **Cambios posteriores (8-oct-2026, a petición del usuario):** bandas de la portada un 50 % más lentas y un 30 %
  transparentes; sin la firma bajo el titular; «el director de orquesta» (`#pruebas`) se une a `#sobre-mi` sin datos
  repetidos; Agentia muestra seis beneficios (con «en validación») en lugar de los interruptores de módulos; la cita
  «Los informáticos…» en una línea; contacto más compacto; «Así trabaja una automatización» un 40 % más lenta.
- **Referencia visual:** maqueta aprobada `maquetas/11-r2-configurador.html` (fuente en `maquetas/r2/`). Las maquetas
  solo existen en local y no se publican.

## 1. Objetivo y criterios de éxito

Web de **IA Consultores**: consultoría de implantación de inteligencia artificial y automatización para pymes y
autónomos, firmada por Juan Luis Toboso. Además respalda su candidatura a una oferta de consultor técnico freelance de
IA y automatización mediante una página privada (`/mohure`).

La fase 1 está terminada cuando:

1. `https://iaconsultores.com` sirve la web completa y `www` redirige al dominio principal.
2. El chat responde con Claude y una solicitud de llamada llega al buzón de Juan Luis.
3. El correo de Microsoft 365 sigue funcionando: los registros NS, MX y TXT no han cambiado.
4. No hay gastos nuevos salvo la API de Claude, con un límite mensual en Anthropic (≈ 20 $).
5. Todo el contenido es honesto: los datos inventados llevan la etiqueta «demo» y la experiencia se describe con los
   niveles del anexo A.
6. Calidad: 0 errores de consola; 0 px de desbordamiento horizontal a 390 y 1440 px con las 6 provincias; objetivo
   Lighthouse móvil ≥ 90 en rendimiento y ≥ 95 en accesibilidad, buenas prácticas y SEO.

## 2. Alcance

**Fase 1 (este documento y su plan)**

- Portada `/` con todas las secciones de la maqueta, rotando por provincias.
- Chat con Claude Opus 5.5: asistente de la consultoría que también explica el perfil profesional.
- Formulario «llamada gratuita de 30 min» y propuesta de llamada desde el chat, con aviso por email.
- `/mohure` (no indexada): CV en pantalla (y en PDF) y matriz requisito ↔ evidencia.
- `/aviso-legal`, `/privacidad`, `/cookies` y página 404.
- Despliegue en Hostinger con su conector, más dos registros DNS nuevos en Cloudflare.

**Fase 2 (spec propio, después de publicar)**

- Flujo n8n en Docker local: webhook firmado de la web → Claude clasifica el lead → aviso o registro. Exportado a
  `automatizaciones/n8n/` con una guía corta.
- Demo «Diagnóstico IA en 2 minutos».
- Páginas por provincia para SEO local.
- Despliegue automático desde GitHub (requiere conectar GitHub en hPanel).

**Fuera de alcance:** precios, blog, otros idiomas, cookies o analítica con seguimiento, base de datos, VPS, n8n en
producción y cuentas de usuario.

## 3. Arquitectura

### 3.1 Pila

| Pieza | Elección |
|---|---|
| Framework | Astro 7.x con `@astrojs/node` 11.x en modo `middleware`, envuelto por `servidor.mjs` (§3.6) |
| Lenguaje | TypeScript estricto; JavaScript «vanilla» en el navegador (el de la maqueta), sin framework de interfaz |
| Ejecución | Node.js 24 como app Node.js de Hostinger |
| IA | `@anthropic-ai/sdk` 0.131.x, modelo `claude-opus-5-5` |
| Email | `resend` 6.x |
| Validación | `zod` 4.x |
| Pruebas | Vitest 5.x y Playwright |

### 3.2 Renderizado

- Todas las páginas se prerenderizan como HTML estático, `/` incluida.
- Solo `src/pages/api/*` lleva `export const prerender = false` y se ejecuta en Node.
- Los recursos con hash (`/_astro/*`) llevan caché larga e inmutable.

### 3.3 Estructura

```
src/
  pages/
    index.astro                       # estática; portada rotatoria
    mohure.astro · mohure/cv.astro    # noindex
    aviso-legal.astro · privacidad.astro · cookies.astro · 404.astro
    api/chat.ts · api/lead.ts · api/salud.ts
  layouts/Base.astro
  components/
    Nav.astro · Pie.astro · Chat.astro
    portada/Portada.astro · portada/escenas/*.astro · portada/bandas/*.astro
    secciones/Panel · Pruebas · Servicios · Flujos · PorQue · Agentia · QueHacemos · Colabora · SobreMi · Contacto
    mohure/Curriculum.astro · mohure/Matriz.astro
  scripts/iac.ts                      # rotación de provincias, alVer, reducido, subrayado (sustituye a window.IAC)
  styles/base.css                     # tokens y utilidades del _shell
  lib/
    config.ts · ip.ts · limites.ts · conversaciones.ts
    claude.ts · conocimiento.ts · leads.ts · validacion.ts · sse.ts
  conocimiento/*.md                   # base de conocimiento del asistente
  datos/servicios.ts · agentia.ts · evidencias.ts · provincias.ts
public/
  fonts/*.woff2 · favicon.svg · og.png · robots.txt · cv/*.pdf
scripts/cv-pdf.mjs
servidor.mjs                          # punto de entrada en Hostinger: cabeceras, redirección de www y Astro
tests/unit · tests/integracion · tests/e2e
.env.example
```

`datos/*.ts` es la única fuente de los textos que comparten la web y el asistente (servicios, módulos de Agentia
Contable, evidencias, provincias).

### 3.4 Estado en ejecución

Sin base de datos. Tres almacenes en memoria, detrás de una interfaz pequeña por si hubiera que cambiarlos:

- **Conversaciones del chat**: hasta 500, con caducidad tras 30 min sin actividad; si se llena, se descartan las
  más antiguas.
- **Ventanas de límite por IP.**
- **Contadores diarios globales**, que se reinician a las 00:00 de Europe/Madrid.

Si Hostinger reinicia el proceso, se pierden. Es aceptable: las conversaciones vuelven a empezar y el tope de gasto
real está en Anthropic. La prueba mínima (§8.2) comprueba que la app corre en un único proceso; si no fuera así, se
reevalúa este punto antes de seguir.

### 3.5 Variables de entorno

| Variable | Obligatoria | Uso |
|---|---|---|
| `ANTHROPIC_API_KEY` | Sí (sin ella, el chat responde «no disponible») | Clave del workspace de la web, con límite mensual |
| `RESEND_API_KEY` | Sí | Clave de Resend solo de envío |
| `LEAD_EMAIL_TO` | Sí | Destino de los avisos (`juanluis@iaconsultores.com`) |
| `LEAD_EMAIL_FROM` | Sí | Remitente verificado en Resend (p. ej. `IA Consultores <web@iaconsultores.com>`) |
| `N8N_WEBHOOK_URL` | No | Si existe, cada lead se envía también a n8n |
| `N8N_WEBHOOK_SECRET` | Si existe la anterior | Secreto de la firma HMAC |
| `CLAUDE_SIMULADO`, `RESEND_SIMULADO` | No (solo en local y en pruebas) | Respuestas simuladas, sin red |

`.env.example` lista los nombres sin valores. Las claves nunca van al repositorio ni al chat.

### 3.6 Cabeceras y seguridad (`servidor.mjs`)

En las páginas estáticas, el middleware de Astro se ejecuta al compilar y no en cada petición. Por eso un servidor
Node mínimo (`servidor.mjs`) envuelve el manejador de `@astrojs/node`, que trabaja en modo `middleware`, y aplica a
todas las respuestas, estáticas y dinámicas:

- las cabeceras de seguridad;
- `X-Robots-Tag` en `/mohure`;
- la redirección 301 de `www`;
- la caché de los recursos con hash.

La prueba mínima (§8.2) lo valida.

- CSP generada con el soporte de CSP de Astro (hashes de los scripts en línea, en una meta). Desde el servidor se
  añade `frame-ancestors 'none'`, que solo funciona como cabecera:
  - `default-src 'self'`.
  - `script-src` propio más el script de Cloudflare Web Analytics.
  - `connect-src` propio más el beacon de Cloudflare.
  - `img-src 'self' data:` y `font-src 'self'`.
  - `frame-ancestors 'none'`, `base-uri 'self'` y `form-action 'self'`.
  - Si los estilos en línea de la maqueta lo exigen, `style-src 'self' 'unsafe-inline'`.
- Además: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y una
  `Permissions-Policy` restrictiva. HSTS lo aplica Cloudflare en HTTPS.
- Las APIs `POST` exigen `Content-Type: application/json`, un `Origin` igual al de la web y un tamaño máximo de cuerpo
  (chat 8 KB y lead 8 KB).

## 4. Páginas y contenido

### 4.1 Portada `/`

- Secciones, en el orden y con los ids de la maqueta: `portada`, `panel`, `servicios`,
  `como-trabajamos`, `por-que`, `agentia`, `que-hacemos`, `colabora`, `sobre-mi`, `contacto`.
- Textos, ilustraciones y animaciones: los de la maqueta aprobada. Si la maqueta y `maquetas/r2/_contrato.md` no
  coinciden, manda la maqueta.
- Reglas de contenido:
  - La marca habla en plural; la primera persona solo aparece en «por qué» y «sobre mí».
  - Siempre «Agentia Contable», con el nombre completo.
  - Los datos inventados llevan la etiqueta `demo`.
  - Sin fotos ni siglas.

Cambios respecto a la maqueta:

- **Se quitan**:
  - el panel «Opciones de diseño» y la etiqueta «Maqueta»;
  - el estado de opciones en el `#hash`;
  - el selector desplegable de provincia, su nota «Detectada por aproximación» y el botón de provincia del menú, que
    sustituyen los controles de la rotación (§6);
  - la fuente Inter Tight;
  - todo el HTML y el CSS de las variantes descartadas: tipografía grotesca, servicios en lista, flujo plano, JSON
    oscuro, y fondos blanco y crema.
- **Se fijan** serif, tarjetas, nodos luminosos, JSON claro y fondo «mar». Sus valores pasan a `:root` y desaparecen
  los atributos `data-tipo`, `data-servicios`, `data-flujo`, `data-json` y `data-fondo`.
- **El chat y el formulario de contacto** pasan a funcionar.
- **El pie** enlaza a las páginas legales reales.
- **El botón «Propón una colaboración»** lleva al formulario con el motivo «colaboración».

### 4.2 Chat (interfaz)

- El lanzador y la burbuja son los de la maqueta. La burbuja aparece a los 3,5 s si el chat no se ha abierto.
- El primer mensaje es fijo y no gasta API: un saludo y «soy un asistente de IA (Claude)».
- Botones rápidos:
  - «Ver servicios» y «Llamada gratuita» llevan a su sección.
  - «Soy reclutador» envía una pregunta predefinida sobre el perfil.
- Campo de texto de 1.000 caracteres como máximo, con contador.
- Mientras se genera la respuesta se muestra «escribiendo…», y el texto aparece a medida que llega.
- **Pintado seguro**: se crean nodos de texto, nunca HTML del modelo.
  - Se admiten párrafos, listas, negrita y enlaces.
  - Solo se enlazan URLs del propio dominio, `tel:`, `mailto:`, `wa.me` y `agentiacontable.com`.
- **Tarjeta de llamada** (§5.2.2): un mini-formulario que el usuario confirma.
- Nota fija: «Asistente de IA (Claude). Puede equivocarse: para decisiones importantes, hablamos por teléfono. No
  compartas datos sensibles.»
- Si el servidor indica que la conversación es nueva, se avisa con una línea discreta.

### 4.3 Formulario de contacto

- Campos:
  - Nombre*, Teléfono* y Empresa.
  - ¿Qué proceso quieres mejorar?* (textarea, ≤ 1.000 caracteres).
  - Franja: mañana, tarde o indiferente.
  - Casilla «He leído la política de privacidad»*, con enlace.
- Antispam: un campo trampa oculto y la marca de tiempo del formulario.
- Se envía con `fetch` a `/api/lead`, sin recargar la página.
- Estados:
  - enviando;
  - enviado: «Gracias, te llamamos en la franja elegida»;
  - error, con la alternativa de teléfono o WhatsApp.

### 4.4 `/mohure`

- `noindex, nofollow` en la meta y en la cabecera `X-Robots-Tag`. Fuera del sitemap, del menú y de `robots.txt`.
- Secciones:
  1. Título de la oferta («Consultor/a Técnico/a Freelance de IA y Automatización») y un resumen de dos o tres líneas
     con la formación, con los nombres completos; CV en PDF y enlace a LinkedIn.
  2. CV en pantalla (`Curriculum.astro`, la misma fuente que el PDF de `/mohure/cv`), antes de la matriz.
  3. Matriz requisito ↔ evidencia (anexo A), agrupada en «Requisitos» y «Se valora». Cada fila lleva su nivel con una
     etiqueta visible y la evidencia, con enlace cuando existe.
- «Pega una oferta → encaje con IA» se retiró el 6-oct-2026 a petición del usuario («no aporta nada»), junto con
  `/api/encaje`.
  5. Contacto directo: teléfono, WhatsApp y email.
- Niveles: **Experiencia real** · **Formación + proyecto propio** · **Aprendiendo** · **Sin experiencia aún**.

### 4.5 CV en PDF

- La plantilla es `src/pages/mohure/cv.astro` (noindex, preparada para imprimir).
- `scripts/cv-pdf.mjs` genera `public/cv/juan-luis-toboso-consultor-ia.pdf` con Playwright a partir de la build local.
- Contenido: solo los datos públicos del perfil (los de la web). Juan Luis lo revisa antes de publicar.

### 4.6 Páginas legales y 404

**Aviso legal** (LSSI-CE, art. 10):

- Titular: Agentia Codex S.L., con su domicilio social.
- «NIF: pendiente de asignación».
- Email de contacto.
- Datos registrales: pendientes de que Juan Luis confirme el estado de la inscripción en el Registro Mercantil.

**Privacidad** (RGPD y LOPDGDD):

- Responsable del tratamiento.
- Finalidades: atender las solicitudes de llamada o de colaboración, responder en el chat, y la seguridad y
  prevención de abusos.
- Bases jurídicas: medidas precontractuales a petición del interesado, consentimiento e interés legítimo.
- Encargados: Hostinger (alojamiento), Anthropic (chat), Resend (email) y Cloudflare (analítica sin
  cookies).
- Transferencias internacionales: sus garantías se comprueban con la documentación vigente de cada proveedor al
  redactar.
- Conservación:
  - Solicitudes: el tiempo necesario para atenderlas y, como máximo, 12 meses si no hay relación.
  - Chat: la conversación vive en la memoria del servidor un máximo de 30 min sin actividad y no se guarda en disco.
    Lo que se envía a Anthropic se rige por su política de la API, que se comprueba al redactar.
- Derechos y reclamación ante la AEPD.
- Aviso de IA conforme al art. 50 del Reglamento de IA.

**Cookies**: la web no usa cookies ni guarda nada en el navegador. La analítica de Cloudflare tampoco usa cookies.

**404**: un mensaje breve con enlaces a la portada y al contacto.

### 4.7 SEO y analítica

- `<title>`: «Inteligencia artificial para empresas | IA Consultores».
- Meta descripción (≤ 160 caracteres): «Implantamos IA y automatización en pymes y autónomos: primero entendemos tu
  negocio. Llamada de diagnóstico gratuita de 30 minutos.»
- `link rel="canonical"` a `https://iaconsultores.com/`.
- Open Graph con una imagen de 1200×630 (`public/og.png`).
- JSON-LD `ProfessionalService`: nombre, url, teléfono, email y `areaServed` España.
- `sitemap.xml` con `/` y las páginas legales. `robots.txt` lo permite todo y enlaza el sitemap.
- Cloudflare Web Analytics con su script, sin proxy y sin cookies.

## 5. API

### 5.1 Común

**IP del visitante**: la que fija el proxy de Hostinger delante de la app. La prueba mínima (§8.2) determina la
cabecera exacta; previsiblemente, la última IP de `x-forwarded-for` o `x-real-ip`. No se confía en cabeceras que el
visitante pueda falsear, como `cf-connecting-ip` sin el proxy de Cloudflare.

Riesgo aceptado: alguien podría repartir sus peticiones entre muchas IP. Por eso hay topes globales, y el límite de
gasto de Anthropic es la última barrera.

**Límites**: están definidos como constantes en `src/lib/limites.ts`. Al superarlos se responde 429, con
`Retry-After` y un mensaje amable que ofrece el teléfono y WhatsApp.

| API | Por IP | Global diario |
|---|---|---|
| chat | 20/hora y 50/día; 20 turnos por conversación; 1.000 caracteres por mensaje | 250 mensajes |
| lead | 5/hora | 100 |

**Registro**: una línea por llamada a Claude con los tokens (entrada, caché leída, caché escrita y salida), la ruta y
el `stop_reason`. Sin contenido, sin IP y sin datos personales.

### 5.2 `POST /api/chat`

**Petición**: `{ conversacionId?: string, mensaje: string }`.

**Respuesta**: `text/event-stream` con estos eventos:

| Evento | Datos | Cuándo |
|---|---|---|
| `conversacion` | `{ id, nueva: boolean }` | primero, siempre |
| `texto` | `{ t }` | cada fragmento de texto |
| `tarjeta` | `{ motivo, proceso }` | cuando el modelo usa `proponer_llamada` |
| `fin` | `{ motivo: "ok" \| "cortado" \| "rechazo" }` | al terminar |
| `error` | `{ codigo, mensaje }` | ante un fallo; después se cierra |

El cliente lee el flujo con `fetch` y procesa los eventos según llegan. Si la plataforma acumulara la respuesta, llega
todo junto y la interfaz funciona igual.

**Flujo en el servidor**:

1. Valida la petición, comprueba el origen y aplica los límites.
2. Busca la conversación. Si no existe o ha caducado, crea una nueva con `crypto.randomUUID()` y `nueva: true`.
3. Si el último turno del asistente dejó pendiente un `tool_use` de `proponer_llamada`, el nuevo mensaje del usuario
   empieza con su `tool_result` («Tarjeta mostrada. Estado: solicitud enviada | sin enviar») y después lleva el texto.
4. Llama a Claude en streaming (§5.2.1) y reenvía cada `text_delta` como evento `texto`.
5. Cuando se completa un bloque `tool_use` de `proponer_llamada`, valida su entrada con zod y emite `tarjeta`.
6. Al acabar, revisa `stop_reason` **antes** de usar el contenido:
   - `end_turn` o `tool_use` → `fin ok`;
   - `max_tokens` → `fin cortado`;
   - `refusal` → texto fijo («Prefiero no responder a eso; si quieres, lo hablamos por teléfono»), `fin rechazo` y la
     conversación se cierra.
7. Si todo ha ido bien, añade al historial el mensaje del usuario y el contenido completo de la respuesta
   (`finalMessage().content`), **sin editar y con los bloques de razonamiento**. Si hubo un error, no añade nada: la
   conversación queda como estaba y el usuario puede reintentar.

#### 5.2.1 Parámetros de Claude (chat)

Se llama a `client.beta.messages.stream({...})` con:

- **Modelo y tamaño**: `model: "claude-opus-5-5"` y `max_tokens: 8000`, porque el razonamiento cuenta dentro de ese
  límite. La brevedad de la respuesta la marca el system.
- **Esfuerzo**: `output_config: { effort: "medium" }`, decisión de Juan Luis para priorizar la calidad. No se envía
  `thinking`: en Opus 5.5 el razonamiento adaptativo siempre está activo y no se puede desactivar. La latencia y el
  coste reales se vigilan con el registro de tokens.
- **System**: `system: [{ type: "text", text: CONOCIMIENTO, cache_control: { type: "ephemeral" } }]`, más la caché
  automática del historial. El texto del system es idéntico byte a byte en todas las peticiones de un despliegue: sin
  fechas ni datos variables.
- **Herramientas**: `tools: [proponer_llamada]` con `strict: true` y `eager_input_streaming: true`. La entrada se
  valida siempre con zod. `tool_choice` queda en automático: Opus 5.5 no admite forzar una herramienta.
- **Fallback**: `betas: ["server-side-fallback-2026-07-01"]` y `fallbacks: "default"`. Si un clasificador rechaza una
  petición normal por error, Anthropic la reintenta en el modelo que recomienda.

Errores:

- El SDK reintenta automáticamente 2 veces ante 429 y 5xx.
- Límite de gasto agotado o clave no válida → `error` «El asistente no está disponible ahora mismo. Llámanos o
  escríbenos por WhatsApp».
- Los errores se capturan por clase del SDK, de la más específica a la más general.
- Si falta `ANTHROPIC_API_KEY`, se responde lo mismo sin llamar a la API.

Con `CLAUDE_SIMULADO=1` (en local y en las pruebas) se usa un cliente falso que emite texto y, si el mensaje contiene
«llamada», también un `tool_use`.

#### 5.2.2 Herramienta `proponer_llamada`

- **Descripción**: «Propón al usuario una llamada de diagnóstico gratuita de 30 minutos cuando quiera avanzar, pida
  contacto, presupuesto o una reunión. No pidas nombre ni teléfono: la web le mostrará un formulario para que confirme.»
- **Entrada** (`additionalProperties: false`, ambos campos obligatorios):
  - `motivo`: string con la necesidad resumida en una frase, ≤ 200 caracteres;
  - `proceso`: uno de `facturas_contabilidad`, `leads_crm`, `documentos`, `atencion_cliente`, `informes`, `web`,
    `formacion`, `otro`.
- **Confirmación humana**: la tarjeta muestra el motivo, nombre*, teléfono*, franja y la casilla de privacidad*, con
  los botones «Enviar solicitud» y «Ahora no».
  - Al enviar, el navegador llama a `/api/lead` con `origen: "chat"`, `conversacionId`, `motivo` y `proceso`, y el
    servidor marca la propuesta como enviada.
  - El nombre y el teléfono **nunca** se envían a Claude.

#### 5.2.3 Base de conocimiento y reglas (system)

**Composición**: los Markdown de `src/conocimiento/` en un orden fijo, más los datos compartidos (`servicios.ts`,
`agentia.ts`, `evidencias.ts`) pasados a texto. Así la web y el asistente dicen lo mismo.

**Contenido**:

- quiénes somos;
- los 10 servicios, cada uno con su beneficio;
- cómo trabajamos: llamada de diagnóstico → propuesta → implantación → acompañamiento;
- qué hacemos y qué no;
- Agentia Contable, con sus etiquetas «en validación»;
- sobre Juan Luis (lo mismo que dice la web);
- para reclutadores, el anexo A con sus niveles;
- contacto y política de precios.

**Reglas**:

- Español de España y tuteo.
- Respuestas breves: ≤ 120 palabras, salvo que pidan detalle.
- La marca habla en plural, y de Juan Luis en tercera persona.
- Nunca inventa precios, plazos, clientes, resultados ni compromisos: «cada proyecto es único; el presupuesto es
  personalizado tras la llamada».
- Nunca atribuye experiencia que no esté en el anexo A.
- Si algo no está en la base de conocimiento, lo dice.
- Solo trata IA y automatización para empresas, los servicios y el perfil. Rechaza con amabilidad lo demás: deberes,
  programación a medida, charla general.
- No da asesoramiento fiscal ni legal concreto en el chat: deriva a la llamada.
- Si le preguntan, dice que es un asistente de IA (Claude).
- No pide datos personales: propone la tarjeta de llamada.

**Inyección de instrucciones**: los mensajes del usuario se tratan como datos. El asistente no tiene herramientas con
efectos, salvo proponer la llamada, que requiere confirmación humana.

### 5.3 `POST /api/lead`

**Esquema** (zod):

- `nombre`: 2–80 caracteres.
- `telefono`: normalizado, 9–15 dígitos, con `+` opcional.
- `empresa?`: ≤ 120.
- `proceso`: ≤ 1.000; desde el chat lleva el `motivo`.
- `franja`: `manana` | `tarde` | `indiferente`.
- `motivo`: `llamada` | `colaboracion`.
- `origen`: `formulario` | `chat`.
- `conversacionId?`.
- `privacidad`: `true`.
- `web`: el campo trampa; debe llegar vacío.
- `t`: milisegundos desde que se pintó el formulario; ≥ 3.000.

**Acciones**:

1. **Email con Resend** de `LEAD_EMAIL_FROM` a `LEAD_EMAIL_TO`:
   - asunto «Nueva solicitud de llamada · {nombre}» (o «de colaboración»);
   - cuerpo en texto y en HTML sencillo con todos los campos, el origen y la fecha en Europe/Madrid;
   - un reintento ante error de red o 5xx.
2. **Webhook a n8n**, solo si existe `N8N_WEBHOOK_URL`:
   - `POST` con `{ evento: "lead.creado", fecha, lead }`;
   - cabeceras `X-IAC-Timestamp: <unix>` y
     `X-IAC-Firma: sha256=<hex HMAC-SHA256(N8N_WEBHOOK_SECRET, timestamp + "." + cuerpo)>`;
   - timeout de 3 s; su resultado no afecta a la respuesta.

**Respuestas**:

- 200 `{ ok: true }`.
- 400 con los errores por campo.
- 429 por límites.
- 502 `{ ok: false, mensaje }` si Resend falla: «No hemos podido enviar tu solicitud. Llámanos al 678 310 660 o
  escríbenos por WhatsApp».

No se guardan datos personales en disco ni en los registros.

### 5.4 `POST /api/encaje` (retirado el 6-oct-2026)

Se retiró con su sección de `/mohure`; el diseño queda aquí como registro.

**Petición**: `{ oferta: string }`, de 200 a 12.000 caracteres.

**Llamada a Claude**:

- `claude-opus-5-5`, con `effort: "medium"` y `max_tokens: 8000`.
- System: reglas y catálogo del anexo A, con caché.
- Salida estructurada con `output_config.format` (JSON Schema generado desde zod).
- Fallbacks como en el chat.
- Se ejecuta en streaming en el servidor (`finalMessage()`) para evitar timeouts. El navegador espera con un
  indicador de progreso.

**Esquema de salida**:

- `puesto`.
- `resumen`: ≤ 600 caracteres.
- `requisitos[]`, cada uno con:
  - `requisito`;
  - `tipo`: `imprescindible` | `valorable`;
  - `nivel`: `experiencia_real` | `formacion_y_proyecto` | `aprendiendo` | `sin_experiencia`;
  - `evidencia`;
  - `evidenciaId`: string o null.
- `fortalezas[]`: ≤ 3.
- `huecos[]`: ≤ 3, cada uno con un plan de aprendizaje.

**Honestidad en el código**: después de validar, si un requisito declara un nivel superior al de su `evidenciaId` en
`evidencias.ts`, se rebaja al del catálogo. Sin `evidenciaId`, el nivel queda en `sin_experiencia`.

**Respuestas**: 200 con el JSON; 502 si la salida no valida después de un reintento.

### 5.5 `GET /api/salud`

Devuelve `{ ok: true, version, instancia }`, donde `instancia` es un id aleatorio que se genera en cada arranque del
proceso. Con `?diagnostico=1` añade `ip`: la IP detectada del propio visitante, que sirve para confirmar la cabecera de
Hostinger.

Sirve para la prueba mínima y para las comprobaciones tras el despliegue. No expone cabeceras ni IPs.

## 6. Portada rotatoria por provincias

No hay detección por IP: la portada recorre las provincias por sí sola.

- **Orden**: Alicante → Valencia → Murcia → Albacete → Madrid → toda España, y vuelta a empezar. Cada provincia se
  ve unos 3 s (el usuario lo bajó de 6 a 3 s al verla publicada), con un fundido de unos 0,6 s; ambos valores son
  constantes en `datos/provincias.ts`.
- **Qué cambia**:
  - `html[data-provincia]`, que cambia la escena, la banda, las coordenadas y la curiosidad;
  - todos los `[data-prov-nombre]`, que cambian el H1 y el antetítulo.
- **Estado inicial**: Alicante. Es lo que ven los buscadores y quien navega sin JavaScript.
- **Controles**, que sustituyen al selector y al botón del menú:
  - una fila con las 6 provincias como botones (`aria-pressed`): al pulsar una, la portada se queda fija en ella;
  - un botón «Pausar» / «Reanudar» (WCAG 2.2.2).
- **Pausas automáticas**: con el foco dentro de la portada, cuando la portada no está en pantalla y
  cuando la pestaña está oculta.
- **Movimiento reducido**: con `prefers-reduced-motion` no rota; se queda en Alicante y los botones siguen
  funcionando.
- **Accesibilidad**: la palabra que cambia lleva `aria-hidden="true"`, y un texto solo para lectores de pantalla da el
  H1 completo: «Inteligencia artificial para empresas reales en Alicante, Valencia, Murcia, Albacete, Madrid y toda
  España».
- **Sin saltos de diseño**: los textos que cambian se apilan en una misma celda (`inline-grid`) que reserva el tamaño
  del más largo, así que el alto del bloque no varía entre provincias (CLS < 0,05).
- **Sin almacenamiento**: no se guarda nada en el navegador ni se usa la IP para ubicar al visitante.

## 7. Traslado de la maqueta

| Origen (`maquetas/r2/`) | Destino |
|---|---|
| `_shell.html` | `layouts/Base.astro`, `styles/base.css`, `scripts/iac.ts`, `Nav.astro`, `Pie.astro` y `Chat.astro` |
| `frag-hero.html` + `frag-hero-2.html` | `portada/Portada.astro`, `portada/escenas/*` y `portada/bandas/*` |
| `frag-panel.html` | `secciones/Panel.astro` y `secciones/Pruebas.astro` |
| `frag-servicios.html` | `secciones/Servicios.astro` (con datos de `servicios.ts`) |
| `frag-flujo.html` | `secciones/Flujos.astro` |
| `frag-contenido.html` | `PorQue`, `Agentia` (con `agentia.ts`), `QueHacemos`, `Colabora`, `SobreMi` y `Contacto` |

- **CSS**:
  - El CSS con prefijo de sección se conserva como estilos globales de cada componente.
  - Se borran las reglas de las variantes descartadas.
  - Los tokens toman los valores de «mar».
- **JavaScript**:
  - Cada IIFE pasa a ser el `<script>` de su componente e importa `scripts/iac.ts`, que sustituye a `window.IAC`.
    Exporta `getProvincia`, `setProvincia`, `onCambio`, `alVer` y `reducido`.
  - Se mantienen los comportamientos de la maqueta: animaciones al entrar en pantalla, `prefers-reduced-motion`,
    subrayado de rotulador y eventos de cambio de provincia.
- **Fuentes**:
  - Ibarra Real Nova (400–700, con cursiva), DM Sans (400–700, cursiva 400) y DM Mono (400 y 500).
  - Se sirven desde la propia web en `woff2`, con subconjuntos latin y latin-ext y `font-display: swap`.
  - Se precarga la fuente del H1.
- **Comprobación visual**: capturas de la build a 390 y 1440 px con las 6 provincias, como hace `_montar.mjs`, y
  comparación con la maqueta. Desbordamiento 0 y 0 errores.
- **Peso**:
  - Se mide el HTML de `/` comprimido. Si supera 150 KB (brotli), las escenas que no son la inicial pasan a cargarse
    en segundo plano después de la primera.
  - Objetivo: JS propio ≤ 60 KB comprimido y CLS < 0,05.

## 8. Infraestructura y despliegue

### 8.1 Mecanismo

Se usa la vía sencilla que ofrece Hostinger para Claude Code: Claude genera los archivos en local y el **conector de
Hostinger** los sube.

- `hosting_deploy-js-application` sube un `.zip` con el código fuente, sin `node_modules`, `dist` ni nada de lo que
  ignora git.
- Hostinger instala, compila (`npm run build`) y arranca la app.

Ajustes de compilación:

- Node 24 y npm.
- Tipo de app `express` u `other` con `entry_file` `servidor.mjs` (§3.6), según lo que muestre la prueba mínima.

Claude lanza cada despliegue con el conector, con permiso previo. El despliegue automático desde GitHub queda para la
fase 2.

### 8.2 Prueba mínima de la plataforma (antes de trasladar la web)

Una app Astro mínima en el **dominio temporal de Hostinger**, con:

- `/` generada en el servidor;
- `/api/sse`: 5 eventos, uno por segundo;
- `/api/eco`: devuelve solo las cabeceras relacionadas con la IP (es temporal);
- `/api/espera?s=60`: responde a los 60 s;
- `/api/salud`.

Qué comprueba:

1. que compila y arranca;
2. que el SSE llega poco a poco (`curl -N` con tiempos);
3. el nombre de la cabecera que trae la IP real;
4. si hay uno o varios procesos (`instancia`);
5. que lee las variables de entorno;
6. que una petición larga no se corta.

El resultado se anota en el plan. Después, el dominio temporal puede quedarse como entorno de pruebas.

### 8.3 Repositorio

`iaconsultores/web-iaconsultores`, hoy privado.

Antes del primer push:

1. Un historial limpio, sin `maquetas/` (se queda en local, ignorada por git) ni `docs/privado/`.
2. Una búsqueda de secretos y de datos privados.
3. Una revisión de `CLAUDE.md`.

Después, con permiso, el repositorio pasa a **público** y se sube el código. No hace falta para desplegar: sirve de
escaparate.

### 8.4 Variables de entorno

Las pone Juan Luis en hPanel (la lista está en §3.5). La API de Hostinger reemplaza el conjunto completo y devuelve los
valores enmascarados. Por eso, una vez que existan las claves, Claude **no** usa
`hosting_nodejs_replace-environment-variables`: cualquier cambio posterior se hace en hPanel.

### 8.5 DNS y SSL (Cloudflare; paso a paso y con permiso)

1. **Foto inicial.** Se guardan los registros NS, MX y TXT de `iaconsultores.com` (`nslookup`).
2. **Registros nuevos.** `A @` → IP del sitio en Hostinger, y `CNAME www` → `iaconsultores.com`, ambos en «solo DNS»
   (nube gris). No se toca ningún otro registro.
3. **SSL de Hostinger.** Certificado de por vida para `iaconsultores.com` y `www`, con redirección a HTTPS.
4. **`www`.** `servidor.mjs` redirige con un 301 de `www.iaconsultores.com` al dominio principal.
5. **Analítica.** Se da de alta el sitio en Cloudflare Web Analytics y se añade su script (el token que lleva es
   público).
6. **Verificación:**
   - HTTPS en el dominio principal y en `www`;
   - NS, MX y TXT idénticos a los de la foto inicial;
   - el SSE funciona.

**Marcha atrás**: borrar los dos registros nuevos deja el DNS como estaba.

**Opcional, más adelante**: activar el proxy de Cloudflare (CDN y protección) con SSL «Full (strict)». El código no
depende de ello.

### 8.6 Resend

Se comprueba en Resend el estado del dominio `iaconsultores.com` (el SPF ya incluye a Resend). Si faltan los
registros DKIM, se **añaden** con un permiso aparte, sin modificar los existentes.

### 8.7 Lista de comprobación tras el despliegue

- Las páginas responden 200 y la 404 responde 404.
- Las cabeceras están bien: CSP, y `X-Robots-Tag` en `/mohure`.
- Un mensaje real en el chat, con sus tokens en el registro.
- Un lead real en el buzón.
- La portada rota y se puede pausar.
- MX sin cambios.
- Lighthouse móvil.

## 9. Errores y casos límite

| Situación | Comportamiento |
|---|---|
| Claude 429/5xx | El SDK reintenta 2 veces; si sigue fallando, `error` con alternativa de contacto |
| Límite de gasto de Anthropic agotado o sin clave | «El asistente no está disponible ahora mismo», más teléfono y WhatsApp |
| `refusal` (después del fallback) | Texto fijo amable; la conversación se cierra |
| `max_tokens` | Se muestra lo recibido + «(respuesta cortada)» |
| Corte del streaming | Se muestra lo recibido + «Se ha cortado la conexión, vuelve a intentarlo»; el historial no cambia |
| Conversación caducada o reinicio | Conversación nueva, con aviso discreto |
| Resend falla | 502 y alternativa de teléfono o WhatsApp |
| El webhook de n8n falla | Se ignora; solo queda en el registro |
| Entrada no válida | 400 con los errores por campo |
| Límites superados | 429 + `Retry-After` + mensaje amable |
| `prefers-reduced-motion` | Sin rotación: Alicante fija; los botones de provincia siguen funcionando |
| JavaScript desactivado | El contenido se ve y los enlaces de contacto (`tel:`, `mailto:`, WhatsApp) funcionan; el chat y el formulario no |

## 10. Pruebas

**Unitarias (Vitest):**

- `ip`: usa la cabecera de Hostinger e ignora las que se pueden falsear.
- Rotación: orden, intervalo, pausa y reanudación (función pura, con reloj falso).
- Límites: ventanas, topes diarios y cambio de día en Europe/Madrid, con relojes falsos.
- Esquema del lead: casos válidos, campo trampa, tiempo mínimo y teléfono.
- Firma HMAC, con un vector conocido.
- Almacén de conversaciones: caducidad, máximo y composición del `tool_result` pendiente.
- Estabilidad del system: dos composiciones idénticas byte a byte, sin fechas.
- La serialización SSE.

**De integración (Vitest)**, con clientes falsos de Claude y de Resend inyectados en los manejadores:

- Chat:
  - texto;
  - `tool_use` → `tarjeta` → `tool_result` en el turno siguiente;
  - `refusal`, `max_tokens` y error de la API.
- Lead: correcto, con fallo de Resend y con webhook firmado.

**De humo (Playwright)**, contra la build de producción en local con `CLAUDE_SIMULADO=1` y `RESEND_SIMULADO=1`:

- Todas las páginas cargan sin errores de consola.
- Sin desbordamiento a 390 y 1440 px, con las 6 provincias.
- La rotación:
  - avanza sola;
  - se pausa con el botón o con el foco (no con el puntero: la portada ocupa casi toda la pantalla);
  - se fija al elegir una provincia;
  - no rota con movimiento reducido;
  - el alto del bloque del H1 no cambia entre provincias.
- Una conversación simulada con su tarjeta.
- El formulario: validación y envío correcto.
- `noindex` en `/mohure`, y la 404.
- `servidor.mjs`: cabeceras de seguridad, `X-Robots-Tag` en `/mohure` y redirección de `www` (petición con cabecera
  `Host`).

**Tras el despliegue**: la lista de §8.7.

## 11. Decisiones y alternativas descartadas

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Portada rotatoria por provincias, estática | Detectar la provincia por la IP (proxy de Cloudflare o base GeoIP) | Más simple: sin proxy, sin servidor para `/` y sin usar la IP para ubicar. A cambio, el visitante no ve su provincia a la primera |
| `effort: "medium"` en el chat | `effort: "low"` | Decisión de Juan Luis: prima la calidad; se vigilan la latencia y el coste |
| Historial del chat en el servidor | Historial en el navegador | Nadie puede inventar turnos del asistente; el historial va sin editar, como exige Opus 5.5, y aprovecha la caché |
| Sin base de datos (memoria) | SQLite o MySQL | Bastan los topes; el límite duro está en Anthropic |
| Email con Resend + webhook opcional | n8n en producción o un VPS | Sin gasto extra; n8n se demuestra en local |
| Nombre y teléfono fuera de Claude (tarjeta) | Recoger los datos en la conversación | Minimización de datos y confirmación humana |
| Fuentes servidas desde la propia web | Google Fonts | Privacidad (no se envía la IP a Google) y rendimiento |
| Escenas en el HTML con cambio por CSS | Carga diferida | Cambio instantáneo; se revisa si el peso supera el umbral de §7 |
| Fallback del servidor activado | Sin fallback | Un falso positivo del clasificador no deja al usuario sin respuesta |
| Despliegue con el conector de Hostinger | Despliegue automático desde GitHub | No requiere configuración previa; GitHub queda para la fase 2 |

## 12. Pendiente de Juan Luis

1. Crear un workspace de Anthropic para la web con un límite de gasto mensual (≈ 20 $) y su clave, y una clave de
   Resend solo de envío. Ponerlas en hPanel (§3.5).
2. Confirmar el estado de la inscripción de Agentia Codex S.L. en el Registro Mercantil, para el aviso legal.
3. Revisar antes de publicar:
   - el anexo A, una vez maquetado;
   - la base de conocimiento del asistente;
   - el CV;
   - los textos legales.
4. Autorizar cada acción externa:
   - los despliegues;
   - la publicación del repositorio;
   - los dos registros DNS en Cloudflare y el alta de la analítica;
   - los registros de Resend.
5. Opcional: conectar GitHub en hPanel para la fase 2.

## Anexo A. Matriz requisito ↔ evidencia (borrador para revisar)

Agentia Contable es una plataforma **diseñada y dirigida por Juan Luis Toboso y programada con agentes de IA (Claude
Code y Codex principalmente)**; esto se aplica a todas las filas que la citan. Juan Luis confirmó los niveles el
5-oct-2026 y los actualizó el 6-oct-2026. La fuente es `src/datos/evidencias.ts`.

**Requisitos de la oferta**

| Requisito | Nivel | Evidencia |
|---|---|---|
| Automatización con Make o n8n | Formación + proyecto propio | Flujo n8n propio conectado a esta web (`automatizaciones/n8n`): recibe cada lead con firma HMAC, lo clasifica con Claude y lo guarda en una tabla (Docker + Cloudflare Tunnel). Base: módulo de automatización no-code del máster (Zapier, Make, n8n, Power Automate). Nivel subido el 6-oct-2026, con el flujo ya probado |
| GoHighLevel (no imprescindible) | Sin experiencia aún | No lo ha usado, pero sí otros CRM y ERP, y construye los suyos: el módulo CRM de Agentia Contable y un CRM propio en desarrollo (embudos, tareas y seguimiento). Puede aprenderlo rápido y, si se prefiere, puede crear uno similar a medida |
| APIs REST, webhooks y JSON | Experiencia real | Agentia Contable: API v1 de 35 endpoints (OpenAPI 3.1), 29 webhooks firmados con HMAC-SHA256 e integraciones con Stripe, Resend y la API de Claude, OpenAI, Mistral y otros |
| ChatGPT, Claude, Copilot, Gemini | Experiencia real | Uso habitual y comparado de modelos OpenAI, Gemini, NotebookLM, Copilot y Claude, además de Mistral, Jev y otros modelos. Claude, integrado en producción en Agentia Contable (lectura de documentos, clasificación y asistente); Claude Code y Codex, como herramientas de desarrollo |
| Análisis de procesos | Experiencia real | Más de 10 años dirigiendo empresas (finanzas, equipos comerciales y backoffice); Postgrado en Dirección y Gestión de Proyectos Empresariales (Centro Europeo de Postgrado) y Máster en IA Aplicada y Optimización de Procesos Productivos (UTAMED, finalización prevista en octubre de 2026) |
| VPS, cloud y despliegues | Experiencia real (VPS: uso básico) | Cloud: más de 50 webs creadas en los últimos 10 años; Cloudflare Workers, Supabase, Hostinger (esta web), DNS y correo. VPS: ha tenido VPS, con ayuda o revisión de terceros en la configuración, y ha desarrollado aplicaciones en ellos; no se considera un profesional técnico de sistemas |
| Autonomía | Experiencia real | Agentia Contable de principio a fin, en producción desde septiembre de 2026 |
| Trato con clientes | Experiencia real | Director financiero en una agencia de seguros con más de 30.000 clientes; socio y gerente de una agencia inmobiliaria durante más de una década; dirección de equipos comerciales de seguros |

**Se valora**

| Requisito | Nivel | Evidencia |
|---|---|---|
| SharePoint / OneDrive | Experiencia real | Uso de SharePoint y OneDrive; correo corporativo en Microsoft 365 |
| Excel / Google Sheets | Experiencia real | Uso habitual de los dos como economista y director financiero |
| Copilot Studio | Aprendiendo | Probado y comparado con otros modelos; uso esporádico como apoyo del paquete Office, sin uso en desarrollo de proyectos |
| WhatsApp Cloud API | Sin experiencia aún | — |
| OCR / extracción de documentos | Experiencia real | Lectura de documentos con OCR e IA creada para Agentia Contable |
| CRM / ERP | Experiencia real | Uso de varios sistemas de compañías como RE/MAX y Ocaso, y de otros propios para sus empresas; en la actualidad desarrolla el ERP ligero y el CRM de Agentia Contable |
| Bases de datos | Experiencia real | PostgreSQL (Supabase) con seguridad a nivel de fila en Agentia Contable |
| Docker | Experiencia real | Entornos locales de desarrollo y pruebas |
| Linux | Sin experiencia aún | Solo uso indirecto a través de Docker; sin dominio de la administración de Linux |
| DNS | Experiencia real | Cloudflare, correo de Microsoft 365, SPF y DKIM para el correo transaccional |
