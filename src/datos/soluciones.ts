/** Artículos de soluciones (/soluciones/<slug>): qué se puede automatizar en un sector clave de una zona concreta.
 *  Aquí está la estructura (sector y zonas a las que se enlaza); el texto está en src/textos/soluciones/<slug>.md.
 *  Son ejemplos de lo que se puede hacer, nunca casos de clientes. */

export interface Solucion {
  slug: string;
  /** Sector con el que se agrupa en /soluciones */
  sector: string;
  /** Zonas (slugs de datos/zonas.ts) en cuyas páginas aparece el artículo; la primera es la principal */
  zonas: string[];
  /** Nota al final del artículo con un enlace a otra web de la misma sociedad (Agentia Codex S.L.), cuando viene a cuento.
   *  Va aquí y no en el Markdown porque los textos no llevan enlaces externos. */
  relacionado?: { titulo: string; antes: string; enlace: string; textoEnlace: string; despues: string };
}

/** Relevo Asesor (relevoasesor.es) es otra web de Agentia Codex S.L.: compraventa y traspaso de asesorías y gestorías. */
export const RELEVO_ASESOR_ALICANTE = "https://relevoasesor.es/vender-asesoria/alicante/";

export const SECTORES = [
  "Industria y fabricación",
  "Agroalimentario",
  "Turismo, hostelería e inmobiliario",
  "Comercio, servicios y logística",
] as const;

export type Sector = (typeof SECTORES)[number];

export const SOLUCIONES: readonly (Solucion & { sector: Sector })[] = [
  /* Industria y fabricación */
  { slug: "ia-fabricas-calzado-elche", sector: "Industria y fabricación", zonas: ["elche", "baix-vinalopo"] },
  { slug: "automatizacion-calzado-elda-petrer", sector: "Industria y fabricación", zonas: ["elda", "petrer", "vinalopo-mitja"] },
  { slug: "calzado-almansa-villena", sector: "Industria y fabricación", zonas: ["almansa", "villena", "alt-vinalopo", "provincia-de-albacete"] },
  { slug: "ia-empresas-juguete-ibi", sector: "Industria y fabricación", zonas: ["ibi", "alcoia-comtat"] },
  { slug: "ia-textil-alcoi", sector: "Industria y fabricación", zonas: ["alcoi", "alcoia-comtat"] },
  { slug: "automatizacion-textil-hogar-ontinyent", sector: "Industria y fabricación", zonas: ["ontinyent", "provincia-de-valencia"] },
  { slug: "ia-alfombras-textil-crevillent", sector: "Industria y fabricación", zonas: ["crevillent", "baix-vinalopo"] },
  { slug: "ia-marmol-piedra-novelda-pinoso", sector: "Industria y fabricación", zonas: ["novelda", "vinalopo-mitja"] },
  { slug: "automatizacion-fabricas-mueble-yecla", sector: "Industria y fabricación", zonas: ["yecla", "region-de-murcia"] },
  { slug: "ia-cuchilleria-albacete", sector: "Industria y fabricación", zonas: ["provincia-de-albacete"] },
  { slug: "automatizacion-servicios-industriales-cartagena", sector: "Industria y fabricación", zonas: ["cartagena", "region-de-murcia"] },

  /* Agroalimentario */
  { slug: "ia-cooperativas-agricolas-vega-baja", sector: "Agroalimentario", zonas: ["vega-baja", "almoradi", "orihuela"] },
  { slug: "automatizacion-uva-mesa-vinalopo", sector: "Agroalimentario", zonas: ["aspe", "novelda", "vinalopo-mitja"] },
  { slug: "ia-turron-helado-xixona", sector: "Agroalimentario", zonas: ["xixona", "alacanti"] },
  { slug: "ia-bodegas-vinalopo", sector: "Agroalimentario", zonas: ["villena", "alt-vinalopo", "vinalopo-mitja"] },
  { slug: "ia-agroalimentaria-conservas-murcia", sector: "Agroalimentario", zonas: ["molina-de-segura", "murcia", "region-de-murcia"] },
  { slug: "ia-exportadores-citricos-gandia", sector: "Agroalimentario", zonas: ["gandia", "provincia-de-valencia"] },

  /* Turismo, hostelería e inmobiliario */
  { slug: "ia-hoteles-benidorm", sector: "Turismo, hostelería e inmobiliario", zonas: ["benidorm", "marina-baixa"] },
  { slug: "automatizacion-apartamentos-turisticos-torrevieja", sector: "Turismo, hostelería e inmobiliario", zonas: ["torrevieja", "vega-baja", "santa-pola"] },
  { slug: "ia-inmobiliarias-torrevieja-orihuela-costa", sector: "Turismo, hostelería e inmobiliario", zonas: ["torrevieja", "orihuela", "vega-baja"] },
  { slug: "ia-servicios-residentes-extranjeros-marina-alta", sector: "Turismo, hostelería e inmobiliario", zonas: ["xabia", "denia", "calp", "marina-alta"] },
  { slug: "ia-restaurantes-alicante", sector: "Turismo, hostelería e inmobiliario", zonas: ["alicante", "el-campello", "alacanti"] },
  { slug: "ia-hosteleria-altea-la-vila-joiosa", sector: "Turismo, hostelería e inmobiliario", zonas: ["altea", "la-vila-joiosa", "marina-baixa"] },

  /* Comercio, servicios y logística */
  {
    slug: "ia-asesorias-gestorias-alicante", sector: "Comercio, servicios y logística", zonas: ["alicante", "provincia-de-alicante", "san-vicente-del-raspeig"],
    relacionado: {
      titulo: "¿Te planteas vender o traspasar tu despacho?",
      antes: "Relevo Asesor, otra web de Agentia Codex S.L., explica el ",
      enlace: RELEVO_ASESOR_ALICANTE,
      textoEnlace: "traspaso y la venta de asesorías en Alicante",
      despues: ": el mercado de la provincia comarca a comarca, quién compra y cómo se valora un despacho.",
    },
  },
  { slug: "automatizacion-comercios-san-vicente", sector: "Comercio, servicios y logística", zonas: ["san-vicente-del-raspeig", "alicante", "alacanti"] },
  { slug: "ia-clinicas-sant-joan-alicante", sector: "Comercio, servicios y logística", zonas: ["sant-joan-d-alacant", "alicante", "murcia"] },
  { slug: "automatizacion-logistica-transporte-elche", sector: "Comercio, servicios y logística", zonas: ["elche", "alicante", "provincia-de-alicante"] },
  { slug: "ia-empresas-reformas-construccion-alicante", sector: "Comercio, servicios y logística", zonas: ["alicante", "el-campello", "provincia-de-alicante"] },
  { slug: "automatizacion-talleres-mecanicos-elche", sector: "Comercio, servicios y logística", zonas: ["elche", "crevillent", "santa-pola"] },
  { slug: "ia-distribuidores-alimentacion-alicante", sector: "Comercio, servicios y logística", zonas: ["alicante", "alacanti", "provincia-de-alicante"] },
];

export const solucion = (slug: string) => SOLUCIONES.find((s) => s.slug === slug);
export const rutaSolucion = (slug: string) => `/soluciones/${slug}`;
/** Artículos que se muestran en la página de una zona: los suyos y, si no tiene, los de su zona padre */
export const solucionesDe = (slugZona: string) => SOLUCIONES.filter((s) => s.zonas.includes(slugZona));
