"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from "motion/react";
import type { Icon } from "@phosphor-icons/react";
import {
  ChatCircle,
  FileText,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";

/**
 * HeroPipeline: the hero's right-column faux-UI micro-demo (change
 * hero-chaos-to-order). Four paper-note client cards that, on desktop load,
 * animate from a deterministic scatter into a clean ordered pipeline (~1.4s,
 * ~300ms post-LCP delay) — the "organiza tu caos de clientes" promise told as a
 * one-shot entrance. NOT scroll-driven: it resolves before any realistic first
 * scroll so it never competes with the cork's single cinematic scroll beat.
 *
 * Isolated client leaf (design ADR-001): the only interactive code in the hero
 * right column. Cards render at their ordered slots at SSR; the scatter is a
 * transform delta applied on mount, so SSR and client DOM match (no hydration
 * mismatch, no suppressHydrationWarning). On mobile (<md) or under
 * prefers-reduced-motion the cards mount straight to the ordered final state.
 *
 * After the entrance settles the pipeline stays subtly ALIVE — still NOT
 * scroll-driven (the cork keeps the only scroll beat). Two additions, both
 * transform/opacity only (GPU, CLS 0):
 *   1. Ambient micro-loop (catalog "loop ambient", §6.10): each card gently
 *      floats on an infinite, DESYNCED y-oscillation (+ a hair of rotate) so the
 *      four never bob in unison. Lives on a SEPARATE middle motion.div so the
 *      ambient `y` never fights the entrance `y` on a single element — the two
 *      transforms compose cleanly. Gated by the `ambient` flag, computed in the
 *      same iso layout effect as the entrance (desktop && !reduced-motion).
 *      Mobile / reduced-motion → ambient OFF (middle mounts static, no loop).
 *   2. Hover lift (desktop, on-demand): `whileHover` on its OWN innermost
 *      motion.div — a node with NO animate/initial/variants/controls, so its base
 *      is the identity transform and Framer reverts BOTH scale AND y to 0 on
 *      mouse-leave. (Placing it on the entrance div made y stick at -6 on unhover,
 *      because that node's base y is owned by imperative controls.) Reads as
 *      "interactive". No hover on touch (automatic); harmless under
 *      reduced-motion (user-initiated).
 */

type StageKey = "Contacto" | "Propuesta" | "Activo";

type PipelineCard = {
  id: string;
  client: string;
  stage: StageKey;
  Icon: Icon;
  order: number;
};

// Stage -> Phosphor icon (SSR entry) map, kept inline at the data level so the
// 4-card array is the single source of truth.
const PIPELINE_CARDS: PipelineCard[] = [
  { id: "ana", client: "Ana Ruiz", stage: "Contacto", Icon: ChatCircle, order: 0 }, // mock
  { id: "marco", client: "Marco Vidal", stage: "Propuesta", Icon: FileText, order: 1 }, // mock
  { id: "lucia", client: "Lucía Fernández", stage: "Activo", Icon: CheckCircle, order: 2 }, // mock
  { id: "diego", client: "Diego Sá", stage: "Propuesta", Icon: FileText, order: 3 }, // mock
];

const MD_QUERY = "(min-width: 768px)";

const EASE_EXPO = [0.19, 1, 0.22, 1] as const; // --ease-expo (settle, wow beat)
const EASE_SNAP = [0.34, 1.56, 0.64, 1] as const; // --ease-bounce (rotate snap only)

/**
 * Ambient micro-loop params per card (catalog "loop ambient", §6.10). DESYNC is
 * the whole point: distinct amplitude + duration + delay so the four cards never
 * oscillate in unison (unison reads mechanical). A whisper — premium, barely
 * there. y in px, dur in s, a hair of rotate in deg, easeInOut, mirror loop.
 */
const AMBIENT_PARAMS = [
  { y: 5, rotate: 0.3, duration: 3.6, delay: 0.0 },
  { y: 6.5, rotate: 0.4, duration: 4.1, delay: 0.5 },
  { y: 4.5, rotate: 0.25, duration: 3.3, delay: 0.9 },
  { y: 5.5, rotate: 0.35, duration: 3.9, delay: 0.3 },
] as const;

// Per-card infinite float. `custom` carries the index so the desync params are
// resolved inside the variant. transform ONLY (GPU, CLS-safe). repeatType
// "mirror" ping-pongs 0 -> -y -> 0 forever; rotate breathes around the inner
// element's own 0 (the resting paper tilt lives on the OUTER entrance div, so
// these never collide). The inner element is purely additive: when ambient is
// OFF it mounts with no animate prop and contributes an identity transform.
const ambientVariants: Variants = {
  float: (i: number) => {
    const p = AMBIENT_PARAMS[i];
    return {
      y: [0, -p.y, 0],
      rotate: [0, p.rotate, 0],
      transition: {
        duration: p.duration,
        delay: p.delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      },
    };
  },
};

// Hover lift on a DEDICATED innermost motion.div (desktop, on-demand). Small
// scale + slight y lift, quick settle. transform-only — no layout/shadow-class
// swap that would jank. The node carrying this has NO animate/initial/variants/
// controls, so its base is the identity transform: whileHover overrides it while
// hovered and Framer reverts BOTH scale AND y on exit. (On the entrance node the
// base y is owned by imperative controls, so y stuck at -6 on unhover — bug fixed
// by isolating hover here.) No hover fires on touch devices.
const HOVER_LIFT = { scale: 1.03, y: -6 } as const;
const HOVER_TRANSITION = { duration: 0.18, ease: "easeOut" } as const;

/**
 * Deterministic index-seeded scatter (design ADR-005). NO Math.random / Date.now
 * at render time — SSR and client compute the identical transform delta. The
 * delta is applied on top of the card's ordered absolute slot, so layout never
 * changes (transform/opacity only, CLS 0).
 */
function scatterFor(i: number): { x: number; y: number; rotate: number } {
  const xs = [-60, 48, -36, 56];
  const ys = [-40, 36, 44, -28];
  const rots = [-12, 9, -7, 12];
  return { x: xs[i], y: ys[i], rotate: rots[i] };
}

/** Resting tilt per card, mirroring the .tw-note paper-note character (±1.5deg). */
function restTiltFor(i: number): number {
  const tilts = [-1.5, 1, -1, 1.5];
  return tilts[i];
}

// Run before paint on the client, fall back to useEffect during SSR so React
// never warns. We need the pre-paint slot to set the "hidden" scatter state
// BEFORE the browser paints — otherwise the cards flash at their final ordered
// position for one frame before the entrance plays.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Orchestration only — the container never paints, it only sequences children.
// delayChildren 0.3 = ~300ms post-LCP safety; staggerChildren 0.1 = 100ms beat.
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

// Per-card scatter -> ordered. `custom` carries the index so the pure scatter
// fn runs inside the variant. transform + opacity ONLY (GPU, CLS-safe). The
// optional snap easing is restricted to rotate so cards never overshoot their
// position near the LCP window.
const cardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: scatterFor(i).x,
    y: scatterFor(i).y,
    rotate: scatterFor(i).rotate,
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: restTiltFor(i),
    transition: {
      duration: 0.56,
      ease: EASE_EXPO,
      rotate: { duration: 0.56, ease: EASE_SNAP },
    },
  }),
};

// Ordered slot positions inside the fixed-aspect container. Percentages keep
// the layout responsive within the reserved aspect-[4/3] box; the scatter is a
// transform delta on top, never a layout change.
const SLOTS = [
  { top: "6%", left: "8%" },
  { top: "30%", left: "34%" },
  { top: "54%", left: "12%" },
  { top: "70%", left: "40%" },
] as const;

/**
 * Presentational card (paper note). THREE motion layers by design (see file
 * docstring), so no single element ever animates `y` from two competing sources
 * — the previous two-layer build let the hover lift stick at y:-6 on mouse-leave
 * because `whileHover` sat on the same OUTER node whose base `y` is owned by the
 * imperative entrance `controls`; Framer cannot revert a gesture property whose
 * base is governed by imperative controls rather than a static value/variant, so
 * `y` never returned to 0 (scale did, because its base was the identity default).
 *
 *   OUTER motion.div — the ENTRANCE ONLY: inherits the hidden/visible
 *   scatter→order variants from the orchestrating container (never declares its
 *   own initial/animate). The resting paper tilt (restTiltFor) lives here on
 *   rotate, and the absolute positioning + slot offset are applied here.
 *
 *   MIDDLE motion.div — the AMBIENT float ONLY: its own infinite y(+rotate) loop,
 *   gated by `ambient`. When ambient is OFF (mobile / reduced-motion / SSR) it
 *   mounts with `animate={false}` and contributes an identity transform.
 *
 *   INNER motion.div — the HOVER lift ONLY: `whileHover` + `transition`, with NO
 *   `animate`/`initial`/`variants`/`controls`. Its base is therefore the identity
 *   transform, so Framer reverts BOTH `scale` AND `y` cleanly to 0 on mouse-leave
 *   (this is the fix). It carries the paper-note content. No hover fires on touch;
 *   harmless under reduced-motion (user-initiated).
 *
 * The three transforms compose into one CSS transform per frame; because each
 * layer owns a distinct animation source, none of them fight over `y`.
 *
 * Animate the wrapper divs, never the Phosphor <svg>.
 */
function PipelineCardView({
  card,
  ambient,
}: {
  card: PipelineCard;
  ambient: boolean;
}) {
  const slot = SLOTS[card.order];
  return (
    <motion.div
      custom={card.order}
      variants={cardVariants}
      style={{ top: slot.top, left: slot.left }}
      className="absolute w-[52%]"
    >
      <motion.div
        custom={card.order}
        variants={ambientVariants}
        animate={ambient ? "float" : false}
      >
        <motion.div
          whileHover={HOVER_LIFT}
          transition={HOVER_TRANSITION}
          className="flex items-center gap-3 rounded-md border border-border-strong bg-surface-raised px-4 py-3 shadow-flat"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border-strong bg-surface-sunken">
            <card.Icon weight="duotone" className="h-5 w-5 text-text-primary" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-body text-text-primary">{card.client}</span>
            <span className="font-mono text-meta uppercase text-text-tertiary">
              {card.stage}
            </span>
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * HeroPipeline container. Reserves the layout slot with a fixed aspect-[4/3]
 * (matches the prior 640x480 image → CLS 0) and renders the 4 cards at their
 * ordered absolute slots.
 *
 * The entrance is driven IMPERATIVELY rather than via `initial`. Background:
 * with `useSyncExternalStore` the SSR snapshot (desktop=false) is reused on the
 * hydration render too, so an `initial`-gated approach would mount the div at
 * its final "visible" state and Framer — which reads `initial` only at mount —
 * would never replay the scatter once the store later flipped to desktop=true.
 * Result was a fully static hero on desktop.
 *
 * Instead the container mounts with `initial={false}` (no SSR-driven start) and
 * we set the start state after mount, once the REAL viewport is known, in an
 * isomorphic layout effect (before paint → no flash of the final state):
 *   - desktop && !reduced-motion → set("hidden") then start("visible") (plays)
 *   - otherwise (mobile / reduced-motion / no-JS / SSR) → set("visible")
 *     (jump straight to the ordered final state, no motion)
 * Children inherit the variant via the container's controls + variant label
 * propagation; their per-card `custom` index is resolved at start time.
 */
export function HeroPipeline() {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  // Ambient micro-loop gate. Starts OFF so SSR / no-JS / first paint stay static
  // (final ordered state). Flipped on only for the same desktop && !reduce branch
  // that plays the entrance, in the same iso layout effect.
  const [ambient, setAmbient] = useState(false);

  useIsoLayoutEffect(() => {
    const isDesktop =
      typeof window !== "undefined" && window.matchMedia(MD_QUERY).matches;

    if (isDesktop && !reduce) {
      // Pin to the scattered start before paint, then play scatter→order.
      controls.set("hidden");
      void controls.start("visible");
      // Desktop + motion allowed → the cards may breathe once settled.
      setAmbient(true);
    } else {
      // Mobile / reduced-motion: land directly on the ordered final state, and
      // keep the ambient loop OFF (cards mount perfectly still).
      controls.set("visible");
      setAmbient(false);
    }
    // `controls` is stable; `reduce` is the only meaningful dependency.
  }, [controls, reduce]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border-strong bg-surface-raised shadow-soft">
      <motion.div
        className="absolute inset-0"
        variants={containerVariants}
        initial={false}
        animate={controls}
      >
        {PIPELINE_CARDS.map((card) => (
          <PipelineCardView key={card.id} card={card} ambient={ambient} />
        ))}
      </motion.div>
    </div>
  );
}
