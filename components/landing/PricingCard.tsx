import Link from "next/link";
import { Check } from "@phosphor-icons/react";

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
 * One pricing tier rendered as a brutalist paper card.
 *
 * Server Component: static markup only, no interactivity (F4). The shadcn Card
 * is reused with className overrides; the base Card already ships `rounded-none`,
 * so only the ring/shadow/background differ from spec (no fork needed).
 *
 * The `highlighted` recommendation is conveyed in THREE redundant channels so it
 * never relies on color alone (a11y `color-not-only`): a textual "Recomendado"
 * badge, a 2px accent border, and a layout-neutral `scale-[1.02]` transform.
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
  productName,
  productDescription,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        // Override the base ring with a hairline border on paper.
        "ring-0 border border-border bg-surface-raised",
        // Highlighted tier: ink-accent 2px border, hard shadow, lifted scale.
        highlighted &&
          "border-2 border-accent-primary shadow-hard scale-[1.02]",
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
        {highlighted ? (
          <Badge className="rounded-full bg-accent-primary text-on-accent">
            Recomendado
          </Badge>
        ) : null}
        <CardTitle className="font-heading text-h3 text-text-primary">
          {tier}
        </CardTitle>
        <p className="flex items-baseline gap-1">
          <span className="font-display text-h2 text-text-primary">
            {price}
          </span>
          <span className="font-mono text-meta text-text-muted">{period}</span>
        </p>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-accent-secondary"
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
            className="rounded-cta bg-accent-primary text-on-accent border border-border-strong shadow-hard text-body h-auto w-full px-6 py-3 hover:bg-accent-primary-hover active:translate-y-px active:shadow-hard-sm transition-all"
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="rounded-none border-border-strong bg-transparent text-text-primary text-body h-auto w-full px-6 py-3 shadow-none"
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
