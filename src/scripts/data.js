// The page data: topics, budget proposals and comparison units from src/content (validated at build time and embedded
// in the page as JSON by MainPage.astro), turned into the shapes the page works with.
import { compileFormula } from "../lib/formula.js";
import { I18N } from "../lib/i18n.js";
import { SLIDES } from "../lib/slides.js";
import { $ } from "./dom.js";

const DATA = JSON.parse($("app-data").textContent);
const both = (key, ...args) => {
  const pick = (lang) => (typeof I18N[lang][key] === "function" ? I18N[lang][key](...args) : I18N[lang][key]);
  return { de: pick("de"), en: pick("en") };
};
const hostOf = (url) => new URL(url).hostname.replace(/^www\./, "");

export const AREAS = DATA.areas;
// Empty lists are left out of the embedded JSON (see MainPage.astro).
const lists = (o, ...keys) => Object.assign(o, ...keys.map((k) => ({ [k]: o[k] ?? [] })));

// Budget proposals become topics: always yearly, one estimate, linked source.
const proposalTopic = (p) => {
  const area = AREAS[p.area],
    bn = p.amount / 1e9,
    less = p.type === "saving" || p.type === "revenue";
  return {
    id: `hl-${p.code}`,
    proposal: p,
    area: p.area,
    icon: area.icon,
    kind: less ? "gain" : "loss",
    annual: true,
    tag: { de: I18N.de.propTags[p.type], en: I18N.en.propTags[p.type] },
    title: typeof p.title === "string" ? { de: p.title, en: p.title } : p.title,
    short: { de: area.de, en: area.en },
    who: both("propSource", hostOf(p.source)),
    context: { de: I18N.de.propContext(area.de, bn, less, p.buildsOn), en: I18N.en.propContext(area.en, bn, less, p.buildsOn) },
    caveat: both("propCaveat"),
    estimates: { mid: { amount: p.amount, note: both("propNote") } },
    for: [],
    sources: [{ title: hostOf(p.source), url: p.source }],
  };
};

export const CUSTOM = {
  id: "custom",
  icon: "calculator",
  kind: "custom",
  title: both("customTitle"),
  short: both("customShort"),
  context: both("customContext"),
  estimates: {},
  for: [],
  sources: [],
};

/** All topics in picker order; the "own amount" topic comes last. */
export const TOPICS = [...DATA.topics.map((t) => lists(t, "for", "sources")), ...DATA.proposals.map(proposalTopic), CUSTOM];
const topicMap = new Map(TOPICS.map((t) => [t.id, t]));
export const topicById = (id) => topicMap.get(id);

/** Comparison units per slide; price is a compiled formula (assumptions can change), see units.js. */
export const SLIDE_UNITS = Object.fromEntries(
  SLIDES.map((s) => [
    s.id,
    DATA.slides[s.id].map((u) => ({
      ...lists(u, "for", "notFor", "sources"),
      slide: s.id,
      formula: u.price === undefined ? null : compileFormula(u.price),
    })),
  ]),
);
export const UNITS = Object.values(SLIDE_UNITS).flat();
const byId = new Map(UNITS.map((u) => [u.id, u]));
export const unitById = (id) => byId.get(id);

/** Sources for the box at the end: general ones, then those of the topics and units. */
export const SOURCES = [
  ...DATA.sources,
  ...TOPICS.filter((t) => !t.proposal).flatMap((t) => t.sources),
  ...UNITS.flatMap((u) => u.sources),
];
