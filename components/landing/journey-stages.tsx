/**
 * journey-stages: the three RICH, STATIC product-grade backdrops for the
 * "Cómo funciona → el viaje de un cliente" section (change
 * como-funciona-client-journey, spec R3/R9/R10, design ADR-4/ADR-7 +
 * pivot addendum ADR-12).
 *
 * Each backdrop is a believable Tendr screen rendered with tokens only (ZERO
 * hex), Phosphor icons from /dist/ssr, and FIXED dimensions so the section never
 * reflows (CLS 0). They are STATIC and SELF-CONTAINED: each backdrop renders its
 * OWN representation of the SAME client ("Estudio Hibö") directly. There is no
 * traveling card and no shared layoutId anymore — the journey/continuity is
 * conveyed by the same client appearing across the 3 stages plus the 01/02/03
 * narrative. (Pivot: the single traveling-card FLIP was dropped after visual
 * verification — see design ADR-12.)
 *
 * VISUAL richness ≠ MOTION richness: these panels are dense and product-grade,
 * but they do not move. All numbers are mock (design-taste §4.9).
 *
 * Module-level, hoisted components (vercel rerender-no-inline-components,
 * rendering-hoist-jsx). No "use client": pure presentational, no hooks — usable
 * by the client-leaf HowItWorks parent.
 */
import type { ReactNode } from "react";
import {
  CaretDown,
  Check,
  DotsThreeVertical,
  Envelope,
  Phone,
  Plus,
  Storefront,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";

/** Static narrative copy for the three stages (alta → seguimiento → cobrado). */
export type JourneyStage = {
  n: string;
  title: string;
  body: string;
};

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    n: "01",
    title: "Das de alta al cliente",
    body: "Registras a Estudio Hibö con sus datos y etiquetas. En un minuto entra en tu cartera, listo para trabajar.",
  },
  {
    n: "02",
    title: "Sigues la relación",
    body: "Mueves el caso por el tablero y ves de un vistazo en qué punto está cada cliente, sin perder el hilo.",
  },
  {
    n: "03",
    title: "Cierras el caso",
    body: "Marcas el caso como cerrado y cobrado. El cliente queda al día y conservas el hilo de lo que trabajaste y lo que cobraste.",
  },
];

/* ------------------------------------------------------------------------- *
 * FauxShell: stylized product window. Window chrome label + 3 dots, paper
 * surface, hairline border. Fixed `min-h` reserves the box so the section never
 * reflows when the active backdrop brightens or the card mounts (CLS 0).
 * ------------------------------------------------------------------------- */
export function FauxShell({
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
        "flex min-h-[22rem] w-full flex-col overflow-hidden rounded-card border bg-surface-raised transition-[opacity,box-shadow] duration-300 " +
        (active
          ? "border-border-strong opacity-100 shadow-hard"
          : "border-border opacity-100 shadow-soft md:opacity-[0.55]")
      }
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-meta uppercase text-text-muted">
          {label}
        </span>
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
        </span>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * JourneyCardContent: the protagonist client card content ("Estudio Hibö").
 * Same identity rendered in every stage so the journey reads as one client
 * across three moments. Each backdrop embeds this card directly (no traveling
 * card, no layoutId). Pure markup, fixed sizing.
 * ------------------------------------------------------------------------- */
export function JourneyCardContent({
  status = "Activo",
  closed,
}: {
  /** Status pill label. Defaults to the in-progress "Activo" state used by
   * stages 1 & 2; stage 3 passes "Cobrado" (a closed/paid STATE in the pipeline
   * prospect → propuesta → en curso → cerrado — NOT an invoice). */
  status?: string;
  /** When true the pill uses the success token (the case reached the closed/
   * paid state) instead of the clay in-progress token. */
  closed?: boolean;
} = {}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-note border border-border-strong bg-surface px-3 py-2.5 shadow-hard-sm">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-input border border-border-strong bg-accent-secondary-soft font-mono text-body-sm uppercase text-accent-secondary"
        aria-hidden="true"
      >
        H
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body-sm text-text-primary">
          Estudio Hibö
        </span>
        <span className="font-mono text-meta uppercase text-text-muted">
          Diseño · €2.000 {/* mock */}
        </span>
      </span>
      <span
        className={
          "rounded-input border px-2 py-0.5 font-mono text-meta uppercase " +
          (closed
            ? "border-success bg-success-soft text-success"
            : "border-accent-secondary bg-accent-secondary-soft text-accent-secondary")
        }
      >
        {status}
      </span>
    </div>
  );
}

/* A read-only faux field row (label ABOVE input, design-taste §4.6). */
function FauxField({
  label,
  value,
  icon,
  muted,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-meta uppercase text-text-muted">
        {label}
      </span>
      <div className="flex h-9 items-center gap-2 rounded-input border border-border bg-surface px-3">
        {icon ? (
          <span className="shrink-0 text-text-muted" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span
          className={
            "truncate text-body-sm " +
            (muted ? "text-text-muted" : "text-text-primary")
          }
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * Stage 1 — StageFormFaux: client INTAKE FORM. Window "Nuevo cliente", labeled
 * fields incl. a faux SELECT (CaretDown), tag chips, helper line, primary CTA.
 * The POPULATED Estudio Hibö client card sits at the top as the just-committed
 * client row, so the form reads as "this client was just added" (no empty slot).
 * ------------------------------------------------------------------------- */
export function StageFormFaux({ active }: { active: boolean }) {
  return (
    <FauxShell label="Nuevo cliente" active={active}>
      <div className="flex flex-col gap-3">
        {/* Committed client row = the populated Estudio Hibö card. */}
        <JourneyCardContent />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FauxField label="Empresa" value="Estudio Hibö" />
          <FauxField
            label="Sector"
            value="Diseño de marca"
            icon={<Storefront size={15} aria-hidden="true" />}
          />
          <FauxField
            label="Email"
            value="hola@hibo.studio"
            icon={<Envelope size={15} aria-hidden="true" />}
          />
          <FauxField
            label="Teléfono"
            value="+34 627 41 80 92" /* mock */
            icon={<Phone size={15} aria-hidden="true" />}
          />
        </div>

        {/* Faux SELECT with chevron. */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-meta uppercase text-text-muted">
            Tipo de servicio
          </span>
          <div className="flex h-9 items-center justify-between rounded-input border border-border bg-surface px-3">
            <span className="truncate text-body-sm text-text-primary">
              Retainer mensual
            </span>
            <CaretDown
              size={15}
              className="shrink-0 text-text-muted"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Tag chips. */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-meta uppercase text-text-muted">
            Etiquetas
          </span>
          <span className="rounded-input border border-accent-secondary bg-accent-secondary-soft px-2 py-0.5 font-mono text-meta uppercase text-accent-secondary">
            Diseño
          </span>
          <span className="rounded-input border border-border px-2 py-0.5 font-mono text-meta uppercase text-text-muted">
            Retainer
          </span>
        </div>

        {/* Helper line + primary action. */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-meta text-text-muted">
            Se guardará en tu cartera
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-control border border-border-strong bg-accent-primary px-3 py-1.5 text-body-sm text-on-accent shadow-hard-sm">
            <Plus size={14} weight="bold" aria-hidden="true" />
            Guardar cliente
          </span>
        </div>
      </div>
    </FauxShell>
  );
}

/* ------------------------------------------------------------------------- *
 * Stage 2 — StagePipelineFaux: KANBAN + activity rail. 3 mini-columns each with
 * a count badge and >=2 stacked mini client cards; an activity rail with
 * timestamped events; an AI nudge alert chip (brand language). The traveling
 * SAME Estudio Hibö client sits as the highlighted card in the "En curso" column.
 * ------------------------------------------------------------------------- */

type MiniCard = { name: string; amount: string; tone: "ink" | "muted" };

function MiniClientCard({ name, amount, tone }: MiniCard) {
  return (
    <div className="flex items-center gap-2 rounded-input border border-border bg-surface px-2 py-1.5">
      <span
        className={
          "size-2 shrink-0 rounded-full " +
          (tone === "ink" ? "bg-accent-secondary" : "bg-border-strong")
        }
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-body-sm text-text-primary">{name}</span>
        <span className="font-mono text-meta uppercase text-text-muted">
          {amount}
        </span>
      </span>
      <DotsThreeVertical
        size={14}
        className="shrink-0 text-text-muted"
        aria-hidden="true"
      />
    </div>
  );
}

function PipelineColumn({
  title,
  count,
  cards,
  children,
}: {
  title: string;
  count: number;
  cards: MiniCard[];
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-meta uppercase text-text-muted">
          {title}
        </span>
        <span className="rounded-input bg-surface-sunken px-1.5 font-mono text-meta text-text-muted">
          {count}
        </span>
      </div>
      <div className="flex min-h-[10rem] flex-col gap-2 rounded-input border border-dashed border-border p-1.5">
        {cards.map((c) => (
          <MiniClientCard key={c.name} {...c} />
        ))}
        {children}
      </div>
    </div>
  );
}

function ActivityEvent({ text, when }: { text: string; when: string }) {
  return (
    <li className="relative pl-4">
      <span
        className="absolute left-0 top-1.5 size-1.5 rounded-full bg-accent-secondary"
        aria-hidden="true"
      />
      <span className="block text-body-sm leading-tight text-text-secondary">
        {text}
      </span>
      <span className="font-mono text-meta uppercase text-text-muted">
        {when}
      </span>
    </li>
  );
}

export function StagePipelineFaux({ active }: { active: boolean }) {
  return (
    <FauxShell label="Pipeline" active={active}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_13rem]">
          {/* Kanban: 3 columns. */}
          <div className="grid grid-cols-3 gap-2">
            <PipelineColumn
              title="Contacto"
              count={2}
              cards={[
                { name: "Marea", amount: "€900", tone: "muted" }, // mock
                { name: "Cuaderno", amount: "€600", tone: "muted" }, // mock
              ]}
            />
            <PipelineColumn
              title="Propuesta"
              count={2}
              cards={[
                { name: "Faro", amount: "€1.500", tone: "ink" }, // mock
                { name: "Norte", amount: "€2.400", tone: "muted" }, // mock
              ]}
            />
            <PipelineColumn
              title="En curso"
              count={2}
              cards={[{ name: "Roble", amount: "€1.100", tone: "muted" }]} // mock
            >
              {/* Same Estudio Hibö client, highlighted in the "En curso" column. */}
              <JourneyCardContent />
            </PipelineColumn>
          </div>

          {/* Activity rail. */}
          <div className="border-t border-border pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
            <span className="font-mono text-meta uppercase text-text-muted">
              Actividad
            </span>
            <ol className="mt-2 flex flex-col gap-2.5">
              <ActivityEvent text="Propuesta enviada" when="mar · hace 2 d" />
              <ActivityEvent text="Reunión de seguimiento" when="jue · hace 4 d" />
              <ActivityEvent text="Email respondido" when="vie · hace 5 d" />
            </ol>
          </div>
        </div>

        {/* AI nudge — same brand language as FeaturesBoard. */}
        <div className="inline-flex items-center gap-1.5 self-start rounded-input border border-warning bg-surface px-2 py-1">
          <WarningCircle
            size={14}
            weight="bold"
            className="text-warning"
            aria-hidden="true"
          />
          <span className="text-meta text-text-secondary">
            <span className="font-medium text-text-primary">Marea</span>: 18 días
            sin contacto {/* mock */}
          </span>
        </div>
      </div>
    </FauxShell>
  );
}

/* ------------------------------------------------------------------------- *
 * Stage 3 — StageCaseClosedFaux: a CASE-CLOSED ("cobrado") view, FAITHFUL to the
 * product model (docs/product.md): Tendr has clientes + casos/oportunidades with
 * a pipeline of states (prospect → propuesta → en curso → CERRADO) and markdown
 * notes per caso — and explicitly NO billing module ("No tiene módulo de
 * facturación"). So "cobrado" is a CASE that reached the closed/paid STATE, NOT
 * an invoice document.
 *
 * Composition (rich + truthful, NOT an invoice): a case header for the SAME
 * Estudio Hibö client (window "Caso · Estudio Hibö"), the client/case card reused
 * from JourneyCardContent with its status pill flipped to the "Cobrado" closed
 * STATE, a markdown-note / activity TIMELINE in the same language as the
 * seguimiento ACTIVIDAD rail (propuesta aceptada → entregado → cerrado · cobrado),
 * the deal value as a SINGLE figure (NOT a subtotal/IVA/total breakdown), and the
 * hand-drawn rotated "Cobrado" ink stamp (an on-brand STATE mark). No invoice
 * number, no IVA, no totals, no billing analytics.
 * ------------------------------------------------------------------------- */

type CaseEvent = { text: string; when: string; done?: boolean };

/* The case timeline reads like markdown notes + state changes, ending in the
 * closed/paid state. All mock. */
const CASE_TIMELINE: CaseEvent[] = [
  { text: "Propuesta aceptada", when: "feb · 12" }, // mock
  { text: "Proyecto entregado", when: "mar · 21" }, // mock
  { text: "Caso cerrado · cobrado", when: "mar · 28", done: true }, // mock
];

/* A single timeline entry. The closed/paid step gets a success dot to mark the
 * terminal state; the rest use the clay activity dot (same as the seguimiento
 * rail). Markdown-note / activity style, NOT a financial line item. */
function CaseTimelineEvent({ text, when, done }: CaseEvent) {
  return (
    <li className="relative pl-4">
      <span
        className={
          "absolute left-0 top-1.5 size-1.5 rounded-full " +
          (done ? "bg-success" : "bg-accent-secondary")
        }
        aria-hidden="true"
      />
      <span className="block text-body-sm leading-tight text-text-secondary">
        {text}
      </span>
      <span className="font-mono text-meta uppercase text-text-muted">
        {when}
      </span>
    </li>
  );
}

export function StageReportFaux({ active }: { active: boolean }) {
  return (
    <FauxShell label="Caso · Estudio Hibö" active={active}>
      <div className="flex flex-col gap-3">
        {/* Case header = the same Estudio Hibö client card, now with the closed/
            paid "Cobrado" STATE pill (a pipeline state, not "Activo"). */}
        <JourneyCardContent status="Cobrado" closed />

        {/* Case meta row: a single deal-value field (NOT a totals breakdown) +
            the closed state, kept as a faithful caso summary. */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-input border border-border bg-surface px-3 py-2">
            <span className="font-mono text-meta uppercase text-text-muted">
              Valor del caso
            </span>
            <span className="font-mono text-body-sm text-text-primary">
              €2.000 {/* mock */}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-input border border-border bg-surface px-3 py-2">
            <span className="font-mono text-meta uppercase text-text-muted">
              Estado
            </span>
            <span className="text-body-sm text-text-primary">
              Cerrado · cobrado
            </span>
          </div>
        </div>

        {/* Case timeline — markdown-note / activity style, same language as the
            seguimiento ACTIVIDAD rail. The journey of the caso through its states
            up to closed/paid. */}
        <div className="flex flex-col gap-2 rounded-input border border-border bg-surface px-3 py-2.5">
          <span className="font-mono text-meta uppercase text-text-muted">
            Historial del caso
          </span>
          <ol className="flex flex-col gap-2.5">
            {CASE_TIMELINE.map((e) => (
              <CaseTimelineEvent key={e.text} {...e} />
            ))}
          </ol>
        </div>

        {/* Hand-drawn "Cobrado" ink stamp, rotated — an on-brand STATE mark
            (the case is marked cobrado), NOT a payment receipt. */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-meta uppercase text-text-muted">
            Estudio Hibö · 28 mar {/* mock */}
          </span>
          <span className="inline-flex -rotate-6 items-center gap-1.5 rounded-input border-2 border-success bg-success-soft px-3 py-1 font-mono text-meta uppercase tracking-[0.18em] text-success shadow-hard-sm">
            <Check size={13} weight="bold" aria-hidden="true" />
            Cobrado
          </span>
        </div>
      </div>
    </FauxShell>
  );
}
