// Assumptions behind the comparisons. Visitors can change them in the sentences on the page; price formulas in
// src/content/units/*.yaml can use them by name (see CONTRIBUTING.md).
export const ASSUMPTIONS = {
  schoolBuild: 30, // construction cost per school, million €
  staff: 40, // employees per school
  staffCost: 78500, // employer cost per post, € per year
  tank: 50, // tank size, litres
  cons: 7.5, // fuel consumption, l/100 km
  price: 2.2, // petrol price, € per litre (Super E10)
  power: 0.37, // household electricity, € per kWh (BDEW 2026)
  grocery: 950, // groceries for a household, € per month
};

// Figures that follow the questionnaire answers (BBSR asking rents 2025, WG-Zimmer prices, household budgets).
export const RENT = { big: 980, town: 670, rural: 605, default: 780 }; // 70 m² flat, € per month
export const WG_ROOM = { big: 650, town: 510, rural: 400, default: 510 }; // room in a shared flat, € per month
export const HOUSEHOLDS = {
  alone: { grocery: 330, persons: 1 },
  wg: { grocery: 900, persons: 3 },
  partner: { grocery: 600, persons: 2 },
  kids: { grocery: 950, persons: 4 },
};
export const DEFAULT_HOUSEHOLD = "kids";

/** Names a price formula can use: the assumptions plus rent, wgRoom and persons from the questionnaire. */
export function formulaValues(assumptions, profile = {}) {
  return {
    ...assumptions,
    rent: RENT[profile.city] ?? RENT.default,
    wgRoom: WG_ROOM[profile.city] ?? WG_ROOM.default,
    persons: (HOUSEHOLDS[profile.home] ?? HOUSEHOLDS[DEFAULT_HOUSEHOLD]).persons,
  };
}
export const FORMULA_NAMES = Object.keys(formulaValues(ASSUMPTIONS));
