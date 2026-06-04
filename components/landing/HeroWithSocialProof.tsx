"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
import { HeroTriptych } from "@/components/landing/HeroTriptych";
import { cn } from "@/lib/utils";
import type { HeroProps, SocialProofLogo } from "@/components/landing/types";

/**
 * HeroWithSocialProof — the PRODUCTION hero of the main landing (/).
 *
 * Promoted at the F6.5 close: of the two hero candidates explored in F6.5
 * ("Social proof primero" vs the discarded "CTA central directo"), this one is
 * the live hero. The choice was made by judgment pre-launch (no live A/B traffic
 * ran against the documented H1/H2 criteria — those criteria remain on file for
 * when traffic exists). See exploration/variants/decisions.md.
 *
 * Why a separate component instead of a Hero prop: this hero introduces a layout
 * element the base Hero (still used by /agencias) deliberately does NOT have — a
 * logo eyebrow row that sits BEFORE the <h1> and is part of the on-load reveal
 * choreography. Threading that through the base Hero would force conditional
 * branches around the tightly-tuned headline cascade and the LCP path. A
 * dedicated component keeps the base Hero clean while reusing every shared piece
 * (HeroTriptych, the v2 CTA tokens, the same word-cascade entrance and the CSS
 * .hero-text-enter reveal). See exploration/variants/decisions.md for the
 * documented 4-element deviation this row introduces (now the production state).
 *
 * Rationale (social proof primero): showing credibility marks above the value
 * proposition aims to lift trust for a junior B2B audience that may not know
 * Tendr yet, so the headline lands on an already-warmed reader. The hero is
 * taller (the logo row + more breathing room) so the proof reads before the
 * eye reaches the headline.
 *
 * Logos: placeholder monogram MARKS (invented brands — Tendr has not launched,
 * so there are no real customers to cite). They are decorative (aria-hidden);
 * a single sr-only line gives screen readers the honest context that these are
 * illustrative, pre-launch placeholders, never a real trust claim.
 *
 * Motion: the logo row reuses the existing on-load reveal (Motion stagger for
 * the marks + the same .hero-text-enter CSS for subhead/CTA). prefers-reduced-
 * motion collapses to the static final state. No new scroll-pins (the single
 * wow stays the Hero->Cómo funciona overlap owned by the page).
 */

// Pre-launch placeholder marks. Invented names → invented monogram glyphs, per
// the design-taste social-proof rule (no plain text wordmarks; generate a mark).
const PLACEHOLDER_LOGOS: SocialProofLogo[] = [
  { name: "Nomadia" },
  { name: "Briquet" },
  { name: "Veladora" },
  { name: "Cauce" },
  { name: "Tándem" },
];

const HIGHLIGHT_WORD = "cliente";

export function HeroWithSocialProof({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: HeroProps) {
  const reduceMotion = useReducedMotion();

  const words = title.split(" ");
  const normalize = (word: string) =>
    word.toLowerCase().replace(/[^\p{L}]/gu, "").replace(/s$/, "");
  const isHighlightWord = (word: string) => normalize(word) === HIGHLIGHT_WORD;
  const highlightIndex = words.findIndex(isHighlightWord);

  // Headline cascade (identical system to the base Hero so the brand entrance
  // reads the same): the <h1> is a stagger container; each word rises + un-blurs.
  const headingContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
  };

  const wordVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 1, y: 16, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const markVariants: Variants = reduceMotion
    ? { hidden: { scaleX: 1 }, visible: { scaleX: 1 } }
    : {
        hidden: { scaleX: 0 },
        visible: {
          scaleX: 1,
          transition: { duration: 0.4, delay: 0.55, ease: [0.16, 1, 0.3, 1] },
        },
      };

  // The logo eyebrow is its own short stagger container: the marks fade+rise
  // in sequence ahead of the headline (proof lands first). Reduced motion shows
  // them static. The marks are decorative, so this never gates real content.
  const logoRow: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
    },
  };
  const logoMark: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
        },
      };

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-surface">
      {/* Taller hero (Variant B): more top room so the logo eyebrow has its own
          beat before the headline. pt stays within the design-spec cap. */}
      <div className="mx-auto grid min-h-[100dvh] max-w-[1280px] grid-cols-1 content-center items-center gap-12 px-6 pt-16 pb-24 lg:grid-cols-12 lg:gap-8 lg:pt-12 lg:pb-40">
        <div className="flex flex-col items-start gap-6 lg:col-span-6 lg:pr-6">
          {/* Logo eyebrow — placeholder monogram marks, BEFORE the title.
              Pre-launch signal integration decision: this hero ALREADY owns one
              eyebrow (the logo row). To honor the v2 "no two competing eyebrows"
              rule, the "Pre-lanzamiento" signal is FOLDED INTO this same eyebrow
              beat as a quiet leading mono tag on the same row as the marks,
              rather than stacking a second eyebrow above or below the title. It
              reads as one credibility line ("pre-launch, with these (illustrative)
              brands"), keeps the hero text-element count unchanged, adds no client
              JS and no layout shift, and enters with the existing logo-row stagger
              reveal so the LCP path is untouched. */}
          <div className="hero-text-enter w-full">
            <p className="sr-only">
              Tendr está en pre-lanzamiento. Marcas ilustrativas previas al
              lanzamiento: aún no ha salido; no representan clientes reales.
            </p>
            <motion.ul
              variants={logoRow}
              initial="hidden"
              animate="visible"
              aria-hidden="true"
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <motion.li variants={logoMark}>
                <span className="inline-flex items-center rounded-full border border-border-hairline bg-surface-raised px-3 py-1 font-mono text-meta uppercase tracking-[0.18em] text-text-secondary shadow-flat">
                  Pre-lanzamiento
                </span>
              </motion.li>
              {PLACEHOLDER_LOGOS.map((logo) => (
                <motion.li key={logo.name} variants={logoMark}>
                  <LogoMark logo={logo} />
                </motion.li>
              ))}
            </motion.ul>
          </div>

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
              className="focus-ring rounded-md bg-accent-primary text-[length:var(--text-body)] text-accent-fg h-auto px-6 py-3 transition-[opacity,transform] duration-fast hover:opacity-90 active:translate-y-px"
            >
              <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="focus-ring rounded-md border-border-interactive bg-transparent text-[length:var(--text-body)] text-text-primary shadow-none h-auto px-6 py-3 transition-[background-color,transform] duration-fast hover:bg-surface-sunken active:translate-y-px"
            >
              <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
            </Button>
          </div>
        </div>

        <div className="hero-text-enter relative lg:col-span-6 lg:pl-6">
          <div className="mx-auto max-w-[260px] sm:max-w-[340px] lg:mx-0 lg:max-w-none">
            <HeroTriptych />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A single placeholder social-proof mark: a monogram inside a hairline pill +
 * the brand wordmark in muted text. Decorative (the row is aria-hidden). Uses
 * only v2 tokens: hairline border, surface-raised fill, text-tertiary glyph —
 * the marks stay quiet so they never compete with the ink CTA. No support-hue
 * (those roles are signature/AI/progress, not logos).
 */
function LogoMark({ logo }: { logo: SocialProofLogo }) {
  const monogram = (logo.monogram ?? logo.name.charAt(0)).toUpperCase();
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full",
          "border border-border-hairline bg-surface-raised",
          "font-display text-body-sm font-semibold text-text-tertiary",
        )}
      >
        {monogram}
      </span>
      <span className="font-display text-body-sm font-medium text-text-tertiary">
        {logo.name}
      </span>
    </span>
  );
}
