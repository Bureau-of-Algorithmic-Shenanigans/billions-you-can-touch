import { describe, expect, it } from "vitest";
import { BUCKETS, bucketOf, parseNum, wrapLabel } from "../../src/lib/pure.js";

describe("parseNum", () => {
  it.each([
    ["2,5", 2.5],
    ["2.5", 2.5],
    ["78.500", 78500],
    ["78.500,5", 78500.5],
    ["78,500.5", 78500.5],
    [" 1 250 € ", 1250],
    ["0,37", 0.37],
  ])("reads %s as %d", (input, expected) => {
    expect(parseNum(input)).toBe(expected);
  });

  it("returns NaN for empty input", () => {
    expect(parseNum("")).toBeNaN();
    expect(parseNum("   ")).toBeNaN();
  });
});

describe("bucketOf", () => {
  it("puts counts below 1 into the first range", () => {
    expect(bucketOf(0.4)).toBe(0);
  });
  it("uses one range per power of ten", () => {
    expect(bucketOf(1)).toBe(1);
    expect(bucketOf(9.9)).toBe(1);
    expect(bucketOf(10)).toBe(2);
    expect(bucketOf(999)).toBe(3);
  });
  it("caps very large counts at the last range", () => {
    expect(bucketOf(1e12)).toBe(BUCKETS - 1);
  });
});

describe("wrapLabel", () => {
  it("keeps short labels on one line", () => {
    expect(wrapLabel("438 Mio. × Döner", 40)).toEqual(["438 Mio. × Döner"]);
  });
  it("breaks before a detail in brackets", () => {
    expect(wrapLabel("405 × eine Runde für alle in Köln (438 Mio. Döner)", 36)).toEqual([
      "405 × eine Runde für alle in Köln",
      "(438 Mio. Döner)",
    ]);
  });
  it("breaks before a note", () => {
    expect(wrapLabel("0,04 × Flughafen BER · zu klein für diese Skala", 30)).toEqual([
      "0,04 × Flughafen BER",
      "· zu klein für diese Skala",
    ]);
  });
  it("never returns more than two lines and shortens the second", () => {
    const lines = wrapLabel("a b c d e f g h i j k l m n o p q r s t u v w x y z", 10);
    expect(lines).toHaveLength(2);
    expect(lines.every((l) => l.length <= 10)).toBe(true);
    expect(lines[1].endsWith("…")).toBe(true);
  });
});
