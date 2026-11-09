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

## Para revisar antes de publicar

1. **Distancias en coche desde Alicante** (`src/datos/zonas.ts`): son aproximaciones redondeadas, por ejemplo
   Elche a unos 25 min, Dénia a 1 h 15 y Xàbia a 1 h 20. Conviene repasarlas.
2. **Hechos locales** que los redactores marcaron como menos obvios. Los creo correctos, pero conviene una lectura
   de alguien de la zona:
   - **Alicante:** la EUIPO en Alicante; el campus de la Universidad de Alicante en San Vicente; el hospital y el
     campus de la UMH en Sant Joan; Dénia, ciudad creativa de la gastronomía de la UNESCO.
   - **Agroalimentario:** la DOP de la uva embolsada del Vinalopó; las IGP del turrón de Jijona y de Alicante; la
     granada mollar de Elche.
   - **Industria:** el Monte Coto (el Pinós) y el Crema Marfil; Onil y sus muñecas; Alcoi y el papel de fumar.
   - **Albacete y Valencia:** la aeronáutica en Albacete; el campus de la UPV en Gandia y en Alcoi.
   - **Cartagena:** el valle de Escombreras.
   - **Turismo:** Benidorm abierto todo el año.
3. **Promesas de método** que aparecen en los textos y deben ser ciertas en la práctica:
   - configurar los servicios de IA para que los datos no se usen para entrenar modelos;
   - preferir servicios que guardan los datos en la Unión Europea (artículo de clínicas);
   - copias de seguridad y accesos por persona.
4. **Visitas fuera del radio:**
   - Albacete capital (algo más de hora y media): «visita concertada o remoto».
   - Valencia capital: lo mismo; en persona, el sur de la provincia (la Safor, la Costera y la Vall d'Albaida).
   - Caudete, junto a Villena, sale como zona de visita en la página de Albacete.
5. **Dirección:** los datos estructurados dicen «Alicante» como localidad y el aviso legal mantiene el domicilio
   social de Orihuela. Si la sociedad cambia de domicilio, hay que actualizar el aviso legal.
6. **Siguientes pasos de SEO local**, fuera de la web y a cargo de Juan Luis:
   - un perfil de empresa en Google con la provincia de Alicante como zona de servicio;
   - enviar el sitemap a Google Search Console;
   - enlaces desde asociaciones y cámaras de comercio.
