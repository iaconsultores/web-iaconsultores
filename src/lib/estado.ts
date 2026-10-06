/* Estado del proceso: un único limitador, un único almacén de conversaciones y un único cliente de Claude */
import { CONOCIMIENTO } from "./conocimiento";
import { crearClienteClaude, type ClienteClaude } from "./claude";
import { leerConfig } from "./config";
import { crearAlmacen } from "./conversaciones";
import { crearEnviadorResend, enviadorSimulado, type EnviadorEmail } from "./leads";
import { crearLimitador } from "./limites";
import type { DepsChat } from "./rutas/chat";
import type { DepsLead } from "./rutas/lead";

export const limitador = crearLimitador();
export const almacen = crearAlmacen({ maximo: 500, caducidadMs: 30 * 60_000 });

let claude: ClienteClaude | null | undefined;
export function clienteClaude(): ClienteClaude | null {
  if (claude === undefined) claude = crearClienteClaude();
  return claude;
}

/** Registro de uso para vigilar el coste: sin contenido, sin IP y sin datos personales */
export const registrarUso = (datos: Record<string, unknown>) =>
  console.log(JSON.stringify({ evento: "uso_claude", fecha: new Date().toISOString(), ...datos }));

function crearEmail(): EnviadorEmail | null {
  const config = leerConfig();
  if (config.resendSimulado) return enviadorSimulado;
  return config.resendKey ? crearEnviadorResend(config.resendKey) : null;
}

export function depsChat(): DepsChat {
  return { claude: clienteClaude(), almacen, limites: limitador, conocimiento: CONOCIMIENTO, registrar: registrarUso };
}

export function depsLead(): DepsLead {
  return {
    email: crearEmail(),
    limites: limitador,
    config: leerConfig(),
    alEnviar: (lead) => {
      if (lead.conversacionId) almacen.marcarPropuestaEnviada(lead.conversacionId);
    },
  };
}
