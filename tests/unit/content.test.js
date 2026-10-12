import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { formulaValues, ASSUMPTIONS } from "../../src/lib/assumptions.js";
import { loadContent } from "../../src/lib/content.js";
import { compileFormula } from "../../src/lib/formula.js";

describe("the data in src/content", () => {
  const data = loadContent();
  const units = Object.values(data.slides).flat();

  it("loads and passes all checks", () => {
    expect(data.topics.length).toBeGreaterThan(10);
    expect(data.proposals.length).toBeGreaterThan(50);
    expect(units.length).toBeGreaterThan(100);
  });

  it.each(units.map((u) => [u.id, u]))("unit %s has a positive price", (id, u) => {
    const price = u.price !== undefined ? compileFormula(u.price).evaluate(formulaValues(ASSUMPTIONS)) : 1;
    expect(price).toBeGreaterThan(0);
  });

  it("every source link is unique", () => {
    const urls = [...data.sources, ...data.topics.flatMap((t) => t.sources), ...units.flatMap((u) => u.sources)].map(
      (s) => s.url,
    );
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("mistakes in data files are reported with file and field", () => {
  let dir;
  const copy = () => {
    dir = mkdtempSync(join(tmpdir(), "content-"));
    cpSync("src/content", dir, { recursive: true });
    return dir;
  };
  afterEach(() => dir && rmSync(dir, { recursive: true, force: true }));

  it("unknown icon", () => {
    const d = copy();
    writeFileSync(
      join(d, "topics/maut.yaml"),
      `icon: no-such-icon\nkind: loss\ntitle: { de: a, en: a }\nshort: { de: a, en: a }\ncontext: { de: a, en: a }\nestimates:\n  mid: { amount: 3 Mio., note: { de: a, en: a } }\n`,
    );
    expect(() => loadContent(d)).toThrow(/topics\/maut\.yaml:\n {2}icon: unknown icon "no-such-icon"/);
  });

  it("amount that is not a number", () => {
    const d = copy();
    writeFileSync(
      join(d, "topics/maut.yaml"),
      `icon: signpost\nkind: loss\ntitle: { de: a, en: a }\nshort: { de: a, en: a }\ncontext: { de: a, en: a }\nestimates:\n  mid: { amount: viel, note: { de: a, en: a } }\n`,
    );
    expect(() => loadContent(d)).toThrow(/estimates\.mid\.amount: expected an amount like .* \(not "viel"\)/);
  });

  it("topic file missing from topics.yaml", () => {
    const d = copy();
    cpSync(join(d, "topics/maut.yaml"), join(d, "topics/neu.yaml"));
    expect(() => loadContent(d)).toThrow(/topics\.yaml: add neu to the list/);
  });

  it("unknown name in a price formula", () => {
    const d = copy();
    writeFileSync(join(d, "units/time.yaml"), `- id: x\n  icon: clock\n  name: { de: x, en: x }\n  price: 2 * benzin\n`);
    expect(() => loadContent(d)).toThrow(/0\.price: unknown name benzin; formulas can use/);
  });

  it("unit id used twice", () => {
    const d = copy();
    writeFileSync(join(d, "units/time.yaml"), `- id: doener\n  icon: clock\n  name: { de: x, en: x }\n  price: 2\n`);
    expect(() => loadContent(d)).toThrow(/id "doener" is used twice/);
  });

  it("unknown profile tag", () => {
    const d = copy();
    writeFileSync(join(d, "units/time.yaml"), `- id: x\n  icon: clock\n  name: { de: x, en: x }\n  price: 2\n  for: [rentner]\n`);
    expect(() => loadContent(d)).toThrow(/0\.for\.0: Invalid option/);
  });
});

describe("JSON Schemas for editors", () => {
  it("are up to date (run pnpm schemas after changing src/lib/content.js)", async () => {
    const { readFileSync } = await import("node:fs");
    const { jsonSchemas } = await import("../../src/lib/content.js");
    for (const [file, json] of Object.entries(jsonSchemas()))
      expect(readFileSync(`src/content/schemas/${file}`, "utf8")).toBe(json);
  });
});
