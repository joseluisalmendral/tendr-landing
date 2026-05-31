import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";

import { PricingCard } from "@/components/landing/PricingCard";
import type { PricingCardProps } from "@/components/landing/types";

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
  cta: { label: "Empezar gratis", href: "/registro" },
  productName: "Tendr Solo",
  productDescription: "Plan gratuito para freelancers que empiezan.",
};

function renderCard(overrides: Partial<PricingCardProps> = {}) {
  return render(<PricingCard {...baseProps} {...overrides} />);
}

function parseJsonLd(container: HTMLElement) {
  const script = container.querySelector(
    'script[type="application/ld+json"]',
  );
  expect(script).not.toBeNull();
  return JSON.parse(script!.textContent!);
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

  it("renders the cta as an <a> with the correct name and href", () => {
    renderCard({ cta: { label: "Empezar gratis", href: "/registro" } });

    const link = screen.getByRole("link", { name: "Empezar gratis" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/registro");
  });

  it("shows a textual recommendation badge and accent border when highlighted", () => {
    const { container } = renderCard({ highlighted: true });

    // Recommendation is textual, not color-only (a11y color-not-only).
    expect(screen.getByText("Recomendado")).toBeInTheDocument();

    const card = container.querySelector('[data-slot="card"]');
    expect(card).not.toBeNull();
    expect(card!.className).toContain("border-accent-primary");
    expect(card!.className).toContain("border-2");
  });

  it("does not render the recommendation badge when not highlighted", () => {
    renderCard({ highlighted: false });

    expect(screen.queryByText("Recomendado")).toBeNull();
  });

  it("emits exactly one Product JSON-LD script with the correct offer shape", () => {
    const { container } = renderCard({
      price: "29",
      priceCurrency: "EUR",
      productName: "Tendr Pro",
      productDescription: "Plan de pago para freelancers en crecimiento.",
    });

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(1);

    const data = parseJsonLd(container);
    expect(data["@type"]).toBe("Product");
    expect(data.name).toBe("Tendr Pro");
    expect(data.offers.price).toBe(String(29));
    expect(data.offers.priceCurrency).toBe("EUR");
    expect(data.offers["@type"]).toBe("Offer");
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
