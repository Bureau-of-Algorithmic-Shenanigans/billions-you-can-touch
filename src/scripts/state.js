// Everything the visitor can change, and its persistence in localStorage (only in their browser).
import { ASSUMPTIONS, HOUSEHOLDS } from "../lib/assumptions.js";
import { I18N } from "../lib/i18n.js";
import { SLIDES } from "../lib/slides.js";
import { TOPICS, CUSTOM, SLIDE_UNITS, UNITS, topicById } from "./data.js";

export const SCENARIOS = ["low", "mid", "high"];

export const state = {
  lang: "de",
  topic: "masken",
  scen: "mid",
  years: 1, // period for yearly topics
  custom: 1, // own amount, € bn
  sel: [], // unit ids in "Dein Vergleich" (topic tiles: "topic:<id>")
  selBeforeAll: null, // selection to return to after "Alle abwählen"
  slide: 0,
  query: "", // picker search
  area: "", // picker area filter
  topMore: false, // show all topic yardsticks
  assumptions: { ...ASSUMPTIONS },
  editedAssumptions: {}, // typed in by the visitor; win over values from the questionnaire
  prices: {}, // tile prices set with the pencil, by unit id (for groups: per single item)
  profile: {}, // questionnaire answers
};

/** Questionnaire answers set groceries, consumption and tank size, unless the visitor typed these in by hand. */
export function applyProfile() {
  const p = state.profile,
    a = state.assumptions,
    edited = state.editedAssumptions,
    car = p.move === "car";
  if (!edited.grocery) a.grocery = HOUSEHOLDS[p.home]?.grocery ?? ASSUMPTIONS.grocery;
  if (!edited.cons) a.cons = car && p.cons > 0 ? p.cons : ASSUMPTIONS.cons;
  if (!edited.tank) a.tank = car && p.tank > 0 ? p.tank : ASSUMPTIONS.tank;
}

// Stored under "milliarden-…"; the prototype used "steuerbeleg-…", which is read once and moved over.
function store(key) {
  const name = `milliarden-${key}`,
    old = `steuerbeleg-${key}`;
  return {
    get() {
      try {
        return JSON.parse(localStorage.getItem(name) ?? localStorage.getItem(old) ?? "null");
      } catch {
        return null;
      }
    },
    set(value) {
      try {
        localStorage.setItem(name, JSON.stringify(value));
        localStorage.removeItem(old);
      } catch {
        // storage unavailable (private mode, blocked): the page still works, it just forgets
      }
    },
  };
}
const STATE_STORE = store("state"),
  PROFILE_STORE = store("profile");

let restoring = true;
export function saveState() {
  if (restoring) return;
  const { lang, topic, scen, years, custom, sel, slide, editedAssumptions, prices } = state;
  const assumptions = Object.fromEntries(Object.keys(editedAssumptions).map((k) => [k, state.assumptions[k]]));
  STATE_STORE.set({ v: 3, lang, topic, scen, years, custom, sel, slide, assumptions, prices });
}
export const saveProfile = () => PROFILE_STORE.set(state.profile);

// Saved before data files existed (v2 and older): selection as "slide:index", prices by German unit name.
const LEGACY_TOPICS = TOPICS.filter((t) => t !== CUSTOM);
function migrateKey(key) {
  const m = /^(\w+):(\d+)$/.exec(String(key));
  if (!m) return key;
  if (m[1] === "topics") return LEGACY_TOPICS[+m[2]] && `topic:${LEGACY_TOPICS[+m[2]].id}`;
  const slide = SLIDES.find((s) => s.legacy === m[1]);
  return slide && SLIDE_UNITS[slide.id][+m[2]]?.id;
}
function migrate(saved) {
  if (saved.v === 3) return saved;
  const assumptions =
    saved.av === 2 && saved.A && saved.aedit ? Object.fromEntries(Object.keys(saved.aedit).map((k) => [k, saved.A[k]])) : {};
  const prices = Object.fromEntries(
    Object.entries(saved.prices ?? {})
      .map(([name, v]) => [UNITS.find((u) => u.name.de === name)?.id, v])
      .filter(([id]) => id),
  );
  return {
    ...saved,
    topic: saved.item,
    sel: Array.isArray(saved.sel) ? saved.sel.map(migrateKey).filter(Boolean) : undefined,
    assumptions,
    prices,
  };
}

/** Restores the last session; a #topic link wins over the stored topic. Returns whether a selection was restored. */
export function restoreState() {
  const profile = PROFILE_STORE.get();
  if (profile && typeof profile === "object") {
    if ("_closed" in profile) {
      profile.collapsed = profile._closed;
      delete profile._closed;
    }
    state.profile = profile;
  }
  const raw = STATE_STORE.get();
  const saved = raw && typeof raw === "object" ? migrate(raw) : {};
  if (I18N[saved.lang]) state.lang = saved.lang;
  if (topicById(saved.topic)) state.topic = saved.topic;
  if (SCENARIOS.includes(saved.scen)) state.scen = saved.scen;
  if (saved.years >= 1 && saved.years <= 10) state.years = saved.years;
  if (saved.custom >= 0) state.custom = saved.custom;
  if (Number.isInteger(saved.slide) && saved.slide > 0) state.slide = saved.slide;
  for (const [k, v] of Object.entries(saved.assumptions ?? {}))
    if (k in ASSUMPTIONS && v > 0) {
      state.assumptions[k] = v;
      state.editedAssumptions[k] = true;
    }
  for (const [id, v] of Object.entries(saved.prices ?? {})) if (v > 0) state.prices[id] = v;

  const hash = decodeURIComponent(location.hash.slice(1));
  const linked = topicById(hash) && hash !== saved.topic;
  if (topicById(hash)) state.topic = hash;
  const restoredSel = Array.isArray(saved.sel) && !linked;
  if (restoredSel) state.sel = saved.sel.filter((key) => typeof key === "string");
  return restoredSel;
}
export function doneRestoring() {
  restoring = false;
  saveState();
}
