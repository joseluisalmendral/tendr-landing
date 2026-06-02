"use client";

import { useState } from "react";

import { FEATURES } from "./feature-showcase-panels";

/**
 * FeatureShowcase ("#funciones → Un CRM con todo lo que necesitas"): the
 * client leaf that orchestrates a 40/60 accordion + animated demo panel
 * (change funciones-feature-showcase, spec R1-R10, design ADR-1/ADR-3).
 *
 * COMMIT 1 SCOPE (this file, this slice): the SKELETON only.
 *  - `activeIndex` is discrete UI state (useState, default 0 → first feature
 *    active on load, spec R3.4/R3.6). NO per-frame useState, NO useCallback/
 *    useMemo (React Compiler handles memoization).
 *  - Left column: a simple static list of feature names + the active feature's
 *    description. The full WAI-ARIA accordion (button/aria-expanded/aria-controls,
 *    grid-rows expand, keyboard) lands in Commit 2 — the structure here is kept
 *    deliberately thin so Commit 2 can upgrade each item to a real accordion
 *    header without reshaping the layout.
 *  - Right column: a reserved-height stage (CLS 0) that renders ONLY the active
 *    panel. The AnimatePresence crossfade + per-panel micro-demos land in
 *    Commit 3; here the swap is instant.
 *  - 40/60 intent on md+ via CSS Grid (no flex percentage math). SSR-safe: no
 *    browser-only hooks yet (useIsDesktop / reduced-motion arrive in Commit 2/3);
 *    activeIndex defaults to 0 so the first panel renders identically on the
 *    server and the first client paint → no hydration mismatch.
 *
 * Tokens only (zero hex), light theme lock (no dark:), Phosphor /dist/ssr in the
 * panels. The Section heading + RSC boundary live in app/page.tsx.
 */
export function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = FEATURES[activeIndex];
  const ActivePanel = active.Panel;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_3fr] md:items-start lg:gap-12">
      {/* Left column (~40%): feature list + active description.
          Commit 2 upgrades each <li> into a real accordion header. */}
      <ul className="flex flex-col">
        {FEATURES.map((feature, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={feature.id} className="border-b border-border last:border-b-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={
                  "w-full py-4 text-left font-heading text-h3 transition-colors duration-200 " +
                  (isActive
                    ? "text-accent-secondary"
                    : "text-text-primary hover:text-text-secondary")
                }
              >
                {feature.name}
              </button>
              {isActive ? (
                <p className="pb-4 text-body-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* Right column (~60%): reserved-height stage so switching the active
          feature never reflows the page (CLS 0). Commit 3 wraps this in
          AnimatePresence for the crossfade. */}
      <div className="relative min-h-[24rem] md:min-h-[28rem]">
        <ActivePanel active />
      </div>
    </div>
  );
}
