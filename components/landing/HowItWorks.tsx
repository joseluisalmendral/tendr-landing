"use client";

/**
 * HowItWorks ("Cómo funciona" → el viaje de un cliente, change
 * como-funciona-client-journey). Three rich, STATIC, product-grade backdrops —
 * the intake form, the pipeline, the closed/paid case — each SELF-CONTAINED. The
 * SAME client ("Estudio Hibö") appears in all three (populated alta row →
 * highlighted "En curso" card → closed "Cobrado" case), so the journey reads as
 * one client across three moments. Continuity is conveyed by the repeated client
 * + the 01/02/03 narrative, NOT by a traveling card. (Faithful to product.md:
 * Tendr has casos with a pipeline of states and markdown notes, NO billing
 * module — stage 3 is a case in the closed/paid state, never an invoice.)
 *
 * PIVOT (design ADR-12): the previous single-traveling-card FLIP (one card
 * re-parenting between distant vertically-stacked slots, advanced by an in-view
 * sentinel stage trigger) was DROPPED after visual verification. The backdrops
 * are tall and far apart, so the stepped trigger advanced while the user was
 * still reading the previous stage (leaving the alta form with an empty slot)
 * and the FLIP happened off-screen. Each backdrop is now independent.
 *
 * Core principle: VISUAL richness ≠ MOTION richness. The backdrops are dense and
 * realistic but STATIC (they live in journey-stages.tsx). The only motion is:
 *   1. A subtle per-backdrop in-view ENTRANCE — each stage block reveals once
 *      with opacity 0→1 + a small y rise (transform/opacity, v2 emphasis easing,
 *      ~0.5s) via `whileInView` (once). Reduced-motion → no reveal (static).
 *      Mobile → degrades gracefully (whileInView is SSR-safe, no hydration
 *      mismatch).
 *   2. Two hand-drawn connector arrows draw in once as the user reaches each
 *      seam (1→2, 2→3), in the v2 support/handdrawn ink language. These are the
 *      ONLY hand-drawn accents in the section (ADR-6 restraint: 1-2 per section).
 *      The v1 cork "placing hand" gag was retired here in the v2 migration — it
 *      was a cork-board flourish that did not fit the clean direction and coupled
 *      this section to CorkHand (removed in B5).
 *
 * Client leaf: renders inside the server Section that owns the <h2> "Cómo
 * funciona" heading, so we do NOT repeat it here. The export name stays
 * `HowItWorks` so the app/page.tsx slot inside `.wow-overlap-section` is
 * byte-unchanged.
 *
 * Fallbacks (mandatory):
 * - prefers-reduced-motion: no reveal (blocks render in their final state), the
 *   connectors render already-drawn. All three stages + their cards are present
 *   and legible.
 * - mobile (<md): static stacked layout via CSS breakpoints (the grid collapses
 *   to a single column; the alternating columns + connectors are md+ only). The
 *   reveal still applies (it degrades fine). No JS media query is needed now that
 *   the desktop-only cork hand was retired.
 */
import { motion, useReducedMotion, type Variants } from "motion/react";

import {
  JOURNEY_STAGES,
  StageFormFaux,
  StagePipelineFaux,
  StageReportFaux,
} from "@/components/landing/journey-stages";

// v2 emphasis easing (--easing-emphasis) for the reveal + connector draw-in.
const EASE_EMPHASIS = [0.2, 0.8, 0.2, 1] as const;
const REVEAL_DURATION = 0.5;

/* ------------------------------------------------------------------------- *
 * Per-backdrop in-view entrance. Reveals once when the stage block scrolls into
 * view: opacity 0→1 + a small y rise. transform/opacity only (GPU), so no
 * reflow (CLS 0 — the backdrop reserves its full box via FauxShell min-h). A
 * light stagger by stage index gives the three blocks a gentle cascade.
 * ------------------------------------------------------------------------- */
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: EASE_EMPHASIS },
  },
};

/* ------------------------------------------------------------------------- *
 * HandDrawnConnector: a curved SUPPORT ink arrow that UNIFIES the three stages,
 * leading the eye from one block to the next (1→2, 2→3). Same hand-drawn ink
 * language as the FeaturesBoard at-risk circle / Pricing annotation: a clean,
 * geometric `motion.path` body plus a two-stroke arrowhead, drawn via
 * `pathLength` (the one allowed non-transform animation, exactly as the at-risk
 * ring and the pricing box). Folk Twins (B2-fix-1): the connector is "progreso",
 * so its stroke is the teal token (var(--color-support-teal)), NOT the wisp
 * handdrawn token — connectors carry journey progress, not a firma annotation.
 *
 * - Draw-in once on `whileInView` (the arrows belong to the scroll narrative,
 *   so they reveal as the user reaches each seam — not all at mount).
 * - prefers-reduced-motion → rendered STATIC, already drawn (pathLength 1,
 *   opacity 1), with no animation, via the `draw` variants gate (Pricing
 *   pattern). The `whileInView` target equals the static state, so nothing
 *   visibly moves.
 * - Decorative → aria-hidden. The journey order is already conveyed by the
 *   01/02/03 narrative, so the arrow carries no semantic load.
 * - CLS 0: the connector occupies a fixed-height row in the flow (h-16/md:h-20),
 *   so reserving its box never reflows the stages. The SVG fills that reserved
 *   box; viewBox + preserveAspectRatio keep the curve stable across widths.
 * - Hidden < md: on the mobile stacked layout the long vertical gaps make a
 *   drawn connector read as clutter, so it only renders at md+ (the stages
 *   still read top-to-bottom). transform/opacity + pathLength only.
 * ------------------------------------------------------------------------- */
function connectorDraw(reduceMotion: boolean): Variants {
  return {
    // Under reduced-motion the hidden state already equals the final drawn
    // state, so whileInView is a no-op and the arrow is static.
    hidden: {
      pathLength: reduceMotion ? 1 : 0,
      opacity: reduceMotion ? 1 : 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: reduceMotion ? 0 : 0.7, ease: EASE_EMPHASIS },
        opacity: { duration: reduceMotion ? 0 : 0.2 },
      },
    },
  };
}

/** `flip` = true mirrors the curve horizontally so consecutive connectors lean
 * opposite ways (1→2 sweeps right-to-left under the right-aligned backdrop,
 * 2→3 left-to-right), echoing the zig-zag of the alternating stage columns.
 * `hueClass` carries the sequence-alternation color (B3-fix-1): the 2 sibling
 * connectors alternate teal→wisp by seam index so the same hue never repeats
 * adjacently. Wisp here is the firma matiz reused for the second connector; it
 * does not crowd a hand-drawn neighbor because the connectors ARE the only
 * hand-drawn marks in this section. */
function HandDrawnConnector({
  reduceMotion,
  flip,
  hueClass,
}: {
  reduceMotion: boolean;
  flip: boolean;
  hueClass: string;
}) {
  const draw = connectorDraw(reduceMotion);
  return (
    <motion.svg
      aria-hidden="true"
      // Folk Twins (B2-fix-1): los conectores del viaje son "progreso", no firma.
      // B3-fix-1: rol de bloque = progreso (teal), pero por ser un RUN de 2
      // hermanos decorativos idénticos alternan teal→wisp por índice de costura
      // (sin repetir matiz adyacente). El hue concreto llega vía hueClass.
      className={
        "pointer-events-none mx-auto hidden h-16 w-40 md:block md:h-20 " +
        hueClass +
        " " +
        (flip ? "-scale-x-100" : "")
      }
      viewBox="0 0 120 80"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {/* Curved organic body that swooshes right and then drops STRAIGHT DOWN
          into the next stage. The terminal point (70,64) is the arrow tip; the
          last control point sits directly above it (70,46) so the end tangent is
          exactly vertical (0,18) — the shaft enters the arrowhead head-on. */}
      <motion.path
        d="M36 12 C 78 22, 70 46, 70 64"
        stroke="currentColor"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
      />
      {/* Arrowhead: a symmetric chevron at the tip (70,64) pointing DOWN. Because
          the body arrives vertically, the shaft bisects the head and the two
          EQUAL barbs (len 15) splay at ±32° from straight-up — both clearly
          visible, neither parallel to the shaft, so it reads as a real arrowhead
          (not a checkmark): (70,64) → (62,51.3) and (70,64) → (78,51.3). */}
      <motion.path
        d="M70 64 L 62 51.3 M70 64 L 78 51.3"
        stroke="currentColor"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
      />
    </motion.svg>
  );
}

/* Each backdrop is self-contained (renders its own Estudio Hibö card). */
const STAGE_COMPONENTS = [StageFormFaux, StagePipelineFaux, StageReportFaux] as const;

/* Sequence alternation (B3-fix-1). The 01/02/03 numerals are a RUN of 3 identical
 * decorative siblings, so they alternate teal→wisp→cobalt by index (text grade)
 * so the same hue never repeats adjacently. Progreso stays the block role; the
 * alternation only rotates which support matiz paints each numeral in the run. */
const NUMERAL_HUE_CLASSES = [
  "text-support-teal-fg",
  "text-support-fg",
  "text-support-cobalt-fg",
] as const;
/* The 2 journey connectors alternate teal→wisp (text-color drives currentColor). */
const CONNECTOR_HUE_CLASSES = ["text-support-teal", "text-support"] as const;

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  const lastIndex = JOURNEY_STAGES.length - 1;

  return (
    <ol className="flex flex-col gap-12 md:gap-20">
      {JOURNEY_STAGES.map((s, index) => {
        const Backdrop = STAGE_COMPONENTS[index];

        return (
          <motion.li
            key={s.n}
            className="flex flex-col gap-4"
            // Subtle in-view entrance. Under reduced-motion we skip the initial
            // hidden state entirely so the block renders static in place.
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={revealVariants}
            transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
          >
            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-12 md:gap-8">
              {/* Narrative column with the small editorial mono number. */}
              <div
                className={
                  index % 2 === 1
                    ? "flex flex-col gap-3 md:order-2 md:col-span-5 md:pl-2"
                    : "flex flex-col gap-3 md:col-span-5"
                }
              >
                {/* Numeral 01/02/03 = "progreso" (Folk Twins). B3-fix-1: run de 3
                    hermanos → alterna teal→wisp→cobalt por índice (sin matiz
                    adyacente repetido). */}
                <span
                  aria-hidden="true"
                  className={
                    "font-mono text-meta uppercase " +
                    NUMERAL_HUE_CLASSES[index % NUMERAL_HUE_CLASSES.length]
                  }
                >
                  {s.n}
                </span>
                <h3 className="font-heading text-h2 text-text-primary">
                  {s.title}
                </h3>
                <p className="max-w-[46ch] text-body-lg text-text-secondary">
                  {s.body}
                </p>
              </div>

              {/* Backdrop column. */}
              <div
                className={
                  index % 2 === 1
                    ? "md:order-1 md:col-span-7"
                    : "md:col-span-7"
                }
              >
                {/* Each backdrop is always active (full opacity) now that there
                    is no stage focus to dim toward. */}
                <Backdrop active />
              </div>
            </div>

            {/* "Progreso" connector leading to the next stage (1→2, 2→3). Kept inside
                the <li> (valid list markup, decorative aria-hidden), placed
                below the grid so it sits in the seam between this block and the
                next. Its reserved fixed-height box means it never reflows the
                stages (CLS 0). Alternate the curve direction per seam to echo
                the zig-zag of the alternating columns. B3-fix-1: the 2 connectors
                also alternate hue teal→wisp by seam index. Omitted after the last
                stage (nothing to connect to). */}
            {index !== lastIndex ? (
              <HandDrawnConnector
                reduceMotion={!!reduceMotion}
                flip={index % 2 === 1}
                hueClass={CONNECTOR_HUE_CLASSES[index % CONNECTOR_HUE_CLASSES.length]}
              />
            ) : null}
          </motion.li>
        );
      })}
    </ol>
  );
}
