import reglas from "../conocimiento/00-reglas.md?raw";
import quienes from "../conocimiento/01-quienes-somos.md?raw";
import comoTrabajamos from "../conocimiento/03-como-trabajamos.md?raw";
import queHacemos from "../conocimiento/04-que-hacemos.md?raw";
import sobreJuanLuis from "../conocimiento/06-sobre-juan-luis.md?raw";
import contacto from "../conocimiento/08-contacto-y-precios.md?raw";
import { DESCRIPCION_AGENTIA, MODULOS_AGENTIA } from "../datos/agentia";
import { EVIDENCIAS, NIVELES, NOTA_AGENTIA, type Evidencia } from "../datos/evidencias";
import { SERVICIOS } from "../datos/servicios";

export function textoServicios(): string {
  return [
    "# Servicios",
    ...SERVICIOS.map((s) => `## ${s.titulo}\n${s.descripcion}\nBeneficio: ${s.beneficio}\nHerramientas: ${s.herramientas.join(", ")}`),
  ].join("\n");
}

export function textoAgentia(): string {
  const modulos = MODULOS_AGENTIA.map(
    (m) => `- ${m.nombre}${m.enValidacion ? " (en validación)" : ""}${m.nota ? ` (${m.nota})` : ""}`,
  );
  return ["# Agentia Contable (https://agentiacontable.com)", DESCRIPCION_AGENTIA, "Módulos:", ...modulos].join("\n");
}

export function textoEvidencias(): string {
  const linea = (e: Evidencia) => `- ${e.requisito}: ${NIVELES[e.nivel].etiqueta}. ${e.detalle}`;
  return [
    `Niveles: ${Object.values(NIVELES).map((n) => n.etiqueta).join(" · ")}. ${NOTA_AGENTIA}`,
    "Requisitos habituales en ofertas de consultoría de IA y automatización:",
    ...EVIDENCIAS.filter((e) => e.grupo === "requisito").map(linea),
    "Se valora:",
    ...EVIDENCIAS.filter((e) => e.grupo === "valora").map(linea),
  ].join("\n");
}

/** System del chat: el mismo texto byte a byte en todo el despliegue (lo exige la caché de prompts) */
export function componerConocimiento(): string {
  return [reglas, quienes, textoServicios(), comoTrabajamos, queHacemos, textoAgentia(), sobreJuanLuis, `# Para reclutadores\n${textoEvidencias()}`, contacto]
    .map((t) => t.replace(/\r\n/g, "\n").trim())
    .join("\n\n");
}

export const CONOCIMIENTO = componerConocimiento();
