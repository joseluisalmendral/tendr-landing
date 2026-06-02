"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { FEATURES } from "./feature-showcase-panels";

/**
 * FeatureShowcase ("#funciones → Un CRM con todo lo que necesitas"): the
 * client leaf that orchestrates a 40/60 WAI-ARIA accordion + demo panel
 * (change funciones-feature-showcase, spec R1-R10, design ADR-1/ADR-3/ADR-4/ADR-7).
 *
 * LAYOUT + INTERACTION:
 *  - LEFT (~40%): a hand-built WAI-ARIA Accordion (APG pattern). Each item is a
 *    heading wrapping a `<button aria-expanded aria-controls>` (the feature NAME,
 *    always visible) + a `role="region"` description region that EXPANDS only for
 *    the active item via the grid-rows `0fr → 1fr` trick (CLS-safe — NO height
 *    measurement, NO `height:auto` guess). Single-open, first-open (activeIndex
 *    default 0). Keyboard per APG: Enter/Space activate the focused header,
 *    ArrowUp/Down move focus between headers (wrap), Home/End jump to first/last.
 *  - RIGHT (~60%): a reserved-height stage (CLS 0) rendering the active panel
 *    inside <AnimatePresence> (default/sync mode) keyed by activeIndex — incoming
 *    and outgoing panels are both `absolute inset-0` and OVERLAP, crossfading on
 *    opacity (~0.3s), so the stage is never empty and switching never reflows
 *    (CLS 0). The incoming panel plays its own on-activation micro-demo (panels
 *    file).
 *  - Mobile (<md): single column. The accordion stacks and the active item's
 *    PANEL renders INLINE in a reserved-height box right after its description,
 *    with its own keyed fade on switch. `useIsDesktop()` (useSyncExternalStore,
 *    SSR snapshot false — mirrors FeaturesBoard.useFinePointer) decides
 *    desktop-vs-mobile placement with NO hydration mismatch: SSR + first client
 *    paint both render the mobile layout (activeIndex 0 → panel 0 visible), then
 *    enrich to the 40/60 grid after mount.
 *  - `activeIndex` is discrete UI state (useState). NO per-frame useState, NO
 *    useCallback/useMemo (React Compiler handles memoization).
 *
 * COMMIT 3 MOTION LAYER: the crossfade between panels (AnimatePresence keyed by
 * activeIndex) + each panel's on-activation micro-demo (in feature-showcase-panels)
 * + reduced-motion gating. `reduceMotion` is threaded down to the panels so each
 * renders its final/resolved STATIC state under prefers-reduced-motion.
 *
 * Reduced motion: NO crossfade (panels swap instantly — no AnimatePresence
 * transition since the motion props collapse to the final state), NO micro-demos
 * (panels render their resting state), and the grid-rows expand transition is
 * disabled (instant). The accordion stays fully usable (keyboard + state).
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
      {/* LEFT (~40%): WAI-ARIA accordion. Each item = heading > button + region.
          A small gap between items gives the list the generous, journey-coherent
          rhythm; the per-item vertical padding (py-6) carries the breathing room
          while the bottom border still divides them. */}
      <div className="flex flex-col gap-2">
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
                    "flex w-full items-center justify-between gap-3 py-6 text-left font-heading text-h2 transition-colors duration-200 " +
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
                      "max-w-[46ch] pb-6 text-body-lg leading-relaxed text-text-secondary transition-opacity duration-200 " +
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
                    <motion.div
                      className="relative flex min-h-[26rem] items-stretch justify-center pb-4"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <FeaturePanel active reduceMotion={reduceMotion} />
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT (~60%): reserved-height stage. Desktop only — on mobile the panel
          renders inline in the accordion above. Reserved min-h + absolute-stacked
          crossfade keep CLS 0 when the active feature switches. AnimatePresence
          in the DEFAULT (sync) mode keyed by activeIndex overlaps the panels:
          the incoming fades in (~0.3s) WHILE the outgoing fades out, both
          absolute-stacked, so the stage is never empty (mode="wait" left a blank
          gap between exit and enter). The incoming panel plays its own
          on-activation micro-demo. Reduced motion ⇒ the per-panel motion props
          collapse to the final state (instant swap), so no crossfade is felt. */}
      {isDesktop ? (
        <div className="relative mx-auto flex min-h-[26rem] w-full max-w-xl items-center justify-center md:min-h-[30rem]">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeIndex}
              className="absolute inset-0 flex items-center justify-center"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ActivePanel active reduceMotion={reduceMotion} />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}
