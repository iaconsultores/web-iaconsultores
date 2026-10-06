import type { APIRoute } from "astro";
import { depsLead } from "../../lib/estado";
import { manejarLead } from "../../lib/rutas/lead";

export const prerender = false;

export const POST: APIRoute = ({ request, clientAddress }) => manejarLead(request, depsLead(), clientAddress);
