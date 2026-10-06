(() => {
  const sec = document.getElementById("servicios");
  const IAC = window.IAC;
  if (!sec || !IAC) return;
  /* Longitud normalizada para que los trazos de los iconos se dibujen al entrar en pantalla */
  sec.querySelectorAll(".s-sprite symbol:not([id$='a']) > *").forEach(s => s.setAttribute("pathLength", "1"));
  if (IAC.reducido) return; /* movimiento reducido: todo visible en su estado final */
  sec.classList.add("anim");
  /* Entrada escalonada: los elementos que aparecen a la vez se revelan en cascada */
  let cola = [], pendiente = false;
  function revelar(el) {
    cola.push(el);
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      /* El navegador no garantiza el orden de los avisos: se ordena por posición en el documento */
      cola.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      cola.forEach((e, i) => { e.style.setProperty("--d", Math.min(i, 5) * 90 + "ms"); e.classList.add("visto"); });
      cola = []; pendiente = false;
    });
  }
  /* Ambas variantes se observan: la oculta se revela cuando se elige en el panel de opciones */
  sec.querySelectorAll(".s-item").forEach(el => IAC.alVer(el, revelar, { umbral: 0.15 }));
})();
