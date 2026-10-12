// "Für dich anpassen": the questionnaire, its summary when collapsed, and a live preview of fitting comparisons.
import { NO_ANSWER, QUESTIONS } from "../../lib/questions.js";
import { STATES } from "../../lib/reference.js";
import { UNITS } from "../data.js";
import { $, html } from "../dom.js";
import { state } from "../state.js";
import { fmt, t, tr } from "../text.js";
import { amount, answers, countOf, profileTags, score, topicUnits } from "../units.js";

export const answeredCount = () => QUESTIONS.filter((q) => answers(q).length).length;

/** Records an answer; the answer that completes the questionnaire collapses it (once). */
export function answer(questionId, value) {
  const q = QUESTIONS.find((x) => x.id === questionId),
    p = state.profile,
    before = answeredCount();
  if (q.single) p[q.id] = p[q.id] === value ? null : value;
  else if (value === "none") p[q.id] = answers(q).includes("none") ? [] : ["none"];
  else {
    const current = answers(q).filter((x) => x !== "none");
    p[q.id] = current.includes(value) ? current.filter((x) => x !== value) : [...current, value];
  }
  if (before < QUESTIONS.length && answeredCount() === QUESTIONS.length) p.collapsed = true;
}

function question(q) {
  const current = answers(q),
    p = state.profile;
  const options = q.options.map((o) => {
    const on = current.includes(o.id),
      pressed = q.single ? html`role="radio" aria-checked="${on}"` : html`aria-pressed="${on}"`;
    return html`<button
      type="button"
      class="qopt${NO_ANSWER.has(o.id) ? " qna" : ""}"
      data-action="answer"
      data-q="${q.id}"
      data-v="${o.id}"
      ${pressed}
    >
      ${tr(o.label)}
    </button>`;
  });
  let extra = "";
  if (q.extra === "state")
    extra = html`<label class="qextra"
      >${t("profState")}
      <select id="q-state">
        <option value="">–</option>
        ${STATES.map((s) => html`<option value="${s.code}" ${p.state === s.code ? " selected" : ""}>${s.name}</option>`)}
      </select></label
    >`;
  if (q.extra === "car" && p.move === "car")
    extra = html`<div class="qextra">
      <label
        >${t("profCons")}
        <input type="number" id="q-cons" min="2" max="30" step="0.1" value="${p.cons || state.assumptions.cons}" /></label
      ><label
        >${t("profTank")}
        <input type="number" id="q-tank" min="20" max="120" step="1" value="${p.tank || state.assumptions.tank}"
      /></label>
    </div>`;
  return html`<div class="q">
    <span class="ql" id="ql-${q.id}">${tr(q.label)}</span>
    <div class="qopts" role="${q.single ? "radiogroup" : "group"}" aria-labelledby="ql-${q.id}">${options}</div>
    ${extra}
  </div>`;
}

/** questions: false keeps the questionnaire as is, so an input being typed into keeps its focus. */
export function renderProfile({ questions = true } = {}) {
  const f = fmt(),
    answered = answeredCount(),
    collapsed = state.profile.collapsed && answered,
    tags = profileTags();
  $("qs").hidden = collapsed;
  $("prof-preview").hidden = collapsed || !tags.size;
  $("prof-done").hidden = collapsed || !answered;
  $("prof-sum").hidden = !collapsed;
  if (collapsed) {
    const parts = QUESTIONS.flatMap((q) =>
      answers(q)
        .filter((v) => !NO_ANSWER.has(v))
        .map((v) => tr(q.options.find((o) => o.id === v)?.label)),
    ).filter(Boolean);
    const st = STATES.find((s) => s.code === state.profile.state);
    if (st) parts.splice(3, 0, st.name);
    $("prof-sum-txt").textContent = parts.join(" · ") || t("profNone");
  } else if (questions) $("qs").innerHTML = html`${QUESTIONS.map(question)}`;

  // live preview: the best-fitting comparison units for the current amount (topic tiles count as fitting, too)
  const amt = amount(),
    fitting = UNITS.filter((u) => score(u) > 0);
  const best = fitting.toSorted((a, b) => score(b) - score(a)).slice(0, 4);
  const fittingTiles = fitting.length + topicUnits().filter((u) => score(u) > 0).length;
  $("prof-preview").innerHTML = best.length
    ? html`<span class="pv-l">${t("profPreview")}</span>${best.map(
        (u) =>
          html`<span class="pv"
              ><span class="ico l-${u.icon}" aria-hidden="true"></span><b>${f.big(countOf(u, amt))}</b> ${tr(u.name)}</span
            >`,
      )}`
    : "";
  $("prof-lede").textContent = tags.size ? t("profLede1")(fittingTiles) : t("profLede0");
  $("prof-reset").hidden = !answered;
}
