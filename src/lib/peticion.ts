export type Lectura = { ok: true; datos: unknown } | { ok: false; respuesta: Response };

export function respuestaJson(estado: number, cuerpo: Record<string, unknown>, cabeceras: Record<string, string> = {}): Response {
  return Response.json(cuerpo, { status: estado, headers: { "Cache-Control": "no-store", ...cabeceras } });
}

const fallo = (estado: number, codigo: string, mensaje: string): Lectura => ({
  ok: false,
  respuesta: respuestaJson(estado, { ok: false, codigo, mensaje }),
});

/** Lee el cuerpo por trozos y deja de leer en cuanto supera el máximo: un POST enorme nunca se carga entero. */
async function leerTexto(request: Request, maxBytes: number): Promise<string | null> {
  if (Number(request.headers.get("content-length")) > maxBytes) return null;
  if (!request.body) return "";
  const lector = request.body.getReader();
  const trozos: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await lector.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await lector.cancel();
      return null;
    }
    trozos.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(trozos));
}

/** Comprueba que la petición viene del propio sitio, es JSON y no es demasiado grande. */
export async function leerJson(request: Request, maxBytes: number): Promise<Lectura> {
  let hostOrigen = "";
  try {
    hostOrigen = new URL(request.headers.get("origin") ?? "").host;
  } catch {
    hostOrigen = "";
  }
  if (!hostOrigen || hostOrigen !== new URL(request.url).host) return fallo(403, "origen", "Petición no permitida.");
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return fallo(415, "tipo", "Formato no admitido.");
  let texto: string | null;
  try {
    texto = await leerTexto(request, maxBytes);
  } catch {
    return fallo(400, "json", "Petición no válida.");
  }
  if (texto === null) return fallo(413, "tamano", "El mensaje es demasiado largo.");
  try {
    return { ok: true, datos: JSON.parse(texto) };
  } catch {
    return fallo(400, "json", "Petición no válida.");
  }
}
