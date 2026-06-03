"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
import { HeroPipeline } from "@/components/landing/HeroPipeline";
import { cn } from "@/lib/utils";
import type { HeroProps } from "@/components/landing/types";

/**
 * Hero: the page's single above-the-fold value proposition.
 *
 * Bespoke layout (spec section 1): asymmetric, text column left and the faux-UI
 * of the empty pipeline right. Nothing is centered. Contains the page's ONLY
 * <h1>.
 *
 * Client Component (F5): hosts two motion gaps from design-spec-visual.md
 * section 1:
 *
 *  1. on-load choreographed reveal of the text column (h1 -> subhead -> CTA
 *     group) via Motion variants + staggerChildren. "Blur In" feel done with
 *     opacity + small y (transform/opacity, GPU). Easing --easing-emphasis,
 *     duration --duration-slow (0.4s). Above-the-fold, so it is short and cheap:
 *     no long accumulated delays, the h1 is legible almost immediately.
 *  2. the highlighter Mark (v2 brand device): the brand-anchor word in the
 *     headline ("clientes") carries the --color-highlight (#FFF8BB) text-bg
 *     subrayador with ink text on top (15.82:1). The yellow swipe draws in left
 *     -> right once, AFTER its word has un-blurred, so the eye lands on the
 *     value word. This is the quiet device that replaces the retired amber wash:
 *     the page GAINS the subrayador (now part of the brand system) instead of an
 *     ambient gradient. transform-only (scaleX), GPU, CLS 0.
 *
 * Reduced motion: useReducedMotion() collapses the reveal to its static final
 * state (opacity 1, y 0, no blur) with zero animation; the Mark renders at its
 * full painted state (no draw-in) so the value word is highlighted from frame 1.
 *
 * LCP: the right column is now <HeroPipeline /> (faux-UI, DOM/SVG, no network
 * asset), so the LCP candidate is the text column (measured: the subhead
 * paragraph, ~0.8s on a local prod build). The text reveal is transform/opacity
 * only and short.
 */
export function Hero({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: HeroProps) {
  const reduceMotion = useReducedMotion();

  // Split the headline into words so each one reveals on its own (kinetic
  // "blur-in" word cascade). This is the page's wow ENTRANCE: the title writes
  // itself in word by word with the --easing-expo curve reserved for the wow beat.
  const words = title.split(" ");

  // The highlighter Mark lands on the single brand-anchor word: the CRM is about
  // the client portfolio, so "cliente" (or its plural) is THE value word.
  // Sparing by design — exactly ONE word gets the subrayador. Matched
  // case-insensitively, punctuation-stripped, AND singular/plural-tolerant (a
  // trailing "s" is dropped before comparing) so the device follows the word
  // whether the copy says "cliente" or "clientes". (Root cause of the previously
  // invisible Mark: the constant was "clientes" but the live headline word is
  // the singular "cliente", so nothing ever matched and the span never rendered.)
  const HIGHLIGHT_WORD = "cliente";
  const normalize = (word: string) =>
    word.toLowerCase().replace(/[^\p{L}]/gu, "").replace(/s$/, "");
  const isHighlightWord = (word: string) => normalize(word) === HIGHLIGHT_WORD;

  // The headline contains the value word at most once; flag the first match so a
  // copy with two "cliente"/"clientes" never paints two markers.
  const highlightIndex = words.findIndex(isHighlightWord);

  // Container drives the stagger between the text-column children: the headline
  // block first, then subhead, then the CTA group, with a small head start so
  // the title clearly leads the choreography.
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.05,
      },
    },
  };

  // The headline is itself a stagger container: its children are the words.
  const headingContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        // ~55ms per word: a quick, legible cascade (the full title is readable
        // almost immediately for LCP, but the eye catches the writing-in).
        staggerChildren: 0.055,
      },
    },
  };

  // Each word: rises + un-blurs. Blur is not a transform/opacity prop, so the
  // global MotionConfig cannot strip it under reduced motion: we gate it here
  // and degrade to a plain opacity fade with no blur and no offset.
  const wordVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.72,
            ease: [0.16, 1, 0.3, 1], // --easing-expo (momento wow, v2)
          },
        },
      };

  // The highlighter Mark swipe: scaleX 0 -> 1 from the left, drawn AFTER the
  // word cascade so it reads as a deliberate "this is the word" gesture, not
  // part of the blur-in noise. transform-only (GPU). Under reduced motion it is
  // painted full from the start (no draw-in).
  const markVariants: Variants = reduceMotion
    ? { hidden: { scaleX: 1 }, visible: { scaleX: 1 } }
    : {
        hidden: { scaleX: 0 },
        visible: {
          scaleX: 1,
          transition: {
            duration: 0.4, // --duration-slow
            delay: 0.55,
            ease: [0.16, 1, 0.3, 1], // --easing-expo
          },
        },
      };

  // Subhead + CTA group: "Blur In" via opacity + small upward y. No blur so the
  // value is safe under reduced motion.
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // --duration-slow
        ease: [0.2, 0.8, 0.2, 1], // --easing-emphasis (v2)
      },
    },
  };

  // Washi tape "press-on": each strip drops in with a tiny scale + settle, as if
  // a hand pressed it onto the panel corner. transform/opacity only (GPU). Custom
  // carries the strip's final rotation so it lands at its tilt. Under reduced
  // motion the tape is simply present (final state, no press animation).
  const tapeVariants: Variants = reduceMotion
    ? { hidden: (rot: number) => ({ opacity: 1, rotate: rot, scale: 1 }), visible: (rot: number) => ({ opacity: 1, rotate: rot, scale: 1 }) }
    : {
        hidden: (rot: number) => ({ opacity: 0, rotate: rot, scale: 0.8 }),
        visible: (rot: number) => ({
          opacity: 1,
          rotate: rot,
          scale: 1,
          transition: {
            duration: 0.35,
            delay: 0.9, // after the pipeline has settled into order
            ease: [0.34, 1.56, 0.64, 1], // --ease-snap (the press-on overshoot)
          },
        }),
      };

  // Hand-drawn annotation (firma): a single support-tinted arrow that draws in
  // (stroke-dashoffset) from the CTA zone toward the pipeline, telling the eye
  // "this is what you get". Exactly ONE per the design contract. Under reduced
  // motion it is fully drawn from frame 1.
  const arrowVariants: Variants = reduceMotion
    ? { hidden: { pathLength: 1, opacity: 1 }, visible: { pathLength: 1, opacity: 1 } }
    : {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
          pathLength: 1,
          opacity: 1,
          transition: {
            pathLength: { duration: 0.6, delay: 1.1, ease: [0.4, 0, 0.2, 1] }, // --easing-standard
            opacity: { duration: 0.2, delay: 1.1 },
          },
        },
      };

  return (
    <section
      className={cn(
        "relative isolate min-h-[100dvh] overflow-hidden",
        // v2: flat warm near-white surface. The retired amber->clay wash is
        // replaced by typography + asymmetry + the faux-UI pipeline + the
        // highlighter Mark device on the headline (ADR-4 / brand system).
        "bg-surface",
      )}
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 pt-24 pb-16 lg:grid-cols-12 lg:gap-8">
        {/* Text column: left, asymmetric (does not span the full grid).
            On-load choreographed reveal: container staggers the children. */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start gap-6 lg:col-span-6 lg:pr-6"
        >
          <motion.h1
            variants={headingContainer}
            aria-label={title}
            className="max-w-[18ch] text-balance font-display text-display-xl text-text-primary"
          >
            {words.map((word, i) => {
              const trailingSpace = i < words.length - 1 ? " " : "";
              if (i === highlightIndex) {
                // The brand-anchor word: ink text sitting on a highlighter
                // swipe. The word span is `relative` so it owns a stacking
                // context; INSIDE it the Mark sits at z-0 and the glyphs at
                // z-10 (BOTH positive). The previous build used `-z-10` on the
                // marker, which escaped this span's context and sank behind the
                // section's own bg-surface paint — invisible. Positive in-context
                // layering guarantees the buttermilk reads under the letters.
                // Text stays ink at all times (15.82:1). Padding gives the marker
                // a hand-swiped overshoot beyond the glyph edges.
                return (
                  <motion.span
                    key={`${word}-${i}`}
                    variants={wordVariants}
                    aria-hidden="true"
                    className="relative inline-block whitespace-pre px-1 will-change-[transform,filter]"
                  >
                    <motion.span
                      aria-hidden="true"
                      variants={markVariants}
                      className="absolute inset-x-0 bottom-[0.06em] top-[0.16em] z-0 origin-left rounded-[3px] bg-highlight"
                    />
                    <span className="relative z-10">
                      {word}
                      {trailingSpace}
                    </span>
                  </motion.span>
                );
              }
              return (
                <motion.span
                  key={`${word}-${i}`}
                  variants={wordVariants}
                  aria-hidden="true"
                  className="inline-block whitespace-pre will-change-[transform,filter]"
                >
                  {word}
                  {trailingSpace}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-[46ch] text-body-lg text-text-secondary"
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center"
          >
            <Button
              asChild
              // Primary CTA = ink fill (#101010) + white text (19:1), radius-md,
              // no border/shadow (ink fill IS the affordance). Hover darkens via
              // opacity (v2 dropped the accent-primary-hover token). :active
              // push-down for tactile feedback; focus-ring offset utility.
              className="focus-ring rounded-md bg-accent-primary text-[length:var(--text-body)] text-accent-fg h-auto px-6 py-3 transition-[opacity,transform] duration-fast hover:opacity-90 active:translate-y-px"
            >
              <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              // Outline CTA = transparent + border-interactive (#87837B, ≥3:1)
              // + ink text, radius-md. Subtle sunken hover, tactile :active.
              className="focus-ring rounded-md border-border-interactive bg-transparent text-[length:var(--text-body)] text-text-primary shadow-none h-auto px-6 py-3 transition-[background-color,transform] duration-fast hover:bg-surface-sunken active:translate-y-px"
            >
              <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Faux-UI column: right, asymmetric. The pipeline micro-demo
            (HeroPipeline) is now PROMOTED into the brand's "nota viva" system —
            a pinned living note rather than a flat boxed container. Enrichment
            devices (v2 language, sparing, ≤3 devices):
              1. Quiet warm dot-grid behind the panel only (notebook echo, almost
                 subliminal at hairline tone) — depth without texture noise.
              2. Two washi-tape strips on opposite corners holding the note, with
                 a slight tilt on the whole note + shadow-note so it reads PINNED.
              3. One hand-drawn support arrow curving from the CTA zone toward the
                 note (firma; exactly one annotation per the design contract).
            All transform/opacity (GPU, CLS 0). Decorative devices hide < lg so
            the mobile stack never crowds. */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative lg:col-span-6 lg:pl-6"
        >
          {/* (1) Quiet dot-grid behind the note only. Hairline-tone support dots
              at very low opacity (subliminal). Masked to fade at the edges so it
              never reads as a hard panel. Hidden on mobile. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 hidden rounded-xl opacity-[0.6] lg:block"
            style={{
              backgroundImage:
                "radial-gradient(var(--color-border-strong) 1.2px, transparent 1.2px)",
              backgroundSize: "20px 20px",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 60% 45%, #000 35%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 80% at 60% 45%, #000 35%, transparent 80%)",
            }}
          />

          {/* The pinned living note: slight rotation + shadow-note (the ONLY
              place shadow is allowed per the spec — it marks a nota viva). The
              tape strips sit on top of its corners. */}
          <div className="relative rotate-[-1.2deg] rounded-lg shadow-note lg:rotate-[-1.2deg]">
            {/* (2) Washi tape — top-left corner. Semi-translucent warm support
                tint, soft hairline edges, tilted across the corner. */}
            <motion.span
              aria-hidden="true"
              custom={-24}
              variants={tapeVariants}
              className="pointer-events-none absolute -left-4 -top-2 z-20 hidden h-7 w-24 rounded-[2px] border border-support/15 bg-accent-soft shadow-soft lg:block"
              style={{ originX: 0.5, originY: 0.5 }}
            />
            {/* (2) Washi tape — bottom-right corner, opposite diagonal tilt. */}
            <motion.span
              aria-hidden="true"
              custom={16}
              variants={tapeVariants}
              className="pointer-events-none absolute -bottom-2 -right-4 z-20 hidden h-7 w-24 rounded-[2px] border border-support/15 bg-accent-soft shadow-soft lg:block"
              style={{ originX: 0.5, originY: 0.5 }}
            />

            <HeroPipeline />
          </div>

          {/* (3) One hand-drawn arrow (firma): curves from the lower-left (CTA
              side) up toward the note. support stroke, round caps, draws in on
              load. SVG overlays the column; non-interactive. Hidden on mobile so
              it never crosses stacked content. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 90"
            fill="none"
            className="pointer-events-none absolute -left-10 bottom-2 z-10 hidden h-24 w-32 overflow-visible text-handdrawn lg:block"
          >
            <motion.path
              d="M6 84 C 28 78, 18 40, 52 30 C 78 22, 92 26, 108 18"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              variants={arrowVariants}
            />
            {/* Arrowhead, drawn with the same stroke; revealed together. */}
            <motion.path
              d="M108 18 L 97 14 M108 18 L 101 28"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              variants={arrowVariants}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
