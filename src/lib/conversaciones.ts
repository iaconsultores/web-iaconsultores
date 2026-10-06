import type Anthropic from "@anthropic-ai/sdk";

export interface Conversacion {
  id: string;
  /** Historial exacto que se reenvía a Claude: solo se añade, nunca se edita */
  mensajes: Anthropic.Beta.BetaMessageParam[];
  turnos: number;
  propuesta: { toolUseId: string; enviada: boolean } | null;
  ultimoUso: number;
}

export interface AlmacenConversaciones {
  obtener(id: string | undefined): Conversacion | undefined;
  crear(): Conversacion;
  borrar(id: string): void;
  marcarPropuestaEnviada(id: string): void;
  readonly tamano: number;
}

export function crearAlmacen(op: { maximo: number; caducidadMs: number; ahora?: () => number }): AlmacenConversaciones {
  const ahora = op.ahora ?? Date.now;
  const mapa = new Map<string, Conversacion>();
  return {
    obtener(id) {
      if (!id) return undefined;
      const c = mapa.get(id);
      if (!c) return undefined;
      mapa.delete(id);
      if (ahora() - c.ultimoUso >= op.caducidadMs) return undefined;
      c.ultimoUso = ahora();
      mapa.set(id, c); // la más reciente, al final
      return c;
    },
    crear() {
      while (mapa.size >= op.maximo) {
        const masAntigua = mapa.keys().next().value;
        if (masAntigua === undefined) break;
        mapa.delete(masAntigua);
      }
      const c: Conversacion = { id: crypto.randomUUID(), mensajes: [], turnos: 0, propuesta: null, ultimoUso: ahora() };
      mapa.set(c.id, c);
      return c;
    },
    borrar(id) {
      mapa.delete(id);
    },
    marcarPropuestaEnviada(id) {
      const c = mapa.get(id);
      if (c?.propuesta) c.propuesta.enviada = true;
    },
    get tamano() {
      return mapa.size;
    },
  };
}
