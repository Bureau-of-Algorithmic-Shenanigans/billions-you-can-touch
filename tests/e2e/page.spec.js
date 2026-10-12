import { expect, test } from "@playwright/test";

// Fail on any script error or console error while using the page.
test.beforeEach(async ({ page }, testInfo) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  testInfo.errors = errors;
});
// eslint-disable-next-line no-empty-pattern -- Playwright passes fixtures as the first argument
test.afterEach(async ({}, testInfo) => {
  expect(testInfo.errors, "no script or console errors").toEqual([]);
});

test("main page renders the default topic", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("Milliarden zum Anfassen");
  await expect(page.locator("#big")).toHaveText(/Mrd\. €/);
  await expect(page.locator("#tiles-everyday .tile")).toHaveCount(10);
});

test("every icon resolves to a shape", async ({ page }) => {
  await page.goto("./");
  // visit every slide so all tile sets are rendered
  for (const chip of await page.locator("#chips .chip").all()) await chip.click();
  const broken = await page.evaluate(() => [
    ...[...document.querySelectorAll(".ico")]
      .filter((el) => !getComputedStyle(el).getPropertyValue("--ic").includes("data:image/svg+xml"))
      .map((el) => el.className),
    ...[...document.querySelectorAll("use")]
      .map((u) => u.getAttribute("href"))
      .filter((href) => !document.querySelector(`symbol${href}`)),
  ]);
  expect(broken).toEqual([]);
});

test("switching topic updates amount and sticky header", async ({ page }) => {
  await page.goto("./");
  await page.locator('.pick[data-id="gorchfock"]').click();
  await expect(page.locator("#big")).toHaveText("135 Mio. €");
  await expect(page.locator("#sb-select")).toHaveValue("gorchfock");
});

test("inline values accept German decimals", async ({ page }) => {
  await page.goto("./");
  const price = page.locator('.inl[data-a="price"]');
  await price.fill("2,50");
  await price.press("Enter");
  await expect(page.locator('.inl[data-a="price"]')).toHaveValue("2,5");
  await expect(page.locator("#illus-mobility .dn-t2")).toContainText("125,00 €");
});

test("settings survive a reload", async ({ page }) => {
  await page.goto("./");
  await page.locator('.pick[data-id="cumex"]').click();
  // the change is applied behind the busy overlay, one frame later
  await expect(page.locator("#sb-select")).toHaveValue("cumex");
  await page.reload();
  await expect(page.locator("#sb-select")).toHaveValue("cumex");
});

test("settings saved by the prototype are moved to the new key", async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("steuerbeleg-state", JSON.stringify({ item: "cumex" }));
  });
  await page.reload();
  await expect(page.locator("#sb-select")).toHaveValue("cumex");
  const keys = await page.evaluate(() => Object.keys(localStorage).sort());
  expect(keys).toContain("milliarden-state");
  expect(keys).not.toContain("steuerbeleg-state");
});

test("settings saved by an older version are migrated", async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => {
    localStorage.clear();
    // v2: selection as "slide:index", prices by German unit name, edited assumptions in A/aedit
    localStorage.setItem(
      "milliarden-state",
      JSON.stringify({
        item: "cumex",
        sel: ["every:0", "pub:0"],
        prices: { Döner: 10 },
        A: { price: 2.5 },
        aedit: { price: true },
        av: 2,
      }),
    );
  });
  await page.reload();
  await expect(page.locator("#sb-select")).toHaveValue("cumex");
  await expect(page.locator("#sel-chips .selchip")).toHaveText(["Döner", "Lehrkraft"]);
  await expect(page.locator('.inl[data-p="doener"]')).toHaveValue("10");
  await expect(page.locator('.inl[data-a="price"]')).toHaveValue("2,5");
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("milliarden-state")));
  expect(saved).toMatchObject({
    v: 3,
    topic: "cumex",
    sel: ["doener", "lehrkraft"],
    prices: { doener: 10 },
    assumptions: { price: 2.5 },
  });
});

test("a price set with the pencil applies to group tiles of the same item", async ({ page }) => {
  await page.goto("./#masken");
  const group = page.locator('.tile[data-key="doener-eu"] .pr');
  await expect(group).toContainText("3,6 Mrd. €");
  await page.locator('.inl[data-p="doener"]').fill("10");
  await page.locator('.inl[data-p="doener"]').press("Enter");
  await expect(group).toContainText("4,5 Mrd. €");
  await expect(page.locator("#p-reset")).toBeVisible();
});

test("page never scrolls sideways", async ({ page }) => {
  await page.goto("./");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

for (const [path, heading, address] of [
  ["impressum/", "Impressum", "80333 München"],
  ["datenschutz/", "Datenschutzerklärung", "GitHub Pages"],
  ["en/imprint/", "Imprint", "80333 München"],
  ["en/privacy/", "Privacy Policy", "GitHub Pages"],
]) {
  test(`legal page ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveText(heading);
    await expect(page.locator("main")).toContainText(address);
  });
}

test("footer links follow the language", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("#f-imp")).toHaveAttribute("href", "/billions-you-can-touch/impressum/");
  await page.locator("#lang-en").click();
  await expect(page.locator("#f-imp")).toHaveAttribute("href", "/billions-you-can-touch/en/imprint/");
});

test("screenshot for review", async ({ page }, testInfo) => {
  await page.goto("./");
  await testInfo.attach("full-page", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});
