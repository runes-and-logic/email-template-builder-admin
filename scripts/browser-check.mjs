import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(
  process.env.PLAYWRIGHT_PACKAGE || import.meta.url,
);
const { chromium } = require("playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto("http://localhost:3001");
  await page.getByRole("heading", { name: "Overview.", exact: true }).waitFor();
  await page.screenshot({ path: "/tmp/postcraft-desktop.png", fullPage: true, animations: "disabled" });
  await page.getByRole("link", { name: "Users", exact: true }).click();
  await page.getByLabel("Search records").fill("Olivia");
  await page
    .getByRole("button", { name: "View Olivia Rhye", exact: true })
    .click();
  await page.getByRole("button", { name: "Edit record", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("Olivia Demo");
  await page.getByLabel("Reason for change").fill("Browser smoke test");
  await page.getByRole("button", { name: "Confirm and save" }).click();
  await page.getByText("Olivia Demo", { exact: true }).waitFor();
  await page.reload();
  await page.getByLabel("Search records").fill("Olivia Demo");
  await page.getByText("Olivia Demo", { exact: true }).waitFor();
  await page.goto("http://localhost:3001/templates");
  await page.getByRole("button", { name: /The Sunday Edit/ }).click();
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await page.getByRole("button", { name: "Duplicate", exact: true }).click();
  await page.getByRole("heading", { name: "The Sunday Edit (copy)" }).waitFor();
  await page.goto("http://localhost:3001/integrations");
  await page.getByRole("button", { name: "Test demo" }).first().click();
  await page.getByText("Demo checked", { exact: true }).waitFor();
  await page.goto("http://localhost:3001");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector(".sidebar").getBoundingClientRect().right <= 0);
  await page.screenshot({ path: "/tmp/postcraft-mobile.png", fullPage: true, animations: "disabled" });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "No mobile horizontal overflow",
  );
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page
    .getByRole("link", { name: "System settings", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "General settings", exact: true })
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "Browser checks passed: dashboard, user edit persistence, template duplication, simulated integration, mobile navigation, no runtime errors.",
  );
} finally {
  await browser.close();
}
