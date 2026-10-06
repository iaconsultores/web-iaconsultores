import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe(".env.example", () => {
  it("lista sin valores exactamente las variables que lee la configuración", () => {
    expect(existsSync(".env.example")).toBe(true);
    const lineas = readFileSync(".env.example", "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
    expect(lineas.filter((l) => !/^[A-Z0-9_]+=$/.test(l))).toEqual([]);
    const usadas = new Set([...readFileSync("src/lib/config.ts", "utf8").matchAll(/process\.env\.([A-Z0-9_]+)/g)].map((m) => m[1]));
    expect(lineas.map((l) => l.slice(0, -1)).sort()).toEqual([...usadas].sort());
  });
});
