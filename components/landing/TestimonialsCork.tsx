"use client";

import { useRef, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { TestimonialCard } from "@/components/landing/TestimonialCard";
import type { NoteSize, TestimonialCardProps } from "@/components/landing/types";

/**
 * TestimonialsCork: the cinematic full-bleed cork board (design §1.1, §2, §3, §6).
 *
 * Single client island that owns ALL scroll/pan logic + the desktop/motion gate.
 * ONE useScroll subscription drives the whole sequence (no N-per-note
 * subscriptions — Vercel rerender-use-ref-transient-values).
 *
 * Pan path (desktop, motion on) — scroll-progress driven storytelling with a
 * sticky pin (illustration catalog §4.5 + motion catalog §6.4). A sized spacer
 * (.cork-pin-spacer, stable inline calc → CLS 0) provides the scroll distance;
 * useScroll({ target: spacer, offset:["start start","end end"] }) → scrollYProgress.
 *
 * FOUR phases over the spacer:
 *   P0 HAND REVEAL + PRESS + EXIT  [0, tHand]
 *     A cartoon clay hand starts in extreme close-up (scale ~6 → the screen is
 *     just a clay COLOR), and as you scroll it zooms out (--ease-expo) to resolve
 *     into a hand pressing a pushpin onto the FIRST note (which is `placed`:
 *     rendered opaque + pinned). The hand dips (press) then lifts + fades out of
 *     frame, leaving the first note pinned and centred. This replaces the old
 *     empty board zoom-in.
 *   P1 PAN  [tHand, tPanEnd]
 *     The board pans laterally (x: 0 → -panVw) and notes #2..n appear
 *     (whileInView, time-based — see TestimonialCard). The first note is centred
 *     at x=0; the last note is centred at x=-panVw.
 *   P2 ZOOM-OUT END  [tPanEnd, 1]
 *     The board scales 1 → SMALL while the pan HOLDS at -panVw, so it ends framed
 *     on the LAST note (never an empty board).
 *
 * scale → outer .cork-board (transform-origin center, GPU, CLS 0). x → inner
 * track. Both from the SAME scrollYProgress, never useState per frame.
 * ReactLenis(root) smooths the REAL document scrollTop (not a transform), so
 * useScroll reads it correctly (Providers.tsx).
 *
 * Reduced-motion / mobile (< md): StaticCorkGrid — no sticky, no useScroll, no
 * hand, no entrances; all notes visible in a legible 3+2+2 grid; scroll not
 * trapped. SSR-safe gate (resolves false first → static renders, upgrades on
 * mount; no hydration flash).
 */

const HEADING = "Lo que dicen quienes ya lo usan";
const HEADING_ID = "testimonios-title";

// Cell SLOT width per paper size, in vw. This is the single source of truth for
// the track geometry (centring + panVw) — each cell is sized to exactly this vw
// (see the inline width on the cell + .cork-track__cell centring), so the model
// matches the rendered track at ANY viewport width (the card figure sits centred
// inside its slot). Tuned to the figure max-widths (~300/360/420px ≈ these vw at
// a typical desktop) so the slots are snug.
const CELL_VW: Record<NoteSize, number> = {
  sm: 23,
  md: 28,
  lg: 33,
};
const GAP_VW = 5; // horizontal gap between cells

// Scroll budgets (vh). Opening = board zoom-in (it grows to fill the screen);
// then the white hand sweeps down to pin the first note; then the lateral pan;
// then a closing zoom-out framed on the last note. HUMAN-TUNING (not
// headless-verifiable): these + SMALL set the feel.
const ZOOM_IN_VH = 45; // board grows small → full
const HAND_VH = 75; // hand sweeps in from top, presses, exits downward
const ZOOM_OUT_VH = 50; // closing zoom-out
const SMALL = 0.74; // resting scale of the framed board during zoom-in / zoom-out

const EASE_EXPO = cubicBezier(0.19, 1, 0.22, 1); // wow board zoom-in
const EASE_SNAP = cubicBezier(0.34, 1.56, 0.64, 1); // press overshoot
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

/**
 * Track geometry: lead padding so the FIRST note is centred at x=0, and panVw so
 * the LAST note is centred at x=-panVw (cinematic "settle on the final note").
 * Returns per-note panPosition (0..1) = the pan fraction where each note centres,
 * used by the R11 focus-into-view handler.
 */
function computeGeometry(notes: TestimonialCardProps[]) {
  const cell = (n: TestimonialCardProps) => CELL_VW[n.size ?? "md"];
  const leadVw = 50 - cell(notes[0]) / 2; // note 0 centred at viewport centre
  const trailVw = 50 - cell(notes[notes.length - 1]) / 2; // cork right of last note

  const centers: number[] = [];
  let cursor = leadVw;
  for (const n of notes) {
    centers.push(cursor + cell(n) / 2);
    cursor += cell(n) + GAP_VW;
  }
  const lastCenter = centers[centers.length - 1];
  const panVw = Math.max(0, lastCenter - 50);
  const panPositions = centers.map((c) => (panVw > 0 ? (c - 50) / panVw : 0));
  return { leadVw, trailVw, panVw, panPositions };
}

/** Phase fractions over the spacer (treats 1vw ≈ 1vh; exact split shifts a touch
 *  with aspect ratio — acceptable feel detail, flagged for human tuning).
 *  Phases: zoom-in [0,tIn] · hand pin [tIn,tHand] · pan [tHand,tPanEnd] ·
 *  zoom-out [tPanEnd,1]. */
function computePhases(panVw: number) {
  const total = ZOOM_IN_VH + HAND_VH + panVw + ZOOM_OUT_VH;
  const tIn = ZOOM_IN_VH / total;
  const tHand = (ZOOM_IN_VH + HAND_VH) / total;
  const tPanEnd = 1 - ZOOM_OUT_VH / total;
  const pinHeight = `calc(100dvh + ${ZOOM_IN_VH}vh + ${HAND_VH}vh + ${panVw}vw + ${ZOOM_OUT_VH}vh)`;
  return { pinHeight, tIn, tHand, tPanEnd };
}

/** A note's pan-progress arrival point, remapped into the pan phase [tHand,tPanEnd]. */
function remapToPan(panPosition: number, tHand: number, tPanEnd: number): number {
  const p = Math.min(1, Math.max(0, panPosition));
  return tHand + p * (tPanEnd - tHand);
}

const MD_QUERY = "(min-width: 768px)";

/** SSR-safe media-query subscription (mirrors FeaturesBoard's useFinePointer). */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function TestimonialsCork({
  testimonials,
}: {
  testimonials: TestimonialCardProps[];
}) {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery(MD_QUERY);
  const pan = isDesktop && !reduce;

  // The pan path is its OWN component so useScroll (needs a hydrated target ref)
  // only mounts when the pan actually renders.
  if (!pan) {
    return <StaticCorkGrid testimonials={testimonials} />;
  }
  return <CorkPan testimonials={testimonials} />;
}

/** The cartoon clay hand that presses the first note (line-art, on-brand: clay
 *  fill + ink line, same illustration language as the avatars / hand-drawn
 *  marks). Decorative -> aria-hidden. Pure SVG; the parent animates it by scroll
 *  (scale close-up → 1, press dip, lift + fade). The fingertip is at the bottom
 *  centre (the press point + the scale origin), so the extreme close-up fills the
 *  screen with clay before it resolves into a hand. */
function CorkHand() {
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

/** Desktop pan branch: hand-pin intro + sticky pin + horizontal track. */
function CorkPan({
  testimonials,
}: {
  testimonials: TestimonialCardProps[];
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  // Same reduced-motion signal used everywhere else: if the user flips the OS
  // setting while the pan is still mounted, the focus-into-view scroll must jump
  // instantly (no smooth animation) per the R11 a11y contract.
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const { leadVw, trailVw, panVw, panPositions } = computeGeometry(testimonials);
  const { pinHeight, tIn, tHand, tPanEnd } = computePhases(panVw);

  // Board zoom: SMALL → 1 (grows to fill the screen) over the zoom-in phase,
  // held at 1 through the hand + pan, then 1 → SMALL on the closing zoom-out.
  const scale = useTransform(
    scrollYProgress,
    [0, tIn, tPanEnd, 1],
    [SMALL, 1, 1, SMALL],
    { ease: EASE_EXPO },
  );
  // Horizontal pan: held at 0 until the pan phase, runs, then held at -panVw
  // during the zoom-out (so it ends framed on the last note).
  const x = useTransform(scrollYProgress, [tHand, tPanEnd], ["0vw", `-${panVw}vw`], {
    clamp: true,
  });

  // Hand pin beats inside [tIn, tHand]: the white hand sweeps DOWN from above,
  // reaches the first note, presses the pushpin (small dip), then continues DOWN
  // and out of frame (disappears below). transform/opacity only.
  const hSpan = tHand - tIn;
  const hArrive = tIn + hSpan * 0.4; // reached the press point
  const hPress = tIn + hSpan * 0.5; // contact
  const hExit0 = tIn + hSpan * 0.64; // starts withdrawing downward
  const hExit1 = tHand;

  const handY = useTransform(
    scrollYProgress,
    [tIn, hArrive, hPress, hExit0, hExit1],
    ["-82vh", "0vh", "1.6vh", "0vh", "122vh"],
    { clamp: true, ease: EASE_OUT },
  );

  // The hand CARRIES the first note in: the card descends WITH the hand (same
  // curve, [tIn, hArrive]) into its empty slot, then the hand presses + leaves.
  // So the first note is NOT pre-placed — the empty cork is the "hueco" and the
  // hand brings the (already-pinned) card and drops it there.
  const cardCarryY = useTransform(scrollYProgress, [tIn, hArrive], ["-82vh", "0vh"], {
    clamp: true,
    ease: EASE_OUT,
  });
  const cardCarryOpacity = useTransform(
    scrollYProgress,
    [tIn, tIn + (hArrive - tIn) * 0.18],
    [0, 1],
    { clamp: true },
  );
  const handScale = useTransform(scrollYProgress, [tIn, hArrive], [1.12, 1], {
    clamp: true,
    ease: EASE_SNAP, // tiny pop as it lands
  });
  const handRotate = useTransform(scrollYProgress, [hExit0, hExit1], [0, 7], {
    clamp: true,
    ease: EASE_OUT,
  });
  const handOpacity = useTransform(scrollYProgress, [hExit0, hExit1], [1, 0], {
    clamp: true,
  });

  // R11 (WCAG 2.4.3 / 2.4.7): focusing an off-screen note snaps the pan to it.
  // Maps the note's panPosition into the pan phase [tHand, tPanEnd] of the spacer,
  // then scrolls there (live geometry; correct regardless of dvh→px). Smooth by
  // default; instant when reduced motion is active (a11y contract). Plain
  // function: with the React Compiler enabled, manual useCallback is redundant
  // (and the compiler memoizes the component for us).
  const handleCellFocus = (panPosition: number) => {
    const spacer = outerRef.current;
    if (!spacer) return;
    const rect = spacer.getBoundingClientRect();
    const spacerTop = rect.top + window.scrollY;
    const travel = spacer.offsetHeight - window.innerHeight;
    if (travel <= 0) return;
    const progress = remapToPan(panPosition, tHand, tPanEnd);
    const target = spacerTop + progress * travel;
    if (lenis) {
      lenis.scrollTo(target, { immediate: Boolean(reduceMotion) });
    } else {
      window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section
      data-cork
      id="testimonios"
      className="cork-section relative w-full scroll-mt-16"
      aria-labelledby={HEADING_ID}
    >
      <div ref={outerRef} className="cork-pin-spacer" style={{ height: pinHeight }}>
        <div className="cork-sticky sticky top-0 h-[100dvh] overflow-hidden">
          <motion.div
            className="cork-board"
            style={{ scale, transformOrigin: "center center", willChange: "transform" }}
          >
            {/* Cork-mounted heading label (real h2, first in reading order). */}
            <h2
              id={HEADING_ID}
              className="cork-heading absolute left-1/2 top-[5.5rem] max-w-[min(90%,42rem)] -translate-x-1/2 rounded-card border border-border-strong bg-surface px-6 py-3 text-center font-display text-h2 text-text-primary shadow-hard-sm md:top-24"
            >
              {HEADING}
            </h2>

            {/* Horizontal track. Lead/trail padding centre the first note at x=0
                and leave cork to the right of the last note at the end. */}
            <motion.ol
              className="cork-track"
              style={{ x, paddingLeft: `${leadVw}vw`, paddingRight: `${trailVw}vw`, gap: `${GAP_VW}vw` }}
            >
              {testimonials.map((t, i) => (
                <li
                  key={t.name}
                  className="cork-track__cell"
                  // Slot width in vw = the geometry source of truth (the card
                  // figure centres inside it). Keeps panVw / centring exact at
                  // any viewport width.
                  style={{ width: `${CELL_VW[t.size ?? "md"]}vw` }}
                  tabIndex={0}
                  aria-label={`Testimonio ${i + 1} de ${testimonials.length}`}
                  onFocusCapture={() => handleCellFocus(panPositions[i])}
                >
                  {i === 0 ? (
                    // First note: carried in by the hand. It rides the same
                    // descent curve as the hand into the empty slot; `placed`
                    // makes it render opaque + pinned (it arrives already pinned),
                    // so the hand "drops it pinned" and leaves.
                    <motion.div
                      style={{ y: cardCarryY, opacity: cardCarryOpacity, willChange: "transform, opacity" }}
                    >
                      <TestimonialCard
                        {...t}
                        placed
                        panProgress={scrollYProgress}
                        index={i}
                        total={testimonials.length}
                      />
                    </motion.div>
                  ) : (
                    // The rest enter on view (whileInView) as they pan in.
                    <TestimonialCard
                      {...t}
                      panProgress={scrollYProgress}
                      index={i}
                      total={testimonials.length}
                    />
                  )}
                </li>
              ))}
            </motion.ol>

            {/* The cartoon white hand that pins the first note. Sits above the
                board content (z-4), outside the panning track. Scroll-driven:
                sweeps DOWN from above, presses the pushpin, exits downward.
                Decorative. */}
            <motion.div
              aria-hidden="true"
              className="cork-hand"
              style={{
                scale: handScale,
                y: handY,
                rotate: handRotate,
                opacity: handOpacity,
                transformOrigin: "50% 50%",
                willChange: "transform, opacity",
              }}
            >
              <CorkHand />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Static-grid row plan (design §6, W2): user-chosen 3 + 2 + 2, NO orphan tile.
const STATIC_ROW_PLAN = [3, 2, 2] as const;

function chunkByPlan<T>(items: T[], plan: readonly number[]): T[][] {
  const rows: T[][] = [];
  let offset = 0;
  let planIndex = 0;
  while (offset < items.length) {
    const size = plan[planIndex] ?? plan[plan.length - 1] ?? 2;
    rows.push(items.slice(offset, offset + size));
    offset += size;
    planIndex += 1;
  }
  return rows;
}

/**
 * Static fallback (design §6, R9/R10): full-bleed cork + wood frame, all notes in
 * a legible 3 + 2 + 2 grid, no sticky, no scroll trap, no hand. Used for
 * reduced-motion, below md, and on SSR / first paint.
 */
function StaticCorkGrid({
  testimonials,
}: {
  testimonials: TestimonialCardProps[];
}) {
  const rows = chunkByPlan(testimonials, STATIC_ROW_PLAN);
  return (
    <section
      data-cork
      id="testimonios"
      className="cork-section cork-section--static w-full scroll-mt-16"
      aria-labelledby={HEADING_ID}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <h2
          id={HEADING_ID}
          className="cork-heading--static mx-auto mb-12 w-fit max-w-full rounded-card border border-border-strong bg-surface px-6 py-3 text-center font-display text-h2 text-text-primary shadow-hard-sm"
        >
          {HEADING}
        </h2>
        <ol className="cork-grid flex flex-col gap-12 md:gap-10">
          {rows.map((row, rowIndex) => (
            <li key={`row-${rowIndex}`} className="cork-grid__row">
              <ul className="flex flex-col items-center gap-12 md:flex-row md:flex-wrap md:items-stretch md:justify-center md:gap-10">
                {row.map((t) => (
                  <li key={t.name} className="cork-grid__cell">
                    {/* No panProgress → the card renders pinned-static. */}
                    <TestimonialCard {...t} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
