export type Nivel = "experiencia_real" | "formacion_y_proyecto" | "aprendiendo" | "sin_experiencia";

export const NIVELES: Record<Nivel, { etiqueta: string; orden: number }> = {
  experiencia_real: { etiqueta: "Experiencia real", orden: 3 },
  formacion_y_proyecto: { etiqueta: "Formación + proyecto propio", orden: 2 },
  aprendiendo: { etiqueta: "Aprendiendo", orden: 1 },
  sin_experiencia: { etiqueta: "Sin experiencia aún", orden: 0 },
};

export interface Evidencia {
  id: string;
  requisito: string;
  grupo: "requisito" | "valora";
  nivel: Nivel;
  detalle: string;
  enlace?: string;
}

export const NOTA_AGENTIA =
  "Agentia Contable es una plataforma diseñada y dirigida por Juan Luis Toboso y programada con agentes de IA (Claude Code y Codex principalmente).";

/** Anexo A del spec, confirmado por Juan Luis el 5-oct-2026 y actualizado el 6-oct-2026. Ningún texto de la web ni del asistente puede superar estos niveles. */
export const EVIDENCIAS: readonly Evidencia[] = [
  { id: "make-n8n", grupo: "requisito", requisito: "Automatización con Make o n8n", nivel: "formacion_y_proyecto", detalle: "Flujo n8n propio conectado a esta web: recibe cada lead con firma HMAC, lo clasifica con Claude y lo guarda en una tabla (Docker + Cloudflare Tunnel). Base: módulo de automatización no-code del máster (Zapier, Make, n8n y Power Automate).", enlace: "https://github.com/iaconsultores/web-iaconsultores/tree/main/automatizaciones/n8n" },
  { id: "gohighlevel", grupo: "requisito", requisito: "GoHighLevel (no imprescindible)", nivel: "sin_experiencia", detalle: "No lo ha usado, pero sí otros CRM y ERP, y construye los suyos: el módulo CRM de Agentia Contable y un CRM propio en desarrollo (embudos, tareas y seguimiento). Puede aprenderlo rápido y, si se prefiere, puede crear uno similar a medida." },
  { id: "apis", grupo: "requisito", requisito: "APIs REST, webhooks y JSON", nivel: "experiencia_real", detalle: "Agentia Contable: API v1 de 35 endpoints (OpenAPI 3.1), 29 webhooks firmados con HMAC-SHA256 e integraciones con Stripe, Resend y la API de Claude, OpenAI, Mistral y otros.", enlace: "https://agentiacontable.com" },
  { id: "modelos-ia", grupo: "requisito", requisito: "ChatGPT, Claude, Copilot y Gemini", nivel: "experiencia_real", detalle: "Uso habitual y comparado de modelos OpenAI, Gemini, NotebookLM, Copilot y Claude, además de Mistral, Jev y otros modelos. Claude, integrado en producción en Agentia Contable (lectura de documentos, clasificación y asistente); Claude Code y Codex, como herramientas de desarrollo." },
  { id: "procesos", grupo: "requisito", requisito: "Análisis de procesos", nivel: "experiencia_real", detalle: "Más de 10 años dirigiendo empresas (finanzas, equipos comerciales y backoffice); Postgrado en Dirección y Gestión de Proyectos Empresariales (Centro Europeo de Postgrado) y Máster en IA Aplicada y Optimización de Procesos Productivos (UTAMED, finalización prevista en octubre de 2026)." },
  { id: "cloud", grupo: "requisito", requisito: "Cloud y despliegues", nivel: "experiencia_real", detalle: "Más de 50 webs creadas en los últimos 10 años; Cloudflare Workers, Supabase, Hostinger (esta web), DNS y correo." },
  { id: "vps", grupo: "requisito", requisito: "VPS", nivel: "experiencia_real", detalle: "Uso básico: ha tenido VPS, con ayuda o revisión de terceros en la configuración, y ha desarrollado aplicaciones en ellos. No se considera un profesional técnico de sistemas." },
  { id: "autonomia", grupo: "requisito", requisito: "Autonomía", nivel: "experiencia_real", detalle: "Agentia Contable de principio a fin, en producción desde septiembre de 2026.", enlace: "https://agentiacontable.com" },
  { id: "clientes", grupo: "requisito", requisito: "Trato con clientes", nivel: "experiencia_real", detalle: "Director financiero en una agencia de seguros con más de 30.000 clientes; socio y gerente de una agencia inmobiliaria durante más de una década; dirección de equipos comerciales de seguros." },
  { id: "sharepoint-onedrive", grupo: "valora", requisito: "SharePoint y OneDrive", nivel: "experiencia_real", detalle: "Uso de SharePoint y OneDrive; correo corporativo en Microsoft 365." },
  { id: "excel-sheets", grupo: "valora", requisito: "Excel y Google Sheets", nivel: "experiencia_real", detalle: "Uso habitual de los dos como economista y director financiero." },
  { id: "copilot-studio", grupo: "valora", requisito: "Copilot Studio", nivel: "aprendiendo", detalle: "Probado y comparado con otros modelos; uso esporádico como apoyo del paquete Office, sin uso en desarrollo de proyectos." },
  { id: "whatsapp-api", grupo: "valora", requisito: "WhatsApp Cloud API", nivel: "sin_experiencia", detalle: "Sin uso todavía." },
  { id: "ocr", grupo: "valora", requisito: "OCR y extracción de documentos", nivel: "experiencia_real", detalle: "Lectura de documentos con OCR e IA creada para Agentia Contable." },
  { id: "crm-erp", grupo: "valora", requisito: "CRM y ERP", nivel: "experiencia_real", detalle: "Uso de varios sistemas de compañías como RE/MAX y Ocaso, y de otros propios para sus empresas; en la actualidad desarrolla el ERP ligero y el CRM de Agentia Contable." },
  { id: "bases-datos", grupo: "valora", requisito: "Bases de datos", nivel: "experiencia_real", detalle: "PostgreSQL (Supabase) con seguridad a nivel de fila en Agentia Contable." },
  { id: "docker", grupo: "valora", requisito: "Docker", nivel: "experiencia_real", detalle: "Entornos locales de desarrollo y pruebas." },
  { id: "linux", grupo: "valora", requisito: "Linux", nivel: "sin_experiencia", detalle: "Solo uso indirecto a través de Docker; sin dominio de la administración de Linux." },
  { id: "dns", grupo: "valora", requisito: "DNS", nivel: "experiencia_real", detalle: "Cloudflare, correo de Microsoft 365, SPF y DKIM para el correo transaccional." },
];
