import type { APIRoute } from "astro";
import { depsChat } from "../../lib/estado";
import { manejarChat } from "../../lib/rutas/chat";

export const prerender = false;

export const POST: APIRoute = ({ request, clientAddress }) => manejarChat(request, depsChat(), clientAddress);
