// The comparison slides, in page order. Each has a data file src/content/units/<id>.yaml with its comparison units.
// hints: which context line a tile may get below its price —
//   daily: "Jeden Tag eins: … lang" (cheap one-off items), mine: "Nur für dich" (monthly costs),
//   yearly: "Jedes Jahr eins: … lang" (purchases).
export const SLIDES = [
  { id: "everyday", legacy: "every", icon: "sandwich", hints: ["daily"] },
  { id: "monthly", legacy: "month", icon: "calendar", hints: ["mine"] },
  { id: "purchases", legacy: "buy", icon: "shopping-bag", hints: ["yearly"] },
  { id: "mobility", legacy: "car", icon: "fuel", hints: ["daily", "yearly"] },
  { id: "public", legacy: "pub", icon: "school", hints: [] },
  { id: "projects", legacy: "big", icon: "construction", hints: [] },
  { id: "time", legacy: "life", icon: "user", hints: [] },
];
