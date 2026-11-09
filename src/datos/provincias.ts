/** Zonas de la portada (el nombre «provincia» se mantiene por compatibilidad con html[data-provincia] y IAC):
 *  primero las comarcas de la provincia de Alicante, de Alicante ciudad hacia fuera, y al final las provincias
 *  vecinas. Cada una enseña su escena, su banda, su economía y el enlace a su página (/consultoria-ia/<zona>). */
export type IdProvincia =
  | "alicante"
  | "elche"
  | "vega-baja"
  | "vinalopo"
  | "alcoia"
  | "marina-baixa"
  | "marina-alta"
  | "valencia"
  | "murcia"
  | "albacete";

export interface Provincia {
  id: IdProvincia;
  /** Como aparece en el titular: «Inteligencia artificial para empresas reales en {nombre}.» */
  nombre: string;
  /** Texto del botón de la portada */
  etiqueta: string;
  /** Antetítulo: «Consultoría de IA y automatización · {ante}» */
  ante: string;
  /** Página de la zona (slug de datos/zonas.ts) */
  zona: string;
  /** Coordenadas del municipio de referencia (las ruedas de la columna geo y el punto del minimapa) */
  c: string;
  /** Pie de la escena */
  lugar: string;
  /** Su economía, en una frase (sin cifras) */
  economia: string;
}

/** Orden de la rotación de la portada */
export const PROVINCIAS: readonly Provincia[] = [
  {
    id: "alicante", nombre: "Alicante", etiqueta: "Alicante", ante: "Alicante y l'Alacantí", zona: "alicante",
    c: "38.35°N 0.48°W", lugar: "El puerto y el castillo de Santa Bárbara, Alicante",
    economia: "Comercio, turismo, puerto y servicios profesionales; y en Xixona, el turrón y el helado.",
  },
  {
    id: "elche", nombre: "Elche", etiqueta: "Elche", ante: "Elche y el Baix Vinalopó", zona: "elche",
    c: "38.27°N 0.70°W", lugar: "Naves de calzado entre palmeras, Elche",
    economia: "Calzado, palmeral y campo, logística junto al aeropuerto; alfombras en Crevillent y pesca en Santa Pola.",
  },
  {
    id: "vega-baja", nombre: "la Vega Baja", etiqueta: "Vega Baja", ante: "Orihuela, Torrevieja y la Vega Baja", zona: "vega-baja",
    c: "38.08°N 0.94°W", lugar: "Naranjos y alcachofas junto al Segura, Vega Baja",
    economia: "Cítricos, alcachofa y hortalizas en la huerta del Segura; turismo residencial y salinas en la costa.",
  },
  {
    id: "vinalopo", nombre: "el Vinalopó", etiqueta: "Vinalopó", ante: "Elda, Petrer, Novelda y Villena", zona: "vinalopo-mitja",
    c: "38.48°N 0.79°W", lugar: "Uva embolsada y canteras de mármol, Vinalopó",
    economia: "Calzado en Elda, Petrer y Villena; mármol en Novelda y el Pinós; uva de mesa embolsada y vino.",
  },
  {
    id: "alcoia", nombre: "l'Alcoià", etiqueta: "L'Alcoià", ante: "Alcoi, Ibi y el Comtat", zona: "alcoia-comtat",
    c: "38.70°N 0.47°W", lugar: "Fábricas textiles al pie de la sierra, Alcoi",
    economia: "Textil y papel en Alcoi, juguete en Ibi y Onil, plástico y metal en toda la comarca.",
  },
  {
    id: "marina-baixa", nombre: "la Marina Baixa", etiqueta: "Marina Baixa", ante: "Benidorm, la Vila Joiosa y Altea", zona: "marina-baixa",
    c: "38.54°N 0.13°W", lugar: "Hoteles frente al mar, Benidorm",
    economia: "Hoteles, hostelería y ocio con visitantes de todo el mundo; chocolate en la Vila Joiosa.",
  },
  {
    id: "marina-alta", nombre: "la Marina Alta", etiqueta: "Marina Alta", ante: "Dénia, Xàbia y Calp", zona: "marina-alta",
    c: "38.84°N 0.11°E", lugar: "El Penyal d'Ifac y el puerto, Calp",
    economia: "Turismo residencial, náutica y gastronomía; clientes que hablan muchos idiomas.",
  },
  {
    id: "valencia", nombre: "Valencia", etiqueta: "Valencia", ante: "Provincia de Valencia", zona: "provincia-de-valencia",
    c: "39.47°N 0.38°W", lugar: "Grúas del puerto y naranjos, Valencia",
    economia: "Puerto, cítricos y agroalimentario, automoción; textil hogar en Ontinyent.",
  },
  {
    id: "murcia", nombre: "Murcia", etiqueta: "Murcia", ante: "Región de Murcia", zona: "region-de-murcia",
    c: "37.98°N 1.13°W", lugar: "Limoneros, huerta y noria, Murcia",
    economia: "Agroalimentario y conservas, huerta y logística; mueble en Yecla e industria en Cartagena.",
  },
  {
    id: "albacete", nombre: "Albacete", etiqueta: "Albacete", ante: "Provincia de Albacete", zona: "provincia-de-albacete",
    c: "38.99°N 1.86°W", lugar: "Aerogeneradores sobre la llanura, Albacete",
    economia: "Cuchillería, agroalimentario, aeronáutica y energías renovables; calzado en Almansa.",
  },
];

export const PROVINCIA_INICIAL: IdProvincia = "alicante";

/** Cada zona se ve 7,5 s (antes, 3 s: el cambio de ciudad resultaba muy rápido). El fundido está en portada.css. */
export const ROTACION_MS = 7500;

export const esProvincia = (v: string): v is IdProvincia => PROVINCIAS.some((p) => p.id === v);
