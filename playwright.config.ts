import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright e2e config for the Tendr landing.
 *
 * Scope: the scroll-driven motion that cannot be covered by unit tests
 * (CSS animation-timeline needs a real browser): the §5 testimonials pushpin
 * choreography and the wow #1 sticky-overlap regression guard.
 *
 * The webServer block boots the Next dev server on a dedicated port so the
 * suite is self-contained (`playwright test`). Chromium only: it is the engine
 * with full `animation-timeline` support, which is what these tests exercise.
 */
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 850 } },
    },
  ],
  webServer: {
    // CI runs against the production server (the build happens in a previous
    // workflow step); local runs keep the self-contained dev server.
    command: process.env.CI
      ? `pnpm exec next start -p ${PORT}`
      : `pnpm exec next dev -p ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
