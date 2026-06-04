import { Check } from "@phosphor-icons/react/dist/ssr";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import type { PricingCardProps } from "@/components/landing/types";
import { cn } from "@/lib/utils";

/**
 * Map an ISO 4217 currency code (carried by the pricing data, never hardcoded at
 * the call site) to its display symbol. Prices previously rendered as a bare
 * number ("9") with no money symbol; per Spanish convention the amount is shown
 * with a trailing euro sign and a thin space ("9 €"). Falls back to the raw code
 * for any currency without a mapped glyph so we never silently drop the unit.
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

function currencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] ?? code;
}

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
 * No per-card CTA: the plans are not purchasable yet (pre-launch waitlist), so a
 * per-card "hire this plan" button would be a false affordance and per-card
 * clicks would not be real purchase intent. A single waitlist CTA lives under
 * the grid, owned by the Pricing recommender. The card therefore ends on its
 * features list (the last block); the recommended-tier emphasis (accent border +
 * scale) still guides reading, it just no longer "sells".
 *
 * Emits a Product JSON-LD block per card so each tier is a structured Offer.
 */
export function PricingCard({
  tier,
  price,
  priceCurrency,
  period,
  features,
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
        // Border lifted from hairline to a more present 1.5px border-strong so
        // each card reads framed against the near-white page (still flat — no
        // shadow; the border, not elevation, is the affordance).
        "h-full ring-0 border-[1.5px] border-border-strong bg-surface-raised shadow-none",
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
          {/* Price + currency symbol per ES convention ("9 €"). The amount keeps
              the display type; the euro sign sits in the same baseline group at a
              calmer scale so the number stays the focal point of the hierarchy.
              The symbol comes from priceCurrency (data-driven), never hardcoded. */}
          <span className="font-display text-h2 text-text-primary">
            {price}{" "}
            <span className="text-h3 text-text-secondary">
              {currencySymbol(priceCurrency)}
            </span>
          </span>
          <span className="font-mono text-meta text-text-tertiary">{period}</span>
        </p>
      </CardHeader>

      {/* Features list is the card's last block (no per-card CTA — see header
          docblock). pb-6 restores the bottom breathing room the removed footer
          used to provide, so the card closes calmly instead of ending abruptly
          right under the final feature. flex-1 keeps the list filling toward the
          bottom so equal-height cards stay balanced in the stretched row. */}
      <CardContent className="flex-1 pb-6">
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
    </Card>
  );
}
