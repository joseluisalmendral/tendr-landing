"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
import { HeroTriptych } from "@/components/landing/HeroTriptych";
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
 * LCP: the right column is now <HeroTriptych /> (frameless SVG illustration, no
 * network asset), so the LCP candidate is the text column (the subhead
 * paragraph). The text reveal is transform/opacity only and short.
 *
 * Right column (B1-fix-5): the hero TRIPTYCH (<HeroTriptych />). One global
 * clock (21.6s desktop) runs three acts back-to-back over a single shared SVG
 * stage: Acto I "El Hilo" (the portfolio draws itself, AI detects a cold client
 * and the cursor "tú" clicks Retomar), Acto II "Constelación" (the portfolio
 * floats; a client drifts, the cursor drags it back), Acto III "El día" (the
 * day writes itself as a timeline and the AI plans tomorrow), then the closing
 * point relaunches as Acto I's nib. Mobile <lg shows Acto I only; reduced motion
 * shows the Acto I resolved frame. Source: docs/motion/hero-triptico-score.md.
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

  // The headline is itself a stagger container: its children are the words.
  const headingContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        // ~40ms per word: a quick, legible cascade. Tight enough that the full
        // title settles right after FCP (LCP perf), still reads as writing-in.
        staggerChildren: 0.04,
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
        // PERF (LCP): the <h1> is the LCP element on mobile. Words start
        // PAINTED (opacity 1) and animate only transform (y) + filter (blur):
        // the glyphs are present from the first frame, so the simulated-throttle
        // LCP is no longer pinned to the JS-driven opacity:0→1 at TTI. The
        // signature "blur-in" cascade is preserved (rise + de-focus), and the
        // initial blur is lighter so the text is legible/contentful immediately.
        hidden: { opacity: 1, y: 16, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.5,
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
        {/* Text column: left, asymmetric (does not span the full grid). The
            headline runs its own Motion word-cascade (the wow entrance); the
            subhead + CTA enter via CSS (.hero-text-enter) so the LCP <p> paints
            on the first frame instead of waiting for JS hydration. */}
        <div className="flex flex-col items-start gap-6 lg:col-span-6 lg:pr-6">
          <motion.h1
            variants={headingContainer}
            initial="hidden"
            animate="visible"
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

          <p className="hero-text-enter hero-text-enter--subhead max-w-[46ch] text-body-lg text-text-secondary">
            {subtitle}
          </p>

          <div className="hero-text-enter hero-text-enter--cta flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
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
          </div>
        </div>

        {/* Illustration column: right, asymmetric. "El Hilo" — a frameless
            looping scene (no window chrome, no card, no tape, no grid, no
            arrow). The portfolio draws itself as a single living ink stroke that
            threads three moments, drops a forgotten follow-up, then loops back
            to rescue it. The scene owns its own motion timeline and a11y; this
            column is just its asymmetric slot, vertically centered. Enters via
            CSS (.hero-text-enter) so no JS gate sits on the above-the-fold area. */}
        <div className="hero-text-enter relative lg:col-span-6 lg:pl-6">
          {/* On mobile the scene is a compact supporting illustration (capped
              width so the square viewBox does not reserve a tall void above
              "Cómo funciona"); on lg+ it fills the asymmetric column beside the
              headline. The narrative (route + 3 moments + rescue) is identical at
              both sizes and reads at 390px. */}
          <div className="mx-auto max-w-[260px] sm:max-w-[340px] lg:mx-0 lg:max-w-none">
            <HeroTriptych />
          </div>
        </div>
      </div>
    </section>
  );
}
