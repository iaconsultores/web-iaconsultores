export type IdProvincia = "alicante" | "valencia" | "murcia" | "albacete" | "madrid" | "espana";

export interface Provincia {
  id: IdProvincia;
  /** Como aparece en el titular */
  nombre: string;
  /** Texto del botón de la portada */
  etiqueta: string;
}

/** Orden de la rotación de la portada */
export const PROVINCIAS: readonly Provincia[] = [
  { id: "alicante", nombre: "Alicante", etiqueta: "Alicante" },
  { id: "valencia", nombre: "Valencia", etiqueta: "Valencia" },
  { id: "murcia", nombre: "Murcia", etiqueta: "Murcia" },
  { id: "albacete", nombre: "Albacete", etiqueta: "Albacete" },
  { id: "madrid", nombre: "Madrid", etiqueta: "Madrid" },
  { id: "espana", nombre: "toda España", etiqueta: "España" },
];

export const PROVINCIA_INICIAL: IdProvincia = "alicante";

/** Cada provincia se ve unos 3 s. El fundido (0,6 s) está en portada.css. */
export const ROTACION_MS = 3000;

export const esProvincia = (v: string): v is IdProvincia => PROVINCIAS.some((p) => p.id === v);
