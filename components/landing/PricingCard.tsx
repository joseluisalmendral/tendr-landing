import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import type { PricingCardProps } from "@/components/landing/types";
import { cn } from "@/lib/utils";

/**
 * One pricing tier rendered as a clean v2 card (flat surface + hairline border).
 *
 * Server Component: static markup only, no interactivity. These cards are NOT
 * "notas vivas" (no rotation, no pushpin, no shadow-note) — they are structural
 * surfaces, so they stay flat (shadow-none) with a hairline border per the v2
 * clean direction. Elevation is communicated by the ink border on the target
 * tier, not by drop shadows.
 *
 * `highlighted` is the static VISUAL emphasis of the target tier (a 2px ink
 * accent border + a layout-neutral `scale-[1.02]` transform, no shadow). It does
 * NOT print a "Recomendado" badge anymore: the live recommendation is the
 * moving annotation (arrow + tag + hand-drawn box) owned by the Pricing
 * recommender, so a static badge here would duplicate that intent.
 *
 * Two optional, recommendation-neutral channels:
 * - `forWho`: a small "for whom" subtitle ("Para empezar" / "Para equipos").
 * - `badge`: a generic status pill ("Próximamente"), never the recommendation.
 *
 * Emits a Product JSON-LD block per card so each tier is a structured Offer.
 */
export function PricingCard({
  tier,
  price,
  priceCurrency,
  period,
  features,
  cta,
  highlighted = false,
  forWho,
  badge,
  productName,
  productDescription,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        // h-full so every tier matches the tallest card in the row (equal
        // heights); the footer (CTA) is pushed to the bottom via flex below.
        "h-full ring-0 border border-border bg-surface-raised shadow-none",
        // Highlighted tier: ink-accent 2px border + lifted scale (no shadow —
        // the ink border is the affordance, the page stays flat/clean).
        highlighted &&
          "border-2 border-accent-primary scale-[1.02]",
      )}
    >
      <JsonLd
        type="Product"
        data={{
          name: productName,
          description: productDescription,
          offers: {
            "@type": "Offer",
            price: String(price),
            priceCurrency,
          },
        }}
      />

      <CardHeader>
        {badge ? (
          <Badge
            variant="outline"
            className="w-fit rounded-sm border-border-strong bg-surface-sunken text-text-secondary"
          >
            {badge}
          </Badge>
        ) : null}
        <CardTitle className="font-heading text-h3 text-text-primary">
          {tier}
        </CardTitle>
        {forWho ? (
          <span className="font-mono text-meta uppercase text-text-tertiary">
            {forWho}
          </span>
        ) : null}
        <p className="flex items-baseline gap-1">
          <span className="font-display text-h2 text-text-primary">
            {price}
          </span>
          <span className="font-mono text-meta text-text-tertiary">{period}</span>
        </p>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="flex flex-col gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-support"
                weight="bold"
              />
              <span className="text-body text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {highlighted ? (
          <Button
            asChild
            className="rounded-md bg-accent-primary text-accent-fg text-body h-auto w-full px-6 py-3 shadow-none hover:brightness-110 active:translate-y-px transition-all"
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="rounded-md border-border-interactive bg-transparent text-text-primary text-body h-auto w-full px-6 py-3 shadow-none hover:bg-surface-sunken/60 active:translate-y-px transition-all"
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
