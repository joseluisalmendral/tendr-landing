"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * BoardHand: the placing hand RETURNS to the testimonials board (B5-fix-1).
 *
 * The user liked the hand that placed notes (the retired CorkHand / journey
 * PlacingHand) and asked for it back — but restyled to the v2 illustration
 * language, NOT the old cartoon/cork clay fist. So this is a CLEAN LINE-ART hand
 * in the same "one pen" grammar as the hero glyphs (HeroTriptych GLYPH_STROKE):
 * --color-text-primary ink stroke, round caps + joins, fill:none, slight tilt
 * and a touch of imperfection. A small wisp "press" mark accents the fingertip.
 *
 * CHOREOGRAPHY (once per board entrance, whileInView):
 *   The hand drifts in from the lower-right, dips so the index fingertip PRESSES
 *   the tape strip of the opening note (the press beat = the moment the tape
 *   settles, a quick down→up dip), then lifts and exits up-right and fades. It
 *   runs ONCE (viewport.once) — it never loops (motion budget).
 *
 * REDUCED MOTION: the hand is omitted entirely (returns null). It is purely
 * decorative narration of the placement; a static resting hand would just be
 * clutter on the board. Decorative → aria-hidden.
 *
 * Pure leaf client component: owns only its own entrance timeline. The parent
 * positions it (absolute) over the first note's tape so the fingertip lands on
 * the strip. No scroll coupling — the dip is a self-contained time-based beat
 * that plays when the board scrolls into view.
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

export function BoardHand({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  // Reduced motion: omit the hand entirely (decorative placement narration).
  if (reduce) return null;

  return (
    <motion.span
      aria-hidden
      className={className}
      style={{ display: "block", willChange: "transform, opacity", transformOrigin: "top center" }}
      // Drift in from lower-right, then a quick PRESS dip (down→settle), then
      // lift + exit up-right and fade. Once per board entrance.
      initial={{ opacity: 0, x: 64, y: 56, rotate: 8 }}
      whileInView={{
        opacity: [0, 1, 1, 1, 0],
        x: [64, 6, 0, 2, 40],
        y: [56, 10, 0, -6, -54],
        rotate: [8, -2, -5, -3, 4],
      }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        duration: 1.9,
        // keyframe timing: glide-in (0→0.42), settle to press (→0.55),
        // PRESS dip held a beat (→0.68), lift + exit (→1).
        times: [0, 0.42, 0.55, 0.68, 1],
        ease: [0.16, 1, 0.3, 1],
        delay: 0.18,
      }}
    >
      <HandGlyph />
    </motion.span>
  );
}
