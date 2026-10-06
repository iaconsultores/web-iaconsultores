import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { cabecerasEstaticos, cabecerasSeguridad, paginasHtml, redirigirWww } from "../../servidor/middlewares.mjs";

describe("paginasHtml", () => {
  /* Con build.format "file", /mohure.html convive con la carpeta /mohure/ (por /mohure/cv.html) y express.static no llega al .html */
  const cliente = mkdtempSync(join(tmpdir(), "iac-"));
  mkdirSync(join(cliente, "mohure"));
  writeFileSync(join(cliente, "mohure.html"), "<p>mohure</p>");
  writeFileSync(join(cliente, "mohure", "cv.html"), "<p>cv</p>");
  const middleware = paginasHtml(cliente);
  const pedir = (path: string, method = "GET") => {
    const res = { enviado: "", sendFile: vi.fn(function (this: { enviado: string }, ruta: string) { this.enviado = ruta; }) };
    const next = vi.fn();
    middleware({ method, path }, res, next);
    return { res, next };
  };

  it("sirve /mohure aunque exista la carpeta /mohure/", () => {
    const { res, next } = pedir("/mohure");
    expect(res.sendFile).toHaveBeenCalledOnce();
    expect(res.enviado).toBe(join(cliente, "mohure.html"));
    expect(next).not.toHaveBeenCalled();
  });
  it("sirve las páginas anidadas", () => {
    expect(pedir("/mohure/cv").res.enviado).toBe(join(cliente, "mohure", "cv.html"));
  });
  it("deja pasar lo que no es una página: raíz, archivos con extensión, rutas inexistentes, POST y rutas que escapan", () => {
    for (const [path, method] of [["/", "GET"], ["/og.png", "GET"], ["/no-existe", "GET"], ["/mohure", "POST"], ["/../secreto", "GET"]]) {
      const { res, next } = pedir(path, method);
      expect(res.sendFile).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledOnce();
    }
  });
});

function resFalsa() {
  const cabeceras: Record<string, string> = {};
  return {
    cabeceras,
    redireccion: null as null | { codigo: number; url: string },
    set(a: string | Record<string, string>, b?: string) {
      if (typeof a === "string") cabeceras[a] = String(b);
      else Object.assign(cabeceras, a);
      return this;
    },
    redirect(codigo: number, url: string) {
      this.redireccion = { codigo, url };
    },
  };
}

describe("redirigirWww", () => {
  it("redirige www al dominio principal conservando ruta y consulta", () => {
    const res = resFalsa();
    const next = vi.fn();
    redirigirWww({ headers: { host: "www.iaconsultores.com" }, originalUrl: "/aviso-legal?x=1" }, res, next);
    expect(res.redireccion).toEqual({ codigo: 301, url: "https://iaconsultores.com/aviso-legal?x=1" });
    expect(next).not.toHaveBeenCalled();
  });
  it("deja pasar el dominio principal", () => {
    const res = resFalsa();
    const next = vi.fn();
    redirigirWww({ headers: { host: "iaconsultores.com" }, originalUrl: "/" }, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(res.redireccion).toBeNull();
  });
});

describe("cabecerasSeguridad", () => {
  it("pone las cabeceras de seguridad y noindex en /mohure", () => {
    const res = resFalsa();
    cabecerasSeguridad({ headers: {}, path: "/mohure" }, res, vi.fn());
    expect(res.cabeceras["X-Content-Type-Options"]).toBe("nosniff");
    expect(res.cabeceras["Content-Security-Policy"]).toBe("frame-ancestors 'none'");
    expect(res.cabeceras["X-Robots-Tag"]).toBe("noindex, nofollow");
  });
  it("también pone noindex en el CV", () => {
    const res = resFalsa();
    cabecerasSeguridad({ headers: {}, path: "/cv/juan-luis-toboso-consultor-ia.pdf" }, res, vi.fn());
    expect(res.cabeceras["X-Robots-Tag"]).toBe("noindex, nofollow");
  });
  it("no pone noindex en la portada y solo añade HSTS detrás de HTTPS", () => {
    const res = resFalsa();
    cabecerasSeguridad({ headers: {}, path: "/" }, res, vi.fn());
    expect(res.cabeceras["X-Robots-Tag"]).toBeUndefined();
    expect(res.cabeceras["Strict-Transport-Security"]).toBeUndefined();
    const res2 = resFalsa();
    cabecerasSeguridad({ headers: { "x-forwarded-proto": "https" }, path: "/" }, res2, vi.fn());
    expect(res2.cabeceras["Strict-Transport-Security"]).toBe("max-age=31536000");
  });
});

describe("cabecerasEstaticos", () => {
  it("caché inmutable para /_astro y no-cache para el HTML", () => {
    const res = resFalsa();
    cabecerasEstaticos(res, ["dist", "client", "_astro", "a.js"].join(sep));
    expect(res.cabeceras["Cache-Control"]).toBe("public, max-age=31536000, immutable");
    const res2 = resFalsa();
    cabecerasEstaticos(res2, ["dist", "client", "index.html"].join(sep));
    expect(res2.cabeceras["Cache-Control"]).toBe("no-cache");
  });
});
