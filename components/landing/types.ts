import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

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
  image: SizedImage;
};

/** Section: a vertical content block that renders its own <h2>. */
export type SectionProps = {
  id?: string;
  heading: string;
  /** Optional mono pill; caller enforces the "max 1 per 3 sections" budget. */
  eyebrow?: string;
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
  highlighted?: boolean;
  /** Product.name for JSON-LD. */
  productName: string;
  productDescription?: string;
};

/** TestimonialCard: a single attributed quote. */
export type TestimonialCardProps = {
  name: string;
  role: string;
  company: string;
  /** <= 3 lines (reviewer), curly quotes, no em-dash. */
  quote: string;
  /** Avatar image; alt is derived as `Foto de ${name}, ${role} en ${company}`. */
  avatar: { src: string; width: number; height: number };
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
