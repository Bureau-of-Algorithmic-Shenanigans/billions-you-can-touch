// The lead illustration of each slide: a headline comparison with editable assumptions, a personal line and bars
// against real places. Prices come from the comparison units, so a pencil edit (e.g. the Döner price) applies here too.
import { DEFAULT_HOUSEHOLD, HOUSEHOLDS } from "../../lib/assumptions.js";
import { TIME_UNITS, secondsOf, superscript } from "../../lib/format.js";
import {
  CITIES,
  CONSTRUCTION_WORKER,
  KM,
  POPULATION,
  PROJECTS,
  ROUTES,
  SCHOOLS_DE,
  STATES,
  TOWNS,
  schoolsIn,
} from "../../lib/reference.js";
import { unitById } from "../data.js";
import { $, html, icon, raw } from "../dom.js";
import { state } from "../state.js";
import { fmt, t, tr } from "../text.js";
import { currentTopic, price } from "../units.js";
import { myShare } from "./topic.js";

const priceOf = (id) => price(unitById(id));
const household = () => HOUSEHOLDS[state.profile.home] ?? HOUSEHOLDS[DEFAULT_HOUSEHOLD];
const myState = () => STATES.find((s) => s.code === state.profile.state);

/** Editable number inside a sentence: an assumption (data-a) or a tile price (data-p). */
function inlineInput(attr, value, label, title) {
  const v = fmt().inputValue(value);
  return html`<input
    class="inl"
    type="text"
    inputmode="decimal"
    enterkeyhint="done"
    autocomplete="off"
    spellcheck="false"
    ${raw(attr)}
    value="${v}"
    aria-label="${label}"
    title="${title}"
    style="width:calc(${v.length}ch + 1.2em)"
  />`;
}
const assumptionInput = (key) => {
  const [label, hint] = t("a")[key] ?? ["", ""];
  return inlineInput(`data-a="${key}"`, state.assumptions[key], label, `${label} · ${hint}`);
};
const priceInput = (unitId) => {
  const u = unitById(unitId);
  return inlineInput(`data-p="${unitId}"`, price(u), `${t("editPrice")}: ${tr(u.name)}`, t("editPrice"));
};

/** Horizontal bars; the highlighted row is this amount. */
function bars(rows) {
  rows.sort((a, b) => b.v - a.v);
  const max = Math.max(...rows.map((r) => r.v)),
    hi = (r) => (r.hi ? " hi" : "");
  return html`<div class="hb">
    ${rows.map(
      (r) =>
        html`<span class="lb${hi(r)}">${r.label}</span>
          <div class="tr"><div class="fl${hi(r)}" style="width:${(r.v / max) * 100}%"></div></div>
          <span class="vv${hi(r)}">${r.txt}</span>`,
    )}
  </div>`;
}
const placeRows = (places, value) => {
  const f = fmt();
  return [...places.filter((p) => p.pop <= value).slice(-1), ...places.filter((p) => p.pop > value).slice(0, 2)]
    .slice(0, 3)
    .map((p) => ({ label: tr(p.name), v: p.pop, txt: f.big(p.pop) }));
};

/** Shared lead block: icon, headline and recipe, the result as "= N unit", a personal line, a note, then extras. */
const lead = ({ icon: ic, visual, title, recipe, n, unit, mine, sub, extra = "" }) =>
  html`<div class="dn">
      ${visual ?? icon(ic, "dn-ic")}<span class="dn-t1">${title}</span><span class="dn-t2">${raw(recipe)}</span>
    </div>
    <div class="dn-res"><span class="dn-eq">=</span><span class="dn-n">${n}</span><span class="dn-u">${unit}</span></div>
    ${mine ? html`<p class="dn-daily">${raw(mine)}</p>` : ""}${sub ? html`<p class="sub">${raw(sub)}</p>` : ""}${extra}`;

// Everyday: a Döner a day, in lifetimes; bars: people who could eat one every day of their life, next to towns
function everyday(amt, f) {
  const dp = priceOf("doener"),
    years = amt / dp / 365,
    lives = years / 81;
  const km = ((amt / dp) * 0.25) / 1000,
    earth = km / KM.earth;
  return lead({
    icon: "sandwich",
    title: t("dnT1"),
    recipe: t("dnT2")(priceInput("doener"), f.nf(365 * 81)),
    n: f.big(lives >= 1 ? lives : years),
    unit: lives >= 1 ? t("lives") : t("years2"),
    mine: t("dnLen")(
      f.big(km),
      earth >= 1 ? t("timesAround")(f.nf(earth, earth < 10 ? 1 : 0)) : t("pctAround")(f.nf(earth * 100, earth < 0.1 ? 1 : 0)),
    ),
    sub: t("dnT3")(lives >= 1 ? 1 : 0),
    extra:
      lives >= 1
        ? bars([
            { label: t("dnBar"), v: lives, txt: `${f.big(lives)} ${t("people")}`, hi: 1 },
            ...placeRows(TOWNS, lives).slice(0, 3),
          ])
        : "",
  });
}

// Per year: a year of groceries for households like the visitor's, next to cities
function monthly(amt, f) {
  const words = t("hhWords")[state.profile.home] ?? t("hhWords")[DEFAULT_HOUSEHOLD],
    persons = household().persons;
  const households = amt / (state.assumptions.grocery * 12),
    people = households * persons;
  const refs = placeRows(CITIES, people),
    st = myState();
  if (st) refs.push({ label: `${st.name} (${t("myState")})`, v: st.pop, txt: f.big(st.pop) });
  const germanyDays = amt / ((POPULATION * (state.assumptions.grocery / persons) * 12) / 365.25);
  return lead({
    icon: "shopping-cart",
    title: t("mT1"),
    recipe: t("mT2")(assumptionInput("grocery"), words[2]),
    n: f.big(households),
    unit: words[1],
    mine: t("mAll")(f.daySpan(germanyDays)),
    sub: t("illMonth")(words[2]),
    extra: bars([{ label: t("you"), v: people, txt: `${f.big(people)} ${t("people")}`, hi: 1 }, ...refs]),
  });
}

// Petrol: one full tank; the personal line depends on how the visitor gets around
function mobility(amt, f) {
  const a = state.assumptions,
    fill = a.tank * a.price,
    fills = amt / fill,
    litres = fills * a.tank;
  const fare = priceOf("deutschlandticket"),
    full = priceOf("deutschlandticket-mit-zuschuss");
  const sub = {
    transit: () => t("illCarTransit")(f.big(amt / (full * 12)), f.big(amt / (fare * 12)), f.eur(full - fare)),
    bike: () => t("illCarBike")(f.big(amt / priceOf("neues-fahrrad")), f.big(amt / priceOf("kilometer-radweg"))),
    car: () => t("illCarCar")(f.nf(a.cons, 1), f.nf(a.tank)),
  }[state.profile.move];
  return lead({
    icon: "fuel",
    title: t("cT1"),
    recipe: t("cT2")(
      assumptionInput("tank"),
      assumptionInput("price"),
      f.eurFine(fill),
      assumptionInput("cons"),
      assumptionInput("power"),
    ),
    n: f.big(fills),
    unit: t("cU"),
    mine: t("cFuel")(f.big(litres), f.big(litres / 2.5e6), f.big((litres * 2.37) / 1000)),
    sub: sub ? sub() : "",
  });
}

// Purchases: new Golfs bumper to bumper (7 m each), against known routes
function purchases(amt, f) {
  const gp = priceOf("vw-golf"),
    golfs = amt / gp,
    jam = golfs * 0.007,
    tons = golfs * 1.3;
  const route = ROUTES.filter((r) => r.km <= jam).at(-1) ?? ROUTES[0],
    next = ROUTES[ROUTES.indexOf(route) + 1];
  return lead({
    icon: "car",
    title: t("bT1"),
    recipe: t("bT2")(priceInput("vw-golf")),
    n: f.big(jam),
    unit: t("jam"),
    mine: t("bWeight")(f.big(tons), f.nf(tons / 10100, tons / 10100 < 10 ? 1 : 0)),
    sub: t("illBuy")(`${f.nf(jam / route.km, jam / route.km < 10 ? 1 : 0)} ×`, tr(route.name)),
    extra: bars([
      { label: t("jamLbl"), v: jam, txt: `${f.big(jam)} km`, hi: 1 },
      ...[route, next].filter(Boolean).map((r) => ({ label: tr(r.name), v: r.km, txt: `${f.big(r.km)} km` })),
    ]),
  });
}

// Public: new schools (construction only), with a school's yearly staff as the running-cost alternative
function publicSlide(amt, f) {
  const a = state.assumptions,
    schools = amt / (a.schoolBuild * 1e6),
    pct = (schools / SCHOOLS_DE) * 100;
  const est = TOWNS.map((p) => ({
    label: t("schoolsIn")(tr(p.name)),
    v: schoolsIn(p),
    txt: (p.schools ? "" : "≈ ") + f.big(schoolsIn(p)),
  }));
  const refs = [...est.filter((x) => x.v <= schools).slice(-2), ...est.filter((x) => x.v > schools).slice(0, 2)];
  const st = myState();
  if (st) {
    const v = Math.round(st.pop / 2550);
    refs.push({ label: `${t("schoolsIn")(st.name)} (${t("myState")})`, v, txt: `≈ ${f.big(v)}` });
  }
  return lead({
    icon: "school",
    title: t("pT1"),
    recipe: t("pT2")(assumptionInput("schoolBuild")),
    n: f.big(schools),
    unit: t("schoolsW")[1],
    mine: t("pStaff")(f.big(amt / (a.staff * a.staffCost)), assumptionInput("staff"), assumptionInput("staffCost")),
    sub: t("illPub")(f.nf(pct, pct < 1 ? 2 : 1), f.big(schools * 500)),
    extra: bars([{ label: t("newSchools"), v: schools, txt: f.big(schools), hi: 1 }, ...refs]),
  });
}

// Megaprojects: the closest famous project
function projects(amt, f) {
  const list = PROJECTS.map((p) => ({ ...p, cost: priceOf(p.unit) }));
  const near = list.toSorted((a, b) => Math.abs(Math.log(amt / a.cost)) - Math.abs(Math.log(amt / b.cost)))[0],
    r = amt / near.cost;
  return lead({
    icon: "construction",
    title: tr(near.name),
    recipe: t("gT2")(f.eur(near.cost)),
    n: `${f.nf(r, r < 10 ? 1 : 0)} ×`,
    unit: tr(near.name),
    mine: t("gJobs")(f.big(amt / CONSTRUCTION_WORKER)),
    extra: bars([
      { label: t("you"), v: amt, txt: f.eur(amt), hi: 1 },
      ...list.map((p) => ({ label: tr(p.name), v: p.cost, txt: f.eur(p.cost) })),
    ]),
  });
}

// Per person & time: how long the federal budget needs to spend it; a ring in the icon slot fills up to the next unit
function time(amt, f) {
  const budget = priceOf("bundeshaushalt-2026"),
    secs = (amt / budget) * secondsOf("year"),
    span = f.timeSpan(amt / budget);
  let i = TIME_UNITS.map((u) => secs / secondsOf(u) >= 1).lastIndexOf(true);
  if (i === span.index && i > 0) i--;
  if (i < 0) i = 0;
  const unit = TIME_UNITS[i],
    n = secs / secondsOf(unit),
    word = t("timeWords")[unit][Math.round(n * 10) === 10 ? 0 : 1];
  const pct = Math.min(100, (secs / secondsOf(TIME_UNITS[Math.min(i + 1, TIME_UNITS.length - 1)])) * 100);
  const ring = html`<div class="bigring dn-ic" style="--pct:${pct}%">
    <span>${f.nf(n, n < 10 ? 1 : 0)}<small style="display:block;font-size:.7rem;font-weight:600">${word}</small></span>
  </div>`;
  const share = myShare(amt);
  return lead({
    visual: ring,
    title: t("lT1"),
    recipe: t("lT2"),
    n: f.nf(span.n),
    unit: span.word,
    mine:
      share !== null && currentTopic().kind !== "gain"
        ? t("lMineShare")(f.eurFine(share))
        : t("lMineHead")(f.eurFine(amt / POPULATION)),
  });
}

const SLIDE_ILLUSTRATIONS = { everyday, monthly, purchases, mobility, public: publicSlide, projects, time };

export function renderIllustrations(amt) {
  const f = fmt();
  for (const [slide, draw] of Object.entries(SLIDE_ILLUSTRATIONS)) $(`illus-${slide}`).innerHTML = draw(amt, f);
  const a = state.assumptions,
    km = (amt / (a.tank * a.price)) * ((a.tank / a.cons) * 100);
  $("t-earth").textContent = f.big(km / KM.earth);
  $("t-moon").textContent = f.big(km / KM.moonReturn);
  $("t-sun").textContent = f.big(km / KM.sun);
  drawDistance(km, f);
}

/** Log scale from 100 km to 10¹² km with landmarks, and how far the fuel would take one car. */
function drawDistance(km, f) {
  const svg = $("dist"),
    marks = t("marks"),
    x0 = 40,
    x1 = 920,
    lo = 2,
    hi = 12;
  const X = (v) => x0 + ((Math.log10(Math.max(v, 10 ** lo)) - lo) / (hi - lo)) * (x1 - x0);
  const ticks = [];
  for (let p = lo; p <= hi; p++)
    ticks.push(
      html`<line x1="${X(10 ** p)}" y1="86" x2="${X(10 ** p)}" y2="94" stroke="var(--muted)" /><text
          x="${X(10 ** p)}"
          y="110"
          font-size="10"
          text-anchor="middle"
          fill="var(--muted)"
          >10${superscript(p)} km</text
        >`,
    );
  const landmarks = [
    [KM.berlinMunich, marks.city],
    [KM.earth, marks.earth],
    [KM.moonReturn, marks.moon],
    [KM.sun, marks.sun],
    [KM.neptune, marks.nep],
    [KM.voyager, marks.voy],
  ].map(([v, label], i) => {
    const x = X(v),
      up = i % 2 === 0;
    return html`<line
        x1="${x}"
        y1="${up ? 64 : 96}"
        x2="${x}"
        y2="${up ? 84 : 128}"
        stroke="var(--ink)"
        stroke-dasharray="2 2"
      /><circle cx="${x}" cy="90" r="3.5" fill="var(--ink)" /><text
        x="${x}"
        y="${up ? 58 : 140}"
        font-size="11"
        text-anchor="middle"
        fill="var(--ink)"
        >${label}</text
      >`;
  });
  const cx = Math.min(X(km), x1),
    color = currentTopic().kind === "loss" ? "var(--loss)" : "var(--gain)";
  const anchor = cx > x1 - 80 ? "end" : cx < x0 + 80 ? "start" : "middle",
    label = `${t("youAreHere")}: ${f.big(km)} km`;
  svg.innerHTML = html`<line x1="${x0}" y1="90" x2="${x1}" y2="90" stroke="var(--muted)" stroke-width="1" />${ticks}${landmarks}
    <rect x="${x0}" y="86" width="${Math.max(0, cx - x0)}" height="8" fill="${color}" opacity=".85" /><path
      d="M${cx} 80 l-7 -12 h14 z"
      fill="${color}"
    />
    <text x="${cx}" y="22" font-size="12" font-weight="600" text-anchor="${anchor}" fill="${color}">${label}</text
    ><line x1="${cx}" y1="28" x2="${cx}" y2="66" stroke="${color}" />`;
  svg.setAttribute("aria-label", label);
}
