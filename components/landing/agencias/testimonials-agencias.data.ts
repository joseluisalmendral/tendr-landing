import type { TestimonialCardProps } from "@/components/landing/types";

/**
 * Testimonials dataset for the /agencias vertical (F6.5 "Tendr para agencias").
 *
 * THREE pre-launch PLACEHOLDER testimonials with agency profiles (brief §4):
 * agency owner / head of accounts / senior account manager. They follow the
 * SAME guardrails as the base `testimonials.data.ts`:
 *  - quotes <= 3 lines, ZERO em-dash (U+2014); curly quotes are added at render
 *    time by TestimonialCard (the stored string is plain),
 *  - each has name + role + company, realistic Spanish names,
 *  - no decorative status dots (the card has none),
 *  - exactly ONE note is `featured`,
 *  - `panPosition` strictly increases left→right and `entrance`/`size` vary.
 *
 * Honesty: like the base set, these are illustrative personas for a product that
 * has not launched. They depict only real, shipped behaviour (shared board,
 * per-account visibility) and never claim the unbuilt Team plan as live.
 */

// Avatares: mismas ilustraciones dicebear (estilo notionists) que la base, una
// seed por persona para que cada cara sea estable y única.
const dicebearAvatar = (seed: string) => ({
  src: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}`,
  width: 64,
  height: 64,
});

export const TESTIMONIALS_AGENCIAS: TestimonialCardProps[] = [
  {
    name: "Irene Pardo",
    role: "Fundadora de estudio",
    company: "Mística Studio",
    quote:
      "Antes preguntaba en Slack en qué iba cada cuenta. Ahora abro el tablero del estudio y lo veo sin interrumpir a nadie.",
    avatar: dicebearAvatar("Irene Pardo"),
    featured: true,
    size: "lg",
    entrance: "rotate-drop",
    tilt: 1.6,
    panPosition: 0.18,
  },
  {
    name: "Diego Salas",
    role: "Head of accounts",
    company: "Aurora Brands",
    quote:
      "Reparto las carteras entre el equipo y cada account manager ve solo las suyas. Yo sigo teniendo la foto completa.",
    avatar: dicebearAvatar("Diego Salas"),
    size: "md",
    entrance: "slide-up",
    tilt: -1.4,
    panPosition: 0.5,
  },
  {
    name: "Natalia Vega",
    role: "Senior account manager",
    company: "Brío Comunicación",
    quote:
      "Llevo doce clientes a la vez y dejé de perder seguimientos. El tablero me dice a quién toca escribir cada mañana.",
    avatar: dicebearAvatar("Natalia Vega"),
    size: "lg",
    entrance: "fade-scale",
    tilt: 1.4,
    panPosition: 0.82,
  },
];
