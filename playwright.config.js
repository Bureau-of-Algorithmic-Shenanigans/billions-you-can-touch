import { defineConfig, devices } from "@playwright/test";

// Runs against the built site (pnpm build first); desktop and phone, light and dark.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: { baseURL: "http://localhost:4321/billions-you-can-touch/", trace: "on-first-retry" },
  // --ignore-lock keeps Astro 7 in the foreground (it backgrounds itself when it detects an AI agent)
  webServer: { command: "pnpm preview --port 4321 --ignore-lock", url: "http://localhost:4321/billions-you-can-touch/", reuseExistingServer: !process.env.CI },
  projects: [
    { name: "desktop-light", use: { ...devices["Desktop Chrome"], colorScheme: "light" } },
    { name: "desktop-dark", use: { ...devices["Desktop Chrome"], colorScheme: "dark" } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
