/**
 * feature-showcase-panels: the 4 RICH, STATIC product-grade demo panels for the
 * "#funciones → Un CRM con todo lo que necesitas" section (change
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
 *
 * VISUAL richness ≠ MOTION richness: this slice (Commit 1) is STATIC. Every panel
 * already renders its final, fully-legible state; the `active` prop is accepted
 * now so Commit 3 can layer the on-activation micro-demos without changing the
 * component contract. All numbers are mock (design-taste §4.9).
 *
 * Module-level, hoisted components (vercel rerender-no-inline-components,
 * rendering-hoist-jsx). No "use client": pure presentational, no hooks — mounted
 * by the FeatureShowcase client leaf. Token classes are the contract, the shell
 * primitives are re-implemented compactly here so journey-stages.tsx stays
 * untouched (design ADR-2).
 */
import type { ComponentType, ReactNode } from "react";
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
        "flex h-full w-full flex-col overflow-hidden rounded-card border bg-surface-raised transition-[opacity,box-shadow] duration-300 " +
        (active
          ? "border-border-strong opacity-100 shadow-hard"
          : "border-border opacity-100 shadow-soft")
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
      <div className="flex-1 overflow-hidden p-4">{children}</div>
    </div>
  );
}

/** Compact kanban mini-card: status dot + client name + amount + a kebab. The
 * `highlight` variant marks the protagonist case with a clay ring/surface. */
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
        "flex items-center gap-2 rounded-input border px-2 py-1.5 " +
        (highlight
          ? "border-accent-secondary bg-accent-secondary-soft shadow-hard-sm ring-1 ring-accent-secondary"
          : "border-border bg-surface")
      }
    >
      <span
        className={
          "size-2 shrink-0 rounded-full " +
          (highlight ? "bg-accent-secondary" : "bg-border-strong")
        }
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span
          className={
            "truncate text-body-sm " +
            (highlight ? "text-accent-secondary" : "text-text-primary")
          }
        >
          {name}
        </span>
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

type KanbanCard = { name: string; amount: string; highlight?: boolean };

/** One kanban column: title + count badge + stacked mini-cards in a dashed
 * dropzone (same look as the journey pipeline). */
function PipelineColumn({
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
        <span className="truncate font-mono text-meta uppercase text-text-muted">
          {title}
        </span>
        <span className="rounded-input bg-surface-sunken px-1.5 font-mono text-meta text-text-muted">
          {count}
        </span>
      </div>
      <div className="flex min-h-[9rem] flex-col gap-2 rounded-input border border-dashed border-border p-1.5">
        {cards.map((c) => (
          <MiniClientCard key={c.name} {...c} />
        ))}
      </div>
    </div>
  );
}

/** A small clay "IA" marker chip used to label AI-produced content. */
function AIChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-input border border-accent-secondary bg-accent-secondary-soft px-2 py-0.5 font-mono text-meta uppercase text-accent-secondary">
      <Sparkle size={12} weight="fill" aria-hidden="true" />
      IA
    </span>
  );
}

/* ------------------------------------------------------------------------- *
 * Panel 1 — Clientes y casos: a 3-column kanban (Contacto → Propuesta →
 * En curso). Faithful to the product pipeline (prospect → propuesta → en curso
 * → cerrado); the protagonist case "Estudio Hibö" sits highlighted in "En
 * curso". Static here; Commit 3 advances one card a column on activation.
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
  { name: "Estudio Hibö", amount: "€2.000", highlight: true }, // mock
];

export function ClientesPanel({ active }: { active: boolean }) {
  return (
    <PanelShell label="Clientes · Pipeline" active={active}>
      <div className="flex h-full flex-col gap-4">
        <p className="font-heading text-h3 text-text-primary">
          Cada cliente, en su sitio
        </p>
        <div className="grid grid-cols-3 gap-2">
          <PipelineColumn title="Contacto" count={2} cards={KANBAN_CONTACTO} />
          <PipelineColumn title="Propuesta" count={2} cards={KANBAN_PROPUESTA} />
          <PipelineColumn title="En curso" count={2} cards={KANBAN_EN_CURSO} />
        </div>
        <p className="mt-auto text-body-sm text-text-secondary">
          Arrastra el caso a su estado y sabes de un vistazo qué tienes abierto
          con cada cliente.
        </p>
      </div>
    </PanelShell>
  );
}

/* ------------------------------------------------------------------------- *
 * Panel 2 — Documentos con IA: a document card + an AI-extracted block. Sube un
 * documento por cliente y la IA saca los deals y los próximos pasos
 * (docs/product.md "AI extractor saca deals y next steps"). NO facturación.
 * Static here; Commit 3 plays the "Analizando…" → "Extraído" stagger.
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

export function DocumentosPanel({ active }: { active: boolean }) {
  return (
    <PanelShell label="Documentos · Estudio Hibö" active={active}>
      <div className="flex h-full flex-col gap-3">
        {/* The uploaded document. */}
        <div className="flex items-center gap-3 rounded-note border border-border-strong bg-surface px-3 py-2.5 shadow-hard-sm">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-input border border-border-strong bg-surface-sunken text-text-secondary"
            aria-hidden="true"
          >
            <FileText size={18} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate text-body-sm text-text-primary">
              propuesta_estudio-hibo.pdf
            </span>
            <span className="font-mono text-meta uppercase text-text-muted">
              PDF · 248 KB {/* mock */}
            </span>
          </span>
        </div>

        {/* AI-extracted block. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-note border border-border bg-surface px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-meta uppercase text-text-muted">
              Extraído del documento
            </span>
            <AIChip />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-meta uppercase text-text-muted">
              Deals detectados
            </span>
            {EXTRACTED_DEALS.map((deal) => (
              <div
                key={deal}
                className="flex items-center gap-2 rounded-input border border-border bg-surface-raised px-2 py-1.5"
              >
                <span
                  className="size-2 shrink-0 rounded-full bg-accent-secondary"
                  aria-hidden="true"
                />
                <span className="truncate text-body-sm text-text-primary">
                  {deal}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-meta uppercase text-text-muted">
              Próximos pasos
            </span>
            <ul className="flex flex-col gap-1.5">
              {EXTRACTED_NEXT_STEPS.map((step) => (
                <li key={step} className="flex items-center gap-2">
                  <CheckCircle
                    size={15}
                    className="shrink-0 text-text-muted"
                    aria-hidden="true"
                  />
                  <span className="truncate text-body-sm text-text-secondary">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

/* ------------------------------------------------------------------------- *
 * Panel 3 — Plantillas de email: a template with brand header + {{variables}}
 * and a preview filled from client data (docs/product.md "Plantillas con marca
 * propia, variables del cliente, preview"). Send affordance is "Copiar" /
 * mailto only — NO campañas, NO email marketing masivo.
 * Static here; Commit 3 crossfades {{variables}} → resolved values.
 * ------------------------------------------------------------------------- */

/** A highlighted template variable token like {{nombre}}. */
function VarChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-input border border-accent-secondary bg-accent-secondary-soft px-1.5 py-0.5 font-mono text-meta text-accent-secondary">
      {children}
    </span>
  );
}

export function PlantillasPanel({ active }: { active: boolean }) {
  return (
    <PanelShell label="Plantillas · Propuesta" active={active}>
      <div className="flex h-full flex-col gap-3">
        {/* Brand row = "Tu marca": sender identity / signature. */}
        <div className="flex items-center gap-2 rounded-input border border-border bg-surface px-3 py-2">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-input border border-border-strong bg-accent-primary font-mono text-meta uppercase text-on-accent"
            aria-hidden="true"
          >
            T
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-body-sm text-text-primary">
              Tu marca
            </span>
            <span className="font-mono text-meta uppercase text-text-muted">
              Remitente · firma propia
            </span>
          </span>
        </div>

        {/* Template body with variable chips. */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-note border border-border bg-surface px-3 py-2.5">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-meta uppercase text-text-muted">
              Asunto
            </span>
            <span className="flex flex-wrap items-baseline gap-1 text-body-sm text-text-primary">
              Propuesta para <VarChip>{"{{empresa}}"}</VarChip>
            </span>
          </div>
          <div className="flex flex-col gap-1 text-body-sm leading-relaxed text-text-secondary">
            <span className="flex flex-wrap items-baseline gap-1">
              Hola <VarChip>{"{{nombre}}"}</VarChip>, te paso la propuesta de
            </span>
            <span className="flex flex-wrap items-baseline gap-1">
              <VarChip>{"{{servicio}}"}</VarChip> que comentamos.
            </span>
          </div>
        </div>

        {/* Preview filled from client data + copy affordance (no campaigns). */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-meta uppercase text-text-muted">
            <EnvelopeSimple size={14} aria-hidden="true" />
            Vista previa: Estudio Hibö
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-control border border-border-strong bg-surface-raised px-3 py-1.5 text-body-sm text-text-primary shadow-hard-sm">
            <Copy size={14} weight="bold" aria-hidden="true" />
            Copiar
          </span>
        </div>
      </div>
    </PanelShell>
  );
}

/* ------------------------------------------------------------------------- *
 * Panel 4 — IA que te asiste: a "resumen de la relación" + a "próxima acción
 * sugerida" card + a trust chip "Tu API key, cifrada (AES-256-GCM)". Faithful
 * to docs/product.md (resume relación, sugiere próxima acción, adapta
 * plantillas; coste = BYO encrypted key). NO integraciones inventadas.
 * Static here; Commit 3 fades in the summary + suggestion on activation.
 * ------------------------------------------------------------------------- */
export function AsistentePanel({ active }: { active: boolean }) {
  return (
    <PanelShell label="Asistente · Estudio Hibö" active={active}>
      <div className="flex h-full flex-col gap-3">
        {/* Resumen de la relación. */}
        <div className="flex flex-col gap-2 rounded-note border border-border bg-surface px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-meta uppercase text-text-muted">
              Resumen de la relación
            </span>
            <AIChip />
          </div>
          <p className="text-body-sm leading-relaxed text-text-secondary">
            Cliente de diseño desde febrero. Propuesta de retainer enviada hace
            2 días, aún sin respuesta. Buen trato, paga puntual. {/* mock */}
          </p>
        </div>

        {/* Próxima acción sugerida. */}
        <div className="flex items-start gap-3 rounded-note border border-accent-secondary bg-accent-secondary-soft px-3 py-2.5 shadow-hard-sm">
          <span
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-input border border-accent-secondary bg-surface-raised text-accent-secondary"
            aria-hidden="true"
          >
            <MagicWand size={16} weight="fill" />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-mono text-meta uppercase text-accent-secondary">
              Próxima acción sugerida
            </span>
            <span className="text-body-sm text-text-primary">
              Escribe a Estudio Hibö para retomar la propuesta de retainer.
            </span>
          </span>
        </div>

        {/* Suggested template adaptation (faithful: adapta plantillas). */}
        <div className="flex items-center justify-between gap-2 rounded-input border border-border bg-surface px-3 py-2">
          <span className="inline-flex items-center gap-1.5 text-body-sm text-text-secondary">
            <ArrowRight size={14} weight="bold" className="text-accent-secondary" aria-hidden="true" />
            Adapta tu plantilla al tono del cliente
          </span>
        </div>

        {/* Trust chip: BYO encrypted API key (the AI cost model). */}
        <div className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-input border border-border bg-surface-sunken px-2 py-1">
          <LockKey size={14} weight="fill" className="text-success" aria-hidden="true" />
          <span className="font-mono text-meta uppercase text-text-secondary">
            Tu API key, cifrada · AES-256-GCM
          </span>
        </div>
      </div>
    </PanelShell>
  );
}

/* ------------------------------------------------------------------------- *
 * FEATURES data model: the 4 faithful features (español de España, sin voseo),
 * each paired with its panel component. The order is the accordion order; index
 * 0 is open/active on load (spec R3.4). Descriptions lead with the benefit
 * (product.md tone: directo, beneficio antes que feature).
 * ------------------------------------------------------------------------- */
export type Feature = {
  id: string;
  name: string;
  description: string;
  Panel: ComponentType<{ active: boolean }>;
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
