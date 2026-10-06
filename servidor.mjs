// Punto de entrada en Hostinger: redirección de www, cabeceras, estáticos de Astro, APIs y 404.
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { handler as astro } from "./dist/server/entry.mjs";
import { cabecerasEstaticos, cabecerasSeguridad, paginasHtml, redirigirWww } from "./servidor/middlewares.mjs";

const raiz = dirname(fileURLToPath(import.meta.url));
const cliente = join(raiz, "dist", "client");
const app = express();

app.disable("x-powered-by");
app.use(redirigirWww);
app.use(cabecerasSeguridad);
app.use(paginasHtml(cliente));
app.use(express.static(cliente, { extensions: ["html"], redirect: false, setHeaders: cabecerasEstaticos }));
app.use(astro);
app.use((req, res) => {
  res.status(404).sendFile(join(cliente, "404.html"));
});

const puerto = Number(process.env.PORT ?? 4321);
const host = process.env.HOST;
const alEscuchar = () => console.log(`IA Consultores escuchando en ${host ?? "*"}:${puerto}`);
if (host) app.listen(puerto, host, alEscuchar);
else app.listen(puerto, alEscuchar);
