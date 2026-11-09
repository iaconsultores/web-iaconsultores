# Textos de las páginas locales

Guía para escribir (y revisar) las páginas de zona (`/consultoria-ia/<slug>`) y los artículos de soluciones
(`/soluciones/<slug>`). La estructura está en `src/datos/zonas.ts` y `src/datos/soluciones.ts`; aquí solo va el texto.
La prueba `tests/unit/textos.test.ts` comprueba lo que se puede comprobar de esta guía:

```bash
npx vitest run tests/unit/textos.test.ts
```

## Para qué sirven

IA Consultores quiere ser la referencia en inteligencia artificial y automatización para las empresas de la
provincia de Alicante. Juan Luis Toboso trabaja desde Alicante ciudad: primero una llamada de diagnóstico gratuita
de 30 minutos y, si encaja, va a conocer la empresa en persona. Visita empresas a hora y media de Alicante como
mucho (toda la provincia, el sur de la de Valencia, Murcia y su entorno, Almansa); con el resto de España trabaja
en remoto. Coordina una red de especialistas en IA según cada proyecto.

Las páginas tienen que posicionar en búsquedas como «consultoría IA Elche», «automatización empresas Torrevieja»,
«inteligencia artificial para empresas en Alcoi» o «IA para fábricas de calzado en Elda», y convencer a un dueño
de pyme de que pida la llamada. Para Google y para el lector, cada página tiene que aportar algo propio: el tejido
empresarial de esa zona, sus procesos típicos y soluciones concretas para ellos. Una página que solo cambia el
nombre del municipio es una página puerta y Google la castiga.

## Qué ofrecemos (y qué no)

Solo los cinco servicios de la web, con estos nombres cuando se citen:

1. **Soluciones a medida para tus procesos** (lo principal): analizamos cómo trabaja la empresa, medimos dónde se
   pierden tiempo y dinero y diseñamos la solución que encaja, aunque no exista una herramienta que lo haga: un CRM
   a medida, lectura de facturas y documentos con IA hacia su programa, facturación automatizada con el programa que
   ya usa, informes y cuadros de mando que la IA explica. Lo implantamos, formamos al equipo y medimos el resultado.
2. **Automatiza tu empresa**: conectar aplicaciones para que los datos viajen solos (n8n, Make, sus aplicaciones),
   con sistemas seguros y copias de seguridad.
3. **Tu asistente de IA**: un asistente con la información de la empresa que atiende, clasifica y prepara trabajo,
   y responde sobre manuales, contratos, pólizas o convenios citando el documento y el apartado. Siempre con
   supervisión humana.
4. **Tu web**: webs a medida para captar clientes, con asistente de IA, formularios conectados y medición.
5. **IA en tu equipo**: diagnóstico, hoja de ruta, política de uso de la IA (AI Act y RGPD) y cursos a medida.

No somos agencia de marketing: no hacemos vídeos, contenido para redes, gestión de redes ni campañas. No vendemos
un programa de facturación ni de contabilidad propio: trabajamos con el programa que ya usa la empresa. No damos
asesoramiento fiscal, legal ni contable.

## Reglas de honestidad (obligatorias)

- **Nada de clientes, casos ni resultados.** Son ejemplos de lo que se puede hacer: «podemos», «se puede», «una
  opción es». Nunca «hemos ayudado a», «nuestros clientes», «casos de éxito», «una fábrica de Elda ahorró…».
- **Nada de cifras inventadas**: ni porcentajes, ni horas ahorradas, ni habitantes, ni número de empresas, ni datos
  de exportación. Si un dato no es de conocimiento general y seguro, no se pone. La única cifra permitida es la
  distancia aproximada desde Alicante del registro.
- **Nada de precios ni plazos**: cada proyecto se presupuesta tras la llamada de diagnóstico.
- **Nada de marcas de empresas locales** ni relaciones que no existen. Se pueden nombrar lugares públicos
  conocidos (el puerto de Alicante, el aeropuerto de Alicante-Elche, Elche Parque Empresarial, la Universidad de
  Alicante, la UMH) y herramientas de uso común (WhatsApp, Excel, Google, Outlook, un ERP o un programa de gestión).
- **Sin superlativos ni humo**: nada de «líderes», «el mejor», «revolucionar», «garantizamos».
- **Sin oficinas**: trabajamos desde Alicante y vamos a ver a la empresa; no tenemos oficina en cada municipio.
- **Supervisión humana**: cuando la IA decide algo que importa (un presupuesto, una factura, una respuesta a un
  cliente), una persona lo revisa y aprueba. Dilo cuando venga al caso.
- **Datos y RGPD**: con datos personales o de salud, prudencia y mención a la protección de datos. Lo que sí
  podemos afirmar de nuestra forma de trabajar (confirmado el 9-nov-2026): los servicios de IA se configuran para
  que los datos no se usen para entrenar modelos; servidores en la Unión Europea o servidores propios no
  compartidos; copias de seguridad y acceso por persona; nos adaptamos a las necesidades y al tamaño de cada
  empresa. La plantilla ya lo resume en «Tus datos, bajo control».
- Hechos sobre la zona: solo los conocidos y seguros (el calzado en Elche y Elda, el juguete en Ibi, el textil en
  Alcoi, el turrón en Xixona, el turismo en Benidorm, la huerta y los cítricos en la Vega Baja…). Ante la duda,
  más general.

## Estilo

- Español de España, tuteando al lector («tu empresa», «te llamamos»). Primera persona del plural para la
  consultoría («analizamos», «vamos a verte»); a Juan Luis, si se nombra, en tercera persona.
- Frases claras, sin jerga. Si sale un término técnico (OCR, ERP, CRM, RAG), se explica en pocas palabras.
- Concreto: procesos y documentos reales del sector (albaranes, escandallos, partes de trabajo, órdenes de
  fabricación, reservas, reseñas, fichas técnicas…), no generalidades sobre «la transformación digital».
- Sin emojis, sin exclamaciones de anuncio, sin listas de diez puntos vacíos.
- Comillas angulares «» en el texto. En la cabecera, nunca comillas dentro del valor.

### Nombres de lugares

En español, con los nombres de comarca en valenciano como hace la prensa local: l'Alacantí, el Baix Vinalopó,
el Vinalopó Mitjà, l'Alt Vinalopó, l'Alcoià, el Comtat, la Marina Baixa, la Marina Alta. La Vega Baja (el Baix
Segura) es castellanohablante. Municipios: Alicante, Elche (Elx), Orihuela, Torrevieja, Benidorm, Alcoi, San
Vicente del Raspeig, Sant Joan d'Alacant, El Campello, Mutxamel, Xixona, Elda, Petrer, Novelda, Aspe, Monòver, el
Pinós, Villena, Ibi, Onil, Castalla, Cocentaina, la Vila Joiosa, Altea, l'Alfàs del Pi, Dénia, Xàbia, Calp,
Crevillent, Santa Pola, Almoradí, Gandia, Ontinyent, Xàtiva. La primera vez que salga un nombre con forma
castellana muy buscada, pon la otra entre paréntesis: Xàbia (Jávea), Alcoi (Alcoy), Calp (Calpe), Xixona
(Jijona), la Vila Joiosa (Villajoyosa), Crevillent (Crevillente), Petrer (Petrel), Elche (Elx).

## Formato

Markdown con una cabecera YAML entre `---`. Valores siempre entre comillas dobles, en una sola línea.

**Página de zona** (`src/textos/zonas/<slug>.md`): solo la descripción. El título, el H1, la distancia, los
sectores, los artículos relacionados, los municipios cercanos y la llamada a la acción los pone la plantilla.

```markdown
---
descripcion: "110–165 caracteres, con el lugar y lo que ofrecemos; es la meta description de Google."
---
```

**Artículo de solución** (`src/textos/soluciones/<slug>.md`):

```markdown
---
titulo: "30–70 caracteres, con el sector y el lugar: IA para fábricas de calzado en Elche"
descripcion: "110–165 caracteres para Google."
resumen: "80–220 caracteres para la tarjeta del listado."
---
```

Cuerpo:

- Sin H1. Apartados con `##` (al menos tres) y, dentro, `###` si hace falta.
- Sin HTML, sin imágenes y sin enlaces externos.
- Enlaces internos con rutas absolutas, solo a páginas que existen: `/consultoria-ia/<slug>` (ver
  `src/datos/zonas.ts`), `/soluciones/<slug>` (ver `src/datos/soluciones.ts`), `/consultoria-ia`, `/soluciones`,
  `/#contacto`, `/#servicios`, `/#como-trabajamos`. Cada artículo enlaza al menos una zona; enlaza con el nombre
  del lugar o del tema, nunca con «aquí».
- Palabras clave con naturalidad: el lugar y el servicio en el primer párrafo y en uno o dos `##`, sin repetirlos
  hasta la saciedad.

### Extensión mínima del cuerpo

| Tipo | Palabras |
|---|---|
| Municipio | 450 (mejor 550–750) |
| Comarca | 500 (mejor 600–800) |
| Provincia | 600 (mejor 700–950) |
| Solución | 850 (mejor 950–1.300) |

### Estructura orientativa

**Municipio**: 1) el tejido empresarial del municipio y lo que le preocupa a una pyme de allí (dos párrafos);
2) qué podemos automatizar en empresas de ese municipio: de cuatro a seis ideas con `###`, ligadas a sus sectores,
cada una con el problema, lo que haríamos y quién revisa; 3) cómo trabajamos allí: llamada, visita, piloto pequeño,
presupuesto personalizado; 4) opcional, preguntas frecuentes (dos o tres `###`).

**Comarca**: 1) la comarca y su economía, municipio a municipio cuando aporte; 2) procesos que se repiten en sus
empresas y cómo los abordamos; 3) por sectores, con enlaces a los artículos y municipios; 4) cómo trabajamos en la
comarca.

**Provincia**: 1) panorama empresarial; 2) dónde vamos en persona y dónde en remoto (hora y media desde
Alicante); 3) sectores clave y soluciones, con enlaces; 4) cómo empezar.

**Solución**: 1) el sector en esa zona y su día a día (sin cifras); 2) dónde se va el tiempo: los procesos
manuales típicos; 3) soluciones que podemos aplicar: de cuatro a seis con `###`, cada una con qué hace, con qué
herramientas o datos trabaja y dónde revisa una persona; 4) por dónde empezar (un piloto pequeño y medible);
5) datos, seguridad y control; 6) cómo lo hacemos en esa zona (llamada, visita, presupuesto), y opcionalmente
preguntas frecuentes.

## Antes de dar un texto por terminado

1. Pasa la prueba (`npx vitest run tests/unit/textos.test.ts`): cabecera, longitud, enlaces, frases prohibidas y
   frases repetidas entre páginas.
2. Léelo como el dueño de una pyme de esa zona: ¿reconoce su día a día? ¿Sabe qué le proponemos? ¿Hay algo que no
   podamos sostener?
3. Comprueba que no se parece a la página vecina: otras ideas, otros ejemplos, otras frases.
