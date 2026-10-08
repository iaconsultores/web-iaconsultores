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

export interface BeneficioAgentia {
  titulo: string;
  texto: string;
  /** Módulos en los que se apoya: si alguno está en validación, el beneficio también lo dice */
  modulos: readonly string[];
  enValidacion: boolean;
}

/** Lo que gana una empresa con Agentia Contable (sección #agentia). Entre todos cubren todos los módulos. */
export const BENEFICIOS_AGENTIA: readonly BeneficioAgentia[] = [
  { titulo: "Facturas que se registran solas", texto: "La IA lee facturas y documentos y propone el asiento: tú solo revisas y apruebas.", modulos: ["Documentos con IA", "Contabilidad"], enValidacion: false },
  { titulo: "Del presupuesto a la factura", texto: "Presupuestos, albaranes y facturas encadenados, con facturación electrónica y Verifactu.", modulos: ["Facturación y Verifactu"], enValidacion: true },
  { titulo: "Impuestos preparados", texto: "Los modelos de la AEAT salen de tu propia contabilidad, sin volver a teclear datos.", modulos: ["Fiscalidad AEAT"], enValidacion: false },
  { titulo: "Bancos y tesorería a la vista", texto: "Movimientos clasificados y previsión de tesorería para decidir con datos.", modulos: ["Bancos y tesorería"], enValidacion: true },
  { titulo: "Clientes, ventas y stock en un sitio", texto: "CRM e inventario conectados con la facturación.", modulos: ["CRM", "Inventario"], enValidacion: false },
  { titulo: "Conectada con tu gestoría y tus programas", texto: "Portal para compartir documentos, nóminas con revisión de la gestoría y API con webhooks para n8n, Make o Zapier.", modulos: ["Portal del cliente", "Nóminas", "API y webhooks"], enValidacion: false },
];
