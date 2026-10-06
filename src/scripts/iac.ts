/* API común de la portada (sustituye a window.IAC de la maqueta) y comportamientos globales.
   Los scripts trasladados de la maqueta usan window.IAC; los nuevos importan IAC. */
import { PROVINCIAS, PROVINCIA_INICIAL, esProvincia } from "../datos/provincias";

type Clave = "provincia" | "tipo" | "servicios" | "flujo" | "json" | "fondo";

/* Variantes de la maqueta que quedaron fijas al aprobar el diseño */
const FIJAS: Record<Exclude<Clave, "provincia">, string> = {
  tipo: "serif",
  servicios: "tarjetas",
  flujo: "nodos",
  json: "claro",
  fondo: "mar",
};

const raiz = document.documentElement;
const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!raiz.dataset.provincia) raiz.dataset.provincia = PROVINCIA_INICIAL;

const nombreProvincia = (id: string) => PROVINCIAS.find((p) => p.id === id)?.nombre ?? "Alicante";

function getOpcion(clave: Clave): string {
  return clave === "provincia" ? (raiz.dataset.provincia ?? PROVINCIA_INICIAL) : FIJAS[clave];
}

function pintarProvincia(): void {
  const nombre = nombreProvincia(getOpcion("provincia"));
  document.querySelectorAll<HTMLElement>("[data-prov-nombre]").forEach((el) => {
    el.textContent = nombre;
  });
}

function setOpcion(clave: Clave, valor: string): void {
  if (clave !== "provincia" || !esProvincia(valor) || raiz.dataset.provincia === valor) return;
  raiz.dataset.provincia = valor;
  pintarProvincia();
  document.dispatchEvent(new CustomEvent("opciones:cambio", { detail: { clave, valor } }));
}

function onCambio(clave: Clave | null, cb: (valor: string, clave: string) => void): void {
  document.addEventListener("opciones:cambio", (e) => {
    const { clave: c, valor } = (e as CustomEvent<{ clave: string; valor: string }>).detail;
    if (!clave || c === clave) cb(valor, c);
  });
}

function alVer(el: Element | null, cb: (el: Element) => void, op?: { umbral?: number; repetir?: boolean }): void {
  if (!el) return;
  if (!("IntersectionObserver" in window)) {
    cb(el);
    return;
  }
  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        cb(e.target);
        if (!op?.repetir) io.unobserve(e.target);
      });
    },
    { threshold: op?.umbral ?? 0.25 },
  );
  io.observe(el);
}

export const IAC = {
  getOpcion,
  setOpcion,
  onCambio,
  alVer,
  reducido,
  provincias: PROVINCIAS,
  nombreProvincia,
  pintarProvincia,
};

declare global {
  interface Window {
    IAC: typeof IAC;
  }
}
window.IAC = IAC;

/* Subrayado de rotulador */
document.querySelectorAll(".subrayado").forEach((el) => alVer(el, (x) => x.classList.add("visto"), { umbral: 0.6 }));

/* Botones «Pregunta a nuestro asistente IA»: abren el chat o, si la página no lo tiene, llevan al contacto */
document.addEventListener("click", (e) => {
  const boton = (e.target as Element | null)?.closest?.("[data-abrir-chat]");
  if (!boton) return;
  e.preventDefault();
  if (document.getElementById("chat")) document.dispatchEvent(new CustomEvent("chat:abrir"));
  else if (document.getElementById("contacto"))
    document.getElementById("contacto")?.scrollIntoView({ behavior: reducido ? "auto" : "smooth" });
  else location.href = "/#contacto";
});
