"use client";

/**
 * Pricing recommender ("el plan recomendado, anotado a mano", spec §4).
 *
 * Client leaf: it renders inside the server Section that owns the <h2>
 * "Un plan para cada momento" heading, so we do NOT repeat the heading here.
 *
 * Concept: a tiny "¿cuál te sirve?" selector (two single-select ToggleGroups)
 * derives a recommended tier. A hand-drawn clay annotation (arrow + tag
 * "Recomendado" + a hand-drawn box around the card) MOVES to the matching tier.
 *
 * Motion (spec §4, motion level "medio"):
 * - The annotation moves between cards with a SHARED `layoutId` (FLIP): when the
 *   recommended tier changes, the tag/arrow/box animate from one card to the
 *   next with --ease-snap (cubic-bezier(0.34,1.56,0.64,1)), ~400ms.
 * - The hand-drawn box redraws via pathLength. pathLength is NOT a transform, so
 *   MotionConfig reducedMotion="user" does not degrade it on its own; we gate it
 *   explicitly with useReducedMotion().
 * - The static `highlighted` emphasis (scale 1.02 + hard shadow) stays on the
 *   target tier (Pro) and is owned by PricingCard; the annotation is what moves.
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
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const FLIP_DURATION = 0.4;
const DURATION_DRAW = 0.48;
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
    <div className="flex flex-col gap-12">
      {/* Top band: selector + live conclusion side by side, so the section uses
          the full width instead of leaving a lonely line under the selector. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        <Selector
          work={work}
          portfolio={portfolio}
          onWorkChange={setWork}
          onPortfolioChange={setPortfolio}
        />

        {/* Recommendation conclusion in plain text + announced politely to
            screen readers. This is the a11y / reduced-motion ground truth: the
            moving annotation is an enhancement on top of this, never the only
            signal. The panel fills the dead space next to the selector. */}
        <aside
          id={liveId}
          aria-live="polite"
          className="flex flex-col justify-center gap-2 rounded-card border border-border-strong bg-surface-raised p-6 shadow-hard-sm"
        >
          <span className="font-mono text-meta uppercase text-accent-secondary">
            Nuestra recomendación
          </span>
          <p className="text-body-lg text-text-secondary">
            Para ti, el plan{" "}
            <span className="font-display text-h3 text-text-primary">
              {recommended}
            </span>
            .
          </p>
          <p className="text-body-sm text-text-muted">{reason}</p>
        </aside>
      </div>

      {/* Equal-height cards (md:items-stretch + h-full in PricingCard) so the
          CTAs align across tiers. pt-10 reserves room for the hand-drawn arrow
          + tag that overhang the recommended card. */}
      <div className="grid grid-cols-1 gap-8 pt-10 md:grid-cols-3 md:items-stretch">
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
 * also filled + bordered in the clay accent language).
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
    <fieldset className="flex flex-col gap-4 border border-border bg-surface-raised p-6">
      <legend className="px-2 font-mono text-meta uppercase text-accent-secondary">
        ¿Cuál te sirve?
      </legend>

      <div className="flex flex-col gap-6 md:flex-row md:gap-12">
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
      <span className="font-mono text-meta uppercase text-text-muted">
        {label}
      </span>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={onValueChange}
        aria-label={label}
        variant="outline"
        className="gap-0"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            // Layout/state overrides only: active item adopts the clay accent
            // language so the choice never relies on a single visual cue.
            className={cn(
              "h-auto px-4 py-2 text-body-sm text-text-secondary",
              "border-border-strong",
              "transition-colors duration-[var(--duration-micro)]",
              "data-[state=on]:bg-accent-secondary-soft",
              "data-[state=on]:text-accent-secondary",
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
 * Annotation: the moving hand-drawn clay mark. Three shared-layoutId parts so
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
        pathLength: { duration: reduceMotion ? 0 : DURATION_DRAW, ease: EASE_OUT },
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
        className="pointer-events-none absolute -inset-2 z-10 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-accent-secondary"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          // Wobbly hand-drawn rectangle that overshoots its corners slightly.
          d="M3 5 C 30 2, 70 4, 97 3 C 96 30, 98 70, 97 96 C 70 98, 30 97, 4 97 C 3 70, 5 30, 3 4"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          variants={draw}
          initial="hidden"
          animate="visible"
        />
      </motion.svg>

      {/* The "Recomendado" tag: a clay sticker that FLIPs between cards. */}
      <motion.span
        layoutId="pricing-recommend-tag"
        layout={!reduceMotion}
        transition={flip}
        aria-describedby={describedById}
        className={cn(
          "absolute -top-3 right-3 z-20 -rotate-2 rounded-input",
          "border border-border-strong bg-accent-secondary px-3 py-1",
          "font-mono text-meta uppercase text-on-accent-secondary shadow-hard-sm",
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
        className="absolute -left-6 -top-8 z-20 hidden text-accent-secondary md:block"
      >
        <motion.svg width="56" height="48" viewBox="0 0 56 48" fill="none">
          <motion.path
            d="M4 6 C 12 18, 22 20, 30 30 C 36 37, 44 38, 50 42"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            initial="hidden"
            animate="visible"
          />
          <motion.path
            d="M50 42 L 39 41 M50 42 L 46 31"
            stroke="currentColor"
            strokeWidth="2.5"
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
