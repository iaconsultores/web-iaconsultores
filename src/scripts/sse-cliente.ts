export interface EventoSSE {
  evento: string;
  datos: unknown;
}

/** Lector incremental de text/event-stream: recibe trozos de texto y emite eventos completos */
export function crearLectorSSE(alEvento: (e: EventoSSE) => void): (trozo: string) => void {
  let bufer = "";
  return (trozo) => {
    bufer += trozo.replace(/\r\n/g, "\n");
    let corte = bufer.indexOf("\n\n");
    while (corte >= 0) {
      const bloque = bufer.slice(0, corte);
      bufer = bufer.slice(corte + 2);
      let evento = "message";
      const datos: string[] = [];
      for (const linea of bloque.split("\n")) {
        if (linea.startsWith("event:")) evento = linea.slice(6).trim();
        else if (linea.startsWith("data:")) datos.push(linea.slice(5).trimStart());
      }
      if (datos.length) {
        try {
          alEvento({ evento, datos: JSON.parse(datos.join("\n")) });
        } catch {
          /* bloque corrupto: se ignora */
        }
      }
      corte = bufer.indexOf("\n\n");
    }
  };
}
