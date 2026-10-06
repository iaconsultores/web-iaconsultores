/** Línea del CV: el arranque va en negrita y el resto lleva su propio espacio o signo inicial */
export interface LineaCV {
  inicio: string;
  resto: string;
}

/** CV de Juan Luis: una sola fuente para /mohure (en pantalla) y /mohure/cv (el PDF) */
export const CV = {
  nombre: "Juan Luis Toboso",
  rol: "Consultor de IA y automatización · Economista · Asesor fiscal",
  zona: "Provincia de Alicante (presencial, híbrido o remoto)",
  perfil:
    "Economista con más de 10 años dirigiendo empresas (finanzas, equipos comerciales y backoffice) que diseña e implanta soluciones de inteligencia artificial y automatización. Primero entiendo el proceso y los números del negocio; después elijo la herramienta. He diseñado y dirijo Agentia Contable, una plataforma de gestión con IA en producción, programada con agentes de IA (Claude Code y Codex principalmente). Disponibilidad inmediata como freelance, con una dedicación que valoramos según cada proyecto.",
  experiencia: [
    {
      inicio: "Agentia Contable",
      resto:
        " (agentiacontable.com), diseño y dirección del producto (2026). Plataforma cloud de contabilidad, facturación, bancos, fiscalidad y CRM con IA, en producción desde septiembre de 2026: API REST de 35 endpoints (OpenAPI 3.1), 29 webhooks firmados con HMAC, lectura de documentos con OCR e IA y despliegues en Cloudflare y Supabase.",
    },
    { inicio: "Director financiero", resto: " en una agencia de seguros con más de 30.000 clientes, con dirección de equipos comerciales de seguros." },
    { inicio: "Socio y gerente", resto: " de una agencia inmobiliaria durante más de una década." },
    { inicio: "Administrador", resto: " de varias sociedades." },
    { inicio: "Más de 50 webs", resto: " creadas en los últimos 10 años." },
    { inicio: "Funcionario de la AEAT", resto: ", en excedencia." },
  ] satisfies LineaCV[],
  formacion: [
    {
      inicio: "Máster en IA Aplicada y Optimización de Procesos Productivos",
      resto:
        " (Universidad Tecnológica Atlántico Mediterráneo, UTAMED; 30 ECTS; finalización prevista en octubre de 2026): LLM y prompting, RAG, automatización no-code (Zapier, Make, n8n y Power Automate), agentes, multimodal y OCR, AI Act y RGPD.",
    },
    { inicio: "Postgrado en Dirección y Gestión de Proyectos Empresariales", resto: " (Centro Europeo de Postgrado, CEUPE; 380 h)." },
    { inicio: "Economista", resto: ": Administración y Dirección de Empresas (Universidad de Alicante). CFA Level I." },
    { inicio: "Certificación EFPA en Ley de Crédito Inmobiliario", resto: ". Mediador de seguros (Grupo A)." },
    { inicio: "Inglés", resto: ": nivel muy alto (C1-C2)." },
  ] satisfies LineaCV[],
};

/** Cifras de /mohure. Cada una figura igual en la base de conocimiento del asistente (lo comprueba una prueba). */
export const CIFRAS = [
  { tema: "Gestión", cifra: "+10", unidad: "años", texto: "dirigiendo empresas" },
  { tema: "Experiencia técnica", cifra: "+1.000", unidad: "PR", texto: "fusionadas en GitHub" },
  { tema: "API de Agentia Contable", cifra: "35", unidad: "endpoints", texto: "REST, documentados con OpenAPI 3.1" },
  { tema: "Integraciones", cifra: "29", unidad: "webhooks", texto: "firmados con HMAC-SHA256" },
  { tema: "Webs", cifra: "+50", unidad: "webs", texto: "creadas en los últimos 10 años" },
] as const;
