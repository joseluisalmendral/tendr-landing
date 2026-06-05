import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";

import { PricingCard } from "@/components/landing/PricingCard";
import type { PricingCardProps } from "@/components/landing/types";

// NOTE: PricingCard no longer emits per-card Product JSON-LD. Pricing tiers
// are exposed as Offer entries inside the SoftwareApplication block emitted by
// the page (app/page.tsx). Standalone Product requires an `image` field for
// Google Rich Results; folding tiers as Offers in SoftwareApplication is the
// correct schema.org modelling for a pre-launch SaaS with non-purchasable plans.

const baseProps: PricingCardProps = {
  tier: "Solo",
  price: "0",
  priceCurrency: "EUR",
  period: "/mes",
  features: [
    "Pipeline visual ilimitado",
    "Hasta 50 contactos",
    "Recordatorios automáticos",
  ],
  productName: "Tendr Solo",
  productDescription: "Plan gratuito para freelancers que empiezan.",
};

function renderCard(overrides: Partial<PricingCardProps> = {}) {
  return render(<PricingCard {...baseProps} {...overrides} />);
}

describe("PricingCard", () => {
  it("renders the tier, price and period", () => {
    renderCard({ tier: "Pro", price: "29", period: "/mes" });

    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("29")).toBeInTheDocument();
    expect(screen.getByText("/mes")).toBeInTheDocument();
  });

  it("renders every feature string", () => {
    renderCard();

    for (const feature of baseProps.features) {
      expect(screen.getByText(feature)).toBeInTheDocument();
    }
  });

  it("renders one Phosphor check <svg> per feature and no <img>", () => {
    const { container } = renderCard();

    const list = container.querySelector("ul");
    expect(list).not.toBeNull();

    const checks = (list as HTMLElement).querySelectorAll("svg");
    expect(checks).toHaveLength(baseProps.features.length);

    expect(container.querySelector("img")).toBeNull();
  });

  it("renders no per-card CTA link (the single waitlist CTA lives under the grid)", () => {
    // The plans are not purchasable yet (pre-launch waitlist), so a per-card
    // "hire this plan" button would be a false affordance. The card carries no
    // CTA; the single waitlist CTA is owned by the Pricing recommender.
    renderCard();

    expect(screen.queryByRole("link")).toBeNull();
  });

  it("applies the accent emphasis (2px accent border) when highlighted", () => {
    const { container } = renderCard({ highlighted: true });

    // `highlighted` is now PURELY visual emphasis on the target tier. The
    // textual recommendation (a11y color-not-only) lives in the Pricing
    // recommender (conclusion panel + moving annotation), not in this card, so
    // a standalone card must NOT print a "Recomendado" badge.
    expect(screen.queryByText("Recomendado")).toBeNull();

    const card = container.querySelector('[data-slot="card"]');
    expect(card).not.toBeNull();
    expect(card!.className).toContain("border-accent-primary");
    expect(card!.className).toContain("border-2");
  });

  it("does not render the recommendation badge when not highlighted", () => {
    renderCard({ highlighted: false });

    expect(screen.queryByText("Recomendado")).toBeNull();
  });

  it("emits no JSON-LD script (pricing tiers are Offers inside SoftwareApplication on the page)", () => {
    const { container } = renderCard({
      price: "29",
      priceCurrency: "EUR",
      productName: "Tendr Pro",
      productDescription: "Plan de pago para freelancers en crecimiento.",
    });

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(0);
  });

  it("has no accessibility violations (default)", async () => {
    const { container } = renderCard();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations (highlighted)", async () => {
    const { container } = renderCard({ highlighted: true });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
