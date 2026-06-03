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

import { BoardHand } from "@/components/landing/BoardHand";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import type { NoteSize, TestimonialCardProps } from "@/components/landing/types";

/**
 * TestimonialsCork: "El tablero de Tendr" — the cinematic full-bleed clean board
 * of living notes (ADR-3). v2 reinvention of the v1 cork board: a modern sunken
 * whiteboard panel (hairline frame + faint kanban column guides) that echoes the
 * product's own kanban pipeline. Paper notes stay alive, held by a strip of celo
 * (washi tape) instead of a pushpin.
 *
 * Single client island that owns ALL scroll/pan logic + the desktop/motion gate.
 * ONE useScroll subscription drives the whole sequence (no N-per-note
 * subscriptions — Vercel rerender-use-ref-transient-values).
 *
 * Pan path (desktop, motion on) — scroll-progress driven storytelling with a
 * sticky pin (motion catalog §6.4). A sized spacer (.board-pin-spacer, stable
 * inline calc → CLS 0) provides the scroll distance;
 * useScroll({ target: spacer, offset:["start start","end end"] }) → scrollYProgress.
 *
 * FOUR phases over the spacer (B5-fix-2 restores the ORIGINAL hand phase: the
 * v2 line-art hand is scroll-LINKED again over a dedicated [tIn, tHand] phase
 * between the zoom-in and the pan, exactly like the retired cork hand — see
 * BoardHand. B5-fix-1's whileInView beat fired the instant the board entered view
 * ("salta muy pronto"); rebinding it to scrollYProgress fixes the timing):
 *   P0 ZOOM-IN  [0, tIn]
 *     The framed board scales SMALL → 1 (grows to fill the screen) over --ease-expo.
 *     The first note is already present and reveals via its whileInView entrance.
 *   P1 HAND PRESS  [tIn, tHand]
 *     The subtle line-art hand sweeps DOWN from above the frame, dips to PRESS the
 *     first note's tape, then continues down and out of frame, fading. Scrubbed by
 *     scroll (same scrollYProgress), so it only appears once the board has zoomed
 *     in and the press follows the user's scroll.
 *   P2 PAN  [tHand, tPanEnd]
 *     The board pans laterally (x: 0 → -panVw) and notes #2..n appear
 *     (whileInView, time-based — see TestimonialCard). The first note is centred
 *     at x=0; the last note is centred at x=-panVw.
 *   P3 ZOOM-OUT END  [tPanEnd, 1]
 *     The board scales 1 → SMALL while the pan HOLDS at -panVw, so it ends framed
 *     on the LAST note (never an empty board).
 *
 * scale → outer .board-panel (transform-origin center, GPU, CLS 0). x → inner
 * track. Both from the SAME scrollYProgress, never useState per frame.
 * ReactLenis(root) smooths the REAL document scrollTop (not a transform), so
 * useScroll reads it correctly (Providers.tsx).
 *
 * Reduced-motion / mobile (< md): StaticBoardGrid — no sticky, no useScroll, no
 * entrances; all notes visible in a legible 3+2+2 grid; scroll not trapped.
 * SSR-safe gate (resolves false first → static renders, upgrades on mount; no
 * hydration flash).
 */

const HEADING = "Lo que dicen quienes ya lo usan";
const HEADING_ID = "testimonios-title";

// Cell SLOT width per paper size, in vw. This is the single source of truth for
// the track geometry (centring + panVw) — each cell is sized to exactly this vw
// (see the inline width on the cell + .board-track__cell centring), so the model
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
// then the hand sweeps down + presses the first note; then the lateral pan; then
// a closing zoom-out framed on the last note. HUMAN-TUNING (not
// headless-verifiable): these + SMALL set the feel. B5-fix-2 reintroduces HAND_VH
// (the original cork-hand budget) so the hand has its own scroll phase.
const ZOOM_IN_VH = 45; // board grows small → full
const HAND_VH = 72; // hand sweeps in from above, presses the first note, exits down
const ZOOM_OUT_VH = 50; // closing zoom-out
const SMALL = 0.74; // resting scale of the framed board during zoom-in / zoom-out

const EASE_EXPO = cubicBezier(0.16, 1, 0.3, 1); // wow board zoom-in (v2 expo)
const EASE_SNAP = cubicBezier(0.34, 1.56, 0.64, 1); // press overshoot (hand land)
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1); // hand sweep / exit

/**
 * Track geometry: lead padding so the FIRST note is centred at x=0, and panVw so
 * the LAST note is centred at x=-panVw (cinematic "settle on the final note").
 * Returns per-note panPosition (0..1) = the pan fraction where each note centres,
 * used by the R11 focus-into-view handler.
 */
function computeGeometry(notes: TestimonialCardProps[]) {
  const cell = (n: TestimonialCardProps) => CELL_VW[n.size ?? "md"];
  const leadVw = 50 - cell(notes[0]) / 2; // note 0 centred at viewport centre
  const trailVw = 50 - cell(notes[notes.length - 1]) / 2; // board right of last note

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
 *  Phases: zoom-in [0,tIn] · hand press [tIn,tHand] · pan [tHand,tPanEnd] ·
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
    return <StaticBoardGrid testimonials={testimonials} />;
  }
  return <BoardPan testimonials={testimonials} />;
}

/** Desktop pan branch: clean zoom-in open + sticky pin + horizontal track. */
function BoardPan({
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
  // Horizontal pan: held at 0 until the pan phase (now starts AFTER the hand
  // phase at tHand), runs, then held at -panVw during the zoom-out (so it ends
  // framed on the last note).
  const x = useTransform(scrollYProgress, [tHand, tPanEnd], ["0vw", `-${panVw}vw`], {
    clamp: true,
  });

  // Hand press beats inside [tIn, tHand] (B5-fix-2 — restored original CorkHand
  // model). The line-art hand sweeps DOWN from above the frame, reaches the first
  // note, presses (a small dip), then continues DOWN and out of frame, fading.
  // All scroll-scrubbed (same scrollYProgress), transform/opacity only.
  const hSpan = tHand - tIn;
  const hArrive = tIn + hSpan * 0.4; // reached the press point
  const hPress = tIn + hSpan * 0.5; // contact (dip)
  const hExit0 = tIn + hSpan * 0.64; // starts withdrawing downward
  const hExit1 = tHand;

  const handY = useTransform(
    scrollYProgress,
    [tIn, hArrive, hPress, hExit0, hExit1],
    ["-78vh", "0vh", "1.4vh", "0vh", "118vh"],
    { clamp: true, ease: EASE_OUT },
  );
  const handScale = useTransform(scrollYProgress, [tIn, hArrive], [1.1, 1], {
    clamp: true,
    ease: EASE_SNAP, // tiny pop as it lands
  });
  const handRotate = useTransform(scrollYProgress, [hExit0, hExit1], [0, 7], {
    clamp: true,
    ease: EASE_OUT,
  });
  // Fades up at the start of the phase, holds, fades out as it exits below.
  const handOpacity = useTransform(
    scrollYProgress,
    [tIn, tIn + hSpan * 0.12, hExit0, hExit1],
    [0, 1, 1, 0],
    { clamp: true },
  );

  // R11 (WCAG 2.4.3 / 2.4.7): focusing an off-screen note snaps the pan to it.
  // Maps the note's panPosition into the pan phase [tIn, tPanEnd] of the spacer,
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
      className="board-section relative w-full scroll-mt-16"
      aria-labelledby={HEADING_ID}
    >
      <div ref={outerRef} className="board-pin-spacer" style={{ height: pinHeight }}>
        <div className="board-sticky sticky top-0 h-[100dvh] overflow-hidden">
          <motion.div
            className="board-panel"
            style={{ scale, transformOrigin: "center center", willChange: "transform" }}
          >
            {/* Board-mounted heading label (real h2, first in reading order). */}
            <h2
              id={HEADING_ID}
              className="board-heading absolute left-1/2 top-[5.5rem] max-w-[min(90%,42rem)] -translate-x-1/2 rounded-lg border border-border-strong bg-surface px-6 py-3 text-center font-display text-h2 text-text-primary shadow-flat md:top-24"
            >
              {HEADING}
            </h2>

            {/* Horizontal track. Lead/trail padding centre the first note at x=0
                and leave board to the right of the last note at the end. */}
            <motion.ol
              className="board-track"
              style={{ x, paddingLeft: `${leadVw}vw`, paddingRight: `${trailVw}vw`, gap: `${GAP_VW}vw` }}
            >
              {testimonials.map((t, i) => (
                <li
                  key={t.name}
                  className="board-track__cell"
                  // Slot width in vw = the geometry source of truth (the card
                  // figure centres inside it). Keeps panVw / centring exact at
                  // any viewport width.
                  style={{ width: `${CELL_VW[t.size ?? "md"]}vw` }}
                  tabIndex={0}
                  aria-label={`Testimonio ${i + 1} de ${testimonials.length}`}
                  onFocusCapture={() => handleCellFocus(panPositions[i])}
                >
                  {/* All notes (incl. the first) reveal via their normal
                      whileInView entrance as the board pans/zooms in. */}
                  <TestimonialCard
                    {...t}
                    panProgress={scrollYProgress}
                    index={i}
                    total={testimonials.length}
                  />
                </li>
              ))}
            </motion.ol>

            {/* The placing hand (B5-fix-2 — original CorkHand choreography, v2
                line-art look). It sits ABOVE the board content, OUTSIDE the
                panning track (so it doesn't pan), centred where the first note
                rests at x=0. Scroll-driven over [tIn, tHand]: sweeps DOWN from
                above, presses the first note's tape, exits downward + fades.
                Decorative → aria-hidden. Positioned so the fingertip (top centre
                of the glyph) lands on the note's tape strip. */}
            <BoardHand
              className="pointer-events-none absolute left-1/2 top-[calc(50%-15rem)] z-[3] h-36 w-28 -translate-x-1/2 md:h-44 md:w-32"
              y={handY}
              scale={handScale}
              rotate={handRotate}
              opacity={handOpacity}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Static-grid row plan (W2): user-chosen 3 + 2 + 2, NO orphan tile.
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
 * Static fallback (R9/R10): full-bleed clean board panel (sunken surface +
 * hairline frame + faint kanban guides), all notes in a legible 3 + 2 + 2 grid,
 * no sticky, no scroll trap. Used for reduced-motion, below md, and on SSR /
 * first paint.
 */
function StaticBoardGrid({
  testimonials,
}: {
  testimonials: TestimonialCardProps[];
}) {
  const rows = chunkByPlan(testimonials, STATIC_ROW_PLAN);
  return (
    <section
      data-cork
      id="testimonios"
      className="board-section board-section--static w-full scroll-mt-16"
      aria-labelledby={HEADING_ID}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <h2
          id={HEADING_ID}
          className="board-heading--static mx-auto mb-12 w-fit max-w-full rounded-lg border border-border-strong bg-surface px-6 py-3 text-center font-display text-h2 text-text-primary shadow-flat"
        >
          {HEADING}
        </h2>
        <ol className="board-grid flex flex-col gap-12 md:gap-10">
          {rows.map((row, rowIndex) => (
            <li key={`row-${rowIndex}`} className="board-grid__row">
              <ul className="flex flex-col items-center gap-12 md:flex-row md:flex-wrap md:items-stretch md:justify-center md:gap-10">
                {row.map((t, cellIndex) => (
                  <li key={t.name} className="board-grid__cell">
                    {/* No panProgress → the card renders held-static. index drives
                        the tape-tint alternation across the grid. */}
                    <TestimonialCard {...t} index={rowIndex * 10 + cellIndex} />
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
