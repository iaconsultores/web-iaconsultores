export type Ruta = "chat" | "lead";

export interface Regla {
  porHora?: number;
  porDia?: number;
  globalDia: number;
}

export const LIMITES: Record<Ruta, Regla> = {
  chat: { porHora: 20, porDia: 50, globalDia: 250 },
  lead: { porHora: 5, globalDia: 100 },
};

export type Consumo = { ok: true } | { ok: false; reintentarEnS: number };

export interface Limitador {
  consumir(ruta: Ruta, ip: string): Consumo;
}

const HORA = 3_600_000;
const DIA = 86_400_000;
const diaMadrid = (t: number) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid" }).format(t);

/** Límites en memoria. El tope duro de gasto es el del workspace de Anthropic. */
export function crearLimitador(op: { ahora?: () => number; reglas?: Record<Ruta, Regla> } = {}): Limitador {
  const ahora = op.ahora ?? Date.now;
  const reglas = op.reglas ?? LIMITES;
  const marcas = new Map<string, number[]>();
  const globales = new Map<Ruta, { dia: string; total: number }>();
  return {
    consumir(ruta, ip) {
      const t = ahora();
      const regla = reglas[ruta];
      const dia = diaMadrid(t);
      const g = globales.get(ruta);
      const total = g && g.dia === dia ? g.total : 0;
      if (total >= regla.globalDia) return { ok: false, reintentarEnS: 3600 };
      const clave = `${ruta}|${ip}`;
      const previas = (marcas.get(clave) ?? []).filter((m) => t - m < DIA);
      const enHora = previas.filter((m) => t - m < HORA);
      if (regla.porHora !== undefined && enHora.length >= regla.porHora)
        return { ok: false, reintentarEnS: Math.ceil((enHora[0] + HORA - t) / 1000) };
      if (regla.porDia !== undefined && previas.length >= regla.porDia)
        return { ok: false, reintentarEnS: Math.ceil((previas[0] + DIA - t) / 1000) };
      previas.push(t);
      marcas.set(clave, previas);
      globales.set(ruta, { dia, total: total + 1 });
      if (marcas.size > 5000) {
        for (const [k, v] of marcas) if (!v.length || t - v[v.length - 1] >= DIA) marcas.delete(k);
      }
      return { ok: true };
    },
  };
}
