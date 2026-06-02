import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // e2e/ holds Playwright specs (test:e2e); they must not be picked up by the
    // vitest (jsdom) unit runner or test.describe() throws.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
