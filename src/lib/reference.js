// Reference figures for the illustrations on each slide (sources in src/content/sources.yaml).
const W = (de, en) => ({ de, en });

export const POPULATION = 83.6e6; // Destatis
export const SCHOOLS_DE = 32000; // general schools in Germany, rounded
export const KM = { earth: 40075, moonReturn: 768800, sun: 149.6e6, neptune: 4.5e9, voyager: 25e9, berlinMunich: 585 };
export const CONSTRUCTION_WORKER = 55000; // employer cost per year, €
export const TAX_TOTAL = 991e9; // tax revenue 2025 (BMF)
/** Rough income tax + VAT per year (tax class I) by income answer, for "Dein Anteil". */
export const TAX_SHARE = { i1: 900, i2: 4040, i3: 9250, i4: 19070, i5: 50600 };

// Places by population. schools: counted general schools where known (Destatis 2024/25, city statistics), otherwise
// estimated. Towns are shown next to Döner lifetimes and schools, cities next to households, all of them in tiles'
// "x for everyone in …" line from Frankfurt up.
export const PLACES = [
  { name: W("Helgoland", "Heligoland"), pop: 1.4e3 },
  { name: W("Sylt", "Sylt"), pop: 18e3 },
  { name: W("Garmisch-Partenkirchen", "Garmisch-Partenkirchen"), pop: 27e3 },
  { name: W("Tübingen", "Tübingen"), pop: 92e3 },
  { name: W("Göttingen", "Göttingen"), pop: 118e3 },
  { name: W("Freiburg", "Freiburg"), pop: 236e3 },
  { name: W("Leipzig", "Leipzig"), pop: 620e3, schools: 283 },
  { name: W("Frankfurt am Main", "Frankfurt"), pop: 775e3, schools: 211 },
  { name: W("Köln", "Cologne"), pop: 1.08e6, schools: 320 },
  { name: W("München", "Munich"), pop: 1.5e6, schools: 355 },
  { name: W("Hamburg", "Hamburg"), pop: 1.9e6, schools: 558 },
  { name: W("Berlin", "Berlin"), pop: 3.9e6, schools: 662 },
  { name: W("Bayern", "Bavaria"), pop: 13.4e6 },
  { name: W("NRW", "North Rhine-Westphalia"), pop: 18e6 },
  { name: W("Deutschland", "Germany"), pop: POPULATION, schools: 32836 },
  { name: W("der EU", "the EU"), pop: 450e6 },
  { name: W("der Welt", "the world"), pop: 8.1e9 },
];
export const TOWNS = PLACES.filter((p) => p.pop <= POPULATION);
export const CITIES = TOWNS.filter((p) => p.pop >= 100e3);
export const BIG_PLACES = PLACES.filter((p) => p.pop >= 700e3);

/** Schools in a place: counted, or estimated (big cities have larger schools: 1 per 4,200 people, otherwise 1 per 2,550). */
export const schoolsIn = (place) => place.schools ?? Math.max(1, Math.round(place.pop / (place.pop >= 500e3 ? 4200 : 2550)));

export const STATES = [
  ["BW", "Baden-Württemberg", 11.28e6],
  ["BY", "Bayern", 13.37e6],
  ["BE", "Berlin", 3.78e6],
  ["BB", "Brandenburg", 2.57e6],
  ["HB", "Bremen", 0.68e6],
  ["HH", "Hamburg", 1.89e6],
  ["HE", "Hessen", 6.39e6],
  ["MV", "Mecklenburg-Vorpommern", 1.63e6],
  ["NI", "Niedersachsen", 8.14e6],
  ["NW", "Nordrhein-Westfalen", 18.14e6],
  ["RP", "Rheinland-Pfalz", 4.16e6],
  ["SL", "Saarland", 0.99e6],
  ["SN", "Sachsen", 4.09e6],
  ["ST", "Sachsen-Anhalt", 2.19e6],
  ["SH", "Schleswig-Holstein", 2.95e6],
  ["TH", "Thüringen", 2.13e6],
].map(([code, name, pop]) => ({ code, name, pop }));

/** Routes for the Golf traffic jam, in km. */
export const ROUTES = [
  [35, W("Berlin–Potsdam", "Berlin–Potsdam")],
  [290, W("Berlin–Hamburg", "Berlin–Hamburg")],
  [585, W("Berlin–München", "Berlin–Munich")],
  [1000, W("Flensburg–Garmisch", "Flensburg–Garmisch")],
  [40075, W("einmal um die Erde", "once around the Earth")],
  [384400, W("die Strecke zum Mond", "the distance to the Moon")],
].map(([km, name]) => ({ km, name }));

/** Famous projects for the "Großprojekte" slide; the amounts come from these comparison units. */
export const PROJECTS = [
  { unit: "allianz-arena", name: W("Allianz Arena", "Allianz Arena") },
  { unit: "elbphilharmonie", name: W("Elbphilharmonie", "Elbphilharmonie") },
  { unit: "flughafen-ber", name: W("Flughafen BER", "BER airport") },
  { unit: "stuttgart-21", name: W("Stuttgart 21", "Stuttgart 21") },
];
