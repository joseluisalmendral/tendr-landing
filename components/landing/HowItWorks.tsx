"use client";

/**
 * HowItWorks ("Cómo funciona", spec §2): bespoke editorial numbered list.
 *
 * NOT a grid of three equal Feature cards with an icon on top (negative #6).
 * Instead: an ordered list with small editorial mono numbers (01 / 02 / 03)
 * and a DISTINCT faux-UI mini-illustration per step (the Cal trick), so the
 * movement teaches the flow instead of decorating it. A hand-drawn clay arrow
 * between steps guides the reading like a manual annotation, not an ornament.
 *
 * Client leaf (uses Motion hooks). It renders inside the server-side Section,
 * which owns the <h2> "Cómo funciona" heading, so we do NOT repeat it here.
 *
 * Motion (spec §2):
 * - Reveal of each step: Motion whileInView, once, stagger 60-100ms,
 *   --ease-out, --duration-reveal (opacity 0->1, y 24->0).
 * - Draw-in of the clay arrows: stroke-dashoffset / pathLength in-view once,
 *   --ease-out, ~600ms.
 * - prefers-reduced-motion: no transform/opacity animation; arrow renders in
 *   its final drawn (visible) state. pathLength is NOT a transform and may not
 *   degrade on its own, so we gate it explicitly with useReducedMotion().
 *
 * NOTE: this section is the DESTINATION of wow #1 (the sticky overlap
 * Hero -> Cómo funciona). That choreography is wired separately and is NOT
 * implemented here; this file only owns the reveal + arrow draw-in.
 */
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowRight,
  Check,
  DotsThreeVertical,
  FileText,
  Plus,
} from "@phosphor-icons/react/dist/ssr";

import type { ReactNode } from "react";

// --ease-out = cubic-bezier(0.22, 1, 0.36, 1); --duration-reveal = 480ms.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const DURATION_REVEAL = 0.48;
const DURATION_DRAW = 0.6;
const STAGGER = 0.08; // 80ms between a step's elements.

type Step = {
  n: string;
  title: string;
  body: string;
  illustration: ReactNode;
};

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  // Parent orchestrates the per-step stagger; children inherit the trigger.
  const stepVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduceMotion ? 0 : STAGGER },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : DURATION_REVEAL, ease: EASE_OUT },
    },
  };

  const steps: Step[] = [
    {
      n: "01",
      title: "Añade tus clientes",
      body: "Da de alta cada cliente con sus datos de contacto y etiquetas. En un minuto tienes tu cartera ordenada.",
      illustration: <AddClientFaux />,
    },
    {
      n: "02",
      title: "Gestiona tu pipeline",
      body: "Mueve cada caso entre los estados del tablero. El pipeline refleja al momento en qué punto está la relación.",
      illustration: <PipelineFaux />,
    },
    {
      n: "03",
      title: "Reporta el avance al cliente",
      body: "Genera un reporte claro de la relación con un clic y compártelo. El cliente ve el avance sin que reescribas nada.",
      illustration: <ReportFaux />,
    },
  ];

  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => {
        const reverse = index % 2 === 1;
        return (
          <li key={step.n} className="flex flex-col">
            <motion.div
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-8"
            >
              {/* Text column with the small editorial mono number. */}
              <motion.div
                variants={itemVariants}
                className={
                  reverse
                    ? "flex flex-col gap-3 md:order-2 md:col-span-6 md:pl-4"
                    : "flex flex-col gap-3 md:col-span-6"
                }
              >
                <span
                  aria-hidden="true"
                  className="text-meta font-mono uppercase text-accent-secondary"
                >
                  {step.n}
                </span>
                <h3 className="font-heading text-h3 text-text-primary">
                  {step.title}
                </h3>
                <p className="max-w-[46ch] text-body text-text-secondary">
                  {step.body}
                </p>
              </motion.div>

              {/* Faux-UI slot. Dimensions reserved (CLS 0). One idea per piece. */}
              <motion.div
                variants={itemVariants}
                className={reverse ? "md:order-1 md:col-span-6" : "md:col-span-6"}
              >
                {step.illustration}
              </motion.div>
            </motion.div>

            {/* Hand-drawn clay arrow between steps (not after the last). */}
            {index < steps.length - 1 ? (
              <HandDrawnArrow reverse={reverse} reduceMotion={!!reduceMotion} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------------- *
 * Faux-UI pieces. Each shows ONE moment of the CRM working, built from divs
 * and tokens only (zero hardcoded hex). A fixed min-height reserves space so
 * the reveal never shifts layout (CLS 0).
 * ------------------------------------------------------------------------- */

/** Shared shell: a small stylized CRM window, paper-raised with a hairline. */
function FauxShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-h-[15rem] w-full border border-border bg-surface-raised shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-meta font-mono uppercase text-text-muted">
          {label}
        </span>
        <span className="flex gap-1" aria-hidden="true">
          <span className="size-1.5 bg-border" />
          <span className="size-1.5 bg-border" />
          <span className="size-1.5 bg-border" />
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/** Step 1: adding a client. A form row being filled, with a primary action. */
function AddClientFaux() {
  return (
    <FauxShell label="Nuevo cliente">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-meta font-mono uppercase text-text-muted">
            Nombre
          </span>
          <div className="flex h-8 items-center border border-border bg-surface px-3 text-body-sm text-text-primary">
            Estudio Hibö
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-meta font-mono uppercase text-text-muted">
            Email
          </span>
          <div className="flex h-8 items-center border border-border bg-surface px-3 text-body-sm text-text-secondary">
            hola@hibo.studio
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="border border-accent-secondary bg-accent-secondary-soft px-2 py-0.5 text-meta font-mono uppercase text-accent-secondary">
            Diseño
          </span>
          <span className="border border-border px-2 py-0.5 text-meta font-mono uppercase text-text-muted">
            Retainer
          </span>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <span className="inline-flex items-center gap-1 border border-border-strong bg-accent-primary px-3 py-1.5 text-body-sm text-on-accent shadow-hard-sm">
            <Plus size={14} weight="bold" aria-hidden="true" />
            Guardar cliente
          </span>
        </div>
      </div>
    </FauxShell>
  );
}

/** Step 2: managing the pipeline. A card moved between two kanban columns. */
function PipelineFaux() {
  return (
    <FauxShell label="Pipeline">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-meta font-mono uppercase text-text-muted">
            Contactado
          </span>
          <div className="flex min-h-[6rem] flex-col gap-2 border border-dashed border-border p-2">
            <div className="flex items-center justify-between border border-border bg-surface px-2 py-1.5">
              <span className="text-body-sm text-text-secondary">Marea</span>
              <DotsThreeVertical
                size={14}
                className="text-text-muted"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-meta font-mono uppercase text-accent-secondary">
            Propuesta
          </span>
          <div className="flex min-h-[6rem] flex-col gap-2 border border-dashed border-accent-secondary p-2">
            {/* The card that just moved: highlighted, clay-bordered. */}
            <div className="flex items-center justify-between border border-accent-secondary bg-accent-secondary-soft px-2 py-1.5 shadow-hard-sm">
              <span className="text-body-sm text-text-primary">Cuaderno</span>
              <ArrowRight
                size={14}
                weight="bold"
                className="text-accent-secondary"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </FauxShell>
  );
}

/** Step 3: reporting progress. A report document being generated for a client. */
function ReportFaux() {
  return (
    <FauxShell label="Reporte de cliente">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 border border-border bg-surface p-3">
          <FileText
            size={28}
            className="shrink-0 text-accent-secondary"
            aria-hidden="true"
          />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-2.5 w-2/3 bg-text-muted/30" aria-hidden="true" />
            <div className="h-2 w-full bg-border" aria-hidden="true" />
            <div className="h-2 w-5/6 bg-border" aria-hidden="true" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 border border-success bg-success-soft px-2 py-1 text-meta font-mono uppercase text-success">
            <Check size={12} weight="bold" aria-hidden="true" />
            Generado
          </span>
          <span className="text-meta font-mono uppercase text-text-muted">
            Marzo · 8 acciones
          </span>
        </div>
      </div>
    </FauxShell>
  );
}

/* ------------------------------------------------------------------------- *
 * HandDrawn clay arrow connector. Drawn as a wobbly hand-made path (NOT a
 * geometric arrow), draws itself in-view once via pathLength. Under
 * reduced-motion it renders in its final static state (fully drawn, visible).
 * ------------------------------------------------------------------------- */
function HandDrawnArrow({
  reverse,
  reduceMotion,
}: {
  reverse: boolean;
  reduceMotion: boolean;
}) {
  // pathLength normalizes the path to 0..1, so dash values are length-agnostic.
  const draw = {
    hidden: { pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: reduceMotion ? 0 : DURATION_DRAW, ease: EASE_OUT },
        opacity: { duration: reduceMotion ? 0 : 0.12 },
      },
    },
  };

  return (
    <div
      aria-hidden="true"
      className="flex justify-center py-8 md:py-10"
    >
      <motion.svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        className={reverse ? "-scale-x-100 text-accent-secondary" : "text-accent-secondary"}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        {/* Wobbly hand-drawn descending curve. */}
        <motion.path
          d="M70 6 C 64 24, 56 30, 58 44 C 60 56, 50 60, 44 70"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={draw}
        />
        {/* Arrowhead, two short hand-drawn strokes. */}
        <motion.path
          d="M44 70 L 56 64 M44 70 L 48 57"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={draw}
        />
      </motion.svg>
    </div>
  );
}
