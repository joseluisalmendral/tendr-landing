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
 *     opacity + small y (transform/opacity, GPU). Easing --ease-out, duration
 *     --duration-reveal (0.48s). Above-the-fold, so it is short and cheap: no
 *     long accumulated delays, the h1 is legible almost immediately.
 *  2. continuous ambient wash loop (~20s): a dedicated CSS layer
 *     (.hero-wash-ambient in globals.css) animating only transform/opacity.
 *
 * Reduced motion: useReducedMotion() collapses the reveal to its static final
 * state (opacity 1, y 0, no blur) with zero animation; the wash layer freezes
 * to its static base via its own prefers-reduced-motion guard. The static
 * amber->clay wash on the <section> is always visible regardless.
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
  // itself in word by word with the --ease-expo curve reserved for the wow beat.
  const words = title.split(" ");

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
            duration: 0.72, // --duration-wow
            ease: [0.16, 1, 0.3, 1], // --easing-expo (momento wow, v2)
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
        duration: 0.48, // --duration-reveal
        ease: [0.22, 1, 0.36, 1], // --ease-out
      },
    },
  };

  return (
    <section
      className={cn(
        "relative isolate min-h-[100dvh] overflow-hidden",
        // Ambient wash background: amber -> clay, token-driven (zero hex). This
        // STATIC base is always visible (reduced motion / no scroll-driven
        // support / first frame); the .hero-wash-ambient layer only enriches.
        "bg-[linear-gradient(135deg,var(--color-wash-from),var(--color-wash-to))]",
      )}
    >
      {/* Ambient wash loop (~20s, GPU transform/opacity only). Absolute layer
          behind content; clipped by the section's overflow-hidden. Animation
          and reduced-motion gate live in globals.css (.hero-wash-ambient). */}
      <div aria-hidden="true" className="hero-wash-ambient" />

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
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                variants={wordVariants}
                aria-hidden="true"
                className="inline-block whitespace-pre will-change-[transform,filter]"
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            ))}
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
              className="rounded-md bg-accent-primary border border-border-strong text-[length:var(--text-body)] text-on-accent h-auto px-6 py-3 transition-all hover:bg-accent-primary-hover active:translate-y-px"
            >
              <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-md border-border-strong bg-transparent text-[length:var(--text-body)] text-text-primary shadow-none h-auto px-6 py-3"
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
