// Topic picker (cards in two scrollable rows, search, area filter) and the topic select in the sticky bar.
import { AREAS, CUSTOM, TOPICS } from "../data.js";
import { $, html, icon } from "../dom.js";
import { state } from "../state.js";
import { t, tr } from "../text.js";

const tagOf = (topic) =>
  topic.tag
    ? tr(topic.tag)
    : topic.kind === "custom"
      ? t("customTag")
      : topic.kind === "gain"
        ? t("gainTag")
        : topic.annual
          ? t("costTag")
          : t("lossTag");

const card = (topic, extraClass = "") =>
  html`<button
    type="button"
    class="pick${extraClass}"
    data-action="topic"
    data-id="${topic.id}"
    aria-pressed="${topic.id === state.topic}"
  >
    ${icon(topic.icon, "pi")}<span class="k ${topic.kind === "loss" ? "loss" : "gain"}">${tagOf(topic)}</span
    ><span class="t">${tr(topic.title)}</span><span class="s">${tr(topic.short)}</span>
  </button>`;

const row = (id, label, color, topics) =>
  html`<div class="pgroup">
    <div class="phead">
      <span class="dot" style="background:${color}"></span><span class="eyebrow">${t(label)}</span>
      <div class="arrows">
        ${[-1, 1].map(
          (dir) =>
            html`<button
              type="button"
              class="arrow"
              data-action="scroll-row"
              data-row="${id}"
              data-dir="${dir}"
              aria-label="${t(dir < 0 ? "prevL" : "nextL")}"
            >
              ${icon(dir < 0 ? "chevron-left" : "chevron-right")}
            </button>`,
        )}
      </div>
    </div>
    <div class="prow" id="${id}">${topics.map((topic) => card(topic))}</div>
  </div>`;

let builtFor = null; // rebuilding the cards is costly: only when language, search or area change
export function renderPicker() {
  const key = [state.lang, state.query, state.area].join("|");
  if (key === builtFor) {
    for (const b of $("picker").querySelectorAll(".pick")) b.setAttribute("aria-pressed", b.dataset.id === state.topic);
  } else {
    builtFor = key;
    const scroll = Object.fromEntries([...$("picker").querySelectorAll(".prow")].map((r) => [r.id, r.scrollLeft]));
    const q = state.query.trim().toLowerCase();
    const matches = (topic) =>
      (!q || `${tr(topic.title)} ${tr(topic.short)}`.toLowerCase().includes(q)) &&
      (!state.area || (state.area === "own" ? !topic.proposal : topic.area === state.area));
    const losses = TOPICS.filter((x) => x.kind === "loss" && matches(x)),
      gains = TOPICS.filter((x) => x.kind === "gain" && matches(x));
    $("pick-count").textContent = t("pickCount")(losses.length + gains.length);
    $("pick-area").innerHTML = html`<option value="">${t("allAreas")}</option>
      <option value="own">${t("ownTopics")}</option>
      ${Object.entries(AREAS).map(([id, area]) => html`<option value="${id}">${tr(area)}</option>`)}`;
    $("pick-area").value = state.area;
    $("picker").innerHTML =
      html`${losses.length ? row("prow-neg", "grpNeg", "var(--loss)", losses) : ""}${gains.length ? row("prow-pos", "grpPos", "var(--gain)", gains) : ""}${
        losses.length + gains.length ? "" : html`<p class="sub">${t("noMatch")}</p>`
      }
        <div class="pgroup">
          <div class="phead"><span class="eyebrow">${t("grpCustom")}</span></div>
          ${card(CUSTOM, " pick-custom")}
        </div>`;
    for (const r of $("picker").querySelectorAll(".prow")) {
      r.style.scrollBehavior = "auto";
      r.scrollLeft = scroll[r.id] || 0;
      r.style.scrollBehavior = "";
    }
  }
  renderTopicSelect();
}

let selectFor = null;
function renderTopicSelect() {
  if (selectFor !== state.lang) {
    selectFor = state.lang;
    const options = (list) => list.map((x) => html`<option value="${x.id}">${tr(x.title)}</option>`);
    const group = (label, list) => (list.length ? html`<optgroup label="${label}">${options(list)}</optgroup>` : "");
    $("sb-select").innerHTML = html`${group(
      t("grpNeg"),
      TOPICS.filter((x) => x.kind === "loss" && !x.proposal),
    )}${group(
      t("grpPos"),
      TOPICS.filter((x) => x.kind === "gain" && !x.proposal),
    )}${Object.entries(AREAS).map(([id, area]) =>
      group(
        `${t("moreProps")} · ${tr(area)}`,
        TOPICS.filter((x) => x.proposal && x.area === id),
      ),
    )}${group(t("grpCustom"), [CUSTOM])}`;
  }
  $("sb-select").value = state.topic;
}
