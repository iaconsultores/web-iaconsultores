/** Cloudflare Web Analytics (sin cookies) solo en el dominio de producción: ni en local, ni en pruebas, ni en el temporal */
export function cargarAnalitica(token: string, host: string, doc: Document = document): boolean {
  if (!token || doc.location.hostname !== host) return false;
  const script = doc.createElement("script");
  script.type = "module";
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
  doc.head.append(script);
  return true;
}
