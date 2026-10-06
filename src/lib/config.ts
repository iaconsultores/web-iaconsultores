/** Configuración de las variables de entorno. Se lee en cada uso para que las pruebas puedan cambiarla. */
export function leerConfig() {
  return {
    claudeSimulado: process.env.CLAUDE_SIMULADO === "1",
    resendSimulado: process.env.RESEND_SIMULADO === "1",
    anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
    resendKey: process.env.RESEND_API_KEY ?? "",
    leadPara: process.env.LEAD_EMAIL_TO || "juanluis@iaconsultores.com",
    leadDe: process.env.LEAD_EMAIL_FROM || "IA Consultores <web@iaconsultores.com>",
    n8nUrl: process.env.N8N_WEBHOOK_URL ?? "",
    n8nSecreto: process.env.N8N_WEBHOOK_SECRET ?? "",
  };
}

export type Config = ReturnType<typeof leerConfig>;
