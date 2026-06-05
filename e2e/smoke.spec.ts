import { expect, test } from "@playwright/test";

/**
 * Post-build smoke checks (F9). Two assertions only, per the phase plan:
 *   1. The landing serves and renders its hero.
 *   2. The waitlist form completes a real submit end-to-end.
 *
 * In CI the suite runs against `next start` (production build) with the
 * Cloudflare Turnstile TEST keys (widget auto-passes) and a real Neon
 * DATABASE_URL injected as a repository secret, so check 2 exercises the
 * full Server Action → Drizzle → Postgres path.
 */

test("landing loads and renders the hero", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toBeVisible();
});

test("waitlist form submits and confirms signup", async ({ page }) => {
  await page.goto("/#waitlist");

  // Unique address per run so the assertion does not depend on DB state.
  const email = `smoke+${Date.now()}@example.com`;

  // Target the form controls by id: the page has decorative "Email" texts
  // (board doodles) that break label-based lookups in strict mode.
  await page.locator("#subscribe-email").fill(email);
  await page.locator("#subscribe-consent").check();

  // The submit button stays disabled until the Turnstile token arrives
  // (test site key resolves it automatically within a few seconds).
  const submit = page.getByRole("button", { name: "Apuntarme" });
  await expect(submit).toBeEnabled({ timeout: 15_000 });

  await submit.click();

  // Fresh email → success composition. Accept the duplicate copy too so a
  // same-millisecond retry never flakes the suite.
  await expect(
    page.getByText(/Estás dentro\.|Ya estabas en la lista\./),
  ).toBeVisible({ timeout: 15_000 });
});
