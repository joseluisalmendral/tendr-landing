import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TestimonialsCork } from "@/components/landing/TestimonialsCork";
import { TESTIMONIALS } from "@/components/landing/testimonials.data";

// Mock the Lenis hook so the pan-path focus handler has a deterministic target
// to call. The real ReactLenis provider is not mounted in this unit test.
const lenisScrollTo = vi.fn();
vi.mock("lenis/react", () => ({
  useLenis: () => ({ scrollTo: lenisScrollTo }),
}));

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

/**
 * Smoke test for the StaticBoardGrid fallback path (R9/R10/R2). We force the
 * static branch by stubbing matchMedia to always-false (mobile / no md), so the
 * island early-returns the static grid: all 7 notes visible, exactly one
 * <h2 id="testimonios-title">, no scroll trap. We do NOT assert pan/scroll
 * behavior here (manual-check, no Playwright).
 */
describe("TestimonialsCork (static fallback path)", () => {
  beforeEach(() => {
    stubMatchMedia(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders all 7 notes in the static grid", () => {
    const { container } = render(
      <TestimonialsCork testimonials={TESTIMONIALS} />,
    );
    expect(container.querySelectorAll("figure")).toHaveLength(7);
  });

  it("renders exactly one section heading with the anchor id", () => {
    const { container } = render(
      <TestimonialsCork testimonials={TESTIMONIALS} />,
    );
    const headings = container.querySelectorAll("h2#testimonios-title");
    expect(headings).toHaveLength(1);
  });

  it("keeps the anchor id on the board section and does not pin it", () => {
    const { container } = render(
      <TestimonialsCork testimonials={TESTIMONIALS} />,
    );
    const section = container.querySelector("section#testimonios");
    expect(section).not.toBeNull();
    // Static path uses the board-section--static modifier (no sticky pin).
    expect(section?.className).toContain("board-section--static");
  });

  it("lays the 7 notes out in literal 3 + 2 + 2 rows (no orphan)", () => {
    const { container } = render(
      <TestimonialsCork testimonials={TESTIMONIALS} />,
    );
    const rows = container.querySelectorAll(".board-grid__row");
    expect(rows).toHaveLength(3);
    const counts = Array.from(rows).map(
      (row) => row.querySelectorAll(".board-grid__cell").length,
    );
    expect(counts).toEqual([3, 2, 2]);
  });
});

/**
 * R11 (WCAG 2.4.3 / 2.4.7): on the desktop pan path each note is a keyboard
 * focus stop, and focusing one panned off-screen snaps the pan to it. We force
 * the pan branch (matchMedia → true) and assert the focus wiring + that a focus
 * event triggers a scroll-to via the mocked Lenis instance.
 */
describe("TestimonialsCork (desktop pan path, R11 keyboard reachability)", () => {
  beforeEach(() => {
    stubMatchMedia(true);
    lenisScrollTo.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("makes every note a keyboard focus stop in DOM order", () => {
    const { container } = render(
      <TestimonialsCork testimonials={TESTIMONIALS} />,
    );
    const cells = container.querySelectorAll(".board-track__cell");
    expect(cells).toHaveLength(7);
    cells.forEach((cell, i) => {
      expect(cell.getAttribute("tabindex")).toBe("0");
      expect(cell.getAttribute("aria-label")).toBe(
        `Testimonio ${i + 1} de 7`,
      );
    });
  });

  it("scrolls the focused note into view via the focus handler", () => {
    const { container } = render(
      <TestimonialsCork testimonials={TESTIMONIALS} />,
    );
    const spacer = container.querySelector<HTMLDivElement>(".board-pin-spacer");
    // jsdom reports 0 for layout boxes; give the spacer a non-zero travel so the
    // handler computes a target instead of bailing on `travel <= 0`.
    Object.defineProperty(spacer, "offsetHeight", {
      configurable: true,
      value: 4000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    const lastCell = container.querySelectorAll(".board-track__cell")[6];
    fireEvent.focus(lastCell);
    expect(lenisScrollTo).toHaveBeenCalledTimes(1);
    const [target] = lenisScrollTo.mock.calls[0];
    expect(typeof target).toBe("number");
    expect(target).toBeGreaterThan(0);
  });

  // v2 (ADR-3, hand intro retired): the pan runs during [tIn, tPanEnd] of the
  // spacer (clean zoom-in before, zoom-out after). The focus handler maps a
  // note's geometry-derived panPosition INTO that sub-range. By construction the
  // FIRST note is centred at the START of the pan (panPosition 0 → progress tIn)
  // and the LAST note at the END (panPosition 1 → progress tPanEnd). So the first
  // target lands in the early part of the spacer (past the zoom-in, well below
  // the end) and the last lands in the late part (before the closing zoom-out
  // tail). We assert ordering + phase-correct bounds.
  it("maps focus targets into the [tIn, tPanEnd] pan sub-range", () => {
    const { container } = render(
      <TestimonialsCork testimonials={TESTIMONIALS} />,
    );
    const spacer = container.querySelector<HTMLDivElement>(".board-pin-spacer");
    const TRAVEL = 4000;
    Object.defineProperty(spacer, "offsetHeight", {
      configurable: true,
      value: TRAVEL + 800,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    const cells = container.querySelectorAll(".board-track__cell");

    // First note → progress = tIn (start of pan): strictly > 0 (past nothing)
    // but within the first half (the zoom-in budget is the opening chunk).
    fireEvent.focus(cells[0]);
    const firstTarget = lenisScrollTo.mock.calls[0][0] as number;
    expect(firstTarget).toBeGreaterThan(0);
    expect(firstTarget).toBeLessThan(0.5 * TRAVEL);

    // Last note → progress = tPanEnd (end of pan): in the latter part of the
    // spacer but BEFORE the very end (the closing zoom-out tail comes after).
    lenisScrollTo.mockClear();
    fireEvent.focus(cells[6]);
    const lastTarget = lenisScrollTo.mock.calls[0][0] as number;
    expect(lastTarget).toBeGreaterThan(0.6 * TRAVEL);
    expect(lastTarget).toBeLessThan(TRAVEL);
    expect(lastTarget).toBeGreaterThan(firstTarget);
  });
});
