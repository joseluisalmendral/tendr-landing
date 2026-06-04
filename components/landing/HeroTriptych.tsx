"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  cubicBezier,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";

/**
 * HeroTriptych — "El día de tu cartera, en bucle" (change v2-token-migration,
 * B1-fix-5). Replaces the single-act HeroThread with the 3-act sequential piece.
 *
 * Source of truth: docs/motion/hero-triptico-score.md (MASTER), with per-act
 * detail in acto-1-hilo.md / acto-2-constelacion.md / acto-3-cascada.md and the
 * SVG asset language in hero-hilo-directors-cut.md PARTE 2. The master score
 * OVERRIDES the act specs on anything transversal (clock, joints, shared
 * furniture, color, mobile, reduced-motion).
 *
 * GLOBAL CLOCK (master §1.1): ONE `useMotionValue(T)` linear over CYCLE_MS
 * (21 600ms desktop), repeat Infinity. Each act derives its local t∈[0,1] by
 * remapping its third of T. Handoff overlap bands (last 600ms of each act) keep
 * the incoming act rendering before the outgoing dissolves — never a blank
 * canvas (quality bar §5). Ambient drift + breath run in SEPARATE loops with
 * coprime periods, never tied to T.
 *
 *   Acto I   "El Hilo"        T 0.000–0.333   (0      → 7 200ms)
 *   Acto II  "Constelación"   T 0.333–0.667   (7 200  → 14 400ms)
 *   Acto III "El día…"        T 0.667–1.000   (14 400 → 21 600ms)
 *
 * THE THREE JOINTS (master §2): J1 route→6 chips (M A L J S R), J2 chips→column
 * (3 migrate A/M/L, 3 farewell J/S/R, D + ✦IA born in III), J3 condensación→
 * órbita→nib relaunch into Acto I.
 *
 * SHARED FURNITURE (master §3): cursor "tú" spring 220/26, AI pill ✦IA + bubble
 * (typing 32ms/char), click ring scale .3→1.6 opacity .9→0 ink, chip sizes
 * (ambient / constelación 36px / timeline 24px). Color discipline §4: per act
 * max 1 ✦, 1 pink support gesture, 1 buttermilk highlight (I + III only).
 *
 * REDUCED MOTION (master §5): T pinned to the Acto I resolved frame (≈0.27 →
 * here we render Act I composed final). MOBILE <lg (master §6): Acto I only,
 * vertical, 7s loop, indicator 01 active (static).
 *
 * PERFORMANCE: only transform / opacity / strokeDashoffset / clip-path. Global
 * clock + ambient + breath pause offscreen via useInView. aspect-ratio reserves
 * space (CLS 0). The mobile path renders Acto I exactly as the standalone score.
 */

// ── Cycle tempo (master §1.2) ────────────────────────────────────────────────
const CYCLE_MS = 21600; // desktop triptych
const ACT_MS_MOBILE = 7000; // mobile = Acto I only, 7s loop

// Easings (shared system).
const EXPO_OUT = cubicBezier(0.16, 1, 0.3, 1);
const EMPHASIS = cubicBezier(0.2, 0.8, 0.2, 1);
const STANDARD = cubicBezier(0.4, 0, 0.2, 1);

// Cursor spring (canon §3a) — unified 220/26 across all acts.
const CURSOR_SPRING = { stiffness: 220, damping: 26 } as const;
const CHIP_DRAG_SPRING = { stiffness: 170, damping: 22 } as const;

// ── Shared geometry (viewBox 480×520) ────────────────────────────────────────
const VB_W = 480;
const VB_H = 520;

// Acto I anchors (directors-cut PARTE 2).
const NOTE = { x: 96, y: 108 };
const ENVELOPE = { x: 268, y: 210 };
const SEED = { x: 188, y: 158 };
const CLOCK = { x: 356, y: 392 };
const MAIN_PATH =
  "M 40 64 C 70 86, 78 100, 96 108 C 156 134, 150 184, 268 210 C 340 226, 322 360, 356 392";
const CHECK_I = "M 346 392 l 6 7 l 13 -16";

// Acto II constelación rest coords (acto-2 §3), monogram M = Marta (master D10).
const CONSTELLATION: Array<{
  key: string;
  letter: string;
  label: string;
  x: number;
  y: number;
  tier: "front" | "mid" | "back";
  scale: number;
  opacity: number;
  blur: number;
  // scatter = incoming flight vector (offscreen-ish) for the catch&settle (J1).
  sx: number;
  sy: number;
  side: "right" | "left" | "below";
  farewell: boolean; // J/S/R fade out before column align (J2 / master D7)
}> = [
  { key: "M", letter: "M", label: "Marta", x: 130, y: 150, tier: "front", scale: 1, opacity: 1, blur: 0, sx: 70, sy: 30, side: "right", farewell: false },
  { key: "A", letter: "A", label: "Ana", x: 330, y: 120, tier: "front", scale: 1, opacity: 1, blur: 0, sx: 480, sy: 40, side: "left", farewell: false },
  { key: "L", letter: "L", label: "Lucía", x: 300, y: 300, tier: "front", scale: 1, opacity: 1, blur: 0, sx: 470, sy: 470, side: "below", farewell: false },
  { key: "J", letter: "J", label: "Jorge", x: 90, y: 320, tier: "mid", scale: 0.9, opacity: 0.82, blur: 0.3, sx: 10, sy: 470, side: "right", farewell: true },
  { key: "S", letter: "S", label: "Sofía", x: 390, y: 360, tier: "mid", scale: 0.9, opacity: 0.82, blur: 0.3, sx: 500, sy: 360, side: "left", farewell: true },
  { key: "R", letter: "R", label: "Rubén", x: 200, y: 430, tier: "back", scale: 0.8, opacity: 0.62, blur: 0.6, sx: 200, sy: 540, side: "below", farewell: true },
];
const LUCIA_DRIFT = { dx: 34, dy: -12 }; // at-risk derive (acto-2 §2 beat 4)

// Acto III timeline rows (acto-3 §3). Axis x=96, leading 76px, max 5 rows.
const AXIS_X = 96;
const AXIS_Y0 = 72;
const AXIS_Y1 = 452;
const ROWS = [
  { key: "A", letter: "A", ts: "9:12", event: "escribiste a Ana", y: 108, check: false },
  { key: "M", letter: "M", ts: "11:40", event: "propuesta enviada", y: 184, check: true },
  { key: "D", letter: "D", ts: "13:05", event: "nota añadida a Diego", y: 260, check: false },
  { key: "L", letter: "L", ts: "16:20", event: "Lucía respondió", y: 336, check: false },
];
const AI_ROW_Y = 420;
const CHECK_III = "M 0 0 l 5 6 l 11 -14"; // anchored at (372,184)

// Acto III órbita close (J3) — reuse the directors-cut rescue geometry, small.
const ORBITA_ARC =
  "M 110 100 C 122 104, 124 116, 116 124 C 108 132, 92 132, 84 124 C 76 116, 78 104, 90 100";
const ORBITA_CLOSE = "M 90 100 C 96 96, 104 96, 110 100 C 113 102, 114 101, 115 99";

// ── Mobile geometry (Acto I vertical, master §6 / acto-1 §7) ──────────────────
const VB_W_M = 360;
const VB_H_M = 420;
const NOTE_M = { x: 96, y: 80 };
const ENVELOPE_M = { x: 232, y: 196 };
const CLOCK_M = { x: 196, y: 332 };
const MAIN_PATH_M =
  "M 70 40 C 110 60, 78 70, 96 80 C 150 100, 250 130, 232 196 C 220 250, 150 280, 196 332";
const CHECK_M = "M 186 332 l 6 7 l 13 -16";

// ── Hooks ─────────────────────────────────────────────────────────────────

/** A moment reveal: fade-up + blur-in, anchored on the path. */
function useMomentStyle(t: MotionValue<number>, start: number, span: number, peak = 1) {
  const opacity = useTransform(t, [start, start + span], [0, peak], { clamp: true });
  const y = useTransform(t, [start, start + span], [10, 0], { clamp: true });
  const blur = useTransform(t, [start, start + span], [6, 0], { clamp: true });
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return { opacity, y, filter };
}

/** Write-on (clip-path inset right→0) + opacity, for labels & typing reveals. */
function useWriteOn(t: MotionValue<number>, start: number, span: number, peak = 1) {
  const inset = useTransform(t, [start, start + span], [100, 0], { clamp: true });
  const clipPath = useTransform(inset, (r) => `inset(0 ${r}% 0 0)`);
  const opacity = useTransform(t, [start, start + span * 0.6], [0, peak], { clamp: true });
  return { clipPath, opacity };
}

/**
 * Typing reveal (canon §3b): incremental substring by index, n derived from t
 * via floor — discrete step, no Math.random, SSR-safe. Returns the visible
 * substring as a MotionValue<string>.
 */
function useTyping(t: MotionValue<number>, start: number, end: number, text: string) {
  return useTransform(t, (v) => {
    if (v <= start) return "";
    if (v >= end) return text;
    const f = (v - start) / (end - start);
    return text.slice(0, Math.floor(f * text.length));
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED FURNITURE
// ════════════════════════════════════════════════════════════════════════════

/**
 * Cursor "tú" — HTML overlay arrow + name chip + click ring (canon §3a).
 * All props are MotionValues (callers always animate it). `xPct`/`yPct` are the
 * cursor position as percentages of the box; `ringActive` 0→1 fires the ring.
 */
function CursorTu({
  xPct,
  yPct,
  opacity,
  ringActive,
}: {
  xPct: MotionValue<number>;
  yPct: MotionValue<number>;
  opacity: MotionValue<number>;
  ringActive: MotionValue<number>;
}) {
  const left = useTransform(xPct, (v) => `${v}%`);
  const top = useTransform(yPct, (v) => `${v}%`);
  const ringScale = useTransform(ringActive, [0, 1], [0.3, 1.6]);
  const ringOpacity = useTransform(ringActive, [0, 0.01, 1], [0, 0.9, 0]);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left, top, opacity }}
    >
      <div className="relative">
        {/* Click ring = "lo máquina" (Folk Twins): el click es la acción
            asistida/automatizada, así que el anillo usa cobalt. */}
        <motion.span
          className="absolute left-0 top-0 block size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-support-cobalt"
          style={{ scale: ringScale, opacity: ringOpacity }}
        />
        <svg width="16" height="20" viewBox="0 0 16 20" className="block">
          <path d="M0 0 L0 16 L4 12 L7 18 L9 17 L6 11 L11 11 Z" fill="var(--color-text-primary)" />
        </svg>
        <span className="absolute left-3 top-4 whitespace-nowrap rounded-full border border-border-hairline bg-surface-raised px-1.5 py-0.5 font-mono text-[11px] leading-none text-text-secondary">
          tú
        </span>
      </div>
    </motion.div>
  );
}

/** AI pill "✦ IA" (canon §3b). `withStar` controls the ✦ glyph in the pill. */
function AiPill({
  opacity,
  y,
  withStar = true,
}: {
  opacity: MotionValue<number>;
  y?: MotionValue<number>;
  withStar?: boolean;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-flex items-center gap-1 rounded-full border border-border-hairline bg-surface-raised px-2.5 py-1 shadow-soft"
      style={{ opacity, y: y ?? 0 }}
    >
      {withStar && (
        <svg width="10" height="10" viewBox="-5 -5 10 10" className="block">
          <path
            d="M0 -4.5 L1.1 -1.1 L4.5 0 L1.1 1.1 L0 4.5 L-1.1 1.1 L-4.5 0 L-1.1 -1.1 Z"
            fill="var(--color-support-cobalt)"
          />
        </svg>
      )}
      {/* "lo máquina" (Folk Twins): el label IA usa el grado de TEXTO del cobalt
          (#1F4C94) para pasar AA en 11px; el ✦ usa el cobalt de stroke. */}
      <span className="font-mono text-[11px] leading-none text-support-cobalt-fg">IA</span>
    </motion.span>
  );
}

/**
 * AI suggestion bubble (canon §3b). `text` is the live typed substring; `done`
 * (0→1 MotionValue) settles text-secondary→primary. `trailingStar` appends the
 * ✦ once done (Acto III only). `underline` (0→1) draws a hand-drawn support
 * underline under the suggestion (Acto I beat 16). Hooks are unconditional;
 * unused outputs are simply not bound.
 */
function AiBubble({
  opacity,
  scale,
  text,
  done,
  trailingStar = false,
  underline,
  withUnderline = false,
  className,
}: {
  opacity: MotionValue<number>;
  scale?: MotionValue<number>;
  text: MotionValue<string> | string;
  done: MotionValue<number>;
  trailingStar?: boolean;
  underline: MotionValue<number>;
  withUnderline?: boolean;
  className?: string;
}) {
  const color = useTransform(done, [0, 1], ["var(--color-text-secondary)", "var(--color-text-primary)"]);
  const ulDash = useTransform(underline, [0, 1], [1, 0]);
  return (
    <motion.div
      aria-hidden="true"
      className={[
        "inline-block max-w-[150px] rounded-md border border-border-hairline bg-surface-raised px-3 py-2 shadow-soft",
        className ?? "",
      ].join(" ")}
      style={{ opacity, scale: scale ?? 1, originX: 0, originY: 0 }}
    >
      <span className="relative inline-block text-body-sm leading-snug">
        <motion.span style={{ color }}>{text as never}</motion.span>
        {trailingStar && (
          <motion.span className="text-support-cobalt" style={{ opacity: done }}>
            {" ✦"}
          </motion.span>
        )}
        {withUnderline && (
          <span aria-hidden="true" className="absolute -bottom-1 left-0 block h-[5px] w-full overflow-hidden">
            <svg viewBox="0 0 140 8" preserveAspectRatio="none" className="block h-full w-full">
              <motion.path
                d="M 2 5 q 68 5 136 0"
                stroke="var(--color-support-cobalt)"
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: ulDash }}
              />
            </svg>
          </span>
        )}
      </span>
    </motion.div>
  );
}

/** Act indicator 01·02·03 (master §1.3). HTML, z50, below the stage. */
function ActIndicator({ active }: { active: 1 | 2 | 3 }) {
  return (
    <div
      aria-hidden="true"
      className="mt-4 flex items-center justify-center gap-3 font-mono text-[13px] tracking-[0.12em]"
    >
      {([1, 2, 3] as const).map((n) => {
        const on = n === active;
        return (
          <span key={n} className="inline-flex items-center gap-1.5">
            {/* Indicador de acto 01·02·03 = "progreso" (Folk Twins): el dot
                activo usa teal. B3-fix-1: NO se alterna aquí. Sólo hay UN dot
                visible a la vez (los otros dos van a opacity:0), así que no
                existe un run de hermanos adyacentes del mismo matiz; el dot
                activo conserva el rol de bloque (progreso=teal). Lectura más
                calmada que numerar 01/02/03 en tres matices distintos. */}
            <span
              className="block size-1 rounded-full bg-support-teal transition-opacity duration-200"
              style={{ opacity: on ? 1 : 0 }}
            />
            <span
              className="transition-colors duration-200"
              style={{ color: on ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}
            >
              {String(n).padStart(2, "0")}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Folk Twins monogram rotation (B2-fix-1): client monograms/chips rotate the
 * support family by index%3 → wisp (firma) · cobalt (máquina) · teal (progreso).
 * Returns the chip ring stroke color for a given chip index. The ambient chips
 * stay neutral (border-strong) — only addressable client monograms rotate.
 */
const MONOGRAM_HUES = [
  "var(--color-support)",
  "var(--color-support-cobalt)",
  "var(--color-support-teal)",
] as const;
function monogramHue(index: number) {
  return MONOGRAM_HUES[((index % 3) + 3) % 3];
}

/** A client chip ring + monogram (canon §3c). Sizes: ambient/const/timeline.
 * `ringStroke` overrides the neutral border-strong ring (Folk Twins rotation). */
function ChipRing({ r, letter, stroke = 1.5, fill = "var(--color-text-secondary)", fontSize = 17, ringStroke = "var(--color-border-strong)" }: {
  r: number;
  letter: string;
  stroke?: number;
  fill?: string;
  fontSize?: number;
  ringStroke?: string;
}) {
  return (
    <>
      <circle cx={0} cy={0} r={r} stroke={ringStroke} strokeWidth={stroke} fill="none" />
      <text
        x={0}
        y={fontSize * 0.34}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize={fontSize}
        fontWeight={600}
        fill={fill}
      >
        {letter}
      </text>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GLYPHS (directors-cut PARTE 2 §2) — one pen, tilt + imperfection.
// ════════════════════════════════════════════════════════════════════════════
const GLYPH_STROKE = {
  stroke: "var(--color-text-primary)",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function NoteGlyph() {
  return (
    <g transform="rotate(-4)" {...GLYPH_STROKE}>
      <path d="M -22 -18 C -10 -20, 8 -20, 14 -18 L 22 -10 L 22 12 c -6 4, -10 -2, -16 2 c -5 3, -9 -1, -14 2 c -4 2, -8 -1, -14 1 Z" />
      <path d="M 14 -18 L 14 -10 L 22 -10" />
      <path d="M -15 -4 q 6 -3 12 0 t 12 0" />
      <path d="M -15 5 q 5 -3 11 0 t 9 0" />
    </g>
  );
}

function EnvelopeGlyph() {
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
  return (
    <g transform="rotate(-2)" {...GLYPH_STROKE}>
      <path d="M 0 -17 C 11 -17, 19 -9, 19 1 C 19 11, 10 17, 0 17 C -11 17, -19 10, -19 0 C -19 -10, -10 -17, 0 -17 C 4 -17, 7 -16, 9 -15" />
      <path d="M 0 0 L -7 -8" />
      <path d="M 0 0 L 9 -4" />
      <circle cx={0} cy={0} r={1.4} fill="var(--color-text-primary)" stroke="none" />
      <path d="M 16 -16 q 3 -2 5 -1   M 19 -10 q 3 -1 4 1" strokeWidth={1.5} opacity={0.7} />
    </g>
  );
}

function EyeGlyph() {
  return (
    <g transform="rotate(-6)" {...GLYPH_STROKE} strokeWidth={1.7}>
      <path d="M -11 0 C -6 -6, 6 -6, 11 0 C 6 6, -6 6, -11 0 Z" />
      <circle cx={0} cy={0} r={2.4} />
    </g>
  );
}

function NewNoteGlyph() {
  return (
    <g transform="rotate(-6)" {...GLYPH_STROKE} strokeWidth={1.7}>
      <circle cx={-8} cy={0} r={2.4} fill="var(--color-text-primary)" stroke="none" />
      <path d="M -2 -4 h 14   M -2 2 h 10" />
    </g>
  );
}

/** SVG-space moment wrapper: bake anchor into style.x, add reveal Δ into y. */
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
  const ty = useTransform(() => (typeof offsetY === "number" ? y + offsetY : y + offsetY.get()));
  return <motion.g style={{ opacity, x, y: ty, filter }}>{children}</motion.g>;
}

// ════════════════════════════════════════════════════════════════════════════
// BUTTERMILK UNDERLINE (master §3e) — behind text, scaleX sweep.
// ════════════════════════════════════════════════════════════════════════════
function Buttermilk({ scaleX, children, className }: {
  scaleX: MotionValue<number> | number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={["relative inline-block px-1 text-body-sm font-medium text-text-primary", className ?? ""].join(" ")}>
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
        <motion.span style={{ scaleX }} className="block h-full w-full origin-left bg-highlight" />
      </span>
      <span className="relative z-10">{children}</span>
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// AMBIENT LAYER (master §4.3) — continuous bg drift, own coprime loops.
// ════════════════════════════════════════════════════════════════════════════
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
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    };
    const a = animate(x, dx, { ...common, duration: periodMs / 1000 });
    const b = animate(y, dy, { ...common, duration: (periodMs * 0.82) / 1000 });
    const c = animate(opacity, opaHigh, { ...common, duration: (periodMs * 1.1) / 1000 });
    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, [active, reduce, x, y, opacity, dx, dy, opaHigh, opaLow, periodMs, staticOpacity]);

  return (
    <motion.g style={{ x, y, opacity }}>
      <g transform={`translate(${cx} ${cy})`}>
        <ChipRing r={r} letter={letter} stroke={1.25} fill="var(--color-text-tertiary)" fontSize={12} />
      </g>
    </motion.g>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export function HeroTriptych() {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });

  // Mobile recompose (master §6): Acto I only, vertical, 7s. SSR default desktop.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // A/B parity (master §1.4): Acto I only, bumped in onRepeat (never render).
  const iterRef = useRef(0);
  const [parity, setParity] = useState<"A" | "B">("A");

  // The single global clock T ∈ [0,1] over the cycle. Reduced motion pins it.
  const T = useMotionValue(reduce ? 0 : 0);

  const loopMs = isMobile ? ACT_MS_MOBILE : CYCLE_MS;

  useEffect(() => {
    if (reduce || !inView) {
      T.set(0); // parked; reduced-motion frame is composed below from `reduce`
      return;
    }
    const controls = animate(T, [0, 1], {
      duration: loopMs / 1000,
      ease: "linear",
      repeat: Infinity,
      onRepeat: () => {
        iterRef.current += 1;
        setParity(iterRef.current % 2 === 0 ? "A" : "B");
      },
    });
    return () => controls.stop();
  }, [reduce, inView, T, loopMs]);

  // Active act for the indicator (master §1.3). Mobile is always act 1.
  const [activeAct, setActiveAct] = useState<1 | 2 | 3>(1);
  useMotionValueEvent(T, "change", (v) => {
    if (isMobile) return;
    const a = v < 1 / 3 ? 1 : v < 2 / 3 ? 2 : 3;
    setActiveAct(a as 1 | 2 | 3);
  });

  // Per-act local clocks (master §1.1) WITH handoff overlap (master §2: the
  // incoming act starts rendering ~600ms before the outgoing finishes, so the
  // canvas is never blank at a joint, quality bar §5). OVERLAP = 600ms/21600 =
  // 0.0278 of T. Each incoming band starts OVERLAP early; outgoing acts gate
  // their own opacity to fade only after the successor is established.
  const OVERLAP = 0.0278;
  const THIRD = 1 / 3;
  // Acto I: normal band [0, THIRD] PLUS a tail pre-roll in the last OVERLAP of
  // the cycle (T near 1) where its draw restarts ahead of the wrap (J3 → I).
  const actI = useTransform(T, (v) => {
    if (isMobile) return v;
    if (v >= 1 - OVERLAP) {
      // pre-roll: drive actI from 0 up to ~drawEnd over the overlap window so
      // the new stroke + nib are already drawing as Act III dissolves.
      return clamp01(((v - (1 - OVERLAP)) / OVERLAP) * I.drawEnd);
    }
    return clamp01(v / THIRD);
  });
  // Acto II: starts OVERLAP before THIRD (catch phase paints during J1).
  const actII = useTransform(T, (v) =>
    isMobile ? 0 : clamp01((v - (THIRD - OVERLAP)) / THIRD),
  );
  // Acto III: starts OVERLAP before 2/3 (rows fade-up during J2).
  const actIII = useTransform(T, (v) =>
    isMobile ? 0 : clamp01((v - (2 * THIRD - OVERLAP)) / THIRD),
  );

  // Master visibility envelope per act (T-driven), so an act fully disappears
  // once its successor is established — only the handoff overlap shows both.
  // Act I: visible [0 .. THIRD+overlap], plus the J3 pre-roll tail [1-overlap..1].
  const visI = useTransform(T, (v) => {
    if (isMobile) return 1;
    if (v >= 1 - OVERLAP) return clamp01((v - (1 - OVERLAP)) / (OVERLAP * 0.5)); // fade in on pre-roll
    if (v <= THIRD) return 1;
    return clamp01(1 - (v - THIRD) / OVERLAP); // fade out across J1
  });
  const visII = useTransform(T, (v) => {
    if (isMobile) return 0;
    if (v < THIRD - OVERLAP) return 0;
    if (v < THIRD) return clamp01((v - (THIRD - OVERLAP)) / OVERLAP); // fade in J1
    if (v <= 2 * THIRD) return 1;
    return clamp01(1 - (v - 2 * THIRD) / OVERLAP); // fade out J2
  });
  const visIII = useTransform(T, (v) => {
    if (isMobile) return 0;
    if (v < 2 * THIRD - OVERLAP) return 0;
    if (v < 2 * THIRD) return clamp01((v - (2 * THIRD - OVERLAP)) / OVERLAP); // fade in J2
    if (v <= 1 - OVERLAP) return 1;
    return clamp01(1 - (v - (1 - OVERLAP)) / OVERLAP); // fade out J3
  });

  const parityVariant = reduce ? "A" : parity;

  return (
    <div ref={rootRef} className="relative w-full">
      <p className="sr-only">
        Tendr mantiene viva tu cartera: cada cliente es un hilo que conecta tus
        notas, propuestas y seguimientos, te avisa para retomar a quien llevás
        días sin contactar, y te deja servido lo que toca mañana.
      </p>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${isMobile ? VB_W_M : VB_W} ${isMobile ? VB_H_M : VB_H}`}
          fill="none"
          className="h-auto w-full overflow-visible"
          style={{ aspectRatio: `${isMobile ? VB_W_M : VB_W} / ${isMobile ? VB_H_M : VB_H}` }}
          role="presentation"
        >
          {/* z0 · Ambient layer (persists whole triptych, master §4.3). */}
          <AmbientChip
            cx={isMobile ? 56 : 70}
            cy={300}
            letter="A"
            active={inView}
            reduce={reduce}
            dx={isMobile ? 4 : 6}
            dy={isMobile ? 4 : 8}
            opaHigh={isMobile ? 0.16 : 0.22}
            periodMs={9000}
          />
          {!isMobile && (
            <AmbientChip cx={420} cy={140} letter="M" r={12} active={inView} reduce={reduce} dx={7} dy={5} opaLow={0.1} opaHigh={0.2} periodMs={11000} />
          )}

          {/* ── ACTO I — El Hilo ── */}
          <ActOne t={actI} vis={visI} reduce={reduce} isMobile={isMobile} parity={parityVariant} />

          {/* ── ACTO II + III — desktop, full-motion only (reduced motion = the
              Acto I resolved frame, master §5) ── */}
          {!isMobile && !reduce && (
            <>
              <ActTwo t={actII} vis={visII} />
              <ActThree t={actIII} vis={visIII} />
            </>
          )}
        </svg>

        {/* HTML overlay (z30+): labels, AI chrome, cursor, underlines. */}
        <div className="pointer-events-none absolute inset-0">
          <ActOneOverlay t={actI} vis={visI} reduce={reduce} isMobile={isMobile} parity={parityVariant} />
          {!isMobile && !reduce && (
            <>
              <ActTwoOverlay t={actII} vis={visII} />
              <ActThreeOverlay t={actIII} vis={visIII} />
            </>
          )}
        </div>
      </div>

      <ActIndicator active={isMobile ? 1 : activeAct} />
    </div>
  );
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// ════════════════════════════════════════════════════════════════════════════
// ACTO I — SVG layer (acto-1 §2 timeline, normalized to t∈[0,1] over 7200ms)
// ════════════════════════════════════════════════════════════════════════════
// ms→fraction over the act (7200ms). Inline divisions, NO captured-closure
// helper: a nested arrow capturing a loop param once tripped a Turbopack SSR
// inlining bug that left the param undefined in the prerendered chunk. Keep flat.
const I = {
  drawEnd: 1900 / 7200,
  nibFadeStart: 1900 / 7200,
  nibFadeEnd: 2100 / 7200,
  noteIn: 1800 / 7200,
  noteLabel: 2050 / 7200,
  envIn: 2350 / 7200,
  envLabel: 2600 / 7200,
  fugazIn: 2950 / 7200, // SEED between env and clock
  fugazLabel: 3050 / 7200,
  clockIn: 2900 / 7200,
  clockLabel: 3150 / 7200,
  fallStart: 3900 / 7200,
  fallEnd: 4700 / 7200,
  aiIn: 4900 / 7200,
  bubbleIn: 4950 / 7200,
  typeStart: 5150 / 7200,
  typeEnd: 5950 / 7200,
  underlineStart: 5700 / 7200,
  underlineEnd: 6050 / 7200,
  cursorIn: 5900 / 7200,
  cursorAt: 6200 / 7200,
  clickAt: 6250 / 7200,
  clickEnd: 6500 / 7200,
  recoverStart: 6300 / 7200,
  recoverEnd: 6750 / 7200,
  checkStart: 6500 / 7200,
  checkEnd: 6750 / 7200,
  retakeStart: 6100 / 7200,
  retakeEnd: 6400 / 7200,
  retakeUlStart: 6400 / 7200,
  retakeUlEnd: 6900 / 7200,
  aiOut: 6600 / 7200,
  cursorOut: 6750 / 7200,
  // J1 handoff (master §2): 6600–7200 → route breaks into 6 chips.
  j1Start: 6600 / 7200,
  j1End: 7200 / 7200,
};
const I_AI_TEXT = "Marta lleva 12 días · ¿retomamos?";

function ActOne({
  t,
  vis,
  reduce,
  isMobile,
  parity,
}: {
  t: MotionValue<number>;
  vis: MotionValue<number>;
  reduce: boolean;
  isMobile: boolean;
  parity: "A" | "B";
}) {
  const mainPath = isMobile ? MAIN_PATH_M : MAIN_PATH;
  const checkPath = isMobile ? CHECK_M : CHECK_I;
  const note = isMobile ? NOTE_M : NOTE;
  const envelope = isMobile ? ENVELOPE_M : ENVELOPE;
  const clock = isMobile ? CLOCK_M : CLOCK;

  // I · stroke draw + nib.
  const drawProgress = useTransform(t, [0, I.drawEnd], [0, 1], { clamp: true, ease: EXPO_OUT });
  const mainDashoffset = useTransform(drawProgress, [0, 1], [1, 0]);
  const nibOffset = useTransform(drawProgress, [0, 1], ["0%", "100%"]);
  const nibOpacity = useTransform(t, [0, 0.01, I.nibFadeStart, I.nibFadeEnd], [0, 1, 1, 0], { clamp: true });
  const nibScale = useTransform(t, [I.nibFadeStart, I.nibFadeEnd], [1, 0.6], { clamp: true });

  // II · cascade moments.
  const span = isMobile ? 0.055 : 0.055;
  const noteM = useMomentStyle(t, I.noteIn, span);
  const envM = useMomentStyle(t, I.envIn, span);
  const fugazM = useMomentStyle(t, I.fugazIn, span, 0.9);

  // III/IV · clock fall + recover.
  const clockY = useTransform(t, [I.clockIn, I.fallStart, I.fallEnd, I.recoverStart, I.recoverEnd], [10, 0, 16, 16, 0], { ease: STANDARD, clamp: true });
  const clockOpacity = useTransform(t, [I.clockIn, I.clockIn + span, I.fallStart, I.fallEnd, I.recoverStart, I.recoverEnd], [0, 1, 1, 0.32, 0.32, 1], { clamp: true });
  const clockBlur = useTransform(t, [I.clockIn, I.clockIn + span, I.fallStart, I.fallEnd, I.recoverStart, I.recoverEnd], [6, 0, 0, 1.5, 1.5, 0], { clamp: true });
  const clockFilter = useTransform(clockBlur, (b) => `blur(${b}px)`);

  // Check (firma) draws on recover.
  const checkDraw = useTransform(t, [I.checkStart, I.checkEnd], [1, 0], { clamp: true, ease: EXPO_OUT });
  const checkOpacity = useTransform(t, [I.checkStart, I.checkStart + 0.006], [0, 1], { clamp: true });

  // The cross-act fade (J1) is owned by the master `vis` envelope, so the spine
  // and scene just ride `vis`. The halo tracks it at 5%.
  const haloOpacity = useTransform(vis, (o) => 0.05 * o);

  // Reduced-motion / mobile-static composition uses fixed values.
  const r = reduce;

  return (
    <>
      {/* z10 · ink-bleed halo (static) */}
      <motion.path
        d={mainPath}
        stroke="var(--color-text-primary)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.05}
        style={{ filter: "blur(0.6px)", opacity: r ? 0.05 : haloOpacity }}
      />
      {/* z10 · main ink stroke (the spine) */}
      <motion.path
        d={mainPath}
        stroke="var(--color-text-primary)"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: r ? 0 : mainDashoffset,
          opacity: r ? 1 : vis,
        }}
      />
      {/* z10 · nib */}
      {!r && (
        <motion.circle
          r={3.2}
          fill="var(--color-text-primary)"
          style={{ offsetPath: `path("${mainPath}")`, offsetDistance: nibOffset, opacity: nibOpacity, scale: nibScale }}
        />
      )}

      <motion.g style={{ opacity: r ? 1 : vis }}>
        {/* z25 · check */}
        <motion.path
          d={checkPath}
          stroke="var(--color-support)"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: r ? 0 : checkDraw, opacity: r ? 1 : checkOpacity }}
        />

        {/* z20 · moments */}
        <Moment x={note.x} y={note.y} opacity={r ? 1 : noteM.opacity} offsetY={r ? 0 : noteM.y} filter={r ? "none" : noteM.filter}>
          <NoteGlyph />
        </Moment>
        <Moment x={envelope.x} y={envelope.y} opacity={r ? 1 : envM.opacity} offsetY={r ? 0 : envM.y} filter={r ? "none" : envM.filter}>
          <EnvelopeGlyph />
        </Moment>
        {!isMobile && (
          <Moment x={SEED.x} y={SEED.y} opacity={r ? 0.9 : fugazM.opacity} offsetY={r ? 0 : fugazM.y} filter={r ? "none" : fugazM.filter}>
            {parity === "A" ? <EyeGlyph /> : <NewNoteGlyph />}
          </Moment>
        )}
        <Moment x={clock.x} y={clock.y} opacity={r ? 1 : clockOpacity} offsetY={r ? 0 : clockY} filter={r ? "none" : clockFilter}>
          <ClockGlyph />
        </Moment>
      </motion.g>
    </>
  );
}

function ActOneOverlay({
  t,
  vis,
  reduce,
  isMobile,
  parity,
}: {
  t: MotionValue<number>;
  vis: MotionValue<number>;
  reduce: boolean;
  isMobile: boolean;
  parity: "A" | "B";
}) {
  const VBW = isMobile ? VB_W_M : VB_W;
  const VBH = isMobile ? VB_H_M : VB_H;
  const note = isMobile ? NOTE_M : NOTE;
  const envelope = isMobile ? ENVELOPE_M : ENVELOPE;
  const clock = isMobile ? CLOCK_M : CLOCK;
  const r = reduce;
  const one = useMotionValue(1);
  const zero = useMotionValue(0);

  const noteLabel = useWriteOn(t, I.noteLabel, 0.05);
  const envLabel = useWriteOn(t, I.envLabel, 0.05);
  const fugazLabel = useWriteOn(t, I.fugazLabel, 0.05, 0.75);

  const clockY = useTransform(t, [I.clockIn, I.fallStart, I.fallEnd, I.recoverStart, I.recoverEnd], [10, 0, 16, 16, 0], { ease: STANDARD, clamp: true });
  const clockOpacity = useTransform(t, [I.clockIn, I.clockIn + 0.055, I.fallStart, I.fallEnd, I.recoverStart, I.recoverEnd], [0, 1, 1, 0.42, 0.42, 1], { clamp: true });

  // AI pill + bubble + typing.
  const aiOpacity = useTransform(t, [I.aiIn, I.aiIn + 0.03, I.aiOut, I.aiOut + 0.02], [0, 1, 1, 0], { clamp: true });
  const aiY = useTransform(t, [I.aiIn, I.aiIn + 0.03], [6, 0], { clamp: true });
  const bubbleOpacity = useTransform(t, [I.bubbleIn, I.bubbleIn + 0.03, I.aiOut, I.aiOut + 0.02], [0, 1, 1, 0], { clamp: true });
  const typed = useTyping(t, I.typeStart, I.typeEnd, I_AI_TEXT);
  const typingDone = useTransform(t, [I.typeEnd - 0.01, I.typeEnd], [0, 1], { clamp: true });
  const underlineDraw = useTransform(t, [I.underlineStart, I.underlineEnd], [0, 1], { clamp: true, ease: EXPO_OUT });

  // Cursor "tú": spring toward the button, click ring, exit.
  const cursorTargetX = useMotionValue(isMobile ? clock.x : clock.x + 36);
  const cursorTargetY = useMotionValue(clock.y + 70);
  // Convert SVG coords → % within the box.
  const cursorXmv = useSpring(cursorTargetX, CURSOR_SPRING);
  const cursorYmv = useSpring(cursorTargetY, CURSOR_SPRING);
  // Drive the target along the timeline (offscreen-right → button → offscreen).
  useMotionValueEvent(t, "change", (v) => {
    if (r) return;
    if (v < I.cursorIn) {
      cursorTargetX.set(VBW + 60);
      cursorTargetY.set(VBH + 20);
    } else if (v < I.cursorOut) {
      // Approach the "Retomar" pill from its lower-right corner so the arrow
      // tip + click ring land on the button edge, never on top of the glyphs
      // (acto-1 §3: the cursor is UI, the label stays legible at the climax).
      cursorTargetX.set(isMobile ? clock.x - 8 : clock.x + 64);
      cursorTargetY.set(clock.y + 66);
    } else {
      cursorTargetX.set(VBW + 60);
      cursorTargetY.set(VBH + 40);
    }
  });
  const cursorXpct = useTransform(cursorXmv, (v) => (v / VBW) * 100);
  const cursorYpct = useTransform(cursorYmv, (v) => (v / VBH) * 100);
  const cursorOpacity = useTransform(t, [I.cursorIn - 0.01, I.cursorIn, I.cursorOut, I.cursorOut + 0.02], [0, 1, 1, 0], { clamp: true });
  const clickRing = useTransform(t, [I.clickAt, I.clickEnd], [0, 1], { clamp: true });

  // Retomar button + buttermilk underline.
  const retakeOpacity = useTransform(t, [I.retakeStart, I.retakeEnd], [0, 1], { clamp: true });
  const retakeY = useTransform(t, [I.retakeStart, I.retakeEnd], [6, 0], { clamp: true });
  const retakeUl = useTransform(t, [I.retakeUlStart, I.retakeUlEnd], [0, 1], { clamp: true, ease: EXPO_OUT });
  const press = useTransform(t, [I.clickAt, I.clickAt + 0.01, I.clickEnd], [1, 0.96, 1], { clamp: true });

  return (
    <motion.div className="absolute inset-0" style={{ opacity: r ? 1 : vis }}>
      {/* labels */}
      <Label xPct={((note.x - (isMobile ? 18 : 24)) / VBW) * 100} yPct={((note.y - (isMobile ? 30 : 56)) / VBH) * 100} clipPath={r ? "none" : noteLabel.clipPath} opacity={r ? 1 : noteLabel.opacity} mono>
        9:12 · Ana
      </Label>
      <Label xPct={((envelope.x + (isMobile ? 40 : 72)) / VBW) * 100} yPct={((envelope.y - (isMobile ? 14 : 22)) / VBH) * 100} clipPath={r ? "none" : envLabel.clipPath} opacity={r ? 1 : envLabel.opacity}>
        propuesta
      </Label>
      {!isMobile && (
        <Label xPct={(SEED.x / VBW) * 100} yPct={((SEED.y - 30) / VBH) * 100} clipPath={r ? "none" : fugazLabel.clipPath} opacity={r ? 0.75 : fugazLabel.opacity} mono dim>
          {parity === "A" ? "visto" : "nota"}
        </Label>
      )}
      <Label
        xPct={((clock.x - (isMobile ? 0 : 106)) / VBW) * 100}
        yPct={((clock.y - (isMobile ? 48 : 20)) / VBH) * 100}
        opacity={r ? 1 : clockOpacity}
        offsetY={r ? 0 : clockY}
        mono
      >
        Marta · 12 días
      </Label>

      {/* AI pill + bubble (anchored upper-right of the clock, master §3b) */}
      <motion.div
        className="absolute"
        style={{
          left: `${((clock.x + (isMobile ? -64 : 24)) / VBW) * 100}%`,
          top: `${((clock.y - (isMobile ? 96 : 80)) / VBH) * 100}%`,
          opacity: r ? 1 : aiOpacity,
        }}
      >
        <div className="flex flex-col items-start gap-1">
          <AiPill opacity={r ? one : aiOpacity} y={r ? zero : aiY} />
          <AiBubble
            opacity={r ? one : bubbleOpacity}
            text={r ? I_AI_TEXT : typed}
            done={r ? one : typingDone}
            underline={r ? one : underlineDraw}
            withUnderline
          />
        </div>
      </motion.div>

      {/* "Retomar" — the rescued follow-up label the cursor clicks. Ink text on
          the warm surface with the buttermilk underline sweeping behind it
          (master §3e: highlight = text background ONLY). Press feedback scales
          the whole label on click. */}
      <motion.div
        className="absolute"
        style={{
          left: `${((clock.x + (isMobile ? 0 : 6)) / VBW) * 100}%`,
          top: `${((clock.y + 56) / VBH) * 100}%`,
          opacity: r ? 1 : retakeOpacity,
          y: r ? 0 : retakeY,
        }}
      >
        <motion.span className="inline-flex" style={{ scale: r ? 1 : press }}>
          <Buttermilk scaleX={r ? 1 : retakeUl}>Retomar</Buttermilk>
        </motion.span>
      </motion.div>

      {/* Cursor "tú" */}
      {!r && (
        <CursorTu xPct={cursorXpct} yPct={cursorYpct} opacity={cursorOpacity} ringActive={clickRing} />
      )}
      {r && (
        <div className="absolute" style={{ left: `${((clock.x + (isMobile ? 0 : 64)) / VBW) * 100}%`, top: `${((clock.y + 66) / VBH) * 100}%` }}>
          <CursorTuStatic />
        </div>
      )}
    </motion.div>
  );
}

function CursorTuStatic() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative">
      <svg width="16" height="20" viewBox="0 0 16 20" className="block">
        <path d="M0 0 L0 16 L4 12 L7 18 L9 17 L6 11 L11 11 Z" fill="var(--color-text-primary)" />
      </svg>
      <span className="absolute left-3 top-4 whitespace-nowrap rounded-full border border-border-hairline bg-surface-raised px-1.5 py-0.5 font-mono text-[11px] leading-none text-text-secondary">
        tú
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ACTO II — Constelación (acto-2 §2, normalized to 7200ms)
// ════════════════════════════════════════════════════════════════════════════
const II = {
  catchEnd: 800 / 7200,
  settleEnd: 1200 / 7200,
  driftStart: 2600 / 7200,
  driftEnd: 3600 / 7200,
  aiIn: 3400 / 7200,
  typeStart: 3700 / 7200,
  typeEnd: 4560 / 7200,
  cursorIn: 4500 / 7200,
  cursorAt: 5000 / 7200,
  grabAt: 5000 / 7200,
  grabEnd: 5250 / 7200,
  dragStart: 5250 / 7200,
  dragEnd: 5950 / 7200,
  releaseStart: 5950 / 7200,
  releaseEnd: 6200 / 7200,
  reliefStart: 6100 / 7200,
  reliefEnd: 6500 / 7200,
  aiOut: 6300 / 7200,
  cursorOut: 6500 / 7200,
  // J2 handoff: align to column x=96, shrink to 24px, axis draw-in.
  j2Start: 6600 / 7200,
  j2End: 7200 / 7200,
  farewellStart: 6600 / 7200,
  farewellEnd: 6850 / 7200,
};
const II_AI_TEXT = "Lucía se está enfriando";
// Column target Y for the 3 migrating chips (A row1, M row2, L row4 — master D7).
const II_COLUMN_Y: Record<string, number> = { A: 108, M: 184, L: 336 };

function ActTwo({ t, vis }: { t: MotionValue<number>; vis: MotionValue<number> }) {
  // Axis draw-in during J2 (master §2: Act II draws it, x=96, width 1.25).
  const axisDraw = useTransform(t, [II.j2Start, II.j2End], [1, 0], { clamp: true, ease: EXPO_OUT });
  const axisOpacity = useTransform(t, [II.j2Start, II.j2Start + 0.02], [0, 1], { clamp: true });

  // relief support underline + check (on Lucía release).
  const reliefDraw = useTransform(t, [II.reliefStart, II.reliefEnd], [1, 0], { clamp: true, ease: EXPO_OUT });
  const reliefOpacity = useTransform(t, [II.reliefStart, II.reliefStart + 0.01], [0, 1], { clamp: true });

  return (
    <motion.g style={{ opacity: vis }}>
      {/* axis (drawn during J2; invisible until then) */}
      <motion.line
        x1={AXIS_X}
        y1={AXIS_Y0}
        x2={AXIS_X}
        y2={AXIS_Y1}
        stroke="var(--color-border-strong)"
        strokeWidth={1.25}
        strokeLinecap="round"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: axisDraw, opacity: axisOpacity }}
      />
      {/* relief: hand-drawn support tick + check under Lucía */}
      <motion.path
        d="M 280 332 q 24 6 44 0"
        stroke="var(--color-support)"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: reliefDraw, opacity: reliefOpacity }}
      />
      <motion.g transform="translate(330 338)" style={{ opacity: reliefOpacity }}>
        <motion.path
          d="M 0 0 l 5 6 l 11 -14"
          stroke="var(--color-support)"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: reliefDraw }}
        />
      </motion.g>

      {CONSTELLATION.map((c, i) => (
        <ConstellationChip key={c.key} chip={c} index={i} t={t} />
      ))}
    </motion.g>
  );
}

function ConstellationChip({
  chip,
  index,
  t,
}: {
  chip: (typeof CONSTELLATION)[number];
  index: number;
  t: MotionValue<number>;
}) {
  const isLucia = chip.key === "L";
  const colY = II_COLUMN_Y[chip.key];

  // X: scatter → rest → (Lucía drag wobble handled via shared cursor below) →
  // column x=96 (migrating) or fade (farewell).
  const x = useTransform(t, (v) => {
    // catch & settle
    if (v <= II.settleEnd) {
      const f = clamp01(v / II.catchEnd);
      const eased = EXPO_OUT(f);
      const base = chip.sx + (chip.x - chip.sx) * eased;
      // overshoot ~3% near settle
      return base;
    }
    // drift / drag handled below for Lucía; J2 column align for migrators
    if (chip.farewell) return chip.x;
    if (v >= II.j2Start) {
      const f = clamp01((v - II.j2Start) / (II.j2End - II.j2Start));
      return chip.x + (AXIS_X - chip.x) * EXPO_OUT(f);
    }
    // Lucía derives then returns (drag)
    if (isLucia) {
      if (v < II.driftStart) return chip.x;
      if (v < II.releaseStart) {
        // derive out, then drag back — net stays near rest by release
        const df = clamp01((v - II.driftStart) / (II.driftEnd - II.driftStart));
        const drift = LUCIA_DRIFT.dx * EXPO_OUT(df);
        if (v < II.dragStart) return chip.x + drift;
        const bf = clamp01((v - II.dragStart) / (II.dragEnd - II.dragStart));
        return chip.x + drift * (1 - bf);
      }
      return chip.x;
    }
    return chip.x;
  });

  const y = useTransform(t, (v) => {
    if (v <= II.settleEnd) {
      const f = clamp01(v / II.catchEnd);
      return chip.sy + (chip.y - chip.sy) * EXPO_OUT(f);
    }
    if (chip.farewell) return chip.y;
    if (v >= II.j2Start) {
      const f = clamp01((v - II.j2Start) / (II.j2End - II.j2Start));
      return chip.y + (colY - chip.y) * EXPO_OUT(f);
    }
    if (isLucia && v >= II.driftStart && v < II.releaseStart) {
      const df = clamp01((v - II.driftStart) / (II.driftEnd - II.driftStart));
      const drift = LUCIA_DRIFT.dy * EXPO_OUT(df);
      if (v < II.dragStart) return chip.y + drift;
      const bf = clamp01((v - II.dragStart) / (II.dragEnd - II.dragStart));
      return chip.y + drift * (1 - bf);
    }
    return chip.y;
  });

  // scale: tier → shrink to 24px (r12) on J2.
  const baseR = 18 * chip.scale; // 36px front
  const scale = useTransform(t, (v) => {
    let s = chip.scale;
    if (isLucia && v >= II.driftStart && v < II.releaseStart) {
      const df = clamp01((v - II.driftStart) / (II.driftEnd - II.driftStart));
      s = chip.scale - 0.18 * df;
    }
    if (!chip.farewell && v >= II.j2Start) {
      const f = clamp01((v - II.j2Start) / (II.j2End - II.j2Start));
      // 18*scale → 12 (24px Ø)
      const targetScale = 12 / 18;
      s = chip.scale + (targetScale - chip.scale) * f;
    }
    return s;
  });

  const opacity = useTransform(t, (v) => {
    // catch fade-in
    if (v <= II.catchEnd) return chip.opacity * clamp01(v / II.catchEnd);
    if (chip.farewell) {
      if (v >= II.farewellStart) {
        const f = clamp01((v - II.farewellStart) / (II.farewellEnd - II.farewellStart));
        return chip.opacity * (1 - f);
      }
      return chip.opacity;
    }
    if (isLucia && v >= II.driftStart && v < II.releaseStart) {
      const df = clamp01((v - II.driftStart) / (II.driftEnd - II.driftStart));
      return chip.opacity - (chip.opacity - 0.28) * df;
    }
    return chip.opacity;
  });

  const rotate = useTransform(t, (v) => {
    if (isLucia && v >= II.grabAt && v < II.releaseStart) return 2;
    return 0;
  });

  const blur = useTransform(opacity, () => chip.blur);
  const filter = useTransform(blur, (b) => (b > 0 ? `blur(${b}px)` : "none"));

  // position the group at the moving (x,y)
  return (
    <motion.g style={{ x, y, scale, opacity, rotate, filter }}>
      {/* Folk Twins: el aro del monograma rota wisp->cobalt->teal por index%3. */}
      <ChipRing r={18} letter={chip.letter} stroke={1.5} fill="var(--color-text-secondary)" fontSize={17} ringStroke={monogramHue(index)} />
    </motion.g>
  );
}

function ActTwoOverlay({ t, vis }: { t: MotionValue<number>; vis: MotionValue<number> }) {
  const r = false;
  const zero = useMotionValue(0);

  const aiOpacity = useTransform(t, [II.aiIn, II.aiIn + 0.03, II.aiOut, II.aiOut + 0.02], [0, 1, 1, 0], { clamp: true });
  const typed = useTyping(t, II.typeStart, II.typeEnd, II_AI_TEXT);
  const typingDone = useTransform(t, [II.typeEnd - 0.01, II.typeEnd], [0, 1], { clamp: true });

  // Cursor toward Lucía, click ring, drag back, exit.
  const cx = useMotionValue(VB_W + 60);
  const cy = useMotionValue(VB_H + 20);
  const cxs = useSpring(cx, CURSOR_SPRING);
  const cys = useSpring(cy, CURSOR_SPRING);
  useMotionValueEvent(t, "change", (v) => {
    if (r) return;
    if (v < II.cursorIn) {
      cx.set(VB_W + 60);
      cy.set(VB_H + 20);
    } else if (v < II.dragStart) {
      // toward derived Lucía
      cx.set(300 + LUCIA_DRIFT.dx + 22);
      cy.set(300 + LUCIA_DRIFT.dy - 22);
    } else if (v < II.cursorOut) {
      // drag back toward Lucía's rest spot
      cx.set(300 + 22);
      cy.set(300 - 22);
    } else {
      cx.set(VB_W + 60);
      cy.set(VB_H + 40);
    }
  });
  const cxPct = useTransform(cxs, (v) => (v / VB_W) * 100);
  const cyPct = useTransform(cys, (v) => (v / VB_H) * 100);
  const cursorOpacity = useTransform(t, [II.cursorIn - 0.01, II.cursorIn, II.cursorOut, II.cursorOut + 0.02], [0, 1, 1, 0], { clamp: true });
  const clickRing = useTransform(t, [II.grabAt, II.grabEnd], [0, 1], { clamp: true });

  return (
    <motion.div className="absolute inset-0" style={{ opacity: vis }}>
      {/* Lucía label tracks the chip rest (below it) */}
      <Label xPct={(300 / VB_W) * 100} yPct={(326 / VB_H) * 100} opacity={1} mono>
        Lucía
      </Label>

      {/* AI pill + bubble anchored right of Lucía's derived spot */}
      <motion.div
        className="absolute"
        style={{
          left: `${((300 + LUCIA_DRIFT.dx + 36) / VB_W) * 100}%`,
          top: `${((300 + LUCIA_DRIFT.dy - 12) / VB_H) * 100}%`,
          opacity: aiOpacity,
        }}
      >
        <div className="flex flex-col items-start gap-1">
          <AiPill opacity={aiOpacity} />
          <AiBubble opacity={aiOpacity} text={typed} done={typingDone} underline={zero} />
        </div>
      </motion.div>

      <CursorTu xPct={cxPct} yPct={cyPct} opacity={cursorOpacity} ringActive={clickRing} />
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ACTO III — El día, de un vistazo (acto-3 §2, normalized to 7200ms)
// ════════════════════════════════════════════════════════════════════════════
const III = {
  inEnd: 260 / 7200,
  row1ts: 300 / 7200,
  row1ev: 420 / 7200,
  row2ts: 670 / 7200,
  row2ev: 790 / 7200,
  checkStart: 1380 / 7200,
  checkEnd: 1760 / 7200,
  row3ts: 1040 / 7200,
  row3ev: 1160 / 7200,
  row4ts: 1410 / 7200,
  row4ev: 1530 / 7200,
  aiChipIn: 2800 / 7200,
  bubbleIn: 3100 / 7200,
  typeStart: 3400 / 7200,
  typeEnd: 4700 / 7200,
  bracketStart: 4600 / 7200,
  bracketEnd: 4950 / 7200,
  cursorIn: 4800 / 7200,
  cursorAt: 5400 / 7200,
  clickAt: 5550 / 7200,
  clickEnd: 5800 / 7200,
  underlineStart: 5800 / 7200,
  underlineEnd: 6350 / 7200,
  cursorOut: 5900 / 7200,
  // J3 handoff: condensación → órbita → nib.
  condStart: 6600 / 7200,
  condEnd: 6900 / 7200,
  orbStart: 6850 / 7200,
  orbArcEnd: 7050 / 7200,
  orbCloseEnd: 7100 / 7200,
  nibStart: 7050 / 7200,
  nibEnd: 7200 / 7200,
};
const III_AI_TEXT = "Mañana: retomar a Marta";

function ActThree({ t, vis }: { t: MotionValue<number>; vis: MotionValue<number> }) {
  // condensación: rows ascend+fade; axis retracts to a point at (96,108).
  const axisScaleY = useTransform(t, [III.condStart, III.condEnd], [1, 0], { clamp: true, ease: EMPHASIS });
  const axisOpacity = useTransform(t, [III.condStart, III.condEnd], [1, 0], { clamp: true });

  // órbita arc + close.
  const orbArc = useTransform(t, [III.orbStart, III.orbArcEnd], [1, 0.06], { clamp: true, ease: EXPO_OUT });
  const orbArcOpacity = useTransform(t, [III.orbStart, III.orbStart + 0.005, III.orbCloseEnd + 0.01, III.orbCloseEnd + 0.02], [0, 1, 1, 0], { clamp: true });
  const orbClose = useTransform(t, [III.orbArcEnd, III.orbCloseEnd], [1, 0], { clamp: true, ease: EMPHASIS });

  // nib: point → nib → launches into MAIN_PATH (handoff to Act I overlap).
  const nibOffset = useTransform(t, [III.nibStart, III.nibEnd], ["0%", "6%"], { clamp: true });
  const nibOpacity = useTransform(t, [III.nibStart, III.nibStart + 0.005], [0, 1], { clamp: true });
  const nibR = useTransform(t, [III.nibStart, III.nibEnd], [2.5, 3.2], { clamp: true });

  // check row 2.
  const checkDraw = useTransform(t, [III.checkStart, III.checkEnd], [1, 0], { clamp: true, ease: EXPO_OUT });
  const checkOpacity = useTransform(t, [III.checkStart, III.checkStart + 0.006], [0, 1], { clamp: true });

  return (
    <motion.g style={{ opacity: vis }}>
      {/* axis (received from J2; retracts on condensación) */}
      <motion.line
        x1={AXIS_X}
        y1={AXIS_Y0}
        x2={AXIS_X}
        y2={AXIS_Y1}
        stroke="var(--color-border-strong)"
        strokeWidth={1.25}
        strokeLinecap="round"
        style={{
          scaleY: axisScaleY,
          opacity: axisOpacity,
          // CSS transform-origin in px (viewport units of the SVG coordinate
          // space). Replaces the invalid kebab-case DOM attribute and Motion's
          // originX/originY pair, which both compile to the same property.
          transformOrigin: `${AXIS_X}px ${AXIS_Y0}px`,
        }}
      />

      {/* row nodes + chips */}
      {ROWS.map((row, i) => (
        <RowChip key={row.key} row={row} index={i} t={t} />
      ))}

      {/* check row 2 */}
      <motion.g transform="translate(372 184)" style={{ opacity: checkOpacity }}>
        <motion.path
          d={CHECK_III}
          stroke="var(--color-support)"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: checkDraw }}
        />
      </motion.g>

      {/* AI row chip (✦ in pill is OFF here — master D17: only ✦ is in the text) */}
      <RowAiChip t={t} />

      {/* órbita close (J3) */}
      <motion.path
        d={ORBITA_ARC}
        stroke="var(--color-support)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: orbArc, opacity: orbArcOpacity }}
      />
      <motion.path
        d={ORBITA_CLOSE}
        stroke="var(--color-support)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: orbClose, opacity: orbArcOpacity }}
      />

      {/* nib launch into Act I path */}
      <motion.circle
        fill="var(--color-text-primary)"
        style={{
          r: nibR,
          offsetPath: `path("${MAIN_PATH}")`,
          offsetDistance: nibOffset,
          opacity: nibOpacity,
        }}
      />
    </motion.g>
  );
}

function RowChip({ row, index, t }: { row: (typeof ROWS)[number]; index: number; t: MotionValue<number> }) {
  // ACT IN fade-up; condensación ascend+fade (stagger: row4 first → row1).
  const inOpacity = useTransform(t, [0, III.inEnd], [0, 1], { clamp: true });
  const condOrder = (ROWS.length - 1 - index) * 0.008; // row4 leaves first
  const yOut = useTransform(t, [III.condStart + condOrder, III.condEnd + condOrder], [0, -10], { clamp: true });
  const condOpacity = useTransform(t, [III.condStart + condOrder, III.condEnd + condOrder], [1, 0], { clamp: true });
  const opacity = useTransform(() => Math.min(inOpacity.get(), condOpacity.get()));
  return (
    <motion.g style={{ x: AXIS_X, y: useTransform(() => row.y + yOut.get()), opacity }}>
      {/* node dot on the axis */}
      <circle cx={0} cy={0} r={2.5} fill="var(--color-text-primary)" opacity={0.5} />
      {/* 24px chip over the node — Folk Twins rotation by row index. */}
      <ChipRing r={12} letter={row.letter} stroke={1.25} fill="var(--color-text-tertiary)" fontSize={12} ringStroke={monogramHue(index)} />
    </motion.g>
  );
}

function RowAiChip({ t }: { t: MotionValue<number> }) {
  const y = useTransform(t, [III.aiChipIn, III.aiChipIn + 0.05], [12, 0], { clamp: true });
  const opacity = useTransform(t, [III.aiChipIn, III.aiChipIn + 0.05, III.condStart, III.condEnd], [0, 1, 1, 0], { clamp: true });
  return (
    <motion.g style={{ x: AXIS_X, y: useTransform(() => AI_ROW_Y + y.get()), opacity }}>
      <circle cx={0} cy={0} r={2.5} fill="var(--color-text-primary)" opacity={0.5} />
      <circle cx={0} cy={0} r={12} stroke="var(--color-support-cobalt)" strokeWidth={1.25} fill="none" />
      {/* ✦ glyph inside = "lo máquina" (Folk Twins): la fila IA usa cobalt (no wisp). */}
      <path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" fill="var(--color-support-cobalt)" transform="scale(0.8)" />
    </motion.g>
  );
}

function ActThreeOverlay({ t, vis }: { t: MotionValue<number>; vis: MotionValue<number> }) {
  const r = false;
  const one = useMotionValue(1);

  const aiBubbleOpacity = useTransform(t, [III.bubbleIn, III.bubbleIn + 0.04, III.condStart, III.condEnd], [0, 1, 1, 0], { clamp: true });
  const aiBubbleScale = useTransform(t, [III.bubbleIn, III.bubbleIn + 0.04], [0.92, 1], { clamp: true });
  const typed = useTyping(t, III.typeStart, III.typeEnd, III_AI_TEXT);
  const typingDone = useTransform(t, [III.typeEnd - 0.01, III.typeEnd], [0, 1], { clamp: true });

  // cursor toward "Planificar", click ring, exit.
  const cx = useMotionValue(VB_W + 60);
  const cy = useMotionValue(VB_H + 20);
  const cxs = useSpring(cx, CURSOR_SPRING);
  const cys = useSpring(cy, CURSOR_SPRING);
  useMotionValueEvent(t, "change", (v) => {
    if (r) return;
    if (v < III.cursorIn) {
      cx.set(VB_W + 60);
      cy.set(VB_H + 20);
    } else if (v < III.cursorOut) {
      // Same treatment as Act I: approach from below-right so the arrow tip +
      // click ring land on the button's lower-right corner and the
      // "Planificar" label stays legible at the climax.
      cx.set(312);
      cy.set(AI_ROW_Y + 20);
    } else {
      cx.set(VB_W + 60);
      cy.set(VB_H + 40);
    }
  });
  const cxPct = useTransform(cxs, (v) => (v / VB_W) * 100);
  const cyPct = useTransform(cys, (v) => (v / VB_H) * 100);
  const cursorOpacity = useTransform(t, [III.cursorIn - 0.01, III.cursorIn, III.cursorOut, III.cursorOut + 0.02], [0, 1, 1, 0], { clamp: true });
  const clickRing = useTransform(t, [III.clickAt, III.clickEnd], [0, 1], { clamp: true });
  const underline = useTransform(t, [III.underlineStart, III.underlineEnd], [0, 1], { clamp: true, ease: EXPO_OUT });

  return (
    <motion.div className="absolute inset-0" style={{ opacity: vis }}>
      {/* row timestamps + events (HTML, real text, AA). x≥180 never crosses axis. */}
      {ROWS.map((row, i) => (
        <ActThreeRowLabels key={row.key} row={row} index={i} t={t} reduce={r} />
      ))}

      {/* AI bubble at the base of the axis (row 5) */}
      <motion.div
        className="absolute"
        style={{ left: `${(126 / VB_W) * 100}%`, top: `${((AI_ROW_Y - 10) / VB_H) * 100}%`, opacity: r ? 1 : aiBubbleOpacity }}
      >
        <div className="flex items-end gap-2">
          <AiBubble
            opacity={r ? one : aiBubbleOpacity}
            scale={r ? one : aiBubbleScale}
            text={r ? III_AI_TEXT : typed}
            done={r ? one : typingDone}
            underline={one}
            trailingStar
          />
          {/* Planificar button */}
          <span className="inline-flex shrink-0 rounded-md bg-accent-primary px-2.5 py-1 text-[length:var(--text-body-sm)] text-accent-fg">
            Planificar
          </span>
        </div>
        {/* buttermilk under "retomar a Marta" (master §3e). Standalone strip so it
            does not require splitting the typed text node. */}
        <div className="mt-0.5">
          <Buttermilk scaleX={r ? 1 : underline}>retomar a Marta</Buttermilk>
        </div>
      </motion.div>

      {!r && <CursorTu xPct={cxPct} yPct={cyPct} opacity={cursorOpacity} ringActive={clickRing} />}
    </motion.div>
  );
}

/** One timeline row's timestamp + event labels (write-on, AA, never crosses axis). */
function ActThreeRowLabels({
  row,
  index,
  t,
  reduce,
}: {
  row: (typeof ROWS)[number];
  index: number;
  t: MotionValue<number>;
  reduce: boolean;
}) {
  const tsStart = [III.row1ts, III.row2ts, III.row3ts, III.row4ts][index];
  const evStart = [III.row1ev, III.row2ev, III.row3ev, III.row4ev][index];
  const ts = useWriteOn(t, tsStart, 0.05);
  const ev = useWriteOn(t, evStart, 0.08);
  return (
    <>
      <Label xPct={(128 / VB_W) * 100} yPct={(row.y / VB_H) * 100} clipPath={reduce ? "none" : ts.clipPath} opacity={reduce ? 1 : ts.opacity} mono left>
        {row.ts}
      </Label>
      <Label xPct={(184 / VB_W) * 100} yPct={(row.y / VB_H) * 100} clipPath={reduce ? "none" : ev.clipPath} opacity={reduce ? 1 : ev.opacity} left>
        {row.event}
      </Label>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Shared label primitive (HTML over SVG, AA, selectable).
// ════════════════════════════════════════════════════════════════════════════
function Label({
  xPct,
  yPct,
  opacity,
  offsetY = 0,
  clipPath = "none",
  mono = false,
  dim = false,
  left = false,
  children,
}: {
  xPct: number;
  yPct: number;
  opacity: MotionValue<number> | number;
  offsetY?: MotionValue<number> | number;
  clipPath?: MotionValue<string> | string;
  mono?: boolean;
  dim?: boolean;
  left?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      style={{ left: `${xPct}%`, top: `${yPct}%`, opacity, y: offsetY, clipPath }}
      className={[
        "pointer-events-none absolute whitespace-nowrap",
        left ? "" : "-translate-x-1/2",
        "-translate-y-1/2",
        mono
          ? `font-mono text-meta uppercase tracking-[0.12em] ${dim ? "text-text-tertiary/70" : "text-text-tertiary"}`
          : "text-body-sm text-text-primary",
      ].join(" ")}
    >
      {children}
    </motion.span>
  );
}
