const codificador = new TextEncoder();

export function eventoSSE(nombre: string, datos: unknown): Uint8Array {
  return codificador.encode(`event: ${nombre}\ndata: ${JSON.stringify(datos)}\n\n`);
}

/** X-Accel-Buffering evita que un proxy nginx acumule la respuesta */
export const CABECERAS_SSE = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
};
