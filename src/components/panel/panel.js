(() => {
  const IAC = window.IAC || {};
  const panel = document.getElementById("panel");
  const pruebas = document.getElementById("pruebas");
  const reducido = !!IAC.reducido;
  const alVer = (el, cb, op) => { if (el) (IAC.alVer ? IAC.alVer(el, cb, op) : cb(el)); };
  const q = (s, c) => (c || panel).querySelector(s);
  const qa = (s, c) => Array.from((c || panel).querySelectorAll(s));
  const coma = (n) => n.toFixed(1).replace(".", ",");
  const r1 = (n) => Math.round(n * 10) / 10;

  /* Contador con desaceleración; «hasta» puede ser una función (objetivo vivo) */
  function contar(el, hasta, ms, fmt) {
    const t0 = performance.now();
    const paso = (t) => {
      const p = Math.min(1, Math.max(0, (t - t0) / ms)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt((typeof hasta === "function" ? hasta() : hasta) * e);
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  /* ===== #pruebas: cifras reales, siempre en el DOM; solo aparecen con calma al verse ===== */
  if (pruebas && !reducido) {
    pruebas.classList.add("pru-js");
    alVer(pruebas.querySelector(".pru-lista"), (el) => el.classList.add("pru-visto"), { umbral: 0.35 });
  }
  if (!panel) return;

  /* ===== Pausa y visibilidad: los bucles solo avanzan con el panel a la vista ===== */
  let pausado = false, enVista = !("IntersectionObserver" in window);
  const cola = [];
  const activo = () => !pausado && enVista && !document.hidden;
  const despertar = () => { if (activo()) cola.splice(0).forEach((r) => r()); };
  const listo = () => (activo() ? Promise.resolve() : new Promise((r) => cola.push(r)));
  const dormir = (ms) => new Promise((r) => setTimeout(r, ms)).then(listo);
  if (!enVista) new IntersectionObserver((es) => {
    enVista = es[es.length - 1].isIntersecting;
    panel.classList.toggle("pnl-fuera", !enVista); // fuera de pantalla, también se paran los bucles CSS
    despertar();
  }).observe(panel);
  document.addEventListener("visibilitychange", despertar);

  const btnPausa = q(".pnl-pausa"), btnTxt = q(".pnl-pausa-txt");
  if (reducido) btnPausa.hidden = true;
  btnPausa.addEventListener("click", () => {
    pausado = !pausado;
    panel.classList.toggle("pnl-pausado", pausado);
    btnTxt.textContent = pausado ? "Reanudar demo" : "Pausar demo";
    despertar();
  });

  /* ===== Gráficos SVG en píxeles reales (nítidos a cualquier ancho) ===== */
  function curva(p) { // Catmull-Rom → Bézier
    let d = `M${r1(p[0][0])} ${r1(p[0][1])}`;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += ` C${r1(b[0] + (c[0] - a[0]) / 6)} ${r1(b[1] + (c[1] - a[1]) / 6)} ${r1(c[0] - (e[0] - b[0]) / 6)} ${r1(c[1] - (e[1] - b[1]) / 6)} ${r1(c[0])} ${r1(c[1])}`;
    }
    return d;
  }
  function puntos(v, w, h, min, max) {
    const mx = 7, arriba = 10, abajo = 3;
    return v.map((x, i) => [mx + (i * (w - 2 * mx)) / (v.length - 1), arriba + (1 - (x - min) / (max - min)) * (h - arriba - abajo)]);
  }
  function pintar(svg, p, h) {
    const d = curva(p), u = p[p.length - 1], f = p[0];
    svg.querySelector(".pnl-linea").setAttribute("d", d);
    svg.querySelector(".pnl-area").setAttribute("d", `${d} L${r1(u[0])} ${r1(h)} L${r1(f[0])} ${r1(h)} Z`);
    svg.querySelectorAll(".pnl-punto,.pnl-halo").forEach((c) => { c.setAttribute("cx", r1(u[0])); c.setAttribute("cy", r1(u[1])); });
  }
  const medida = (svg) => { const r = svg.getBoundingClientRect(); return r.width && r.height ? [r.width, r.height] : null; };

  const leads = {
    tile: q(".pnl-leads"), num: q("[data-pnl-leads]"), hora: q("[data-pnl-hora]"), svg: q(".pnl-leads .pnl-graf"),
    total: 27, ultima: 3, serie: [0, 2, 5, 7, 9, 13, 15, 18, 22, 24, 27],
    dibujar() {
      const m = medida(this.svg); if (!m) return;
      pintar(this.svg, puntos(this.serie, m[0], m[1], 0, Math.max(...this.serie) * 1.15), m[1]);
    },
    sumar() { // serie acumulada por horas: el último punto es siempre el total del día
      const s = this.serie;
      if (this.ultima >= 6) { s.push(this.total); if (s.length > 24) s.shift(); }
      this.total++;
      s[s.length - 1] = this.total;
      this.ultima = this.total - s[s.length - 2];
      this.num.textContent = this.total;
      this.hora.textContent = this.ultima;
      this.num.classList.remove("pnl-bump"); void this.num.offsetWidth; this.num.classList.add("pnl-bump");
      this.dibujar();
    },
  };
  const informe = {
    tile: q(".pnl-inf"), num: q("[data-pnl-inf]"), svg: q(".pnl-inf .pnl-graf"),
    actual: [60, 59, 64, 68, 67, 74, 78, 83.2], anterior: [58, 56, 60, 63, 64, 68, 71, 76.75],
    dibujar() {
      const m = medida(this.svg); if (!m) return;
      pintar(this.svg, puntos(this.actual, m[0], m[1], 52, 86), m[1]);
      this.svg.querySelector(".pnl-ant").setAttribute("d", curva(puntos(this.anterior, m[0], m[1], 52, 86)));
    },
  };
  const redibujar = () => { leads.dibujar(); informe.dibujar(); };
  redibujar();
  if ("ResizeObserver" in window) { const ro = new ResizeObserver(redibujar); ro.observe(leads.svg); ro.observe(informe.svg); }

  /* ===== n8n · flujo de captación ===== */
  const LEADS = [
    { nombre: "Seguro de flota", canal: "web", intencion: "presupuesto", prioridad: "alta", valor: "4.800 €", seg: 12 },
    { nombre: "Asesoría fiscal", canal: "email", intencion: "cita", prioridad: "media", valor: "1.900 €", seg: 14 },
    { nombre: "Alquiler nave", canal: "WhatsApp", intencion: "visita", prioridad: "alta", valor: "2.600 €", seg: 9 },
    { nombre: "Reforma oficina", canal: "web", intencion: "presupuesto", prioridad: "media", valor: "7.500 €", seg: 11 },
  ];
  const PASOS = [
    (l) => `Webhook · nuevo lead: «${l.nombre}» (${l.canal})`,
    (l) => `IA (Claude) · intención: ${l.intencion} · prioridad ${l.prioridad}`,
    () => "CRM · oportunidad creada en «Nuevo»",
    () => "Email / aviso · respuesta al cliente y aviso al comercial",
  ];
  const DURACION = [850, 1500, 900, 950];
  const n8n = {
    tile: q(".pnl-n8n"), nodos: qa(".pnl-nodo"), aristas: qa(".pnl-arista"), estado: q(".pnl-estado"), txt: q(".pnl-estado-txt"),
    poner(modo, texto) { this.estado.dataset.modo = modo; this.txt.textContent = texto; },
    limpiar() {
      this.nodos.forEach((n) => n.classList.remove("pnl-run", "pnl-ok"));
      this.aristas.forEach((a) => a.classList.remove("pnl-on", "pnl-ok"));
    },
    final(l) {
      this.nodos.forEach((n) => n.classList.add("pnl-ok"));
      this.aristas.forEach((a) => a.classList.add("pnl-ok"));
      this.poner("ok", `Ejecución correcta · ${l.seg} s`);
    },
  };
  const registro = {
    lista: q(".pnl-ejec-lista"), minuto: 10 * 60 + 42, n: 0,
    anotar(l) {
      const li = this.lista.firstElementChild.cloneNode(true);
      const hh = String(Math.floor(this.minuto / 60) % 24).padStart(2, "0"), mm = String(this.minuto % 60).padStart(2, "0");
      li.querySelector(".pnl-ejec-nom").textContent = l.nombre;
      li.querySelector(".pnl-ejec-seg").textContent = `${l.seg} s`;
      li.querySelector(".pnl-ejec-hora").textContent = `${hh}:${mm}`;
      li.classList.add("pnl-nueva");
      this.lista.prepend(li);
      while (this.lista.children.length > 4) this.lista.lastElementChild.remove();
      this.minuto += 4 + (this.n++ % 3) * 3;
    },
  };

  /* ===== CRM: la oportunidad creada por n8n avanza por el embudo ===== */
  const crm = {
    tubo: q(".pnl-tubo"), cols: qa(".pnl-col"), lead: q(".pnl-lead"), nom: q(".pnl-lead b"),
    canal: q(".pnl-lead-canal"), valor: q(".pnl-lead-valor"), cuentas: qa(".pnl-col-cab span"),
    base: [2, 2, 1, 1], gen: 0,
    /* Mueve la oportunidad a la etapa s; las tarjetas se recolocan con FLIP (como un kanban real) */
    colocar(s, animar) {
      const tarjetas = qa(".pnl-tarj, .pnl-lead", this.tubo);
      const antes = animar ? tarjetas.map((t) => t.getBoundingClientRect()) : [];
      const col = this.cols[s];
      col.insertBefore(this.lead, col.children[1] || null);
      this.lead.classList.toggle("pnl-ganado", s === 3);
      this.cuentas.forEach((c, i) => { c.textContent = this.base[i] + (i === s ? 1 : 0); });
      if (!animar || !this.lead.animate) return;
      const oculta = this.lead.classList.contains("pnl-oculto");
      tarjetas.forEach((t, i) => {
        if (t === this.lead && oculta) return;
        const a = antes[i], b = t.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) t.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: t === this.lead ? 820 : 560, easing: "cubic-bezier(.2,.75,.2,1)" });
      });
    },
    rellenar(l) { this.nom.textContent = l.nombre; this.canal.textContent = l.canal + " · "; this.valor.textContent = l.valor; },
    async nuevo(l) {
      const g = ++this.gen;
      this.lead.classList.add("pnl-oculto");
      await dormir(340); if (g !== this.gen) return;
      this.rellenar(l);
      this.colocar(0, true);
      void this.lead.offsetWidth;
      this.lead.classList.remove("pnl-oculto");
      for (let s = 1; s <= 3; s++) { await dormir(1500); if (g !== this.gen) return; this.colocar(s, true); }
    },
  };

  /* ===== Factura: las cajas OCR recorren los campos uno a uno ===== */
  const ocr = {
    tile: q(".pnl-ocr"), escaner: q(".pnl-escaner"), campos: qa(".pnl-c"), filas: qa(".pnl-extr li"), asiento: q(".pnl-asiento"),
    mover(i) {
      const c = this.campos[i], alto = this.escaner.offsetHeight;
      this.escaner.style.setProperty("--y", (c ? c.offsetTop + c.offsetHeight - alto + 3 : -alto - 2) + "px");
    },
    limpiar() {
      this.campos.forEach((c) => c.classList.remove("pnl-on", "pnl-ok"));
      this.filas.forEach((f) => f.classList.remove("pnl-on", "pnl-ok"));
      this.asiento.classList.remove("pnl-ok");
    },
    final() {
      this.campos.forEach((c) => c.classList.add("pnl-ok"));
      this.filas.forEach((f) => f.classList.add("pnl-ok"));
      this.asiento.classList.add("pnl-ok");
    },
  };

  /* Movimiento reducido: estado final, quieto */
  if (reducido) {
    n8n.final(LEADS[0]);
    crm.rellenar(LEADS[0]); crm.colocar(3, false);
    ocr.final();
    return;
  }

  async function bucleN8n() {
    for (let i = 0; ; i++) {
      const l = LEADS[i % LEADS.length];
      n8n.limpiar();
      n8n.poner("espera", "Esperando un nuevo lead…");
      await dormir(i ? 1100 : 500);
      for (let k = 0; k < n8n.nodos.length; k++) {
        const nodo = n8n.nodos[k];
        nodo.classList.add("pnl-run");
        n8n.poner("run", PASOS[k](l));
        await dormir(DURACION[k]);
        nodo.classList.remove("pnl-run"); nodo.classList.add("pnl-ok");
        if (k === 2) { crm.nuevo(l); leads.sumar(); }
        const a = n8n.aristas[k];
        if (a) { a.classList.add("pnl-on"); await dormir(620); a.classList.remove("pnl-on"); a.classList.add("pnl-ok"); }
      }
      n8n.poner("ok", `Ejecución correcta · ${l.seg} s`);
      registro.anotar(l);
      await dormir(3800);
    }
  }
  async function bucleOcr() {
    for (;;) {
      ocr.limpiar();
      ocr.mover(-1);
      ocr.tile.classList.add("pnl-escaneando");
      await dormir(700);
      for (let i = 0; i < ocr.campos.length; i++) {
        ocr.campos[i].classList.add("pnl-on"); ocr.filas[i].classList.add("pnl-on"); ocr.mover(i);
        await dormir(450);
        ocr.filas[i].classList.add("pnl-ok");
        await dormir(600);
        ocr.campos[i].classList.remove("pnl-on"); ocr.campos[i].classList.add("pnl-ok"); ocr.filas[i].classList.remove("pnl-on");
      }
      ocr.tile.classList.remove("pnl-escaneando");
      ocr.asiento.classList.add("pnl-ok");
      await dormir(3400);
    }
  }

  /* Entrada escalonada: cada pieza aparece y arranca solo cuando se ve */
  panel.classList.add("pnl-js");
  const horasNum = q("[data-pnl-horas]");
  leads.num.textContent = "0"; horasNum.textContent = "0"; informe.num.textContent = "+0,0";
  crm.rellenar(LEADS[LEADS.length - 1]); // la última oportunidad del ciclo espera en «Ganado»
  const arranque = new Map([
    [leads.tile, () => contar(leads.num, () => leads.total, 1600, (v) => String(Math.round(v)))],
    [q(".pnl-horas"), () => contar(horasNum, 46, 1800, (v) => String(Math.round(v)))],
    [informe.tile, () => contar(informe.num, 8.4, 1700, (v) => "+" + coma(v))],
    [n8n.tile, bucleN8n],
    [ocr.tile, bucleOcr],
  ]);
  qa(".pnl-t").forEach((t, i) => {
    t.style.setProperty("--d", (i % 3) * 90 + "ms");
    alVer(t, () => { t.classList.add("pnl-dentro"); const f = arranque.get(t); if (f) f(); }, { umbral: 0.2 });
  });
})();
