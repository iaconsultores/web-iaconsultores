import type { APIRoute } from "astro";
import { ipDe } from "../../lib/ip";

export const prerender = false;

const INSTANCIA = crypto.randomUUID().slice(0, 8);

export const GET: APIRoute = ({ request, clientAddress, url }) => {
  const cuerpo: Record<string, unknown> = { ok: true, version: "1.0.0", instancia: INSTANCIA };
  if (url.searchParams.get("diagnostico") === "1") cuerpo.ip = ipDe(request, clientAddress);
  return Response.json(cuerpo, { headers: { "Cache-Control": "no-store" } });
};
