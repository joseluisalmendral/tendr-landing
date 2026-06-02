"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

import { FEATURES } from "./feature-showcase-panels";

/**
 * FeatureShowcase ("#funciones → Un CRM con todo lo que necesitas"): the
 * client leaf that orchestrates a 40/60 WAI-ARIA accordion + demo panel
 * (change funciones-feature-showcase, spec R1-R10, design ADR-1/ADR-3/ADR-4/ADR-7).
 *
 * COMMIT 2 SCOPE (this file): the interaction layer on top of the Commit-1
 * skeleton.
 *  - LEFT (~40%): a hand-built WAI-ARIA Accordion (APG pattern). Each item is a
 *    heading wrapping a `<button aria-expanded aria-controls>` (the feature NAME,
 *    always visible) + a `role="region"` description region that EXPANDS only for
 *    the active item via the grid-rows `0fr → 1fr` trick (CLS-safe — NO height
 *    measurement, NO `height:auto` guess). Single-open, first-open (activeIndex
 *    default 0). Keyboard per APG: Enter/Space activate the focused header,
 *    ArrowUp/Down move focus between headers (wrap), Home/End jump to first/last.
 *  - RIGHT (~60%): a reserved-height stage (CLS 0) rendering ONLY the active
 *    panel. The AnimatePresence crossfade + per-panel micro-demos land in
 *    Commit 3; here the swap is instant.
 *  - Mobile (<md): single column. The accordion stacks and the active item's
 *    PANEL renders INLINE in a reserved-height box right after its description.
 *    `useIsDesktop()` (useSyncExternalStore, SSR snapshot false — mirrors
 *    FeaturesBoard.useFinePointer) decides desktop-vs-mobile placement with NO
 *    hydration mismatch: SSR + first client paint both render the mobile layout
 *    (activeIndex 0 → panel 0 visible), then enrich to the 40/60 grid after mount.
 *  - `activeIndex` is discrete UI state (useState). NO per-frame useState, NO
 *    useCallback/useMemo (React Compiler handles memoization).
 *
 * Reduced motion: the grid-rows expand transition is disabled (instant) — the
 * description still shows for the active item and the accordion stays fully
 * usable (keyboard + state). The full reduced-motion gating of the right-panel
 * micro-demos is Commit 3.
 *
 * Tokens only (zero hex), light theme lock (no dark:), Phosphor /dist/ssr in the
 * panels. The Section heading + RSC boundary live in app/page.tsx.
 */

const DESKTOP_QUERY = "(min-width: 768px)"; // Tailwind md breakpoint

/**
 * SSR-safe desktop detector. useSyncExternalStore reads matchMedia on the client
 * without a setState-in-effect and returns `false` during SSR, so the first
 * client render matches the server (mobile layout) and enriches to desktop after
 * mount — no hydration mismatch, no suppressHydrationWarning. Mirrors
 * FeaturesBoard.useFinePointer exactly.
 */
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(DESKTOP_QUERY);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

export function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion() ?? false;

  // Roving focus management for the APG arrow-key navigation. All header buttons
  // are natively focusable/tabbable (APG allows all-tabbable headers); arrow keys
  // are an enhancement that moves focus between them via this refs array.
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusHeader = (index: number) => {
    const count = FEATURES.length;
    const next = (index + count) % count; // wrap
    headerRefs.current[next]?.focus();
  };

  const handleHeaderKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusHeader(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusHeader(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusHeader(0);
        break;
      case "End":
        event.preventDefault();
        focusHeader(FEATURES.length - 1);
        break;
      // Enter / Space are the button's native activation → onClick fires; no
      // extra handling needed (and preventing default here would break it).
      default:
        break;
    }
  };

  const ActivePanel = FEATURES[activeIndex].Panel;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_3fr] md:items-start lg:gap-12">
      {/* LEFT (~40%): WAI-ARIA accordion. Each item = heading > button + region. */}
      <div className="flex flex-col">
        {FEATURES.map((feature, index) => {
          const isActive = index === activeIndex;
          const buttonId = `feature-${feature.id}-header`;
          const panelId = `feature-${feature.id}-region`;
          const FeaturePanel = feature.Panel;

          return (
            <div
              key={feature.id}
              className={
                "border-b transition-colors duration-200 " +
                (isActive ? "border-accent-secondary" : "border-border")
              }
            >
              {/* Header: a heading wrapping the toggle button. The feature NAME is
                  always visible (APG accordion header). */}
              <h3 className="m-0">
                <button
                  ref={(el) => {
                    headerRefs.current[index] = el;
                  }}
                  type="button"
                  id={buttonId}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => handleHeaderKeyDown(event, index)}
                  className={
                    "flex w-full items-center justify-between gap-3 py-4 text-left font-heading text-h3 transition-colors duration-200 " +
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface " +
                    (isActive
                      ? "text-accent-secondary"
                      : "text-text-primary hover:text-text-secondary")
                  }
                >
                  <span>{feature.name}</span>
                  {/* Open-state marker: a clay bar that reads as the active rail.
                      aria-hidden — the aria-expanded state already conveys this. */}
                  <span
                    aria-hidden="true"
                    className={
                      "h-px shrink-0 rounded-full bg-accent-secondary transition-all duration-200 " +
                      (isActive ? "w-6 opacity-100" : "w-0 opacity-0")
                    }
                  />
                </button>
              </h3>

              {/* Description region: grid-rows 0fr → 1fr expand (CLS-safe). The
                  inner wrapper is overflow-hidden + min-h-0 so the content is
                  clipped while collapsed, with no height measurement. Reduced
                  motion → no transition (instant). */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={
                  "grid " +
                  (reduceMotion
                    ? ""
                    : "transition-[grid-template-rows] duration-[250ms] ease-inout")
                }
                style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
              >
                <div className="min-h-0 overflow-hidden">
                  <p
                    className={
                      "pb-4 text-body-sm leading-relaxed text-text-secondary transition-opacity duration-200 " +
                      (isActive ? "opacity-100" : "opacity-0")
                    }
                  >
                    {feature.description}
                  </p>

                  {/* Mobile (<md): the active item's demo panel renders INLINE
                      below its description, inside a reserved-height box so the
                      expand/collapse never janks the surrounding layout. On md+
                      the panel lives in the shared right stage instead. Only the
                      active item mounts its panel here (it is the only expanded
                      region). */}
                  {!isDesktop && isActive ? (
                    <div className="relative min-h-[24rem] pb-4">
                      <FeaturePanel active />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT (~60%): reserved-height stage. Desktop only — on mobile the panel
          renders inline in the accordion above. Reserved min-h keeps CLS 0 when
          the active feature switches. Commit 3 wraps this in AnimatePresence. */}
      {isDesktop ? (
        <div className="relative min-h-[24rem] md:min-h-[28rem]">
          <ActivePanel active />
        </div>
      ) : null}
    </div>
  );
}
