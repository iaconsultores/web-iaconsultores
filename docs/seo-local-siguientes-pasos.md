# SEO local: siguientes pasos fuera de la web

La web ya está preparada:

- 43 páginas de zona y 30 de soluciones;
- índice de sitemaps en `https://iaconsultores.com/sitemap.xml`;
- `robots.txt` abierto;
- datos estructurados con el domicilio de Orihuela y el NIF.

Lo que más pesa para salir en Google Maps y en las búsquedas «… cerca de mí» o «… en Elche» está fuera de la web.
Por orden de impacto:

## 1. Perfil de Empresa de Google (lo más importante)

1. Entra en https://business.google.com con la cuenta de Google de la empresa y crea el perfil «IA Consultores».
2. **Categoría principal:** «Consultor de empresas». Secundarias: «Servicio de consultoría informática» y
   «Diseñador de sitios web».
3. **Empresa de servicios a domicilio:** marca que visitas a los clientes y **oculta la dirección**, porque no
   atiendes al público en Orihuela.
4. **Zona de servicio:** provincia de Alicante y, si quieres, Murcia, Cartagena, Gandia, Ontinyent y Almansa.
   Google admite hasta 20 zonas.
5. **Datos idénticos a los de la web**, letra por letra:
   - nombre: IA Consultores;
   - teléfono: 678 310 660;
   - web: https://iaconsultores.com;
   - horario.
6. **Descripción:** un resumen de la portada, en el que salga «provincia de Alicante».
7. **Servicios:** las cinco fichas (Soluciones a medida para tus procesos, Automatiza tu empresa, Tu asistente de
   IA, Tu web e IA en tu equipo).
8. **Verificación:** Google suele pedir un vídeo o una postal. Hazla en cuanto lo pida.
9. **Mantenimiento:** sube fotos reales (tú, una visita, una reunión) y publica una novedad al mes. Por ejemplo,
   enlazando un artículo de `/soluciones`.

## 2. Reseñas

- Pide reseña a cada cliente y colaborador real, con el enlace corto del perfil.
- Contéstalas todas.
- Es el factor que más mueve el ranking en Maps. Nunca compres reseñas ni las pidas a cambio de algo.

## 3. Google Search Console

1. Entra en https://search.google.com/search-console y añade una propiedad de **dominio** `iaconsultores.com`.
   Hay que crear un registro TXT en Cloudflare. **Es un registro nuevo: no se toca ninguno de los que ya existen,
   ni los MX ni los TXT del correo.**
2. En **Sitemaps**, envía `https://iaconsultores.com/sitemap.xml`. Es el índice: Google leerá sus tres sitemaps.
3. Con **Inspección de URLs**, pide la indexación de la portada, `/consultoria-ia`, `/soluciones` y las páginas
   de las zonas que más te interesen. Por ejemplo `/consultoria-ia/alicante`, `/consultoria-ia/elche` y
   `/consultoria-ia/vega-baja`.
4. Revisa el informe de **Páginas** al cabo de unas semanas: qué está indexado y qué no, y por qué.

## 4. Bing Webmaster Tools

En https://www.bing.com/webmasters puedes importar la propiedad desde Search Console en un clic. Envía el mismo
sitemap. Bing alimenta también a otros buscadores y asistentes.

## 5. Mismo nombre, dirección y teléfono en todas partes (NAP)

Da de alta la empresa, con los mismos datos que el perfil de Google, en:

- Bing Places (se importa desde Google), Apple Business Connect y Páginas Amarillas;
- el directorio de la Cámara de Comercio de Alicante y el de la de Orihuela;
- LinkedIn (página de empresa);
- las asociaciones empresariales en las que entres.

## 6. Enlaces y presencia local

- Asociaciones, cámaras y polígonos: hazte socio o colaborador y pide aparecer en su web con enlace.
- Charlas o talleres sobre IA para pymes en cámaras, asociaciones de comerciantes o ayuntamientos. Suelen enlazar
  al ponente.
- Gestorías y asesorías colaboradoras: un enlace desde su web a la página de su municipio vale mucho.
- Prensa local: una nota o entrevista sobre IA en las pymes de la provincia.

## 7. Contenido continuo

- Cuando tengas un **caso real** (con permiso del cliente), publícalo enlazado desde la página de su municipio y
  su sector. Es lo que más credibilidad da, y la web no lo inventa.
- Al cambiar el texto de una página, pon `actualizado: "AAAA-MM-DD"` en su cabecera para que el sitemap lo diga.
- Añade municipios o sectores nuevos en `src/datos/zonas.ts` o `src/datos/soluciones.ts`, con su texto en
  `src/textos`, siguiendo `src/textos/LEEME.md`.

## 8. Medir

- Search Console: impresiones y clics por consulta y por página. Aquí verás si entran «consultoría IA Elche» o
  «automatización empresas Torrevieja».
- Cloudflare Web Analytics, que ya está en la web, para las visitas.
- Las llamadas y los formularios, con el municipio que ahora pide el formulario.

## Lectura de Search Console (23-nov-2026)

Primeras dos semanas, del 10 al 21 de noviembre:

- **Volumen:** 465 impresiones y 0 clics, con la posición media en torno a 52 (página 5 y siguientes).
- **Tendencia:** las impresiones pasan de 2 a 100 al día.
- **Sitemap:** el índice se leyó bien y Google descubrió las 79 URL.

Es lo normal en una web con páginas nuevas: Google ya las asocia a las búsquedas correctas, pero todavía no confía en
ellas lo bastante para ponerlas arriba.

**Lo que dicen las búsquedas:**

- **Alcoy:** reúne el 60 % de las impresiones. Se busca «consultor ia alcoy», «soluciones ia a medida alcoy»,
  «agentes ia alcoy», «chatbots ia alcoy» o «estrategia ia alcoy», casi siempre con «Alcoy» y no «Alcoi». La página
  `/consultoria-ia/alcoi` está en la posición 47.
- **Alicante:** «consultoría ia alicante», «soluciones ia para empresas alicante» y «automatización de procesos
  alicante». Ahí compiten la portada (posición 42) y la página de Alicante (71).
- **El vocabulario:** «agentes de IA», «chatbots», «asistentes», «automatización de procesos y flujos de trabajo»,
  «soluciones a medida» y «estrategia». No había ninguna página por servicio.

**Qué se hizo:**

- 5 páginas de servicio en `/servicios`, con ese vocabulario y la provincia de Alicante. Cada zona enlaza los cinco
  servicios con su nombre.
- Un apartado nuevo en la página de Alcoi pensado para «Alcoy».
- Un enlace de la portada a la página de Alicante.
- Un sitemap de servicios en el índice.

**Qué hacer ahora:**

1. En Search Console, en Inspección de URLs, pide la indexación de `/servicios`, de las 5 páginas de servicio, de
   `/consultoria-ia/alcoi` y de `/consultoria-ia/alicante`.
2. Revisa el Rendimiento dentro de 4 semanas y compara las posiciones de Alcoy y de Alicante, y si aparecen
   búsquedas de servicio.
3. El empujón que falta para pasar a la primera página es la autoridad: el perfil de Google, las reseñas y los
   enlaces locales de este documento. Para Alcoy, por ejemplo, la asociación empresarial o la Cámara de Comercio de
   Alcoy.
