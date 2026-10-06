/* Markdown mínimo y seguro para las respuestas del chat: el texto del modelo nunca se inserta como HTML */
export type Segmento =
  | { tipo: "texto"; valor: string }
  | { tipo: "negrita"; valor: string }
  | { tipo: "enlace"; valor: string; href: string };

export type Bloque = { tipo: "parrafo"; segmentos: Segmento[] } | { tipo: "lista"; elementos: Segmento[][] };

const PERMITIDOS = /^(https:\/\/(www\.)?(iaconsultores\.com|agentiacontable\.com|wa\.me|linkedin\.com)(\/|$|#|\?)|tel:|mailto:|\/(?!\/)|#)/;

export function enlacePermitido(href: string): boolean {
  return PERMITIDOS.test(href);
}

export function analizarLinea(linea: string): Segmento[] {
  const salida: Segmento[] = [];
  const patron = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https:\/\/[^\s<>()]+)/g;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  while ((m = patron.exec(linea))) {
    if (m.index > ultimo) salida.push({ tipo: "texto", valor: linea.slice(ultimo, m.index) });
    if (m[1]) salida.push({ tipo: "negrita", valor: m[1] });
    else if (m[2] && m[3]) salida.push(enlacePermitido(m[3]) ? { tipo: "enlace", valor: m[2], href: m[3] } : { tipo: "texto", valor: m[2] });
    else if (m[4]) {
      const url = m[4].replace(/[.,;:!?]+$/, "");
      const resto = m[4].slice(url.length);
      salida.push(enlacePermitido(url) ? { tipo: "enlace", valor: url, href: url } : { tipo: "texto", valor: url });
      if (resto) salida.push({ tipo: "texto", valor: resto });
    }
    ultimo = patron.lastIndex;
  }
  if (ultimo < linea.length) salida.push({ tipo: "texto", valor: linea.slice(ultimo) });
  return salida;
}

export function analizarMarkdown(texto: string): Bloque[] {
  const bloques: Bloque[] = [];
  for (const trozo of texto.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
    const lineas = trozo.split("\n").filter((l) => l.trim());
    if (!lineas.length) continue;
    if (lineas.every((l) => /^\s*[-*•]\s+/.test(l)))
      bloques.push({ tipo: "lista", elementos: lineas.map((l) => analizarLinea(l.replace(/^\s*[-*•]\s+/, ""))) });
    else bloques.push({ tipo: "parrafo", segmentos: analizarLinea(lineas.join(" ")) });
  }
  return bloques;
}

function pintarSegmentos(segmentos: Segmento[], destino: HTMLElement): void {
  for (const s of segmentos) {
    if (s.tipo === "texto") destino.append(document.createTextNode(s.valor));
    else if (s.tipo === "negrita") {
      const b = document.createElement("strong");
      b.textContent = s.valor;
      destino.append(b);
    } else {
      const a = document.createElement("a");
      a.href = s.href;
      a.textContent = s.valor;
      if (s.href.startsWith("https://")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      destino.append(a);
    }
  }
}

export function pintarBloques(bloques: Bloque[], destino: HTMLElement): void {
  destino.replaceChildren();
  for (const b of bloques) {
    if (b.tipo === "parrafo") {
      const p = document.createElement("p");
      pintarSegmentos(b.segmentos, p);
      destino.append(p);
    } else {
      const ul = document.createElement("ul");
      for (const el of b.elementos) {
        const li = document.createElement("li");
        pintarSegmentos(el, li);
        ul.append(li);
      }
      destino.append(ul);
    }
  }
}
