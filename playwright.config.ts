import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 60000,
  workers: 1,
  use: {
    channel: "msedge",
    headless: true,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5180",
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
  },
  reporter: "list",
});
