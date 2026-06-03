/**
 * BoardDoodles: tasteful hand-drawn marker "patina" on the testimonials board
 * (B5-fix-3). The brief asked the board to read more like a real whiteboard, with
 * a couple of SMALL doodles that MAKE SENSE for Tendr (a mini-CRM kanban for
 * freelancers). Drawn in the brand's "one pen" hand-drawn grammar — the wisp /
 * signature hue (--color-support), low opacity, round caps, fill:none — the same
 * language as the hand glyph and the hero marks. Strictly decorative patina, not
 * noise: SPARING rule (1–2 doodles max), very low contrast, so the board still
 * reads clean/modern.
 *
 * Two marks (both make sense for the product):
 *   1. A tiny hand-drawn arrow + "¡este!" annotation, top-left, as if a user
 *      circled a favourite testimonial — the human "signing off" on a card.
 *   2. A small tally / checkmark cluster, bottom-right corner — the "done"
 *      ticks of a kanban board (Tendr's pipeline metaphor).
 *
 * Pure presentational SVG, no hooks → can render in any parent. Decorative →
 * aria-hidden. Positioned absolutely by the parent; sits UNDER the notes (low z)
 * so it never competes with the content.
 */

const INK = {
  stroke: "var(--color-support)",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

/** Arrow + "¡este!" annotation (top-left). The fingertip-style scribble that a
 *  user would draw to flag a favourite card. */
export function BoardDoodleArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 90"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      {/* hand-lettered "¡este!" — loose marker script, not a real font */}
      <g {...INK} strokeWidth={2.4} opacity={0.5}>
        {/* ¡ */}
        <path d="M 8 30 q 1 9 0 18" />
        <path d="M 8 53 l 0 2" />
        {/* e */}
        <path d="M 20 42 q 9 -6 11 1 q -6 3 -11 1 q 0 9 9 6" />
        {/* s */}
        <path d="M 44 38 q -8 -2 -8 4 q 0 4 7 4 q 6 1 6 5 q 0 5 -9 3" />
        {/* t */}
        <path d="M 60 30 l 0 24 q 0 4 5 3" />
        <path d="M 54 40 l 12 0" />
        {/* e */}
        <path d="M 74 42 q 9 -6 11 1 q -6 3 -11 1 q 0 9 9 6" />
        {/* ! */}
        <path d="M 96 32 q 1 9 2 17" />
        <path d="M 99 53 l 0 2" />
      </g>
      {/* curved arrow swooping down-right toward a note */}
      <g {...INK} strokeWidth={2.6} opacity={0.46}>
        <path d="M 104 40 q 22 6 24 32" />
        {/* arrowhead */}
        <path d="M 119 66 l 9 6 l 3 -11" />
      </g>
    </svg>
  );
}

/** Tally / checkmark cluster (bottom-right) — the "done" ticks of a kanban. */
export function BoardDoodleTally({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 70"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <g {...INK} strokeWidth={2.6} opacity={0.42}>
        {/* four tally strokes + a diagonal cross-out (the classic 5-count) */}
        <path d="M 12 14 l 2 30" />
        <path d="M 22 13 l 1 31" />
        <path d="M 32 14 l 2 30" />
        <path d="M 42 13 l 1 31" />
        <path d="M 8 40 l 40 -22" />
      </g>
      {/* a small confident checkmark beside the tally */}
      <g {...INK} strokeWidth={2.8} opacity={0.5}>
        <path d="M 58 36 l 8 12 l 18 -28" />
      </g>
    </svg>
  );
}
