export interface Servicio {
  titulo: string;
  descripcion: string;
  beneficio: string;
  herramientas: string[];
}

/** Las cuatro fichas de la sección de servicios (sin precios: todo se presupuesta tras la llamada de diagnóstico) */
export const SERVICIOS: readonly Servicio[] = [
  {
    titulo: "Tu web",
    descripcion: "Webs a medida pensadas para captar clientes: claras, rápidas y enfocadas a tu negocio. Con un asistente de IA que atiende a tus visitas a cualquier hora y les propone una llamada, formularios conectados a tus herramientas y medición de lo que pasa en la web. Como esta.",
    beneficio: "Una web que trabaja para tu negocio, no solo una web bonita.",
    herramientas: ["Web a medida", "Asistente de IA", "Formularios conectados", "Medición"],
  },
  {
    titulo: "Tu asistente de IA",
    descripcion: "Un asistente con la información de tu empresa que atiende, clasifica y prepara trabajo, y que responde sobre tus manuales, contratos, pólizas o convenios citando el documento y el apartado exacto. Siempre con supervisión humana.",
    beneficio: "Respuestas rápidas y coherentes, y el conocimiento de la empresa accesible sin depender de una persona.",
    herramientas: ["Claude", "ChatGPT", "Gemini", "Tus documentos"],
  },
  {
    titulo: "Automatiza tu empresa",
    descripcion: "Conectamos tus aplicaciones para que los datos viajen solos, sin copiar y pegar, y dejamos tus sistemas conectados, seguros y con copias de seguridad.",
    beneficio: "Recuperas horas cada semana, cometes menos errores y todo queda bajo control.",
    herramientas: ["n8n", "Make", "Tus aplicaciones"],
  },
  {
    titulo: "IA en tu equipo",
    descripcion: "Diagnóstico, hoja de ruta, política de uso de la IA (AI Act y RGPD) y cursos de IA adaptados a tu empresa y a tus empleados.",
    beneficio: "Tu equipo usa la IA con seguridad, criterio y resultados medibles.",
    herramientas: ["Cursos a medida", "AI Act", "RGPD"],
  },
];
