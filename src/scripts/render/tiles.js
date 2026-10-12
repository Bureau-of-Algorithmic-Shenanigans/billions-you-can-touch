// Comparison tiles on the slides and the topic yardsticks ("Wie ließe sich das bezahlen?").
import { BIG_PLACES } from "../../lib/reference.js";
import { SLIDES } from "../../lib/slides.js";
import { $, html, icon } from "../dom.js";
import { state } from "../state.js";
import { fmt, t, tr } from "../text.js";
import {
  SHORT_LABEL,
  TOPIC_LIMIT,
  countOf,
  currentTopic,
  isEdited,
  price,
  reasons,
  scenOf,
  score,
  shownUnits,
  topicTiles,
  topicUnits,
} from "../units.js";

// Size classes: a fraction, a few, "griffig" (easy to grasp), thousands, millions
const tierOf = (c) => (c < 1 ? "frac" : c < 13 ? "few" : c < 1000 ? "fit" : c < 1e6 ? "thou" : "mega");

/** Drops a leading word from the name when the count word already says it ("Wochen" + "Wochen Wirtschaftsleistung"). */
function dedupeName(name, unitWord) {
  const u = unitWord.trim();
  if (!u) return name;
  const words = u.split(" ");
  for (const c of [u, words.at(-1), words[0]]) {
    if (!name.toLowerCase().startsWith(`${c.toLowerCase()} `)) continue;
    const rest = name
      .slice(c.length)
      .trim()
      .replace(/^of /i, "")
      .replace(/^\((.*)\)$/, "$1");
    if (!rest) return name;
    return state.lang === "en" ? rest[0].toUpperCase() + rest.slice(1) : rest;
  }
  return name;
}
const tileName = (u, unitWord) => (u.short && unitWord ? tr(u.short) : dedupeName(tr(u.name), unitWord));

/** Context line under the price: places and stadiums for big counts, or how long one a day/year would last. */
function contextLine(u, c, hints) {
  const f = fmt(),
    p = price(u);
  if (c >= 1) {
    if (hints.includes("daily") && p < 1000 && u.period !== "year")
      return [icon("calendar-days", "ci"), t("daily")(f.daySpan(c))];
    if (hints.includes("mine") && u.period === "month")
      return [icon("calendar-days", "ci"), t("mineOnly")(f.daySpan(c * 365.25))];
    if (hints.includes("yearly") && p < 200000) return [icon("calendar-days", "ci"), t("yearly")(f.daySpan(c * 365.25))];
  }
  const tier = tierOf(c);
  if (tier === "thou")
    return c >= 75000
      ? [icon("goal", "ci"), t("ctxStadium")(f.nf(c / 75000, c < 750000 ? 1 : 0))]
      : [icon("train-front", "ci"), t("ctxIce")(f.nf(c / 900, c < 9000 ? 1 : 0))];
  if (tier === "mega") {
    const place = BIG_PLACES.filter((p) => p.pop <= c).at(-1),
      per = c / place.pop;
    return [icon("map-pin", "ci"), t("ctxPlace")(f.nf(per, per < 10 ? 1 : 0), tr(place.name))];
  }
  return [];
}

function priceText(u) {
  const f = fmt(),
    p = price(u);
  if (u.spanned) return t("prSpan")(f.eur(p), state.years);
  if (u.priceNote) return tr(u.priceNote);
  return f.eur(p) + (u.period === "month" ? t("perMonth") : u.period === "year" ? t("perYear") : "");
}

function tile(u, amt, hints = [], kind = null) {
  const f = fmt(),
    c = countOf(u, amt),
    tier = tierOf(c),
    on = state.sel.includes(u.id);
  const countText = c < 1 ? f.nf(c, 2) : f.big(c);
  let number = u.spanned ? `${countText} ×` : countText;
  let word = u.spanned ? t("overYears")(state.years) : tr(u.count);
  if (word && Math.abs(c - 1) < 0.05) word = word.replace(/^Jahre\b/, "Jahr").replace(/^years\b/, "year");
  if (tier === "frac") {
    const pct = Math.max(c * 100, 0.1);
    number = `${f.nf(pct, pct < 1 ? 2 : pct < 10 ? 1 : 0)} %`;
    const ofYear = u.topic ? u.topic.annual : /^(Jahre|years)\b/.test(word);
    word = u.spanned ? t("fracOverYears")(state.years) : ofYear ? t("fracYear") : t("fracOf");
  }
  if (u.group) {
    if (c >= 1) number = `${f.big(c)} ×`;
    word = tr(u.group.label);
  }
  const ctx = u.group ? [] : contextLine(u, c, hints);
  const why =
    score(u) > 0
      ? html`<span class="foryou"
          >${t("forYou")} ·
          ${reasons(u)
            .slice(0, 2)
            .map((x) => tr(SHORT_LABEL[x]))
            .join(", ")}</span
        >`
      : "";
  const pill = kind
    ? html`<span class="kpill">${u.topic.tag ? tr(u.topic.tag) : kind === "gain" ? t("kGain") : t("kCost")}</span>`
    : "";
  const name = u.group ? `= ${f.big(c * u.group.size)} ${tr(u.group.item)}` : tileName(u, word);
  const priceLine = u.topic
    ? priceText(u)
    : html`${isEdited(u) ? html`<span class="pmod">${t("edited")}</span> ` : ""}${priceText(u)}<button
          type="button"
          class="pedit"
          data-action="edit-price"
          data-key="${u.id}"
          aria-label="${t("editPrice")}: ${tr(u.name)}"
          title="${t("editPrice")}"
        >
          ${icon("pencil")}
        </button>`;
  const kindAttrs = kind ? html` style="--kc:var(--${kind})"` : "";
  return html`<div
    class="tile ${tier}${on ? " sel" : ""}${kind ? ` ktile k${kind}` : ""}"
    data-action="toggle"
    data-key="${u.id}"
    role="button"
    tabindex="0"
    aria-pressed="${on}"
    title="${t("selTip")}"
    data-fit="${t("fit")}"
    ${kindAttrs}
  >
    <span class="vis"><span class="tvis">${icon(u.icon, "tic")}</span></span
    ><span class="pleg"></span><span class="c">${number}</span><span class="w">${word}</span
    ><span class="nm">${pill}${why}${name}</span><span class="pr">${priceLine}</span
    ><span class="ctx${ctx.length ? "" : " empty"}">${ctx}</span
    ><span class="selmark" aria-hidden="true">${icon(on ? "check" : "plus")}</span>
  </div>`;
}

// Only the visible slide and its neighbours are rebuilt on a change; the others are marked stale and rebuilt when the
// visitor gets there (renderNearSlides). This keeps DOM work and layout small.
const stale = new Set();
let lastAmount = 0;
const nearSlides = () => SLIDES.filter((_, i) => Math.abs(i - state.slide) <= 1);

function renderSlide(slide, amt) {
  stale.delete(slide.id);
  const units = shownUnits(slide.id, amt).sort((a, b) => score(b) - score(a));
  $(`tiles-${slide.id}`).innerHTML = html`${units.map((u) => tile(u, amt, slide.hints))}`;
}

export function renderTiles(amt) {
  lastAmount = amt;
  const near = nearSlides();
  for (const slide of SLIDES) near.includes(slide) ? renderSlide(slide, amt) : stale.add(slide.id);
  renderTopicTiles(amt);
}
/** After the visitor moved to another slide: build it (and its neighbours) if a change happened meanwhile. */
export function renderNearSlides() {
  if (lastAmount) for (const slide of nearSlides()) if (stale.has(slide.id)) renderSlide(slide, lastAmount);
}

function renderTopicTiles(amt) {
  const f = fmt(),
    topic = currentTopic(),
    cost = topic.kind !== "gain";
  const { opposite, same, total } = topicTiles(amt);
  const kindTile = (u) => tile(u, amt, [], u.topic.kind === "gain" ? "gain" : "loss");
  $("tiles-topics-a").innerHTML = html`${opposite.map(kindTile)}`;
  $("tiles-topics-b").innerHTML = html`${same.map(kindTile)}`;
  $("top-more").hidden = total <= TOPIC_LIMIT;
  $("top-more").textContent = state.topMore ? t("topLess") : t("topAll")(total);
  $("cmp-topics").querySelector("h2").textContent = cost ? t("topH_cost") : t("topH_gain");
  $("top-a-h").textContent = cost ? t("topAH_cost") : t("topAH_gain");
  $("top-a-sub").textContent = (cost ? t("topAS_cost") : t("topAS_gain")) + (topic.annual ? ` ${t("topSpan")(state.years)}` : "");
  $("top-b-h").textContent = cost ? t("topBH_cost") : t("topBH_gain");
  $("top-b-sub").textContent = t("topBS");

  // Example sentence: the topic that fits about ten times (by its plain estimate, without the years)
  const example = topicUnits()
    .filter((u) => u.topic.id !== state.topic)
    .map((u) => ({ u, c: amt / u.topic.estimates[scenOf(u.topic)].amount }))
    .sort((a, b) => Math.abs(Math.log10(a.c) - 1) - Math.abs(Math.log10(b.c) - 1))[0];
  const exampleText = example
    ? t("topEx")(
        tr(topic.title),
        f.eur(amt),
        example.u.topic.annual ? `${f.nf(example.c, 1)} ${t("topExYears")}` : `${f.nf(example.c, example.c < 10 ? 1 : 0)} ×`,
        tr(example.u.name),
      )
    : "";
  $("top-lede").textContent = t("topLede")(tr(topic.title), topic.kind === "custom" ? t("mid") : t(scenOf(topic)), exampleText);
  const kc = `section-head kc ${topic.kind === "loss" ? "loss" : "gain"}`;
  $("cmp-topics").className = $("cmp-sel").className = kc;
}
