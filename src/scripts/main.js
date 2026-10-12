// Page script of the main page: restores the visitor's settings, renders, and handles input.
// Rendering lives in ./render, the numbers in ./units.js, the data in src/content (see CONTRIBUTING.md).
import { ASSUMPTIONS } from "../lib/assumptions.js";
import { parseNum } from "../lib/pure.js";
import { fitHeight, goSlide, initCarousel } from "./carousel.js";
import { unitById } from "./data.js";
import { $, busy, html, icon, perFrame } from "./dom.js";
import { renderChrome } from "./render/chrome.js";
import { renderCompare } from "./render/compare.js";
import { renderIllustrations } from "./render/illustrations.js";
import { answer, renderProfile } from "./render/profile.js";
import { renderTiles } from "./render/tiles.js";
import { renderTopic } from "./render/topic.js";
import { applyProfile, doneRestoring, restoreState, saveProfile, saveState, state } from "./state.js";
import { fmt, t, tr } from "./text.js";
import { allShownKeys, amount, defaultSelection, isEdited, itemPrice, setPrice, unitByKey } from "./units.js";

// ---------- rendering ----------

/** Everything that depends on the amount. */
function render() {
  const amt = amount();
  renderTopic(amt);
  renderIllustrations(amt);
  renderTiles(amt);
  renderCompare(amt);
  saveState();
  requestAnimationFrame(fitHeight);
}
function renderAll() {
  renderChrome();
  render();
}
const renderSoon = perFrame(render);

/** Any change to the amount (topic, estimate, years, own amount, assumptions) picks the default comparison again. */
function resetSelection() {
  state.sel = defaultSelection(amount());
  state.selBeforeAll = null;
}
/** Applies a change behind the busy overlay, then saves and redraws. */
const commit = (change, { reselect = true } = {}) =>
  busy(() => {
    change();
    if (reselect) resetSelection();
    renderAll();
  });

function selectTopic(id) {
  state.topic = id;
  history.replaceState(null, "", `#${id}`);
  resetSelection();
  renderAll();
}
function profileChanged({ questions }) {
  saveProfile();
  applyProfile();
  resetSelection();
  if (questions) renderAll();
  else {
    render();
    renderProfile({ questions: false });
  }
}
function toggleSelection(key) {
  const i = state.sel.indexOf(key);
  if (i >= 0) state.sel.splice(i, 1);
  else state.sel.push(key);
  render();
  document.querySelector(`.tile[data-key="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
}
function unselect(key) {
  state.sel = state.sel.filter((k) => k !== key);
  render();
}

/** Opens the price form in a tile (pencil). Prices are per single item for group tiles. */
function openPriceEdit(key) {
  const u = unitById(key),
    tile = document.querySelector(`.tile[data-key="${CSS.escape(key)}"]`);
  if (!u || !tile) return;
  const hint = u.group
    ? t("perItem")(tr(u.group.item))
    : u.period === "month"
      ? t("perMonth")
      : u.period === "year"
        ? t("perYear")
        : "";
  const priceLine = tile.querySelector(".pr");
  priceLine.innerHTML = html`<span class="pform" data-key="${key}"
    ><label class="vh" for="pf-in">${t("editPrice")}</label
    ><input
      id="pf-in"
      type="text"
      inputmode="decimal"
      enterkeyhint="done"
      autocomplete="off"
      value="${fmt().inputValue(itemPrice(u))}"
    /><span>€${hint}</span> <button type="button" class="pf-ok" data-action="price-save">${t("save")}</button>${
      isEdited(u)
        ? html`<button type="button" class="pf-reset" data-action="price-reset" title="${t("resetPrice")}">
            ${icon("rotate-ccw")}${t("resetPrice")}
          </button>`
        : ""
    }</span
  >`;
  const input = priceLine.querySelector("input");
  input.focus();
  input.select();
}
function savePrice(form) {
  const u = unitById(form.dataset.key),
    v = parseNum(form.querySelector("input").value);
  if (!(v > 0)) return;
  setPrice(u, v);
  renderAll();
}

// ---------- input ----------

// Buttons and tiles declare what they do with data-action (in main.html and the render templates).
const ACTIONS = {
  topic: (el) => busy(() => selectTopic(el.dataset.id)),
  scen: (el) => commit(() => (state.scen = el.dataset.s)),
  lang: (el) => commit(() => (state.lang = el.dataset.lang), { reselect: false }),
  "scroll-row": (el) => {
    const row = $(el.dataset.row);
    row.scrollBy({ left: +el.dataset.dir * Math.max(250, row.clientWidth * 0.8) });
  },
  slide: (el) => goSlide(+el.dataset.s),
  step: (el) => goSlide(state.slide + +el.dataset.dir),
  "top-more": () => commit(() => (state.topMore = !state.topMore), { reselect: false }),
  toggle: (el, e) => {
    if (!e.target.closest(".pform")) busy(() => toggleSelection(el.dataset.key));
  },
  "edit-price": (el) => openPriceEdit(el.dataset.key),
  "price-save": (el) => savePrice(el.closest(".pform")),
  "price-reset": (el) => {
    delete state.prices[el.closest(".pform").dataset.key];
    renderAll();
  },
  unselect: (el) => unselect(el.dataset.key),
  "select-all": () => {
    const all = allShownKeys(amount());
    if (all.every((k) => state.sel.includes(k))) {
      state.sel = state.selBeforeAll ?? defaultSelection(amount());
      state.selBeforeAll = null;
    } else {
      state.selBeforeAll = state.sel.slice();
      state.sel = all;
    }
    render();
  },
  "select-none": () => busy(() => ((state.sel = []), (state.selBeforeAll = null), render())),
  "reset-assumptions": () =>
    commit(() => {
      state.assumptions = { ...ASSUMPTIONS };
      state.editedAssumptions = {};
      applyProfile();
    }),
  "reset-prices": () => commit(() => (state.prices = {})),
  answer: (el) => {
    answer(el.dataset.q, el.dataset.v);
    busy(() => profileChanged({ questions: true }));
  },
  "profile-done": () => {
    state.profile.collapsed = true;
    saveProfile();
    renderProfile();
  },
  "profile-edit": () => {
    state.profile.collapsed = false;
    saveProfile();
    renderProfile();
    $("qs").querySelector("button")?.focus();
  },
  "profile-reset": () => {
    state.profile = {};
    saveProfile();
    applyProfile();
    resetSelection();
    renderAll();
  },
};

function bindInput() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (el) ACTIONS[el.dataset.action](el, e);
  });
  document.addEventListener("keydown", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    // Enter in a price form saves, Escape closes it; Enter in a sentence input applies the value
    const form = target.closest(".pform");
    if (form) {
      if (e.key === "Enter") (e.preventDefault(), savePrice(form));
      if (e.key === "Escape") (e.preventDefault(), render());
      return;
    }
    if (target.closest(".inl") && e.key === "Enter") return (e.preventDefault(), target.blur());
    // tiles and chart rows act like buttons
    const activate = e.key === "Enter" || e.key === " ";
    const tile = !target.closest(".pedit") && target.closest(".tile[data-key]");
    if (tile && activate) return (e.preventDefault(), toggleSelection(tile.dataset.key));
    const row = target.closest(".rowlab[data-key]");
    if (row && (activate || e.key === "Delete" || e.key === "Backspace")) return (e.preventDefault(), unselect(row.dataset.key));
  });
  // values typed into the sentences: assumptions (data-a) and tile prices (data-p)
  document.addEventListener("change", (e) => {
    const el = e.target.closest?.(".inl");
    if (!el) return;
    const v = parseNum(el.value);
    if (!(v > 0)) return render();
    if (el.dataset.a) {
      state.assumptions[el.dataset.a] = v;
      state.editedAssumptions[el.dataset.a] = true;
    } else if (el.dataset.p) setPrice(unitById(el.dataset.p), v);
    commit(() => {});
  });

  $("sb-select").onchange = (e) => busy(() => selectTopic(e.target.value));
  $("pick-q").oninput = (e) => {
    state.query = e.target.value;
    renderChrome();
  };
  $("pick-area").onchange = (e) => {
    state.area = e.target.value;
    renderChrome();
  };
  for (const id of ["years", "sb-years"])
    $(id).oninput = (e) => {
      state.years = +e.target.value;
      resetSelection();
      renderSoon();
    };
  for (const id of ["custom", "sb-custom"])
    $(id).oninput = (e) => {
      const v = parseFloat(e.target.value);
      if (v >= 0) {
        state.custom = v;
        resetSelection();
        renderSoon();
      }
    };
  // follow-up inputs of the questionnaire: Bundesland, fuel consumption, tank size
  $("qs").addEventListener("change", (e) => {
    if (e.target.id !== "q-state") return;
    state.profile.state = e.target.value || null;
    profileChanged({ questions: false });
  });
  $("qs").addEventListener("input", (e) => {
    const key = { "q-cons": "cons", "q-tank": "tank" }[e.target.id],
      v = parseFloat(e.target.value);
    if (key && v > 0) {
      state.profile[key] = v;
      profileChanged({ questions: false });
    }
  });
}

/** The sticky bar appears once the estimate/years controls have scrolled out above the viewport. */
function bindStickyBar() {
  const bar = $("stickybar"),
    anchor = $("controls");
  const set = (on) => {
    bar.classList.toggle("show", on);
    bar.setAttribute("aria-hidden", !on);
    bar.inert = !on;
  };
  const past = () => anchor.getBoundingClientRect().bottom < 0,
    check = () => set(past());
  check();
  new IntersectionObserver(check).observe(anchor);
  addEventListener("scroll", () => bar.classList.contains("show") !== past() && check(), { passive: true });
  addEventListener("load", check);
}

// ---------- start ----------

const restoredSelection = restoreState();
applyProfile();
state.sel = state.sel.filter((key) => unitByKey(key));
if (!restoredSelection) resetSelection();
bindInput();
bindStickyBar();
renderAll();
initCarousel();
doneRestoring();
