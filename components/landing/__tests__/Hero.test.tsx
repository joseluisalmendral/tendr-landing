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

/**
 * matchMedia stub. `reducedMotion` controls the
 * `prefers-reduced-motion: reduce` query specifically; every other query
 * (notably the `max-width` mobile query) returns `mobile`.
 */
function stubMatchMedia({
  reducedMotion = false,
  mobile = false,
}: { reducedMotion?: boolean; mobile?: boolean } = {}) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: /prefers-reduced-motion/.test(query) ? reducedMotion : mobile,
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
  // HeroTriptych reads matchMedia (mobile + reduced-motion). Default: desktop,
  // full motion. Under jsdom the global clock does not advance, so we assert
  // the reduced-motion frame (the Acto I resolved composition) where all
  // narrative text is painted statically — that is the deterministic surface.
  beforeEach(() => {
    stubMatchMedia({ reducedMotion: true });
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

  it("renders the Acto I resolved frame: the thread's narrative moments (reduced-motion)", () => {
    render(<Hero {...props} />);

    // Reduced motion freezes the triptych at the Acto I resolved frame
    // (master score §5). The four moments are painted with their real
    // micro-copy (SVG glyphs are aria-hidden; these labels are the narrative).
    expect(screen.getByText("9:12 · Ana")).toBeInTheDocument();
    expect(screen.getByText("propuesta")).toBeInTheDocument();
    expect(screen.getByText("visto")).toBeInTheDocument(); // fugaz iter-A
    expect(screen.getByText("Marta · 12 días")).toBeInTheDocument();
  });

  it("renders the AI suggestion and the human action (the IA→tú split)", () => {
    render(<Hero {...props} />);

    // The product truth: the AI detects + suggests, the human (cursor "tú")
    // acts. Both must be present in the resolved frame.
    expect(screen.getByText(/Marta lleva 12 días/)).toBeInTheDocument();
    expect(screen.getByText("Retomar")).toBeInTheDocument();
    // The AI pill carries the "IA" label (the single support signature).
    expect(screen.getAllByText("IA").length).toBeGreaterThanOrEqual(1);
  });

  it("names the right at-risk client per act (monogram canon: Marta in Acto I)", () => {
    render(<Hero {...props} />);

    // master §3-canon / D11: Acto I rescues Marta (12 days). The bubble must
    // name Marta, never Lucía (Lucía is Acto II's at-risk client).
    const bubble = screen.getByText(/Marta lleva 12 días/);
    expect(bubble.textContent).toMatch(/Marta/);
    expect(bubble.textContent).not.toMatch(/Lucía/);
  });

  it("shows the act indicator with 01 active on the resolved frame", () => {
    render(<Hero {...props} />);

    // master §1.3: indicator 01·02·03 present; the reduced-motion frame is
    // Acto I, so 01 is the active numeral.
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("exposes a screen-reader summary of the promise (the SVG scene is decorative)", () => {
    const { container } = render(<Hero {...props} />);

    const srOnly = container.querySelector("p.sr-only");
    expect(srOnly).not.toBeNull();
    expect(srOnly?.textContent).toMatch(/cartera/);
    expect(srOnly?.textContent).toMatch(/mañana/);
  });

  it("primary CTA carries the v2 ink-fill token classes (radius-md, ink bg, white text, no hard shadow)", () => {
    render(<Hero {...props} />);

    const primary = screen.getByRole("link", { name: props.ctaPrimary.label });
    expect(primary.className).toContain("rounded-md");
    expect(primary.className).toContain("bg-accent-primary");
    expect(primary.className).toContain("text-accent-fg");
    expect(primary.className).toContain("focus-ring");
    expect(primary.className).not.toContain("shadow-hard");
  });

  it("color discipline: highlight is only ever a text background, never a stroke/dot", () => {
    const { container } = render(<Hero {...props} />);

    // master §4 / design.md hard rule: --color-highlight (bg-highlight) appears
    // ONLY as a text-background swipe (the buttermilk underline), never as an
    // SVG stroke or a non-text element. Assert no SVG element uses the highlight
    // token as a stroke or fill.
    const highlightStroked = Array.from(
      container.querySelectorAll("[stroke]"),
    ).filter((el) =>
      (el.getAttribute("stroke") ?? "").includes("--color-highlight"),
    );
    expect(highlightStroked).toHaveLength(0);

    // The buttermilk span (text background) does exist.
    expect(container.querySelector(".bg-highlight")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Hero {...props} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
