import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { avisarN8n } from "../../src/lib/leads";
import { EsquemaLead } from "../../src/lib/validacion";

/* El flujo exportado (automatizaciones/n8n/flujos/leads-web.json) tiene que guardar todo lo que la web envía en el
   aviso, y no pasar a Claude ni el nombre ni el teléfono. */

interface Nodo {
  name: string;
  parameters: Record<string, unknown>;
}
const flujo = JSON.parse(readFileSync("automatizaciones/n8n/flujos/leads-web.json", "utf8")) as { nodes: Nodo[] };
const nodo = (nombre: string) => flujo.nodes.find((n) => n.name === nombre)!;

async function camposDelAviso(): Promise<string[]> {
  let cuerpo = "";
  const fetchFalso = (async (_url: string, init?: RequestInit) => {
    cuerpo = String(init?.body);
    return new Response("ok");
  }) as typeof fetch;
  const lead = EsquemaLead.parse({ nombre: "Ana", telefono: "600000000", empresa: "X", localidad: "Elche", proceso: "Facturas", origen: "formulario", privacidad: true, t: 5000 });
  await avisarN8n("http://n8n/webhook", "s", lead, new Date(1_700_000_000_000), fetchFalso);
  return Object.keys(JSON.parse(cuerpo).lead);
}

describe("flujo de n8n", () => {
  it("cada campo del aviso tiene columna en la tabla y se copia en «Preparar fila»", async () => {
    const campos = await camposDelAviso();
    expect(campos).toContain("localidad");
    const columnas = (nodo("Tabla «Leads web»").parameters.columns as { column: { name: string }[] }).column.map((c) => c.name);
    const codigo = String(nodo("Preparar fila").parameters.jsCode);
    for (const c of campos) {
      expect(columnas, c).toContain(c);
      expect(codigo, c).toMatch(new RegExp(`\\b${c}: lead\\.${c}\\b`));
    }
  });

  it("Claude recibe el municipio pero nunca el nombre ni el teléfono", () => {
    const texto = String(nodo("Clasificar con Claude").parameters.text);
    expect(texto).toContain("l.localidad");
    expect(texto).not.toMatch(/l\.nombre|l\.telefono/);
  });
});
