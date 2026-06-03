"use client";

import { motion, type MotionValue } from "motion/react";

/**
 * BoardHand: the placing hand on the testimonials board.
 *
 * VISUAL (kept from B5-fix-1): a CLEAN LINE-ART hand in the same "one pen"
 * grammar as the hero glyphs (HeroTriptych GLYPH_STROKE) — --color-text-primary
 * ink stroke, round caps + joins, fill:none, slight tilt — NOT the old cartoon /
 * cork clay fist. A small wisp "press" mark accents the fingertip. The glyph is
 * drawn with the fingertip at TOP CENTRE (the press point + transform origin).
 *
 * CHOREOGRAPHY (B5-fix-3 — full CARRY + PLACE, restored from the ORIGINAL board):
 *   The hand does not just press a pre-placed note — it CARRIES the first note in.
 *   The hand sweeps DOWN from above the frame on the same descent curve as the
 *   note ([tIn, hArrive], "-86vh"→"0vh"), so the note travels WITH the hand into
 *   its empty slot; the tape press seals it; the hand exits downward + fades,
 *   leaving the note placed. The note's carry transform lives in the parent
 *   (cardCarryY/Opacity/Rotate); this glyph just shares the same y/scale/rotate
 *   curve so the two read as one gesture. See TestimonialsCork.
 *
 * PRIOR (B5-fix-2 — restored to the ORIGINAL CorkHand timing):
 *   The old cork board drove the hand with the SAME scrollYProgress as the board
 *   zoom/pan, during a dedicated hand phase [tIn, tHand] that ran AFTER the board
 *   finished zooming in and BEFORE the lateral pan. The hand swept DOWN from above
 *   the frame, dipped to press the first note, then continued down and out of
 *   frame, fading. B5-fix-1 had replaced that with a self-contained whileInView
 *   beat that fired the instant the board entered view ("salta muy pronto").
 *   This version is scroll-LINKED again: the parent (TestimonialsCork) computes
 *   the hand's y / scale / rotate / opacity from scrollYProgress over [tIn, tHand]
 *   and passes them in as MotionValues. So the hand only appears once the board
 *   has zoomed in, and the press is scrubbed by the user's scroll exactly like the
 *   original — just rendered with the subtle line-art hand instead of the clay
 *   fist.
 *
 * REDUCED MOTION: the parent omits this component entirely (it never mounts the
 * hand on the static / reduced-motion path), so there is no resting-hand clutter.
 * Decorative → aria-hidden.
 *
 * Pure presentational client leaf: it owns no timeline of its own; all motion is
 * driven by the MotionValues the parent supplies. The parent positions the
 * wrapper (absolute) over the first note's tape so the fingertip lands on it.
 */

// Same "one pen" stroke as the hero glyphs (HeroTriptych GLYPH_STROKE), a hair
// thicker so the hand reads at board scale (brief: ~2–2.5).
const HAND_STROKE = {
  stroke: "var(--color-text-primary)",
  strokeWidth: 2.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

/** The line-art hand glyph (fingertip at top centre = the press point). */
function HandGlyph() {
  return (
    <svg
      viewBox="0 0 120 150"
      className="h-full w-full"
      aria-hidden="true"
      role="presentation"
    >
      <g transform="rotate(-7 60 75)" {...HAND_STROKE}>
        {/* index finger pressing down — fingertip at top centre (the press point) */}
        <path d="M 58 8 C 56 26, 55 44, 56 60" />
        {/* middle / ring / little curled knuckles (peek as soft humps) */}
        <path d="M 56 60 q 10 -3 19 1" />
        <path d="M 75 61 q 7 6 6 16" />
        <path d="M 81 77 q 1 9 -3 17" />
        {/* curled fingers as stacked humps along the top of the fist */}
        <path d="M 56 62 q -2 -10 -12 -11 q -9 0 -10 10" />
        <path d="M 34 61 q -2 -9 -11 -9 q -8 1 -8 10" />
        {/* back of the hand / fist outline */}
        <path d="M 15 62 C 13 84, 18 104, 34 116 C 50 128, 74 126, 86 112 C 92 104, 84 92, 81 94" />
        {/* thumb (left, angled) */}
        <path d="M 16 72 C 6 78, 3 92, 10 100" />
        {/* wrist / cuff */}
        <path d="M 38 118 C 36 128, 40 138, 52 142 C 66 146, 80 142, 84 130" />
        {/* knuckle dimple line on the fist */}
        <path
          d="M 30 80 q 26 -7 50 1"
          strokeWidth={1.7}
          opacity={0.45}
        />
      </g>
      {/* tiny wisp "press" accent at the fingertip (same hand-drawn signature
          hue the hero glyphs use for small marks) */}
      <path
        d="M 50 6 q 4 -3 8 -1   M 64 4 q 4 -2 7 1"
        stroke="var(--color-support)"
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
    </svg>
  );
}

/**
 * Scroll-driven hand. The parent computes these MotionValues from scrollYProgress
 * over the hand phase [tIn, tHand] and passes them in; this component is purely
 * the rendered glyph wired to those values (original CorkHand model).
 */
export function BoardHand({
  className,
  y,
  scale,
  rotate,
  opacity,
}: {
  className?: string;
  y: MotionValue<string>;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.span
      aria-hidden
      className={className}
      style={{
        display: "block",
        y,
        scale,
        rotate,
        opacity,
        transformOrigin: "top center",
        willChange: "transform, opacity",
      }}
    >
      <HandGlyph />
    </motion.span>
  );
}
