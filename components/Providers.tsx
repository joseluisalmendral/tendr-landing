"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";

/**
 * Hands scroll-restoration back to the browser.
 *
 * WHY: on back/forward navigation the browser restores the previous scroll
 * position ONLY while `history.scrollRestoration === 'auto'` (the platform
 * default). Smooth-scroll libraries commonly force it to `'manual'` to own the
 * scroll, and nothing in this app restores the saved position afterwards — so a
 * back-nav would land at the top. The installed Lenis (1.3.23) does NOT touch
 * `history.scrollRestoration` (verified: the property appears nowhere in
 * lenis/dist and is not a LenisOption), but we set it explicitly anyway as a
 * defensive guarantee that survives Lenis upgrades: the BROWSER must own
 * restoration, not us. Mounted INSIDE <ReactLenis> so this effect runs after the
 * provider's own mount effects (effect order is child-after-parent for siblings
 * in the same commit; nesting keeps us downstream of Lenis init).
 */
function RestoreScroll() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }
  }, []);
  return null;
}

/**
 * Client-side providers mounted once at the root.
 *
 * - ReactLenis (root): global smooth-scroll. Lenis smooths the real document
 *   scroll (it animates scrollTop, not a transform), so native CSS
 *   scroll-driven timelines (`animation-timeline: scroll()/view()`) keep
 *   working and are fed by the smoothed scroll. This is the only smooth-scroll
 *   layer; it is NOT an extra animation library (motion budget cap stays at 3:
 *   Motion + CSS scroll-driven + Lenis).
 * - MotionConfig reducedMotion="user": site-wide policy so every Motion
 *   component respects the OS "reduce motion" setting. CSS scroll-driven
 *   choreographies carry their own `prefers-reduced-motion` guard.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: true }}>
      <RestoreScroll />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
