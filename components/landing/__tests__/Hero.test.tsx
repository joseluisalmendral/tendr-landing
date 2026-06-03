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

  it("renders the pipeline as a board: stage columns with the 4 client cards inside (R1)", () => {
    render(<Hero {...props} />);

    // The four client cards (first names). The board renders TWO responsive
    // layouts in the DOM — a 3-column kanban (sm+) and a stacked list (<sm), each
    // CSS-hidden at the other breakpoint — so every client appears twice. We
    // assert presence (getAllByText) rather than a single node.
    expect(screen.getAllByText("Ana").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Marco").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lucía").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Diego").length).toBeGreaterThan(0);

    // The three canonical pipeline stages are present (as column headers on sm+
    // and as per-card tags on mobile). Each of the union members appears.
    expect(screen.getAllByText("Contacto").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Propuesta").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Activo").length).toBeGreaterThan(0);
  });

  it("renders the follow-up nudge (the product promise) with the slipping client", () => {
    render(<Hero {...props} />);

    // Nudge renders for both layouts (desktop corner chip + mobile in-flow).
    expect(screen.getAllByText("Marta").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/12 días sin contacto/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Retomar/).length).toBeGreaterThan(0);
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
