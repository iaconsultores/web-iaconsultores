# Enfoque local: provincia de Alicante primero

- **Fecha:** 2026-11-09
- **Estado:** implementado en la rama `claude/loving-gauss-45mjab`, pendiente de revisión. No está publicado.
- **Petición:** posicionar a IA Consultores como la referencia en IA y automatización para las empresas de la
  provincia de Alicante antes que en el resto de España. El contacto humano (llamada y visita) es la diferencia.

## Decisiones aprobadas por el usuario

1. Base y centro del radio de acción: Alicante ciudad. Visitas en persona a hora y media como mucho; el resto de
   España, en remoto y como segunda línea.
2. La portada rota por comarcas y su economía, no por monumentos, con nombres en valenciano en las zonas
   valencianohablantes. Fuera Madrid. Valencia, Murcia y Albacete se quedan al final, como provincias y con
   enfoque de sectores.
3. Escenas representativas de cada comarca en lugar de un mapa.
4. Llamada inicial de 30 minutos gratuita y formulario para dejar el interés.
5. Muchas páginas para el SEO local: provincias, comarcas y municipios grandes del radio, y más de 20 artículos de
   soluciones por sector y zona.

## Decisiones tomadas en la implementación (para revisar)

### Portada

- Rotación (7,5 s cada zona): Alicante → Elche → la Vega Baja → el Vinalopó → l'Alcoià → la Marina Baixa → la Marina
  Alta → Valencia → Murcia → Albacete. «Toda España» sale de la rotación y pasa a una línea fija bajo los botones:
  «Desde Alicante: en persona en toda la provincia y alrededores; en remoto, en el resto de España».
- Datos de cada zona en `src/datos/provincias.ts` (titular, antetítulo, coordenadas, pie de escena, economía y
  página). El nombre interno «provincia» se mantiene para no tocar `html[data-provincia]` ni la API `IAC`.
- Escenas en `src/components/portada/escenas/<zona>.html`, con el estilo de las anteriores:
  - Alicante: se mantiene la del castillo y la Explanada, con un buque del puerto añadido.
  - Elche: nave de calzado con un zapato de tacón en el rótulo, entre palmeras con dátiles.
  - Vega Baja: naranjos, el Segura y alcachofas.
  - Vinalopó: cantera de mármol, uva embolsada y bloques de mármol.
  - L'Alcoià: fábricas textiles con chimeneas, bobinas de hilo y una peonza.
  - Marina Baixa: torres de Benidorm y playa.
  - Marina Alta: el Penyal d'Ifac, un puerto deportivo y una barca.
  - Valencia: grúas del puerto y naranjos.
  - Murcia: huerta con limoneros, una conservera y la noria.
  - Albacete: llanura, aerogeneradores, un molino y un helicóptero, por la aeronáutica.
- Bandas: se reutilizan el mosaico (Alicante), las acequias (Vega Baja y Murcia), el Turia (Valencia) y la Sartén
  (Albacete). Hay tres nuevas en `portada.js`: costuras de piel (Elche y Vinalopó), telar (l'Alcoià) y regata
  (las Marinas). Desaparecen las escenas, bandas y estilos de Madrid y España.
- La columna geo cambia «Curiosidad» por «Su economía», sin cifras, y añade un enlace a la página de la zona.
- Titular de la página: «IA y automatización para empresas en Alicante | IA Consultores». Los datos
  estructurados llevan `areaServed` (provincias de Alicante, Valencia, Murcia, Albacete y España) y la localidad
  Alicante, sin calle, porque el domicilio social sigue en Orihuela.
- Sección nueva «Dónde trabajamos» (`#zonas`) entre «Cómo trabajamos» y «Por qué»: las 8 comarcas con sus
  municipios enlazados, las zonas cercanas de otras provincias y enlaces a `/consultoria-ia` y `/soluciones`.
- Menú: Servicios · Soluciones · Zonas · Sobre mí · Contacto. «Cómo trabajamos» sigue en el menú del móvil.

### Páginas locales

- `/consultoria-ia/<zona>`: 43 zonas.
  - 4 provincias: Alicante, Valencia, Región de Murcia y Albacete.
  - 8 comarcas de Alicante. El Comtat va junto a l'Alcoià.
  - 24 municipios de la provincia.
  - 7 municipios de fuera a menos de hora y media: Murcia, Cartagena, Molina de Segura, Yecla, Gandia, Ontinyent y
    Almansa.
- `/soluciones/<slug>`: 30 artículos en cuatro sectores: industria; agroalimentario; turismo, hostelería e
  inmobiliario; y comercio, servicios y logística.
- Índices `/consultoria-ia` y `/soluciones`, sitemap generado en la construcción (`src/pages/sitemap.xml.ts`, que
  sustituye a `public/sitemap.xml`) y migas de pan con `BreadcrumbList`.
- Estructura en `src/datos/zonas.ts` (jerarquía, distancia aproximada en coche desde Alicante, sectores) y
  `src/datos/soluciones.ts`. Textos en `src/textos/` con colecciones de contenido de Astro (`src/content.config.ts`).
- La plantilla pone:
  - el título y el H1, con el otro nombre entre paréntesis: «Xàbia (Jávea)»;
  - una ficha con la distancia desde Alicante, la visita en persona y los sectores;
  - los artículos relacionados, las zonas cercanas y la llamada final.
- Los artículos llevan un aviso fijo: «Son ejemplos de lo que se puede hacer, no casos de clientes».
- **Guía de redacción** en `src/textos/LEEME.md`. La prueba `tests/unit/textos.test.ts` vigila:
  - que la cabecera esté completa y las extensiones mínimas;
  - los enlaces internos;
  - las promesas que no podemos sostener: porcentajes, precios, «casos de éxito», «nuestros clientes»,
    garantías, superlativos, oficinas y plazos;
  - que ninguna frase larga se repita entre páginas. Es la defensa contra las páginas puerta.

### Contacto y asistente

- El formulario admite un campo opcional «Municipio» (`localidad`). Llega en el email del aviso y en el webhook
  de n8n. El flujo de n8n aún no lo guarda en su tabla.
- El asistente sabe que vamos en persona a hora y media de Alicante y que existen las páginas de zonas y
  soluciones (`src/conocimiento/09-zonas-y-soluciones.md`).

## Revisión del usuario (9-nov-2026) y lo que se hizo

1. **Distancias desde Alicante:** aprobadas.
2. **Hechos locales:** seis revisores (Claude Sonnet 5.5) comprobaron con fuentes las afirmaciones sobre el mundo
   real y corrigieron o quitaron las que no tenían evidencia. Los informes están en `docs/revision-hechos/`.
3. **Datos:** confirmado. Configuración para no entrenar modelos, servidores en la UE o servidores propios no
   compartidos, copias de seguridad y adaptación a las necesidades y al tamaño de cada empresa. Va en el bloque
   «Tus datos, bajo control» de todas las páginas locales, en el asistente y en la guía de redacción.
4. **Domicilio y NIF:** el domicilio social sigue en Orihuela; los datos estructurados lo usan con el NIF
   B05723184, igual que el aviso legal.
5. **Sitemaps:** índice `/sitemap.xml` con `sitemap-paginas.xml`, `sitemap-zonas.xml` y `sitemap-soluciones.xml`.
   Cada URL lleva su `lastmod` (campo `actualizado` de cada texto o `LASTMOD_LOCALES`), sin `priority` ni
   `changefreq`. El `robots.txt` declara el índice y cierra `/api/`.
6. **Pendiente fuera de la web (Juan Luis):**
   - Perfil de empresa en Google.
   - Search Console, Bing Webmaster Tools y directorios.
   - Reseñas y enlaces locales.
