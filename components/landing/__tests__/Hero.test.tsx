import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Hero } from "@/components/landing/Hero";
import type { HeroProps } from "@/components/landing/types";

const props: HeroProps = {
  title: "El mini-CRM para tu cartera de clientes freelance",
  subtitle:
    "Ordená leads, propuestas y cobros en un pipeline visual. Sin hojas de cálculo ni recordatorios perdidos.",
  ctaPrimary: { label: "Empezá gratis", href: "/signup" },
  ctaSecondary: { label: "Ver cómo funciona", href: "/demo" },
};

/** matchMedia stub returning a fixed `matches` for every query. */
function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

describe("Hero", () => {
  // HeroPipeline (the right column) reads useSyncExternalStore-backed
  // matchMedia. Stub it to the mobile/static branch so the pipeline renders its
  // ordered final state deterministically (no animation timing in the test).
  beforeEach(() => {
    stubMatchMedia(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders exactly one <h1> with the title (the page's only h1)", () => {
    const { container } = render(<Hero {...props} />);

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(props.title);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders the subtitle", () => {
    render(<Hero {...props} />);
    expect(screen.getByText(props.subtitle)).toBeInTheDocument();
  });

  it("renders both CTA links with their labels and hrefs", () => {
    render(<Hero {...props} />);

    const primary = screen.getByRole("link", { name: props.ctaPrimary.label });
    const secondary = screen.getByRole("link", {
      name: props.ctaSecondary.label,
    });

    expect(primary).toHaveAttribute("href", props.ctaPrimary.href);
    expect(secondary).toHaveAttribute("href", props.ctaSecondary.href);
  });

  it("renders the pipeline micro-demo with exactly 4 client cards (R1)", () => {
    render(<Hero {...props} />);

    // Each card shows a client name + a stage label from the allowed union.
    expect(screen.getByText("Ana Ruiz")).toBeInTheDocument();
    expect(screen.getByText("Marco Vidal")).toBeInTheDocument();
    expect(screen.getByText("Lucía Fernández")).toBeInTheDocument();
    expect(screen.getByText("Diego Sá")).toBeInTheDocument();

    const stages = screen.getAllByText(/^(Contacto|Propuesta|Activo)$/);
    expect(stages).toHaveLength(4);
  });

  it("primary CTA carries the v2 ink-fill token classes (radius-md, ink bg, white text, no hard shadow)", () => {
    render(<Hero {...props} />);

    const primary = screen.getByRole("link", { name: props.ctaPrimary.label });
    expect(primary.className).toContain("rounded-md");
    expect(primary.className).toContain("bg-accent-primary");
    expect(primary.className).toContain("text-accent-fg");
    expect(primary.className).toContain("focus-ring");
    // v2 retired the offset hard shadow: ink fill is the affordance.
    expect(primary.className).not.toContain("shadow-hard");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Hero {...props} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
