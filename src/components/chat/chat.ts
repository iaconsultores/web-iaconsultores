import { analizarMarkdown, pintarBloques } from "../../scripts/markdown-seguro";
import { crearLectorSSE, type EventoSSE } from "../../scripts/sse-cliente";

const CONTACTO = "Llámanos al 678 310 660 o escríbenos por WhatsApp.";
const chat = document.getElementById("chat");
const cuerpo = document.getElementById("chatCuerpo");
const form = document.getElementById("chatForm") as HTMLFormElement | null;
const input = document.getElementById("chatInput") as HTMLInputElement | null;
const lanzador = document.getElementById("chatAbrir");
const contador = document.getElementById("chatContador");

if (chat && cuerpo && form && input && lanzador && contador) {
  const boton = form.querySelector("button") as HTMLButtonElement;
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let conversacionId: string | null = null;
  let ocupado = false;
  /* El tiempo antibots de la tarjeta cuenta desde que se abrió el chat: quien llega a ella lleva ya un rato conversando */
  let abiertoDesde: number | null = null;

  const abrir = (si: boolean) => {
    chat.classList.toggle("abierto", si);
    lanzador.setAttribute("aria-expanded", String(si));
    if (si) {
      abiertoDesde ??= Date.now();
      input.focus({ preventScroll: true });
    }
  };
  lanzador.addEventListener("click", () => abrir(true));
  document.getElementById("chatCerrar")?.addEventListener("click", () => abrir(false));
  document.addEventListener("chat:abrir", () => abrir(true));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chat.classList.contains("abierto")) abrir(false);
  });
  const burbuja = document.getElementById("chatBurbuja");
  setTimeout(() => {
    if (!chat.classList.contains("abierto")) burbuja?.classList.add("ver");
  }, 3500);
  setTimeout(() => burbuja?.classList.remove("ver"), 11_000);

  const bajar = () => {
    cuerpo.scrollTop = cuerpo.scrollHeight;
  };
  /* Lo que oye un lector de pantalla: cada mensaje del asistente una vez y completo, nunca los trozos del streaming */
  const anuncio = document.getElementById("chatAnuncio");
  const anunciar = (texto: string) => {
    if (!anuncio || !texto) return;
    const p = document.createElement("p");
    p.textContent = texto;
    anuncio.append(p);
  };
  const mensaje = (clase: string, texto = "") => {
    const el = document.createElement("div");
    el.className = `ch-msg ${clase}`;
    el.textContent = texto;
    cuerpo.append(el);
    bajar();
    if (clase.startsWith("ch-bot")) anunciar(texto);
    return el;
  };
  const aviso = (texto: string) => {
    const p = document.createElement("p");
    p.className = "ch-aviso";
    p.textContent = texto;
    cuerpo.append(p);
    bajar();
    anunciar(texto);
  };
  const bloquear = (si: boolean) => {
    ocupado = si;
    input.disabled = si;
    boton.disabled = si;
    if (!si) input.focus({ preventScroll: true });
  };

  input.addEventListener("input", () => {
    const n = input.value.length;
    contador.hidden = n < 800;
    contador.textContent = `${n} / 1000`;
  });

  const pintarTarjeta = (datos: { motivo: string }) => {
    const tarjeta = document.createElement("form");
    tarjeta.className = "ch-tarjeta";
    tarjeta.noValidate = true;
    const desde = abiertoDesde ?? Date.now();
    const intro = document.createElement("p");
    intro.textContent = `Te proponemos una llamada de diagnóstico gratuita de 30 minutos sobre: ${datos.motivo}`;
    const campoTexto = (etiqueta: string, nombre: string, tipo: string, max: number) => {
      const label = document.createElement("label");
      label.textContent = etiqueta;
      const el = document.createElement("input");
      el.name = nombre;
      el.type = tipo;
      el.maxLength = max;
      el.required = true;
      el.autocomplete = nombre === "nombre" ? "name" : "tel";
      label.append(el);
      return label;
    };
    const franjaLabel = document.createElement("label");
    franjaLabel.textContent = "Franja";
    const franja = document.createElement("select");
    franja.name = "franja";
    for (const [v, t] of [["indiferente", "Me da igual"], ["manana", "Mañana"], ["tarde", "Tarde"]]) franja.append(new Option(t, v));
    franjaLabel.append(franja);
    const check = document.createElement("label");
    check.className = "ch-check";
    const casilla = document.createElement("input");
    casilla.type = "checkbox";
    casilla.name = "privacidad";
    const textoCheck = document.createElement("span");
    textoCheck.append("He leído la ");
    const enlace = document.createElement("a");
    enlace.href = "/privacidad";
    enlace.target = "_blank";
    enlace.textContent = "política de privacidad";
    textoCheck.append(enlace);
    check.append(casilla, textoCheck);
    const trampa = document.createElement("div");
    trampa.className = "ch-trampa";
    trampa.setAttribute("aria-hidden", "true");
    const web = document.createElement("input");
    web.name = "web";
    web.tabIndex = -1;
    web.autocomplete = "off";
    trampa.append(web);
    const botones = document.createElement("div");
    botones.className = "ch-botones";
    const enviar = document.createElement("button");
    enviar.type = "submit";
    enviar.className = "ch-enviar";
    enviar.textContent = "Enviar solicitud";
    const no = document.createElement("button");
    no.type = "button";
    no.className = "ch-no";
    no.textContent = "Ahora no";
    botones.append(enviar, no);
    const estado = document.createElement("p");
    estado.setAttribute("role", "status");
    tarjeta.append(intro, campoTexto("Nombre", "nombre", "text", 80), campoTexto("Teléfono", "telefono", "tel", 20), franjaLabel, check, trampa, botones, estado);
    cuerpo.append(tarjeta);
    bajar();
    anunciar(intro.textContent ?? "");

    no.addEventListener("click", () => {
      tarjeta.remove();
      aviso("Sin problema. Si cambias de idea, aquí estoy.");
    });
    tarjeta.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (enviar.disabled) return;
      const nombre = (tarjeta.elements.namedItem("nombre") as HTMLInputElement).value;
      const telefono = (tarjeta.elements.namedItem("telefono") as HTMLInputElement).value;
      if (!nombre.trim() || !telefono.trim() || !casilla.checked) {
        estado.textContent = "Necesitamos tu nombre, un teléfono y que aceptes la política de privacidad.";
        return;
      }
      enviar.disabled = true;
      estado.textContent = "Enviando…";
      try {
        const r = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, telefono, proceso: datos.motivo, franja: franja.value, motivo: "llamada", origen: "chat", conversacionId: conversacionId ?? undefined, privacidad: true, web: web.value, t: Date.now() - desde }),
        });
        const j = (await r.json().catch(() => null)) as { ok?: boolean; mensaje?: string } | null;
        if (r.ok && j?.ok) {
          tarjeta.remove();
          mensaje("ch-bot", "Solicitud enviada. Te llamamos en la franja que has elegido.");
        } else {
          estado.textContent = j?.mensaje ?? `No hemos podido enviar tu solicitud. ${CONTACTO}`;
          enviar.disabled = false;
        }
      } catch {
        estado.textContent = `No hemos podido enviar tu solicitud. ${CONTACTO}`;
        enviar.disabled = false;
      }
    });
  };

  async function preguntar(texto: string) {
    if (ocupado || !texto.trim()) return;
    bloquear(true);
    anuncio?.replaceChildren();
    mensaje("ch-yo", texto);
    const bot = mensaje("ch-bot ch-escribiendo");
    let acumulado = "";
    let terminado = false;
    let pendiente = false;
    let anunciada = false;
    const pintar = () => {
      pendiente = false;
      pintarBloques(analizarMarkdown(acumulado), bot);
      bajar();
    };
    /* La respuesta se anuncia una sola vez, completa, antes que la tarjeta o los avisos que la siguen */
    const anunciarRespuesta = () => {
      if (anunciada || !acumulado) return;
      anunciada = true;
      pintar();
      anunciar(bot.textContent ?? "");
    };
    const alEvento = (e: EventoSSE) => {
      const d = e.datos as Record<string, unknown>;
      if (e.evento === "conversacion") {
        if (d.nueva && conversacionId) aviso("He empezado una conversación nueva.");
        conversacionId = String(d.id);
      } else if (e.evento === "texto") {
        bot.classList.remove("ch-escribiendo");
        acumulado += String(d.t ?? "");
        if (!pendiente) {
          pendiente = true;
          if (reducido) pintar();
          else requestAnimationFrame(pintar);
        }
      } else if (e.evento === "tarjeta") {
        anunciarRespuesta();
        pintarTarjeta(d as { motivo: string });
      } else if (e.evento === "fin") {
        terminado = true;
        anunciarRespuesta();
        if (d.motivo === "cortado") aviso("(respuesta cortada)");
        if (d.motivo === "rechazo") conversacionId = null;
      } else if (e.evento === "error") {
        terminado = true;
        anunciarRespuesta();
        bot.classList.remove("ch-escribiendo");
        if (!acumulado) bot.remove();
        mensaje("ch-bot ch-error", String(d.mensaje ?? `No he podido responder. ${CONTACTO}`));
      }
    };
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversacionId: conversacionId ?? undefined, mensaje: texto }),
      });
      if (!r.ok || !(r.headers.get("content-type") ?? "").includes("text/event-stream") || !r.body) {
        const j = (await r.json().catch(() => null)) as { mensaje?: string } | null;
        bot.remove();
        mensaje("ch-bot ch-error", j?.mensaje ?? `No he podido responder. ${CONTACTO}`);
        return;
      }
      const leer = crearLectorSSE(alEvento);
      const lector = r.body.getReader();
      const decodificador = new TextDecoder();
      for (;;) {
        const { done, value } = await lector.read();
        if (done) break;
        leer(decodificador.decode(value, { stream: true }));
      }
      pintar();
      if (!terminado) {
        bot.classList.remove("ch-escribiendo");
        anunciarRespuesta();
        aviso("Se ha cortado la conexión, vuelve a intentarlo.");
      }
    } catch {
      bot.classList.remove("ch-escribiendo");
      if (!acumulado) bot.remove();
      anunciarRespuesta();
      aviso("Se ha cortado la conexión, vuelve a intentarlo.");
    } finally {
      bloquear(false);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = input.value;
    input.value = "";
    contador.hidden = true;
    void preguntar(texto);
  });
  cuerpo.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>(".ch-chips button");
    if (!b) return;
    if (b.dataset.pregunta) void preguntar(b.dataset.pregunta);
    else if (b.dataset.ir) {
      const destino = document.querySelector(b.dataset.ir);
      if (destino) destino.scrollIntoView({ behavior: reducido ? "auto" : "smooth" });
      else location.href = `/${b.dataset.ir}`;
    }
  });
}
