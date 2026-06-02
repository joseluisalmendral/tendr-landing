import type { TestimonialCardProps } from "@/components/landing/types";

/**
 * 7-note testimonials dataset for the cork storytelling pan (design §7).
 *
 * Extracted to its own module (not inline in page.tsx) so it can be imported
 * and audited by unit tests without rendering the page.
 *
 * Content rules (R8): Spanish B2B junior/freelance personas, quotes <= 3 lines,
 * ZERO em-dash (U+2014), curly quotes are added by TestimonialCard at render
 * time (the stored string is plain), each has name + role + company.
 *
 * Pan fields (R4/R5): `entrance`/`size`/`tilt`/`panPosition` are assigned so
 * entrances stay visibly varied and panPosition strictly increases left→right.
 * Exactly one note is `featured`.
 */

// Avatares: ilustraciones dicebear (estilo notionists), una seed distinta por
// persona (el nombre) para que cada cara sea estable y única. SVG remotos,
// renderizados con `unoptimized` en TestimonialCard (ver next.config.ts ->
// images.remotePatterns).
const dicebearAvatar = (seed: string) => ({
  src: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`,
  width: 64,
  height: 64,
});

export const TESTIMONIALS: TestimonialCardProps[] = [
  {
    name: "Martina Castro",
    role: "Account manager junior",
    company: "Hibö Studio",
    quote:
      "Pasé de perseguir clientes por correo a verlos todos en un tablero. Ahora sé a quién escribir cada mañana.",
    avatar: dicebearAvatar("Martina Castro"),
    featured: true,
    size: "lg",
    entrance: "rotate-drop",
    tilt: 1.6,
    panPosition: 0.1,
  },
  {
    name: "Bruno Quesada",
    role: "Consultor freelance",
    company: "Cuaderno Lab",
    quote:
      "Tendr me quitó la hoja de cálculo de encima. Mis seguimientos dejaron de perderse entre mil notas sueltas.",
    avatar: dicebearAvatar("Bruno Quesada"),
    size: "md",
    entrance: "slide-up",
    tilt: -1.4,
    panPosition: 0.24,
  },
  {
    name: "Lucía Ferrán",
    role: "Customer success",
    company: "Marea Digital",
    quote:
      "Lo abrí esperando otra herramienta complicada y en una tarde ya tenía a toda mi cartera ordenada.",
    avatar: dicebearAvatar("Lucía Ferrán"),
    size: "md",
    entrance: "fade-scale",
    tilt: 1.2,
    panPosition: 0.38,
  },
  {
    name: "Rodrigo Amaya",
    role: "Diseñador freelance",
    company: "Estudio Forma",
    quote:
      "Me recuerda cuándo toca volver a hablar con cada cliente. Esos avisos me han salvado más de un proyecto.",
    avatar: dicebearAvatar("Rodrigo Amaya"),
    size: "sm",
    entrance: "blur-drop",
    tilt: -2.0,
    panPosition: 0.52,
  },
  {
    name: "Valentina Herrero",
    role: "Junior sales",
    company: "Taller Común",
    quote:
      "Cerré dos cuentas que tenía olvidadas solo porque Tendr me las puso delante en el momento justo.",
    avatar: dicebearAvatar("Valentina Herrero"),
    size: "sm",
    entrance: "slide-right",
    tilt: 2.0,
    panPosition: 0.66,
  },
  {
    name: "Camilo Torres",
    role: "Copywriter freelance",
    company: "Sin Nombre Studio",
    quote:
      "Llevo mi trabajo solo y aun así siento que tengo un equipo detrás organizando la relación con cada cliente.",
    avatar: dicebearAvatar("Camilo Torres"),
    size: "md",
    entrance: "rotate-drop",
    tilt: -1.5,
    panPosition: 0.8,
  },
  {
    name: "Sofía Rengifo",
    role: "Project manager junior",
    company: "Brote Digital",
    quote:
      "Lo que más me gusta es lo simple que es. No tuve que aprender nada raro para empezar a usarlo bien.",
    avatar: dicebearAvatar("Sofía Rengifo"),
    size: "lg",
    entrance: "fade-scale",
    tilt: 1.4,
    panPosition: 0.94,
  },
];
