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
  // HeroThread (the right column, "El Hilo") reads matchMedia / reduced-motion.
  // Stub it so the scene mounts at its final composed state deterministically
  // (no animation timing in the test).
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

  it("renders the thread scene ('El Hilo') with its narrative moments (R1)", () => {
    render(<Hero {...props} />);

    // The line-art moments carry real rendered micro-copy (the SVG glyphs are
    // aria-hidden; these labels are the narrative the user reads). Director's
    // cut: the desktop composition (matchMedia stub → false) has FOUR moments —
    // note, propuesta, the fugaz 4th moment (iter-A: "visto") and the clock.
    expect(screen.getByText("9:12 · Ana")).toBeInTheDocument();
    expect(screen.getByText("propuesta")).toBeInTheDocument();
    expect(screen.getByText("visto")).toBeInTheDocument();
    expect(screen.getByText("Marta · 12 días")).toBeInTheDocument();
  });

  it("renders the rescue payoff: a 'Retomar' label (the product promise)", () => {
    render(<Hero {...props} />);

    // "Retomar" is the rescued follow-up label that the buttermilk subrayador
    // sweeps over at the end of the loop.
    expect(screen.getByText("Retomar")).toBeInTheDocument();
  });

  it("exposes a screen-reader summary of the promise (the SVG scene is decorative)", () => {
    const { container } = render(<Hero {...props} />);

    // The illustrative SVG is aria-hidden; the narrative is summarized for AT.
    const srOnly = container.querySelector("p.sr-only");
    expect(srOnly).not.toBeNull();
    expect(srOnly?.textContent).toMatch(/cartera/);
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

  it("under reduced motion still renders the full final composition (static)", () => {
    // prefers-reduced-motion: reduce → the thread mounts at its final composed
    // frame (path drawn, 3 moments visible, clock up, check + subrayador
    // painted). We assert the narrative content is all present and unanimated.
    stubMatchMedia(true);
    render(<Hero {...props} />);

    expect(screen.getByText("9:12 · Ana")).toBeInTheDocument();
    expect(screen.getByText("propuesta")).toBeInTheDocument();
    expect(screen.getByText("Marta · 12 días")).toBeInTheDocument();
    expect(screen.getByText("Retomar")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Hero {...props} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
