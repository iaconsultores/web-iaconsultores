/* Formulario de contacto: valida, envía a /api/lead y evita los envíos dobles */
const form = document.querySelector<HTMLFormElement>("#contacto .ct-form");
if (form) {
  const inicio = Date.now();
  const estado = form.querySelector<HTMLElement>(".ct-estado");
  const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const motivo = form.querySelector<HTMLInputElement>('input[name="motivo"]');
  const proceso = form.querySelector<HTMLTextAreaElement>("#ct-proceso");
  const FALLO = "No hemos podido enviar tu solicitud. Llámanos al 678 310 660 o escríbenos por WhatsApp.";
  const enumerar = (l: string[]) => (l.length > 1 ? `${l.slice(0, -1).join(", ")} y ${l[l.length - 1]}` : l[0]);
  const campo = (nombre: string) => form.elements.namedItem(nombre) as HTMLInputElement;
  const avisar = (texto: string, error = false) => {
    if (!estado) return;
    estado.classList.toggle("ct-aviso", error);
    estado.textContent = texto;
  };

  document.querySelectorAll<HTMLElement>("[data-motivo]").forEach((el) =>
    el.addEventListener("click", () => {
      if (!motivo || !proceso) return;
      motivo.value = el.dataset.motivo === "colaboracion" ? "colaboracion" : "llamada";
      if (motivo.value === "colaboracion") proceso.placeholder = "Cuéntanos qué colaboración nos propones.";
    }),
  );

  form.addEventListener("input", (e) => {
    const el = e.target as HTMLElement;
    if (el.getAttribute("aria-invalid") === "true") el.setAttribute("aria-invalid", "false");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!boton || boton.disabled) return;
    const requisitos: [string, string][] = [
      ["nombre", "tu nombre"],
      ["telefono", "un teléfono"],
      ["proceso", "el proceso que quieres mejorar"],
      ["privacidad", "que aceptes la política de privacidad"],
    ];
    const faltan: string[] = [];
    let primero: HTMLInputElement | null = null;
    for (const [nombre, texto] of requisitos) {
      const el = campo(nombre);
      const vacio = el.type === "checkbox" ? !el.checked : !el.value.trim();
      el.setAttribute("aria-invalid", String(vacio));
      if (vacio) {
        faltan.push(texto);
        primero ??= el;
      }
    }
    if (faltan.length) {
      avisar(`Para llamarte necesitamos ${enumerar(faltan)}.`, true);
      primero?.focus();
      return;
    }
    const cuerpo = {
      nombre: campo("nombre").value,
      telefono: campo("telefono").value,
      empresa: campo("empresa").value,
      proceso: campo("proceso").value,
      franja: form.querySelector<HTMLInputElement>('input[name="franja"]:checked')?.value ?? "indiferente",
      motivo: motivo?.value ?? "llamada",
      origen: "formulario",
      privacidad: campo("privacidad").checked,
      web: campo("web").value,
      t: Date.now() - inicio,
    };
    boton.disabled = true;
    avisar("Enviando…");
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) });
      const j = (await r.json().catch(() => null)) as { ok?: boolean; mensaje?: string } | null;
      if (r.ok && j?.ok) {
        const nombre = cuerpo.nombre.trim().split(/\s+/)[0];
        form.reset();
        if (motivo) motivo.value = "llamada";
        avisar(`Gracias, ${nombre}. Te llamamos en la franja que has elegido.`);
      } else avisar(j?.mensaje ?? FALLO, true);
    } catch {
      avisar(FALLO, true);
    } finally {
      boton.disabled = false;
    }
  });
}
