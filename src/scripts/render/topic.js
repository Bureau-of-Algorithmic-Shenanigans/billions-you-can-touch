// The chosen topic: amount, estimate and period controls, topic text and sources, sticky bar, "Dein Anteil".
import { TAX_SHARE, TAX_TOTAL } from "../../lib/reference.js";
import { $, html, raw } from "../dom.js";
import { SCENARIOS, state } from "../state.js";
import { currentTopic, scenOf } from "../units.js";
import { fmt, t, tr } from "../text.js";

/** The visitor's rough share as taxpayer, if they gave their income. */
export const myShare = (amt) => (TAX_SHARE[state.profile.income] ? (amt * TAX_SHARE[state.profile.income]) / TAX_TOTAL : null);

const yearsText = () => `${state.years} ${t("yearsUnit")[state.years === 1 ? 0 : 1]}`;
const band = (topic) => (topic.kind === "loss" ? "var(--band-loss)" : "var(--band-gain)");

export function renderScenarioButtons() {
  const topic = currentTopic();
  const buttons = SCENARIOS.filter((s) => topic.estimates[s]).map(
    (s) => html`<button type="button" data-action="scen" data-s="${s}" aria-pressed="${s === scenOf(topic)}">${t(s)}</button>`,
  );
  $("scen").innerHTML = $("sb-scen").innerHTML = html`${buttons}`;
}

export function renderTopic(amt) {
  const f = fmt(),
    topic = currentTopic(),
    custom = topic.kind === "custom",
    annual = !!topic.annual;
  const scenCount = Object.keys(topic.estimates).length;

  // controls (also mirrored in the sticky bar)
  $("scen-ctl").hidden = $("sb-scen").hidden = custom || scenCount < 2;
  $("years-ctl").hidden = $("sb-years-ctl").hidden = !annual;
  $("custom-ctl").hidden = $("sb-custom-ctl").hidden = !custom;
  $("years-out").textContent = $("sb-years-out").textContent = yearsText();
  $("years").value = $("sb-years").value = state.years;
  for (const id of ["custom", "sb-custom"]) if (document.activeElement !== $(id)) $(id).value = state.custom;
  $("scen-note").textContent = custom ? "" : tr(topic.estimates[scenOf(topic)].note);

  // amount
  $("amount-eyebrow").textContent = custom
    ? t("customEyebrow")
    : annual
      ? t(topic.kind === "gain" ? "gainEyebrow" : "costEyebrow")(state.years)
      : t("lossEyebrow");
  $("big").textContent = f.eur(amt);
  $("hero").style.setProperty("--band", band(topic));
  $("panels").className = `panels ${topic.kind === "loss" ? "loss" : "gain"}`;
  $("hero-use").className = `ico hero-icon l-${topic.icon}`;

  // sticky bar
  $("sb-use").className = `ico l-${topic.icon}`;
  $("stickybar").style.setProperty("--sb", band(topic));
  $("sb-select").value = state.topic;
  const kindTag = topic.kind === "gain" ? t("gainTag") : annual ? t("costTag") : t("lossTag");
  $("sb-m").textContent = custom
    ? t("customTag")
    : [kindTag.replace(/ pro Jahr| per year/, ""), scenCount > 1 ? t(scenOf(topic)) : null, annual ? yearsText() : null]
        .filter(Boolean)
        .join(" · ");
  $("sb-amt").textContent = f.eur(amt);

  // about the topic
  const setText = (id, text) => {
    $(id).textContent = text;
    $(id).hidden = !text;
  };
  setText("who", tr(topic.who));
  $("context").textContent = tr(topic.context);
  setText("caveat", tr(topic.caveat));
  const links = topic.proposal ? [{ title: t("srcLink"), url: topic.proposal.source }] : topic.sources;
  $("srclinks").hidden = !links.length;
  $("srclinks").innerHTML = html`${links.map((s) => html`<a href="${s.url}" target="_blank" rel="noopener">${s.title} ↗</a>`)}`;

  // the visitor's share as taxpayer (costs only)
  const share = myShare(amt);
  $("share").hidden = share === null || topic.kind === "gain";
  if (share !== null) $("share").innerHTML = html`${raw(t("shareTxt")(f.eurFine(share)))}<small>${t("shareNote")}</small>`;
}
