/* Rotación automática de provincias de la portada. Lógica pura: el cambio se inyecta. */
export type Motivo = "boton" | "puntero" | "foco" | "fuera" | "oculta";

export interface OpcionesRotacion {
  ids: readonly string[];
  intervalo: number;
  alCambiar: (id: string) => void;
}

export interface Rotacion {
  iniciar(): void;
  pausar(motivo: Motivo): void;
  reanudar(motivo: Motivo): void;
  fijar(id: string): void;
  soltar(): void;
  readonly fijada: boolean;
  readonly actual: string;
}

export function siguiente(ids: readonly string[], actual: string): string {
  const i = ids.indexOf(actual);
  return ids[(i + 1) % ids.length];
}

export function crearRotacion(op: OpcionesRotacion): Rotacion {
  const pausas = new Set<Motivo>();
  let actual = op.ids[0];
  let fijada = false;
  let iniciada = false;
  let reloj: ReturnType<typeof setInterval> | null = null;

  const parar = () => {
    if (reloj !== null) clearInterval(reloj);
    reloj = null;
  };
  const arrancar = () => {
    if (!iniciada || reloj !== null || fijada || pausas.size > 0) return;
    reloj = setInterval(() => {
      actual = siguiente(op.ids, actual);
      op.alCambiar(actual);
    }, op.intervalo);
  };

  return {
    iniciar() {
      iniciada = true;
      arrancar();
    },
    pausar(motivo) {
      pausas.add(motivo);
      parar();
    },
    reanudar(motivo) {
      pausas.delete(motivo);
      arrancar();
    },
    fijar(id) {
      fijada = true;
      parar();
      actual = id;
      op.alCambiar(id);
    },
    soltar() {
      fijada = false;
      arrancar();
    },
    get fijada() {
      return fijada;
    },
    get actual() {
      return actual;
    },
  };
}
