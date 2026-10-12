// "Dein Vergleich": the selected tiles as a dot chart on one linear scale, plus chips to remove them.
import { wrapLabel } from "../../lib/pure.js";
import { $, html } from "../dom.js";
import { state } from "../state.js";
import { fmt, t, tr } from "../text.js";
import { allShownKeys, countOf, unitByKey } from "../units.js";

/** Value and label of a unit for the chart: "305 × Mensa-Essen", "12 Stellen ein Jahr lang", groups with their items. */
function valueOf(u, amt) {
  const f = fmt(),
    c = countOf(u, amt),
    num = c < 1 ? f.nf(c, 2) : f.big(c);
  if (u.group) return { v: c, label: `${num} × ${tr(u.group.label)} (${f.big(c * u.group.size)} ${tr(u.group.item)})` };
  return { v: c, label: u.count ? `${num} ${tr(u.count)}` : `${num} × ${tr(u.name)}` };
}

export function renderCompare(amt) {
  const units = state.sel.map((key) => [key, unitByKey(key)]).filter(([, u]) => u);
  const rows = units
    .filter(([, u]) => u.topic?.id !== state.topic)
    .map(([key, u]) => ({ key, u, ...valueOf(u, amt) }))
    .filter((r) => r.v > 0)
    .sort((a, b) => b.v - a.v);
  const all = allShownKeys(amt);
  $("sel-all").textContent = all.every((k) => state.sel.includes(k)) ? t("selAllOff") : t("selAll");
  $("sel-count").textContent = t("selCount")(rows.length);
  $("sel-chips").innerHTML = html`${units.map(
    ([key, u]) =>
      html`<button
        type="button"
        class="selchip"
        data-action="unselect"
        data-key="${key}"
        aria-label="${t("selRemove")}: ${tr(u.name)}"
      >
        <span class="ico l-${u.icon}" aria-hidden="true"></span>${tr(u.name)}<span class="x"
          ><span class="ico l-x" aria-hidden="true"></span
        ></span>
      </button>`,
  )}`;
  $("sel-empty").hidden = rows.length > 0;
  $("sel-sep").hidden = $("dots-wrap").hidden = $("sel-clear").hidden = rows.length === 0;
  if (rows.length) drawDots(rows);
}

function drawDots(rows) {
  const f = fmt(),
    svg = $("dots");
  const maxV = Math.max(...rows.map((r) => r.v));
  // axis: a round step (1, 2, 2.5, 5 × 10^n) giving about five gridlines
  const rough = maxV / 5,
    mag = 10 ** Math.floor(Math.log10(rough)),
    step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= rough);
  const hi = Math.ceil(maxV / step) * step;
  const compact = rows.length > 10,
    W = 960,
    x0 = 280,
    x1 = 900,
    top = 54,
    rh = compact ? 38 : 50,
    H = top + rows.length * rh + 8,
    dr = compact ? 6 : 9;
  const X = (v) => x0 + (v / hi) * (x1 - x0);
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const grid = [];
  for (let v = 0; v <= hi + step / 2; v += step)
    grid.push(
      html`<line
          x1="${X(v)}"
          y1="${top - 8}"
          x2="${X(v)}"
          y2="${H}"
          stroke="var(--line)"
          ${v === 0 ? html` stroke-width="2"` : ""}
        /><text x="${X(v)}" y="14" font-size="10" text-anchor="middle" fill="var(--muted)">${v === 0 ? "0" : f.big(v)}</text>`,
    );

  const CHAR_W = 8.1; // JetBrains Mono at 13px ≈ 7.8px per character, plus the halo
  const marks = rows.map((r, i) => {
    const y = top + i * rh + rh / 2,
      x = X(r.v),
      name = tr(r.u.name),
      iconSize = compact ? 18 : 22;
    const tiny = x - x0 < 4 && r.v > 0;
    // Value label beside the dot: right of it when it fits (wrapping to two lines if needed), otherwise left of it
    // and above the line, so the stroke never runs through the text.
    const label = r.label + (tiny ? ` · ${t("tooSmall")}` : "");
    const roomR = W - 4 - (x + dr + 7),
      roomL = x - x0 + 6,
      fit = (room) => wrapLabel(label, Math.max(12, Math.floor(room / CHAR_W)));
    const linesR = fit(roomR),
      cutR = linesR.at(-1).endsWith("…");
    const right = label.length * CHAR_W <= roomR || (roomR >= 170 && !(cutR && roomL > roomR));
    const lines = right ? linesR : fit(roomL),
      lx = right ? x + dr + 7 : x + dr;
    const y0 = right ? (lines.length > 1 ? y - 3 : y + 5) : y - dr - 5 - (lines.length - 1) * 15;
    return html`<g class="rowlab" data-key="${r.key}" tabindex="0" role="button" aria-label="${t("selRemove")}: ${name}"
        ><rect x="-4" y="${y - rh / 2}" width="${x0 - 8}" height="${rh}" fill="transparent" />
        <g class="rm" data-action="unselect" data-key="${r.key}"
          ><circle cx="${x0 - 26}" cy="${y}" r="10" fill="var(--ink)" /><use
            href="#l-x"
            x="${x0 - 32}"
            y="${y - 6}"
            width="12"
            height="12"
            style="color:var(--paper)"
        /></g>
        <use
          href="#l-${r.u.icon}"
          x="0"
          y="${y - iconSize / 2}"
          width="${iconSize}"
          height="${iconSize}"
          style="color:var(--ink)"
        />
        <text x="32" y="${y + 5}" font-size="13" font-weight="600" fill="var(--ink)" style="font-family:var(--f-body)"
          >${name.length > 28 ? name.slice(0, 27) + "…" : name}</text
        ></g
      >
      <line x1="${x0}" y1="${y}" x2="${x}" y2="${y}" stroke="var(--kc)" stroke-width="3" stroke-linecap="round" /><circle
        cx="${x}"
        cy="${y}"
        r="${dr}"
        fill="var(--kc)"
      />
      <text
        x="${lx}"
        y="${y0}"
        font-size="13"
        font-weight="600"
        text-anchor="${right ? "start" : "end"}"
        fill="var(--ink)"
        stroke="var(--paper)"
        stroke-width="5"
        stroke-linejoin="round"
        paint-order="stroke"
        >${lines.map(
          (ln, j) =>
            html`<tspan
              x="${lx}"
              dy="${j ? 15 : 0}"
              ${j && tiny && ln.includes(t("tooSmall")) ? html` font-weight="400" fill="var(--muted)"` : ""}
              >${ln}</tspan
            >`,
        )}</text
      >`;
  });
  svg.innerHTML = html`${grid}${marks}`;
  svg.setAttribute("aria-label", rows.map((r) => `${tr(r.u.name)}: ${r.label}`).join("; "));
}
