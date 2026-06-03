"use client";

import { useState } from "react";

/* -------------------------------------------------------------------------
 * v2 tokens (docs/curso/design-md-v2.md), scoped to this playground only.
 *
 * ROUND 5 — DERIVED FROM COLOR SCIENCE, NOT TASTE.
 *
 * Surface stays LOCKED: `eggshell-air` (#FCFBF7), warm-white, no switcher.
 *
 * After 24+ rejections across two zones (pure-earthy felt DEAD; pure-vivid
 * felt TOYISH for a tool holding client data), we stop guessing and apply the
 * evidence. The robust finding (Labrecque & Milne 2012, "Exciting red and
 * competent blue", J. Acad. Mktg. Sci.) is that HUE sets the personality but
 * SATURATION and VALUE amplify it: high chroma reads excited/arousing (the
 * toy zone), while MEDIUM chroma + considered value reads calm + competent.
 * That single axis explains BOTH rejection rounds and points at the unexplored
 * middle: SOPHISTICATED + ALIVE — the territory of Stripe, Mercury, Linear,
 * Notion Calendar, Frame.io. Colors that read "designed", neither dusty nor candy.
 *
 * ROLE MAP for Tendr's four emotional jobs (hue family -> job, with citation):
 *   TRUST / competence  -> blue & blue-green   (Labrecque & Milne 2012: blue =
 *                          competence/reliability; Stripe/Mercury/PayPal use it
 *                          to reduce data anxiety — confirmed across B2B-SaaS
 *                          color studies)
 *   CALM the overwhelm  -> blue-green + medium chroma  (chroma/value drive
 *                          arousal: lowering chroma converts "exciting" into
 *                          "competent/serene" — Labrecque & Milne Study 2)
 *   WARMTH / humanity   -> warm hues (terracotta/clay/rose), deployed as
 *                          COUNTERPOINT not as the trust-carrier (warm = sincere/
 *                          approachable in brand-personality research; anti-corporate)
 *   OPTIMISM / nudge    -> yellow / honey / saffron in SMALL doses  (yellow =
 *                          generosity/optimism, culturally positive in Spain;
 *                          small-dose attention without alarm)
 *
 * THREE roles in every trio, each mapped to a job:
 *   primary    -> TRUST + ACTION: CTA bg, active links, focus ring (interactive)
 *   support    -> WARMTH / signature: hand-drawn strokes, checks, kanban dots,
 *                 badge chips (the human counterpoint)
 *   highlight  -> OPTIMISM / gentle nudge: highlighter Mark, toast accent,
 *                 "Recomendado" pill, the follow-up nudge button (small-dose delight)
 *
 * Chroma discipline: primaries sit at medium chroma (oklch C ~0.08-0.14),
 * value deep enough to carry white text at AA >= 4.5:1, OR ink-led editorial.
 * Every text-bearing path is AA-verified (ratios stated per combo). Highlighter
 * Mark binds to `highlight` (ink-on-highlight >= 5.9:1 everywhere); support
 * carries text only as a deepened badge tint (`supportFg`). Custom hex sets
 * primary; support & highlight derive = primary. NO violet/lila (anti-lila law).
 * ---------------------------------------------------------------------- */

const INK = {
  textPrimary: "#1F1B16",
  textSecondary: "#5A5247",
  // SC 1.4.3: darkened from #8A8275 (3.76:1) to #736B5E (5.26:1 vs #FFFFFF, 5.21:1 vs #FEFEFC) — AA pass.
  textTertiary: "#736B5E",
} as const;

const RADII = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  full: "9999px",
} as const;

// SC 1.4.11 polish: bumped soft-shadow opacities .04/.06 → .06/.09 for raised card legibility on near-white.
const SHADOW = {
  soft: "0 1px 2px rgba(31,27,22,.06), 0 2px 8px rgba(31,27,22,.09)",
  note: "0 6px 18px rgba(31,27,22,.10)",
} as const;

/* Surface presets: 5 warm options ordered light→deep. Never cold gray,
 * never pure #FFFFFF base (v2 spec). Default = eggshell-air (index 2). */
type SurfacePreset = {
  id: string;
  label: string;
  ref: string;
  base: string;
  raised: string;
  sunken: string;
  borderHairline: string;
  borderStrong: string;
  /** SC 1.4.11: >=3:1 vs base AND raised. Used on interactive boundaries only
   *  (buttons, pills, toggles). Decorative hairlines keep borderHairline. */
  borderInteractive: string;
};

const SURFACE_PRESETS: SurfacePreset[] = [
  {
    id: "near-white",
    label: "Casi blanco",
    ref: "Un grado más claro que eggshell, calidez mínima",
    base: "#FEFEFC",
    raised: "#FFFFFF",
    sunken: "#F7F6F2",
    borderHairline: "#EEECE6",
    borderStrong: "#DEDBD2",
    // SC 1.4.11: #87837B → 3.78:1 vs #FFFFFF (raised), 3.74:1 vs #FEFEFC (base). Both ≥3:1.
    borderInteractive: "#87837B",
  },
  {
    id: "porcelain",
    label: "Porcelana",
    ref: "Suavemente más cálido que casi blanco, tono de porcelana",
    base: "#FDFDF9",
    raised: "#FFFFFF",
    sunken: "#F5F4EE",
    borderHairline: "#ECEAE2",
    borderStrong: "#DCD9CE",
    // SC 1.4.11: #87837B → 3.78:1 vs #FFFFFF, 3.70:1 vs #FDFDF9. Both ≥3:1.
    borderInteractive: "#87837B",
  },
  {
    id: "eggshell-air",
    label: "Eggshell (actual)",
    ref: "Fondo validado eggshell-air #FCFBF7. Warm-white aireado que respira; deja que los acentos vivos lean a plena saturación sin que el lienzo compita",
    base: "#FCFBF7",
    raised: "#FFFFFF",
    sunken: "#F3F1EA",
    borderHairline: "#EAE6DC",
    borderStrong: "#D9D3C6",
    // SC 1.4.11: #87837B → 3.78:1 vs #FFFFFF, 3.65:1 vs #FCFBF7. Both ≥3:1.
    borderInteractive: "#87837B",
  },
  {
    id: "warm-milk",
    label: "Leche cálida",
    ref: "Un paso más profundo que eggshell, sensación de leche templada",
    base: "#FBFAF5",
    raised: "#FFFFFF",
    sunken: "#F3F1E9",
    borderHairline: "#E9E6DB",
    borderStrong: "#D8D4C6",
    // SC 1.4.11: #87837B → 3.78:1 vs #FFFFFF, 3.61:1 vs #FBFAF5. Both ≥3:1.
    borderInteractive: "#87837B",
  },
  {
    id: "soft-linen",
    label: "Lino suave",
    ref: "El más profundo de la familia, calidez de lino natural sin oscurecer",
    base: "#FAF8F3",
    raised: "#FFFFFF",
    sunken: "#F2EFE7",
    borderHairline: "#E8E4D9",
    borderStrong: "#D7D2C4",
    // SC 1.4.11: #87837B → 3.78:1 vs #FFFFFF, 3.56:1 vs #FAF8F3. Both ≥3:1.
    borderInteractive: "#87837B",
  },
];

type ComboGroup = "psychology" | "brands";

type ComboPreset = {
  id: string;
  label: string;
  /** Switcher group: derived-from-science trios vs verified-brand trios. */
  group: ComboGroup;
  /** TRUST + ACTION: CTA button bg, active links, focus ring (interactive). */
  primary: string;
  /** Button foreground over `primary`, pre-validated for AA >= 4.5:1. */
  primaryFg: string;
  /** WARMTH / signature: hand-drawn strokes, checks, kanban dots, badge chips. */
  support: string;
  /** Readable text over a soft support-tint chip (deepened for AA on eggshell). */
  supportFg?: string;
  /** OPTIMISM / nudge: highlighter Mark, toast accent, "Recomendado" pill. */
  highlight?: string;
  /** Readable text over a soft highlight-tint chip (deepened for AA on eggshell). */
  highlightFg?: string;
  /** One-line psychology claim + real grounding + AA ratios, shown when active. */
  ref: string;
};

/* Ordered by conviction, best first; the top pick is marked in its label/ref.
 * All on eggshell #FCFBF7. Shared thesis (from the science): MEDIUM-CHROMA
 * SOPHISTICATION — primaries alive but adult, warm support as human counterpoint,
 * small-dose optimism highlight. Every text-bearing path AA-verified:
 *   primAA  = primaryFg on primary (button)        >= 4.5
 *   link    = primary on eggshell (link text)       >= 4.5
 *   supFg   = supportFg on eggshell (badge text)    >= 4.5
 *   inkHi   = ink on highlight (highlighter Mark)    >= 4.5
 *   highFg  = highlightFg on eggshell (pill text)    >= 4.5
 * The trios are DIVERSE by design (blue-led, green-led, warm-led, ink-led,
 * unexpected slate, blue-green-led) so the choice is between real directions,
 * not five blues. NO violet/lila ever (anti-lila law). */
const COMBOS: ComboPreset[] = [
  {
    id: "azure-clay-honey",
    group: "psychology",
    label: "Azure + clay + honey ★",
    primary: "#2D6CC0",
    primaryFg: "#FFFFFF",
    support: "#C5705A",
    supportFg: "#9E4F3B",
    highlight: "#E8A93C",
    highlightFg: "#7A5410",
    ref: "★ TOP para Tendr. AZUL-LED por la ciencia: el azul medio-cromático lee competencia/confianza (Labrecque & Milne 2012; familia Stripe Cornflower) — el color de 'pongo mi cartera en tus manos'. CONTRAPUNTO cálido en clay/terracota (humanidad, anti-corporate) y NUDGE en miel (optimismo, dosis pequeña). primAA 5.23 · link 5.05 · clay-badge 5.58 · ink/miel 8.29 · miel-pill 6.54. Sofisticado y vivo, ni tierra apagada ni caramelo. La que yo enviaría",
  },
  {
    id: "pine-terracotta-honey",
    group: "psychology",
    label: "Pine + terracotta + honey",
    primary: "#2C6E57",
    primaryFg: "#FFFFFF",
    support: "#CB6B4C",
    supportFg: "#9E4A30",
    highlight: "#E0A93E",
    highlightFg: "#735210",
    ref: "VERDE-LED 'calma': el verde-azulado medio convierte arousal en serenidad (chroma baja la excitación a competencia, Labrecque & Milne Study 2) y señala crecimiento/orden (familia Evernote/organización). Pino tranquilo + terracota humana + miel optimista. primAA 6.04 · link 5.84 · terra-badge 5.83 · ink/miel 8.08 · miel-pill 6.89. Promesa 'nada se escapa' hecha color",
  },
  {
    id: "terracotta-teal-sun",
    group: "psychology",
    label: "Terracotta + teal + sun",
    primary: "#B14E36",
    primaryFg: "#FFFFFF",
    support: "#2F8079",
    supportFg: "#1E6B62",
    highlight: "#EBB04A",
    highlightFg: "#7A5610",
    ref: "CÁLIDO-LED humanidad con contrapunto frío: terracota medio-cromática como acción (calidez 'de tú a tú', sincera/cercana en brand-personality research) equilibrada por teal fresco (confianza/calma) en trazos y checks. Sol como nudge. primAA 5.23 · link 5.05 · teal-badge 6.08 · ink/sol 8.84 · sol-pill 6.41. El teal vive en lo decorativo; la marca de subrayador usa el sol",
  },
  {
    id: "ink-azure-saffron",
    group: "psychology",
    label: "Ink + azure + saffron",
    primary: "#1F1B16",
    primaryFg: "#FFFFFF",
    support: "#4A86D6",
    supportFg: "#1F5694",
    highlight: "#E8A93C",
    highlightFg: "#7A5410",
    ref: "INK-LED editorial 'cuaderno' con dos pops: CTAs near-black muy de notebook (AA 17.12) + azul confianza viviendo en lo interactivo-decorativo (badges, trazos) + azafrán optimista en highlights. El color es delight con roles claros, el peso lo lleva el ink. primAA 17.12 · link 16.53 · azul-badge 7.20 · ink/azafrán 8.29 · azafrán-pill 6.54. Sobrio y humano a la vez",
  },
  {
    id: "slate-rose-mint",
    group: "psychology",
    label: "Slate + rose + mint",
    primary: "#3F5E8C",
    primaryFg: "#FFFFFF",
    support: "#C76B7A",
    supportFg: "#9C4555",
    highlight: "#3FA98C",
    highlightFg: "#1E6B55",
    ref: "INESPERADO pero defendible: slate (azul agrisado, confianza calmada — chroma media = competencia serena, Labrecque & Milne) + rosa polvoriento cálido (humanidad sin tierra) + menta como nudge fresco (en vez de amarillo: optimismo 'limpio', familia Mercury/Linear suaves). primAA 6.58 · link 6.36 · rosa-badge 5.97 · ink/menta 5.92 · menta-pill 6.17. El más 'designed', tipo fintech amable",
  },
  {
    id: "teal-coral-honey",
    group: "psychology",
    label: "Teal + coral + honey ✷",
    primary: "#1F7A74",
    primaryFg: "#FFFFFF",
    support: "#E07A5F",
    supportFg: "#A8472F",
    highlight: "#EBB04A",
    highlightFg: "#7A5610",
    ref: "✷ AZUL-VERDE-LED: el teal profundo une confianza (azul) y calma/crecimiento (verde) en un solo acento — el centro psicológico de los 4 jobs de Tendr. Coral cálido como firma humana + miel como nudge. Complementarios frío/cálido con roles que nunca compiten. primAA 5.13 · link 4.95 · coral-badge 5.62 · ink/miel 8.84 · miel-pill 6.41. Fresco, ágil, confiable",
  },

  /* ----- MARCAS VALIDADAS -----------------------------------------------
   * Cada trío = el despliegue REAL de una marca popular adaptado a los 3
   * roles de Tendr (primary acción · support firma · highlight nudge).
   * Cuando el hex de marca no llega a AA 4.5:1 con su texto, se ajusta el
   * VALOR manteniendo el hue reconocible (se anota "ajustado para AA").
   * Mismo contrato de ratios que el grupo Psicología, todo sobre eggshell. */
  {
    id: "hubspot-warm",
    group: "brands",
    label: "HubSpot · coral + charcoal ★",
    primary: "#C2491F",
    primaryFg: "#FFFFFF",
    support: "#33475B",
    supportFg: "#33475B",
    highlight: "#FFB94D",
    highlightFg: "#7A5410",
    ref: "★ TOP del grupo. HubSpot es el CRM cálido original: coral de acción (#FF7A59 ajustado a #C2491F para AA — el coral a plena saturación da 3.2:1, no carga texto blanco) + charcoal #33475B como firma/tinta de marca + miel como nudge. Calidez B2B que ya asocian con 'CRM amable'. primAA 4.92 · link 4.75 · charcoal-badge 9.25 · ink/miel 9.6 · miel-pill 6.54. La traducción más directa de 'mini-CRM con alma'",
  },
  {
    id: "calendly-trust",
    group: "brands",
    label: "Calendly · blue + turquoise",
    primary: "#0061E6",
    primaryFg: "#FFFFFF",
    support: "#004796",
    supportFg: "#004796",
    highlight: "#0AE8F0",
    highlightFg: "#0A7D85",
    ref: "CONFIANZA-LED. Calendly = agendar sin fricción, puro azul de fiabilidad (#006BFF ajustado a #0061E6 para AA holgado) + azul profundo #004796 como firma + turquesa como nudge fresco. Azul-led calma la ansiedad de datos del cliente (familia Stripe/PayPal). primAA 5.45 · link 5.26 · deep-badge 8.66 · ink/turquesa 11.26 · turquesa-pill 4.73. El más 'tool serio en quien confío'",
  },
  {
    id: "monzo-multi",
    group: "brands",
    label: "Monzo · teal + coral + amber",
    primary: "#007A8B",
    primaryFg: "#FFFFFF",
    support: "#C53349",
    supportFg: "#C53349",
    highlight: "#F1BD76",
    highlightFg: "#8A5A1E",
    ref: "MULTI-ACENTO fintech. Monzo equilibra una paleta rica sin gritar: teal #007A8B de acción (confianza+calma en un solo hue), coral (hot coral #FE4B60 ajustado a #C53349 para AA en badge) como firma humana y amber como nudge. Money-trust con personalidad. primAA 5.05 · link 4.88 · coral-badge 5.14 · ink/amber 10.0 · amber-pill 5.69. Vivo pero adulto, justo el centro de la tesis",
  },
  {
    id: "glovo-es",
    group: "brands",
    label: "Glovo · verde + amarillo 🇪🇸",
    primary: "#00806A",
    primaryFg: "#FFFFFF",
    support: "#00806A",
    supportFg: "#00785F",
    highlight: "#FFC244",
    highlightFg: "#8A5A0E",
    ref: "🇪🇸 ESPAÑA. Glovo: todo freelancer español reconoce el dúo amarillo+teal-verde (Pantone-verified). Teal-verde #00A082 ajustado a #00806A para AA como acción/firma + amarillo Glovo como nudge optimista. Reconocimiento de marca inmediato en el mercado objetivo. primAA 4.89 · link 4.72 · teal-badge 5.27 · ink/amarillo 10.64 · amarillo-pill 5.71. Familiaridad española como atajo de confianza",
  },
  {
    id: "idealista-es",
    group: "brands",
    label: "Idealista · azul + mazapán 🇪🇸",
    primary: "#3A72B8",
    primaryFg: "#FFFFFF",
    support: "#3A72B8",
    supportFg: "#8A5A1E",
    highlight: "#F7D797",
    highlightFg: "#8A6A1E",
    ref: "🇪🇸 ESPAÑA. Idealista = hogar y seguridad, marca de confianza profundamente familiar en España. Azul #578FCF ajustado a #3A72B8 para AA (confianza, decisiones importantes) + mazapán #F7D797 como nudge cálido (calidez de 'casa'). primAA 4.91 · link 4.74 · mazapán-badge 5.69 · ink/mazapán 12.33 · mazapán-pill 4.87. Azul-confianza con calor doméstico, muy de tú a tú",
  },
  {
    id: "holded-es",
    group: "brands",
    label: "Holded · cian + teal oscuro 🇪🇸",
    primary: "#026081",
    primaryFg: "#FFFFFF",
    support: "#0A7C9E",
    supportFg: "#0A7C9E",
    highlight: "#0ABBFA",
    highlightFg: "#0A7C9E",
    ref: "🇪🇸 ESPAÑA. Holded es el SaaS de contabilidad #1 para autónomos españoles: el cliente exacto de Tendr ya lo conoce. Teal oscuro #026081 de acción + cian #0ABBFA como nudge brillante (su acento de marca). Monocromo azul-cian = competencia técnica serena. primAA 7.02 · link 6.78 · cian-badge 4.62 · ink/cian 7.75 · cian-pill 4.62. Adyacencia directa al stack del freelancer español",
  },
  {
    id: "folk-pastel",
    group: "brands",
    label: "folk · ink + pasteles",
    primary: "#101010",
    primaryFg: "#FFFFFF",
    support: "#B23A86",
    supportFg: "#B23A86",
    highlight: "#FFF8BB",
    highlightFg: "#7A6A10",
    ref: "INK-LED + PASTELES decorativos. folk (CRM de relaciones) usa CTA negro con pasteles suaves de adorno: ink #101010 de acción (AA 19) + rosa wisp #FCE5F3 deepened a #B23A86 como firma humana + buttermilk #FFF8BB como Mark/nudge. Sobrio y tierno, el más 'designed-calm'. primAA 19.03 · link 18.38 · wisp-badge 5.28 · ink/buttermilk 15.81 · buttermilk-pill 5.20. CRM de relaciones, igual que Tendr",
  },
  {
    id: "substack-ink",
    group: "brands",
    label: "Substack · naranja + Dune",
    primary: "#CE3F0E",
    primaryFg: "#FFFFFF",
    support: "#2B2823",
    supportFg: "#2B2823",
    highlight: "#FF6719",
    highlightFg: "#9E3F0E",
    ref: "INK-ON-PAPER íntimo. Substack = relación directa escritor-lector, tinta sobre papel cálido. Naranja #FF6719 ajustado a #CE3F0E para CTA AA + Dune warm-black #2B2823 como firma editorial + naranja Substack puro como Mark/nudge (ink-on-naranja 5.87). primAA 4.84 · link 4.67 · dune-badge 14.18 · ink/naranja 5.87 · naranja-pill 6.40. La intimidad 'de tú a tú' hecha color cálido",
  },
  {
    id: "wise-bold",
    group: "brands",
    label: "Wise · forest ink + lima",
    primary: "#163300",
    primaryFg: "#FFFFFF",
    support: "#1E4A0A",
    supportFg: "#1E4A0A",
    highlight: "#9FE870",
    highlightFg: "#3E6B1A",
    ref: "MONEY-TRUST audaz. Wise empareja forest ink #163300 (confianza-dinero, AA 14) con lima #9FE870 brillante: el ink lleva el peso, la lima es el nudge que despierta. Verde profundo = competencia financiera serena + pop de optimismo. primAA 13.93 · link 13.45 · forest-badge 9.95 · ink/lima 11.62 · lima-pill 6.10. Confianza con dinero sin parecer banco aburrido",
  },
  {
    id: "headspace-calm",
    group: "brands",
    label: "Headspace · naranja cálido + cielo",
    primary: "#C7480D",
    primaryFg: "#FFFFFF",
    support: "#1E7DA0",
    supportFg: "#1E7DA0",
    highlight: "#F58B44",
    highlightFg: "#9E4A1E",
    ref: "CÁLIDO-LED emocional. Headspace está diseñado para calmar: naranja profundo #F06E1D ajustado a #C7480D para CTA AA + cielo #52B6DE deepened a #1E7DA0 como contrapunto fresco (firma) + amber cálido como nudge. Calidez con propósito, baja el overwhelm. primAA 4.82 · link 4.65 · cielo-badge 4.51 · ink/amber 7.06 · amber-pill 5.88. Diseñado literalmente para serenar al usuario",
  },
];

/* Switcher row groups (small mono label per group, Spanish). */
const GROUPS: { id: ComboGroup; label: string }[] = [
  { id: "psychology", label: "Psicología" },
  { id: "brands", label: "Marcas" },
];

const HEX_RE = /^#?([0-9a-fA-F]{6})$/;

/** Relative luminance of a #rrggbb color (WCAG formula, sRGB). */
function luminance(hex: string): number {
  const m = HEX_RE.exec(hex);
  if (!m) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Picks a readable foreground (warm-white or warm-ink) for a custom accent. */
function accentForeground(accent: string): string {
  return luminance(accent) > 0.45 ? INK.textPrimary : "#FFFFFF";
}

/* ----------------------------- type scale ------------------------------ */

const TYPE_SCALE = [
  { name: "display-xl", size: 64, lh: 1.05, ls: "-0.02em", display: true },
  { name: "display-lg", size: 48, lh: 1.08, ls: "-0.02em", display: true },
  { name: "h1", size: 38, lh: 1.1, ls: "-0.02em", display: true },
  { name: "h2", size: 30, lh: 1.15, ls: "-0.015em", display: true },
  { name: "h3", size: 22, lh: 1.2, ls: "-0.01em", display: true },
  { name: "body-lg", size: 20, lh: 1.55, ls: "0", display: false },
  { name: "body", size: 17, lh: 1.6, ls: "0", display: false },
  { name: "body-sm", size: 15, lh: 1.5, ls: "0", display: false },
  { name: "caption", size: 13, lh: 1.4, ls: "0.01em", display: false },
] as const;

/* ------------------------------ sections ------------------------------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-display-v2)] font-semibold"
      style={{
        fontSize: 30,
        lineHeight: 1.15,
        letterSpacing: "-0.015em",
        color: INK.textPrimary,
      }}
    >
      {children}
    </h2>
  );
}

function Swatch({ name, value, border }: { name: string; value: string; border?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full"
        style={{
          background: value,
          borderRadius: RADII.sm,
          border: border ? "1px solid var(--border-hairline)" : "none",
        }}
      />
      <div
        className="font-[family-name:var(--font-mono-v2)]"
        style={{ fontSize: 13, color: INK.textSecondary }}
      >
        {name}
        <span style={{ color: INK.textTertiary }}> · {value}</span>
      </div>
    </div>
  );
}

function Buttons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        className="px-5 py-3 font-medium transition-transform duration-150 active:scale-[0.98]"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-accent-fg)",
          borderRadius: RADII.md,
          fontSize: 15,
        }}
      >
        Empieza gratis
      </button>
      <button
        type="button"
        className="px-5 py-3 font-medium transition-colors duration-150"
        style={{
          background: "transparent",
          color: INK.textPrimary,
          borderRadius: RADII.md,
          fontSize: 15,
        }}
      >
        Ver cómo funciona
      </button>
      <button
        type="button"
        className="px-5 py-3 font-medium transition-transform duration-150 active:scale-[0.98]"
        style={{
          background: "transparent",
          color: INK.textPrimary,
          // SC 1.4.11: ghost button boundary uses --border-interactive (≥3:1) not --border-strong.
          border: "1px solid var(--border-interactive)",
          borderRadius: RADII.md,
          fontSize: 15,
        }}
      >
        Ver precios
      </button>
      <a
        href="#switcher"
        className="font-medium underline-offset-4 hover:underline"
        style={{ color: "var(--color-accent)", fontSize: 15 }}
      >
        Un link activo
      </a>
    </div>
  );
}

/** Clean card: raised surface, radius-lg, hairline border, flat (no shadow). */
function CleanCard() {
  return (
    <div
      className="p-8"
      style={{
        background: "var(--surface-raised)",
        borderRadius: RADII.lg,
        border: "1px solid var(--border-hairline)",
      }}
    >
      <h3
        className="font-[family-name:var(--font-display-v2)] font-semibold"
        style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: "-0.01em", color: INK.textPrimary }}
      >
        Card limpia
      </h3>
      <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.5, color: INK.textSecondary }}>
        Superficie elevada, radius-lg, hairline y cero sombra. La base plana del
        sistema: la sombra queda reservada para las notas vivas.
      </p>
      <div className="mt-5 flex items-center gap-3">
        {/* Badge uses SUPPORT: tinted chip bg + deeper support text for AA. */}
        <span
          className="px-3 py-1 font-medium"
          style={{
            color: "var(--color-support-fg)",
            background:
              "color-mix(in oklab, var(--color-support) 12%, var(--surface-raised))",
            borderRadius: RADII.full,
            fontSize: 13,
            letterSpacing: "0.01em",
          }}
        >
          Badge pill
        </span>
        {/* Link uses PRIMARY: the interactive color. */}
        <a
          href="#switcher"
          className="font-medium underline-offset-4 hover:underline"
          style={{ color: "var(--color-accent)", fontSize: 13 }}
        >
          Ver cliente
        </a>
        <span
          className="font-[family-name:var(--font-mono-v2)]"
          style={{ fontSize: 13, color: INK.textTertiary }}
        >
          02 · seguimiento
        </span>
      </div>
    </div>
  );
}

/** Living note: paper card, slight rotation, signature shadow, faux mini-kanban. */
function LivingNote() {
  const columns = [
    { title: "Nuevo", cards: ["Estudio Roble", "Marta · web"] },
    { title: "En curso", cards: ["Clínica Sur"] },
    { title: "Cerrado", cards: ["Vega & Co"] },
  ];
  return (
    <div
      className="p-6 transition-transform duration-150 hover:scale-[1.01]"
      style={{
        background: "var(--surface-raised)",
        borderRadius: RADII.lg,
        border: "1px solid var(--border-hairline)",
        boxShadow: SHADOW.note,
        transform: "rotate(-1deg)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3
          className="font-[family-name:var(--font-display-v2)] font-semibold"
          style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: "-0.01em", color: INK.textPrimary }}
        >
          Nota viva
        </h3>
        <span
          className="font-[family-name:var(--font-mono-v2)]"
          style={{ fontSize: 13, color: INK.textTertiary }}
        >
          mini-kanban
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {columns.map((col) => (
          <div
            key={col.title}
            className="p-2"
            style={{
              background: "var(--surface-sunken)",
              borderRadius: RADII.sm,
            }}
          >
            <div
              className="font-[family-name:var(--font-mono-v2)] mb-2 flex items-center gap-1.5"
              style={{ fontSize: 11, color: INK.textSecondary, letterSpacing: "0.02em" }}
            >
              {/* Column dot uses SUPPORT: micro-element accent. */}
              <span
                className="inline-block size-2 shrink-0"
                style={{ background: "var(--color-support)", borderRadius: RADII.full }}
              />
              {col.title}
            </div>
            <div className="flex flex-col gap-2">
              {col.cards.map((card) => (
                <div
                  key={card}
                  className="px-2 py-1.5"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border-hairline)",
                    borderRadius: "6px",
                    fontSize: 12,
                    color: INK.textPrimary,
                  }}
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Modern hand-drawn annotation: clean geometric stroke, round caps. */
function HandDrawnArrow() {
  return (
    <div className="relative flex items-center gap-4">
      <svg
        width="120"
        height="64"
        viewBox="0 0 120 64"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 50 C 36 54, 78 44, 104 18"
          stroke="var(--color-support)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M92 16 L 106 16 L 102 30"
          stroke="var(--color-support)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p style={{ fontSize: 15, color: INK.textSecondary, maxWidth: "28ch" }}>
        Anotación hand-drawn moderna: trazo geométrico, linecap redondo, sin
        jitter. Una o dos por sección, no más.
      </p>
    </div>
  );
}

/* ----------------------- richer demo components ------------------------ *
 * The "real landing" half: a framed mini landing (nav + hero) plus product
 * chrome (pricing, form, toast, hand-drawn underline). All tokens via CSS vars
 * so they repaint with the active combo. Hover-only transitions; no loops.
 * ---------------------------------------------------------------------- */

/** Highlighter mark: the "subrayador" effect, the OPTIMISM role. Text stays
 * INK; the fill is `--color-highlight` (the small-dose nudge color). AA of
 * ink-on-highlight is >= 5.9:1 for every shipped trio, so full opacity is safe;
 * soft is offered for taste. */
function Mark({
  children,
  soft = false,
}: {
  children: React.ReactNode;
  soft?: boolean;
}) {
  return (
    <span
      style={{
        color: INK.textPrimary,
        background: soft
          ? "color-mix(in oklab, var(--color-highlight) 38%, var(--surface))"
          : "var(--color-highlight)",
        padding: "0.02em 0.18em",
        borderRadius: "4px",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}

/** Slim nav bar: wordmark + 3 links + small primary CTA. Combo in chrome. */
function MiniNav() {
  return (
    <nav
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid var(--border-hairline)" }}
    >
      <span
        className="font-[family-name:var(--font-display-v2)] font-bold"
        style={{ fontSize: 22, letterSpacing: "-0.02em", color: INK.textPrimary }}
      >
        tendr
      </span>
      <div className="hidden items-center gap-6 sm:flex">
        {["Producto", "Precios", "Recursos"].map((link) => (
          <a
            key={link}
            href="#switcher"
            className="font-medium transition-colors duration-150 hover:opacity-70"
            style={{ fontSize: 14, color: INK.textSecondary }}
          >
            {link}
          </a>
        ))}
      </div>
      <button
        type="button"
        className="px-4 py-2 font-medium transition-transform duration-150 active:scale-[0.98]"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-accent-fg)",
          borderRadius: RADII.md,
          fontSize: 14,
        }}
      >
        Empieza gratis
      </button>
    </nav>
  );
}

/** Mini-hero: display headline with a highlighter-marked word, sub, CTAs. */
function MiniHero() {
  return (
    <div className="flex flex-col items-start gap-6 px-6 py-16 sm:px-12">
      <h1
        className="font-[family-name:var(--font-display-v2)] font-bold"
        style={{
          fontSize: "clamp(36px, 5vw, 52px)",
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: INK.textPrimary,
          maxWidth: "16ch",
        }}
      >
        Tus clientes, <Mark>ordenados</Mark> sin hojas de cálculo.
      </h1>
      <p
        style={{
          fontSize: 19,
          lineHeight: 1.55,
          color: INK.textSecondary,
          maxWidth: "48ch",
        }}
      >
        El mini-CRM para freelancers que prefieren cerrar proyectos antes que
        pelearse con un Excel.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="px-6 py-3 font-medium transition-transform duration-150 active:scale-[0.98]"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-accent-fg)",
            borderRadius: RADII.md,
            fontSize: 16,
          }}
        >
          Empieza gratis
        </button>
        <a
          href="#switcher"
          className="font-medium underline-offset-4 hover:underline"
          style={{ color: INK.textPrimary, fontSize: 16 }}
        >
          Ver cómo funciona →
        </a>
      </div>
    </div>
  );
}

/** Framed landing preview: nav + hero inside one hairline-bordered container. */
function LandingPreview() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: RADII.xl,
        overflow: "hidden",
        boxShadow: SHADOW.soft,
      }}
    >
      <MiniNav />
      <MiniHero />
    </div>
  );
}

/** Pricing mini-card: plan, big price, feature list with support checks, CTA. */
function PricingCard() {
  const features = ["Clientes ilimitados", "Recordatorios de seguimiento", "Exporta a PDF"];
  return (
    <div
      className="relative flex flex-col gap-6 p-8"
      style={{
        background: "var(--surface-raised)",
        borderRadius: RADII.lg,
        border: "1px solid var(--border-hairline)",
        maxWidth: 360,
      }}
    >
      {/* "Recomendado" pill in HIGHLIGHT: the optimism / nudge role */}
      <span
        className="absolute right-6 top-6 px-3 py-1 font-medium"
        style={{
          color: "var(--color-highlight-fg)",
          background: "color-mix(in oklab, var(--color-highlight) 18%, var(--surface-raised))",
          borderRadius: RADII.full,
          fontSize: 12,
          letterSpacing: "0.01em",
        }}
      >
        Recomendado
      </span>
      <div className="flex flex-col gap-1">
        <span
          className="font-[family-name:var(--font-mono-v2)]"
          style={{ fontSize: 13, color: INK.textSecondary, letterSpacing: "0.02em" }}
        >
          Pro
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className="font-[family-name:var(--font-display-v2)] font-bold"
            style={{ fontSize: 48, lineHeight: 1, letterSpacing: "-0.02em", color: INK.textPrimary }}
          >
            12€
          </span>
          <span style={{ fontSize: 15, color: INK.textTertiary }}>/mes</span>
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {features.map((feat) => (
          <li key={feat} className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M4 9.5 L7.5 13 L14 5"
                stroke="var(--color-support)"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: 15, color: INK.textPrimary }}>{feat}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="px-5 py-3 font-medium transition-transform duration-150 active:scale-[0.98]"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-accent-fg)",
          borderRadius: RADII.md,
          fontSize: 15,
        }}
      >
        Elegir Pro
      </button>
    </div>
  );
}

/** Form row: labeled input with a visible primary focus ring, plus submit. */
function FormRow() {
  return (
    <div className="flex flex-col gap-5" style={{ maxWidth: 420 }}>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="pg-email"
          className="font-medium"
          style={{ fontSize: 14, color: INK.textPrimary }}
        >
          Email de trabajo
        </label>
        <input
          id="pg-email"
          type="email"
          placeholder="tu@estudio.com"
          spellCheck={false}
          className="px-4 py-3 outline-none transition-shadow duration-150"
          style={{
            fontSize: 15,
            background: "var(--surface-sunken)",
            border: "1px solid var(--border-strong)",
            borderRadius: RADII.md,
            color: INK.textPrimary,
            // SC 2.4.13: solid 2px offset ring (surface-raised gap + accent ring).
            // Offset pattern: inner 2px raised-surface gap, outer 2px accent — ≥3:1 vs adjacent.
            boxShadow: "0 0 0 2px var(--surface-raised), 0 0 0 4px var(--color-accent)",
            borderColor: "var(--color-accent)",
          }}
        />
        <span style={{ fontSize: 13, color: INK.textTertiary }}>
          Sin tarjeta. Cancela cuando quieras.
        </span>
      </div>
      <button
        type="button"
        className="self-start px-5 py-3 font-medium transition-transform duration-150 active:scale-[0.98]"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-accent-fg)",
          borderRadius: RADII.md,
          fontSize: 15,
        }}
      >
        Crear cuenta
      </button>
    </div>
  );
}

/** Toast chip: raised surface, SUPPORT-colored dot + edge (non-text indicator).
 * SC 1.4.11: highlight is TEXT-BACKGROUND only (Mark, tinted pills with highlightFg text);
 * non-text indicators (stripe, dot) use support — guaranteed ≥3:1 vs white on all presets. */
function ToastChip() {
  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-3"
      style={{
        background: "var(--surface-raised)",
        border: "1px solid var(--border-hairline)",
        borderLeft: "3px solid var(--color-support)",
        borderRadius: RADII.md,
        boxShadow: SHADOW.soft,
      }}
    >
      <span
        className="inline-block size-2.5 shrink-0"
        style={{ background: "var(--color-support)", borderRadius: RADII.full }}
      />
      <span style={{ fontSize: 15, color: INK.textPrimary, fontWeight: 500 }}>
        Cliente guardado
      </span>
      <span
        className="font-[family-name:var(--font-mono-v2)]"
        style={{ fontSize: 12, color: INK.textTertiary }}
      >
        ahora
      </span>
    </div>
  );
}

/** Hand-drawn underline variant: SVG stroke in support under marked words. */
function HandDrawnUnderline() {
  return (
    <p
      style={{
        fontSize: 22,
        lineHeight: 1.6,
        color: INK.textPrimary,
        maxWidth: "32ch",
      }}
    >
      Cierra el trato y deja que Tendr lleve el{" "}
      <span className="relative inline-block">
        seguimiento
        <svg
          className="absolute left-0 w-full"
          style={{ bottom: "-0.32em", height: "0.5em" }}
          viewBox="0 0 120 12"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M3 8 C 30 11, 70 3, 117 6"
            stroke="var(--color-support)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>{" "}
      por ti.
    </p>
  );
}

/** Follow-up nudge: Tendr's core emotional moment. The GENTLE-ACTION job —
 * urgency without panic. A small highlight dot signals the nudge (optimism, not
 * alarm), the days-count sits in support (warm/human), and the "Retomar" button
 * is primary (trust + action). Tests all three roles in one realistic card. */
function FollowUpNudge() {
  return (
    <div
      className="flex items-center justify-between gap-4 p-5"
      style={{
        background: "var(--surface-raised)",
        border: "1px solid var(--border-hairline)",
        borderRadius: RADII.lg,
        boxShadow: SHADOW.soft,
        maxWidth: 460,
      }}
    >
      <div className="flex items-start gap-3">
        {/* SC 1.4.11: nudge dot switched to SUPPORT (non-text indicator).
         * highlight is TEXT-BACKGROUND only; support is the non-text status signal. */}
        <span
          className="mt-1.5 inline-block size-2.5 shrink-0"
          style={{ background: "var(--color-support)", borderRadius: RADII.full }}
        />
        <div className="flex flex-col gap-1">
          <span style={{ fontSize: 15, color: INK.textPrimary, fontWeight: 500 }}>
            Hace 12 días que no hablas con Marta
          </span>
          <span
            className="font-[family-name:var(--font-mono-v2)]"
            style={{ fontSize: 12, color: "var(--color-support-fg)" }}
          >
            Estudio Roble · propuesta enviada
          </span>
        </div>
      </div>
      <button
        type="button"
        className="shrink-0 px-4 py-2 font-medium transition-transform duration-150 active:scale-[0.98]"
        style={{
          background: "var(--color-accent)",
          color: "var(--color-accent-fg)",
          borderRadius: RADII.md,
          fontSize: 14,
        }}
      >
        Retomar
      </button>
    </div>
  );
}

/* ------------------------------ switcher ------------------------------- */

function Dot({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-3"
      style={{
        background: color,
        borderRadius: RADII.full,
        border: "1px solid rgba(31,27,22,.2)",
      }}
    />
  );
}

function PresetPill({
  active,
  onClick,
  swatch,
  swatch2,
  swatch3,
  children,
}: {
  active: boolean;
  onClick: () => void;
  swatch: string;
  /** Second swatch dot for combo pills (support role). */
  swatch2?: string;
  /** Third swatch dot for trio pills (highlight role). */
  swatch3?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 font-medium transition-colors duration-150"
      style={{
        fontSize: 13,
        borderRadius: RADII.full,
        // SC 1.4.11: inactive pill uses --border-interactive (≥3:1); active uses ink (high contrast).
        border: `1px solid ${active ? INK.textPrimary : "var(--border-interactive)"}`,
        background: active ? INK.textPrimary : "transparent",
        color: active ? "#FFFFFF" : INK.textPrimary,
      }}
    >
      {/* primary dot, then optional support + highlight dots (overlapped trio) */}
      <span className="flex items-center" style={{ marginRight: swatch2 ? 2 : 0 }}>
        <Dot color={swatch} />
        {swatch2 ? (
          <span style={{ marginLeft: -5 }}>
            <Dot color={swatch2} />
          </span>
        ) : null}
        {swatch3 ? (
          <span style={{ marginLeft: -5 }}>
            <Dot color={swatch3} />
          </span>
        ) : null}
      </span>
      {children}
    </button>
  );
}

function Switcher({
  comboId,
  surfaceId,
  customHex,
  activeComboRef,
  activeSurfaceRef,
  activeSurfaceBase,
  activeCombo,
  onCombo,
  onSurface,
  onCustom,
}: {
  comboId: string;
  surfaceId: string;
  customHex: string;
  activeComboRef: string;
  activeSurfaceRef: string;
  /** Base color of the active surface preset — used for the collapsed summary dot. */
  activeSurfaceBase: string;
  /** Active combo preset for collapsed summary dots (primary/support/highlight). */
  activeCombo: ComboPreset | undefined;
  onCombo: (preset: ComboPreset) => void;
  onSurface: (preset: SurfacePreset) => void;
  onCustom: (hex: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      id="switcher"
      className="sticky top-0 z-10 px-6"
      style={{
        background: "color-mix(in oklab, var(--surface) 92%, transparent)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border-hairline)",
      }}
    >
      {/* Collapsed summary row — always visible */}
      <div className="flex h-10 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Active surface dot */}
          <Dot color={activeSurfaceBase} />
          {/* Active combo dots */}
          {activeCombo ? (
            <span className="flex items-center">
              <Dot color={activeCombo.primary} />
              <span style={{ marginLeft: -5 }}><Dot color={activeCombo.support} /></span>
              {activeCombo.highlight ? (
                <span style={{ marginLeft: -5 }}><Dot color={activeCombo.highlight} /></span>
              ) : null}
            </span>
          ) : null}
          {!expanded && (
            <span
              className="font-[family-name:var(--font-mono-v2)]"
              style={{ fontSize: 12, color: INK.textTertiary }}
            >
              {SURFACE_PRESETS.find((s) => s.id === surfaceId)?.label} · {activeCombo?.label ?? comboId}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={expanded ? "Ocultar switcher" : "Mostrar switcher"}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="font-[family-name:var(--font-mono-v2)] flex items-center gap-1 px-2 py-1 transition-colors duration-150"
          style={{
            fontSize: 12,
            color: INK.textTertiary,
            borderRadius: RADII.sm,
            // SC 1.4.11: interactive toggle button uses --border-interactive (≥3:1) not --border-hairline.
            border: "1px solid var(--border-interactive)",
            background: "transparent",
          }}
        >
          {expanded ? "Ocultar" : "Mostrar"}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <path
              d="M2 4 L6 8 L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Expandable panel — removed from layout when collapsed so the sticky
          bar shrinks to the summary row only (no translucent band left over) */}
      <div
        style={{
          display: expanded ? "block" : "none",
          paddingBottom: "0.75rem",
        }}
      >
        {/* Surface row */}
        <div className="flex flex-wrap items-center gap-3 pb-2 pt-1">
          <span
            className="font-[family-name:var(--font-mono-v2)] w-14 shrink-0"
            style={{ fontSize: 13, color: INK.textSecondary }}
          >
            Fondo
          </span>
          {SURFACE_PRESETS.map((s) => (
            <PresetPill
              key={s.id}
              active={surfaceId === s.id}
              onClick={() => onSurface(s)}
              swatch={s.base}
            >
              {s.label}
            </PresetPill>
          ))}
        </div>

        {GROUPS.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center gap-3 py-1">
            <span
              className="font-[family-name:var(--font-mono-v2)] w-14 shrink-0"
              style={{ fontSize: 13, color: INK.textSecondary }}
            >
              {g.label}
            </span>
            {COMBOS.filter((preset) => preset.group === g.id).map((preset) => (
              <PresetPill
                key={preset.id}
                active={comboId === preset.id}
                onClick={() => onCombo(preset)}
                swatch={preset.primary}
                swatch2={preset.support}
                swatch3={preset.highlight}
              >
                {preset.label}
              </PresetPill>
            ))}
          </div>
        ))}
        <label
          className="flex items-center gap-2 py-1"
          style={{ fontSize: 13, color: INK.textSecondary }}
        >
          <span className="font-[family-name:var(--font-mono-v2)] w-14 shrink-0">hex</span>
          <input
            type="text"
            value={customHex}
            onChange={(e) => onCustom(e.target.value)}
            placeholder="#C24A2A"
            spellCheck={false}
            className="w-24 px-2 py-1.5 font-[family-name:var(--font-mono-v2)]"
            style={{
              fontSize: 13,
              background: "var(--surface-sunken)",
              border: `1px solid ${comboId === "custom" ? "var(--color-accent)" : "var(--border-hairline)"}`,
              borderRadius: RADII.sm,
              color: INK.textPrimary,
              outlineColor: "var(--color-accent)",
            }}
          />
        </label>
        <p
          className="font-[family-name:var(--font-mono-v2)] pt-1"
          style={{ fontSize: 12, color: INK.textTertiary }}
        >
          primary = acción · support = firma · highlight = optimismo
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.4, color: INK.textTertiary, paddingTop: 4 }}>
          {activeSurfaceRef} · {activeComboRef}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ playground ----------------------------- */

const DEFAULT_SURFACE = SURFACE_PRESETS[2]; // eggshell-air

export function DesignPlayground() {
  const [comboId, setComboId] = useState<string>(COMBOS[0].id);
  // primary = acción (CTA/link/focus); support = firma (badges/strokes/micro-UI);
  // highlight = optimismo (Mark, toast accent, "Recomendado", nudge dot).
  const [primary, setPrimary] = useState<string>(COMBOS[0].primary);
  const [primaryFg, setPrimaryFg] = useState<string>(COMBOS[0].primaryFg);
  const [support, setSupport] = useState<string>(COMBOS[0].support);
  const [supportFg, setSupportFg] = useState<string>(
    COMBOS[0].supportFg ?? COMBOS[0].support,
  );
  // Fallback: when a combo has no highlight, highlight = support.
  const [highlight, setHighlight] = useState<string>(
    COMBOS[0].highlight ?? COMBOS[0].support,
  );
  const [highlightFg, setHighlightFg] = useState<string>(
    COMBOS[0].highlightFg ?? COMBOS[0].supportFg ?? COMBOS[0].support,
  );
  const [customHex, setCustomHex] = useState<string>("");

  // Surface preset state — default eggshell-air.
  const [surface, setSurface] = useState<SurfacePreset>(DEFAULT_SURFACE);

  function handleCombo(preset: ComboPreset) {
    setComboId(preset.id);
    setPrimary(preset.primary);
    setPrimaryFg(preset.primaryFg);
    setSupport(preset.support);
    setSupportFg(preset.supportFg ?? preset.support);
    setHighlight(preset.highlight ?? preset.support);
    setHighlightFg(preset.highlightFg ?? preset.supportFg ?? preset.support);
  }

  // Custom hex sets the primary; support & highlight derive = primary.
  function handleCustom(raw: string) {
    setCustomHex(raw);
    const m = HEX_RE.exec(raw.trim());
    if (m) {
      const hex = `#${m[1]}`;
      setComboId("custom");
      setPrimary(hex);
      setPrimaryFg(accentForeground(hex));
      setSupport(hex);
      setSupportFg(hex);
      setHighlight(hex);
      setHighlightFg(hex);
    }
  }

  const activeComboPreset = COMBOS.find((c) => c.id === comboId);
  const activeComboRef =
    activeComboPreset?.ref ??
    "Combo custom: primary = support = tu hex. Revisa AA del texto del botón antes de adoptarlo";

  return (
    <div
      className="min-h-[100dvh] font-[family-name:var(--font-body-v2)]"
      style={
        {
          background: "var(--surface)",
          color: INK.textPrimary,
          "--surface": surface.base,
          "--surface-raised": surface.raised,
          "--surface-sunken": surface.sunken,
          "--border-hairline": surface.borderHairline,
          "--border-strong": surface.borderStrong,
          // SC 1.4.11: semantic token for interactive boundaries (buttons, pills, toggles).
          "--border-interactive": surface.borderInteractive,
          "--color-accent": primary,
          "--color-accent-fg": primaryFg,
          "--color-support": support,
          "--color-support-fg": supportFg,
          "--color-highlight": highlight,
          "--color-highlight-fg": highlightFg,
        } as React.CSSProperties
      }
    >
      <Switcher
        comboId={comboId}
        surfaceId={surface.id}
        customHex={customHex}
        activeComboRef={activeComboRef}
        activeSurfaceRef={surface.ref}
        activeSurfaceBase={surface.base}
        activeCombo={activeComboPreset}
        onCombo={handleCombo}
        onSurface={setSurface}
        onCustom={handleCustom}
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
        <header className="flex flex-col gap-3">
          <h1
            className="font-[family-name:var(--font-display-v2)] font-bold"
            style={{
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Sistema visual v2
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: INK.textSecondary, maxWidth: "62ch" }}>
            Playground dev-only para decidir el trío de acentos. Fondo fijo en
            eggshell #FCFBF7; tres roles mapeados a los jobs de Tendr (primary =
            acción/confianza · support = firma/calidez · highlight =
            optimismo/nudge) y hairlines en vez de sombras. La apuesta, derivada
            de la ciencia del color: chroma media sofisticada (vivo pero adulto),
            ni tierra apagada ni caramelo.
          </p>
        </header>

        {/* Landing in miniature: nav + hero framed as one preview. The killer
         * demo for "vivid accent + ink" — see how the combo reads as a page. */}
        <section className="flex flex-col gap-6">
          <SectionTitle>Landing en miniatura</SectionTitle>
          <LandingPreview />
        </section>

        {/* Tendr's core emotional moment: the gentle follow-up nudge. Exercises
         * all three roles at once (highlight dot, support meta, primary button). */}
        <section className="flex flex-col gap-6">
          <SectionTitle>Nudge de seguimiento</SectionTitle>
          <FollowUpNudge />
        </section>

        <section className="flex flex-col gap-6">
          <SectionTitle>Paleta</SectionTitle>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Swatch name="surface" value={surface.base} border />
            <Swatch name="surface-raised" value={surface.raised} border />
            <Swatch name="surface-sunken" value={surface.sunken} border />
            <Swatch name="border-hairline" value={surface.borderHairline} />
            <Swatch name="text-primary" value={INK.textPrimary} />
            <Swatch name="primary · acción" value={primary} />
            <Swatch name="support · firma" value={support} />
            <Swatch name="highlight · optimismo" value={highlight} />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionTitle>Escala tipográfica</SectionTitle>
          <div className="flex flex-col gap-5">
            {TYPE_SCALE.map((level) => (
              <div key={level.name} className="flex items-baseline gap-6">
                <span
                  className="font-[family-name:var(--font-mono-v2)] w-24 shrink-0"
                  style={{ fontSize: 13, color: INK.textTertiary }}
                >
                  {level.name}
                </span>
                <span
                  className={
                    level.display
                      ? "font-[family-name:var(--font-display-v2)] font-semibold"
                      : "font-[family-name:var(--font-body-v2)]"
                  }
                  style={{
                    fontSize: level.size,
                    lineHeight: level.lh,
                    letterSpacing: level.ls,
                  }}
                >
                  Organiza tu cartera sin fricción
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionTitle>Botones</SectionTitle>
          <Buttons />
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionTitle>Card limpia</SectionTitle>
            <CleanCard />
          </div>
          <div className="flex flex-col gap-6">
            <SectionTitle>Nota viva</SectionTitle>
            <LivingNote />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <SectionTitle>Anotación hand-drawn</SectionTitle>
          <HandDrawnArrow />
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionTitle>Pricing card</SectionTitle>
            <PricingCard />
          </div>
          <div className="flex flex-col gap-6">
            <SectionTitle>Formulario</SectionTitle>
            <FormRow />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionTitle>Toast</SectionTitle>
            <ToastChip />
          </div>
          <div className="flex flex-col gap-6">
            <SectionTitle>Subrayado a mano</SectionTitle>
            <HandDrawnUnderline />
          </div>
        </section>
      </div>
    </div>
  );
}
