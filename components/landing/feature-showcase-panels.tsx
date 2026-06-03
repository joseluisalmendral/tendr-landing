/**
 * feature-showcase-panels: the 4 RICH, PROFESSIONAL, LOOPING product-flow demo
 * panels for the "#funciones → Un CRM con todo lo que necesitas" section (change
 * funciones-feature-showcase, spec R5/R9/R10, design ADR-1/ADR-2/ADR-5/ADR-7).
 *
 * Each panel is a believable Tendr screen rendered with tokens only (ZERO hex),
 * Phosphor icons from /dist/ssr, and a FauxShell-style frame with a FIXED min-h
 * so the right stage never reflows when the active feature switches (CLS 0).
 *
 * Faithfulness source: docs/product.md. Only REAL features are depicted —
 * NO facturación/billing, NO email marketing masivo, NO integraciones externas
 * (Salesforce/HubSpot/Slack/Notion), NO SSO, NO self-host, NO multi-idioma.
 * The AI cost model is the user's OWN encrypted BYO API key (AES-256-GCM).
 * Consistent mock data across panels: client "Estudio Hibö", contact "Lucía",
 * service "rediseño de marca".
 *
 * MOTION-GRAPHICS LAYER — the host accordion (FeatureShowcase) AUTO-ADVANCES
 * every 8s and NEVER pauses on hover/focus; only the active panel is mounted.
 * So each panel gets ~8s and is keyed by `active`: its narrative replays each
 * time the accordion lands on it (the 8s cadence IS the loop). Narratives resolve
 * to a calm RESTING state by ~3.5s, leaving breathing room before the advance.
 * The single TRUE continuous loop is Clientes: a case TRAVELS across the kanban
 * states and loops, demonstrating "mueves cada caso por sus estados".
 *
 * RULES: transform/opacity-only (GPU); the one non-transform allowed is SVG
 * pathLength (unused here). NEVER animate a Phosphor <svg> directly — animate its
 * wrapper. CLS 0: content that SWAPS between phases is absolute-stacked + crossfaded
 * or kept rendered with reserved space so nothing jumps. reduced-motion / SSR ⇒
 * every panel renders its FINAL resting state with NO loops/timers/keyframes.
 * No useMemo/useCallback (React Compiler). State changes only inside timer
 * callbacks (never a synchronous setState in an effect body). Every timer is
 * cleaned up so it stops when the panel unmounts / active flips false.
 *
 * Module-level, hoisted components + variants (vercel rerender-no-inline-components).
 * NO manual useMemo/useCallback (React Compiler).
 */
import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  ArrowRight,
  CheckCircle,
  Copy,
  DotsThreeVertical,
  EnvelopeSimple,
  FileText,
  LockKey,
  MagicWand,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

/* --- Motion timing tokens (mirror globals.css) + shared variants ---------- *
 * transform/opacity only (GPU). EASE_OUT for reveals, EASE_SNAP for settles/pops
 * (matches FeaturesBoard/HeroPipeline). All beats are SHORT and calm. */
const EASE_OUT = [0.2, 0.8, 0.2, 1] as const; // --easing-emphasis (v2 reveals)
const EASE_SNAP = [0.34, 1.56, 0.64, 1] as const; // --ease-snap (v2, settles/pops)
const EASE_INOUT = [0.4, 0, 0.2, 1] as const; // --easing-standard (v2 travel)

/** Panels share one shape: ({ active, reduceMotion }). */
type PanelProps = { active: boolean; reduceMotion: boolean };

/** Stagger container: children reveal in sequence once the panel is active.
 * `hidden`/`show` are toggled via the `animate` prop on the panel root. */
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Stagger item: opacity + small upward y settle (reveal). */
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: EASE_OUT },
  },
};

/* ------------------------------------------------------------------------- *
 * Shared shell + primitives (local re-implementation of the journey faux-UI
 * vocabulary — FauxShell window-chrome, mini client card, pipeline column).
 * Re-implemented here on purpose so journey-stages.tsx is not touched; the
 * token classes are the real contract, not the components (design ADR-2).
 * ------------------------------------------------------------------------- */

/** Stylized product window: chrome label + 3 dots, paper surface, hairline
 * border. `active` brightens the frame so it reads as the "live" feature. The
 * frame stretches to fill the reserved stage so all panels share one height. */
function PanelShell({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        "flex h-full w-full flex-col overflow-hidden rounded-lg border bg-surface-raised transition-[opacity,box-shadow] duration-300 " +
        (active
          ? "border-border-strong opacity-100 shadow-flat"
          : "border-border opacity-100 shadow-soft")
      }
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-mono text-meta uppercase text-text-tertiary">
          {label}
        </span>
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
        </span>
      </div>
      <div className="flex-1 overflow-hidden p-5">{children}</div>
    </div>
  );
}

/** Compact kanban mini-card: status dot + client name + amount + a kebab. The
 * `highlight` variant marks the protagonist case (it reached its pipeline home)
 * with the ochre "progreso" ring/surface (Folk Twins). */
function MiniClientCard({
  name,
  amount,
  highlight,
}: {
  name: string;
  amount: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center gap-2 rounded-sm border px-2 py-1.5 " +
        (highlight
          ? "border-support-ochre bg-support-ochre-soft shadow-flat ring-1 ring-support-ochre"
          : "border-border bg-surface")
      }
    >
      <span
        className={
          "size-2 shrink-0 rounded-full " +
          (highlight ? "bg-support-ochre" : "bg-border-strong")
        }
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span
          className={
            "truncate text-body-sm " +
            (highlight ? "text-support-ochre-fg" : "text-text-primary")
          }
        >
          {name}
        </span>
        <span className="font-mono text-meta uppercase text-text-tertiary">
          {amount}
        </span>
      </span>
      <DotsThreeVertical
        size={14}
        className="shrink-0 text-text-tertiary"
        aria-hidden="true"
      />
    </div>
  );
}

type KanbanCard = { name: string; amount: string; highlight?: boolean };

/* ------------------------------------------------------------------------- *
 * Panel 1 — Clientes y casos: a 3-column kanban (Contacto → Propuesta →
 * En curso). The CONTINUOUS motion-graphics moment: the protagonist case
 * "Estudio Hibö" TRAVELS Contacto → Propuesta → En curso and loops, via a shared
 * layoutId card that re-parents between dropzones (Motion animates its position).
 * The destination dropzone briefly reads as a drop target, the card settles, and
 * becomes the ochre "progreso" highlight variant once it reaches "En curso"
 * (its home). reduced-motion / SSR ⇒ the card sits HIGHLIGHTED in "En curso".
 * ------------------------------------------------------------------------- */
const KANBAN_CONTACTO: KanbanCard[] = [
  { name: "Marea", amount: "€900" }, // mock
  { name: "Cuaderno", amount: "€600" }, // mock
];
const KANBAN_PROPUESTA: KanbanCard[] = [
  { name: "Faro", amount: "€1.500" }, // mock
  { name: "Norte", amount: "€2.400" }, // mock
];
const KANBAN_EN_CURSO: KanbanCard[] = [
  { name: "Roble", amount: "€1.100" }, // mock
];

/** The three pipeline states the protagonist case travels through, in order. */
const PIPELINE_STEPS = [
  { title: "Contacto", base: KANBAN_CONTACTO },
  { title: "Propuesta", base: KANBAN_PROPUESTA },
  { title: "En curso", base: KANBAN_EN_CURSO },
] as const;

/** Per-step dwell. "En curso" (its home) holds a touch longer before looping. */
const STEP_DWELL_MS = [1800, 1800, 2200] as const;

/** The travelling protagonist card. Rendered inside the dropzone of the current
 * step with a shared layoutId so Motion animates its position as it re-parents.
 * A small arrival settle (y + scale, EASE_SNAP) plays via the `arrive` key. */
function TravellingCase({
  inProgress,
  arriveKey,
}: {
  inProgress: boolean;
  arriveKey: number;
}) {
  return (
    <motion.div layout layoutId="caso-hibo" transition={{ duration: 0.55, ease: EASE_INOUT }}>
      <motion.div
        key={arriveKey}
        initial={{ y: -6, scale: 0.97 }}
        animate={{ y: 0, scale: [0.97, 1.03, 1] }}
        transition={{ duration: 0.4, ease: EASE_SNAP }}
      >
        <MiniClientCard name="Estudio Hibö" amount="€2.000" highlight={inProgress} />
      </motion.div>
    </motion.div>
  );
}

/** One kanban column. When `isTarget` (the card just arrived here) the dropzone
 * briefly highlights as a drop target (border + ring via tokens), then relaxes.
 * Fixed min-height comfortably holds base cards + the visiting card so the column
 * never reflows as the travelling card enters/leaves (CLS 0 inside the panel). */
function PipelineColumn({
  title,
  count,
  cards,
  isTarget,
  visiting,
  inProgress,
  arriveKey,
}: {
  title: string;
  count: number;
  cards: KanbanCard[];
  isTarget: boolean;
  visiting: boolean;
  inProgress: boolean;
  arriveKey: number;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="truncate font-mono text-meta uppercase text-text-tertiary">
          {title}
        </span>
        <span className="rounded-sm bg-surface-sunken px-1.5 font-mono text-meta text-text-tertiary">
          {count}
        </span>
      </div>
      <div className="relative flex min-h-[10.5rem] flex-col gap-2 rounded-sm border border-dashed border-border p-1.5">
        {/* Drop-target cue: a token-colored accent ring overlay that fades in
            when the card lands here, then relaxes. Opacity-only (no animated
            color), so it stays GPU-friendly and token-pure. */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-sm border border-dashed border-support-ochre ring-1 ring-support-ochre"
          initial={false}
          animate={{ opacity: isTarget ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        />
        {cards.map((c) => (
          <MiniClientCard key={c.name} {...c} />
        ))}
        {visiting ? (
          <TravellingCase inProgress={inProgress} arriveKey={arriveKey} />
        ) : null}
      </div>
    </div>
  );
}

/** Static resting column (reduced-motion / SSR): no travel, no drop-target cue.
 * The protagonist sits highlighted in its "En curso" home. */
function RestPipelineColumn({
  title,
  count,
  cards,
}: {
  title: string;
  count: number;
  cards: KanbanCard[];
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="truncate font-mono text-meta uppercase text-text-tertiary">
          {title}
        </span>
        <span className="rounded-sm bg-surface-sunken px-1.5 font-mono text-meta text-text-tertiary">
          {count}
        </span>
      </div>
      <div className="flex min-h-[10.5rem] flex-col gap-2 rounded-sm border border-dashed border-border p-1.5">
        {cards.map((c) => (
          <MiniClientCard key={c.name} {...c} />
        ))}
      </div>
    </div>
  );
}

export function ClientesPanel({ active, reduceMotion }: PanelProps) {
  // Discrete travel step (0=Contacto, 1=Propuesta, 2=En curso). Advances on a
  // per-step timer and loops back to 0. `arriveKey` increments on each landing so
  // the arrival settle replays. State is set only inside the timeout callback
  // (never synchronously in the effect body) and the timer is cleaned up so the
  // loop stops the instant the panel unmounts / active flips false.
  const [step, setStep] = useState(0);
  const [arriveKey, setArriveKey] = useState(0);

  useEffect(() => {
    if (!active || reduceMotion) return;
    const id = setTimeout(() => {
      setStep((s) => (s + 1) % PIPELINE_STEPS.length);
      setArriveKey((k) => k + 1);
    }, STEP_DWELL_MS[step]);
    return () => clearTimeout(id);
  }, [active, reduceMotion, step]);

  const loop = active && !reduceMotion;

  return (
    <PanelShell label="Clientes · Pipeline" active={active}>
      <div className="flex h-full flex-col gap-5">
        <p className="font-heading text-h3 text-text-primary">
          Cada cliente, en su sitio
        </p>
        <div className="grid grid-cols-3 gap-3">
          {loop
            ? PIPELINE_STEPS.map((col, i) => (
                <PipelineColumn
                  key={col.title}
                  title={col.title}
                  count={col.base.length + (step === i ? 1 : 0)}
                  cards={col.base}
                  isTarget={step === i}
                  visiting={step === i}
                  inProgress={i === 2}
                  arriveKey={arriveKey}
                />
              ))
            : // Reduced-motion / SSR resting scene: protagonist highlighted in
              // "En curso", counts reflect its presence there.
              PIPELINE_STEPS.map((col, i) => (
                <RestPipelineColumn
                  key={col.title}
                  title={col.title}
                  count={col.base.length + (i === 2 ? 1 : 0)}
                  cards={
                    i === 2
                      ? [
                          ...col.base,
                          {
                            name: "Estudio Hibö",
                            amount: "€2.000",
                            highlight: true,
                          },
                        ]
                      : col.base
                  }
                />
              ))}
        </div>
        <p className="mt-auto text-body-sm text-text-secondary">
          Mueves cada caso por sus estados y sabes de un vistazo qué tienes
          abierto con cada cliente.
        </p>
      </div>
    </PanelShell>
  );
}

/* ------------------------------------------------------------------------- *
 * Panel 2 — Documentos con IA: upload doc → IA reads it → extracts deals +
 * next steps (docs/product.md "AI extractor saca deals y next steps"). NO
 * facturación. The narrative replays on each activation and resolves ~3.5s:
 *   A (0–0.9s): scan-line sweep over the doc + "Analizando documento…" with a
 *               looping indeterminate bar (scaleX, transform-only).
 *   B (~1s):    header crossfades "Analizando…" → "Extraído del documento" + AIChip pulse.
 *   C (1.2–2.8s): "Deals detectados" then "Próximos pasos" stagger in.
 *   D (~3s):    a muted mono summary line "2 deals · 3 próximos pasos" fades in.
 * reduced-motion / SSR ⇒ full extracted state, static. Header height is reserved
 * (absolute-stacked crossfade) so the label swap never shifts content.
 * ------------------------------------------------------------------------- */
const EXTRACTED_DEALS: string[] = [
  "Rediseño de marca · €2.000", // mock
  "Diseño de papelería · €600", // mock
];
const EXTRACTED_NEXT_STEPS: string[] = [
  "Enviar contrato firmado", // mock
  "Agendar kickoff esta semana", // mock
  "Pedir manual de marca actual", // mock
];

type DocPhase = "analyzing" | "extracted";

/** AI marker chip. `pulse` plays one subtle scale/opacity beat ("the AI just
 * produced this"). Animate the wrapper, never the Phosphor svg. */
function AIChip({ pulse, reduceMotion }: { pulse?: boolean; reduceMotion?: boolean }) {
  const className =
    "inline-flex items-center gap-1 rounded-sm border border-support-cobalt bg-support-cobalt-soft px-2 py-0.5 font-mono text-meta uppercase text-support-cobalt-fg";
  if (pulse && !reduceMotion) {
    return (
      <motion.span
        className={className}
        initial={{ scale: 0.9, opacity: 0.6 }}
        animate={{ scale: [0.9, 1.08, 1], opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE_SNAP }}
      >
        <Sparkle size={12} weight="fill" aria-hidden="true" />
        IA
      </motion.span>
    );
  }
  return (
    <span className={className}>
      <Sparkle size={12} weight="fill" aria-hidden="true" />
      IA
    </span>
  );
}

/** Thin indeterminate "working" bar: a clipped track with an accent segment that
 * loops left→right via scaleX + x (transform-only). Used during the analyzing
 * phase. Reserved 0.5rem track height — no reflow when it disappears. */
function WorkingBar() {
  return (
    <span
      className="relative block h-0.5 w-full overflow-hidden rounded-full bg-surface-sunken"
      aria-hidden="true"
    >
      <motion.span
        className="absolute inset-y-0 left-0 w-1/3 origin-left rounded-full bg-support-cobalt"
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 1.1, ease: EASE_INOUT, repeat: Infinity }}
      />
    </span>
  );
}

export function DocumentosPanel({ active, reduceMotion }: PanelProps) {
  // Phase machine. Starts "analyzing" on activation, flips to "extracted" once.
  // reduced-motion ⇒ pinned to "extracted" with no timers. State changes only in
  // the timeout callback; the timer is cleared on unmount / active flip.
  const [phase, setPhase] = useState<DocPhase>(reduceMotion ? "extracted" : "analyzing");

  useEffect(() => {
    if (!active || reduceMotion) return;
    const startId = setTimeout(() => setPhase("analyzing"), 0);
    const extractId = setTimeout(() => setPhase("extracted"), 950);
    return () => {
      clearTimeout(startId);
      clearTimeout(extractId);
    };
  }, [active, reduceMotion]);

  const extracted = phase === "extracted" || reduceMotion;
  const showItems = active && extracted;

  return (
    <PanelShell label="Documentos · Estudio Hibö" active={active}>
      <div className="flex h-full flex-col gap-4">
        {/* The uploaded document. A thin accent scan line sweeps top→bottom on
            activation ("la IA lo lee"). Overlay is absolute inside the relative,
            clipped card; reduced motion ⇒ not rendered, resting card unchanged. */}
        <div className="relative flex items-center gap-3 overflow-hidden rounded-md border border-border-strong bg-surface px-3 py-3 shadow-flat">
          {active && !reduceMotion ? (
            <motion.span
              key={`scan-${active}`}
              className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-support-cobalt opacity-40"
              aria-hidden="true"
              initial={{ y: 0 }}
              animate={{ y: [0, 60] }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            />
          ) : null}
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border-strong bg-surface-sunken text-text-secondary"
            aria-hidden="true"
          >
            <FileText size={18} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-body-sm text-text-primary">
              propuesta_estudio-hibo.pdf
            </span>
            <span className="font-mono text-meta uppercase text-text-tertiary">
              PDF · 248 KB {/* mock */}
            </span>
          </span>
        </div>

        {/* AI-extracted block. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-md border border-border bg-surface px-3 py-3">
          {/* Header row. The label SWAPS "Analizando…" → "Extraído"; both are
              absolute-stacked + crossfaded inside a fixed-height slot so nothing
              shifts (CLS 0). The AIChip pulses once extraction lands. */}
          <div className="flex items-center justify-between gap-2">
            <span className="relative block h-4 min-w-0 flex-1">
              {/* SEQUENTIAL swap (mode="wait"): the exiting label fades fully out
                  before the entering one fades in, so the two DIFFERENT texts are
                  never simultaneously legible on top of each other. Absolute-stacked
                  in a fixed-height (h-4) slot ⇒ zero layout shift (CLS 0). */}
              <AnimatePresence initial={false} mode="wait">
                {!extracted ? (
                  <motion.span
                    key="analyzing"
                    className="absolute inset-0 flex items-center font-mono text-meta uppercase text-text-tertiary"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                  >
                    Analizando documento…
                  </motion.span>
                ) : (
                  <motion.span
                    key="extracted"
                    className="absolute inset-0 flex items-center font-mono text-meta uppercase text-text-tertiary"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                  >
                    Extraído del documento
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <AIChip pulse={active && extracted} reduceMotion={reduceMotion} />
          </div>

          {/* Working bar (analyzing only). Reserve its 0.5rem track height with a
              crossfade so the body below does not jump when it vanishes. */}
          <span className="relative block h-0.5 w-full">
            <AnimatePresence initial={false}>
              {!extracted && !reduceMotion ? (
                <motion.span
                  key="working"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                  <WorkingBar />
                </motion.span>
              ) : null}
            </AnimatePresence>
          </span>

          {/* Extracted content. Kept rendered with reserved space; opacity-staggers
              in once extracted so the layout never shifts (CLS 0). */}
          <motion.div
            className="flex min-h-0 flex-1 flex-col gap-3"
            variants={staggerContainer}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? "show" : showItems ? "show" : "hidden"}
          >
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-meta uppercase text-text-tertiary">
                Deals detectados
              </span>
              {EXTRACTED_DEALS.map((deal) => (
                <motion.div
                  key={deal}
                  variants={staggerItem}
                  className="flex items-center gap-2 rounded-sm border border-border bg-surface-raised px-2 py-1.5"
                >
                  <span
                    className="size-2 shrink-0 rounded-full bg-support-ochre"
                    aria-hidden="true"
                  />
                  <span className="truncate text-body-sm text-text-primary">
                    {deal}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-meta uppercase text-text-tertiary">
                Próximos pasos
              </span>
              <ul className="flex flex-col gap-1.5">
                {EXTRACTED_NEXT_STEPS.map((stepText) => (
                  <motion.li
                    key={stepText}
                    variants={staggerItem}
                    className="flex items-center gap-2"
                  >
                    <motion.span
                      className="flex shrink-0 text-success"
                      variants={staggerItem}
                      aria-hidden="true"
                    >
                      <CheckCircle size={15} weight="fill" />
                    </motion.span>
                    <span className="truncate text-body-sm text-text-secondary">
                      {stepText}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Phase D — faithful summary line. Reserved at the bottom; fades in
                after the items. Mono + muted so it reads as a quiet recap. */}
            <span className="relative mt-auto block h-4">
              <motion.span
                className="absolute inset-0 flex items-center font-mono text-meta uppercase text-text-tertiary"
                variants={staggerItem}
              >
                2 deals · 3 próximos pasos {/* mock */}
              </motion.span>
            </span>
          </motion.div>
        </div>
      </div>
    </PanelShell>
  );
}

/* ------------------------------------------------------------------------- *
 * Panel 3 — Plantillas de email: write a template with {{variables}} → Tendr
 * RESOLVES them from client data → the on-brand email assembles
 * (docs/product.md "Plantillas con marca propia, variables del cliente, preview").
 * Send affordance is "Copiar" / mailto only — NO campañas, NO email marketing.
 * Narrative on each activation:
 *   A (0–1.6s): TEMPLATE view with {{empresa}}/{{nombre}}/{{servicio}} chips.
 *   B (1.6–2.6s): each chip RESOLVES token→value with a staggered flip
 *                 ({{empresa}}→"Estudio Hibö", {{nombre}}→"Lucía",
 *                 {{servicio}}→"rediseño de marca") + restyles to "real data".
 *   C (2.8–3.2s): crossfade TEMPLATE → rendered EMAIL; toggle flips to preview.
 * Rest on the email. The ViewToggle stays clickable (manual override → template).
 * reduced-motion / SSR ⇒ TEMPLATE view static (chips, not resolved); toggle still
 * reaches the preview. No resolution beat, no auto-switch.
 * ------------------------------------------------------------------------- */

/** A template variable that RESOLVES from its {{token}} to the real value. The
 * resolution is a quick rotateX/opacity crossfade in place (motion-graphics flip)
 * and a restyle from accent-outline (editable token) to a calmer "real data"
 * look. Both states are absolute-stacked in a fixed slot so nothing rewraps. */
function ResolvingVar({
  token,
  value,
  resolved,
  reduceMotion,
}: {
  token: string;
  value: string;
  resolved: boolean;
  reduceMotion: boolean;
}) {
  const tokenCls =
    "rounded-sm border border-support-cobalt bg-support-cobalt-soft px-1.5 py-0.5 font-mono text-meta text-support-cobalt-fg";
  const valueCls =
    "rounded-sm border border-border bg-surface-sunken px-1.5 py-0.5 text-body-sm text-text-primary";

  if (reduceMotion) {
    // Resting source state under reduced motion: the editable token.
    return <span className={tokenCls}>{token}</span>;
  }

  return (
    <span className="relative inline-flex" style={{ perspective: 400 }}>
      {/* Invisible spacer = the wider of the two, so the inline slot never
          changes width as token↔value crossfade (minimizes rewrap). */}
      <span className={valueCls + " invisible whitespace-nowrap"} aria-hidden="true">
        {value}
      </span>
      <motion.span
        className={"absolute inset-0 flex items-center justify-center whitespace-nowrap " + tokenCls}
        animate={{ opacity: resolved ? 0 : 1, rotateX: resolved ? 90 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        {token}
      </motion.span>
      <motion.span
        className={"absolute inset-0 flex items-center justify-center whitespace-nowrap " + valueCls}
        animate={{ opacity: resolved ? 1 : 0, rotateX: resolved ? 0 : -90 }}
        transition={{ duration: 0.35, ease: EASE_SNAP }}
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        {value}
      </motion.span>
    </span>
  );
}

/** The two views the Plantillas panel alternates between. */
type PlantillasView = "template" | "preview";

/** Crossfade between the two stacked views: a calm opacity dissolve. */
const viewCrossfade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};

/** Segmented toggle: two real buttons acting as a radiogroup. */
function ViewToggle({
  view,
  onSelect,
}: {
  view: PlantillasView;
  onSelect: (next: PlantillasView) => void;
}) {
  const base =
    "flex-1 rounded-sm px-2.5 py-1 font-mono text-meta uppercase transition-colors";
  const activeCls = "bg-accent-primary text-accent-fg shadow-flat";
  const idleCls = "text-text-tertiary hover:text-text-secondary";
  return (
    <div
      role="radiogroup"
      aria-label="Vista de la plantilla"
      className="flex items-center gap-1 rounded-sm border border-border bg-surface-sunken p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={view === "template"}
        onClick={() => onSelect("template")}
        className={base + " " + (view === "template" ? activeCls : idleCls)}
      >
        Plantilla
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={view === "preview"}
        onClick={() => onSelect("preview")}
        className={base + " " + (view === "preview" ? activeCls : idleCls)}
      >
        Vista previa
      </button>
    </div>
  );
}

/** View A — the editable template source: brand row + body with the
 * {{empresa}}/{{nombre}}/{{servicio}} variables that RESOLVE on `resolved`. */
function TemplateView({
  resolved,
  reduceMotion,
}: {
  resolved: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Brand row = "Tu marca": sender identity / signature. */}
      <div className="flex items-center gap-2 rounded-sm border border-border bg-surface px-3 py-2">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-border-strong bg-accent-primary font-mono text-meta uppercase text-accent-fg"
          aria-hidden="true"
        >
          T
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-body-sm text-text-primary">
            Tu marca
          </span>
          <span className="font-mono text-meta uppercase text-text-tertiary">
            Remitente · firma propia
          </span>
        </span>
      </div>

      {/* Template body with variable chips that resolve to client data. */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-md border border-border bg-surface px-3 py-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-meta uppercase text-text-tertiary">
            Asunto
          </span>
          <span className="flex flex-wrap items-center gap-1 text-body-sm text-text-primary">
            Propuesta para{" "}
            <ResolvingVar
              token="{{empresa}}"
              value="Estudio Hibö"
              resolved={resolved}
              reduceMotion={reduceMotion}
            />
          </span>
        </div>
        <div className="flex flex-col gap-1.5 text-body-sm leading-relaxed text-text-secondary">
          <span className="flex flex-wrap items-center gap-1">
            Hola{" "}
            <ResolvingVar
              token="{{nombre}}"
              value="Lucía"
              resolved={resolved}
              reduceMotion={reduceMotion}
            />
            , te paso la propuesta de
          </span>
          <span className="flex flex-wrap items-center gap-1">
            <ResolvingVar
              token="{{servicio}}"
              value="rediseño de marca"
              resolved={resolved}
              reduceMotion={reduceMotion}
            />{" "}
            que comentamos.
          </span>
        </div>
      </div>

      {/* Copy affordance (no campaigns, no mass email). */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-mono text-meta uppercase text-text-tertiary">
          <EnvelopeSimple size={14} aria-hidden="true" />
          Plantilla con tus variables
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface-raised px-3 py-1.5 text-body-sm text-text-primary shadow-flat">
          <Copy size={14} weight="bold" aria-hidden="true" />
          Copiar
        </span>
      </div>
    </div>
  );
}

/** View B — the rendered EMAIL the client actually receives, with REAL resolved
 * values (no {{}}). Branded header band + subject + greeting + body + CTA + sign. */
function PreviewView() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border bg-surface">
        {/* Branded header band: monogram + sender + recipient meta. */}
        <div className="flex items-center gap-2 bg-surface-sunken px-3 py-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-primary font-mono text-meta uppercase text-accent-fg"
            aria-hidden="true"
          >
            T
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-body-sm text-text-primary">
              Tu marca
            </span>
            <span className="font-mono text-meta uppercase text-text-tertiary">
              para Estudio Hibö
            </span>
          </span>
        </div>

        <div className="h-px w-full bg-border" aria-hidden="true" />

        {/* Email body. */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 py-3">
          <p className="font-heading text-body-sm font-semibold text-text-primary">
            Propuesta de rediseño de marca
          </p>
          <p className="text-body-sm text-text-secondary">Hola, Lucía:</p>
          <p className="text-body-sm leading-relaxed text-text-secondary">
            Te paso la propuesta que comentamos para el rediseño de marca de
            Estudio Hibö.
          </p>
          <p className="text-body-sm leading-relaxed text-text-secondary">
            Dentro tienes el alcance, los plazos y el presupuesto.
          </p>
          <span
            className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md bg-accent-primary px-3 py-1.5 text-body-sm text-accent-fg shadow-flat"
            aria-hidden="true"
          >
            Ver propuesta
          </span>
          <p className="mt-auto text-meta text-text-tertiary">
            Un saludo, — Tu marca
          </p>
        </div>
      </div>
    </div>
  );
}

type PlantillasPhase = "template" | "resolving" | "preview";

export function PlantillasPanel({ active, reduceMotion }: PanelProps) {
  // `view` is what the toggle shows (also user-overridable). `phase` drives the
  // auto-narrative: template → resolving (chips resolve) → preview. On manual
  // toggle we hand control to the user (phase parked). reduced-motion ⇒ template,
  // unresolved. All setState is in timeout callbacks; timers cleared on unmount.
  const [view, setView] = useState<PlantillasView>("template");
  const [phase, setPhase] = useState<PlantillasPhase>("template");

  useEffect(() => {
    if (!active || reduceMotion) return;
    const reset = setTimeout(() => {
      setView("template");
      setPhase("template");
    }, 0);
    const resolveId = setTimeout(() => setPhase("resolving"), 1600);
    const previewId = setTimeout(() => {
      setPhase("preview");
      setView("preview");
    }, 2900);
    return () => {
      clearTimeout(reset);
      clearTimeout(resolveId);
      clearTimeout(previewId);
    };
  }, [active, reduceMotion]);

  // Variables show as resolved during the resolving beat and once we move on.
  const resolved = phase === "resolving" || phase === "preview";

  // Manual override: clicking the toggle takes control. Selecting "template"
  // returns to the editable (unresolved) source; "preview" jumps to the email.
  const handleSelect = (next: PlantillasView) => {
    setView(next);
    setPhase(next === "preview" ? "preview" : "template");
  };

  return (
    <PanelShell label="Plantillas · Email" active={active}>
      <div className="flex h-full flex-col gap-4">
        <ViewToggle view={view} onSelect={handleSelect} />

        {/* Both views are absolute-stacked in this flex-1 body so toggling never
            reflows the stage (CLS 0). AnimatePresence (sync mode) overlaps the
            crossfade so the stage is never empty. Reduced motion ⇒ instant. */}
        <div className="relative min-h-0 flex-1">
          <AnimatePresence initial={false}>
            <motion.div
              key={view}
              className="absolute inset-0"
              variants={reduceMotion ? undefined : viewCrossfade}
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? undefined : "show"}
              exit={reduceMotion ? undefined : "exit"}
            >
              {view === "template" ? (
                <TemplateView resolved={resolved} reduceMotion={reduceMotion} />
              ) : (
                <PreviewView />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PanelShell>
  );
}

/* ------------------------------------------------------------------------- *
 * Panel 4 — IA que te asiste: the IA analyzes the relationship and produces a
 * summary + a suggested next action + a template-tone tip + the BYO-key trust
 * chip. Faithful to docs/product.md (resume relación, sugiere próxima acción,
 * adapta plantillas; coste = BYO encrypted key). Narrative on each activation:
 *   A (0–1s):  "Analizando relación…" working state — AIChip shimmer, cards faint.
 *   B (1–2.2s): "Resumen de la relación" reveals with a WRITTEN-IN word stagger.
 *   C (2.2–3s): "Próxima acción sugerida" reveals + MagicWand wrapper pulse.
 *   D (3–3.6s): template-tone row + trust chip fade in. Rest.
 * reduced-motion / SSR ⇒ full final state, static. Final layout reserved from the
 * start (cards always rendered, only opacity/transform animate) so no shift.
 * ------------------------------------------------------------------------- */
const SUMMARY_WORDS =
  "Cliente de diseño desde febrero. Propuesta de retainer enviada hace 2 días, aún sin respuesta. Buen trato, paga puntual.".split(
    " ",
  ); // mock

type AsistentePhase = "thinking" | "summary" | "action" | "done";

/** Word-by-word "written-in" reveal for the relationship summary (opacity stagger
 * across word spans, NOT a width animation). Reserved by always rendering the
 * words; only opacity animates so the paragraph box never reflows. */
const wordStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};
const wordItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18, ease: EASE_OUT } },
};

export function AsistentePanel({ active, reduceMotion }: PanelProps) {
  // Phase machine: thinking → summary → action → done. reduced-motion ⇒ "done".
  // All transitions in timeout callbacks; cleared on unmount / active flip.
  const [phase, setPhase] = useState<AsistentePhase>(
    reduceMotion ? "done" : "thinking",
  );

  useEffect(() => {
    if (!active || reduceMotion) return;
    const t0 = setTimeout(() => setPhase("thinking"), 0);
    const t1 = setTimeout(() => setPhase("summary"), 1000);
    const t2 = setTimeout(() => setPhase("action"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 3000);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active, reduceMotion]);

  const thinking = phase === "thinking" && !reduceMotion;
  const showSummary = reduceMotion || phase === "summary" || phase === "action" || phase === "done";
  const showAction = reduceMotion || phase === "action" || phase === "done";
  const showRest = reduceMotion || phase === "done";

  return (
    <PanelShell label="Asistente · Estudio Hibö" active={active}>
      <div className="flex h-full flex-col gap-4">
        {/* Resumen de la relación. The card is always present (reserved); during
            "thinking" it reads faint with a working label, then the summary
            writes in word-by-word and the AIChip settles. */}
        <motion.div
          className="flex flex-col gap-2 rounded-md border border-border bg-surface px-3 py-3"
          initial={reduceMotion ? false : { opacity: 0.55 }}
          animate={{ opacity: thinking ? 0.55 : 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="relative block h-4 min-w-0 flex-1">
              {/* SEQUENTIAL swap (mode="wait"): the exiting label fades fully to
                  opacity 0 BEFORE the entering one fades in, so the two DIFFERENT
                  texts are NEVER simultaneously legible on top of each other.
                  Both stay absolute-stacked in this fixed-height (h-4) slot so the
                  swap costs zero layout shift (CLS 0). */}
              <AnimatePresence initial={false} mode="wait">
                {thinking ? (
                  <motion.span
                    key="thinking"
                    className="absolute inset-0 flex items-center font-mono text-meta uppercase text-text-tertiary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    exit={{ opacity: 0 }}
                    transition={
                      thinking
                        ? { duration: 1.2, ease: EASE_INOUT, repeat: Infinity }
                        : { duration: 0.2, ease: EASE_OUT }
                    }
                  >
                    Analizando relación…
                  </motion.span>
                ) : (
                  <motion.span
                    key="summary-label"
                    className="absolute inset-0 flex items-center font-mono text-meta uppercase text-text-tertiary"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                  >
                    Resumen de la relación
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <AIChip pulse={active && !thinking} reduceMotion={reduceMotion} />
          </div>
          <motion.p
            className="text-body-sm leading-relaxed text-text-secondary"
            variants={reduceMotion ? undefined : wordStagger}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : showSummary ? "show" : "hidden"}
          >
            {SUMMARY_WORDS.map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                variants={reduceMotion ? undefined : wordItem}
              >
                {w}
                {i < SUMMARY_WORDS.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

        {/* Próxima acción sugerida. Always reserved; reveals (opacity + small y)
            with a MagicWand wrapper pulse once the action phase lands. */}
        <motion.div
          className="flex items-start gap-3 rounded-md border border-support-cobalt bg-support-cobalt-soft px-3 py-3 shadow-flat"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{
            opacity: showAction ? 1 : reduceMotion ? 1 : 0,
            y: showAction ? 0 : 8,
          }}
          transition={{ duration: 0.34, ease: EASE_OUT }}
        >
          {showAction && !reduceMotion ? (
            <motion.span
              key={`wand-${phase}`}
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm border border-support-cobalt bg-surface-raised text-support-cobalt"
              aria-hidden="true"
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.12, 1] }}
              transition={{ duration: 0.45, ease: EASE_SNAP }}
            >
              <MagicWand size={16} weight="fill" />
            </motion.span>
          ) : (
            <span
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm border border-support-cobalt bg-surface-raised text-support-cobalt"
              aria-hidden="true"
            >
              <MagicWand size={16} weight="fill" />
            </span>
          )}
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-mono text-meta uppercase text-support-cobalt-fg">
              Próxima acción sugerida
            </span>
            <span className="text-body-sm text-text-primary">
              Escribe a Estudio Hibö para retomar la propuesta de retainer.
            </span>
          </span>
        </motion.div>

        {/* Template-tone tip (faithful: adapta plantillas). Reserved; fades in last. */}
        <motion.div
          className="flex items-center justify-between gap-2 rounded-sm border border-border bg-surface px-3 py-2"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: showRest ? 1 : reduceMotion ? 1 : 0, y: showRest ? 0 : 8 }}
          transition={{ duration: 0.34, ease: EASE_OUT }}
        >
          <span className="inline-flex items-center gap-1.5 text-body-sm text-text-secondary">
            <ArrowRight
              size={14}
              weight="bold"
              className="text-support-cobalt"
              aria-hidden="true"
            />
            Adapta tu plantilla al tono del cliente
          </span>
        </motion.div>

        {/* Trust chip: BYO encrypted API key (the AI cost model). Fades in last. */}
        <motion.div
          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-sm border border-border bg-surface-sunken px-2 py-1"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: showRest ? 1 : reduceMotion ? 1 : 0, y: showRest ? 0 : 8 }}
          transition={{ duration: 0.34, ease: EASE_OUT, delay: showRest ? 0.1 : 0 }}
        >
          <LockKey
            size={14}
            weight="fill"
            className="text-success"
            aria-hidden="true"
          />
          <span className="font-mono text-meta uppercase text-text-secondary">
            Tu API key, cifrada · AES-256-GCM
          </span>
        </motion.div>
      </div>
    </PanelShell>
  );
}

/* ------------------------------------------------------------------------- *
 * FEATURES data model: the 4 faithful features (español de España, sin voseo),
 * each paired with its panel component. The order is the accordion order; index
 * 0 is open/active on load (spec R3.4). Descriptions lead with the benefit.
 * ------------------------------------------------------------------------- */
export type Feature = {
  id: string;
  name: string;
  description: string;
  Panel: ComponentType<PanelProps>;
};

export const FEATURES: Feature[] = [
  {
    id: "clientes",
    name: "Clientes y casos",
    description:
      "Tienes todos tus clientes y sus casos en un tablero. Mueves cada caso por sus estados —contacto, propuesta, en curso, cerrado— y ves de un vistazo qué tienes abierto con cada uno.",
    Panel: ClientesPanel,
  },
  {
    id: "documentos",
    name: "Documentos con IA",
    description:
      "Subes un documento al cliente y la IA lo lee por ti: extrae los deals y los próximos pasos para que no se te escape nada de cada propuesta.",
    Panel: DocumentosPanel,
  },
  {
    id: "plantillas",
    name: "Plantillas de email",
    description:
      "Escribes la plantilla una vez con tu marca y tus variables, y Tendr la rellena con los datos del cliente. La copias o la envías por correo, sin reescribir cada email desde cero.",
    Panel: PlantillasPanel,
  },
  {
    id: "asistente",
    name: "IA que te asiste",
    description:
      "La IA resume tu relación con cada cliente, te sugiere la próxima acción y adapta tus plantillas a su contexto. Usas tu propia clave de API, cifrada, así que controlas el coste.",
    Panel: AsistentePanel,
  },
];
