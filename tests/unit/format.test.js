import { describe, expect, it } from "vitest";
import { formatter, superscript } from "../../src/lib/format.js";

const de = formatter("de"),
  en = formatter("en");

describe("formatter", () => {
  it.each([
    [0.25, "0,25"],
    [3.21, "3,2"],
    [12.34, "12,3"],
    [135.4, "135"],
    [2.4e6, "2,4 Mio."],
    [24e6, "24 Mio."],
    [3.5e9, "3,5 Mrd."],
  ])("big(%s) = %s", (n, s) => expect(de.big(n)).toBe(s));

  it("money", () => {
    expect(de.eur(3.5e9)).toBe("3,5 Mrd. €");
    expect(en.eur(3.5e9)).toBe("€3.5 bn");
    expect(de.eur(12.5)).toBe("12,5 €");
    expect(de.eurFine(1234.5)).toBe("1.234,50\u00a0€"); // currency format: non-breaking space
  });

  it("time spans", () => {
    expect(de.daySpan(0.5)).toBe("12 Stunden");
    expect(de.daySpan(1)).toBe("1 Tag");
    expect(de.daySpan(90)).toBe("3 Monate");
    expect(en.daySpan(3652.5)).toBe("10 years");
    expect(de.timeSpan(1 / 365.25)).toMatchObject({ n: 24, word: "Stunden", unit: "hour" });
  });

  it("input values", () => {
    expect(de.inputValue(2.456)).toBe("2,46");
    expect(en.inputValue(2.456)).toBe("2.46");
  });

  it("superscript", () => expect(superscript(12)).toBe("¹²"));
});
