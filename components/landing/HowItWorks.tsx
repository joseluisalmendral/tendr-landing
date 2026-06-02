"use client";

/**
 * HowItWorks ("Cómo funciona" → el viaje de un cliente, change
 * como-funciona-client-journey). Three rich, STATIC, product-grade backdrops —
 * the intake form, the pipeline, the invoice — each SELF-CONTAINED. The SAME
 * client ("Estudio Hibö") appears in all three (populated alta row → highlighted
 * "En curso" card → invoice header), so the journey reads as one client across
 * three moments. Continuity is conveyed by the repeated client + the 01/02/03
 * narrative, NOT by a traveling card.
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

  return (
    <ol className="flex flex-col gap-6 md:gap-8">
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
                <h3 className="font-heading text-h3 text-text-primary">
                  {s.title}
                </h3>
                <p className="max-w-[46ch] text-body text-text-secondary">
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
          </motion.li>
        );
      })}
    </ol>
  );
}
