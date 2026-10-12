// DOM helpers: element lookup, safe HTML templates and the input-blocking busy overlay.

export const $ = (id) => document.getElementById(id);

// html`<b>${text}</b>` escapes every interpolated value, so names from the data files can never inject markup.
// Our own markup (nested html`` results, i18n strings with <b>) is passed through with raw(). Arrays are joined,
// null/undefined render as nothing, booleans as text (aria-pressed="false").
class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}
const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = (v) =>
  v == null
    ? ""
    : v instanceof SafeHtml
      ? v.value
      : Array.isArray(v)
        ? v.map(escape).join("")
        : String(v).replace(/[&<>"']/g, (c) => ENTITIES[c]);

// Line breaks in the templates are layout of the source only: next to a tag or a ${…} value they are dropped,
// between two words they become a space. So templates can be wrapped freely without changing the page.
const squeeze = (part) =>
  part.replace(/\s*\n\s*/g, (gap, at, all) =>
    at === 0 || at + gap.length === all.length || all[at - 1] === ">" || all[at + gap.length] === "<" ? "" : " ",
  );
const cache = new WeakMap(); // the static parts of a template literal are the same array on every call
export const html = (strings, ...values) => {
  if (!cache.has(strings)) cache.set(strings, strings.map(squeeze));
  const parts = cache.get(strings);
  return new SafeHtml(parts.reduce((out, s, i) => out + s + (i < values.length ? escape(values[i]) : ""), ""));
};
export const raw = (markup) => new SafeHtml(String(markup ?? ""));

/** Mask icon (see src/lib/icons.js); extra classes size and colour it. */
export const icon = (name, cls = "") => html`<span class="ico${cls ? " " + cls : ""} l-${name}" aria-hidden="true"></span>`;

// Runs a change behind an input-blocking overlay: the overlay is shown and painted first, then the work runs. It is
// removed after clicks queued during the work have landed on it, so nothing is triggered twice. The spinner only fades
// in when the work takes longer than a moment (see .busy in base.css).
let busyNow = false;
export function busy(work) {
  if (busyNow) return;
  busyNow = true;
  const overlay = $("busy");
  overlay.hidden = false;
  document.documentElement.setAttribute("aria-busy", "true");
  requestAnimationFrame(() =>
    setTimeout(() => {
      try {
        work();
      } finally {
        setTimeout(() => {
          overlay.hidden = true;
          document.documentElement.removeAttribute("aria-busy");
          busyNow = false;
        });
      }
    }),
  );
}

/** Calls fn at most once per frame (for sliders and typing). */
export function perFrame(fn) {
  let pending = false;
  return () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      fn();
    });
  };
}
