// Page parts that change with the language or the settings, not with the amount: texts, buttons, sources, footer.
import { SLIDES } from "../../lib/slides.js";
import { SOURCES, UNITS } from "../data.js";
import { $, html, icon } from "../dom.js";
import { state } from "../state.js";
import { t } from "../text.js";
import { isEdited } from "../units.js";
import { renderPicker } from "./picker.js";
import { renderProfile } from "./profile.js";
import { renderScenarioButtons } from "./topic.js";

let textsFor = null; // language the texts, links and sources are currently in
function renderTexts() {
  document.documentElement.lang = state.lang;
  document.title = t("title");
  if (textsFor === state.lang) return;
  textsFor = state.lang;
  for (const el of document.querySelectorAll("[data-i]")) {
    const text = t(el.dataset.i);
    if (typeof text === "string") el.textContent = text;
  }
  $("pick-q").placeholder = t("searchPh");
  $("prev").setAttribute("aria-label", t("prevL"));
  $("next").setAttribute("aria-label", t("nextL"));
  const base = document.documentElement.dataset.base || "/";
  for (const [id, key] of [
    ["f-imp", "imprint"],
    ["f-priv", "privacy"],
  ]) {
    const [label, path] = t(key);
    $(id).textContent = label;
    $(id).href = base + path;
  }
  $("sources").innerHTML = html`<p>${t("method")}</p>
    ${SOURCES.map((s) => html`<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>`)}`;
}

export function renderChrome() {
  renderTexts();
  for (const lang of ["de", "en"]) $(`lang-${lang}`).setAttribute("aria-pressed", state.lang === lang);
  renderPicker();
  renderScenarioButtons();
  $("a-reset").hidden = !Object.keys(state.editedAssumptions).length;
  const editedPrices = UNITS.filter(isEdited).length;
  $("p-reset").hidden = !editedPrices;
  $("p-reset").textContent = t("pReset")(editedPrices);
  renderProfile();
  $("chips").innerHTML = html`${t("slides").map(
    (name, i) =>
      html`<button type="button" class="chip" role="tab" data-action="slide" data-s="${i}" aria-selected="${i === state.slide}">
        ${icon(SLIDES[i].icon)}${name}
      </button>`,
  )}`;
}
