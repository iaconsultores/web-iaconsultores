(() => {
  const sec = document.getElementById("como-trabajamos");
  if (!sec) return;
  const RAIZ = document.documentElement;
  const IAC = window.IAC || {
    reducido: matchMedia("(prefers-reduced-motion: reduce)").matches,
    onCambio() {}, alVer(el, cb) { cb(el); }
  };
  const QUIETO = !!IAC.reducido;

  /* ===== Datos de los cuatro procesos (contrato §4 · todo de demostración) =====
     json: [clave, valor JSON ya formateado, paso que lo produce, ¿línea destacada?] */
  const PROCESOS = [
    { id: "leads", titulo: "Leads → CRM a medida", archivo: "lead.json",
      resultado: ["Respuesta en ", "12 s", ""], cota: "tiempo_respuesta = 12 s",
      pasos: [
        { tit: "Entrada", sub: "webhook n8n · WhatsApp · web · email", ico: "mensaje", n8n: true, txt: "Un cliente escribe por WhatsApp, la web o el email y un webhook de n8n lo recoge:", cita: "«Hola, ¿me pasáis presupuesto para un seguro de flota?»" },
        { tit: "La IA cualifica", sub: "intención · sector · prioridad", ico: "ia", chips: ["intención = presupuesto", "sector = seguros", "prioridad = alta"] },
        { tit: "CRM a medida", sub: "«Nuevos leads» + tarea", ico: "crm", txt: "Oportunidad creada en «Nuevos leads» con tarea para el comercial." },
        { tit: "Respuesta y aviso", sub: "cliente · comercial", ico: "enviar", txt: "Respuesta automática al cliente y aviso al comercial." }
      ],
      json: [["canal", '"whatsapp"', 0], ["intencion", '"presupuesto"', 1], ["sector", '"seguros"', 1], ["prioridad", '"alta"', 1],
             ["crm", '"oportunidad_creada"', 2], ["tiempo_respuesta", '"12 s"', 3, true]] },
    { id: "facturas", titulo: "Facturas → contabilidad", archivo: "factura.json",
      resultado: ["De 4 min a ", "20 s", " por factura"], cota: "de 4 min a 20 s por factura",
      pasos: [
        { tit: "Entrada", sub: "n8n recoge email · foto", ico: "factura", n8n: true, txt: "Llega una factura por email o la fotografías con el móvil; n8n la recoge al momento." },
        { tit: "La IA extrae", sub: "OCR + IA", ico: "escaner", txt: "Proveedor, NIF, base, IVA y total, con OCR + IA." },
        { tit: "Asiento propuesto", sub: "cuenta · IVA · vencimiento", ico: "libro", txt: "Propone la cuenta, el IVA y el vencimiento." },
        { tit: "Aprobación", sub: "revisión humana · 1 clic", ico: "aprobar", txt: "Una persona revisa y aprueba con un clic." },
        { tit: "Contabilizada", sub: "y archivada", ico: "archivo", txt: "La factura queda contabilizada y archivada." }
      ],
      json: [["proveedor", '"Suministros Levante S.L."', 1], ["nif", '"B12345678"', 1], ["base", "1240.00", 1], ["iva", "260.40", 1],
             ["total", "1500.40", 1], ["cuenta", '"600"', 2], ["estado", '"pendiente_aprobacion"', 3, true]] },
    { id: "rag", titulo: "RAG: pregunta a tus documentos", archivo: "consulta.json",
      resultado: ["Respuesta en ", "3 s", ", con su fuente"], cota: "respuesta en 3 s, con su fuente",
      pasos: [
        { tit: "Pregunta", sub: "¿días de vacaciones?", ico: "pregunta", cita: "«¿Cuántos días de vacaciones me corresponden?»" },
        { tit: "Búsqueda", sub: "convenio · manual · políticas", ico: "buscar", txt: "En el convenio, el manual y las políticas internas." },
        { tit: "Respuesta con fuente", sub: "art. 32 del convenio", ico: "fuente", cita: "«30 días naturales»", fuente: "Convenio colectivo, art. 32" },
        { tit: "Registro", sub: "mejora la base documental", ico: "registro", txt: "La consulta se registra para mejorar la base documental." }
      ],
      json: [["pregunta", '"dias_vacaciones"', 0], ["fuentes", '["convenio.pdf#art32"]', 1, true], ["respuesta", '"30 días naturales"', 2],
             ["confianza", '"alta"', 2]] },
    { id: "informe", titulo: "Informe mensual automático", archivo: "informe.json",
      resultado: ["Informe listo ", "antes del café", " del día 1"], cota: "día 1, 7:00 · informe a dirección",
      pasos: [
        { tit: "Datos", sub: "ventas · banco · ERP", ico: "datos", txt: "Ventas, banco y ERP, el día 1 a las 7:00." },
        { tit: "Consolidación", sub: "consolida y limpia", ico: "n8n", n8n: true, txt: "n8n consolida y limpia los datos." },
        { tit: "La IA resume", sub: "compara · detecta alertas", ico: "ia", txt: "Resume el mes, lo compara y detecta alertas." },
        { tit: "Informe a dirección", sub: "PDF + email", ico: "informe", txt: "PDF + email con 3 conclusiones y 2 alertas." }
      ],
      json: [["periodo", '"2026-09"', 0], ["ventas", '"+8,4 %"', 1], ["margen", '"31,2 %"', 1],
             ["alertas", '["cobros_vencidos","stock_bajo"]', 2, true], ["enviado_a", '"direccion"', 3]] }
  ];

  /* Iconos de trazo (24×24), sin logotipos */
  const ICONOS = {
    mensaje: "M4 19.5v-13a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2H8.5zM8.5 10.75h.01M12 10.75h.01M15.5 10.75h.01",
    ia: "M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1-5.1-1.9 5.1-1.9zM18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z",
    crm: "M6 4.5h12A2.5 2.5 0 0 1 20.5 7v10a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 17V7A2.5 2.5 0 0 1 6 4.5zM9.5 4.5v15M14.5 4.5v15",
    enviar: "M20.5 3.5 10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4z",
    factura: "M6.5 3.5h7.5l4.5 4.5v12.5h-12zM14 3.5V8h4.5M9.5 12.5h5M9.5 16h5",
    escaner: "M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5M3.5 12h17",
    libro: "M5 5.5A1.5 1.5 0 0 1 6.5 4H19v13H6.5A1.5 1.5 0 0 0 5 18.5zM5 18.5A1.5 1.5 0 0 0 6.5 20H19v-3M9 8h6M9 11h4",
    aprobar: "M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM8.3 12.2l2.5 2.5 4.9-5",
    archivo: "M3.5 5h17v4h-17zM5 9v10h14V9M10 13h4",
    pregunta: "M4 19.5v-13a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2H8.5zM10.2 8.7a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.3M12 14h.01",
    buscar: "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.3 15.3 20 20",
    fuente: "M6.5 3.5h7.5l4.5 4.5v12.5h-12zM14 3.5V8h4.5M9.5 14l1.8 1.8 3.4-3.6",
    registro: "M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01",
    datos: "M12 4c3.9 0 7 1.1 7 2.5S15.9 9 12 9 5 7.9 5 6.5 8.1 4 12 4zM5 6.5v11C5 18.9 8.1 20 12 20s7-1.1 7-2.5v-11M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5",
    n8n: "M5.5 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM18.5 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM18.5 15.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM8 12h2.5c1.8 0 2.4-1 3-2.6.4-1 1-2.4 2.6-3.2M10.5 12c1.8 0 2.4 1 3 2.6.4 1 1 2.4 2.6 3.2",
    informe: "M6.5 3.5h7.5l4.5 4.5v12.5h-12zM14 3.5V8h4.5M9.5 17v-2.5M12.5 17v-5M15.5 17v-3.5"
  };
  const SVG_FLECHA = '<svg class="ct-flecha" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SVG_LIBRO = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3.5H7A1.5 1.5 0 0 1 8 4v9a1.3 1.3 0 0 0-1.2-1H2.5zM13.5 3.5H9A1.5 1.5 0 0 0 8 4v9a1.3 1.3 0 0 1 1.2-1h4.3z"/></svg>';
  const SVG_LLAVES = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 2.5c-1.5 0-2 .7-2 2v1.6c0 .9-.5 1.4-1.5 1.9 1 .5 1.5 1 1.5 1.9v1.6c0 1.3.5 2 2 2M10.5 2.5c1.5 0 2 .7 2 2v1.6c0 .9.5 1.4 1.5 1.9-1 .5-1.5 1-1.5 1.9v1.6c0 1.3-.5 2-2 2"/></svg>';
  const SVG_PAUSA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const SVG_PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2v9.6L12.6 8z" fill="currentColor"/></svg>';
  const SVG_REPETIR = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8.5a5 5 0 1 1-1.6-3.9M13.2 2.6v3.2H10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ===== Utilidades ===== */
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const conFlecha = (t) => esc(t).replace(" → ", ` ${SVG_FLECHA}<span class="ct-sr">→</span> `);
  const r1 = (n) => Math.round(n * 10) / 10;
  const limitar = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const suave = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  /* Colorea un valor JSON ya formateado: cadenas, números y signos */
  const colorear = (valor) => esc(valor).replace(/(&quot;.*?&quot;)|(-?\d+(?:\.\d+)?)|([[\],])/g,
    (m, cad, num, sig) => cad ? `<span class="ct-js">${cad}</span>` : num ? `<span class="ct-jn">${num}</span>` : `<span class="ct-jp">${sig}${sig === "," ? " " : ""}</span>`);
  /* Posición de un elemento respecto a un ancestro posicionado (sin transformaciones) */
  function posicion(el, ancestro) {
    let x = 0, y = 0;
    while (el && el !== ancestro) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return { x, y };
  }

  /* ===== Construcción del DOM desde PROCESOS ===== */
  function pasoHTML(p, s, k) {
    let txt = "";
    if (s.txt) txt += `<p>${esc(s.txt)}</p>`;
    if (s.cita) txt += `<p class="ct-cita">${esc(s.cita)}</p>`;
    if (s.fuente) txt += `<p class="ct-fuente">${SVG_LIBRO}${esc(s.fuente)}</p>`;
    if (s.chips) txt += `<p class="ct-chips">${s.chips.map((c) => `<span class="ct-chip">${esc(c)}</span>`).join("")}</p>`;
    const n8n = s.n8n ? ' <span class="ct-n8n-pill">n8n</span>' : "";
    return `<li class="ct-paso${s.n8n ? " ct-n8n" : ""}" data-i="${k}">`
      + `<span class="ct-orbe" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${ICONOS[s.ico]}"/></svg><b class="ct-insignia">${k + 1}</b></span>`
      + `<button type="button" class="ct-caja" data-i="${k}" aria-expanded="false" aria-controls="ct-ficha-${p.id}" aria-label="Paso ${k + 1}, ${esc(s.tit)}: ver su ficha de datos"></button>`
      + `<span class="ct-id" aria-hidden="true">N${k + 1}${s.n8n ? " · n8n" : ""}</span>`
      + `<h3 class="ct-paso-tit">${esc(s.tit)}${n8n}</h3>`
      + `<p class="ct-paso-sub">${esc(s.sub)}</p>`
      + `<div class="ct-paso-txt">${txt}</div></li>`;
  }
  function jsonHTML(p) {
    const ult = p.pasos.length - 1;
    const linea = (s, d, extra, html) => `<span class="ct-jl${extra}" data-s="${s}" style="--d:${d}"><span class="ct-jc">${html}</span></span>`;
    const filas = [linea(0, 0, "", '<span class="ct-jp">{</span>')];
    p.json.forEach(([clave, valor, s, dest], j) => {
      let v = colorear(valor);
      if (dest) v = `<span class="ct-marca">${v}</span>`;
      const extra = (p.pasos[s].n8n ? " n8n" : "") + (dest ? " destacada" : "");
      filas.push(linea(s, 1, extra, `<span class="ct-jk">"${esc(clave)}"</span><span class="ct-jp">: </span>${v}${j < p.json.length - 1 ? '<span class="ct-jp">,</span>' : ""}`));
    });
    filas.push(linea(ult, 0, "", '<span class="ct-jp">}</span>'));
    return filas.join("");
  }
  function fichaHTML(p, k) {
    const s = p.pasos[k], datos = p.json.filter((e) => e[2] === k);
    const cuerpo = datos.length
      ? `<pre>{\n${datos.map(([c, v], j) => `  <span class="ct-jk">"${esc(c)}"</span><span class="ct-jp">: </span>${colorear(v)}${j < datos.length - 1 ? '<span class="ct-jp">,</span>' : ""}`).join("\n")}\n}</pre>`
      : `<p>${esc(s.txt || s.cita || "")}</p>`;
    return `<header><b>N${k + 1} · ${esc(s.tit)}</b><span class="demo-tag">demo</span></header>${cuerpo}`;
  }
  function panelHTML(p, i) {
    const conN8n = p.pasos.some((s) => s.n8n);
    return `<div class="ct-panel${QUIETO ? "" : " ct-anim"}" role="tabpanel" id="ct-panel-${p.id}" aria-labelledby="ct-tab-${p.id}" tabindex="0"${i ? " hidden" : ""}>`
      + `<div class="ct-escena">`
      + `<p class="ct-lamina" aria-hidden="true"><b>Lámina 0${i + 1}</b><span>${conFlecha(p.titulo)}</span><span class="ct-lam-esc">escala 1:1</span></p>`
      + `<div class="ct-pasos-wrap">`
      + `<div class="ct-luz" aria-hidden="true"></div>`
      + `<svg class="ct-capa" aria-hidden="true" focusable="false"></svg>`
      + `<span class="ct-cota-txt" aria-hidden="true">${esc(p.cota)} · demo</span>`
      + `<ol class="ct-pasos" style="--n:${p.pasos.length}" aria-label="Pasos del proceso">${p.pasos.map((s, k) => pasoHTML(p, s, k)).join("")}</ol>`
      + `<div class="ct-ficha" id="ct-ficha-${p.id}" hidden></div>`
      + `</div></div>`
      + `<p class="ct-leyenda">`
      + `<span class="ct-solo-nodos"><i class="ct-ley-orbe"></i>Paso del proceso</span>`
      + `<span class="ct-solo-nodos"><i class="ct-ley-linea"></i>Datos en movimiento</span>`
      + `<span class="ct-solo-plano"><i class="ct-ley-cable"></i>Cable de datos</span>`
      + `<span class="ct-solo-plano"><i class="ct-ley-paq"></i>Paquete en tránsito</span>`
      + (conN8n ? `<span><i class="ct-ley-n8n"></i>Paso orquestado con n8n</span>` : "")
      + `<span class="ct-pista ct-solo-nodos"><span class="ct-con-raton">Pasa el cursor por un paso y verás sus datos en el JSON</span><span class="ct-tactil">Toca un paso y verás sus datos en el JSON</span></span>`
      + `<span class="ct-pista ct-solo-plano"><i class="ct-ley-nodo"></i>Nodo: pasa el cursor o tócalo para ver su ficha</span>`
      + `</p>`
      + `<div class="ct-datos">`
      + `<figure class="ct-json"><figcaption class="ct-json-cab"><span>${SVG_LLAVES}${esc(p.archivo)}</span><span class="demo-tag">demo</span></figcaption>`
      + `<pre class="ct-json-pre"><code>${jsonHTML(p)}</code></pre></figure>`
      + `<div class="ct-res">`
      + `<p class="ct-res-eti">Resultado <span class="demo-tag">demo</span></p>`
      + `<p class="ct-res-estado" aria-hidden="true"><span class="ct-res-punto"></span><span class="ct-res-paso">Preparando el flujo…</span></p>`
      + `<div class="ct-res-cuerpo"><span class="ct-res-espera" aria-hidden="true"><i></i><i></i><i></i></span>`
      + `<p class="ct-res-txt">${esc(p.resultado[0])}<span class="ct-res-dato">${esc(p.resultado[1])}</span>${esc(p.resultado[2])}</p></div>`
      + `<div class="ct-controles"><button type="button" class="ct-btn ct-pausa">${SVG_PAUSA}<span>Pausar</span></button>`
      + `<button type="button" class="ct-btn ct-repetir">${SVG_REPETIR}<span>Ver de nuevo</span></button></div>`
      + `</div></div></div>`;
  }

  const tablist = sec.querySelector(".ct-pestanas");
  const contenedor = sec.querySelector(".ct-paneles");
  const ICONO_TAB = { leads: "mensaje", facturas: "factura", rag: "pregunta", informe: "informe" };
  tablist.innerHTML = PROCESOS.map((p, i) =>
    `<button type="button" role="tab" class="ct-tab" id="ct-tab-${p.id}" aria-controls="ct-panel-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">`
    + `<span class="ct-tab-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${ICONOS[ICONO_TAB[p.id]]}"/></svg></span>`
    + `<span class="ct-tab-cuerpo">`
    + `<span class="ct-tab-num" aria-hidden="true">Proceso 0${i + 1}</span>`
    + `<span class="ct-tab-tit">${conFlecha(p.titulo)}</span>`
    + `<span class="ct-tab-meta">${p.pasos.length} pasos${p.pasos.some((s) => s.n8n) ? ' <span class="ct-n8n-pill">n8n</span>' : ""}`
    + `<span class="ct-tab-estado" aria-hidden="true"><span class="ct-ver">Ver ›</span><span class="ct-viendo">Viendo</span></span></span>`
    + `</span>`
    + `<span class="ct-tab-barra" aria-hidden="true"><i></i></span>`
    + `</button>`).join("");
  contenedor.innerHTML = PROCESOS.map(panelHTML).join("");
  const tabs = [...tablist.querySelectorAll(".ct-tab")];
  const paneles = [...contenedor.querySelectorAll(".ct-panel")];
  if (QUIETO) sec.classList.add("ct-quieto");

  /* ===== Estado ===== */
  let actual = 0;
  let variante = RAIZ.dataset.flujo === "plano" ? "plano" : "nodos";
  let G = null;                   // geometría y referencias del panel activo
  let reloj = 0, ultimo = 0, raf = 0, pausado = false, visible = false;
  let visto = false;              // la secuencia ya se ha lanzado para la configuración actual
  const vertical = () => matchMedia("(max-width: 860px)").matches;

  /* Tiempos de la secuencia (ms): A(k) = momento en que el paso k se activa */
  const T0 = 350;
  /* Ritmo: 1,4 = un 40 % más despacio que la maqueta (el reloj de la secuencia y sus destellos) */
  const LENTO = 1.4;
  function tiempos(tipo, n) {
    if (tipo === "nodos") { const D = 1150; const A = (k) => T0 + k * D; return { A, fin: A(n - 1) + 750 }; }
    const D = 1000; const A = (k) => T0 + 450 + k * D + 420; return { A, D, fin: A(n - 1) + 600 };
  }

  /* ===== Geometría: capa SVG generada midiendo el DOM (vale para los 4 procesos) ===== */
  function construir() {
    const panel = paneles[actual], wrap = panel.querySelector(".ct-pasos-wrap"), svg = panel.querySelector(".ct-capa");
    const W = wrap.offsetWidth, H = wrap.offsetHeight;
    if (!W || !H) return;
    svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const n = PROCESOS[actual].pasos.length, vert = vertical();
    const previo = G && G.panel === panel && G.tipo === variante ? G : null;
    const base = { panel, wrap, svg, W, H, n, vert, tipo: variante, cache: {},
      pasos: [...panel.querySelectorAll(".ct-paso")], lineas: [...panel.querySelectorAll(".ct-jl")],
      barra: tabs[actual].querySelector(".ct-tab-barra i"), estado: panel.querySelector(".ct-res-paso"),
      t: tiempos(variante, n) };
    G = Object.assign(base, variante === "plano" ? geoPlano(base) : geoNodos(base));
    if (previo) { G.qPrev = previo.qPrev; G.vuelta = previo.vuelta; G.luzPos = previo.luzPos; }
    pintar(QUIETO ? G.t.fin : reloj);
  }

  function geoNodos(b) {
    const { panel, wrap, svg, W, H } = b, id = PROCESOS[actual].id;
    const pts = [...panel.querySelectorAll(".ct-orbe")].map((o) => {
      const q = posicion(o, wrap); return { x: q.x + o.offsetWidth / 2, y: q.y + o.offsetHeight / 2 };
    });
    let total = 0; const acum = [0];
    for (let i = 1; i < pts.length; i++) { total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); acum.push(total); }
    const fr = acum.map((a) => (total ? a / total : 0));
    const d = "M" + pts.map((p) => `${r1(p.x)} ${r1(p.y)}`).join("L");
    const a = pts[0], z = pts[pts.length - 1];
    svg.innerHTML = `<defs><linearGradient id="ct-g-${id}" gradientUnits="userSpaceOnUse" x1="${r1(a.x)}" y1="${r1(a.y)}" x2="${r1(z.x)}" y2="${r1(z.y)}">`
      + `<stop offset="0" style="stop-color:var(--sea)"/><stop offset=".5" style="stop-color:#5B5F9E"/><stop offset="1" style="stop-color:var(--red)"/></linearGradient>`
      + `<filter id="ct-f-${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feGaussianBlur stdDeviation="5"/></filter></defs>`
      + `<path class="ct-via" d="${d}"/>`
      + `<path class="ct-brillo" pathLength="1" d="${d}" stroke="url(#ct-g-${id})" filter="url(#ct-f-${id})"/>`
      + `<path class="ct-traza" pathLength="1" d="${d}" stroke="url(#ct-g-${id})"/>`
      + `<path class="ct-pulso" pathLength="1" d="${d}" stroke="url(#ct-g-${id})" filter="url(#ct-f-${id})"/>`
      + `<path class="ct-pulso-n" pathLength="1" d="${d}"/>`
      + `<g class="ct-cometa"><circle class="ct-cometa-h" r="11"/><circle class="ct-cometa-n" r="3.6"/></g>`;
    return { pts, fr, total,
      brillo: svg.querySelector(".ct-brillo"), traza: svg.querySelector(".ct-traza"),
      pulso: svg.querySelector(".ct-pulso"), pulsoN: svg.querySelector(".ct-pulso-n"),
      cometa: svg.querySelector(".ct-cometa"), luz: panel.querySelector(".ct-luz"),
      orbes: [...panel.querySelectorAll(".ct-orbe")], luzPos: null, qPrev: -1, vuelta: -1 };
  }

  function geoPlano(b) {
    const { panel, wrap, svg, vert } = b, P = PROCESOS[actual];
    const cajas = [...panel.querySelectorAll(".ct-caja")].map((c) => {
      const q = posicion(c, wrap); return { x: q.x, y: q.y, w: c.offsetWidth, h: c.offsetHeight };
    });
    const n = cajas.length, c0 = cajas[0], cN = cajas[n - 1];
    let h = "", cota;
    if (!vert) {
      const y = c0.y - 30, x1 = c0.x, x2 = cN.x + cN.w;
      h += `<path class="ct-tick" d="M${x1 + .5} ${y - 9}V${c0.y - 6}M${x2 - .5} ${y - 9}V${cN.y - 6}"/>`
        + `<path class="ct-cota-l" pathLength="1" d="M${x1 + 2} ${y}H${x2 - 2}"/>`
        + `<path class="ct-cota-p" d="M${x1 + 1} ${y}l9 -3.5v7zM${x2 - 1} ${y}l-9 -3.5v7z"/>`;
      cota = { x: (x1 + x2) / 2, y, rot: 0 };
    } else {
      const x = c0.x - 24, y1 = c0.y, y2 = cN.y + cN.h;
      h += `<path class="ct-tick" d="M${x - 9} ${y1 + .5}H${c0.x - 6}M${x - 9} ${y2 - .5}H${cN.x - 6}"/>`
        + `<path class="ct-cota-l" pathLength="1" d="M${x} ${y1 + 2}V${y2 - 2}"/>`
        + `<path class="ct-cota-p" d="M${x} ${y1 + 1}l-3.5 9h7zM${x} ${y2 - 1}l-3.5 -9h7z"/>`;
      cota = { x, y: (y1 + y2) / 2, rot: -90 };
    }
    cajas.forEach((c, k) => { h += `<rect class="ct-marco${P.pasos[k].n8n ? " n8n" : ""}" pathLength="1" x="${r1(c.x + .6)}" y="${r1(c.y + .6)}" width="${r1(c.w - 1.2)}" height="${r1(c.h - 1.2)}"/>`; });
    for (let k = 0; k < n - 1; k++) {
      const a = cajas[k], z = cajas[k + 1];
      let x1, y1, x2, y2, punta;
      if (!vert) { y1 = y2 = r1(a.y + a.h / 2); x1 = a.x + a.w; x2 = z.x; punta = `M${x2 - 9} ${y2 - 4.5}L${x2 - 2} ${y2}L${x2 - 9} ${y2 + 4.5}`; }
      else { x1 = x2 = a.x + 20; y1 = a.y + a.h; y2 = z.y; punta = `M${x2 - 4.5} ${y2 - 9}L${x2} ${y2 - 2}L${x2 + 4.5} ${y2 - 9}`; }
      h += `<g class="ct-hilo-g"><path class="ct-hilo" pathLength="1" d="M${x1} ${y1}L${x2} ${y2}"/><path class="ct-punta" d="${punta}"/>`
        + `<circle class="ct-pin" cx="${x1}" cy="${y1}" r="3"/><circle class="ct-pin" cx="${x2}" cy="${y2}" r="3"/></g>`;
    }
    h += `<g class="ct-paquetes">${'<g class="ct-paquete"><rect class="ct-paq-h" x="-8" y="-8" width="16" height="16"/><rect class="ct-paq" x="-4" y="-4" width="8" height="8"/></g>'.repeat(2)}</g>`;
    svg.innerHTML = h;
    const txt = panel.querySelector(".ct-cota-txt");
    txt.style.left = cota.x + "px"; txt.style.top = cota.y + "px";
    txt.style.transform = `translate(-50%,-50%)${cota.rot ? ` rotate(${cota.rot}deg)` : ""}`;
    /* Recorrido de un paquete: «procesado» breve dentro de cada caja y viaje visible por cada cable */
    const tramos = [];
    cajas.forEach((a, k) => {
      tramos.push({ caja: k, dur: 400 });
      if (k === n - 1) return;
      const z = cajas[k + 1];
      const s = !vert ? { x1: a.x + a.w + 4, y1: a.y + a.h / 2, x2: z.x - 4, y2: a.y + a.h / 2 } : { x1: a.x + 20, y1: a.y + a.h + 4, x2: z.x + 20, y2: z.y - 4 };
      s.dur = Math.max(520, Math.hypot(s.x2 - s.x1, s.y2 - s.y1) / .11);
      tramos.push(s);
    });
    const ciclo = tramos.reduce((a, s) => a + s.dur, 0) + 700;
    return { cajas, cotaTxt: txt, tramos, ciclo,
      cotaL: svg.querySelector(".ct-cota-l"), cotaP: svg.querySelector(".ct-cota-p"), tick: svg.querySelector(".ct-tick"),
      marcos: [...svg.querySelectorAll(".ct-marco")],
      hilos: [...svg.querySelectorAll(".ct-hilo-g")].map((g) => ({ path: g.querySelector(".ct-hilo"), punta: g.querySelector(".ct-punta"), pins: g.querySelectorAll(".ct-pin") })),
      paq: [...svg.querySelectorAll(".ct-paquete")] };
  }

  /* ===== Pintado de un instante t de la secuencia ===== */
  function trazo(el, f) {          // dibuja la fracción f (0–1) de un trazo con pathLength=1
    const v = r1(f * 1000) / 1000;
    if (el.__f === v) return;
    el.__f = v;
    el.style.strokeDashoffset = String(1 - v);
    el.style.opacity = v <= .001 ? "0" : "";
  }
  function opac(el, v) { if (el.__o !== v) { el.__o = v; el.style.opacity = v; } }

  function pintar(t) {
    if (!G) return;
    const { A, fin } = G.t, n = G.n;
    let k = -1;
    for (let j = 0; j < n; j++) if (t >= A(j)) k = j;
    const hecho = t >= fin;
    const clave = hecho ? "fin" : String(k);
    if (G.cache.pasos !== clave) {
      const previo = G.cache.pasos;
      G.cache.pasos = clave;
      G.pasos.forEach((li, j) => { li.classList.toggle("on", !hecho && j === k); li.classList.toggle("ok", hecho || j < k); });
      G.lineas.forEach((l) => { const s = +l.dataset.s; l.classList.toggle("on", !hecho && s === k); l.classList.toggle("ok", hecho || s < k); });
      G.panel.classList.toggle("fin", hecho);
      const P = PROCESOS[actual];
      G.estado.textContent = hecho ? `Completado · ${n} de ${n} pasos` : k < 0 ? "Preparando el flujo…" : `Paso ${k + 1} de ${n} · ${P.pasos[k].tit}`;
      if (!QUIETO && previo !== undefined && k >= 0 && !hecho) destello(k);
    }
    const pb = QUIETO ? 1 : limitar(t / fin);
    if (G.cache.barra !== pb) { G.cache.barra = pb; G.barra.style.setProperty("--p", pb.toFixed(3)); }
    if (G.tipo === "nodos") pintarNodos(t, k, hecho);
    else pintarPlano(t, hecho);
  }

  /* «nodos»: el trazo degradado avanza de nodo en nodo; después, un pulso de luz recorre la línea */
  const VIAJE = 560, CICLO = 4400, RECORRIDO = 2900;
  function pintarNodos(t, k, hecho) {
    const { A, fin } = G.t;
    let f = 0, viajando = false;
    if (hecho) f = 1;
    else if (k >= 0) {
      f = G.fr[k];
      if (k < G.n - 1) {
        const s = A(k + 1) - VIAJE;
        if (t > s) { viajando = true; f = G.fr[k] + (G.fr[k + 1] - G.fr[k]) * suave((t - s) / VIAJE); }
      }
    }
    trazo(G.traza, f); trazo(G.brillo, f);
    let cabeza = f, verCometa = viajando;
    /* Fase en vivo */
    let q = null;
    if (hecho && !QUIETO) {
      const tl = t - fin - 500;
      if (tl >= 0) {
        const vuelta = Math.floor(tl / CICLO), c = tl % CICLO;
        if (vuelta !== G.vuelta) { G.vuelta = vuelta; G.qPrev = -1; }
        if (c < RECORRIDO) q = suave(c / RECORRIDO);
      }
    }
    if (q !== null) {
      const L = .075;
      G.pulso.style.strokeDasharray = G.pulsoN.style.strokeDasharray = `${L} 3`;
      G.pulso.style.strokeDashoffset = G.pulsoN.style.strokeDashoffset = String(L - q);
      const fade = limitar(Math.min(q, 1 - q) / .06);
      opac(G.pulso, String(r1(.75 * fade * 100) / 100)); opac(G.pulsoN, String(r1(.9 * fade * 100) / 100));
      G.fr.forEach((fr, j) => { if (fr > G.qPrev + 1e-6 && fr <= q + 1e-6 && j > 0) destello(j, true); });
      if (G.qPrev < 0 && q >= 0) destello(0, true);
      G.qPrev = q;
      cabeza = q; verCometa = true;
    } else { opac(G.pulso, "0"); opac(G.pulsoN, "0"); }
    const pc = puntoEn(cabeza);
    G.cometa.setAttribute("transform", `translate(${r1(pc.x)} ${r1(pc.y)})`);
    opac(G.cometa, verCometa ? "1" : "0");
    /* Luz ambiental que sigue al dato */
    const objetivo = puntoEn(hecho && q === null ? 1 : cabeza);
    if (!G.luzPos) G.luzPos = { x: objetivo.x, y: objetivo.y };
    G.luzPos.x += (objetivo.x - G.luzPos.x) * .07; G.luzPos.y += (objetivo.y - G.luzPos.y) * .07;
    G.luz.style.transform = `translate3d(${r1(G.luzPos.x)}px,${r1(G.luzPos.y)}px,0)`;
    G.luz.classList.toggle("ver", k >= 0 || hecho);
  }
  function puntoEn(f) {
    const pts = G.pts, obj = f * G.total;
    let a = 0;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], q = pts[i], l = Math.hypot(q.x - p.x, q.y - p.y);
      if (a + l >= obj || i === pts.length - 1) { const u = l ? limitar((obj - a) / l) : 0; return { x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u }; }
      a += l;
    }
    return pts[0];
  }

  /* «plano»: cota, cajas y cables se dibujan solos; después circulan paquetes */
  function pintarPlano(t, hecho) {
    const { D, fin } = G.t, ini = T0 + 450;
    const p = (a, dur) => limitar((t - a) / dur);
    trazo(G.cotaL, p(T0 - 200, 600));
    const vc = p(T0 + 150, 350) > 0 ? "1" : "0";
    opac(G.cotaP, vc); opac(G.tick, vc); opac(G.cotaTxt, String(r1(p(T0 + 200, 400) * 100) / 100));
    G.marcos.forEach((r, j) => trazo(r, p(ini + j * D, 420)));
    G.pasos.forEach((li, j) => { const v = t >= ini + j * D + 220; if (li.__v !== v) { li.__v = v; li.classList.toggle("visto", v); } });
    G.hilos.forEach((h, j) => {
      const w = p(ini + j * D + 420, 380);
      trazo(h.path, w);
      opac(h.pins[0], w > 0 ? "1" : "0"); opac(h.pins[1], w >= 1 ? "1" : "0"); opac(h.punta, w >= 1 ? "1" : "0");
    });
    paquetes(hecho ? t - fin : -1);
  }
  function paquetes(tl) {
    const calientes = new Array(G.n).fill(false), cables = G.tramos.filter((s) => s.caja === undefined);
    G.paq.forEach((g, m) => {
      let s = null, f = .5, alfa = 1;
      if (QUIETO) s = cables[m * Math.max(1, cables.length - 1)] || null;      // fijos, en mitad de un cable
      else if (tl >= 0) {
        let u = (tl + m * G.ciclo / 2) % G.ciclo;
        for (const tr of G.tramos) {
          if (u < tr.dur) { if (tr.caja !== undefined) calientes[tr.caja] = true; else { s = tr; f = u / tr.dur; } break; }
          u -= tr.dur;
        }
        alfa = limitar(Math.min(f, 1 - f) * (s ? s.dur : 0) / 80) * limitar(tl / 400);
      }
      if (!s) { opac(g, "0"); return; }
      g.setAttribute("transform", `translate(${r1(s.x1 + (s.x2 - s.x1) * f)} ${r1(s.y1 + (s.y2 - s.y1) * f)})`);
      opac(g, String(r1(alfa * 100) / 100));
    });
    G.marcos.forEach((r, j) => { const v = !QUIETO && calientes[j]; if (r.__c !== v) { r.__c = v; r.classList.toggle("caliente", v); } });
  }

  /* Destello al llegar a un paso: anillo en el nodo y barrido en sus líneas del JSON */
  function destello(k, suaveVivo) {
    if (G.tipo === "nodos") {
      const o = G.orbes[k];
      if (o && o.animate) o.animate([{ opacity: suaveVivo ? .5 : .8, transform: "scale(1)" }, { opacity: 0, transform: `scale(${suaveVivo ? 1.55 : 1.8})` }],
        { duration: (suaveVivo ? 1100 : 1000) * LENTO, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::after" });
    } else {
      const r = G.marcos[k];
      if (r && r.animate) r.animate([{ fill: "rgba(163,49,42,.12)" }, { fill: "rgba(163,49,42,0)" }], { duration: 900 * LENTO, easing: "ease-out" });
    }
    if (suaveVivo) G.lineas.forEach((l) => {
      if (+l.dataset.s === k && l.animate) l.animate([
        { backgroundPosition: "0 0", backgroundSize: "0% 100%" },
        { backgroundPosition: "0 0", backgroundSize: "100% 100%", offset: .4 },
        { backgroundPosition: "100% 0", backgroundSize: "0% 100%" }], { duration: 1100 * LENTO, easing: "ease-in-out" });
    });
  }

  /* ===== Reloj (rAF): avanza solo si no está en pausa; en vivo, solo con la sección a la vista ===== */
  function bucle(ahora) {
    raf = 0;
    if (!G || !visto) { ultimo = 0; return; }
    const dt = ultimo ? Math.min(ahora - ultimo, 50) : 0;
    ultimo = ahora;
    if (!pausado) reloj += dt / LENTO;
    pintar(reloj);
    if (!pausado && (visible || reloj < G.t.fin + 800)) raf = requestAnimationFrame(bucle);
    else ultimo = 0;
  }
  function arrancar() { if (!raf && !QUIETO && !pausado && visto) { ultimo = 0; raf = requestAnimationFrame(bucle); } }
  function reiniciar() {
    visto = true;
    cerrarFicha();
    reloj = 0;
    if (!G) construir();
    if (!G) return;
    G.cache = {}; G.luzPos = null; G.qPrev = -1; G.vuelta = -1;
    if (QUIETO) { pintar(G.t.fin); return; }
    pintar(0);
    arrancar();
  }
  function pausar(v) {
    pausado = v;
    sec.classList.toggle("ct-pausado", v);
    sec.querySelectorAll(".ct-pausa").forEach((b) => { b.innerHTML = v ? `${SVG_PLAY}<span>Reanudar</span>` : `${SVG_PAUSA}<span>Pausar</span>`; });
    if (!v) arrancar();
  }

  /* ===== Pestañas (role=tablist, flechas, Inicio/Fin) ===== */
  function activar(i) {
    pausar(false);
    if (i === actual) { reiniciar(); return; }
    tabs[actual].querySelector(".ct-tab-barra i").style.setProperty("--p", "0");
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    paneles.forEach((p, j) => { p.hidden = j !== i; });
    cerrarFicha();
    actual = i;
    const panel = paneles[i];
    panel.classList.remove("entra"); void panel.offsetWidth; panel.classList.add("entra");
    G = null;
    construir();
    reiniciar();
  }
  tablist.addEventListener("click", (e) => { const b = e.target.closest(".ct-tab"); if (b) activar(tabs.indexOf(b)); });
  tablist.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const j = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault();
    activar(j);
    tabs[j].focus();
  });

  /* ===== Interacción: controles, foco en el JSON y fichas de los nodos («plano») ===== */
  let fichaFija = -1, fichaVista = -1;
  function enfocar(k) { if (G) G.lineas.forEach((l) => l.classList.toggle("foco", +l.dataset.s === k)); }
  function mostrarFicha(k) {
    if (!G || G.tipo !== "plano") return;
    const ficha = G.panel.querySelector(".ct-ficha"), c = G.cajas[k];
    ficha.innerHTML = fichaHTML(PROCESOS[actual], k);
    ficha.hidden = false;
    const w = ficha.offsetWidth, cx = G.vert ? c.x + 20 : c.x + c.w / 2;
    const left = G.vert ? limitar(c.x, 0, Math.max(0, G.W - w)) : limitar(cx - w / 2, 0, Math.max(0, G.W - w));
    ficha.style.left = left + "px";
    ficha.style.top = c.y + c.h + 14 + "px";
    ficha.style.setProperty("--lx", r1(cx - left) + "px");
    G.marcos.forEach((r, j) => r.classList.toggle("sel", j === k));
    G.panel.querySelectorAll(".ct-caja").forEach((b, j) => b.setAttribute("aria-expanded", String(j === k)));
    fichaVista = k;
    enfocar(k);
  }
  function cerrarFicha() {
    paneles.forEach((p) => {
      const f = p.querySelector(".ct-ficha"); if (f) f.hidden = true;
      p.querySelectorAll(".ct-caja[aria-expanded='true']").forEach((b) => b.setAttribute("aria-expanded", "false"));
    });
    if (G && G.marcos) G.marcos.forEach((r) => r.classList.remove("sel"));
    fichaVista = fichaFija = -1;
    enfocar(-1);
  }
  contenedor.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.classList.contains("ct-pausa")) pausar(!pausado);
    else if (b.classList.contains("ct-repetir")) { pausar(false); reiniciar(); }
    else if (b.classList.contains("ct-caja")) {
      e.stopPropagation();
      const k = +b.dataset.i;
      if (fichaFija === k) cerrarFicha(); else { mostrarFicha(k); fichaFija = k; }
    }
  });
  contenedor.addEventListener("pointerover", (e) => {
    const li = e.target.closest(".ct-paso");
    if (!li || fichaFija >= 0) return;
    const k = +li.dataset.i;
    if (G && G.tipo === "plano") { if (e.target.closest(".ct-caja") && fichaVista !== k) mostrarFicha(k); }
    else enfocar(k);
  });
  contenedor.addEventListener("pointerout", (e) => {
    if (fichaFija >= 0) return;
    const li = e.target.closest(".ct-paso");
    if (!li || li.contains(e.relatedTarget)) return;
    if (G && G.tipo === "plano") cerrarFicha(); else enfocar(-1);
  });
  contenedor.addEventListener("focusin", (e) => { const b = e.target.closest(".ct-caja"); if (b && fichaFija < 0) mostrarFicha(+b.dataset.i); });
  contenedor.addEventListener("focusout", (e) => { if (e.target.closest(".ct-caja") && fichaFija < 0 && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".ct-caja"))) cerrarFicha(); });
  document.addEventListener("click", (e) => { if (fichaFija >= 0 && !e.target.closest("#como-trabajamos .ct-ficha")) cerrarFicha(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && fichaVista >= 0) cerrarFicha(); });

  /* ===== Cambios de tamaño (también tipografía y fuentes cargadas): se vuelve a medir ===== */
  let rafRO = 0;
  const reconstruir = () => { rafRO = 0; const f = fichaVista, fija = fichaFija; construir(); if (f >= 0) { mostrarFicha(f); fichaFija = fija; } };
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => { if (!rafRO) rafRO = requestAnimationFrame(reconstruir); });
    paneles.forEach((p) => ro.observe(p.querySelector(".ct-pasos-wrap")));
  } else addEventListener("resize", () => { if (!rafRO) rafRO = requestAnimationFrame(reconstruir); });

  /* ===== Opciones del configurador: con la sección a la vista se repite al momento;
     fuera de pantalla queda preparada para reproducirse al llegar a ella ===== */
  function repetirOPreparar() {
    pausar(false);
    if (visible || QUIETO) { reiniciar(); return; }
    visto = false; reloj = 0;
    if (G) { G.cache = {}; pintar(0); }
  }

  /* ===== Arranque: la secuencia se reproduce cuando el diagrama entra en pantalla (IAC.alVer).
     Al volver más tarde no se reinicia (se puede leer tranquilo): sigue el bucle en vivo. ===== */
  construir();
  if (QUIETO) { if (G) pintar(G.t.fin); }
  else {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => es.forEach((e) => {
        visible = e.isIntersecting;
        if (visible) { arrancar(); return; }
        /* Si sale de pantalla a mitad de la secuencia, se completa sin animar (ahorra trabajo) */
        if (G && visto && reloj > 0 && reloj < G.t.fin + 800) { reloj = G.t.fin + 800; pintar(reloj); }
      }), { threshold: 0 }).observe(contenedor);
    } else visible = true;
    /* Disparador: el primer paso de cada proceso (tamaño estable en cualquier variante y ancho) */
    paneles.forEach((p) => IAC.alVer(p.querySelector(".ct-paso"), () => { if (!visto) reiniciar(); }, { umbral: .4, repetir: true }));
  }
})();
