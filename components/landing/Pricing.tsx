"use client";

/**
 * Pricing recommender ("el plan recomendado, anotado a mano", spec §4).
 *
 * Client leaf: it renders inside the server Section that owns the <h2>
 * "Un plan para cada momento" heading, so we do NOT repeat the heading here.
 *
 * Concept: a tiny "¿cuál te sirve?" selector (two single-select ToggleGroups)
 * derives a recommended tier. A hand-drawn support/wisp annotation (arrow + a
 * buttermilk "Recomendado" pill + a hand-drawn box around the card, the firma
 * role of the v2 system) MOVES to the matching tier.
 *
 * Motion (spec §4, motion level "medio"):
 * - The annotation moves between cards with a SHARED `layoutId` (FLIP): when the
 *   recommended tier changes, the tag/arrow/box animate from one card to the
 *   next with --ease-snap (cubic-bezier(0.34,1.56,0.64,1)), ~400ms.
 * - The hand-drawn box redraws via pathLength. pathLength is NOT a transform, so
 *   MotionConfig reducedMotion="user" does not degrade it on its own; we gate it
 *   explicitly with useReducedMotion().
 * - The static `highlighted` emphasis (scale 1.02 + ink border, no shadow) stays
 *   on the target tier (Pro) and is owned by PricingCard; the annotation moves.
 *
 * a11y / reduced-motion (hard):
 * - The recommendation is ALSO in visible text ("Para ti: el plan {X}") and
 *   announced to screen readers via aria-live="polite" on change.
 * - Under prefers-reduced-motion: no FLIP, no scale animation; the arrow and box
 *   render static in the recommended tier and the tag just appears there. The
 *   user understands the recommendation without depending on movement.
 *
 * Honesty (taste): no fake stock counter, no countdown, no invented numbers.
 * The anchor is real value + visual hierarchy + the annotation that argues it.
 */
import { useId, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { PricingCard } from "@/components/landing/PricingCard";
import type { PricingCardProps } from "@/components/landing/types";
import { cn } from "@/lib/utils";

// --ease-snap = cubic-bezier(0.34, 1.56, 0.64, 1); FLIP ~400ms.
const EASE_SNAP = [0.34, 1.56, 0.64, 1] as const;
// v2 --easing-emphasis (cubic-bezier(0.2, 0.8, 0.2, 1)): the hand-drawn box /
// arrow redraw on reveal. Mirrors the token; kept as a JS tuple for Motion.
const EASE_EMPHASIS = [0.2, 0.8, 0.2, 1] as const;
const FLIP_DURATION = 0.4;
// Calmer draw-in for the refined single-stroke glyphs: a touch slower than
// before (0.48 -> 0.62) so the pen reads deliberate, not eager.
const DURATION_DRAW = 0.62;
const DURATION_MICRO = 0.12;

type Work = "solo" | "equipo";
type Portfolio = "pocos" | "grande";

type Props = {
  tiers: PricingCardProps[];
};

/**
 * Recommendation logic (explicit, spec §4):
 * - equipo            -> Team
 * - solo + pocos      -> Free
 * - solo + grande     -> Pro
 * Default state ("Solo yo" + "Cartera grande") therefore lands on Pro, the
 * target tier, which is already pre-noted on mount.
 */
function recommendTier(work: Work, portfolio: Portfolio): string {
  if (work === "equipo") return "Team";
  if (portfolio === "pocos") return "Free";
  return "Pro";
}

/**
 * One-line "why" behind the recommendation. Fills the conclusion panel so the
 * recommendation reads as an argument, not just a label. Mirrors recommendTier.
 */
function recommendReason(work: Work, portfolio: Portfolio): string {
  if (work === "equipo")
    return "Trabajáis en equipo: necesitáis multiusuario y permisos por rol.";
  if (portfolio === "pocos")
    return "Cartera pequeña y en solitario: el plan gratis te sobra para arrancar.";
  return "En solitario con cartera grande: uso ilimitado y reportes, sin pagar de más.";
}

export function Pricing({ tiers }: Props) {
  const reduceMotion = useReducedMotion();
  const liveId = useId();

  // Default = "Solo yo" + "Cartera grande" -> Pro (the pre-noted target tier).
  const [work, setWork] = useState<Work>("solo");
  const [portfolio, setPortfolio] = useState<Portfolio>("grande");

  const recommended = recommendTier(work, portfolio);
  const reason = recommendReason(work, portfolio);

  return (
    <div className="flex flex-col gap-6">
      {/* Unified recommender bar: ONE cohesive surface (single border, radius,
          shadow) split into selector (left) + live recommendation (right),
          balanced and separated by a hairline. This reads as a single
          instrument and feeds the eye straight down into the cards, instead of
          two mismatched boxes side by side. */}
      <div className="overflow-hidden rounded-lg border border-border-strong bg-surface-raised shadow-flat">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Selector
            work={work}
            portfolio={portfolio}
            onWorkChange={setWork}
            onPortfolioChange={setPortfolio}
          />

          {/* Recommendation conclusion in plain text + announced politely to
              screen readers. This is the a11y / reduced-motion ground truth: the
              moving annotation is an enhancement on top of this, never the only
              signal. Separated from the selector by a hairline (top on mobile,
              left on desktop) so the bar stays one surface. */}
          {/* A11y: this is a content panel INSIDE the pricing recommender, not a
              page-level complementary region. Using <aside> made it an implicit
              `complementary` landmark nested inside <main>, which axe flags as
              `landmark-complementary-is-top-level` (a nested complementary
              landmark). It is a plain <div> with `aria-live="polite"` so the
              recommendation is still announced on change without introducing a
              stray nested landmark. */}
          <div
            id={liveId}
            aria-live="polite"
            className="flex flex-col justify-center gap-1.5 border-t border-border bg-surface-sunken/40 p-5 md:border-l md:border-t-0"
          >
            <span className="font-mono text-meta uppercase text-text-tertiary">
              Nuestra recomendación
            </span>
            <p className="text-body-lg text-text-secondary">
              Para ti, el plan{" "}
              <span className="font-display text-h2 text-text-primary">
                {recommended}
              </span>
              .
            </p>
            <p className="text-body-sm text-text-tertiary">{reason}</p>
          </div>
        </div>
      </div>

      {/* Equal-height cards (md:items-stretch + h-full in PricingCard) so the
          CTAs align across tiers. pt-10 reserves room for the hand-drawn arrow
          + tag that overhang the recommended card and visually connect the bar
          above to the matching card. */}
      <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-3 md:items-stretch">
        {tiers.map((tier) => {
          const isRecommended = tier.tier === recommended;
          return (
            <div key={tier.tier} className="relative">
              {/* The moving annotation lives inside the matching card wrapper.
                  Only one card renders it at a time; the shared layoutId makes
                  Motion FLIP it from the previous card to this one. */}
              {isRecommended ? (
                <Annotation
                  reduceMotion={!!reduceMotion}
                  describedById={liveId}
                />
              ) : null}
              <PricingCard {...tier} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * Selector: two single-select ToggleGroups ("¿cuál te sirve?"). Each group is
 * a labelled radiogroup; color is never the only state cue (the active item is
 * also filled + bordered in the ink accent language).
 * ------------------------------------------------------------------------- */
function Selector({
  work,
  portfolio,
  onWorkChange,
  onPortfolioChange,
}: {
  work: Work;
  portfolio: Portfolio;
  onWorkChange: (value: Work) => void;
  onPortfolioChange: (value: Portfolio) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3 p-5">
      <legend className="font-mono text-meta uppercase text-text-tertiary">
        ¿Cuál te sirve?
      </legend>

      <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
        <ToggleField
          label="Trabajo"
          value={work}
          onValueChange={(value) => {
            if (value) onWorkChange(value as Work);
          }}
          options={[
            { value: "solo", label: "Solo yo" },
            { value: "equipo", label: "En equipo" },
          ]}
        />
        <ToggleField
          label="Cartera"
          value={portfolio}
          onValueChange={(value) => {
            if (value) onPortfolioChange(value as Portfolio);
          }}
          options={[
            { value: "pocos", label: "Pocos clientes" },
            { value: "grande", label: "Cartera grande" },
          ]}
        />
      </div>
    </fieldset>
  );
}

function ToggleField({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-meta uppercase text-text-tertiary">
        {label}
      </span>
      {/* Premium segmented control (iOS-segmented read, mined from the 21st.dev
          SegmentGroup / ToggleGroup pattern: a SUNKEN track holds the items and
          the ACTIVE one becomes a raised chip). Translated into v2 ink tokens:
          the track is a sunken buttermilk rail with a hairline + a subtle inner
          shadow (depth cue), and the ACTIVE item is a SOLID INK pill with white
          text — the exact CTA language, so the choice reads decided/solid, never
          tinted-pastel. Idle items are text-secondary with a hover lift; :active
          presses 0.97 for tactile feedback. ToggleGroup keeps radiogroup
          semantics, so color is never the only state cue (fill + weight shift). */}
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={onValueChange}
        aria-label={label}
        // Sunken track: inset hairline ring + soft inner shadow give the rail
        // depth so the active ink pill reads as raised out of it.
        className={cn(
          "inline-flex w-fit gap-1 rounded-md bg-surface-sunken p-1",
          // Sunken depth: inset hairline ring (border-strong) + a soft inner
          // shadow tinted to the warm ink base (same rgba(31,27,22,...) the
          // --shadow-soft token uses), so the rail reads recessed.
          "shadow-[inset_0_0_0_1px_var(--color-border-strong),inset_0_1px_3px_rgba(31,27,22,0.08)]",
        )}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            // Idle = text-secondary, transparent (the rail shows through). Active
            // = solid ink fill + white text (matches the primary CTA, 19:1, AA
            // far clear). The whole shape changes state — fill + text weight of
            // color — so it never relies on hue alone. :active scale for touch.
            className={cn(
              "h-auto rounded-sm border-0 bg-transparent px-4 py-2 text-body-sm font-medium text-text-secondary",
              "transition-all duration-[var(--duration-fast)] ease-[var(--easing-emphasis)]",
              "hover:bg-surface-raised hover:text-text-primary hover:shadow-soft",
              "active:scale-[0.97]",
              "data-[state=on]:bg-accent-primary",
              "data-[state=on]:text-accent-fg",
              "data-[state=on]:shadow-soft",
              "data-[state=on]:hover:bg-accent-primary data-[state=on]:hover:text-accent-fg",
            )}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * Annotation: the moving hand-drawn support/wisp mark. Three shared-layoutId parts so
 * they FLIP together to whichever card matches:
 *   - the tag "Recomendado" (top-right, slightly rotated like a sticker),
 *   - a hand-drawn arrow pointing at the card,
 *   - a hand-drawn box redrawn around the card via pathLength.
 * Under reduced-motion: no FLIP / no draw, everything renders in final state.
 * ------------------------------------------------------------------------- */
function Annotation({
  reduceMotion,
  describedById,
}: {
  reduceMotion: boolean;
  describedById: string;
}) {
  // pathLength normalizes the path to 0..1 so dash values are length-agnostic.
  const draw: Variants = {
    hidden: { pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: reduceMotion ? 0 : DURATION_DRAW, ease: EASE_EMPHASIS },
        opacity: { duration: reduceMotion ? 0 : DURATION_MICRO },
      },
    },
  };

  // Shared FLIP transition for the parts that move between cards: a tween with
  // the brutalist snap ease (--ease-snap overshoots like a stamped sticker).
  // Under reduced-motion layout animation is disabled (MotionConfig "user"), so
  // the tag simply appears at the recommended card without animating.
  const flip = {
    type: "tween" as const,
    ease: EASE_SNAP,
    duration: FLIP_DURATION,
  };

  return (
    <>
      {/* Hand-drawn box redrawn around the recommended card. Absolutely
          positioned over the card; pointer-events-none so it never blocks the
          CTA. aria-hidden: the recommendation is already in the live text. */}
      <motion.svg
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 z-10 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-support"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          // Single confident loop (mature hand-drawn-clean, like the hero
          // glyphs): one continuous stroke around the card with a calm,
          // intentional overshoot where it closes at the top, instead of the old
          // four-segment scribble. Round caps/joins; non-scaling so the 1.6px
          // stroke stays even on the stretched viewBox.
          d="M4 6 C 32 3, 68 3, 96 4 C 97 32, 97 68, 96 96 C 68 98, 32 98, 4 96 C 3 68, 3 32, 4 6 C 8 4.5, 14 4, 20 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          variants={draw}
          initial="hidden"
          animate="visible"
        />
      </motion.svg>

      {/* The "Recomendado" tag: a buttermilk sticker that FLIPs between cards. */}
      <motion.span
        layoutId="pricing-recommend-tag"
        layout={!reduceMotion}
        transition={flip}
        aria-describedby={describedById}
        className={cn(
          "absolute -top-3 right-3 z-20 -rotate-2 rounded-sm",
          // "Recomendado" pill = highlight buttermilk used as a TEXT BACKGROUND
          // (the one non-underline use of highlight, per the role contract):
          // buttermilk fill + highlight-fg text (5.32:1). Never as a non-text mark.
          "border border-border-hairline bg-highlight px-3 py-1",
          "font-mono text-meta uppercase text-highlight-fg",
        )}
      >
        Recomendado
      </motion.span>

      {/* Hand-drawn arrow that FLIPs along with the tag, pointing at the card
          from the top-left. aria-hidden decorative. */}
      <motion.div
        layoutId="pricing-recommend-arrow"
        layout={!reduceMotion}
        transition={flip}
        aria-hidden="true"
        className="absolute -left-6 -top-8 z-20 hidden text-support md:block"
      >
        <motion.svg width="56" height="48" viewBox="0 0 56 48" fill="none">
          {/* Single confident curve with a slight overshoot tail at the tip
              (the pen lifts a touch past the target), then the arrowhead as one
              continuous V — no scribble, mirrors the hero glyph language. */}
          <motion.path
            d="M5 7 C 14 19, 23 23, 33 31 C 39 36, 46 39, 51 41"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            initial="hidden"
            animate="visible"
          />
          <motion.path
            d="M40 42 L 51 41 L 47 30"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            initial="hidden"
            animate="visible"
          />
        </motion.svg>
      </motion.div>
    </>
  );
}
