export interface ModuloAgentia {
  nombre: string;
  enValidacion: boolean;
  nota?: string;
}

export const DESCRIPCION_AGENTIA =
  "Plataforma cloud de gestión con IA en producción: contabilidad, facturación electrónica, bancos, fiscalidad, CRM e inventario. Diseñada y dirigida por Juan Luis Toboso y programada con agentes de IA (Claude Code y Codex principalmente).";

/** Mismo orden y etiquetas que la sección #agentia de la maqueta */
export const MODULOS_AGENTIA: readonly ModuloAgentia[] = [
  { nombre: "Contabilidad", enValidacion: false },
  { nombre: "Facturación y Verifactu", enValidacion: true },
  { nombre: "Bancos y tesorería", enValidacion: true },
  { nombre: "Fiscalidad AEAT", enValidacion: false },
  { nombre: "CRM", enValidacion: false },
  { nombre: "Inventario", enValidacion: false },
  { nombre: "Nóminas", enValidacion: false, nota: "revisión de la gestoría" },
  { nombre: "Documentos con IA", enValidacion: false },
  { nombre: "API y webhooks", enValidacion: false },
  { nombre: "Portal del cliente", enValidacion: false },
];
