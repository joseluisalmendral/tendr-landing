"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { Check, WarningCircle } from "@phosphor-icons/react/dist/ssr";

/**
 * HeroPipeline: the hero's right-column faux-UI — a "nota viva" that shows the
 * user's client pipeline AT A GLANCE, so the note sells the headline ("Mira de
 * un vistazo qué toca con cada cliente hoy").
 *
 * Iteration 2 (change v2-token-migration, batch B1-fix-2). The previous build
 * showed 4 loose name-chips floating on a blank note with tiny status labels —
 * it did NOT read as a pipeline to a first-time visitor (ambiguous, no warmth,
 * and the hand-drawn arrow pointed at nothing). This rebuild makes the note
 * legible as a board and adds the product's emotional moment:
 *
 *   1. THREE labeled mini-columns (Contacto · Propuesta · Activo — the canonical
 *      short pipeline stages, coherent with journey-stages.tsx) with a count
 *      badge each and the client cards sitting INSIDE their column (not floating).
 *      This single change kills the ambiguity: it now reads "tablero de clientes".
 *   2. WARMTH: each card carries a small initial-avatar with a warm tint that
 *      varies per card; one card ("Lucía", Activo) shows a calm looping check to
 *      feel alive; one card ("Ana") carries a subtle "hoy" cue.
 *   3. THE NUDGE: a small toast chip overlapping the note's top-right corner —
 *      "Marta · 12 días sin contacto → Retomar" with the warning accent. This is
 *      the product promise in one glance ("nothing slips") and it gives the
 *      hand-drawn arrow (in Hero.tsx) a REASON to exist: the arrow now aims at
 *      this chip.
 *
 * Isolated client leaf (design ADR-001): the only interactive code in the hero
 * right column. Everything renders at its final ordered layout at SSR; the
 * entrance is a transform/opacity delta applied on mount (no hydration mismatch,
 * no layout shift — the columns reserve their height via min-h, CLS 0). On mobile
 * (<md) or under prefers-reduced-motion the board mounts straight to its final
 * state with no motion (the check loop and entrance both gate off).
 *
 * Motion is MOTIVATED (design-taste §5): the entrance stagger communicates
 * "items dropping into their columns = your pipeline assembling"; the single
 * check loop communicates "this card is alive / done"; the hover lift gives
 * tactile feedback. transform/opacity only (GPU). NOT scroll-driven — it resolves
 * before any realistic first scroll so it never competes with the cork beat.
 */

type StageKey = "Contacto" | "Propuesta" | "Activo";

type PipelineCard = {
  id: string;
  client: string;
  /** Warm avatar tint — varied per card for simpatía, kept AA on the initial. */
  tint: "support" | "warning" | "success" | "neutral";
  /** A calm looping check (alive cue). At most one card carries it. */
  alive?: boolean;
  /** A subtle "hoy" cue chip on the card. At most one card carries it. */
  today?: boolean;
};

// The board's three stages and the cards that live in each. Same client names as
// the previous build (Ana, Marco, Lucía, Diego). All mock data.
const COLUMNS: { stage: StageKey; cards: PipelineCard[] }[] = [
  {
    stage: "Contacto",
    cards: [{ id: "ana", client: "Ana", tint: "support", today: true }], // mock
  },
  {
    stage: "Propuesta",
    cards: [
      { id: "marco", client: "Marco", tint: "warning" }, // mock
      { id: "diego", client: "Diego", tint: "neutral" }, // mock
    ],
  },
  {
    stage: "Activo",
    cards: [{ id: "lucia", client: "Lucía", tint: "success", alive: true }], // mock
  },
];

const TOTAL_CARDS = COLUMNS.reduce((n, c) => n + c.cards.length, 0);

const MD_QUERY = "(min-width: 768px)";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const; // --easing-expo (settle, wow beat, v2)

// Warm avatar tints. accent-secondary / *-soft tokens were retired in v2 (they
// no-op), so the tints are built from the live v2 tokens via color-mix on a warm
// surface — believable variation while the initial letter stays a strong ink/
// brand color for AA contrast on the soft fill.
const TINTS: Record<
  PipelineCard["tint"],
  { bg: string; fg: string; border: string }
> = {
  support: {
    bg: "color-mix(in oklab, var(--color-support) 14%, var(--color-surface-raised))",
    fg: "var(--color-support)",
    border: "color-mix(in oklab, var(--color-support) 30%, transparent)",
  },
  warning: {
    bg: "color-mix(in oklab, var(--color-warning) 16%, var(--color-surface-raised))",
    fg: "var(--color-warning)",
    border: "color-mix(in oklab, var(--color-warning) 32%, transparent)",
  },
  success: {
    bg: "color-mix(in oklab, var(--color-success) 14%, var(--color-surface-raised))",
    fg: "var(--color-success)",
    border: "color-mix(in oklab, var(--color-success) 30%, transparent)",
  },
  neutral: {
    bg: "var(--color-surface-sunken)",
    fg: "var(--color-text-secondary)",
    border: "var(--color-border-strong)",
  },
};

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Orchestration only — the container never paints, it only sequences children.
// delayChildren ~300ms post-LCP safety; a calm 90ms beat between cards.
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.3, staggerChildren: 0.09 },
  },
};

// Each card drops into its column: a small rise + fade. transform/opacity only.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_EXPO },
  },
};

// The nudge chip arrives last, with a tiny settle, so the eye lands on it after
// the board has assembled (it is the payoff of the whole composition).
const nudgeVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.9, duration: 0.4, ease: EASE_EXPO },
  },
};

// Calm looping check on the single "Activo" card — a whisper of life, NOT a
// flashing status. Gated off on mobile / reduced-motion (mounts solid).
const aliveVariants: Variants = {
  rest: { scale: 1, opacity: 1 },
  pulse: {
    scale: [1, 1.14, 1],
    opacity: [1, 0.85, 1],
    transition: {
      duration: 2.4,
      repeat: Infinity,
      repeatDelay: 1.6,
      ease: "easeInOut",
    },
  },
};

const HOVER_LIFT = { y: -3 } as const;
const HOVER_TRANSITION = { duration: 0.16, ease: "easeOut" } as const;

function Avatar({ client, tint }: { client: string; tint: PipelineCard["tint"] }) {
  const t = TINTS[tint];
  return (
    <span
      aria-hidden="true"
      className="flex size-7 shrink-0 items-center justify-center rounded-sm border font-mono text-body-sm"
      style={{ backgroundColor: t.bg, color: t.fg, borderColor: t.border }}
    >
      {client.charAt(0)}
    </span>
  );
}

function CardView({
  card,
  alive,
  stage,
}: {
  card: PipelineCard;
  alive: boolean;
  /** When set (mobile stacked list), the card shows its stage as a tag so the
   * pipeline still reads without the column headers. */
  stage?: StageKey;
}) {
  return (
    <motion.div variants={cardVariants}>
      <motion.div
        whileHover={HOVER_LIFT}
        transition={HOVER_TRANSITION}
        className="flex items-center gap-2 rounded-md border border-border-strong bg-surface-raised px-2.5 py-2 shadow-flat"
      >
        <Avatar client={card.client} tint={card.tint} />
        <span className="min-w-0 flex-1 truncate text-body-sm text-text-primary">
          {card.client}
        </span>
        {stage ? (
          <span className="shrink-0 rounded-sm border border-border-strong bg-surface-sunken px-1.5 py-0.5 font-mono text-meta uppercase text-text-tertiary">
            {stage}
          </span>
        ) : null}
        {card.today ? (
          <span className="shrink-0 rounded-sm bg-surface-sunken px-1.5 py-0.5 font-mono text-meta uppercase text-text-secondary">
            Hoy
          </span>
        ) : null}
        {card.alive ? (
          <motion.span
            aria-hidden="true"
            variants={aliveVariants}
            animate={alive ? "pulse" : "rest"}
            className="flex size-4 shrink-0 items-center justify-center rounded-full"
            style={{ color: "var(--color-success)" }}
          >
            <Check size={13} weight="bold" />
          </motion.span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

function Column({
  stage,
  cards,
  alive,
}: {
  stage: StageKey;
  cards: PipelineCard[];
  alive: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-1">
        <span className="truncate font-mono text-meta uppercase text-text-tertiary">
          {stage}
        </span>
        <span className="shrink-0 rounded-sm bg-surface-sunken px-1.5 font-mono text-meta text-text-tertiary">
          {cards.length}
        </span>
      </div>
      <div className="flex min-h-[7.5rem] flex-col gap-2 rounded-md border border-dashed border-border-strong p-1.5">
        {cards.map((card) => (
          <CardView key={card.id} card={card} alive={alive} />
        ))}
      </div>
    </div>
  );
}

/**
 * HeroPipeline container. Renders the board (a window-chrome header + 3 stage
 * columns) and the nudge chip overlapping the top-right corner. The entrance is
 * driven imperatively after mount (once the real viewport is known) so SSR /
 * no-JS / first paint stay at the final ordered state:
 *   - desktop && !reduced-motion → play the assemble entrance + the alive loop
 *   - otherwise → jump straight to the final state, no motion
 */
export function HeroPipeline() {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  // Alive (looping check) gate — OFF until desktop && !reduce is confirmed.
  const [alive, setAlive] = useState(false);

  useIsoLayoutEffect(() => {
    const isDesktop =
      typeof window !== "undefined" && window.matchMedia(MD_QUERY).matches;

    if (isDesktop && !reduce) {
      controls.set("hidden");
      void controls.start("visible");
      setAlive(true);
    } else {
      controls.set("visible");
      setAlive(false);
    }
  }, [controls, reduce]);

  return (
    <div className="relative w-full">
      <motion.div
        className="overflow-hidden rounded-lg border border-border-strong bg-surface-raised shadow-soft"
        variants={containerVariants}
        initial={false}
        animate={controls}
      >
        {/* Window chrome — labels the board as a product surface. */}
        <div className="flex items-center justify-between border-b border-border-strong px-4 py-2.5">
          <span className="font-mono text-meta uppercase text-text-tertiary">
            Tu cartera
          </span>
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-border-strong" />
            <span className="size-2 rounded-full bg-border-strong" />
            <span className="size-2 rounded-full bg-border-strong" />
          </span>
        </div>

        {/* The board.
            - sm+ : a true 3-column kanban (cards inside their stage column).
            - <sm : the 3 narrow columns would truncate every name at 390px, so
              the board collapses to a single stacked list where each card shows
              its stage as a tag — it still reads as "tablero de clientes" and
              stays fully legible. */}
        {/* Mobile: stacked list (hidden sm+). */}
        <div className="flex flex-col gap-2 p-3.5 sm:hidden">
          {COLUMNS.flatMap((col) =>
            col.cards.map((card) => (
              <CardView
                key={card.id}
                card={card}
                alive={alive}
                stage={col.stage}
              />
            )),
          )}
        </div>
        {/* sm+: 3-column kanban (hidden < sm). */}
        <div className="hidden grid-cols-3 gap-2.5 p-3.5 sm:grid">
          {COLUMNS.map((col) => (
            <Column
              key={col.stage}
              stage={col.stage}
              cards={col.cards}
              alive={alive}
            />
          ))}
        </div>

        {/* Footer line: the at-a-glance total, reinforcing "tu cartera de un
            vistazo". The count carries meaning (it is the sum of the columns). */}
        <div className="flex items-center justify-between border-t border-border-strong px-4 py-2">
          <span className="text-meta text-text-tertiary">
            {TOTAL_CARDS} clientes en tu cartera {/* mock */}
          </span>
        </div>
      </motion.div>

      {/* THE NUDGE — the product promise in one glance: a client is slipping and
          Tendr tells you to retake it.
          - sm+ : floats over the note's top-right corner (the hand-drawn arrow in
            Hero.tsx aims here).
          - <sm : sits in-flow just below the board so the mobile stack keeps the
            promise (a corner-overflow chip would clip off the viewport edge).
          warning accent (#b5832e — AA on its surface). */}
      <motion.div
        variants={nudgeVariants}
        initial={false}
        animate={controls}
        className="mt-3 flex items-center gap-2 rounded-md border bg-surface-raised px-3 py-2 shadow-note sm:pointer-events-none sm:absolute sm:-right-3 sm:-top-4 sm:z-30 sm:mt-0"
        style={{
          borderColor:
            "color-mix(in oklab, var(--color-warning) 45%, transparent)",
        }}
      >
        <NudgeContent />
      </motion.div>
    </div>
  );
}

/** The follow-up nudge content (shared by the desktop corner chip and the
 * mobile in-flow chip). */
function NudgeContent() {
  return (
    <>
      <WarningCircle
        size={16}
        weight="bold"
        aria-hidden="true"
        style={{ color: "var(--color-warning)" }}
      />
      <span className="text-body-sm leading-tight text-text-primary">
        <span className="font-medium">Marta</span>
        <span className="text-text-tertiary"> · 12 días sin contacto</span>{" "}
        {/* "→ Retomar" stays ink (text-primary, ~15:1 AA) rather than the warning
            amber (#b5832e = 3.35:1, fails AA for body). The warning color carries
            meaning only on the icon + border, which are non-text decoration. */}
        <span className="font-medium">→ Retomar</span>
      </span>
    </>
  );
}
