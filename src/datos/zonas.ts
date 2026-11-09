/** Zonas con página propia (/consultoria-ia/<slug>): la provincia de Alicante y sus comarcas y municipios
 *  grandes, más las provincias vecinas y los municipios grandes a menos de hora y media de Alicante.
 *  Aquí está la estructura (nombres, jerarquía, distancia, sectores); el texto de cada página está en
 *  src/textos/zonas/<slug>.md. Los nombres van en valenciano donde es el nombre oficial o el habitual,
 *  con el otro nombre en `alt` para quien lo busque así. */

export type TipoZona = "provincia" | "comarca" | "municipio";

export interface Zona {
  slug: string;
  tipo: TipoZona;
  /** Como se escribe en la web: «Elche», «la Vega Baja», «Xàbia», «l'Alcoià y el Comtat» */
  nombre: string;
  /** Otro nombre por el que se busca: «Elx», «Jávea», «Alcoy» */
  alt?: string;
  /** Con preposición y artículo: «en Elche», «en la Vega Baja», «en el Baix Vinalopó» */
  en: string;
  /** «de Elche», «de la Vega Baja», «del Baix Vinalopó» */
  de: string;
  /** Zona de la que depende (comarca o provincia); null para las provincias */
  padre: string | null;
  /** Distancia aproximada en coche desde Alicante, en texto */
  distancia: string;
  /** «si»: visita en persona (a menos de hora y media de Alicante); «parcial»: solo parte de la zona */
  visita: "si" | "parcial";
  /** Sectores principales: solo hechos conocidos, sin cifras */
  sectores: string[];
  /** Municipios principales (para comarcas y provincias) */
  municipios?: string[];
}

export const ZONAS: readonly Zona[] = [
  /* ---------- Provincias ---------- */
  {
    slug: "provincia-de-alicante", tipo: "provincia", nombre: "la provincia de Alicante", en: "en la provincia de Alicante", de: "de la provincia de Alicante",
    padre: null, distancia: "toda la provincia, a menos de hora y media de Alicante", visita: "si",
    sectores: ["Turismo y hostelería", "Calzado", "Juguete", "Textil", "Agroalimentario", "Comercio y servicios", "Logística", "Inmobiliario"],
    municipios: ["Alicante", "Elche", "Torrevieja", "Orihuela", "Benidorm", "Alcoi", "Elda", "Dénia"],
  },
  {
    slug: "provincia-de-valencia", tipo: "provincia", nombre: "la provincia de Valencia", en: "en la provincia de Valencia", de: "de la provincia de Valencia",
    padre: null, distancia: "el sur de la provincia, a partir de una hora de Alicante", visita: "parcial",
    sectores: ["Agroalimentario y cítricos", "Logística portuaria", "Automoción", "Textil hogar", "Mueble", "Turismo"],
    municipios: ["Valencia", "Gandia", "Ontinyent", "Xàtiva", "Alzira", "Sagunt"],
  },
  {
    slug: "region-de-murcia", tipo: "provincia", nombre: "la Región de Murcia", en: "en la Región de Murcia", de: "de la Región de Murcia",
    padre: null, distancia: "Murcia, a una hora de Alicante; Cartagena, a una hora y cuarto", visita: "parcial",
    sectores: ["Agroalimentario y conservas", "Agricultura", "Logística", "Mueble", "Industria química y energía", "Turismo"],
    municipios: ["Murcia", "Cartagena", "Molina de Segura", "Yecla", "Lorca", "Cieza"],
  },
  {
    slug: "provincia-de-albacete", tipo: "provincia", nombre: "la provincia de Albacete", en: "en la provincia de Albacete", de: "de la provincia de Albacete",
    padre: null, distancia: "Almansa, a una hora de Alicante; la capital, a algo más de hora y media", visita: "parcial",
    sectores: ["Cuchillería", "Agroalimentario", "Calzado", "Aeronáutica", "Energías renovables", "Logística"],
    municipios: ["Albacete", "Almansa", "Hellín", "Villarrobledo", "Caudete"],
  },

  /* ---------- Comarcas de la provincia de Alicante ---------- */
  {
    slug: "alacanti", tipo: "comarca", nombre: "l'Alacantí", en: "en l'Alacantí", de: "de l'Alacantí",
    padre: "provincia-de-alicante", distancia: "nuestra base: de 10 a 30 minutos de Alicante", visita: "si",
    sectores: ["Comercio y servicios", "Turismo y hostelería", "Puerto y logística", "Sanidad", "Turrón y helado"],
    municipios: ["Alicante", "San Vicente del Raspeig", "Sant Joan d'Alacant", "El Campello", "Mutxamel", "Xixona"],
  },
  {
    slug: "baix-vinalopo", tipo: "comarca", nombre: "el Baix Vinalopó", en: "en el Baix Vinalopó", de: "del Baix Vinalopó",
    padre: "provincia-de-alicante", distancia: "entre 25 y 35 minutos de Alicante", visita: "si",
    sectores: ["Calzado", "Agricultura y palmeral", "Logística", "Alfombras y textil", "Pesca y turismo"],
    municipios: ["Elche", "Crevillent", "Santa Pola"],
  },
  {
    slug: "vega-baja", tipo: "comarca", nombre: "la Vega Baja", alt: "el Baix Segura", en: "en la Vega Baja", de: "de la Vega Baja",
    padre: "provincia-de-alicante", distancia: "entre 35 y 60 minutos de Alicante", visita: "si",
    sectores: ["Agricultura", "Industria agroalimentaria", "Turismo residencial", "Inmobiliario", "Comercio"],
    municipios: ["Orihuela", "Torrevieja", "Almoradí", "Callosa de Segura", "Pilar de la Horadada", "Guardamar del Segura", "Rojales"],
  },
  {
    slug: "vinalopo-mitja", tipo: "comarca", nombre: "el Vinalopó Mitjà", alt: "el Medio Vinalopó", en: "en el Vinalopó Mitjà", de: "del Vinalopó Mitjà",
    padre: "provincia-de-alicante", distancia: "entre 25 y 45 minutos de Alicante", visita: "si",
    sectores: ["Calzado", "Mármol y piedra natural", "Uva de mesa embolsada", "Vino", "Especias y condimentos"],
    municipios: ["Elda", "Petrer", "Novelda", "Aspe", "Monòver", "el Pinós", "Monforte del Cid"],
  },
  {
    slug: "alt-vinalopo", tipo: "comarca", nombre: "l'Alt Vinalopó", alt: "el Alto Vinalopó", en: "en l'Alt Vinalopó", de: "de l'Alt Vinalopó",
    padre: "provincia-de-alicante", distancia: "entre 45 y 55 minutos de Alicante", visita: "si",
    sectores: ["Calzado", "Industria", "Agricultura y vino", "Logística", "Comercio"],
    municipios: ["Villena", "Sax", "Biar", "Beneixama", "Salinas"],
  },
  {
    slug: "alcoia-comtat", tipo: "comarca", nombre: "l'Alcoià y el Comtat", en: "en l'Alcoià y el Comtat", de: "de l'Alcoià y el Comtat",
    padre: "provincia-de-alicante", distancia: "entre 40 y 60 minutos de Alicante", visita: "si",
    sectores: ["Textil", "Juguete", "Plástico y metal", "Papel y artes gráficas", "Alimentación"],
    municipios: ["Alcoi", "Ibi", "Onil", "Castalla", "Banyeres de Mariola", "Cocentaina", "Muro d'Alcoi"],
  },
  {
    slug: "marina-baixa", tipo: "comarca", nombre: "la Marina Baixa", alt: "la Marina Baja", en: "en la Marina Baixa", de: "de la Marina Baixa",
    padre: "provincia-de-alicante", distancia: "entre 30 y 50 minutos de Alicante", visita: "si",
    sectores: ["Hoteles y hostelería", "Turismo", "Inmobiliario", "Comercio", "Chocolate", "Agricultura"],
    municipios: ["Benidorm", "la Vila Joiosa", "Altea", "l'Alfàs del Pi", "la Nucia", "Finestrat", "Callosa d'en Sarrià"],
  },
  {
    slug: "marina-alta", tipo: "comarca", nombre: "la Marina Alta", en: "en la Marina Alta", de: "de la Marina Alta",
    padre: "provincia-de-alicante", distancia: "entre 55 y 80 minutos de Alicante", visita: "si",
    sectores: ["Turismo residencial", "Servicios a residentes extranjeros", "Náutica", "Gastronomía", "Inmobiliario", "Cítricos"],
    municipios: ["Dénia", "Xàbia", "Calp", "Teulada-Moraira", "Benissa", "Pego", "Ondara", "Pedreguer"],
  },

  /* ---------- Municipios de la provincia de Alicante ---------- */
  { slug: "alicante", tipo: "municipio", nombre: "Alicante", alt: "Alacant", en: "en Alicante", de: "de Alicante", padre: "alacanti", distancia: "nuestra base", visita: "si", sectores: ["Comercio", "Turismo y hostelería", "Puerto y logística", "Servicios profesionales", "Sanidad"] },
  { slug: "elche", tipo: "municipio", nombre: "Elche", alt: "Elx", en: "en Elche", de: "de Elche", padre: "baix-vinalopo", distancia: "a unos 25 minutos de Alicante", visita: "si", sectores: ["Calzado", "Agroalimentario", "Logística", "Industria", "Comercio"] },
  { slug: "torrevieja", tipo: "municipio", nombre: "Torrevieja", en: "en Torrevieja", de: "de Torrevieja", padre: "vega-baja", distancia: "a unos 45 minutos de Alicante", visita: "si", sectores: ["Turismo residencial", "Inmobiliario", "Hostelería", "Comercio", "Servicios a residentes extranjeros"] },
  { slug: "orihuela", tipo: "municipio", nombre: "Orihuela", alt: "Oriola", en: "en Orihuela", de: "de Orihuela", padre: "vega-baja", distancia: "a unos 45 minutos de Alicante", visita: "si", sectores: ["Agricultura", "Industria agroalimentaria", "Turismo de costa", "Comercio"] },
  { slug: "benidorm", tipo: "municipio", nombre: "Benidorm", en: "en Benidorm", de: "de Benidorm", padre: "marina-baixa", distancia: "a unos 40 minutos de Alicante", visita: "si", sectores: ["Hoteles", "Hostelería", "Ocio", "Inmobiliario", "Comercio"] },
  { slug: "alcoi", tipo: "municipio", nombre: "Alcoi", alt: "Alcoy", en: "en Alcoi", de: "de Alcoi", padre: "alcoia-comtat", distancia: "a unos 50 minutos de Alicante", visita: "si", sectores: ["Textil", "Metal", "Alimentación", "Comercio"] },
  { slug: "san-vicente-del-raspeig", tipo: "municipio", nombre: "San Vicente del Raspeig", alt: "Sant Vicent del Raspeig", en: "en San Vicente del Raspeig", de: "de San Vicente del Raspeig", padre: "alacanti", distancia: "a unos 15 minutos de Alicante", visita: "si", sectores: ["Comercio", "Industria", "Servicios", "Universidad"] },
  { slug: "elda", tipo: "municipio", nombre: "Elda", en: "en Elda", de: "de Elda", padre: "vinalopo-mitja", distancia: "a unos 35 minutos de Alicante", visita: "si", sectores: ["Calzado", "Industria auxiliar", "Comercio", "Servicios"] },
  { slug: "petrer", tipo: "municipio", nombre: "Petrer", alt: "Petrel", en: "en Petrer", de: "de Petrer", padre: "vinalopo-mitja", distancia: "a unos 35 minutos de Alicante", visita: "si", sectores: ["Calzado", "Industria auxiliar del calzado", "Comercio"] },
  { slug: "villena", tipo: "municipio", nombre: "Villena", en: "en Villena", de: "de Villena", padre: "alt-vinalopo", distancia: "a unos 50 minutos de Alicante", visita: "si", sectores: ["Calzado", "Industria", "Agricultura y vino", "Logística", "Comercio"] },
  { slug: "denia", tipo: "municipio", nombre: "Dénia", alt: "Denia", en: "en Dénia", de: "de Dénia", padre: "marina-alta", distancia: "a una hora y cuarto de Alicante", visita: "si", sectores: ["Turismo", "Náutica y puerto", "Gastronomía", "Inmobiliario", "Comercio"] },
  { slug: "santa-pola", tipo: "municipio", nombre: "Santa Pola", en: "en Santa Pola", de: "de Santa Pola", padre: "baix-vinalopo", distancia: "a unos 25 minutos de Alicante", visita: "si", sectores: ["Pesca", "Turismo", "Hostelería", "Comercio"] },
  { slug: "xabia", tipo: "municipio", nombre: "Xàbia", alt: "Jávea", en: "en Xàbia", de: "de Xàbia", padre: "marina-alta", distancia: "a una hora y veinte de Alicante", visita: "si", sectores: ["Turismo residencial", "Inmobiliario", "Servicios a residentes extranjeros", "Náutica", "Hostelería"] },
  { slug: "la-vila-joiosa", tipo: "municipio", nombre: "la Vila Joiosa", alt: "Villajoyosa", en: "en la Vila Joiosa", de: "de la Vila Joiosa", padre: "marina-baixa", distancia: "a unos 30 minutos de Alicante", visita: "si", sectores: ["Chocolate", "Turismo", "Pesca", "Comercio"] },
  { slug: "sant-joan-d-alacant", tipo: "municipio", nombre: "Sant Joan d'Alacant", alt: "San Juan de Alicante", en: "en Sant Joan d'Alacant", de: "de Sant Joan d'Alacant", padre: "alacanti", distancia: "a unos 15 minutos de Alicante", visita: "si", sectores: ["Sanidad", "Comercio", "Servicios"] },
  { slug: "el-campello", tipo: "municipio", nombre: "El Campello", en: "en El Campello", de: "de El Campello", padre: "alacanti", distancia: "a unos 20 minutos de Alicante", visita: "si", sectores: ["Turismo", "Hostelería", "Pesca", "Comercio"] },
  { slug: "crevillent", tipo: "municipio", nombre: "Crevillent", alt: "Crevillente", en: "en Crevillent", de: "de Crevillent", padre: "baix-vinalopo", distancia: "a unos 35 minutos de Alicante", visita: "si", sectores: ["Alfombras y textil", "Industria", "Agricultura"] },
  { slug: "novelda", tipo: "municipio", nombre: "Novelda", en: "en Novelda", de: "de Novelda", padre: "vinalopo-mitja", distancia: "a unos 30 minutos de Alicante", visita: "si", sectores: ["Mármol y piedra natural", "Especias y condimentos", "Uva de mesa embolsada"] },
  { slug: "ibi", tipo: "municipio", nombre: "Ibi", en: "en Ibi", de: "de Ibi", padre: "alcoia-comtat", distancia: "a unos 40 minutos de Alicante", visita: "si", sectores: ["Juguete", "Plástico", "Metal", "Industria auxiliar"] },
  { slug: "calp", tipo: "municipio", nombre: "Calp", alt: "Calpe", en: "en Calp", de: "de Calp", padre: "marina-alta", distancia: "a unos 55 minutos de Alicante", visita: "si", sectores: ["Turismo", "Hostelería", "Inmobiliario", "Pesca"] },
  { slug: "altea", tipo: "municipio", nombre: "Altea", en: "en Altea", de: "de Altea", padre: "marina-baixa", distancia: "a unos 50 minutos de Alicante", visita: "si", sectores: ["Turismo", "Hostelería", "Inmobiliario", "Comercio"] },
  { slug: "aspe", tipo: "municipio", nombre: "Aspe", en: "en Aspe", de: "de Aspe", padre: "vinalopo-mitja", distancia: "a unos 30 minutos de Alicante", visita: "si", sectores: ["Uva de mesa embolsada", "Calzado", "Industria"] },
  { slug: "xixona", tipo: "municipio", nombre: "Xixona", alt: "Jijona", en: "en Xixona", de: "de Xixona", padre: "alacanti", distancia: "a unos 30 minutos de Alicante", visita: "si", sectores: ["Turrón", "Helado", "Industria alimentaria"] },
  { slug: "almoradi", tipo: "municipio", nombre: "Almoradí", en: "en Almoradí", de: "de Almoradí", padre: "vega-baja", distancia: "a unos 45 minutos de Alicante", visita: "si", sectores: ["Agricultura", "Industria agroalimentaria", "Comercio"] },

  /* ---------- Municipios grandes de las provincias vecinas, a menos de hora y media ---------- */
  { slug: "murcia", tipo: "municipio", nombre: "Murcia", en: "en Murcia", de: "de Murcia", padre: "region-de-murcia", distancia: "a una hora de Alicante", visita: "si", sectores: ["Agroalimentario", "Comercio y servicios", "Logística", "Sanidad"] },
  { slug: "cartagena", tipo: "municipio", nombre: "Cartagena", en: "en Cartagena", de: "de Cartagena", padre: "region-de-murcia", distancia: "a una hora y cuarto de Alicante", visita: "si", sectores: ["Industria química y energía", "Naval", "Puerto", "Servicios industriales", "Turismo"] },
  { slug: "molina-de-segura", tipo: "municipio", nombre: "Molina de Segura", en: "en Molina de Segura", de: "de Molina de Segura", padre: "region-de-murcia", distancia: "a algo más de una hora de Alicante", visita: "si", sectores: ["Conservas y agroalimentario", "Industria", "Logística"] },
  { slug: "yecla", tipo: "municipio", nombre: "Yecla", en: "en Yecla", de: "de Yecla", padre: "region-de-murcia", distancia: "a algo más de una hora de Alicante", visita: "si", sectores: ["Mueble", "Vino", "Industria"] },
  { slug: "gandia", tipo: "municipio", nombre: "Gandia", alt: "Gandía", en: "en Gandia", de: "de Gandia", padre: "provincia-de-valencia", distancia: "a una hora y veinte de Alicante", visita: "si", sectores: ["Turismo", "Cítricos", "Comercio", "Puerto"] },
  { slug: "ontinyent", tipo: "municipio", nombre: "Ontinyent", alt: "Onteniente", en: "en Ontinyent", de: "de Ontinyent", padre: "provincia-de-valencia", distancia: "a algo más de una hora de Alicante", visita: "si", sectores: ["Textil hogar", "Industria", "Comercio"] },
  { slug: "almansa", tipo: "municipio", nombre: "Almansa", en: "en Almansa", de: "de Almansa", padre: "provincia-de-albacete", distancia: "a algo más de una hora de Alicante", visita: "si", sectores: ["Calzado", "Industria", "Logística"] },
];

export const zona = (slug: string): Zona | undefined => ZONAS.find((z) => z.slug === slug);
export const hijas = (slug: string): Zona[] => ZONAS.filter((z) => z.padre === slug);
/** La provincia a la que pertenece una zona (ella misma si es provincia) */
export function provinciaDe(z: Zona): Zona {
  let actual = z;
  while (actual.padre) actual = zona(actual.padre) ?? actual;
  return actual;
}
/** Ruta de la página de una zona */
export const rutaZona = (slug: string) => `/consultoria-ia/${slug}`;
/** Con mayúscula inicial: «La Vega Baja», «L'Alcoià y el Comtat» */
export const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
