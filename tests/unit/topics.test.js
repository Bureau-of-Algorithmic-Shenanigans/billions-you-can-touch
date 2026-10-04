import { describe, expect, it } from "vitest";
import { AREAS, ITEMS } from "../../src/data/topics.js";
import { ICONS } from "../../src/lib/icons.js";

describe("topics", () => {
  it("have unique ids", () => {
    const ids = ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(ITEMS.map((i) => [i.id, i]))("%s has texts in both languages and a known icon", (id, it) => {
    expect(it.title.de && it.title.en).toBeTruthy();
    expect(ICONS).toHaveProperty(it.icon.replace(/^l-/, ""));
  });

  it.each(ITEMS.filter((i) => i.kind !== "custom").map((i) => [i.id, i]))("%s has positive estimates", (id, it) => {
    const scen = Object.values(it.scen);
    expect(scen.length).toBeGreaterThan(0);
    for (const [amount, note] of scen) {
      expect(amount).toBeGreaterThan(0);
      expect(note.de && note.en).toBeTruthy();
    }
  });

  it("areas use known icons", () => {
    for (const [, , icon] of Object.values(AREAS)) expect(ICONS).toHaveProperty(icon);
  });
});
