import reglas from "../conocimiento/00-reglas.md?raw";
import quienes from "../conocimiento/01-quienes-somos.md?raw";
import comoTrabajamos from "../conocimiento/03-como-trabajamos.md?raw";
import queHacemos from "../conocimiento/04-que-hacemos.md?raw";
import sobreJuanLuis from "../conocimiento/06-sobre-juan-luis.md?raw";
import contacto from "../conocimiento/08-contacto-y-precios.md?raw";
import { SERVICIOS } from "../datos/servicios";

export function textoServicios(): string {
  return [
    "# Servicios",
    ...SERVICIOS.map((s) => `## ${s.titulo}\n${s.descripcion}\nBeneficio: ${s.beneficio}\nIncluye: ${s.herramientas.join(", ")}`),
  ].join("\n");
}

/** System del chat: el mismo texto byte a byte en todo el despliegue (lo exige la caché de prompts) */
export function componerConocimiento(): string {
  return [reglas, quienes, textoServicios(), comoTrabajamos, queHacemos, sobreJuanLuis, contacto]
    .map((t) => t.replace(/\r\n/g, "\n").trim())
    .join("\n\n");
}

export const CONOCIMIENTO = componerConocimiento();
