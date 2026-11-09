/* Textos de las páginas locales: zonas (/consultoria-ia/<slug>) y artículos de soluciones (/soluciones/<slug>).
   La estructura está en datos/zonas.ts y datos/soluciones.ts; la guía de redacción, en src/textos/LEEME.md. */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const zonas = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/textos/zonas" }),
  schema: z.object({ descripcion: z.string().min(110).max(165) }),
});

const soluciones = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/textos/soluciones" }),
  schema: z.object({
    titulo: z.string().min(30).max(70),
    descripcion: z.string().min(110).max(165),
    resumen: z.string().min(80).max(220),
  }),
});

export const collections = { zonas, soluciones };
