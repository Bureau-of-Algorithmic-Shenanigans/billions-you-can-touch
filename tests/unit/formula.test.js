import { describe, expect, it } from "vitest";
import { compileFormula } from "../../src/lib/formula.js";

const value = (src, vars = {}) => compileFormula(src).evaluate(vars);

describe("compileFormula", () => {
  it.each([
    [8, 8],
    ["8", 8],
    ["2,5", 2.5],
    ["0.45", 0.45],
    ["243 Mio.", 243e6],
    ["3,5 Mrd.", 3.5e9],
    ["83,6 Mio.", 83.6e6],
    ["4,4 Bio.", 4.4e12],
    ["1.5 bn", 1.5e9],
    ["75 Tsd.", 75e3],
    ["2e6 * 800", 1.6e9],
    ["7 Mrd. / (14 * 365)", 7e9 / (14 * 365)],
    ["-(2 + 3) * 4", -20],
  ])("%s = %s", (src, expected) => expect(value(src)).toBe(expected));

  it("uses named values and reports them", () => {
    const f = compileFormula("49 Mio. * tank * price");
    expect([...f.names]).toEqual(["tank", "price"]);
    expect(f.evaluate({ tank: 50, price: 2 })).toBe(4.9e9);
  });

  it.each(["2 +", "(3", "3 power", "2 # 3", ""])("rejects %j", (src) => expect(() => compileFormula(src)).toThrow(/formula/));
});
