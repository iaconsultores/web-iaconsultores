import { z } from "zod";

export function normalizarTelefono(valor: string): string {
  let t = valor.trim().replace(/[\s.\-()/]/g, "");
  if (t.startsWith("00")) t = "+" + t.slice(2);
  return t;
}

export const EsquemaMensajeChat = z.object({
  conversacionId: z.uuid().optional(),
  mensaje: z.string().trim().min(1, "Escribe tu pregunta.").max(1000, "Máximo 1.000 caracteres."),
});

export const EsquemaLead = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre.").max(80, "El nombre es demasiado largo."),
  telefono: z.string().transform(normalizarTelefono).pipe(z.string().regex(/^\+?\d{9,15}$/, "Escribe un teléfono válido.")),
  empresa: z.string().trim().max(120).default(""),
  proceso: z.string().trim().min(1, "Cuéntanos qué proceso quieres mejorar.").max(1000, "Máximo 1.000 caracteres."),
  franja: z.enum(["manana", "tarde", "indiferente"]).default("indiferente"),
  motivo: z.enum(["llamada", "colaboracion"]).default("llamada"),
  origen: z.enum(["formulario", "chat"]),
  conversacionId: z.uuid().optional(),
  privacidad: z.literal(true, { error: "Debes aceptar la política de privacidad." }),
  web: z.string().max(200).default(""),
  t: z.number().int().nonnegative(),
});

export type Lead = z.infer<typeof EsquemaLead>;

export function primerError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Datos no válidos.";
}
