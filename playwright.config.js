import { defineConfig, devices } from "@playwright/test";

// Runs against the built site (pnpm build first); desktop and phone, light and dark.
// Own port, so a dev server of another Astro project on the default 4321 does not get in the way.
const port = process.env.E2E_PORT || 4391;
const url = `http://localhost:${port}/billions-you-can-touch/`;
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: { baseURL: url, trace: "on-first-retry" },
  // --ignore-lock keeps Astro 7 in the foreground (it backgrounds itself when it detects an AI agent)
  webServer: { command: `pnpm preview --port ${port} --ignore-lock`, url, reuseExistingServer: !process.env.CI },
  projects: [
    { name: "desktop-light", use: { ...devices["Desktop Chrome"], colorScheme: "light" } },
    { name: "desktop-dark", use: { ...devices["Desktop Chrome"], colorScheme: "dark" } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
