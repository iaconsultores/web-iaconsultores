/** IP del visitante detrás del proxy de Hostinger.
 *  1. La última IP de x-forwarded-for: la añade el proxy y el visitante no puede falsearla.
 *  2. x-real-ip.
 *  3. La dirección del socket.
 *  Nunca cf-connecting-ip: sin el proxy de Cloudflare la puede poner cualquiera.
 *  La tarea 18 confirma qué cabecera llega en Hostinger. */
export function ipDe(request: Request, direccion?: string): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const partes = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (partes.length) return partes[partes.length - 1];
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return direccion?.trim() || "desconocida";
}
