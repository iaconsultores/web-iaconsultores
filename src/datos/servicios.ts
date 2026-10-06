export interface Servicio {
  titulo: string;
  descripcion: string;
  beneficio: string;
  herramientas: string[];
}

export const SERVICIOS: readonly Servicio[] = [
  {
    titulo: "Automatización de procesos",
    descripcion: "Conectamos tus aplicaciones para que los datos viajen solos: del formulario al CRM, del email a la contabilidad, del ERP al informe.",
    beneficio: "Recuperas horas cada semana y eliminas los errores de copiar y pegar.",
    herramientas: ["n8n", "Make", "APIs REST", "Webhooks", "JSON"],
  },
  {
    titulo: "Agentes y asistentes de IA",
    descripcion: "Asistentes entrenados con la información de tu empresa que atienden, clasifican y preparan trabajo, siempre con supervisión humana.",
    beneficio: "Respuestas rápidas y coherentes 24/7, y tu equipo dedicado a lo que aporta valor.",
    herramientas: ["Claude", "ChatGPT", "Copilot", "Gemini"],
  },
  {
    titulo: "CRM a medida",
    descripcion: "Un CRM que se adapta a tu forma de vender: embudos, tareas, recordatorios y seguimiento automático por WhatsApp o email.",
    beneficio: "Ningún contacto sin respuesta y visión clara de las ventas en juego.",
    herramientas: ["GoHighLevel", "CRM propio", "WhatsApp"],
  },
  {
    titulo: "Facturación y contabilidad con IA",
    descripcion: "Facturas que se emiten, se reciben y se contabilizan casi solas, con Verifactu y la revisión final en tus manos.",
    beneficio: "Menos tiempo administrativo, cierres más rápidos y fiscalidad al día.",
    herramientas: ["Agentia Contable", "Verifactu", "OCR"],
  },
  {
    titulo: "RAG: pregunta a tus documentos",
    descripcion: "Una IA que responde sobre tus manuales, contratos, pólizas o convenios citando el documento y el apartado exacto.",
    beneficio: "El conocimiento de la empresa, accesible en segundos y sin depender de una persona.",
    herramientas: ["RAG", "Embeddings", "Claude"],
  },
  {
    titulo: "Documentos con IA",
    descripcion: "Lectura automática de facturas, albaranes, contratos y correos con OCR e IA, directos a tu ERP o contabilidad.",
    beneficio: "Se acabó teclear documentos: menos errores y datos al momento.",
    herramientas: ["OCR", "Visión IA", "Extracción de datos"],
  },
  {
    titulo: "Informes y cuadros de mando",
    descripcion: "Ventas, banco y ERP consolidados en informes que la IA explica en lenguaje claro.",
    beneficio: "Decisiones con números al día, sin perseguir hojas de cálculo.",
    herramientas: ["Power BI", "Excel", "Google Sheets"],
  },
  {
    titulo: "Webs a medida enfocadas a negocio",
    descripcion: "Webs diferentes, pensadas para captar y convertir clientes, con chat IA, automatizaciones y medición. Como esta.",
    beneficio: "Una web que trabaja para tu negocio, no solo una web bonita.",
    herramientas: ["Astro", "Node.js", "Chat IA"],
  },
  {
    titulo: "Integración e infraestructura",
    descripcion: "Conectamos sistemas por API y desplegamos en la nube, VPS o Docker con seguridad y copias.",
    beneficio: "Todo conectado, estable y bajo control.",
    herramientas: ["APIs", "Docker", "VPS", "Cloud", "DNS"],
  },
  {
    titulo: "Adopción, formación y gobernanza",
    descripcion: "Diagnóstico, hoja de ruta, políticas de uso de la IA (AI Act y RGPD) y formación práctica para tu equipo.",
    beneficio: "Tu equipo usa la IA con seguridad, criterio y resultados medibles.",
    herramientas: ["AI Act", "RGPD", "Formación"],
  },
];
