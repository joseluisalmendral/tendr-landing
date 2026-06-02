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
 *      with opacity 0→1 + a small y rise (transform/opacity, EASE_OUT, ~0.5s)
 *      via `whileInView` (once). Reduced-motion → no reveal (static). Mobile →
 *      degrades gracefully (whileInView is SSR-safe, no hydration mismatch).
 *   2. Hand once — the shared CorkHand places/nudges the now-populated alta
 *      client card a single time on in-view, then leaves (transform/opacity,
 *      HeroPipeline imperative pattern). Gated OFF under reduced-motion / mobile.
 *
 * Client leaf: renders inside the server Section that owns the <h2> "Cómo
 * funciona" heading, so we do NOT repeat it here. The export name stays
 * `HowItWorks` so the app/page.tsx slot inside `.wow-overlap-section` is
 * byte-unchanged.
 *
 * Fallbacks (mandatory):
 * - prefers-reduced-motion: no reveal (blocks render in their final state), no
 *   hand. All three stages + their cards are present and legible.
 * - mobile (<md): static stacked layout, SSR-safe via useSyncExternalStore
 *   (server snapshot false → mobile is the deterministic first paint, no
 *   hydration mismatch). No hand. The reveal still applies (it degrades fine).
 */
import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { CorkHand } from "@/components/landing/CorkHand";
import {
  JOURNEY_STAGES,
  StageFormFaux,
  StagePipelineFaux,
  StageReportFaux,
} from "@/components/landing/journey-stages";

// --ease-out for the reveal + the hand.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const REVEAL_DURATION = 0.5;
const MD_QUERY = "(min-width: 768px)";

/** SSR-safe media-query subscription (verbatim from TestimonialsCork:130-139).
 * Server snapshot is `false`, so mobile/static is the deterministic first
 * paint → no hydration mismatch. Duplicated inline to avoid touching cork;
 * promotion to a shared hook is out of scope for this change. */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// Run before paint on the client, fall back to useEffect during SSR (HeroPipeline
// pattern) so the hand never flashes its final state for one frame.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
    transition: { duration: REVEAL_DURATION, ease: EASE_OUT },
  },
};

/* ------------------------------------------------------------------------- *
 * Hand-once choreography (ADR-8). CorkHand wrapped in a motion.div (animate the
 * WRAPPER, not the SVG — vercel rendering-animate-svg-wrapper), absolutely
 * positioned bottom-right of the alta backdrop, pointer-events-none, aria-hidden.
 * Plays ONCE on mount via imperative controls (HeroPipeline pattern): enter from
 * bottom-right → small nudge toward the populated client card → lift + fade out.
 * Only mounted when isDesktop && !reduceMotion, so it never runs under
 * reduced-motion or on mobile, and it animates over a card that is actually there.
 * ------------------------------------------------------------------------- */
const handVariants: Variants = {
  hidden: { opacity: 0, x: 48, y: 56, rotate: 8 },
  enter: {
    opacity: 1,
    x: 12,
    y: 12,
    rotate: -2,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
  nudge: {
    y: 0,
    transition: { duration: 0.22, ease: EASE_OUT },
  },
  leave: {
    opacity: 0,
    x: 40,
    y: 60,
    rotate: 8,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

/* ------------------------------------------------------------------------- *
 * HandDrawnConnector: a curved CLAY ink arrow that UNIFIES the three stages,
 * leading the eye from one block to the next (1→2, 2→3). Same hand-drawn ink
 * language as the cork hand and the FeaturesBoard at-risk circle / Pricing
 * annotation: an organic, slightly wobbly `motion.path` body plus a two-stroke
 * arrowhead, drawn via `pathLength` (the one allowed non-transform animation,
 * exactly as the at-risk ring and the pricing box). Stroke is the clay token
 * (var(--color-accent-secondary)).
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
        pathLength: { duration: reduceMotion ? 0 : 0.7, ease: EASE_OUT },
        opacity: { duration: reduceMotion ? 0 : 0.2 },
      },
    },
  };
}

/** `flip` = true mirrors the curve horizontally so consecutive connectors lean
 * opposite ways (1→2 sweeps right-to-left under the right-aligned backdrop,
 * 2→3 left-to-right), echoing the zig-zag of the alternating stage columns. */
function HandDrawnConnector({
  reduceMotion,
  flip,
}: {
  reduceMotion: boolean;
  flip: boolean;
}) {
  const draw = connectorDraw(reduceMotion);
  return (
    <motion.svg
      aria-hidden="true"
      className={
        "pointer-events-none mx-auto hidden h-16 w-40 text-accent-secondary md:block md:h-20 " +
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
        strokeWidth={3.8}
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
        strokeWidth={3.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
      />
    </motion.svg>
  );
}

function PlacingHand() {
  const controls = useAnimationControls();

  useIsoLayoutEffect(() => {
    // Single play-once sequence; the parent only mounts this on
    // desktop && !reduced-motion, so no extra gate is needed here.
    let cancelled = false;
    async function play() {
      controls.set("hidden");
      await controls.start("enter");
      if (cancelled) return;
      await controls.start("nudge");
      if (cancelled) return;
      await controls.start("leave");
    }
    void play();
    return () => {
      cancelled = true;
    };
    // `controls` is stable.
  }, [controls]);

  return (
    <motion.div
      aria-hidden="true"
      initial="hidden"
      animate={controls}
      variants={handVariants}
      className="pointer-events-none absolute -bottom-2 right-2 z-20 h-28 w-28"
    >
      <CorkHand />
    </motion.div>
  );
}

/* Each backdrop is self-contained (renders its own Estudio Hibö card). */
const STAGE_COMPONENTS = [StageFormFaux, StagePipelineFaux, StageReportFaux] as const;

export function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery(MD_QUERY);

  // The hand only places the alta card on desktop with motion allowed.
  const handOn = isDesktop && !reduceMotion;

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
                <span
                  aria-hidden="true"
                  className="font-mono text-meta uppercase text-accent-secondary"
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

              {/* Backdrop column. relative so the hand can be absolutely placed
                  inside the alta backdrop only. */}
              <div
                className={
                  index % 2 === 1
                    ? "relative md:order-1 md:col-span-7"
                    : "relative md:col-span-7"
                }
              >
                {/* Each backdrop is always active (full opacity) now that there
                    is no stage focus to dim toward. */}
                <Backdrop active />
                {/* Hand once, alta only, desktop + motion only. */}
                {handOn && index === 0 ? <PlacingHand /> : null}
              </div>
            </div>

            {/* Clay connector leading to the next stage (1→2, 2→3). Kept inside
                the <li> (valid list markup, decorative aria-hidden), placed
                below the grid so it sits in the seam between this block and the
                next. Its reserved fixed-height box means it never reflows the
                stages (CLS 0). Alternate the curve direction per seam to echo
                the zig-zag of the alternating columns. Omitted after the last
                stage (nothing to connect to). */}
            {index !== lastIndex ? (
              <HandDrawnConnector
                reduceMotion={!!reduceMotion}
                flip={index % 2 === 1}
              />
            ) : null}
          </motion.li>
        );
      })}
    </ol>
  );
}
