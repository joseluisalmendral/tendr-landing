import { test, expect, type Page } from "@playwright/test";

/**
 * e2e for the scroll-driven motion of the Tendr landing. These behaviours rely
 * on CSS `animation-timeline` and a real scroll, so they live here rather than
 * in the Vitest unit suite.
 *
 * Lenis smooth-scroll is active, so we drive the scroll with mouse-wheel bursts
 * and converge on a target instead of a single `window.scrollTo` (which Lenis
 * would fight). Assertions use generous tolerances to stay robust.
 */

/** Wheel toward an absolute scrollY until close enough, then let motion settle. */
async function settleScrollTo(page: Page, target: number) {
  for (let i = 0; i < 90; i++) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    if (Math.abs(y - target) < 35) break;
    const delta = Math.max(-650, Math.min(650, target - y));
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(260);
}

/** Read the held/tilted state of the first testimonial note. */
function readFirstNote(page: Page) {
  return page.evaluate(() => {
    const deg = (tf: string | undefined) => {
      const x = tf?.match(/matrix\(([^)]+)\)/);
      if (!x) return 0;
      const [a, b] = x[1].split(",").map(Number);
      return Math.round(Math.atan2(b, a) * (180 / Math.PI) * 100) / 100;
    };
    const note = document.querySelector(".tw-note");
    if (!note) return null;
    const css = (sel: string) => {
      const el = note.querySelector(sel);
      return el ? getComputedStyle(el) : null;
    };
    // The holder is a strip of washi tape (v2 board reinvention, ADR-3); the
    // .tw-note__pin class name is preserved as the structural hook.
    const tape = css(".tw-note__pin");
    // The resting tilt is applied to the moving unit (pan path: motion writes the
    // rest rotation here; static path: it lives on the lean layer). Read both and
    // take whichever carries the angle so the assertion is path-agnostic.
    const unit = css(".tw-note__unit");
    const lean = css(".tw-note__lean");
    const unitDeg = deg(unit?.transform);
    const leanDeg = deg(lean?.transform);
    const held = css(".tw-note__shadow--hard"); // exclusive note shadow, base on
    return {
      tapeOpacity: tape ? Number(tape.opacity) : null,
      tiltDeg: Math.abs(unitDeg) >= Math.abs(leanDeg) ? unitDeg : leanDeg,
      heldShadowOpacity: held ? Number(held.opacity) : null,
    };
  });
}

test.describe("§5 testimonials board — tape-held tilted notes (scroll-driven)", () => {
  test("note is tilted and held by tape while on the board", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    // Absolute top of the highest note (the section's first card on the board).
    const noteTop = await page.evaluate(() => {
      const tops = [...document.querySelectorAll(".tw-note")].map(
        (n) => Math.round(n.getBoundingClientRect().top + window.scrollY),
      );
      return Math.min(...tops);
    });

    // Bring the note into the viewport so its entrance has played and it rests on
    // the board: held by tape, tilted, carrying its exclusive note shadow.
    await settleScrollTo(page, noteTop - 800);
    const note = await readFirstNote(page);
    expect(note, "note state readable").not.toBeNull();
    expect(note!.tapeOpacity, "tape visible while held").toBeGreaterThan(0.7);
    expect(Math.abs(note!.tiltDeg), "note tilted while held").toBeGreaterThan(1);
    expect(
      note!.heldShadowOpacity,
      "exclusive note shadow present while held",
    ).toBeGreaterThan(0.7);
  });
});

test.describe("wow #1 sticky overlap (regression guard)", () => {
  test("hero does not overlap content after 'Cómo funciona'", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(400);

    // Scroll well past the overlap group (to the FAQ section).
    const faqTop = await page.evaluate(() => {
      const el = document.querySelector("#faq");
      return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 3000;
    });
    await settleScrollTo(page, faqTop);

    // The pinned hero must have scrolled away, not ghost over later sections.
    const heroBottom = await page.evaluate(() => {
      const el = document.querySelector(".wow-hero-pin");
      return el ? Math.round(el.getBoundingClientRect().bottom) : null;
    });
    expect(heroBottom, "hero pin rect measurable").not.toBeNull();
    expect(heroBottom!, "hero is no longer in the viewport").toBeLessThanOrEqual(0);
  });
});
