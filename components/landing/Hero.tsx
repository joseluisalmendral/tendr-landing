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

  // The highlighter Mark lands on the single brand-anchor word: "clientes" (the
  // CRM is about the client portfolio). Sparing by design — exactly ONE word.
  // Matched case-insensitively, punctuation-stripped, so the device follows the
  // word even if the prop copy is reworded around it.
  const HIGHLIGHT_WORD = "clientes";
  const isHighlightWord = (word: string) =>
    word.toLowerCase().replace(/[^\p{L}]/gu, "") === HIGHLIGHT_WORD;

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
              if (isHighlightWord(word)) {
                // The brand-anchor word: ink text sitting on a highlighter
                // swipe. The Mark layer is behind the text (negative z, origin
                // left) so the yellow draws in under the letters; text stays ink
                // at all times (15.82:1). Padding gives the marker a hand-swiped
                // overshoot beyond the glyph edges.
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
                      className="absolute inset-x-0 bottom-[0.08em] top-[0.18em] -z-10 origin-left rounded-[2px] bg-highlight"
                    />
                    {word}
                    {trailingSpace}
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
            (HeroPipeline): 4 paper-note client cards that organize from a
            scatter into a clean ordered pipeline on load (change
            hero-chaos-to-order). Fixed aspect-[4/3] slot reserved inside the
            island for CLS 0. Isolated client leaf; not scroll-driven. */}
        <div className="lg:col-span-6 lg:pl-6">
          <HeroPipeline />
        </div>
      </div>
    </section>
  );
}
