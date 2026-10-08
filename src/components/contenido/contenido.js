(() => {
  const IAC = window.IAC || { alVer: (el, cb) => cb(el), reducido: false };
  const uno = (s, c = document) => c.querySelector(s);
  const todos = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* — Sobre mí: cifras reales, siempre en el DOM; solo aparecen con calma al verse — */
  const sobreMi = uno("#sobre-mi");
  if (sobreMi && !IAC.reducido) {
    sobreMi.classList.add("pru-js");
    IAC.alVer(uno(".pru-lista", sobreMi), (el) => el.classList.add("pru-visto"), { umbral: 0.35 });
  }

  /* — Colabora: dos corrientes (vuestro equipo y el nuestro) que se unen y siguen trenzadas — */
  const svg = uno("#colabora .co-corrientes");
  if (svg) {
    const a = uno(".co-a", svg), b = uno(".co-b", svg), nudo = uno(".co-nudo", svg);
    let ancho = 0;
    const suave = t => t * t * (3 - 2 * t);
    const trazar = () => {
      const r = svg.getBoundingClientRect();
      const W = Math.round(r.width), H = Math.round(r.height) || 150;
      if (!W || W === ancho) return;
      ancho = W;
      const mid = H / 2, sep = H * 0.3, movil = W < 700;
      const xm = Math.round(W * (movil ? 0.3 : 0.4)), periodo = movil ? 56 : 84, amp = movil ? 7 : 10;
      const linea = s => {
        const y0 = mid + s * sep;
        let d = "";
        for (let x = -6; x <= W + 6; x += 4) {
          const y = x <= xm
            ? y0 + (mid - y0) * suave(Math.min(1, Math.max(0, (x + 6) / (xm + 6))))
            : mid + s * amp * Math.min(1, (x - xm) / periodo) * Math.sin(2 * Math.PI * (x - xm) / periodo);
          d += (d ? "L" : "M") + x + " " + y.toFixed(1);
        }
        return d;
      };
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      a.setAttribute("d", linea(-1));
      b.setAttribute("d", linea(1));
      nudo.setAttribute("cx", String(xm));
      nudo.setAttribute("cy", String(mid));
    };
    trazar();
    let espera;
    addEventListener("resize", () => { clearTimeout(espera); espera = setTimeout(trazar, 150); });
    if (!IAC.reducido) {
      svg.classList.add("co-anima");
      IAC.alVer(svg, el => el.classList.add("co-visto"), { umbral: 0.5 });
    }
  }

})();
