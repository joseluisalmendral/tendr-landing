"use client";

import { useEffect, useRef, useState } from "react";
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
 * HeroThread — "El Hilo" · DIRECTOR'S CUT (change v2-token-migration, B1-fix-4).
 *
 * Source of truth: docs/motion/hero-hilo-directors-cut.md. The v1 single-clock
 * architecture carries over; what changes is the SCORE (13.2s loop, 5 movements
 * + an overlapped reset), the ASSET geometry (hand-drawn glyphs with tilt /
 * overshoot, an ink-bleed halo, an Órbita rescue circle that CLOSES instead of a
 * double-curl), an ambient Constelación layer running in its own slow loops, and
 * deterministic A/B iteration variance.
 *
 * ONE IDEA: "tu cartera es un hilo vivo y nada se te cae." Constelación,
 * time-cascade and the single Órbita are ACCENTS on that spine, never four
 * pasted pieces.
 *
 * THE SCORE (master clock `t` ∈ [0,1] over LOOP_MS, linear; everything narrative
 * is a `useTransform` off it — zero useState for continuous values):
 *   I   Intro       0–2 600   the ink stroke draws L→R, the nib leads (expo-out).
 *   II  Build       2 400–5 600  4 moments cascade in staccato (stagger ~280ms),
 *                                each with a write-on of its timestamp. THE ritmo.
 *   III Tension     5 600–7 200  silence: the clock falls + dims. Hold of unease.
 *   IV  Resolution  7 200–10 200 the support arc draws ~330° around the clock and
 *                                CLOSES on time → clock rises → check → subrayador.
 *   V   Coda        10 200–11 600 the whole scene breathes (scale 1→1.006→1).
 *   —   Reset       11 600–13 200 the NEW stroke starts drawing WHILE the old one
 *                                fades — never a blank canvas (overlap ~500ms).
 *
 * AMBIENT (Constelación): 2 monogram chips drift in their OWN slow yoyo loops
 * (9s / 11s, coprime, separate from `t`), plus one "drifting-away" chip tied to
 * the A/B iteration. Caps at opacity .22 — never competes with a glyph.
 *
 * COLOR DISCIPLINE (design.md v2 + score §4): ink (#1F1B16) = structure (stroke,
 * nib, moments); support (#B23A86) = rescue arc + close + check + the envelope
 * swoosh @0.5 ONLY; highlight (#FFF8BB) = the "Retomar" subrayador text-bg ONLY.
 * Chips stay hairline (border-strong ring + tertiary letter). No support in the
 * ambient.
 *
 * A/B VARIANCE (no Math.random in render): an iteration counter in a `useRef`,
 * bumped in `animate`'s `onRepeat` (never in render). SSR default = A. Iter A:
 * fugaz = "propuesta vista" (eye), drifting chip = "L". Iter B: fugaz = "nota
 * nueva" (dot+line), drifting chip = "R". The spine, fall and close are always
 * identical — only two ambient details alternate.
 *
 * REDUCED MOTION (score §5): one static photo — stroke complete (no nib), 4
 * moments settled (fugaz in iter-A state), clock up + recovered, labels full (no
 * write-on), rescue circle CLOSED + check drawn + subrayador painted, 2 chips
 * still at ~.14, the drifting chip omitted, no breath.
 *
 * MOBILE (<lg, score §6): vertical-ish recompose (viewBox ~360×420), 3 moments
 * (no fugaz), 1 chip, 12s loop. Caída + close + check + subrayador intact.
 *
 * PERFORMANCE: only transform / opacity / strokeDashoffset / clip-path. The
 * master clock + ALL ambient loops pause offscreen via useInView (parked at the
 * final frame). aspect-ratio reserves space (CLS 0). Nib via offset-path.
 */

// ── Tempo ───────────────────────────────────────────────────────────────────
const LOOP_MS = 13200;
const LOOP_MS_MOBILE = 12000;

// Easings (score §2).
const EXPO_OUT = cubicBezier(0.16, 1, 0.3, 1); // the one wow: draw + circle close
const EMPHASIS = cubicBezier(0.2, 0.8, 0.2, 1); // reveals, clock recovery
const STANDARD = cubicBezier(0.4, 0, 0.2, 1); // micro, fades, the heavy fall

// ── Geometry (asset spec, viewBox 480×520) ──────────────────────────────────
const VB_W = 480;
const VB_H = 520;
const NOTE = { x: 96, y: 108 };
const ENVELOPE = { x: 268, y: 210 };
const SEED = { x: 188, y: 158 }; // the 4th, fugaz moment
const CLOCK = { x: 356, y: 392 };

// The master path — one animable path, two intentional curves (asset spec §1).
const MAIN_PATH =
  "M 40 64 " +
  "C 70 86, 78 100, 96 108 " +
  "C 156 134, 150 184, 268 210 " +
  "C 340 226, 322 360, 356 392";

// The rescue ARC (support, ~330° open at the upper-right) — NOT the v1 curl.
const RESCUE_ARC =
  "M 372 374 " +
  "C 392 384, 398 410, 384 426 " +
  "C 370 442, 342 442, 328 426 " +
  "C 314 410, 318 384, 338 374";
// The CLOSE segment — a separate path with a 4px overshoot tail (the human gesture).
const RESCUE_CLOSE =
  "M 338 374 C 350 369, 362 369, 374 374 C 378 376, 380 375, 382 372";
// The check (firma) — drawn after the close, no circular badge behind it.
const CHECK_PATH = "M 346 392 l 6 7 l 13 -16";

// ── Mobile geometry (score §6: vertical-ish, 3 moments) ──────────────────────
const VB_W_M = 360;
const VB_H_M = 420;
const NOTE_M = { x: 96, y: 80 };
const ENVELOPE_M = { x: 232, y: 196 };
const CLOCK_M = { x: 196, y: 332 };
const MAIN_PATH_M =
  "M 70 40 " +
  "C 110 60, 78 70, 96 80 " +
  "C 150 100, 250 130, 232 196 " +
  "C 220 250, 150 280, 196 332";
const RESCUE_ARC_M =
  "M 212 314 " +
  "C 232 324, 238 350, 224 366 " +
  "C 210 382, 182 382, 168 366 " +
  "C 154 350, 158 324, 178 314";
const RESCUE_CLOSE_M =
  "M 178 314 C 190 309, 202 309, 214 314 C 218 316, 220 315, 222 312";
const CHECK_PATH_M = "M 186 332 l 6 7 l 13 -16";

// Phase boundaries as fractions of the loop (score §1 / §2 timeline table).
// NOTE: the divisions are written inline (no captured-closure helper). A nested
// arrow capturing the `loopMs` param tripped a Turbopack SSR inlining bug that
// left `loopMs` undefined in the prerendered chunk — keep it flat.
function makePhases(loopMs: number) {
  return {
    // Movement I — Intro / draw.
    drawEnd: 2600 / loopMs,
    nibFadeStart: 2600 / loopMs,
    nibFadeEnd: 2850 / loopMs,
    // Movement II — Build / cascade.
    noteIn: 2400 / loopMs,
    noteLabel: 2600 / loopMs,
    envIn: 2950 / loopMs,
    envLabel: 3150 / loopMs,
    fugazIn: 3500 / loopMs,
    fugazLabel: 3700 / loopMs,
    clockIn: 4050 / loopMs,
    clockLabel: 4250 / loopMs,
    cascadeHoldEnd: 5600 / loopMs,
    // Movement III — Tension / fall.
    fallStart: 5600 / loopMs,
    fallEnd: 7000 / loopMs,
    tensionHoldEnd: 7200 / loopMs,
    // Movement IV — Resolution / close the circle.
    arcStart: 7200 / loopMs,
    arcEnd: 9100 / loopMs,
    closeStart: 9100 / loopMs,
    closeEnd: 9450 / loopMs,
    recoverStart: 9200 / loopMs,
    recoverEnd: 10000 / loopMs,
    checkStart: 9600 / loopMs,
    checkEnd: 10000 / loopMs,
    retakeStart: 9700 / loopMs,
    retakeEnd: 10050 / loopMs,
    underlineStart: 10050 / loopMs,
    underlineEnd: 10600 / loopMs,
    // Movement V — Coda / breathe.
    codaStart: 10200 / loopMs,
    codaEnd: 11600 / loopMs,
    // Reset (overlapped).
    resetStart: 11600 / loopMs,
    oldFadeEnd: 12900 / loopMs,
    newDrawStart: 12400 / loopMs,
  };
}

type Phases = ReturnType<typeof makePhases>;

// ── Hooks ─────────────────────────────────────────────────────────────────

/**
 * A moment reveal: fade-up + blur-in window anchored on the path (score #4/#6/
 * #8/#10). `peak` is the opacity ceiling (the fugaz settles at .9, others 1).
 */
function useMomentStyle(
  t: MotionValue<number>,
  start: number,
  span: number,
  peak = 1,
) {
  const opacity = useTransform(t, [start, start + span], [0, peak]);
  const y = useTransform(t, [start, start + span], [10, 0]);
  const blur = useTransform(t, [start, start + span], [6, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return { opacity, y, filter };
}

/**
 * Write-on / mask reveal for a label (score #5/#7/#9/#11): the text un-masks
 * left→right via a clip-path inset that shrinks from the right edge to 0, while
 * opacity fades in. Returns a clipPath string + opacity to spread onto a span.
 */
function useWriteOn(
  t: MotionValue<number>,
  start: number,
  span: number,
  peak = 1,
) {
  const inset = useTransform(t, [start, start + span], [100, 0], {
    clamp: true,
  });
  const clipPath = useTransform(inset, (r) => `inset(0 ${r}% 0 0)`);
  const opacity = useTransform(t, [start, start + span * 0.6], [0, peak], {
    clamp: true,
  });
  return { clipPath, opacity };
}

// ── Ambient chip (Constelación) — its own slow yoyo loop, separate from `t`. ──
function AmbientChip({
  cx,
  cy,
  letter,
  r = 13,
  active,
  reduce,
  dx = 6,
  dy = 8,
  opaLow = 0.12,
  opaHigh = 0.2,
  periodMs = 9000,
  staticOpacity = 0.14,
}: {
  cx: number;
  cy: number;
  letter: string;
  r?: number;
  active: boolean;
  reduce: boolean;
  dx?: number;
  dy?: number;
  opaLow?: number;
  opaHigh?: number;
  periodMs?: number;
  staticOpacity?: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(reduce ? staticOpacity : opaLow);

  useEffect(() => {
    if (reduce || !active) {
      x.set(0);
      y.set(0);
      opacity.set(reduce ? staticOpacity : opaLow);
      return;
    }
    const common = {
      duration: periodMs / 1000,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    };
    const cx2 = animate(x, dx, common);
    const cy2 = animate(y, dy, { ...common, duration: (periodMs * 0.82) / 1000 });
    const co = animate(opacity, opaHigh, {
      ...common,
      duration: (periodMs * 1.1) / 1000,
    });
    return () => {
      cx2.stop();
      cy2.stop();
      co.stop();
    };
  }, [active, reduce, x, y, opacity, dx, dy, opaHigh, opaLow, periodMs, staticOpacity]);

  return (
    <motion.g style={{ x, y, opacity }}>
      <g transform={`translate(${cx} ${cy})`}>
        <circle
          cx={0}
          cy={0}
          r={r}
          stroke="var(--color-border-strong)"
          strokeWidth={1.25}
          fill="none"
        />
        <text
          x={0}
          y={4.5}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize={12}
          fontWeight={600}
          fill="var(--color-text-tertiary)"
        >
          {letter}
        </text>
      </g>
    </motion.g>
  );
}

export function HeroThread() {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });

  // Mobile recompose: pick the viewBox/score at mount + on resize. SSR default
  // = desktop (matches the lg+ layout slot; mobile hydrates to the right frame).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const loopMs = isMobile ? LOOP_MS_MOBILE : LOOP_MS;
  const P: Phases = makePhases(loopMs);

  // A/B iteration parity (default A = even). Bumped in onRepeat (NOT render).
  const iterRef = useRef(0);
  const [parity, setParity] = useState<"A" | "B">("A");

  // The single continuous narrative clock. Reduced motion pins it to 1.
  const t = useMotionValue(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce || !inView) {
      t.set(1); // park at the full composed final frame
      return;
    }
    const controls = animate(t, [0, 1], {
      duration: loopMs / 1000,
      ease: "linear",
      repeat: Infinity,
      onRepeat: () => {
        iterRef.current += 1;
        setParity(iterRef.current % 2 === 0 ? "A" : "B");
      },
    });
    return () => controls.stop();
  }, [reduce, inView, t, loopMs]);

  const VBW = isMobile ? VB_W_M : VB_W;
  const VBH = isMobile ? VB_H_M : VB_H;
  const mainPath = isMobile ? MAIN_PATH_M : MAIN_PATH;
  const arcPath = isMobile ? RESCUE_ARC_M : RESCUE_ARC;
  const closePath = isMobile ? RESCUE_CLOSE_M : RESCUE_CLOSE;
  const checkPath = isMobile ? CHECK_PATH_M : CHECK_PATH;
  const note = isMobile ? NOTE_M : NOTE;
  const envelope = isMobile ? ENVELOPE_M : ENVELOPE;
  const clock = isMobile ? CLOCK_M : CLOCK;

  // ── I · Main stroke draw + nib. strokeDashoffset 1→0, expo-out.
  const drawProgress = useTransform(t, [0, P.drawEnd], [0, 1], {
    clamp: true,
    ease: EXPO_OUT,
  });
  const mainDashoffset = useTransform(drawProgress, [0, 1], [1, 0]);
  // Reset overlap: the NEW stroke starts drawing before the loop wraps, so at
  // t≈0 the dashoffset is already ~0.6 (never a blank canvas — quality bar §2).
  const mainDashWithReset = useTransform(t, (v) => {
    if (v >= P.newDrawStart) {
      // remap [newDrawStart, 1] → dashoffset [1, ~0.6]
      const f = (v - P.newDrawStart) / (1 - P.newDrawStart);
      return 1 - f * 0.4;
    }
    return mainDashoffset.get();
  });
  // Nib: leads the head of the stroke along the path, then dissolves.
  const nibOffset = useTransform(drawProgress, [0, 1], ["0%", "100%"]);
  const nibOpacity = useTransform(
    t,
    [0, 0.01, P.nibFadeStart, P.nibFadeEnd],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const nibScale = useTransform(t, [P.nibFadeStart, P.nibFadeEnd], [1, 0.6], {
    clamp: true,
  });

  // ── II · Cascade (staccato). Each moment + its write-on staggered ≥200ms.
  const span = isMobile ? 0.0167 : 0.038; // reveal window (~200ms mobile, ~500ms desktop)
  const labelSpan = isMobile ? 0.0167 : 0.034;
  const noteM = useMomentStyle(t, P.noteIn, span);
  const noteLabel = useWriteOn(t, P.noteLabel, labelSpan);
  const envM = useMomentStyle(t, P.envIn, span);
  const envLabel = useWriteOn(t, P.envLabel, labelSpan);
  const fugazM = useMomentStyle(t, P.fugazIn, span, 0.9);
  const fugazLabel = useWriteOn(t, P.fugazLabel, labelSpan, 0.75);

  // ── III · The clock falls (heavy, STANDARD) then IV recovers (EMPHASIS).
  const clockY = useTransform(
    t,
    [P.clockIn, P.fallStart, P.fallEnd, P.recoverStart, P.recoverEnd],
    [10, 0, 16, 16, 0],
    { ease: STANDARD },
  );
  const clockOpacity = useTransform(
    t,
    [
      P.clockIn,
      P.clockIn + span,
      P.fallStart,
      P.fallEnd,
      P.recoverStart,
      P.recoverEnd,
    ],
    [0, 1, 1, 0.32, 0.32, 1],
  );
  const clockBlur = useTransform(
    t,
    [P.clockIn, P.clockIn + span, P.fallStart, P.fallEnd, P.recoverStart, P.recoverEnd],
    [6, 0, 0, 1.5, 1.5, 0],
  );
  const clockFilter = useTransform(clockBlur, (b) => `blur(${b}px)`);

  // ── IV · Rescue ARC draws to a visible GAP, then the CLOSE segment shuts it.
  const arcDraw = useTransform(t, [P.arcStart, P.arcEnd], [1, 0.08], {
    clamp: true,
    ease: EXPO_OUT,
  });
  const arcOpacity = useTransform(
    t,
    [P.arcStart, P.arcStart + 0.012],
    [0, 1],
    { clamp: true },
  );
  const closeDraw = useTransform(t, [P.closeStart, P.closeEnd], [1, 0], {
    clamp: true,
    ease: EMPHASIS,
  });
  const closeOpacity = useTransform(
    t,
    [P.closeStart, P.closeStart + 0.008],
    [0, 1],
    { clamp: true },
  );

  // The check (firma) draws in after the close.
  const checkDraw = useTransform(t, [P.checkStart, P.checkEnd], [1, 0], {
    clamp: true,
    ease: EXPO_OUT,
  });
  const checkOpacity = useTransform(
    t,
    [P.checkStart, P.checkStart + 0.008],
    [0, 1],
    { clamp: true },
  );

  // "Retomar" label + buttermilk subrayador (scaleX 0→1, the only highlight).
  const retakeOpacity = useTransform(t, [P.retakeStart, P.retakeEnd], [0, 1], {
    clamp: true,
  });
  const retakeY = useTransform(t, [P.retakeStart, P.retakeEnd], [6, 0], {
    clamp: true,
  });
  const underlineScale = useTransform(
    t,
    [P.underlineStart, P.underlineEnd],
    [0, 1],
    { clamp: true, ease: EXPO_OUT },
  );

  // ── V · Coda breath (whole scene scale 1→1.006→1) — STANDARD ease-in-out.
  const breathScale = useTransform(
    t,
    [P.codaStart, (P.codaStart + P.codaEnd) / 2, P.codaEnd],
    [1, isMobile ? 1.004 : 1.006, 1],
    { ease: STANDARD },
  );

  // ── Reset · the TRANSIENT layer (moments + rescue + labels) fades out while
  // the SPINE (ink-bleed + main stroke + nib) stays full-opacity and the NEW
  // stroke is ALREADY redrawing over it. The spine never fades — it just
  // redraws each loop — which is what guarantees "never a blank canvas"
  // (quality bar §2): even at 12900–13200ms the fresh stroke is visible.
  const transientOpacity = useTransform(
    t,
    [0, 0.03, P.resetStart, P.oldFadeEnd],
    [1, 1, 1, 0],
    { clamp: true },
  );

  // Fugaz / drifting-chip variant by parity (reduced motion uses A).
  const fugazVariant = reduce ? "A" : parity;
  const driftLetter = fugazVariant === "A" ? "L" : "R";

  return (
    <div ref={rootRef} className="relative w-full">
      <p className="sr-only">
        Tendr mantiene viva tu cartera: cada cliente es un hilo que conecta tus
        notas, propuestas y seguimientos, y te avisa para retomar a quien llevás
        días sin contactar.
      </p>

      <motion.div
        aria-hidden="true"
        style={{
          scale: reduce ? 1 : breathScale,
        }}
        className="relative w-full"
      >
        <svg
          viewBox={`0 0 ${VBW} ${VBH}`}
          fill="none"
          className="h-auto w-full overflow-visible"
          style={{ aspectRatio: `${VBW} / ${VBH}` }}
          role="presentation"
        >
          {/* z0 · Ambient Constelación (own loops). Mobile: 1 chip. ≤480: 0. */}
          <AmbientChip
            cx={isMobile ? 56 : 70}
            cy={isMobile ? 300 : 300}
            letter="A"
            r={13}
            active={inView}
            reduce={reduce}
            dx={isMobile ? 4 : 6}
            dy={isMobile ? 4 : 8}
            opaHigh={isMobile ? 0.16 : 0.22}
            periodMs={9000}
          />
          {!isMobile && (
            <>
              <AmbientChip
                cx={420}
                cy={140}
                letter="M"
                r={12}
                active={inView}
                reduce={reduce}
                dx={7}
                dy={5}
                opaLow={0.1}
                opaHigh={0.2}
                periodMs={11000}
              />
              {/* The "drifting-away" chip (L iter-A / R iter-B) — omitted under
                  reduced motion (score §5). */}
              {!reduce && (
                <DriftingChip
                  letter={driftLetter}
                  active={inView}
                  loopMs={loopMs}
                />
              )}
            </>
          )}

          {/* z10 · Ink-bleed halo (static texture, 5%, blur) — under the stroke. */}
          <path
            d={mainPath}
            stroke="var(--color-text-primary)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.05}
            style={{ filter: "blur(0.6px)" }}
          />

          {/* z10 · The main ink stroke (the spine). */}
          <motion.path
            d={mainPath}
            stroke="var(--color-text-primary)"
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: reduce ? 0 : mainDashWithReset,
            }}
          />

          {/* z10 · The nib (ink head) — rides the path via offset-path, dissolves. */}
          {!reduce && (
            <motion.circle
              r={3.2}
              fill="var(--color-text-primary)"
              style={{
                offsetPath: `path("${mainPath}")`,
                offsetDistance: nibOffset,
                opacity: nibOpacity,
                scale: nibScale,
              }}
            />
          )}

          {/* TRANSIENT layer — fades during the reset while the spine above stays
              and the new stroke redraws (quality bar §2: never a blank canvas). */}
          <motion.g style={{ opacity: reduce ? 1 : transientOpacity }}>
          {/* z25 · Rescue arc (support) — draws to a visible gap. */}
          <motion.path
            d={arcPath}
            stroke="var(--color-support)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: reduce ? 0 : arcDraw,
              opacity: reduce ? 1 : arcOpacity,
            }}
          />
          {/* z25 · The CLOSE segment (separate path, overshoot tail). */}
          <motion.path
            d={closePath}
            stroke="var(--color-support)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: reduce ? 0 : closeDraw,
              opacity: reduce ? 1 : closeOpacity,
            }}
          />
          {/* z25 · The check (firma) — no badge behind it. */}
          <motion.path
            d={checkPath}
            stroke="var(--color-support)"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: reduce ? 0 : checkDraw,
              opacity: reduce ? 1 : checkOpacity,
            }}
          />

          {/* z20 · Moments (ink glyphs). NOTE → ENVELOPE → (SEED fugaz) → CLOCK. */}
          <Moment
            x={note.x}
            y={note.y}
            opacity={reduce ? 1 : noteM.opacity}
            offsetY={reduce ? 0 : noteM.y}
            filter={reduce ? "none" : noteM.filter}
          >
            <NoteGlyph />
          </Moment>

          <Moment
            x={envelope.x}
            y={envelope.y}
            opacity={reduce ? 1 : envM.opacity}
            offsetY={reduce ? 0 : envM.y}
            filter={reduce ? "none" : envM.filter}
          >
            <EnvelopeGlyph />
          </Moment>

          {/* Fugaz 4th moment — desktop only (score §6 drops it on mobile). */}
          {!isMobile && (
            <Moment
              x={SEED.x}
              y={SEED.y}
              opacity={reduce ? 0.9 : fugazM.opacity}
              offsetY={reduce ? 0 : fugazM.y}
              filter={reduce ? "none" : fugazM.filter}
            >
              {fugazVariant === "A" ? <EyeGlyph /> : <NewNoteGlyph />}
            </Moment>
          )}

          <Moment
            x={clock.x}
            y={clock.y}
            opacity={reduce ? 1 : clockOpacity}
            offsetY={reduce ? 0 : clockY}
            filter={reduce ? "none" : clockFilter}
          >
            <ClockGlyph />
          </Moment>
          </motion.g>
        </svg>

        {/* z30 · Narrative micro-copy as real HTML over the SVG (selectable, AA),
            with a write-on clip reveal. Percentages track the moment anchors.
            Wrapped in the transient layer so it fades with the moments on reset
            (the spine SVG above does not fade). */}
        <motion.div
          style={{ opacity: reduce ? 1 : transientOpacity }}
          className="pointer-events-none absolute inset-0"
        >
        <ThreadLabel
          xPct={(note.x / VBW) * 100}
          yPct={((note.y + 44) / VBH) * 100}
          clipPath={reduce ? "none" : noteLabel.clipPath}
          opacity={reduce ? 1 : noteLabel.opacity}
          mono
        >
          9:12 · Ana
        </ThreadLabel>

        <ThreadLabel
          xPct={(envelope.x / VBW) * 100}
          yPct={((envelope.y + 44) / VBH) * 100}
          clipPath={reduce ? "none" : envLabel.clipPath}
          opacity={reduce ? 1 : envLabel.opacity}
        >
          propuesta
        </ThreadLabel>

        {!isMobile && (
          <ThreadLabel
            xPct={(SEED.x / VBW) * 100}
            yPct={((SEED.y + 40) / VBH) * 100}
            clipPath={reduce ? "none" : fugazLabel.clipPath}
            opacity={reduce ? 0.75 : fugazLabel.opacity}
            mono
            dim
          >
            {fugazVariant === "A" ? "visto" : "nota"}
          </ThreadLabel>
        )}

        <ThreadLabel
          xPct={(clock.x / VBW) * 100}
          yPct={((clock.y - 48) / VBH) * 100}
          clipPath={reduce ? "none" : "none"}
          opacity={reduce ? 1 : clockOpacity}
          offsetY={reduce ? 0 : clockY}
          mono
        >
          Marta · 12 días
        </ThreadLabel>

        <RetakeLabel
          xPct={((clock.x + (isMobile ? 0 : 60)) / VBW) * 100}
          yPct={((clock.y + 62) / VBH) * 100}
          labelOpacity={reduce ? 1 : retakeOpacity}
          labelY={reduce ? 0 : retakeY}
          underlineScale={reduce ? 1 : underlineScale}
        />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * The "drifting-away" ambient chip (L iter-A / R iter-B). Drives x outward +
 * opacity down, with a small recovery near the rescue beat (eco visual). Own
 * loop tied to the iteration length.
 * ──────────────────────────────────────────────────────────────────────── */
function DriftingChip({
  letter,
  active,
  loopMs,
}: {
  letter: string;
  active: boolean;
  loopMs: number;
}) {
  const x = useMotionValue(0);
  const opacity = useMotionValue(0.18);

  useEffect(() => {
    if (!active) {
      x.set(0);
      opacity.set(0.18);
      return;
    }
    const cx = animate(x, 14, {
      duration: loopMs / 1000,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    });
    // Drift down to .06, then a small recovery to .14 (the rescue echo).
    const co = animate(opacity, [0.18, 0.06, 0.14, 0.18], {
      duration: loopMs / 1000,
      times: [0, 0.5, 0.62, 1],
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => {
      cx.stop();
      co.stop();
    };
  }, [active, x, opacity, loopMs]);

  return (
    <motion.g style={{ x, opacity }}>
      <g transform="translate(150 440)">
        <circle
          cx={0}
          cy={0}
          r={11}
          stroke="var(--color-border-strong)"
          strokeWidth={1.25}
          fill="none"
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize={11}
          fontWeight={600}
          fill="var(--color-text-tertiary)"
        >
          {letter}
        </text>
      </g>
    </motion.g>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * SVG line-art glyphs (asset spec §2). ONE pen: stroke 1.9, round caps/joins,
 * ink, fill:none. Each carries a static tilt + an intentional imperfection
 * (torn edge / overshoot) so it reads HAND-DRAWN, not clipart. Hairline details
 * (ticks, hub) at 1.5 / opacity .7. The wrapper translates to the anchor.
 * ──────────────────────────────────────────────────────────────────────── */
const GLYPH_STROKE = {
  stroke: "var(--color-text-primary)",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function NoteGlyph() {
  // Torn-paper note, tilt -4°. The ragged bottom edge kills the clipart read.
  return (
    <g transform="rotate(-4)" {...GLYPH_STROKE}>
      <path
        d="M -22 -18 C -10 -20, 8 -20, 14 -18 L 22 -10 L 22 12
           c -6 4, -10 -2, -16 2 c -5 3, -9 -1, -14 2 c -4 2, -8 -1, -14 1 Z"
      />
      <path d="M 14 -18 L 14 -10 L 22 -10" />
      <path d="M -15 -4 q 6 -3 12 0 t 12 0" />
      <path d="M -15 5 q 5 -3 11 0 t 9 0" />
    </g>
  );
}

function EnvelopeGlyph() {
  // Open envelope + sheet peeking + support swoosh (the only support in a glyph).
  return (
    <>
      <g transform="rotate(3)" {...GLYPH_STROKE}>
        <path d="M -22 -6 L 20 -8 L 23 16 L -20 18 Z" />
        <path d="M -22 -6 L 1 6 L 24 -8" />
        <path d="M -8 -10 L -6 -28 L 12 -26 L 11 -9" />
        <path d="M -4 -22 h 11   M -3 -17 h 10" />
      </g>
      <path
        d="M -30 4 h 7   M -34 11 h 5   M -30 18 h 6"
        stroke="var(--color-support)"
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.5}
      />
    </>
  );
}

function ClockGlyph() {
  // Oval face, 10:10 hands, worry ticks, tilt -2°. NO eyes/sweat (anti-kitsch).
  return (
    <g transform="rotate(-2)" {...GLYPH_STROKE}>
      <path
        d="M 0 -17
           C 11 -17, 19 -9, 19 1
           C 19 11, 10 17, 0 17
           C -11 17, -19 10, -19 0
           C -19 -10, -10 -17, 0 -17
           C 4 -17, 7 -16, 9 -15"
      />
      <path d="M 0 0 L -7 -8" />
      <path d="M 0 0 L 9 -4" />
      <circle cx={0} cy={0} r={1.4} fill="var(--color-text-primary)" stroke="none" />
      <path
        d="M 16 -16 q 3 -2 5 -1   M 19 -10 q 3 -1 4 1"
        strokeWidth={1.5}
        opacity={0.7}
      />
    </g>
  );
}

function EyeGlyph() {
  // Fugaz iter-A: "propuesta vista" — a small eye (~26px), tilt -6°.
  return (
    <g transform="rotate(-6)" {...GLYPH_STROKE} strokeWidth={1.7}>
      <path d="M -11 0 C -6 -6, 6 -6, 11 0 C 6 6, -6 6, -11 0 Z" />
      <circle cx={0} cy={0} r={2.4} />
    </g>
  );
}

function NewNoteGlyph() {
  // Fugaz iter-B: "nota nueva" — a dot + a short line (~26px), tilt -6°.
  return (
    <g transform="rotate(-6)" {...GLYPH_STROKE} strokeWidth={1.7}>
      <circle cx={-8} cy={0} r={2.4} fill="var(--color-text-primary)" stroke="none" />
      <path d="M -2 -4 h 14   M -2 2 h 10" />
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
  // motion.g drives `transform` from `style`, which would OVERWRITE a static
  // SVG transform attr. So we bake the anchor into style.x and add the reveal
  // delta into style.y (both SVG-space). The inner <g> owns the glyph's tilt.
  const ty = useTransform(() =>
    typeof offsetY === "number" ? y + offsetY : y + offsetY.get(),
  );
  return <motion.g style={{ opacity, x, y: ty, filter }}>{children}</motion.g>;
}

function ThreadLabel({
  xPct,
  yPct,
  opacity,
  offsetY = 0,
  clipPath = "none",
  mono = false,
  dim = false,
  children,
}: {
  xPct: number;
  yPct: number;
  opacity: MotionValue<number> | number;
  offsetY?: MotionValue<number> | number;
  clipPath?: MotionValue<string> | string;
  mono?: boolean;
  dim?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      style={{ left: `${xPct}%`, top: `${yPct}%`, opacity, y: offsetY, clipPath }}
      className={[
        "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap",
        mono
          ? `font-mono text-meta uppercase tracking-[0.12em] ${
              dim ? "text-text-tertiary/70" : "text-text-tertiary"
            }`
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
  labelY,
  underlineScale,
}: {
  xPct: number;
  yPct: number;
  labelOpacity: MotionValue<number> | number;
  labelY: MotionValue<number> | number;
  underlineScale: MotionValue<number> | number;
}) {
  return (
    <motion.span
      style={{ left: `${xPct}%`, top: `${yPct}%`, opacity: labelOpacity, y: labelY }}
      className="pointer-events-none absolute -translate-x-1/2"
    >
      <span className="relative inline-block px-1 text-body-sm font-medium text-text-primary">
        {/* Buttermilk subrayador — the ONLY highlight use (asset §5). The OUTER
            span carries the static -2.2° tilt + irregular marker-end radius; the
            INNER motion.span does the scaleX sweep (separating the two transforms
            so Motion's scaleX doesn't clobber the rotate). insets: x -2px
            (marker overshoot), top 0.32em, bottom 0.04em. */}
        <span
          aria-hidden="true"
          className="absolute z-0 overflow-hidden"
          style={{
            left: "-2px",
            right: "-2px",
            top: "0.32em",
            bottom: "0.04em",
            transform: "rotate(-2.2deg)",
            borderRadius: "3px 6px 5px 8px / 6px 4px 7px 5px",
          }}
        >
          <motion.span
            style={{ scaleX: underlineScale }}
            className="block h-full w-full origin-left bg-highlight"
          />
        </span>
        <span className="relative z-10">Retomar</span>
      </span>
    </motion.span>
  );
}
