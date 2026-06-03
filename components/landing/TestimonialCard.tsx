"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";
import type {
  EntranceVariant,
  NoteSize,
  TestimonialCardProps,
} from "@/components/landing/types";

/**
 * TestimonialCard: a single attributed testimonial rendered as a paper note
 * held to a CLEAN BOARD ("El tablero de Tendr") by a strip of WASHI TAPE / celo
 * (ADR-3, v2). The tape replaces the v1 pushpin as the holding device — it reads
 * analog-warm and consistent with the brand's paper/notebook metaphor, where a
 * metal magnet would fight the warm-paper surface. The tape is NEUTRAL warm
 * (border-strong / surface-sunken blend, never a brand hue) and alternates two
 * subtle tints across the run so the board does not look mechanical.
 *
 * Client Component. Two independent motion concerns compose here:
 *
 *  - ENTRANCE (whileInView, TIME-based — NOT scroll-scrubbed). When the note is
 *    in the pan path, it animates in ONCE via an IntersectionObserver
 *    (`whileInView` + `viewport.once`) the first time it enters the viewport as
 *    the board pans. The whole paper unit plays its varied entrance (slide /
 *    drop / rotate / fade / blur) over ~0.6s and the pushpin "stabs" just after,
 *    then it STAYS fully opaque + pinned for the rest of its travel and during
 *    the zoom-out. This is the key fix vs the earlier scroll-scrubbed opacity:
 *    a scrubbed entrance left the note semi-transparent the whole time it panned
 *    across (you could see the cork through it). Decoupling opacity from scroll
 *    progress makes the note reach full opacity quickly and hold it.
 *    The horizontal PAN and the board ZOOM are still scroll-driven (owned by
 *    TestimonialsCork); only the per-note appearance is time-based here.
 *
 *  - HOVER LEAN (pointer): the inner lean layer leans + drifts toward the cursor
 *    via motion values (never useState per frame — Vercel
 *    rerender-use-ref-transient-values).
 *
 * Paper-as-ONE-opaque-unit (design §4): the article carries NO background and NO
 * border; the visible cream surface lives on `<figure>` and BOTH shadow spans
 * live INSIDE the moving unit, so shadows travel + lean WITH the paper (no
 * desync, no board bleed behind a moving edge). The tape stays on the ARTICLE
 * (the board) so the paper swings under it. The avatar `<Image>` is wrapped in a
 * `tw-note__avatar` span (bg + rounded-sm + overflow-hidden) so the
 * transparent dicebear edge is clipped against an opaque surface.
 *
 * When NOT in the pan path (reduced-motion / mobile static grid) the card renders
 * pinned-static (full opacity, resting tilt, pin visible) with the hover lean
 * only — no entrance.
 *
 * Tokens only (zero hex), rounded-md radius, Phosphor-free (no icons).
 */

// Spring for the hover lean: soft, slightly springy paper feel.
const HOVER_SPRING = { stiffness: 220, damping: 18, mass: 0.6 } as const;

// Easing tuples (mirror app/globals.css). Variants accept bezier tuples; type
// them as a fixed 4-number tuple so Motion's `Easing` accepts them.
type Bezier = [number, number, number, number];
const EASE_OUT: Bezier = [0.22, 1, 0.36, 1];
const EASE_SNAP: Bezier = [0.34, 1.56, 0.64, 1]; // bounce overshoot
const EASE_EXPO: Bezier = [0.16, 1, 0.3, 1];

const ENTRANCE_EASE: Record<EntranceVariant, Bezier> = {
  "slide-up": EASE_OUT,
  "rotate-drop": EASE_SNAP,
  "fade-scale": EASE_OUT,
  "slide-right": EASE_OUT,
  "blur-drop": EASE_EXPO,
};

const SIZE_CLASS: Record<NoteSize, string> = {
  sm: "tw-note--sm",
  md: "tw-note--md",
  lg: "tw-note--lg",
};

export function TestimonialCard({
  name,
  role,
  company,
  quote,
  avatar,
  featured = false,
  entrance = "slide-up",
  size = "md",
  tilt,
  panProgress,
  placed = false,
  // `index`/`total` give an accessible position-in-sequence label
  // ("Testimonio 3 de 7") for screen-reader users tabbing the board.
  index,
  total,
}: TestimonialCardProps) {
  const reduceMotion = useReducedMotion();

  // Resting tilt: explicit `tilt` wins; otherwise asymmetric default by featured.
  const restTilt = tilt ?? (featured ? 1.5 : -1.5);

  // The pan path supplies a panProgress MotionValue (it owns the scroll-driven
  // pan + zoom). Its PRESENCE signals the card should play its time-based
  // entrance. `placed` (legacy of the retired cork-hand intro) forces the note to
  // render opaque + held with no entrance; no note sets it in the v2 board.
  const pan = Boolean(panProgress) && !reduceMotion && !placed;

  // --- Hover lean (pointer) -------------------------------------------------
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateZ = useSpring(useTransform(px, [-1, 1], [-3.2, 3.2]), HOVER_SPRING);
  const driftX = useSpring(useTransform(px, [-1, 1], [-9, 9]), HOVER_SPRING);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-5, 5]), HOVER_SPRING);
  const rotateX = useSpring(useTransform(py, [-1, 1], [4, -4]), HOVER_SPRING);

  // --- Time-based entrance variants (played once on viewport-enter) ---------
  // The unit fades + travels in from its variant's "hidden" pose to the resting
  // pose, reaching FULL opacity (and holding it). One pose per entrance variant.
  const unitVariants: Variants = {
    hidden: {
      opacity: 0,
      y:
        entrance === "rotate-drop"
          ? -36
          : entrance === "slide-up"
            ? 52
            : entrance === "blur-drop"
              ? 28
              : 0,
      x: entrance === "slide-right" ? -64 : 0,
      rotate: entrance === "rotate-drop" ? -10 : restTilt,
      scale: entrance === "fade-scale" ? 0.9 : 1,
      filter: entrance === "blur-drop" ? "blur(10px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      rotate: restTilt,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: ENTRANCE_EASE[entrance] },
    },
  };

  // Tape "press": the strip settles onto the paper just AFTER it lands (delay),
  // so the note is never shown unheld. A small scale-down + fade reads as a piece
  // of tape being smoothed down (no overshoot — tape does not bounce like a pin).
  const pinVariants: Variants = {
    hidden: { opacity: 0, y: -8, scale: 1.12 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.36, ease: EASE_OUT, delay: 0.26 },
    },
  };

  // Tape tint alternates across the run (decorative run alternation): two neutral
  // warm tones, NEVER a brand hue. Even notes lean toward the sunken surface,
  // odd notes toward a slightly warmer hairline mix — both semi-translucent.
  const tapeWarm = (index ?? 0) % 2 === 0;

  const avatarAlt = `Avatar de ${name}, ${role} en ${company}`;
  const sequenceLabel =
    index !== undefined && total !== undefined
      ? `Testimonio ${index + 1} de ${total}`
      : undefined;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const resetPointer = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      aria-label={sequenceLabel}
      className={cn(
        // NO background, NO border on the article: the visible surface + shadows
        // live inside the moving unit so nothing bleeds.
        "tw-note relative isolate",
        SIZE_CLASS[size],
        featured ? "tw-note--featured" : "tw-note--regular",
      )}
      // Pan path: orchestrate the children's whileInView entrance ONCE. Static
      // path: no entrance (children render at their resting pose).
      initial={pan ? "hidden" : false}
      whileInView={pan ? "visible" : undefined}
      viewport={{ once: true, amount: 0.35 }}
    >
      {/* Tape (celo): STAYS on the board (article level), so the paper swings
          under it. Small semi-translucent washi strip, slightly rotated. The
          .tw-note__pin class NAME is preserved (e2e hook + JS). In the pan path it
          presses on (variant, delayed). Decorative -> aria-hidden. Neutral warm
          tint, alternating across the run; the strip itself carries a faint inner
          hairline edge for the layered-paper read. */}
      <motion.span
        aria-hidden
        className="tw-note__pin"
        variants={pan ? pinVariants : undefined}
        style={{
          rotate: tapeWarm ? -4 : 5,
          ...(pan ? { willChange: "transform, opacity" } : null),
        }}
      >
        <span
          className={cn(
            "block h-5 w-20 rounded-sm border border-border-hairline",
            tapeWarm ? "bg-surface-sunken/75" : "bg-surface-raised/70",
          )}
        />
      </motion.span>

      {/* THE single opaque paper unit: entrance pose (pan path) wraps the hover
          lean, which owns BOTH shadow spans + the figure + avatar. The whole
          paper (shadows included) enters/leans as ONE unit. In the static path
          it sits at its resting tilt, fully opaque. */}
      <motion.div
        className="tw-note__unit"
        variants={pan ? unitVariants : undefined}
        style={
          pan
            ? { transformOrigin: "top center", willChange: "transform, opacity" }
            : { rotate: restTilt, transformOrigin: "top center" }
        }
      >
        {/* Hover lean (pivots from the pin / top center, like paper swinging). */}
        <motion.div
          className="tw-note__lean"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          style={{
            rotate: reduceMotion ? 0 : rotateZ,
            x: reduceMotion ? 0 : driftX,
            rotateX: reduceMotion ? 0 : rotateX,
            rotateY: reduceMotion ? 0 : rotateY,
            transformOrigin: "top center",
            transformPerspective: 900,
          }}
          whileHover={reduceMotion ? undefined : { y: -5, scale: 1.015 }}
          transition={HOVER_SPRING}
        >
          {/* Both shadow layers live INSIDE the moving unit (design §4): they
              travel + lean WITH the paper, so the drop shadow never desyncs. */}
          <span aria-hidden className="tw-note__shadow tw-note__shadow--hard" />
          <span aria-hidden className="tw-note__shadow tw-note__shadow--soft" />

          <figure
            className={cn(
              // The opaque cream surface lives HERE (moves with the unit).
              "flex flex-col gap-6 rounded-md border border-border bg-surface-raised p-6",
              featured && "gap-8 p-8",
            )}
          >
            <blockquote
              className={cn(
                "text-text-primary",
                featured ? "text-body-lg" : "text-body",
              )}
            >
              {/* Typographic quotation marks (« »); no straight ASCII quotes. */}
              {`«${quote}»`}
            </blockquote>

            <figcaption className="flex items-center gap-4">
              {/* Avatar wrapper: bg + rounded + overflow-hidden clips the
                  transparent dicebear edge against an opaque surface. */}
              <span className="tw-note__avatar inline-flex h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-surface-raised">
                <Image
                  src={avatar.src}
                  alt={avatarAlt}
                  width={avatar.width}
                  height={avatar.height}
                  sizes="64px"
                  // dicebear returns a remote SVG. `unoptimized` skips the
                  // next/image optimizer; width/height stay so layout is
                  // reserved (CLS 0). No own border/radius — the wrapper clips.
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="flex flex-col">
                <span
                  className={cn(
                    "text-text-primary",
                    featured
                      ? "font-display text-h3 leading-tight"
                      : "text-body",
                  )}
                >
                  {name}
                </span>
                <span className="text-meta font-mono text-text-secondary">
                  {role}
                </span>
                <span className="text-body-sm text-text-secondary">
                  {company}
                </span>
              </span>
            </figcaption>
          </figure>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
