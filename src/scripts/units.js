// Comparison units: prices (formulas, pencil edits, groups), how well they fit the visitor, and which ones a slide shows.
import { formulaValues } from "../lib/assumptions.js";
import { BUCKETS, bucketOf } from "../lib/pure.js";
import { NO_ANSWER, QUESTIONS } from "../lib/questions.js";
import { SLIDES } from "../lib/slides.js";
import { SLIDE_UNITS, TOPICS, topicById, unitById } from "./data.js";
import { state } from "./state.js";

// ---------- topics ----------

export const currentTopic = () => topicById(state.topic);
/** The estimate in use: the chosen one if the topic has it, otherwise the middle one. */
export const scenOf = (topic) => (topic.estimates[state.scen] ? state.scen : "mid");

/** The amount of the chosen topic in euros: one-off total, or yearly amount × chosen years. */
export function amount() {
  const topic = currentTopic();
  if (topic.kind === "custom") return state.custom * 1e9;
  const base = topic.estimates[scenOf(topic)].amount;
  return topic.annual ? base * state.years : base;
}

// Other topics as yardsticks ("Wie ließe sich das bezahlen?"). When the chosen topic is yearly, yearly topics are
// counted over the same number of years, so both sides compare like for like.
// Built once per chosen topic: `spanned` depends on it.
let topicUnitCache = { topic: null, units: [] };
export function topicUnits() {
  if (topicUnitCache.topic !== state.topic) {
    const spanned = !!currentTopic().annual;
    topicUnitCache = {
      topic: state.topic,
      units: TOPICS.filter((t) => t.kind !== "custom").map((t) => ({
        id: `topic:${t.id}`,
        topic: t,
        icon: t.icon,
        name: t.title,
        period: t.annual ? "year" : undefined,
        count: t.annual ? { de: "Jahre", en: "years" } : undefined,
        spanned: t.annual && spanned,
        for: t.for,
        notFor: [],
      })),
    };
  }
  return topicUnitCache.units;
}

/** A selection key ("doener" or "topic:masken") → unit. */
export function unitByKey(key) {
  if (key.startsWith("topic:")) return topicById(key.slice(6)) && topicUnits().find((u) => u.id === key);
  return unitById(key);
}

// ---------- prices ----------

/** Price without the visitor's pencil edit: formula, or the group size × the price of the item it is made of. */
export function defaultPrice(u) {
  if (u.topic) return u.topic.estimates[scenOf(u.topic)].amount * (u.spanned ? state.years : 1);
  if (u.formula) return u.formula.evaluate(formulaValues(state.assumptions, state.profile));
  return u.group.size * price(unitById(u.group.of));
}
/** Price per single item for groups ("per Döner" for a round for all of Köln), otherwise the price. */
export const defaultItemPrice = (u) => (u.group ? defaultPrice(u) / u.group.size : defaultPrice(u));
export const isEdited = (u) => state.prices[u.id] > 0 && Math.abs(state.prices[u.id] - defaultItemPrice(u)) > 0.005;
export function price(u) {
  if (!isEdited(u)) return defaultPrice(u);
  return u.group ? state.prices[u.id] * u.group.size : state.prices[u.id];
}
export const itemPrice = (u) => (u.group ? price(u) / u.group.size : price(u));
/** Sets (or clears, when back at the default) the visitor's price for a unit. */
export function setPrice(u, value) {
  if (Math.abs(value - defaultItemPrice(u)) > 0.005) state.prices[u.id] = value;
  else delete state.prices[u.id];
}
/** How many times the unit fits into the amount; monthly prices count for a whole year. */
export const countOf = (u, amt) => amt / (u.period === "month" ? price(u) * 12 : price(u));

// ---------- fit to the visitor ----------

const QUESTION_OF = Object.fromEntries(QUESTIONS.flatMap((q) => q.options.map((o) => [o.id, q])));
export const SHORT_LABEL = Object.fromEntries(QUESTIONS.flatMap((q) => q.options.map((o) => [o.id, o.short])));
export const answers = (q) => [].concat(state.profile[q.id] ?? []);
export const profileTags = () => new Set(QUESTIONS.flatMap(answers).filter((v) => v && !NO_ANSWER.has(v)));
/** The visitor's answers that make a unit fit, strongest first. */
export function reasons(u) {
  const tags = profileTags();
  return u.for.filter((x) => tags.has(x) && QUESTION_OF[x]).sort((a, b) => QUESTION_OF[b].weight - QUESTION_OF[a].weight);
}
/** Matching answers add their question's weight; each clear mismatch takes 4 away. */
export function score(u) {
  const tags = profileTags();
  return reasons(u).reduce((s, x) => s + QUESTION_OF[x].weight, 0) - 4 * u.notFor.filter((x) => tags.has(x)).length;
}

// ---------- which units a slide shows ----------

/** The same item (Döner, or a round of Döner for Köln) appears only once per slide. */
const itemKey = (u) => u.group?.of ?? u.id;

/**
 * Per amount, a slide shows one unit per count range (<1, 1–10, 10–100, …), the best fit for the visitor first;
 * ranges the pool cannot reach are filled up to 10 tiles with the units closest to an empty range.
 * Returns the units in ascending count.
 */
export function shownUnits(slideId, amt) {
  if (slideId === "topics") return topicTiles(amt).all;
  const items = SLIDE_UNITS[slideId].map((u, i) => ({ u, i, c: countOf(u, amt) })).map((x) => ({ ...x, b: bucketOf(x.c) }));
  const pick = [],
    used = new Set(),
    keys = new Set();
  for (let b = 0; b < BUCKETS; b++) {
    const cand = items
      .filter((x) => x.b === b && !used.has(x.i) && !keys.has(itemKey(x.u)))
      .sort((x, y) => score(y.u) - score(x.u) || x.i - y.i);
    if (cand[0]) {
      pick.push(cand[0]);
      used.add(cand[0].i);
      keys.add(itemKey(cand[0].u));
    }
  }
  const empty = [...Array(BUCKETS).keys()].filter((b) => !pick.some((x) => x.b === b));
  const distance = (x) => Math.min(...empty.map((b) => Math.abs(b - x.b)));
  const rest = items
    .filter((x) => !used.has(x.i))
    .sort((x, y) => score(y.u) - score(x.u) || distance(x) - distance(y) || x.i - y.i);
  while (pick.length < 10 && rest.length) {
    const x = rest.shift();
    if (keys.has(itemKey(x.u))) continue;
    pick.push(x);
    keys.add(itemKey(x.u));
  }
  return pick.sort((x, y) => x.c - y.c).map((x) => x.u);
}

export const TOPIC_LIMIT = 12;
/**
 * Topic yardsticks: first the opposite kind (ways to pay for a cost, or what a gain could pay for), at most 12 unless
 * expanded, then the same kind for comparison (without budget proposals). Both closest to "1 ×" first.
 */
export function topicTiles(amt) {
  const cost = currentTopic().kind !== "gain";
  const list = topicUnits().filter((u) => u.topic.id !== state.topic);
  const near = (a, b) => Math.abs(Math.log10(countOf(a, amt))) - Math.abs(Math.log10(countOf(b, amt)));
  const opposite = list.filter((u) => (u.topic.kind === "gain") === cost).sort(near);
  const same = list.filter((u) => (u.topic.kind === "gain") !== cost && !u.topic.proposal).sort(near);
  const shown = state.topMore ? opposite : opposite.slice(0, TOPIC_LIMIT);
  return { opposite: shown, same, total: opposite.length, all: [...shown, ...same] };
}

const ALL_SLIDES = [...SLIDES.map((s) => s.id), "topics"];
const selectable = (u) => !u.topic || (u.topic.id !== state.topic && !u.topic.proposal);

/** Every unit currently shown and selectable (for "Alle auswählen"). */
export const allShownKeys = (amt) =>
  ALL_SLIDES.flatMap((s) => shownUnits(s, amt))
    .filter(selectable)
    .map((u) => u.id);

/**
 * Default comparison: "griffig" tiles (13–999 times, the badge range): first the best fits for the visitor, then
 * round-robin across slides so the mix stays varied; at most 8.
 */
export function defaultSelection(amt) {
  const perSlide = ALL_SLIDES.map((s) =>
    shownUnits(s, amt).filter((u) => selectable(u) && countOf(u, amt) >= 13 && countOf(u, amt) < 1000),
  );
  const out = perSlide
    .flat()
    .filter((u) => score(u) > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 8);
  for (let r = 0; out.length < 8 && perSlide.some((l) => l.length > r); r++)
    for (const l of perSlide) if (l[r] && out.length < 8 && !out.includes(l[r])) out.push(l[r]);
  return out.map((u) => u.id);
}
