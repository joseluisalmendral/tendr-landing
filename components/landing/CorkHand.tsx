/**
 * CorkHand: the cartoon clay hand that presses the first note (line-art, on-brand:
 * clay fill + ink line, same illustration language as the avatars / hand-drawn
 * marks). Decorative -> aria-hidden. Pure SVG; the parent animates it by scroll
 * (scale close-up → 1, press dip, lift + fade). The fingertip is at the bottom
 * centre (the press point + the scale origin), so the extreme close-up fills the
 * screen with clay before it resolves into a hand.
 *
 * Shared by the cork (TestimonialsCork) and the client-journey ("hand once").
 * No "use client": pure presentational SVG with no hooks, so it can be used by
 * both server and client parents.
 */
export function CorkHand() {
  return (
    <svg
      viewBox="0 0 240 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
      // Bold cartoon WHITE hand (cream fill + ink line, on-brand, same language
      // as the avatars). Drawn back-to-front: cuff, curled fingers (peek as
      // bumps), thumb, fist, index (front, short), knuckle dimple.
    >
      {/* shirt cuff */}
      <rect x="82" y="4" width="76" height="40" rx="14"
        fill="var(--color-surface-raised)" stroke="var(--color-border-strong)"
        strokeWidth="5" strokeLinejoin="round" />
      {/* curled fingers (behind the fist, peeking below as bumps) */}
      <rect x="138" y="118" width="24" height="40" rx="12"
        fill="var(--color-surface-raised)" stroke="var(--color-border-strong)"
        strokeWidth="5" strokeLinejoin="round" />
      <rect x="160" y="118" width="22" height="34" rx="11"
        fill="var(--color-surface-raised)" stroke="var(--color-border-strong)"
        strokeWidth="5" strokeLinejoin="round" />
      {/* thumb (left, angled) */}
      <g transform="rotate(-22 72 110)">
        <rect x="50" y="78" width="34" height="60" rx="17"
          fill="var(--color-surface-raised)" stroke="var(--color-border-strong)"
          strokeWidth="5" strokeLinejoin="round" />
      </g>
      {/* back of hand / fist */}
      <rect x="66" y="42" width="108" height="104" rx="30"
        fill="var(--color-surface-raised)" stroke="var(--color-border-strong)"
        strokeWidth="5" strokeLinejoin="round" />
      {/* index finger pressing down (front, centred at x=120) — short */}
      <rect x="102" y="120" width="36" height="108" rx="18"
        fill="var(--color-surface-raised)" stroke="var(--color-border-strong)"
        strokeWidth="5" strokeLinejoin="round" />
      {/* knuckle dimple on the fist */}
      <path d="M84 92 q36 -12 72 0" stroke="var(--color-border-strong)"
        strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
