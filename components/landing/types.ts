import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import type { MotionValue } from "motion/react";

/**
 * Shared prop contracts for the Tendr base landing components.
 *
 * These types are the single source of truth resolved by the design phase.
 * Each landing component imports its own prop type from here so the shapes stay
 * consistent across Hero, Section, Feature, PricingCard, TestimonialCard and FAQ.
 */

/** A call-to-action that navigates: rendered as a real anchor (next/link). */
export type CtaLink = {
  label: string;
  href: string;
};

/**
 * A feature's leading visual. Discriminated union on `kind`:
 * - `icon`: a Phosphor icon component (Phosphor only, no other icon set).
 * - `image`: a next/image with explicit dimensions (CLS reserve).
 */
export type FeatureVisual =
  | { kind: "icon"; icon: Icon }
  | { kind: "image"; src: string; alt: string; width: number; height: number };

/** An image with explicit intrinsic dimensions so layout is reserved (CLS 0). */
export type SizedImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Hero: the page's single above-the-fold value proposition. */
export type HeroProps = {
  title: string;
  /** <= 20 words (enforced by reviewer, not at runtime). */
  subtitle: string;
  ctaPrimary: CtaLink;
  ctaSecondary: CtaLink;
};

/** Section: a vertical content block that renders its own <h2>. */
export type SectionProps = {
  id?: string;
  heading: string;
  /** Optional mono pill; caller enforces the "max 1 per 3 sections" budget. */
  eyebrow?: string;
  /** Renders a hand-drawn "stitched seam" divider above the section to mark the
   * boundary clearly while scrolling fast. Decorative (aria-hidden). */
  divider?: boolean;
  /** Optional extra classes on the outer <section> (e.g. the wow overlap hook). */
  className?: string;
  children: ReactNode;
};

/** Feature: a single capability with a heading, body and visual. */
export type FeatureProps = {
  title: string;
  description: string;
  visual: FeatureVisual;
  link?: CtaLink;
};

/** PricingCard: one pricing tier; emits a Product JSON-LD block. */
export type PricingCardProps = {
  tier: string;
  /** Display string, e.g. "0" / "29". */
  price: string;
  /** ISO 4217 currency, e.g. "EUR". */
  priceCurrency: string;
  /** Rendered in mono, e.g. "/mes". */
  period: string;
  features: string[];
  cta: CtaLink;
  /**
   * Visual emphasis anchor (scale 1.02 + hard shadow + accent border). It marks
   * the target tier, NOT the live recommendation: the moving "Recomendado"
   * annotation (arrow + tag + box) is owned by the Pricing recommender.
   */
  highlighted?: boolean;
  /** Small "for whom" subtitle, e.g. "Para empezar" / "Para freelances". */
  forWho?: string;
  /** Generic status badge, e.g. "Próximamente". Not the recommendation tag. */
  badge?: string;
  /** Product.name for JSON-LD. */
  productName: string;
  productDescription?: string;
};

/**
 * Entrance variant for a cork note in the cinematic lateral pan. Each note gets
 * one assigned variant so entrances stay visibly varied across the board.
 * transform/opacity only (+ a single blur on "blur-drop").
 */
export type EntranceVariant =
  | "slide-up"
  | "rotate-drop"
  | "fade-scale"
  | "slide-right"
  | "blur-drop";

/** Paper-note size on the cork board. Maps to a figure max-width (sm/md/lg). */
export type NoteSize = "sm" | "md" | "lg";

/** TestimonialCard: a single attributed quote. */
export type TestimonialCardProps = {
  name: string;
  role: string;
  company: string;
  /** <= 3 lines (reviewer), curly quotes, no em-dash. */
  quote: string;
  /**
   * Avatar image. The avatar is a generated illustration (dicebear), so alt is
   * derived as `Avatar de ${name}, ${role} en ${company}` (not "Foto de").
   * Remote dicebear SVGs are rendered with `unoptimized` (see TestimonialCard).
   */
  avatar: { src: string; width: number; height: number };
  /**
   * Marks the asymmetric "featured" note: larger, name in display font, clay
   * underline. Exactly one testimonial should set this.
   */
  featured?: boolean;

  // ---- Cork-pan data fields (optional, backward-compatible) ----
  /** Assigned entrance variant. Default "slide-up". */
  entrance?: EntranceVariant;
  /** Paper size on the board. Default "md". */
  size?: NoteSize;
  /** Resting tilt in degrees (paper-pinned character). */
  tilt?: number;
  /** Center arrival point on the pan track, 0..1 left-to-right. */
  panPosition?: number;

  // ---- Runtime-only (passed by TestimonialsCork, never data) ----
  /**
   * Shared scroll progress (0..1) of the pan spacer. Its PRESENCE signals the
   * pan path (the card plays its time-based whileInView entrance); absent → the
   * card renders pinned-static (reduced-motion / mobile fallback).
   */
  panProgress?: MotionValue<number>;
  /**
   * The FIRST note is "placed by the cartoon hand" in the intro: it renders
   * opaque + pinned immediately (NO whileInView entrance) so the hand can press
   * it on screen. Only the opening note sets this.
   */
  placed?: boolean;
  /** Index within the note list (used to derive the entrance sub-range). */
  index?: number;
  /** Total note count. */
  total?: number;
};

/** A single FAQ entry. `answer` is plain text so FAQPage.acceptedAnswer.text is valid. */
export type FaqItem = {
  question: string;
  answer: string;
};

/** FAQ: an accordion of Q&A that emits a FAQPage JSON-LD block. */
export type FaqProps = {
  items: FaqItem[];
};
