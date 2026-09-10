# web-iaconsultores

Sitio estático de **iaconsultores.com** — la web comercial de la línea de
consultoría en inteligencia artificial aplicada.

Ejecuta la ficha **ISSUE-044** del repositorio `iaconsultores/iaconsultores`
(«Plantilla estática iaconsultores.com»), bajo **ADR-0032 D3**: dos webs
independientes bajo una sociedad, **sin enlace cruzado activo** entre ellas.

---

## Qué es (y qué no es)

HTML y CSS planos. **Sin build, sin dependencias, sin JavaScript, sin backend.**

- No hay `package.json`. No hay nada que instalar ni que compilar.
- **Cero cookies y cero analítica** ⇒ no necesita banner de consentimiento.
- Todo el color, la tipografía y el espaciado viven como *tokens* en
  `assets/styles.css` (`:root`). Cambiar la identidad visual es cambiar tokens,
  no plantillas. Tema claro y oscuro según la preferencia del sistema.

```
index.html          Landing (portada, servicios, método, quién, contacto)
aviso-legal.html    LSSI-CE art. 10
privacidad.html     RGPD / LOPDGDD
assets/styles.css   Tokens + estilos
assets/favicon.svg
_headers            Cabeceras de seguridad de Cloudflare Pages (CSP incluida)
robots.txt          Permite indexación completa
sitemap.xml         Las tres URLs
```

## Ver en local

No hace falta servidor, pero las rutas absolutas (`/assets/…`) solo resuelven
bien sirviendo el directorio:

```bash
python3 -m http.server 8080    # → http://localhost:8080
```

---

## Despliegue en Cloudflare Pages

Estos pasos son de panel: hay que hacerlos una vez, a mano.

### 1. Crear el proyecto de Pages

1. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Autorizar GitHub y elegir `iaconsultores/web-iaconsultores`.
3. Configuración de build — **dejar los tres campos vacíos**:

   | Campo | Valor |
   |---|---|
   | Framework preset | `None` |
   | Build command | *(vacío)* |
   | Build output directory | `/` |

   Es un sitio estático: si se pone un comando de build, el despliegue falla.
4. **Save and Deploy**. Queda publicado en `<proyecto>.pages.dev`.

Desde aquí, **cada push a `main` despliega solo** y **cada PR genera su propia
URL de vista previa** — que es el ciclo de revisión buscado.

### 2. Atar el dominio

Con el proyecto desplegado, en **Custom domains** del propio proyecto de Pages:

1. **Set up a custom domain** → `iaconsultores.com` → confirmar.
2. Repetir con `www.iaconsultores.com`.

Como la zona DNS ya está en Cloudflare, Pages crea los registros y emite el
certificado sin intervención. Estado esperado en unos minutos: **Active**.

> **Antes de tocar DNS, comprobar el correo.** En la pestaña **DNS** de la zona,
> mirar si `iaconsultores.com` tiene registros **MX / SPF / DKIM** activos.
> Añadir Pages **no** los toca, pero conviene verlo antes y no después.

### 3. Redirigir `www` al dominio raíz (opcional)

Para no duplicar contenido a ojos de Google, **Rules** → **Redirect Rules**:

- Si `hostname` igual a `www.iaconsultores.com`
- Entonces redirección **dinámica 301** a
  `concat("https://iaconsultores.com", http.request.uri.path)`

### 4. Verificar

```bash
curl -sI https://iaconsultores.com | head -1                  # 200
curl -sI https://www.iaconsultores.com | head -1              # 301
curl -s  https://iaconsultores.com/robots.txt                 # contenido
curl -sI https://iaconsultores.com | grep -i content-security  # CSP presente
```

Y a ojo: portada, aviso legal, privacidad, tema oscuro y móvil.

### 5. Search Console (después, no antes)

Dar de alta la propiedad y enviar `https://iaconsultores.com/sitemap.xml`.
Hacerlo **después** de que el dominio sirva 200, no durante el cambio.

---

## Datos que dependen del operador

**Confirmado el 10-sep-2026**: el buzón de contacto es **`hola@iaconsultores.com`**
(`contacto@` no existe). Es la única llamada a la acción del sitio. Si algún día
cambia, es un *buscar y reemplazar* sobre los tres `.html`: 14 apariciones en
7 enlaces (cada enlace lleva la dirección en el `href` y en el texto).

Dos cosas siguen pendientes de un dato externo:

1. **Razón social.** Se usa `Agentia Codex S.L. (sociedad en constitución)`,
   la fórmula vigente del canon. ISSUE-044 decía `IA Consultores Software S.L.`,
   nombre que quedó superado en `architecture.md` v4.1.1 (12-may-2026).
   **Cuando la sociedad se constituya**, en `aviso-legal.html` y
   `privacidad.html`: poner NIF y datos registrales reales, retirar
   «(sociedad en constitución)» y quitar el recuadro de aviso. Es el mismo
   trabajo que ISSUE-042 tiene pendiente para las páginas legales de la
   plataforma.
2. **Copy.** El texto de la portada es un borrador y ninguna afirmación es
   inventada: no hay clientes, cifras, logotipos ni testimonios que no se
   puedan sostener. Revisar la propuesta de valor antes de publicar.

## Reglas al editar

- **No enlazar a `agentiacontable.com`** desde aquí, ni redirigir a él
  (ADR-0032 D3, riesgo (d): confusión entre las dos webs).
- **No prometer lo que no se pueda demostrar.** Regla de veracidad del proyecto.
- Si algún día se añade analítica, un formulario o cualquier cookie:
  **actualizar `privacidad.html`**, que hoy afirma que no hay ninguna, y
  reconsiderar el banner de consentimiento. Y **abrir la CSP de `_headers`**:
  hoy prohíbe todo script, así que la casilla «Web Analytics» de Cloudflare
  Pages inyectaría un beacon que el navegador bloquearía en silencio.
- Commits en español y en imperativo (`Añade`, `Corrige`, `Documenta`).
