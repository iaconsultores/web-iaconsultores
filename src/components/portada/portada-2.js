(() => {
  /* Provincias 2 · bandas de Albacete, Madrid y España. Mismo motor que las bandas de frag-hero.html:
     medallas-botón ① Datos ② IA ③ Proceso ④ Resultado alineadas con .contenedor, salto al pulsar,
     leyenda al pasar, pausa de la portada y estado final visible si IAC.reducido. */
  const IAC = window.IAC || {};
  const reducido = !!IAC.reducido;
  const NS = "http://www.w3.org/2000/svg";
  const portada = document.getElementById("portada");
  const f1 = (n) => String(Math.round(n * 10) / 10);
  const PASOS = [
    ["Datos", "Entra un email, un formulario o una factura."],
    ["IA", "La IA lo lee, lo entiende y lo clasifica."],
    ["Proceso", "Se registra solo en tu CRM o en tu ERP."],
    ["Resultado", "Respuesta al cliente y aviso a tu equipo."]
  ];
  const SEG = [[0, 0, 900], [0, 1, 1700], [1, 1, 1100], [1, 2, 1700], [2, 2, 1100], [2, 3, 1700], [3, 3, 2400]];
  const OFF = []; SEG.reduce((a, s) => (OFF.push(a), a + s[2]), 0);
  const TOT = OFF[OFF.length - 1] + SEG[SEG.length - 1][2];
  const suave = (u) => (u < 0.5 ? 2 * u * u : 1 - (2 - 2 * u) ** 2 / 2);
  const nodo = (tag, at, padre) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; };

  /* Zona visible del viewBox 1440×220 (slice) y paradas alineadas con .contenedor (igual que la portada) */
  function geometria(el) {
    const W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) return null;
    const s = Math.max(W / 1440, H / 220), visW = W / s, visH = H / s;
    const vx0 = (1440 - visW) / 2, vy0 = (220 - visH) / 2, mob = W < 761, compacta = W < 1181;
    const cont = Math.min(W, 1240) - 2 * (mob ? 16 : 32), cl = (W - cont) / 2;
    const nx = (mob ? [.1, .3667, .6333, .9] : [.12, .37, .62, .87]).map((f) => vx0 + (cl + cont * f) / s);
    return { W, H, s, visW, visH, vx0, vy0, mob, compacta, nx, mid: vy0 + visH * (compacta ? .4 : .45) };
  }
  /* Recorrido: polilínea con longitudes acumuladas */
  function ruta(pts) {
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = L[L.length - 1];
    return { pts, L, total,
      en(d) {
        d = Math.max(0, Math.min(total, d));
        let lo = 1, hi = L.length - 1;
        while (lo < hi) { const m = (lo + hi) >> 1; if (L[m] < d) lo = m + 1; else hi = m; }
        const a = pts[lo - 1], b = pts[lo], u = (d - L[lo - 1]) / ((L[lo] - L[lo - 1]) || 1);
        return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[1] - a[1], b[0] - a[0])];
      },
      d() { return "M" + pts.map((p) => f1(p[0]) + " " + f1(p[1])).join("L"); },
      enX(x, desde = 0) { for (let i = 1; i < pts.length; i++) if (L[i] >= desde && pts[i][0] >= x && pts[i - 1][0] < x) return L[i - 1] + (L[i] - L[i - 1]) * (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); return 0; }
    };
  }
  const arco = (cx, cy, r, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; };
  const curva = (p0, p1, p2, p3, n = 24) => { const p = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; p.push([0, 1].map((j) => u * u * u * p0[j] + 3 * u * u * t * p1[j] + 3 * u * t * t * p2[j] + t * t * t * p3[j])); } return p; };
  const rombo = (capa, z, fill, extra = {}) => nodo("rect", Object.assign({ x: -z / 2, y: -z / 2, width: z, height: z, fill }, extra), capa);

  /* ---------------- Albacete · la Sartén: tres anillos, el templete y su mango ---------------- */
  function albacete(G, capa) {
    const { nx, mid: cy, vx0, vy0, visW, visH } = G, x1 = vx0 + visW;
    const r3 = Math.max(30, Math.min(96, cy - vy0 - 6, vy0 + visH - cy - 6, nx[0] - vx0 - 3, (nx[1] - nx[0]) * 0.6));
    const cx = nx[0], hw = r3 * 0.33, t3 = r3 * 0.2, r2 = r3 * 0.66, t2 = r3 * 0.15, r1 = r3 * 0.38, t1 = r3 * 0.1;
    const g1 = (r3 - t3 + r2 + t2 / 2) / 2, g2 = (r2 - t2 / 2 + r1 + t1 / 2) / 2, xg = cx + r3 * 0.9;
    // Mango: dos hileras de casetas (bloques rojo/tinta, como el mosaico) y el paseo central
    let rojo = "", tinta = "", cas = "";
    for (let x = xg, i = 0; x < x1 + 40; x += 39, i++) {
      for (const [y0, sgn] of [[cy - hw, 1], [cy + hw * 0.52, -1]]) {
        const b = `M${f1(x + 1.5)} ${f1(y0)}h36v${f1(hw * 0.48)}h-36Z`;
        if ((i + (sgn > 0 ? 0 : 1)) % 3 === 2) tinta += b; else rojo += b;
      }
      for (const dx of [13.5, 26]) cas += `M${f1(x + dx)} ${f1(cy - hw)}v${f1(hw * 0.48)}M${f1(x + dx)} ${f1(cy + hw)}v${f1(-hw * 0.48)}`;
    }
    nodo("rect", { x: f1(xg), y: f1(cy - hw), width: f1(x1 + 40 - xg), height: f1(hw * 2), fill: "#FAF6EE" }, capa);
    nodo("path", { d: rojo, fill: "#A3312A" }, capa); nodo("path", { d: tinta, fill: "#1B1F2A" }, capa);
    nodo("path", { d: cas, stroke: "#FAF6EE", "stroke-opacity": ".5", "stroke-width": "1.2" }, capa);
    nodo("path", { d: `M${f1(xg)} ${f1(cy - hw)}H${f1(x1 + 40)}M${f1(xg)} ${f1(cy + hw)}H${f1(x1 + 40)}`, stroke: "#1B1F2A", "stroke-width": "1.4" }, capa);
    nodo("path", { class: "h2-carril", d: `M${f1(xg)} ${f1(cy)}H${f1(x1 + 40)}` }, capa);
    nodo("circle", { cx: f1(cx), cy: f1(cy), r: f1(r3), fill: "#FAF6EE" }, capa);
    const anillo = (r, t, color, paso) => {
      nodo("circle", { cx: f1(cx), cy: f1(cy), r: f1(r - t / 2), fill: "none", stroke: color, "stroke-width": f1(t) }, capa);
      let d = ""; for (let a = 0; a < 360; a += paso) { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); d += `M${f1(cx + (r - t * 0.85) * c)} ${f1(cy + (r - t * 0.85) * s)}L${f1(cx + (r - t * 0.15) * c)} ${f1(cy + (r - t * 0.15) * s)}`; }
      nodo("path", { d, stroke: "#FAF6EE", "stroke-opacity": ".6", "stroke-width": "1.2" }, capa);
    };
    anillo(r3, t3, "#A3312A", 6); anillo(r2 + t2 / 2, t2, "#1B1F2A", 7.5); anillo(r1 + t1 / 2, t1, "#A3312A", 12);
    nodo("circle", { cx: f1(cx), cy: f1(cy), r: f1(r3), fill: "none", stroke: "#1B1F2A", "stroke-width": "1.4" }, capa);
    // Puerta de Hierros (arcos mudéjares) donde el mango entra en el círculo
    const gw = hw * 1.15, gh = hw * 1.3, gx = xg - gw * 0.15;
    let arcos = ""; for (let i = 0; i < 3; i++) { const ax = gx + gw * (0.2 + i * 0.3), aw = gw * 0.18; arcos += `M${f1(ax - aw / 2)} ${f1(cy + gh * 0.55)}V${f1(cy - gh * 0.15)}a${f1(aw / 2)} ${f1(aw / 2)} 0 0 1 ${f1(aw)} 0V${f1(cy + gh * 0.55)}Z`; }
    nodo("rect", { x: f1(gx), y: f1(cy - gh), width: f1(gw), height: f1(gh * 2), fill: "#1B1F2A", rx: "1.5" }, capa);
    nodo("path", { d: arcos, fill: "#FAF6EE", "fill-opacity": ".9" }, capa);
    // Recorrido: del templete gira por los paseos de los anillos y sale por la puerta hacia el mango
    const pts = [[cx, cy]].concat(arco(cx, cy, g2, Math.PI, Math.PI * 2.5, 54), arco(cx, cy, g1, Math.PI * 2.5, Math.PI * 4, 60));
    pts.push([nx[1], cy], [nx[2], cy], [nx[3], cy], [x1 + 60, cy]);
    const rt = ruta(pts), largo = rt.L[rt.L.length - 5];
    const Ls = [0].concat(nx.slice(1).map((x) => largo + (x - pts[pts.length - 5][0])));
    const amb = [[g1, 0, 1], [g1, 2.1, 1], [g1, 4.2, 1], [g2, 1, -1], [g2, 4, -1]].map(([r, a, s]) => ({ n: rombo(capa, 7, "#FAF6EE", { class: "h2-amb" }), r, a, s }));
    return {
      rt, Ls,
      paquete: (g) => rombo(g, 14, "#FAF6EE", { class: "h2-pk", rx: 2 }),
      estela: (g) => [[8, .55], [6, .38], [4, .22]].map(([z, o]) => rombo(g, z, "#A3312A", { opacity: o })),
      giro: 45,
      ambiente: (t) => amb.forEach((o) => { const a = o.a + o.s * t * 0.28; o.n.setAttribute("transform", `translate(${f1(cx + o.r * Math.cos(a))} ${f1(cy + o.r * Math.sin(a))}) rotate(45)`); })
    };
  }

  /* ---------------- Madrid · el Km 0 y las líneas de metro de colores ---------------- */
  function madrid(G, capa) {
    const { nx, mid: cy, vx0, visW, mob } = G, a0 = vx0 - 40, a1 = vx0 + visW + 40, km = nx[0];
    const d1 = mob ? 22 : 34, d2 = mob ? 44 : 64, grosor = mob ? 5.5 : 8;
    // Cada línea sale del Km 0 (①) a 45°, corre por su carril y cruza la roja en un medallón (correspondencia)
    const linea = (c0, cruces) => {
      const p = [[a0, cy + c0], [km - Math.abs(c0), cy + c0], [km, cy], [km + Math.abs(c0), cy + c0]];
      let c = c0;
      cruces.forEach(([i, nuevo]) => { p.push([nx[i] - Math.abs(c), cy + c], [nx[i], cy], [nx[i] + Math.abs(nuevo), cy + nuevo]); c = nuevo; });
      p.push([a1, cy + c]);
      return ruta(p);
    };
    const lineas = [
      { color: "#1A6AA6", rt: linea(-d2, [[1, d2], [3, -d2]]) },
      { color: "#5FA4D3", rt: linea(d2, [[1, -d2], [3, d2]]) },
      { color: "#3F8B5E", rt: linea(-d1, [[2, d1]]) },
      { color: "#E0A82E", rt: linea(d1, [[2, -d1]]) },
    ];
    lineas.forEach((l) => nodo("path", { d: l.rt.d(), fill: "none", stroke: l.color, "stroke-width": f1(grosor), "stroke-linejoin": "round" }, capa));
    const roja = ruta([[a0, cy], [a1, cy]]);
    nodo("path", { d: roja.d(), stroke: "#A3312A", "stroke-width": f1(grosor) }, capa);
    lineas.concat([{ color: "#A3312A", rt: roja }]).forEach((l) => {
      let d = ""; const p = l.rt.pts;
      for (let i = 1; i < p.length; i++) {
        if (Math.abs(p[i][1] - p[i - 1][1]) > 0.5) continue;
        for (let x = Math.ceil(p[i - 1][0] / 90) * 90 + 45; x < p[i][0]; x += 90) {
          if (nx.some((m) => Math.abs(m - x) < (mob ? 30 : 46))) continue;
          d += `M${f1(x)} ${f1(p[i][1] - grosor * 0.5)}v${f1(-grosor * 0.8)}`;
        }
      }
      if (d) nodo("path", { d, stroke: l.color, "stroke-width": f1(grosor * 0.55) }, capa);
    });
    // Placa del Kilómetro Cero bajo el medallón ①: rayos de las carreteras radiales y rótulo
    const r0 = mob ? 30 : 44;
    nodo("circle", { cx: f1(km), cy: f1(cy), r: f1(r0), fill: "#F3EBDD", stroke: "#1B1F2A", "stroke-width": "1.4" }, capa);
    let rad = ""; for (let a = 0; a < 360; a += 22.5) { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); rad += `M${f1(km + r0 * .7 * c)} ${f1(cy + r0 * .7 * s)}L${f1(km + r0 * .92 * c)} ${f1(cy + r0 * .92 * s)}`; }
    nodo("path", { d: rad, stroke: "#1B1F2A", "stroke-opacity": ".55", "stroke-width": "1.3", "stroke-linecap": "round" }, capa);
    const etq = nodo("g", { transform: `translate(${f1(km)} ${f1(cy - r0 - (mob ? 9 : 12))})` }, capa);
    const tx = nodo("text", { class: "h2-km", y: mob ? 3.5 : 4.5 }, etq); tx.textContent = "Km 0";
    // Trenes de tres coches con ventanillas de datos
    const trenes = lineas.map((l, i) => {
      const coches = [0, 1, 2].map((c) => {
        const cg = nodo("g", {}, capa);
        nodo("rect", { x: -7, y: -3.6, width: 14, height: 7.2, rx: 3.2, fill: "#1B1F2A" }, cg);
        nodo("rect", { x: -4, y: -1.3, width: 2.6, height: 2.6, fill: "#FAF6EE" }, cg);
        nodo("rect", { x: 1.4, y: -1.3, width: 2.6, height: 2.6, fill: c === 0 ? "#FFE27A" : "#FAF6EE" }, cg);
        return cg;
      });
      return { l, coches, fase: i * 0.27 + (i % 2) * 0.11 };
    });
    return {
      rt: roja, Ls: nx.map((x) => x - a0),
      paquete: (g) => rombo(g, 14, "#FAF6EE", { class: "h2-pk", rx: 2 }),
      estela: (g) => [[8, .7], [6, .5], [4, .3]].map(([z, o]) => rombo(g, z, "#1B1F2A", { opacity: o })),
      giro: 45,
      ambiente: (t) => trenes.forEach((tr) => {
        const L = tr.l.rt.total, d = ((t * 55 + tr.fase * L) % (L + 60)) - 20;
        tr.coches.forEach((c, j) => { const dd = d - j * 16, [x, y, a] = tr.l.rt.en(dd); c.setAttribute("transform", `translate(${f1(x)} ${f1(y)}) rotate(${f1(a * 180 / Math.PI)})`); });
      })
    };
  }

  /* ---------------- España · red de alta velocidad ---------------- */
  function trenAve(capa, datos) {
    const g = nodo("g", {}, capa);
    nodo("path", { d: "M-38 -2.6Q-38 -4.6 -36 -4.6H22Q33 -4.6 40 0Q33 4.6 22 4.6H-36Q-38 4.6 -38 2.6Z", fill: "#FFFDF8", stroke: "#1B1F2A", "stroke-width": "1.1" }, g);
    nodo("rect", { x: -36, y: 1.3, width: 60, height: 1.6, fill: "#A3312A" }, g);
    nodo("path", { d: "M-33 -2.7H20", stroke: "#1B1F2A", "stroke-width": "2.1" }, g);
    let dd = ""; for (let x = -31; x < 18; x += 5) dd += `M${x} -2.7h2.2`;
    nodo("path", { d: dd, stroke: datos, "stroke-width": "1.5" }, g);
    nodo("path", { d: "M27 -3.9Q33 -3.4 36 -1.2H29Z", fill: "#1B1F2A" }, g);
    return g;
  }
  function espana(G, capa) {
    const { nx, mid: cy, vx0, visW, mob } = G, a0 = vx0 - 60, a1 = vx0 + visW + 60;
    const yu = cy - (mob ? 50 : 62), yd = cy + (mob ? 54 : 70), D = mob ? 56 : 120;
    const via = (p, ancho) => {
      const d = ruta(p).d();
      nodo("path", { d, fill: "none", stroke: "#1B1F2A", "stroke-opacity": ".35", "stroke-width": f1(ancho + 3), "stroke-dasharray": "1.1 5" }, capa);
      nodo("path", { d, fill: "none", stroke: "#1B1F2A", "stroke-width": f1(ancho), "stroke-linejoin": "round" }, capa);
      nodo("path", { d, fill: "none", stroke: "#FAF6EE", "stroke-width": f1(ancho - 2.6), "stroke-linejoin": "round" }, capa);
    };
    const enlaces = [
      curva([nx[0], cy], [nx[0] + D * 0.5, cy], [nx[0] + D * 0.5, yu], [nx[0] + D, yu]),
      curva([nx[1], cy], [nx[1] + D * 0.5, cy], [nx[1] + D * 0.5, yd], [nx[1] + D, yd]),
      curva([nx[2] - D, yu], [nx[2] - D * 0.5, yu], [nx[2] - D * 0.5, cy], [nx[2], cy]),
      curva([nx[3] - D, yd], [nx[3] - D * 0.5, yd], [nx[3] - D * 0.5, cy], [nx[3], cy]),
    ];
    via([[a0, yu], [a1, yu]], 5); via([[a0, yd], [a1, yd]], 5);
    enlaces.forEach((p) => via(p, 5));
    via([[a0, cy], [a1, cy]], 7.6);
    const nodos = [[nx[0] + D, yu, 1], [nx[1] + D, yd, 1], [nx[2] - D, yu, 1], [nx[3] - D, yd, 1]];
    for (let x = nx[0] - (mob ? 70 : 150); x < a1; x += mob ? 120 : 250) nodos.push([x, yu, 0], [x + (mob ? 60 : 125), yd, 0]);
    nodos.forEach(([x, y, grande]) => {
      if (x < vx0 + 8 || x > vx0 + visW - 8) return;
      if (!grande && nodos.some(([X, Y, gg]) => gg && Y === y && Math.abs(X - x) < 40)) return;
      nodo("circle", { cx: f1(x), cy: f1(y), r: grande ? 6 : 4.5, fill: "#FAF6EE", stroke: "#1B1F2A", "stroke-width": "1.6" }, capa);
      if (grande) nodo("circle", { cx: f1(x), cy: f1(y), r: 2.2, fill: "#A3312A" }, capa);
    });
    const esc = mob ? 0.85 : 1.2;
    const amb = [
      { y: yu, v: -70, fase: 0.3, g: trenAve(capa, "#FFE27A") },
      { y: yd, v: 60, fase: 0.65, g: trenAve(capa, "#FAF6EE") },
    ];
    const L = a1 - a0;
    return {
      rt: ruta([[a0, cy], [a1, cy]]), Ls: nx.map((x) => x - a0),
      paquete: (g) => { const t = trenAve(g, "#FFE27A"); t.setAttribute("transform", `scale(${esc})`); return t; },
      estela: (g) => [0.5, 0.32, 0.18].map((o, i) => nodo("path", { d: `M-${8 + i * 6} -3h${6 - i * 1.5}M-${10 + i * 6} 1.5h${5 - i}`, stroke: "#1B1F2A", "stroke-width": "1.2", "stroke-linecap": "round", opacity: o }, g)),
      giro: 0, cola: 46 * esc,
      ambiente: (t) => amb.forEach((o) => {
        const d = (((t * Math.abs(o.v) + o.fase * L) % L) + L) % L, x = o.v < 0 ? a1 - d : a0 + d;
        o.g.setAttribute("transform", `translate(${f1(x)} ${f1(o.y)}) scale(${o.v < 0 ? -esc : esc} ${esc})`);
      })
    };
  }

  /* ---------------- Motor de una banda (como crearMotor de la portada) ---------------- */
  function crearMotor(el, pintor) {
    const svg = el.querySelector("svg"), capa = svg.querySelector(".h2-din");
    const lista = document.createElement("ol");
    lista.className = "paradas";
    lista.setAttribute("aria-label", "Cómo viaja un dato en una automatización");
    lista.innerHTML = PASOS.map(([n, t], i) => `<li class="parada"><button type="button" class="medalla" aria-label="Paso ${i + 1}, ${n}: ${t}"><span aria-hidden="true">${i + 1}</span></button><span class="m-nombre" aria-hidden="true">${n}</span></li>`).join("");
    const leyenda = document.createElement("p");
    leyenda.className = "paso-texto";
    leyenda.setAttribute("aria-hidden", "true");
    el.append(lista, leyenda);
    const lis = Array.from(lista.children);
    let G = null, R = null, gPk = null, gEst = null, est = [], hist = [], etapa = -1, reloj = 0, ultimo = 0, salto = null, lastI = 0, Lact = 0, foco = -1, tLey = 0;

    function colocar(L, alfa = 1) {
      Lact = L;
      const [x, y] = R.rt.en(L), giro = R.giro ? ` rotate(${R.giro})` : "";
      gPk.setAttribute("transform", `translate(${f1(x)} ${f1(y)})${giro}`);
      hist.unshift([x, y]); if (hist.length > 30) hist.length = 30;
      if (R.cola) {
        const mueve = hist.length > 4 && Math.abs(hist[0][0] - hist[4][0]) > 1;
        gEst.setAttribute("transform", `translate(${f1(x - R.cola)} ${f1(y)})`);
        gEst.style.opacity = mueve ? alfa : 0;
      } else {
        est.forEach((n, k) => { const p = hist[Math.min(hist.length - 1, (k + 1) * 7)]; n.setAttribute("transform", `translate(${f1(p[0])} ${f1(p[1])})${giro}`); });
        gEst.style.opacity = alfa;
      }
      gPk.style.opacity = alfa;
    }
    function colocarLeyenda(k) {
      if (!G || G.compacta) { leyenda.removeAttribute("style"); return; }
      const li = lis[k], px = parseFloat(li.style.left), py = parseFloat(li.style.top), r = 27;
      const ancho = leyenda.offsetWidth, alto = leyenda.offsetHeight;
      // Recorridos rectos: la tarjeta ocupa el sitio del nombre de la medalla (repite el nombre y lo amplía)
      const x = Math.max(12, Math.min(G.W - ancho - 12, k < 2 ? px - r - 16 : px + r + 16 - ancho));
      leyenda.style.left = f1(x) + "px";
      leyenda.style.top = f1(Math.min(py + r + 5, G.H - alto - 6)) + "px";
    }
    function leyendaA(k) {
      clearTimeout(tLey);
      leyenda.classList.remove("ver");
      tLey = setTimeout(() => {
        const [n, t] = PASOS[k];
        leyenda.innerHTML = `<b>${k + 1} · ${n}</b>${t}`;
        colocarLeyenda(k);
        leyenda.classList.add("ver");
      }, reducido ? 0 : 170);
    }
    function setEtapa(k, forzar) {
      if (k === etapa && !forzar) return;
      etapa = k;
      lis.forEach((li, i) => { li.classList.toggle("activo", i === k); li.classList.toggle("hecho", i < k); });
      if (foco < 0) leyendaA(k);
    }
    function enReloj() {
      let t = reloj, i = 0;
      while (i < SEG.length - 1 && t > SEG[i][2]) { t -= SEG[i][2]; i++; }
      const [a, b, d] = SEG[i];
      return { i, a, t, d, L: R.Ls[a] + (R.Ls[b] - R.Ls[a]) * suave(Math.min(1, t / d)) };
    }
    function construir() {
      G = geometria(el);
      if (!G) return false;
      capa.textContent = "";
      R = pintor(G, capa);
      gEst = nodo("g", {}, capa); gPk = nodo("g", {}, capa);
      est = R.estela(gEst);
      R.paquete(gPk);
      lis.forEach((li, i) => { const [X, Y] = R.rt.en(R.Ls[i]); li.style.left = f1((X - G.vx0) * G.s) + "px"; li.style.top = f1((Y - G.vy0) * G.s) + "px"; });
      hist = []; salto = null;
      R.ambiente(performance.now() / 1000);
      if (reducido) { colocar(R.Ls[3]); gEst.style.opacity = 0; setEtapa(3, true); }
      else { const e = enReloj(); colocar(e.L); setEtapa(e.a, true); }
      return true;
    }
    function preparar() { if (!G || el.clientWidth !== G.W || el.clientHeight !== G.H) construir(); }
    function paso(now) {
      if ((!G || el.clientWidth !== G.W || el.clientHeight !== G.H) && !construir()) return;
      const dt = ultimo ? Math.min(80, now - ultimo) : 16;
      ultimo = now;
      let L, alfa = 1;
      if (salto) {
        const u = Math.min(1, (now - salto.t0) / salto.dur);
        L = salto.desde + (salto.hasta - salto.desde) * suave(u);
        if (u >= 1) { reloj = OFF[2 * salto.k]; lastI = 2 * salto.k; salto = null; }
      } else {
        reloj = (reloj + dt) % TOT;
        const e = enReloj();
        if (e.i < lastI) hist = [];
        lastI = e.i; L = e.L;
        setEtapa(e.a);
        if (e.i === SEG.length - 1) alfa = Math.max(0, Math.min(1, (e.d - e.t) / 380));
        else if (e.i === 0) alfa = Math.min(1, e.t / 380);
      }
      colocar(L, alfa);
      R.ambiente(now / 1000);
    }
    function ir(k) {
      if (!G) return;
      if (reducido || !animando()) { hist = []; colocar(R.Ls[k]); reloj = OFF[2 * k]; lastI = 2 * k; setEtapa(k, true); return; }
      salto = { desde: Lact, hasta: R.Ls[k], t0: performance.now(), dur: 520 + Math.min(900, Math.abs(R.Ls[k] - Lact) * .9), k };
      setEtapa(k, true);
    }
    lis.forEach((li, i) => {
      const b = li.querySelector("button");
      b.addEventListener("click", () => ir(i));
      const ver = () => { foco = i; leyendaA(i); }, dejar = () => { foco = -1; leyendaA(etapa); };
      b.addEventListener("mouseenter", ver); b.addEventListener("focus", ver);
      b.addEventListener("mouseleave", dejar); b.addEventListener("blur", dejar);
    });
    return { el, paso, preparar, reanudar: () => { ultimo = 0; } };
  }

  /* ---------------- Arranque, visibilidad y pausa ---------------- */
  const PINTORES = { albacete, madrid, espana };
  const motores = [];
  Object.keys(PINTORES).forEach((p) => {
    const el = document.querySelector(`#portada .banda[data-prov="${p}"]`) || document.querySelector(`.banda[data-prov="${p}"]`);
    if (el && el.querySelector("svg .h2-din")) motores.push(crearMotor(el, PINTORES[p]));
  });
  if (!motores.length) return;
  const vivos = new Set();
  let raf = 0;
  const pausado = () => !!portada && (portada.classList.contains("en-pausa") || portada.classList.contains("fuera"));
  function animando() { return raf !== 0; }
  function bucle(now) {
    if (pausado() || !vivos.size) { raf = 0; return; }
    vivos.forEach((m) => m.paso(now));
    raf = requestAnimationFrame(bucle);
  }
  function arrancar() { if (reducido || raf || pausado() || !vivos.size) return; vivos.forEach((m) => m.reanudar()); raf = requestAnimationFrame(bucle); }
  /* Se maqueta en cuanto la banda se muestra; solo se anima mientras está a la vista */
  function revisar() {
    motores.forEach((m) => {
      if (m.el.clientWidth) m.preparar();
      if (m.vista && m.el.clientWidth) vivos.add(m); else vivos.delete(m);
    });
    arrancar();
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entradas) => entradas.forEach((en) => {
      const m = motores.find((x) => x.el === en.target); if (!m) return;
      m.vista = en.isIntersecting; if (!m.vista) vivos.delete(m);
      revisar();
    }), { threshold: 0.01 });
    motores.forEach((m) => io.observe(m.el));
  } else motores.forEach((m) => { m.vista = true; });
  if ("ResizeObserver" in window) { const ro = new ResizeObserver(revisar); motores.forEach((m) => ro.observe(m.el)); }
  if (portada) {
    portada.addEventListener("portada:pausa", () => { if (!pausado()) arrancar(); });
    new MutationObserver(() => { if (!pausado()) arrancar(); }).observe(portada, { attributes: true, attributeFilter: ["class"] });
  }
  if (IAC.onCambio) IAC.onCambio("provincia", () => requestAnimationFrame(revisar));
  motores.forEach((m) => m.preparar());
  revisar();
})();
