(() => {
  const IAC = window.IAC;
  const portada = document.getElementById("portada");
  if (!IAC || !portada) return;
  const $ = (s, r = portada) => r.querySelector(s);
  const todos = (s, r = portada) => Array.from(r.querySelectorAll(s));
  const f1 = (n) => String(Math.round(n * 10) / 10);
  const reducido = !!IAC.reducido;

  /* ---------- Datos de las seis provincias (columna derecha) ---------- */
  const DATOS = {
    alicante: { c: "38.34°N 0.48°W", lugar: "Castillo de Santa Bárbara, Alicante", cur: ["La Explanada está hecha con más de 6 millones de teselas de mármol."] },
    valencia: { c: "39.47°N 0.38°W", lugar: "L’Hemisfèric y los naranjos, Valencia", cur: ["El Jardín del Turia ocupa el antiguo cauce del río: unos 9 km de parque."] },
    murcia: { c: "37.98°N 1.13°W", lugar: "Torre de la Catedral y la huerta, Murcia", cur: ["La torre de la Catedral supera los 90 metros y se construyó durante más de 250 años."] },
    albacete: { c: "38.99°N 1.86°W", lugar: "Pasaje de Lodares y la llanura manchega", cur: ["El recinto ferial tiene forma de sartén: un círculo con su mango."] },
    madrid: { c: "40.42°N 3.70°W", lugar: "Edificio Metrópolis y Cuatro Torres, Madrid", cur: ["En la Puerta del Sol está el Kilómetro Cero, origen de las carreteras radiales."] },
    espana: { c: "40.42°N 3.70°W", nota: "(centro)", lugar: "Una calle cualquiera, al atardecer", cur: ["En España el sol se pone tarde: vamos con la hora de Europa central.", "Tenemos la red de alta velocidad más extensa de Europa."] }
  };
  const datosDe = (p) => DATOS[p] || DATOS.alicante;
  /* Proyección del minimapa (la misma con la que se dibujó su contorno) */
  const enMapa = (c) => {
    const [, la, lo] = c.match(/([\d.]+)°N ([\d.]+)°W/).map(Number);
    return [(-lo + 9.45) * Math.cos(40 * Math.PI / 180) * 14, (43.92 - la) * 14];
  };

  const elC = $(".coords-num"), elNota = $(".coords-nota"), elLugar = $(".lugar"), elDato = $(".dato");
  const elEtq = $(".dato-etq"), elCur = $(".dato-texto"), rosa = $(".rosa"), punto = $(".mapa-punto");
  let vueltas = 0, tGeo = 0;

  /* Las cifras de las coordenadas «ruedan» hasta su valor nuevo */
  function rodar(el, destino) {
    const ini = performance.now(), dur = 560;
    const paso = (now) => {
      const u = (now - ini) / dur;
      if (u >= 1) { el.textContent = destino; return; }
      el.textContent = destino.replace(/\d/g, (d, i) => (i / destino.length < u ? d : String((Math.random() * 10) | 0)));
      requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }
  function escribirGeo(d) {
    elLugar.textContent = d.lugar;
    elEtq.textContent = d.cur.length > 1 ? "Curiosidades" : "Curiosidad";
    elCur.replaceChildren(...d.cur.map((t) => { const p = document.createElement("p"); p.textContent = t; return p; }));
  }
  function pintarGeo(p, animar) {
    const d = datosDe(p);
    elNota.textContent = d.nota || "";
    const [mx, my] = enMapa(d.c);
    punto.style.transform = `translate(${f1(mx)}px,${f1(my)}px)`;
    if (!animar || reducido) { elC.textContent = d.c; escribirGeo(d); return; }
    rodar(elC, d.c);
    vueltas += 1;
    rosa.style.transform = `rotate(${vueltas * 360}deg)`;
    elDato.classList.add("cambiando"); elLugar.classList.add("cambiando");
    clearTimeout(tGeo);
    tGeo = setTimeout(() => { escribirGeo(d); elDato.classList.remove("cambiando"); elLugar.classList.remove("cambiando"); }, 230);
  }

  /* ---------- Sombras: palmera (07) y rama de naranjo ---------- */
  function hoja(len) {
    const cx = len * .5, cy = -len * .12, ex = len, ey = len * .24, n = 24;
    let d = "";
    for (let i = 2; i < n; i++) {
      const t = i / n, m = 1 - t;
      const x = 2 * m * t * cx + t * t * ex, y = 2 * m * t * cy + t * t * ey;
      const a = Math.atan2(2 * m * cy + 2 * t * (ey - cy), 2 * m * cx + 2 * t * (ex - cx));
      const L = len * .4 * Math.sin(Math.PI * Math.min(1, .2 + t * .95)), w = 3.2 * (1 - t * .6);
      for (const s of [-1, 1]) {
        const b = a + s * (1.05 - .45 * t);
        const qx = x + Math.cos(b) * L * .55, qy = y + Math.sin(b) * L * .55 + L * .1;
        const tx = x + Math.cos(b) * L, ty = y + Math.sin(b) * L + L * .32;
        const px = -Math.sin(b) * w, py = Math.cos(b) * w;
        d += `M${f1(x + px)} ${f1(y + py)}Q${f1(qx + px)} ${f1(qy + py)} ${f1(tx)} ${f1(ty)}Q${f1(qx - px)} ${f1(qy - py)} ${f1(x - px)} ${f1(y - py)}Z`;
      }
    }
    return `<path d="${d}"/><path d="M0 0Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`;
  }
  todos(".sombra-palmera").forEach((svg) => {
    svg.innerHTML = JSON.parse(svg.dataset.hojas).map(([x, y, r, len, flip]) =>
      `<g class="sw" style="transform-origin:${x}px ${y}px"><g transform="translate(${x} ${y}) scale(${flip} 1) rotate(${r})">${hoja(len)}</g></g>`).join("");
  });
  function ramaNaranjo(P0, P1, P2, hojas, naranjas) {
    const pt = (t) => { const m = 1 - t; return [m * m * P0[0] + 2 * m * t * P1[0] + t * t * P2[0], m * m * P0[1] + 2 * m * t * P1[1] + t * t * P2[1]]; };
    const ang = (t) => { const m = 1 - t; return Math.atan2(2 * m * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]), 2 * m * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0])); };
    let h = `<path d="M${P0}Q${P1} ${P2}" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>`;
    for (let i = 1; i <= hojas; i++) {
      const t = i / (hojas + 1), [x, y] = pt(t), L = 50 - t * 16;
      for (const s of [-1, 1]) {
        const b = ang(t) + s * (0.9 - t * .25) + (i % 2 ? .12 : -.08);
        const cx = x + Math.cos(b) * L * .55, cy = y + Math.sin(b) * L * .55;
        h += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(L * .56)}" ry="${f1(L * .2)}" transform="rotate(${f1(b * 180 / Math.PI)} ${f1(cx)} ${f1(cy)})"/>`;
      }
    }
    naranjas.forEach(([t, caida, r]) => {
      const [x, y] = pt(t);
      h += `<path d="M${f1(x)} ${f1(y)}V${f1(y + caida - r)}" stroke="currentColor" stroke-width="3"/><circle cx="${f1(x)}" cy="${f1(y + caida)}" r="${r}"/>`;
    });
    return `<g class="sw" style="transform-origin:${P0[0]}px ${P0[1]}px">${h}</g>`;
  }
  todos(".sombra-naranjo").forEach((svg) => {
    svg.innerHTML = ramaNaranjo([800, -20], [610, 130], [330, 190], 15, [[.34, 46, 21], [.58, 40, 19], [.8, 44, 20]])
      + ramaNaranjo([800, 220], [660, 250], [480, 380], 9, [[.55, 36, 17]]);
  });

  /* ---------- Bandas interactivas: un dato viaja por ① Datos ② IA ③ Proceso ④ Resultado ---------- */
  const PASOS = [
    ["Datos", "Entra un email, un formulario o una factura."],
    ["IA", "La IA lo lee, lo entiende y lo clasifica."],
    ["Proceso", "Se registra solo en tu CRM o en tu ERP."],
    ["Resultado", "Respuesta al cliente y aviso a tu equipo."]
  ];
  const SEG = [[0, 0, 900], [0, 1, 1700], [1, 1, 1100], [1, 2, 1700], [2, 2, 1100], [2, 3, 1700], [3, 3, 2400]];
  const OFF = []; SEG.reduce((a, s) => (OFF.push(a), a + s[2]), 0);
  const TOT = OFF[OFF.length - 1] + SEG[SEG.length - 1][2];
  const suave = (u) => (u < .5 ? 2 * u * u : 1 - (2 - 2 * u) ** 2 / 2);
  const rango = (a, b, p) => { const r = []; for (let x = a; x < b; x += p) r.push(x); r.push(b); return r; };
  const semilla = (n) => { let s = n * 9973 + 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const fondo = (G, relleno) => `<rect x="${f1(G.vx0 - 2)}" y="${f1(G.vy0 - 2)}" width="${f1(G.visW + 4)}" height="${f1(G.visH + 4)}" fill="${relleno}"/>`;
  const trazo = (xs, fy, rev) => (rev ? xs.slice().reverse() : xs).map((x, i) => (i || rev ? "L" : "M") + f1(x) + " " + f1(fy(x))).join("");

  /* Zona visible del viewBox 1440×220 (preserveAspectRatio slice) y paradas alineadas con .contenedor */
  function geometria(el) {
    const W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) return null;
    const s = Math.max(W / 1440, H / 220), visW = W / s, visH = H / s;
    const vx0 = (1440 - visW) / 2, vy0 = (220 - visH) / 2, mob = W < 761, compacta = W < 1181;
    const cont = Math.min(W, 1240) - 2 * (mob ? 16 : 32), cl = (W - cont) / 2;
    const nx = (mob ? [.1, .3667, .6333, .9] : [.12, .37, .62, .87]).map((f) => vx0 + (cl + cont * f) / s);
    return { W, H, s, visW, visH, vx0, vy0, mob, compacta, nx, mid: vy0 + visH * (compacta ? .4 : .45) };
  }
  function moverAmbiente(lista, fy, G, rombo) {
    let els = [];
    return {
      init(svg) { els = Array.from(svg.querySelectorAll(".ambiente > *")); },
      tick(t) {
        const ancho = G.visW + 40;
        els.forEach((el, i) => {
          const o = lista[i];
          let d = (o.x0 + o.v * t) % ancho; if (d < 0) d += ancho;
          const x = G.vx0 - 20 + d;
          el.setAttribute("transform", `translate(${f1(x)} ${f1(fy(x, o))})${rombo ? " rotate(45)" : ""}`);
        });
      }
    };
  }
  /* Polilínea ortogonal con esquinas redondeadas: trazado SVG + puntos para el recorrido */
  function redondear(P, r) {
    const pts = [P[0]];
    let d = `M${f1(P[0][0])} ${f1(P[0][1])}`, prev = P[0];
    const recta = (a, b) => { const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5)); for (let i = 1; i <= n; i++) pts.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); };
    for (let i = 1; i < P.length - 1; i++) {
      const [px, py] = P[i - 1], [cx, cy] = P[i], [qx, qy] = P[i + 1];
      const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(qx - cx, qy - cy), rr = Math.min(r, l1 / 2, l2 / 2);
      const a = [cx - (cx - px) / l1 * rr, cy - (cy - py) / l1 * rr], b = [cx + (qx - cx) / l2 * rr, cy + (qy - cy) / l2 * rr];
      recta(prev, a);
      d += `L${f1(a[0])} ${f1(a[1])}Q${f1(cx)} ${f1(cy)} ${f1(b[0])} ${f1(b[1])}`;
      for (let k = 1; k <= 6; k++) { const t = k / 6, m = 1 - t; pts.push([m * m * a[0] + 2 * m * t * cx + t * t * b[0], m * m * a[1] + 2 * m * t * cy + t * t * b[1]]); }
      prev = b;
    }
    const fin = P[P.length - 1];
    recta(prev, fin);
    return { d: d + `L${f1(fin[0])} ${f1(fin[1])}`, pts };
  }

  /* Alicante · el mosaico de olas de la Explanada (portado de la 07) */
  function pintarMosaico(G) {
    const { nx, vx0, vy0, visW, visH, mid } = G;
    const lam = (nx[1] - nx[0]) * 2, A = visH * .1, th = visH / 15;
    const y = (x, j) => mid + j * th + A * Math.cos(2 * Math.PI * (x - nx[0]) / lam);
    const xs = rango(vx0 - 12, vx0 + visW + 12, 6);
    let h = `<defs><pattern id="ali-teselas" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M9 0H0V9" fill="none" stroke="#FAF6EE" stroke-opacity=".6"/></pattern></defs>` + fondo(G, "#FFFFFF");
    const j0 = Math.floor((vy0 - mid - A) / th) - 1, j1 = Math.ceil((vy0 + visH - mid + A) / th) + 1;
    for (let j = j0; j <= j1; j++) {
      const k = ((j % 4) + 4) % 4;
      if (k % 2) h += `<path d="${trazo(xs, (x) => y(x, j - .5))}${trazo(xs, (x) => y(x, j + .5), true)}Z" fill="${k === 1 ? "#A3312A" : "#1B1F2A"}"/>`;
    }
    h += fondo(G, "url(#ali-teselas)") + `<path class="carril" d="${trazo(xs, (x) => y(x, 0))}"/>`;
    const amb = [-6, -4, -2, 2, 4, 6, -2, 4].map((j, i) => ({ j, x0: ((i * .37) % 1) * visW, v: 16 + (i * 7) % 22 }));
    h += `<g class="ambiente">${amb.map(() => `<rect class="amb" x="-3.5" y="-3.5" width="7" height="7"/>`).join("")}</g>`;
    return {
      svg: h,
      carril: xs.map((x) => [x, y(x, 0)]),
      paquete: `<rect x="-7" y="-7" width="14" height="14" rx="2" transform="rotate(45)" fill="#FAF6EE" stroke="#A3312A" stroke-width="2.4"/>`,
      estela: [[8, .55], [6, .38], [4, .22]].map(([z, o]) => `<rect x="${-z / 2}" y="${-z / 2}" width="${z}" height="${z}" transform="rotate(45)" fill="#A3312A" opacity="${o}"/>`),
      ambiente: moverAmbiente(amb, (x, o) => y(x, o.j), G, true)
    };
  }

  /* Valencia · el Jardín del Turia, una cinta verde por el antiguo cauce, con sus puentes */
  function pintarTuria(G) {
    const { nx, vx0, visW, visH, mid } = G;
    const esp = nx[1] - nx[0], lam = esp * 2, A = Math.min(visH * .085, lam * .035), w = visH * .2;
    const fase = (x) => 2 * Math.PI * (x - nx[0]) / lam;
    const yc = (x) => mid + A * Math.cos(fase(x));
    const xs = rango(vx0 - 24, vx0 + visW + 24, 6);
    const borde = (off, rev) => trazo(xs, (x) => yc(x) + off, rev);
    const azar = semilla(3);
    let h = `<defs><pattern id="val-manzanas" width="46" height="46" patternUnits="userSpaceOnUse"><path d="M10 4h26l6 6v26l-6 6H10l-6-6V10z" fill="none" stroke="#D6C8B0"/></pattern></defs>`
      + fondo(G, "#FFFFFF") + fondo(G, "url(#val-manzanas)");
    h += `<path d="${borde(-w - 7)}${borde(w + 7, true)}Z" fill="#E9DFCC"/>`;
    h += `<path d="${borde(-w)}${borde(w, true)}Z" fill="#6F9B61"/>`;
    h += `<path d="${borde(-w * .46)}${borde(w * .46, true)}Z" fill="#87AF73"/>`;
    h += `<g fill="none" stroke="#F3EBDD" stroke-width="2.6" stroke-linecap="round"><path d="${borde(-w * .72)}"/><path d="${borde(w * .72)}"/></g>`;
    let arb = "";
    for (const lado of [-1, 1]) {
      for (let x = vx0 - 20; x < vx0 + visW + 20; x += 9 + azar() * 13) {
        const off = lado * w * (.85 + azar() * .1), r = 3.4 + azar() * 3.2;
        arb += `<circle cx="${f1(x)}" cy="${f1(yc(x) + off)}" r="${f1(r)}" fill="${azar() < .55 ? "#3E6B45" : "#52834F"}"/>`;
      }
    }
    for (let x = vx0 - 20; x < vx0 + visW + 20; x += 22 + azar() * 34) {
      const off = (azar() < .5 ? -1 : 1) * w * (.2 + azar() * .32);
      arb += `<circle cx="${f1(x)}" cy="${f1(yc(x) + off)}" r="${f1(3.6 + azar() * 2.6)}" fill="#5C8C55"/>`;
    }
    h += arb + `<path class="carril" d="${borde(0)}" stroke="#1B1F2A"/>`;
    const pend = (x) => -A * (2 * Math.PI / lam) * Math.sin(fase(x));
    for (let k = -3; k < 8; k++) {
      if (G.mob && k % 2) continue;
      const bx = nx[0] + esp * (k + .5);
      if (bx < vx0 - 30 || bx > vx0 + visW + 30) continue;
      const ang = Math.atan(pend(bx)) * 180 / Math.PI;
      h += `<g transform="translate(${f1(bx)} ${f1(yc(bx))}) rotate(${f1(ang)})"><rect x="-6.5" y="${f1(-w - 13)}" width="13" height="${f1(2 * w + 26)}" fill="#F3EBDD" stroke="#1B1F2A" stroke-opacity=".7"/><path d="M-6.5 ${f1(-w - 5)}H6.5M-6.5 ${f1(w + 5)}H6.5" stroke="#1B1F2A" stroke-opacity=".35"/></g>`;
    }
    const amb = [];
    for (let i = 0; i < 12; i++) amb.push({ off: (i % 2 ? 1 : -1) * w * .72, x0: azar() * visW, v: (azar() < .5 ? -1 : 1) * (8 + azar() * 16), c: ["#1B1F2A", "#A3312A", "#1A6AA6"][i % 3] });
    h += `<g class="ambiente">${amb.map((o) => `<circle r="2.3" fill="${o.c}"/>`).join("")}</g>`;
    return {
      svg: h,
      carril: xs.map((x) => [x, yc(x)]),
      paquete: `<circle r="7.5" fill="#E07B2A" stroke="#FAF6EE" stroke-width="2"/><path d="M.5-7.4c1.8-4 5.6-5.6 8.8-4.6-1.6 3.6-5.2 5.2-8.8 4.6z" fill="#3F7A4F"/>`,
      estela: [[5, .5], [4, .34], [3, .2]].map(([r, o]) => `<circle r="${r}" fill="#E07B2A" opacity="${o}"/>`),
      ambiente: moverAmbiente(amb, (x, o) => yc(x) + o.off, G, false)
    };
  }

  /* Murcia · acequias de la huerta: el agua (los datos) sale del Segura y riega las parcelas */
  function pintarAcequias(G) {
    const { nx, vx0, vy0, visW, visH, mid } = G;
    const esp = nx[1] - nx[0], A = visH * .13, x1 = vx0 + visW + 30, ya = vy0 - 6, yb = vy0 + visH + 6;
    const ys = nx.map((_, i) => mid + (i % 2 ? -A : A));
    const azar = semilla(9);
    const COL = ["#A9BE85", "#8FAE77", "#CDB27A", "#B9C58A", "#7FA266", "#D7C08B", "#9DB97F", "#C4B583"];
    let h = `<defs><pattern id="mur-surco-h" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 3.5H7" stroke="#2E4A23" stroke-opacity=".2" stroke-width="1.3"/></pattern><pattern id="mur-surco-vb" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M3.5 0V7" stroke="#5B4A26" stroke-opacity=".18" stroke-width="1.3"/></pattern></defs>` + fondo(G, "#EFE4D0");
    for (let x = vx0 - 40; x < x1;) {
      const an = 64 + azar() * 96;
      for (let y = ya - azar() * 40; y < yb;) {
        const al = 34 + azar() * 60, r = `x="${f1(x + 2)}" y="${f1(y + 2)}" width="${f1(an - 4)}" height="${f1(al - 4)}"`;
        h += `<rect ${r} fill="${COL[(azar() * COL.length) | 0]}"/><rect ${r} fill="url(#mur-surco-${azar() < .5 ? "h" : "vb"})"/>`;
        y += al;
      }
      x += an;
    }
    const xr = nx[0] - esp * .62;
    h += `<path d="M${f1(xr - 20)} ${f1(ya)}C${f1(xr - 6)} ${f1(vy0 + visH * .3)} ${f1(xr - 32)} ${f1(vy0 + visH * .7)} ${f1(xr - 16)} ${f1(yb)}H${f1(xr + 22)}C${f1(xr + 6)} ${f1(vy0 + visH * .7)} ${f1(xr + 32)} ${f1(vy0 + visH * .3)} ${f1(xr + 18)} ${f1(ya)}Z" fill="#2E7FBA" stroke="#E9DFCC" stroke-width="5"/>`;
    const xm = (i) => (nx[i] + nx[i + 1]) / 2;
    const P = [[xr, ys[0]], [xm(0), ys[0]], [xm(0), ys[1]], [xm(1), ys[1]], [xm(1), ys[2]], [xm(2), ys[2]], [xm(2), ys[3]], [x1, ys[3]]];
    const { d, pts } = redondear(P, 16);
    let br = "";
    for (let i = 0; i < P.length - 1; i++) {
      const [ax, ay] = P[i], [bx, by] = P[i + 1];
      if (ay !== by) continue;
      for (let x = Math.min(ax, bx) + 26 + azar() * 18; x < Math.max(ax, bx) - 24; x += 38 + azar() * 34) {
        if (nx.some((n) => Math.abs(n - x) < 40)) continue;
        const s = azar() < .5 ? -1 : 1, l = 18 + azar() * 26;
        br += `M${f1(x)} ${f1(ay)}V${f1(ay + s * l)}`;
      }
    }
    h += `<g fill="none" stroke-linecap="round"><path d="${br}" stroke="#F3EBDD" stroke-width="6"/><path d="${br}" stroke="#2F86C3" stroke-width="2.6"/><path class="mur-flujo" d="${br}" stroke="#A9D1EE" stroke-width="1.2" stroke-dasharray="5 8"/></g>`;
    h += `<g fill="none" stroke-linejoin="round"><path d="${d}" stroke="#F3EBDD" stroke-width="15"/><path d="${d}" stroke="#1A6AA6" stroke-width="9"/><path class="mur-flujo" d="${d}" stroke="#A9D1EE" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="10 16"/></g>`;
    return {
      svg: h,
      carril: pts,
      paquete: `<circle r="7.5" fill="#FAF6EE" stroke="#1A6AA6" stroke-width="2.6"/><circle r="3" fill="#2F86C3"/>`,
      estela: [[5, .55], [4, .38], [3, .22]].map(([r, o]) => `<circle r="${r}" fill="#2F86C3" opacity="${o}"/>`),
      ambiente: null
    };
  }

  /* Reserva · líneas de nivel en azul mar, para una provincia que aún no tenga banda propia */
  function pintarReserva(G) {
    const { nx, vx0, vy0, visW, visH, mid } = G;
    const lam = (nx[1] - nx[0]) * 2, A = visH * .1, th = visH / 15;
    const y = (x, j) => mid + j * th + A * Math.cos(2 * Math.PI * (x - nx[0]) / lam);
    const xs = rango(vx0 - 12, vx0 + visW + 12, 6);
    let h = fondo(G, "#FFFFFF");
    const j0 = Math.floor((vy0 - mid - A) / th) - 1, j1 = Math.ceil((vy0 + visH - mid + A) / th) + 1;
    for (let j = j0; j <= j1; j++) if (j) h += `<path d="${trazo(xs, (x) => y(x, j))}" fill="none" stroke="${j % 4 ? "#1A6AA6" : "#A3312A"}" stroke-opacity="${j % 4 ? .32 : .45}" stroke-width="${j % 4 ? 1 : 1.4}"/>`;
    h += `<path class="carril" d="${trazo(xs, (x) => y(x, 0))}"/>`;
    return {
      svg: h,
      carril: xs.map((x) => [x, y(x, 0)]),
      paquete: `<rect x="-7" y="-7" width="14" height="14" rx="2" transform="rotate(45)" fill="#FAF6EE" stroke="#A3312A" stroke-width="2.4"/>`,
      estela: [[8, .55], [6, .38], [4, .22]].map(([z, o]) => `<rect x="${-z / 2}" y="${-z / 2}" width="${z}" height="${z}" transform="rotate(45)" fill="#A3312A" opacity="${o}"/>`),
      ambiente: null
    };
  }

  /* Motor de una banda: construye el SVG, coloca las medallas (botones) y mueve el paquete */
  function crearMotor(el, pintor) {
    const svg = el.querySelector("svg");
    const lista = document.createElement("ol");
    lista.className = "paradas";
    lista.setAttribute("aria-label", "Cómo viaja un dato en una automatización");
    lista.innerHTML = PASOS.map(([n, t], i) => `<li class="parada"><button type="button" class="medalla" aria-label="Paso ${i + 1}, ${n}: ${t}"><span aria-hidden="true">${i + 1}</span></button><span class="m-nombre" aria-hidden="true">${n}</span></li>`).join("");
    const leyenda = document.createElement("p");
    leyenda.className = "paso-texto";
    leyenda.setAttribute("aria-hidden", "true");
    el.append(lista, leyenda);
    const lis = Array.from(lista.children);
    let G = null, R = null, acc = [], Ls = [], pk = null, estG = null, est = [], hist = [];
    let etapa = -1, reloj = 0, ultimo = 0, salto = null, lastI = 0, Lact = 0, sucio = true, foco = -1, tLey = 0;

    function punto(L) {
      const c = R.carril, n = acc.length - 1;
      if (L <= 0) return c[0];
      if (L >= acc[n]) return c[n];
      let lo = 0, hi = n;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acc[m] < L) lo = m; else hi = m; }
      const u = (L - acc[lo]) / (acc[hi] - acc[lo] || 1);
      return [c[lo][0] + (c[hi][0] - c[lo][0]) * u, c[lo][1] + (c[hi][1] - c[lo][1]) * u];
    }
    function colocar(L, alfa = 1) {
      Lact = L;
      const [x, y] = punto(L);
      pk.setAttribute("transform", `translate(${f1(x)} ${f1(y)})`);
      hist.unshift([x, y]); if (hist.length > 30) hist.length = 30;
      est.forEach((g, k) => { const p = hist[Math.min(hist.length - 1, (k + 1) * 7)]; g.setAttribute("transform", `translate(${f1(p[0])} ${f1(p[1])})`); });
      pk.style.opacity = estG.style.opacity = alfa;
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
    /* Escritorio ancho: la leyenda acompaña a la medalla activa (encima si está abajo, debajo si está arriba) */
    function colocarLeyenda(k) {
      if (!G || G.compacta) { leyenda.removeAttribute("style"); return; }
      const li = lis[k], px = parseFloat(li.style.left), py = parseFloat(li.style.top), r = 27;
      const ancho = leyenda.offsetWidth, alto = leyenda.offsetHeight;
      const abajo = punto(Ls[k])[1] > G.mid;
      const x = Math.max(12, Math.min(G.W - ancho - 12, k < 2 ? px - r : px + r - ancho));
      leyenda.style.left = f1(x) + "px";
      leyenda.style.top = f1(abajo ? py - r - 12 - alto : py + r + 36) + "px";
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
      return { i, a, t, d, L: Ls[a] + (Ls[b] - Ls[a]) * suave(Math.min(1, t / d)) };
    }
    function construir() {
      G = geometria(el);
      if (!G) return false;
      R = pintor(G);
      svg.innerHTML = R.svg + `<g class="estela">${R.estela.map((e) => `<g>${e}</g>`).join("")}</g><g class="paquete">${R.paquete}</g>`;
      pk = svg.querySelector(".paquete"); estG = svg.querySelector(".estela"); est = Array.from(estG.children);
      const c = R.carril;
      acc = [0];
      for (let i = 1; i < c.length; i++) acc.push(acc[i - 1] + Math.hypot(c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1]));
      Ls = G.nx.map((x) => {
        for (let i = 1; i < c.length; i++) if (c[i][0] >= x && c[i - 1][0] < x) return acc[i - 1] + (acc[i] - acc[i - 1]) * (x - c[i - 1][0]) / (c[i][0] - c[i - 1][0]);
        return 0;
      });
      lis.forEach((li, i) => { const [X, Y] = punto(Ls[i]); li.style.left = f1((X - G.vx0) * G.s) + "px"; li.style.top = f1((Y - G.vy0) * G.s) + "px"; });
      if (R.ambiente) { R.ambiente.init(svg); R.ambiente.tick(performance.now() / 1000); }
      hist = []; sucio = false; salto = null;
      if (reducido) { colocar(Ls[3]); setEtapa(3, true); }
      else { const e = enReloj(); colocar(e.L); setEtapa(e.a, true); }
      return true;
    }
    function preparar() {
      if (!sucio && G && el.clientWidth === G.W && el.clientHeight === G.H) return;
      construir();
    }
    function paso(now) {
      if (sucio && !construir()) return;
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
      if (R.ambiente) R.ambiente.tick(now / 1000);
    }
    function ir(k) {
      if (!G) return;
      if (reducido || !animando()) { hist = []; colocar(Ls[k]); reloj = OFF[2 * k]; lastI = 2 * k; setEtapa(k, true); return; }
      salto = { desde: Lact, hasta: Ls[k], t0: performance.now(), dur: 520 + Math.min(900, Math.abs(Ls[k] - Lact) * .9), k };
      setEtapa(k, true);
    }
    lis.forEach((li, i) => {
      const b = li.querySelector("button");
      b.addEventListener("click", () => ir(i));
      const ver = () => { foco = i; leyendaA(i); }, dejar = () => { foco = -1; leyendaA(etapa); };
      b.addEventListener("mouseenter", ver); b.addEventListener("focus", ver);
      b.addEventListener("mouseleave", dejar); b.addEventListener("blur", dejar);
    });
    return { paso, preparar, ensuciar: () => { sucio = true; }, reanudar: () => { ultimo = 0; } };
  }

  const motores = new Map();
  [["alicante", pintarMosaico], ["valencia", pintarTuria], ["murcia", pintarAcequias], ["reserva", pintarReserva]].forEach(([p, f]) => {
    const el = $(`.banda[data-prov="${p}"]`);
    if (el) motores.set(p, crearMotor(el, f));
  });
  let activo = null, raf = 0, visible = true, pausado = false;
  const animando = () => raf !== 0;
  function bucle(now) {
    if (!activo || !visible || pausado) { raf = 0; return; }
    activo.paso(now);
    raf = requestAnimationFrame(bucle);
  }
  function arrancar() {
    if (reducido || raf || !activo || !visible || pausado) return;
    activo.reanudar();
    raf = requestAnimationFrame(bucle);
  }
  function parar() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function activar(p) {
    parar();
    const q = p in DATOS ? p : "alicante", propia = !!$(`.banda[data-prov="${q}"]`);
    portada.classList.toggle("sin-banda", !propia);
    activo = propia ? motores.get(q) || null : motores.get("reserva");
    if (activo) { activo.preparar(); arrancar(); }
  }

  /* Pausa de todas las animaciones de la portada (WCAG 2.2.2) */
  const bPausa = $(".pausa");
  bPausa.addEventListener("click", () => {
    pausado = !pausado;
    portada.classList.toggle("en-pausa", pausado);
    bPausa.setAttribute("aria-pressed", String(pausado));
    if (pausado) parar(); else arrancar();
    portada.dispatchEvent(new CustomEvent("portada:pausa", { detail: { pausado } }));
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      portada.classList.toggle("fuera", !visible);
      if (visible) arrancar(); else parar();
    }).observe(portada);
  }
  let tRes = 0;
  addEventListener("resize", () => {
    clearTimeout(tRes);
    tRes = setTimeout(() => { motores.forEach((m) => m.ensuciar()); if (activo) activo.preparar(); }, 160);
  });

  /* ---------- Estado inicial y sincronía con el panel de opciones ---------- */
  const inicial = IAC.getOpcion("provincia");
  pintarGeo(inicial, false);
  activar(inicial);
  IAC.onCambio("provincia", (p) => {
    pintarGeo(p, true);
    activar(p);
    if (!reducido) todos("[data-prov-nombre]").forEach((el) => { el.classList.remove("nombre-nuevo"); void el.offsetWidth; el.classList.add("nombre-nuevo"); });
  });
})();
