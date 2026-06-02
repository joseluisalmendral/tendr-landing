"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

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
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
