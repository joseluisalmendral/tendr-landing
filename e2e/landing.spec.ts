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

/** Read the choreography state of the first testimonial note. */
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
    const pin = css(".tw-note__pin");
    const tilt = css(".tw-note__tilt");
    const hard = css(".tw-note__shadow--hard");
    const soft = css(".tw-note__shadow--soft");
    return {
      pinOpacity: pin ? Number(pin.opacity) : null,
      tiltDeg: deg(tilt?.transform),
      hardOpacity: hard ? Number(hard.opacity) : null,
      softOpacity: soft ? Number(soft.opacity) : null,
    };
  });
}

test.describe("§5 testimonials pushpin (scroll-driven)", () => {
  test("note is pinned below center and unpinned after crossing it", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    // Absolute top of the highest note (the section's first pinned card).
    const noteTop = await page.evaluate(() => {
      const tops = [...document.querySelectorAll(".tw-note")].map(
        (n) => Math.round(n.getBoundingClientRect().top + window.scrollY),
      );
      return Math.min(...tops);
    });

    // 1) Note entering from the bottom of the viewport => still pinned.
    await settleScrollTo(page, noteTop - 800);
    const pinned = await readFirstNote(page);
    expect(pinned, "note state readable").not.toBeNull();
    expect(pinned!.pinOpacity, "pushpin visible while pinned").toBeGreaterThan(0.7);
    expect(Math.abs(pinned!.tiltDeg), "note tilted while pinned").toBeGreaterThan(1);
    expect(pinned!.hardOpacity, "hard shadow while pinned").toBeGreaterThan(0.7);

    // 2) Note risen above center => pushpin lifted, note straightened, soft shadow.
    await settleScrollTo(page, noteTop + 40);
    const unpinned = await readFirstNote(page);
    expect(unpinned!.pinOpacity, "pushpin lifted after crossing").toBeLessThan(0.3);
    expect(Math.abs(unpinned!.tiltDeg), "note straightened after crossing").toBeLessThan(0.6);
    expect(unpinned!.softOpacity, "soft shadow after crossing").toBeGreaterThan(0.7);
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
