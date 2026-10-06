import { IAC } from "../../scripts/iac";
import { crearRotacion } from "../../scripts/rotacion";
import { PROVINCIAS, ROTACION_MS } from "../../datos/provincias";

const portada = document.getElementById("portada");
if (portada) {
  const chips = Array.from(portada.querySelectorAll<HTMLButtonElement>(".prov-chip"));
  const marcar = (id: string) => chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.p === id)));
  const rotacion = crearRotacion({
    ids: PROVINCIAS.map((p) => p.id),
    intervalo: ROTACION_MS,
    alCambiar: (id) => {
      IAC.setOpcion("provincia", id);
      marcar(id);
    },
  });
  marcar(IAC.getOpcion("provincia"));
  chips.forEach((c) => c.addEventListener("click", () => rotacion.fijar(c.dataset.p ?? "alicante")));

  /* El botón de pausa de la maqueta (WCAG 2.2.2) pausa también la rotación; al reanudar, suelta la provincia fijada */
  portada.addEventListener("portada:pausa", (e) => {
    const { pausado } = (e as CustomEvent<{ pausado: boolean }>).detail;
    if (pausado) rotacion.pausar("boton");
    else {
      rotacion.soltar();
      rotacion.reanudar("boton");
    }
  });
  /* Sin pausa al pasar el ratón: la portada ocupa casi toda la pantalla y se quedaba quieta casi siempre */
  portada.addEventListener("focusin", () => rotacion.pausar("foco"));
  portada.addEventListener("focusout", (e) => {
    if (!portada.contains(e.relatedTarget as Node | null)) rotacion.reanudar("foco");
  });
  document.addEventListener("visibilitychange", () =>
    document.hidden ? rotacion.pausar("oculta") : rotacion.reanudar("oculta"),
  );
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? rotacion.reanudar("fuera") : rotacion.pausar("fuera"))).observe(portada);
  }
  if (!IAC.reducido) rotacion.iniciar();
}
