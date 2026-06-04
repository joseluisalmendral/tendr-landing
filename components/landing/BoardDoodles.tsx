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

/* Marker INK in the hand-drawn "one pen" grammar, but readable as deliberate
   marker text (B5-fix-final item 2). Slightly darker/heavier than the patina INK
   so the column HEADERS read as legible labels (they aid comprehension — the board
   IS Tendr's kanban), while still clearly hand-drawn, same round caps + stroke. */
const MARKER = {
  stroke: "var(--color-text-primary)",
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

/**
 * Kanban column HEADERS (B5-fix-final item 2). The board IS Tendr's client
 * follow-up kanban; these hand-written headers across the top make that legible
 * ("se entienda mejor"). Names are the canonical pipeline states (journey-stages:
 * Contacto → Propuesta → En curso → Cerrado); we surface the three most legible
 * end-to-end stages for a freelancer at a glance: Contacto · En curso · Cerrado.
 *
 * Rendered as REAL text (font-mono, far more legible than hand-lettered paths,
 * anti-kitsch) with a marker treatment: ink at 65% opacity — the AA floor for
 * 12px text on the near-white surface (0.58/0.60 measured 4.22/4.48:1 in axe,
 * under the 4.5:1 bar; aria-hidden does NOT exempt visible text from
 * contrast) — a slight per-header
 * rotation, and ONE hand-drawn underline (SVG, same round-cap "one pen" stroke)
 * under "En curso" — the column the protagonist note sits in. Decorative wrapper,
 * but the words themselves aid comprehension, so they stay visible on the static /
 * reduced-motion path too. aria-hidden: the section already has its real h2 +
 * per-note labels; these are visual scaffolding.
 */
export function BoardKanbanHeaders({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <span
        className="font-mono text-meta uppercase tracking-[0.18em] text-text-primary"
        style={{ opacity: 0.65, transform: "rotate(-2.5deg)" }}
      >
        Contacto
      </span>
      <span className="relative inline-flex flex-col items-center">
        <span
          className="font-mono text-meta uppercase tracking-[0.18em] text-text-primary"
          style={{ opacity: 0.65, transform: "rotate(1.5deg)" }}
        >
          En curso
        </span>
        {/* hand-drawn underline (same one-pen marker stroke) under the active
            column — the one the protagonist note lives in. */}
        <svg
          viewBox="0 0 80 10"
          className="mt-0.5 h-2 w-16"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M 3 5 q 20 -4 38 -1 q 18 3 36 -2"
            {...MARKER}
            strokeWidth={2}
            opacity={0.5}
          />
        </svg>
      </span>
      <span
        className="font-mono text-meta uppercase tracking-[0.18em] text-text-primary"
        style={{ opacity: 0.65, transform: "rotate(-1.5deg)" }}
      >
        Cerrado
      </span>
    </div>
  );
}

/**
 * Re-route arrow (B5-fix-final item 2): a small hand-drawn arrow that loops from
 * one column toward the next — "moviendo un caso por el tablero" (journey stage
 * 02). Reinforces the kanban-as-pipeline read with sense, not noise. Same one-pen
 * grammar, low opacity, round caps. Decorative.
 */
export function BoardDoodleReroute({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 60"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <g {...INK} strokeWidth={2.4} opacity={0.4}>
        {/* an arc hopping rightward (a note moving to the next column) */}
        <path d="M 8 44 q 18 -40 48 -30 q 28 9 46 24" />
        {/* arrowhead landing on the right column */}
        <path d="M 90 30 l 12 8 l -3 -13" />
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
