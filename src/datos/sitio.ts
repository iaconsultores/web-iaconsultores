/** Contacto y titular: una sola fuente para la web, el chat y los textos legales. */
export const SITIO = {
  nombre: "IA Consultores",
  url: "https://iaconsultores.com",
  telefono: "678 310 660",
  telefonoEnlace: "tel:+34678310660",
  email: "juanluis@iaconsultores.com",
  whatsapp: "https://wa.me/34678310660",
  linkedin: "https://www.linkedin.com/in/juanluistoboso",
  /** Código público de esta web */
  repositorio: "https://github.com/iaconsultores/web-iaconsultores",
  titular: "Agentia Codex S.L.",
  /** NIF de la sociedad (comunicado por la AEAT el 6-oct-2026) */
  nif: "B05723184",
  /** Domicilio social y fiscal: el de los datos estructurados y el aviso legal */
  domicilio: { calle: "Avda. Teodomiro 30, Entlo. B", cp: "03300", localidad: "Orihuela", provincia: "Alicante" },
  /** Token público de Cloudflare Web Analytics (va en cada página). Vacío = sin analítica. */
  tokenAnalitica: "a6ba074f24084fb2afdefe20282c30db",
} as const;
