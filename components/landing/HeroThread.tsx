"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  cubicBezier,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * HeroThread — "El Hilo": the hero's right-column illustrative scene.
 *
 * Change v2-token-migration, batch B1-fix-3. REPLACES the kanban-board "nota
 * viva" (window chrome + cards + washi tape + nudge chip). The board was a
 * faux-product surface; the thread is a STORY: it shows, in one calm ~10.5s
 * loop, the single promise of the product — "tu cartera es un hilo vivo y nada
 * se te cae".
 *
 * THE CHOREOGRAPHY (one continuous timeline `t` ∈ [0,1] over LOOP_MS):
 *   1. 0–2.8s   — a single ink stroke draws itself left→right (route-like, two
 *                 intentional curves, NOT a scribble), expo-out.
 *   2. 2.8–5s   — as the tip passes them, 3 line-art moments fade+blur-in,
 *                 anchored on the path (stagger): a note (9:12 · Ana), an
 *                 envelope going out (propuesta), a clock (Marta · 12 días).
 *   3. 5–7s     — the clock FALLS and dims (y +14, opacity→0.35): the forgotten
 *                 follow-up. Tension beat.
 *   4. 7–9s     — the stroke loops back on itself (support-colored hand-drawn
 *                 hook), the clock RISES + recovers, a support check draws in,
 *                 and the buttermilk subrayador sweeps over "Retomar".
 *   5. 9–10.5s  — breathe, then a smooth global fade reset → seamless loop.
 *
 * COLOR DISCIPLINE (docs/design.md v2): ink (#1f1b16 structure) for the stroke
 * and the 3 line-art moments; support wisp (#b23a86) ONLY on the rescue loop +
 * the check (firma); buttermilk highlight (#fff8bb) ONLY as the subrayador
 * text-bg under "Retomar". Geist Mono for the timestamps, Plus Jakarta for the
 * micro-copy. No frame, no card — frameless on the warm surface.
 *
 * PERFORMANCE: a single `useMotionValue` time loop (no useState for continuous
 * values) drives every element through `useTransform`. transform / opacity /
 * stroke-dashoffset only (GPU). The loop only runs while the scene is in view
 * (useInView) — offscreen it parks at the final composed frame to save CPU.
 *
 * A11Y: the SVG scene is aria-hidden (illustrative). The narrative micro-copy
 * (9:12 · Ana, etc.) stays as real rendered text. A visually-hidden sentence
 * summarizes the promise for assistive tech. Under prefers-reduced-motion the
 * loop never starts: the scene mounts at its full final composition (path drawn,
 * 3 moments visible, clock up + recovered, check + subrayador painted).
 */

const LOOP_MS = 10500;

// Easings (docs/design.md / senior-motion-catalog §4): expo-out for the wow
// draw, standard for recoveries.
const EXPO_OUT = cubicBezier(0.16, 1, 0.3, 1);

// Geometry of the right-column scene. viewBox is purely illustrative; the SVG
// scales to its container. The MAIN path is route-like: it enters top-left,
// makes two intentional curves, and descends to the right — a journey down the
// portfolio, never a serpentine scribble. The composition spreads top→bottom so
// it has real presence beside the big headline (not a thin floating ribbon).
const VB_W = 440;
const VB_H = 440;

// The three moments are anchored ON the path, in draw order (top-left → down-
// right). The MAIN_PATH below is authored so the curve genuinely PASSES THROUGH
// each anchor (the cubic segments start/end exactly on these points).
const NOTE = { x: 84, y: 96 };
const ENVELOPE = { x: 250, y: 168 };
const CLOCK = { x: 332, y: 320 };

// The main stroke: enters top-left above the NOTE, threads down through the
// three moments. Each cubic segment ENDS on the next anchor so the glyphs sit
// exactly on the line. Two intentional curves (a gentle lean-in, then a settle).
const MAIN_PATH =
  "M 36 60 " +
  "C 60 78, 72 96, 84 96 " + // → NOTE (84,96)
  "C 140 96, 168 150, 250 168 " + // → ENVELOPE (250,168)
  "C 312 181, 300 296, 332 320"; // → CLOCK (332,320)

// The rescue loop: a clean support-colored hand-drawn hook that doubles back
// from the clock and curls under it (the "retake" gesture), then returns toward
// the line — a closed, deliberate loop, not a stray flick.
const RESCUE_PATH =
  "M 332 320 " +
  "C 380 332, 392 392, 332 396 " +
  "C 286 399, 280 352, 318 344";

// Phase boundaries as fractions of the loop (see header choreography).
const P = {
  drawEnd: 2800 / LOOP_MS,
  noteIn: 2600 / LOOP_MS,
  envIn: 3100 / LOOP_MS,
  clockIn: 3600 / LOOP_MS,
  momentsSettled: 5000 / LOOP_MS,
  fallStart: 5000 / LOOP_MS,
  fallEnd: 6200 / LOOP_MS,
  rescueStart: 7000 / LOOP_MS,
  rescueDrawn: 8000 / LOOP_MS,
  recovered: 8600 / LOOP_MS,
  checkIn: 8200 / LOOP_MS,
  underlineStart: 8600 / LOOP_MS,
  underlineEnd: 9200 / LOOP_MS,
  breatheEnd: 9600 / LOOP_MS,
  resetEnd: 1,
};

// Small helper: a fade-up + blur-in window for a moment anchored on the path.
function useMomentStyle(t: MotionValue<number>, start: number) {
  const span = 0.05; // ~525ms reveal window
  const opacity = useTransform(t, [start, start + span], [0, 1]);
  const y = useTransform(t, [start, start + span], [10, 0]);
  const blur = useTransform(t, [start, start + span], [6, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return { opacity, y, filter };
}

export function HeroThread() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });

  // The single continuous timeline. Under reduced motion it is pinned to 1 (the
  // full final composition) and never animated.
  const t = useMotionValue(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce) {
      t.set(1);
      return;
    }
    if (!inView) {
      // Park offscreen at the composed final frame (no CPU spent looping).
      t.set(1);
      return;
    }
    const controls = animate(t, [0, 1], {
      duration: LOOP_MS / 1000,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [reduce, inView, t]);

  // ── Main stroke draw (0 → drawEnd), expo-out applied via a remapped sub-value.
  // strokeDashoffset: 1 (hidden) → 0 (fully drawn). pathLength normalizes to 1.
  const drawProgress = useTransform(t, [0, P.drawEnd], [0, 1], {
    clamp: true,
    ease: EXPO_OUT,
  });
  const mainDashoffset = useTransform(drawProgress, [0, 1], [1, 0]);

  // ── The three moments (fade-up + blur-in as the tip passes them).
  const note = useMomentStyle(t, P.noteIn);
  const envelope = useMomentStyle(t, P.envIn);

  // ── The clock is special: it appears, then FALLS + dims, then RISES + recovers.
  const clockFallY = useTransform(
    t,
    [P.fallStart, P.fallEnd, P.rescueStart, P.recovered],
    [0, 14, 14, 0],
    { ease: EXPO_OUT },
  );
  // The clock opacity in one derived value: it appears (clockIn), holds at full,
  // dims during the fall, holds dim, then recovers to full. Single source = `t`,
  // so no multi-input combine is needed (and the timeline stays auditable).
  const clockOpacity = useTransform(
    t,
    [
      P.clockIn,
      P.clockIn + 0.05,
      P.fallStart,
      P.fallEnd,
      P.rescueStart,
      P.recovered,
    ],
    [0, 1, 1, 0.35, 0.35, 1],
  );
  const clockBlur = useMomentStyle(t, P.clockIn).filter;

  // ── The rescue loop draws in (support color) during the rescue beat.
  const rescueDraw = useTransform(
    t,
    [P.rescueStart, P.rescueDrawn],
    [1, 0],
    { clamp: true, ease: EXPO_OUT },
  );
  const rescueOpacity = useTransform(
    t,
    [P.rescueStart, P.rescueStart + 0.02],
    [0, 1],
  );

  // ── The support check (firma) draws in after the loop hooks the clock.
  const checkDraw = useTransform(t, [P.checkIn, P.checkIn + 0.06], [1, 0], {
    clamp: true,
    ease: EXPO_OUT,
  });
  const checkOpacity = useTransform(t, [P.checkIn, P.checkIn + 0.02], [0, 1]);

  // ── The buttermilk subrayador sweeps over "Retomar" (scaleX 0 → 1).
  const underlineScale = useTransform(
    t,
    [P.underlineStart, P.underlineEnd],
    [0, 1],
    { clamp: true, ease: EXPO_OUT },
  );
  // "Retomar" label fades in just before the underline sweeps.
  const retakeOpacity = useTransform(
    t,
    [P.rescueStart, P.rescueStart + 0.05],
    [0, 1],
  );

  // ── Global breathe → smooth fade reset → seamless loop. The whole scene dips
  // to 0 at the very end of the loop and is back at 1 when t wraps to 0.
  const sceneOpacity = useTransform(
    t,
    [0, 0.04, P.breatheEnd, P.resetEnd],
    [0, 1, 1, 0],
  );

  return (
    <div ref={rootRef} className="relative w-full">
      {/* Visually-hidden promise for assistive tech (the SVG itself is decorative). */}
      <p className="sr-only">
        Tendr mantiene viva tu cartera: cada cliente es un hilo que conecta tus
        notas, propuestas y seguimientos, y te avisa para retomar a quien llevás
        días sin contactar.
      </p>

      <motion.div
        aria-hidden="true"
        style={{ opacity: reduce ? 1 : sceneOpacity }}
        className="relative w-full"
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          fill="none"
          className="h-auto w-full overflow-visible"
          role="presentation"
        >
          {/* ── The main ink stroke (the thread / la cartera como trazo vivo). */}
          <motion.path
            d={MAIN_PATH}
            stroke="var(--color-text-primary)"
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: reduce ? 0 : mainDashoffset,
            }}
          />

          {/* ── The rescue loop (support wisp — the ONLY support-colored stroke). */}
          <motion.path
            d={RESCUE_PATH}
            stroke="var(--color-support)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: reduce ? 0 : rescueDraw,
              opacity: reduce ? 1 : rescueOpacity,
            }}
          />

          {/* ── Moment 1: the NOTE (line-art) anchored at NOTE. */}
          <Moment
            x={NOTE.x}
            y={NOTE.y}
            opacity={reduce ? 1 : note.opacity}
            offsetY={reduce ? 0 : note.y}
            filter={reduce ? "none" : note.filter}
          >
            <NoteGlyph />
          </Moment>

          {/* ── Moment 2: the ENVELOPE going out (line-art). */}
          <Moment
            x={ENVELOPE.x}
            y={ENVELOPE.y}
            opacity={reduce ? 1 : envelope.opacity}
            offsetY={reduce ? 0 : envelope.y}
            filter={reduce ? "none" : envelope.filter}
          >
            <EnvelopeGlyph />
          </Moment>

          {/* ── Moment 3: the CLOCK — falls then recovers; the rescued follow-up. */}
          <Moment
            x={CLOCK.x}
            y={CLOCK.y}
            opacity={reduce ? 1 : clockOpacity}
            offsetY={reduce ? 0 : clockFallY}
            filter={reduce ? "none" : clockBlur}
          >
            <ClockGlyph />
            {/* The support check (firma) — drawn in during the rescue. It sits on
                a small support badge at the clock's lower-right (recovered cue). */}
            <motion.path
              d="M -5 0 l 4 4 l 8 -9"
              transform="translate(18 16)"
              stroke="var(--color-support)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: reduce ? 0 : checkDraw,
                opacity: reduce ? 1 : checkOpacity,
              }}
            />
          </Moment>
        </svg>

        {/* ── Narrative micro-copy, anchored over the scene as real text (NOT in
            the SVG, so it is selectable, AA-contrast, and font-controlled).
            Positioned with percentages that track the moment anchors. */}
        <ThreadLabel
          xPct={(NOTE.x / VB_W) * 100}
          yPct={((NOTE.y + 42) / VB_H) * 100}
          opacity={reduce ? 1 : note.opacity}
          offsetY={reduce ? 0 : note.y}
          mono
        >
          9:12 · Ana
        </ThreadLabel>

        <ThreadLabel
          xPct={(ENVELOPE.x / VB_W) * 100}
          yPct={((ENVELOPE.y + 42) / VB_H) * 100}
          opacity={reduce ? 1 : envelope.opacity}
          offsetY={reduce ? 0 : envelope.y}
        >
          propuesta
        </ThreadLabel>

        <ThreadLabel
          xPct={(CLOCK.x / VB_W) * 100}
          yPct={((CLOCK.y - 46) / VB_H) * 100}
          opacity={reduce ? 1 : clockOpacity}
          offsetY={reduce ? 0 : clockFallY}
          mono
        >
          Marta · 12 días
        </ThreadLabel>

        {/* ── "Retomar" with the buttermilk subrayador (the payoff). Sits to the
            lower-right of the rescued clock loop; the underline sweeps L→R. */}
        <RetakeLabel
          xPct={((CLOCK.x + 56) / VB_W) * 100}
          yPct={((CLOCK.y + 60) / VB_H) * 100}
          labelOpacity={reduce ? 1 : retakeOpacity}
          underlineScale={reduce ? 1 : underlineScale}
        />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * SVG line-art glyphs (stroke 1.5, round caps, ink — the design contract for
 * the moments). Each glyph is drawn around its own local origin (0,0); the
 * <Moment> wrapper translates it to its anchor and applies the reveal transform.
 * ──────────────────────────────────────────────────────────────────────── */

const GLYPH_STROKE = {
  stroke: "var(--color-text-primary)",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function NoteGlyph() {
  // A note / message card with two text lines and a folded corner.
  return (
    <g {...GLYPH_STROKE}>
      <path d="M -20 -16 h 32 l 8 8 v 24 h -40 z" />
      <path d="M 12 -16 v 8 h 8" />
      <path d="M -13 -2 h 18" />
      <path d="M -13 7 h 24" />
    </g>
  );
}

function EnvelopeGlyph() {
  // An envelope with the flap and a small "send" arrow rising off the top-right
  // corner (propuesta going out).
  return (
    <g {...GLYPH_STROKE}>
      <rect x={-21} y={-15} width={42} height={30} rx={2.5} />
      <path d="M -21 -13 l 21 15 l 21 -15" />
      <path d="M 24 -20 l 7 -7 M 31 -27 l 0 6 M 31 -27 l -6 0" />
    </g>
  );
}

function ClockGlyph() {
  // A clock face with hands. Lives at local origin; the support check is layered
  // on top by the caller.
  return (
    <g {...GLYPH_STROKE}>
      <circle cx={0} cy={0} r={18} />
      <path d="M 0 -10 v 10 l 8 5" />
    </g>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Layout primitives.
 * ──────────────────────────────────────────────────────────────────────── */

function Moment({
  x,
  y,
  opacity,
  offsetY,
  filter,
  children,
}: {
  x: number;
  y: number;
  opacity: MotionValue<number> | number;
  offsetY: MotionValue<number> | number;
  filter: MotionValue<string> | string;
  children: React.ReactNode;
}) {
  // Anchor + reveal in ONE transform. Motion drives the <g> transform from
  // `style`, so the static SVG `transform="translate()"` attribute would be
  // OVERWRITTEN (and the glyph would float at 0,0 + the y delta). We therefore
  // bake the anchor into `style.x` and add the reveal delta via `offsetY` on
  // `style.y`. Both are SVG-space units (the viewBox), GPU transform.
  const ty = useTransform(() =>
    typeof offsetY === "number" ? y + offsetY : y + offsetY.get(),
  );
  return (
    <motion.g style={{ opacity, x, y: ty, filter }}>{children}</motion.g>
  );
}

function ThreadLabel({
  xPct,
  yPct,
  opacity,
  offsetY,
  mono = false,
  children,
}: {
  xPct: number;
  yPct: number;
  opacity: MotionValue<number> | number;
  offsetY: MotionValue<number> | number;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        opacity,
        y: offsetY,
      }}
      className={[
        "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap",
        mono
          ? "font-mono text-meta uppercase tracking-[0.12em] text-text-tertiary"
          : "text-body-sm text-text-secondary",
      ].join(" ")}
    >
      {children}
    </motion.span>
  );
}

function RetakeLabel({
  xPct,
  yPct,
  labelOpacity,
  underlineScale,
}: {
  xPct: number;
  yPct: number;
  labelOpacity: MotionValue<number> | number;
  underlineScale: MotionValue<number> | number;
}) {
  return (
    <motion.span
      style={{ left: `${xPct}%`, top: `${yPct}%`, opacity: labelOpacity }}
      className="pointer-events-none absolute -translate-x-1/2"
    >
      <span className="relative inline-block px-1 text-body-sm font-medium text-text-primary">
        {/* Buttermilk subrayador — the ONLY highlight use in the scene. Sits
            behind the ink glyphs (positive in-context z, never negative). */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: underlineScale }}
          className="absolute inset-x-0 bottom-[0.05em] top-[0.18em] z-0 origin-left rounded-[2px] bg-highlight"
        />
        <span className="relative z-10">Retomar</span>
      </span>
    </motion.span>
  );
}
