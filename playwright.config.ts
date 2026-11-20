import { defineConfig, devices } from "@playwright/test";
const preview = process.env.LOBO_E2E_PREVIEW === "1";
const port = 3217;
const baseURL = "http://127.0.0.1:" + port;
export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: preview ? "./test-results/preview" : "./test-results/production",
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 12_000 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run " + (preview ? "dev" : "start") + " -- --port " + port,
    url: baseURL,
    timeout: 120_000,
    env: {
      LOBO_LOCAL_PREVIEW: "1",
      LOBO_INDEXING: "0",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
