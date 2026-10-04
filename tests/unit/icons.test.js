import { describe, expect, it } from "vitest";
import { ICONS, iconCss, iconSymbols } from "../../src/lib/icons.js";

describe("icons", () => {
  const names = Object.keys(ICONS);

  it("generates one mask class per icon", () => {
    const css = iconCss();
    for (const name of names) expect(css).toContain(`.l-${name}{--ic:url("data:image/svg+xml,`);
  });

  it("escapes the data URIs (a raw # would end the URL)", () => {
    const urls = iconCss().match(/url\("[^"]*"\)/g);
    expect(urls).toHaveLength(names.length);
    for (const url of urls) expect(url).not.toMatch(/[#<>]/);
  });

  it("generates one symbol per icon", () => {
    expect(iconSymbols().match(/<symbol id="l-[\w-]+"/g)).toHaveLength(names.length);
  });
});
